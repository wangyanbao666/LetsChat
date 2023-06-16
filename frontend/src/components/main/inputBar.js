import { useRef } from "react";
import { useContext } from "react";
import { DataContext } from "../common/dataContext";

// text bar + a send button
export default function InputBar(){
    const messageBoxRef = useRef(null)
    const {selectedUser, chatHistory, setChatHistory} = useContext(DataContext);
    let chatWithCurUser = chatHistory[selectedUser.username];

    function sendMessage(event){
        event.preventDefault();
        // send to the backend
        let text = messageBoxRef.current.value
        if (text === ""){
            return;
        }
        const newChat = [...chatWithCurUser, { text: text, self: true }];
        setChatHistory(chatHistory => ({
            ...chatHistory,
            [selectedUser.username]: newChat
        }));
        messageBoxRef.current.value="";

    }   
    return (
        <div className="input-bar">
            <div className="send">
                <input type="text" className="messageBox" placeholder="Message" ref={messageBoxRef}></input>
                <button type="submit" className="sendButton" onClick={sendMessage}>
                    send
                </button>
            </div>
        </div>
    )
}