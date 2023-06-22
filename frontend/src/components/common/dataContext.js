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


  const updateChatHistory = (id, content, senderId) => {
    let chatWithCurUser = chatHistory[id];
    if (chatWithCurUser === undefined){
      chatWithCurUser = []
    }
    const newChat = [...chatWithCurUser, { content: content, senderId: senderId, receiverId: id }];
    setChatHistory((chatHistory) => ({
      ...chatHistory,
      [id]: newChat,
    }));
  }


  const setupConnection = () => {
    const userId = userInfo.id;
    if (userId === undefined){
      return;
    }
    let websocket = new WebSocket(config.websocketUrl);
    let stompClient = Stomp.over(websocket);
    stompClient.connect({}, function(frame) {
      console.log('Connected: ' + frame);
      stompClient.subscribe(`/queue/${userId}/chat`, function(data) {
        let message = data.body;
        let senderId = message.senderId;
        let receiveId = message.receiveId;
        let content = message.content;
        updateChatHistory(senderId, content, receiveId);
      });
    });
    setWebsocket(stompClient);
  }

  useEffect(() => {
    // setup connection when the userId changes
    setupConnection();
  }, [userInfo]);

  return (
    <DataContext.Provider value={{ data, setData, username, setUsername, password, setPassword, isLoggedIn, setIsLoggedIn, selectedUser, setSelectedUser, chatHistory, setChatHistory,
    userInfo, setUserInfo, friends, setFriends, websocket, setWebsocket, updateChatHistory}}>
      {children}
    </DataContext.Provider>
  );
}

export { DataContext, DataProvider };