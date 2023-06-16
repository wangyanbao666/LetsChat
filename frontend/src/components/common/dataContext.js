import React, { createContext, useState } from 'react';

const DataContext = createContext();

function DataProvider({ children }) {
  const [data, setData] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null)
  const [userInfo, setUserInfo] = useState({})
  const [friends, setFriends] = useState([])
  const [chatHistory, setChatHistory] = useState({})

  return (
    <DataContext.Provider value={{ data, setData, username, setUsername, password, setPassword, isLoggedIn, setIsLoggedIn, selectedUser, setSelectedUser, chatHistory, setChatHistory,
    userInfo, setUserInfo, friends, setFriends}}>
      {children}
    </DataContext.Provider>
  );
}

export { DataContext, DataProvider };