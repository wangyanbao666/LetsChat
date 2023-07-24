import React, { createContext, useState, useEffect, useRef } from 'react';
import { Stomp } from "@stomp/stompjs";
import config from "../../config";
import { checkUserExistance, getUserTimeZone, updateConnection } from '../../utils/commonMethods';
import $ from 'jquery'
import { compareByName } from '../../utils/compareMethods';

const DataContext = createContext();  
  
function DataProvider({ children }) { 
  const [data, setData] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userInfo, setUserInfo] = useState({});
  const [friends, setFriends] = useState([]);
  const [remarks, setRemarks] = useState({})
  const [friendsForChat, setFriendsForChat] = useState([]);
  const [chatHistory, setChatHistory] = useState({});
  const [websocket, setWebsocket] = useState(null);
  const [unHandledConnectionNum, setUnHandledConnectionNum] = useState(0);
  const [connectionRequest, setConnectionRequest] = useState([]);
  const [showAddConnectionPopUp, setShowAddConnectionPopUp] = useState(false);
  const [showHandleConnectionPopUp, setShowHandleConnectionPopUp] = useState(false);
  const [showChangeProfilePopup, setShowChangeProfilePopup] = useState(false)
  const [numOfuUnseenMessage, setNumOfUnseenMessage] = useState({});
  const [timeZone] = useState(getUserTimeZone())

  const selectedUserRef = useRef();
  selectedUserRef.current = selectedUser;

  const seeMessage = () => {
    if (selectedUser===null){
      return;
    }
    if (numOfuUnseenMessage[selectedUser.id]>0){
      $.ajax({
          url: config.updateMessageSeenUrl,
          method: "POST",
          contentType: "application/json",
          data: JSON.stringify({
              receiverId: userInfo.id,
              senderId: selectedUser.id,
          }),
          success: function(result){
              if (result.code==200){
                  setNumOfUnseenMessage(previousNumOfUnseenMessage => {
                      let id = selectedUser.id;
                      let newNumOfUnseenMessage = {...previousNumOfUnseenMessage, [id]:0};
                      console.log(newNumOfUnseenMessage);
                      return newNumOfUnseenMessage;
                  })
              }
          }
      })
    }
  }

  const setUnseenMessage = (senderId) => {
    let curUser = selectedUserRef.current;
    if (curUser===null || senderId!=curUser.id){
      setNumOfUnseenMessage(previousNumOfUnseenMessage => {
        let newNumOfUnseenMessage = {...previousNumOfUnseenMessage, [senderId]: previousNumOfUnseenMessage[senderId]===undefined ? 1 : previousNumOfUnseenMessage[senderId]+1}
        return newNumOfUnseenMessage;
      })
    }
    else {
      $.ajax({
        url: config.updateMessageSeenUrl,
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify({
            receiverId: userInfo.id,
            senderId: curUser.id,
        }),
      })
    }
  }

  useEffect(()=>{
    seeMessage()
  }, [selectedUser])

  useEffect(() => {
    console.log("unhandled num: "+unHandledConnectionNum)
  }, [unHandledConnectionNum])

  useEffect(() => {
    if (websocket!=null){
      const handlers = []
      const handleChange = (data) => {
        let userStatusString = data.body;
        let userStatus = JSON.parse(userStatusString);
        let userId = userStatus.id
        let status = userStatus.status

        const updatedFriends = friends.map((friend) =>
          friend.id === userId ? { ...friend, status: status } : friend
        );
        console.log(updatedFriends)
        setFriends(updatedFriends);
        // setFriends(prevFriends => {
        //   for (let friend of prevFriends){
        //     if (friend.id == userId){
        //       friend.status = status;
        //     }
        //   }
        //   return prevFriends
        // })
      }
      for (let friend of friends){
        handlers.push(websocket.subscribe(`/queue/${friend.id}/status`, handleChange))
      }
      return () => {
        for (let handler of handlers){
          handler.unsubscribe();
        }
      };
    }
  }, [websocket, friends])

  useEffect(() => {
    if (websocket==null){
      return;
    }
    const subscriptions = []; // Maintain a list of subscriptions
    const userId = userInfo.id;
    const chatHandler = function(data) {
      let messageString = data.body;
      let message = JSON.parse(messageString);
      console.log(message)
      updateLocalChatHistory(false, message, true);
      setUnseenMessage(message.senderId)
    }

    const chatConfirmHandler = function(data) {
      let commonResultString = data.body;
      let commonResult = JSON.parse(commonResultString);
      let code = commonResult.code;
      let message = commonResult.data;
      console.log(message)
      updateLocalChatHistory(true, message, code===200)
    }

    const invitationHandler = function(data) {
      let invitationString = data.body;
      let invitation = JSON.parse(invitationString);
      setUnHandledConnectionNum(unHandledConnectionNum+1);
      setConnectionRequest(previousConnectionRequest => updateConnection(previousConnectionRequest, invitation))
    }

    const invitationAcceptHandler = function(data){
      let invitationRequestString = data.body;
      let invitationRequest = JSON.parse(invitationRequestString);
      let invitation = invitationRequest.connection;
      let user = invitationRequest.user;
      setConnectionRequest(previousConnectionRequest => updateConnection(previousConnectionRequest, invitation))
      if (invitation.handled==1){
        if (!checkUserExistance(friends, user)){
          setFriends(previousFriends => {
            let newFriends = [user, ...previousFriends];
            newFriends.sort((a, b) => compareByName(a.username, b.username));
            return newFriends;
          });
        }
      }
    }
    
    const subscribeChat = websocket.subscribe(`/queue/${userId}/chat`, chatHandler);
    const subscribeChatConfirm = websocket.subscribe(`/queue/${userId}/chat/confirm`, chatConfirmHandler);
    const subscribeInvitation = websocket.subscribe(`/queue/${userId}/invitation`, invitationHandler)
    const subscribeInvitationHandle = websocket.subscribe(`/queue/${userId}/invitation/result`, invitationAcceptHandler)

    return () => {
      subscribeChat.unsubscribe();
      subscribeChatConfirm.unsubscribe();
      subscribeInvitation.unsubscribe();
      subscribeInvitationHandle.unsubscribe();
    };
  }, [websocket, friends])

  const updateChatHistory = ( message) => {
      websocket.send("/app/chat", {}, JSON.stringify(message));
  }


  const updateLocalChatHistory = (self, message, success) => {
    let receiverId = message.receiverId;
    let senderId = message.senderId;
    let datetime = message.datetime;
    let content = message.content
    let friendId;
    if (self){
      friendId = receiverId;
    }
    else {
      friendId = senderId;
    }
    let friend = null;
    for (let f of friends){
      if (f.id == friendId){
        friend = f;
        break;
      }
    }
    setFriendsForChat(previousFriendsOrigin => {
      let previousFriends = [...previousFriendsOrigin]
      for (let i = 0; i < previousFriends.length; i++) {
        let f = previousFriends[i];
        if (f.id === friendId) {
          if (i==0){
            return previousFriends;
          }
          previousFriends.splice(i, 1);
          break;
        }
      }
    
      let newFriends;
      if (friend!=null){
        console.log(friend)
        newFriends = [friend, ...previousFriends];
      }
      else {
        newFriends = previousFriends;
      }
      return newFriends;
    })

    setChatHistory(prevChatHistory => {
      let chatWithCurUser = prevChatHistory[friendId] || [];
      const newChat = [...chatWithCurUser, { content: content, datetime: datetime, self: self, success: success}];
      return {
        ...prevChatHistory,
        [friendId]: newChat,
      };
    });
  }


  const setupWebsocketConnection = () => {
    const userId = userInfo.id;
    if (userId === undefined){
      return;
    }
    let websocket = new WebSocket(config.websocketUrl);
    let stompClient = Stomp.over(websocket);
    const headers = {
      'userId': userId,
    };
    stompClient.connect(headers, function(frame) {
      setWebsocket(stompClient);
    });
  }

  const changeRemark = (friendId, remark) => {
    $.ajax({
      url: config.addRemarkUrl,
      method: "POST",
      contentType: "application/json",
      data: JSON.stringify(
        {
          userId: userInfo.id,
          friendId: friendId,
          remark: remark
        }
      ),
      success: function(result){
        let statusCode = result.code;
        if (statusCode == 200){
          const updatedRemarks = { ...remarks };
          updatedRemarks[friendId] = remark;
          setRemarks(updatedRemarks)
          if (selectedUser!==null && selectedUser.id==friendId){
            const newSelectedUser = {...selectedUser}
            newSelectedUser.remark = remark
            setSelectedUser(newSelectedUser)
          }
        }
      }
    })
  }

  const changeUsername = (newUsername) => {
      let curUserInfo = {...userInfo}
      curUserInfo.username = newUsername
      $.post({
        url: config.changeUsernameUrl,
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify(curUserInfo),
        success: function(result){
          let statusCode = result.code
          if (statusCode === 200){
            setUserInfo(curUserInfo)
            alert(`Your username has been changed to ${newUsername}`)
          }
          else if (statusCode === 400){
            alert("The username has been used, please choose another username")
          }
        }
      })
  }


  useEffect(() => {
    // setup connection when the userId changes
    setupWebsocketConnection();
  }, [isLoggedIn]);

  return (
    <DataContext.Provider value={{ data, setData, username, setUsername, password, setPassword, isLoggedIn, setIsLoggedIn, selectedUser, setSelectedUser, chatHistory, setChatHistory,
        userInfo, setUserInfo, friends, setFriends, websocket, setWebsocket, updateChatHistory, showAddConnectionPopUp, setShowAddConnectionPopUp, 
        showHandleConnectionPopUp, setShowHandleConnectionPopUp, connectionRequest, setConnectionRequest, unHandledConnectionNum, setUnHandledConnectionNum,
        numOfuUnseenMessage, setNumOfUnseenMessage, friendsForChat, setFriendsForChat, timeZone, remarks, setRemarks, changeRemark, showChangeProfilePopup, setShowChangeProfilePopup,
        changeUsername}}>
          {children}
    </DataContext.Provider>
  );
}

export { DataContext, DataProvider };