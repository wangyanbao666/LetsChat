import React, { createContext, useState, useEffect } from 'react';
import { Stomp } from "@stomp/stompjs";
import config from "../../config";
import { checkUserExistance, updateConnection } from '../../utils/commonMethods';

const DataContext = createContext();  
  
function DataProvider({ children }) { 
  const [data, setData] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userInfo, setUserInfo] = useState({});
  const [friends, setFriends] = useState([]);
  const [chatHistory, setChatHistory] = useState({});
  const [websocket, setWebsocket] = useState(null);
  const [unHandledConnectionNum, setUnHandledConnectionNum] = useState(0);
  const [connectionRequest, setConnectionRequest] = useState([
    {
      senderName: "default",
      handled: 0,
  },
    {
      senderName: "default1",
      handled: 1,
  },
    {
      senderName: "default2",
      handled: 2,
  }
  ,
    {
      senderName: "default2",
      handled: 2,
  }
  ,
    {
      senderName: "default2",
      handled: 2,
  }
  ,
    {
      senderName: "default2",
      handled: 2,
  }
  ]);
  const [showAddConnectionPopUp, setShowAddConnectionPopUp] = useState(false);
  const [showHandleConnectionPopUp, setShowHandleConnectionPopUp] = useState(false);
  const [numOfuUnseenMessage, setNumOfUnseenMessage] = useState({});

  const updateChatHistory = (id, content, self, senderId, receiverId, sendToServer) => {
    let message = {
      senderId: senderId,
      content: content,
      receiverId: receiverId,
  }
  if (sendToServer){
    websocket.send("/app/chat", {}, JSON.stringify(message));
  }
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
        setNumOfUnseenMessage(previousNumOfUnseenMessage => {
          let newNumOfUnseenMessage = {...previousNumOfUnseenMessage, [senderId]: previousNumOfUnseenMessage[senderId]===undefined ? 1 : previousNumOfUnseenMessage[senderId]+1}
          return newNumOfUnseenMessage;
        })
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
        numOfuUnseenMessage, setNumOfUnseenMessage}}>
          {children}
    </DataContext.Provider>
  );
}

export { DataContext, DataProvider };