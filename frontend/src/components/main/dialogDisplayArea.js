import { useContext, useEffect, useRef } from "react";
import DialogBox from "./dialogBox";
import { DataContext } from "../common/dataContext";

export default function DialogDisplayArea(){
    const {selectedUser, chatHistory} = useContext(DataContext);
    const displayAreaRef = useRef(null);
    let chatWithCurUser = chatHistory[selectedUser.username];
    if (chatWithCurUser === undefined){
        chatWithCurUser = []
    } 
    useEffect(()=>{
        chatWithCurUser = chatHistory[selectedUser.username]
        console.log(chatWithCurUser)
        displayAreaRef.current.scrollTop = displayAreaRef.current.scrollHeight;
    },[chatHistory])

    useEffect(()=>{
        displayAreaRef.current.scrollTop = displayAreaRef.current.scrollHeight;
    },[selectedUser])

    return (
        <div className="dialog-display-area" ref={displayAreaRef}>
            {chatWithCurUser.map(chat => <DialogBox text={chat.text} self={chat.self}></DialogBox>)}
        </div>
    )
}