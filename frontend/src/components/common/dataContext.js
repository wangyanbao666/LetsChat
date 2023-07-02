import React, { createContext, useState, useEffect } from 'react';
import { Stomp } from "@stomp/stompjs";
import config from "../../config";

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


  const updateChatHistory = (id, content, self, senderId, receiverId) => {
    let message = {
      senderId: senderId,
      content: content,
      receiverId: receiverId,
  }
    websocket.send("/app/chat", {}, JSON.stringify(message));
    setChatHistory(prevChatHistory => {
      let chatWithCurUser = prevChatHistory[id] || [];
      const newChat = [...chatWithCurUser, { content: content, self: self}];
      return {
        ...prevChatHistory,
        [id]: newChat,
      };
    });
  }

  useEffect(() => {
    console.log(chatHistory);
  }, [chatHistory]);


  const setupWebsocketConnection = () => {
    const userId = userInfo.id;
    if (userId === undefined){
      return;
    }
    let websocket = new WebSocket(config.websocketUrl);
    let stompClient = Stomp.over(websocket);
    stompClient.connect({}, function(frame) {
      console.log('Connected: ' + frame);
      stompClient.subscribe(`/queue/${userId}/chat`, function(data) {
        let messageString = data.body;
        let message = JSON.parse(messageString);
        let senderId = message.senderId;
        let receiverId = message.receiverId;
        let content = message.content;
        updateChatHistory(senderId, content, false, senderId, receiverId);
      });
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
    showHandleConnectionPopUp, setShowHandleConnectionPopUp, connectionRequest, setConnectionRequest}}>
      {children}
    </DataContext.Provider>
  );
}

export { DataContext, DataProvider };