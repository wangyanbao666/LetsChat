// put up everything under this folder
// send request to backend to get user information, friends information and chat history

import { useContext, useEffect } from "react";
import DialogArea from "./dialogArea";
import DialogBox from "./dialogBox";
import TopBar from "./topBar";
import UserList from "./userList";
import { DataContext } from "../common/dataContext";

export default function Screen(){
    const {userInfo, setUserInfo} = useContext(DataContext);
    const {friends, setFriends} = useContext(DataContext);
    const {chatHistory, setChatHistory} = useContext(DataContext);

    useEffect(() => {
        setFriends([
            {"id": 1, "username": "wyb", "image": null, "status": "online"},
            {"id": 2, "username": "abc", "image": null, "status": "offline"}
        ]);

        const chatHistoryData = {
            "wyb": [
                {"text": "hello", "self": false},
                {"text": "nice to meet you", "self": true}
            ],
            "abc": [
                {"text": "nice to meet you", "self": false},
                {"text": "hello", "self": true}
            ],
        };
        setChatHistory(chatHistoryData);
    }, []);

    // useEffect(() => {
    //     setFriends([{"id":1,"username":"wyb", "image":null, "status":"online"}, {"id":2,"username":"abc", "image":null, "status":"offline"}])
    //     let chatHis = {
    //         "wyb": [{"text": "hello", "self":false}, {"text": "nice to meet you", "self":true}],
    //         "abc": [{"text": "nice to meet you", "self":false}, {"text": "hello", "self":true}],
    //     }
    //     setChatHistory(chatHis);
    // })

    return (
        <div className="screen">
            <TopBar></TopBar>
            <div className="main-content">
                <UserList></UserList>
                <DialogArea></DialogArea>
            </div>
        </div>
    )
}