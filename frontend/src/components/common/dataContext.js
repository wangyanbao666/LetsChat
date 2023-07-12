import React, { createContext, useState, useEffect, useRef } from 'react';
import { Stomp } from "@stomp/stompjs";
import config from "../../config";
import { checkUserExistance, updateConnection } from '../../utils/commonMethods';
import $ from 'jquery'

const DataContext = createContext();  
  
function DataProvider({ children }) { 
  const [data, setData] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userInfo, setUserInfo] = useState({});
  const [friends, setFriends] = useState([]);
  const [friendsForChat, setFriendsForChat] = useState([]);
  const [chatHistory, setChatHistory] = useState({});
  const [websocket, setWebsocket] = useState(null);
  const [unHandledConnectionNum, setUnHandledConnectionNum] = useState(0);
  const [connectionRequest, setConnectionRequest] = useState([]);
  const [showAddConnectionPopUp, setShowAddConnectionPopUp] = useState(false);
  const [showHandleConnectionPopUp, setShowHandleConnectionPopUp] = useState(false);
  const [numOfuUnseenMessage, setNumOfUnseenMessage] = useState({});

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

  const updateChatHistory = (id, content, self, senderId, receiverId, sendToServer) => {
    let message = {
      senderId: senderId,
      content: content,
      receiverId: receiverId,
    }
    if (sendToServer){
      websocket.send("/app/chat", {}, JSON.stringify(message));
    }

    let friendId;
    if (self){
      friendId = receiverId;
    }
    else {
      friendId = senderId;
    }

    setFriendsForChat(previousFriendsOrigin => {
      let previousFriends = [...previousFriendsOrigin]
      let friend = null;
      for (let i = 0; i < previousFriends.length; i++) {
        let f = previousFriends[i];
        if (f.id === friendId) {
          if (i==0){
            return previousFriends;
          }
          let friendList = previousFriends.splice(i, 1);
          friend = friendList[0];
          break;
        }
      }
      let newFriends;
      if (friend !== null) {
        newFriends = [friend, ...previousFriends];
      } else {
        newFriends = previousFriends;
      }
      return newFriends;
    })

    setChatHistory(prevChatHistory => {
      let chatWithCurUser = prevChatHistory[id] || [];
      const newChat = [...chatWithCurUser, { content: content, self: self}];
      return {
        ...prevChatHistory,
        [id]: newChat,
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
    stompClient.connect({}, function(frame) {
      stompClient.subscribe(`/queue/${userId}/chat`, function(data) {
        let messageString = data.body;
        let message = JSON.parse(messageString);
        let senderId = message.senderId;
        let receiverId = message.receiverId;
        let content = message.content;
        updateChatHistory(senderId, content, false, senderId, receiverId, false);
        setUnseenMessage(senderId)
        
      });
      stompClient.subscribe(`/queue/${userId}/invitation`, function(data) {
        let invitationString = data.body;
        let invitation = JSON.parse(invitationString);
        console.log(invitation)
        setUnHandledConnectionNum(unHandledConnectionNum+1);
        setConnectionRequest(previousConnectionRequest => updateConnection(previousConnectionRequest, invitation))
      })
      stompClient.subscribe(`/queue/${userId}/invitation/result`, function(data){
        let invitationRequestString = data.body;
        let invitationRequest = JSON.parse(invitationRequestString);
        console.log(invitationRequest);
        let invitation = invitationRequest.connection;
        let user = invitationRequest.user;
        setConnectionRequest(previousConnectionRequest => updateConnection(previousConnectionRequest, invitation))
        if (invitation.handled==1){
          if (!checkUserExistance(friends, user)){
            setFriends(previousFriend => {
              return [user, ...previousFriend]
            });
          }
        }
      })
    });
    setWebsocket(stompClient);
  }

  const setupRabbitmqConnection = () => {
    const username = userInfo.username;
    if (username === undefined){
      return;
    }
    
  }


  useEffect(() => {
    // setup connection when the userId changes
    setupWebsocketConnection();
  }, [userInfo]);

  return (
    <DataContext.Provider value={{ data, setData, username, setUsername, password, setPassword, isLoggedIn, setIsLoggedIn, selectedUser, setSelectedUser, chatHistory, setChatHistory,
        userInfo, setUserInfo, friends, setFriends, websocket, setWebsocket, updateChatHistory, showAddConnectionPopUp, setShowAddConnectionPopUp, 
        showHandleConnectionPopUp, setShowHandleConnectionPopUp, connectionRequest, setConnectionRequest, unHandledConnectionNum, setUnHandledConnectionNum,
        numOfuUnseenMessage, setNumOfUnseenMessage, friendsForChat, setFriendsForChat}}>
          {children}
    </DataContext.Provider>
  );
}

export { DataContext, DataProvider };