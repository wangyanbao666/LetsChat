import { useRef } from "react";
import { useContext } from "react";
import { DataContext } from "../../common/dataContext";


// text bar + a send button
export default function InputBar(){
    const messageBoxRef = useRef(null)
    const {selectedUser, chatHistory, setChatHistory, websocket, userInfo} = useContext(DataContext);
	const { updateChatHistory } = useContext(DataContext);

    function handleInputKeyDown(event){
        if (event.key == "Enter"){
            sendMessage()
        }
    }

    function sendMessage(){
        // send to the backend
        let text = messageBoxRef.current.value
        if (text === ""){
            return;
        }
        if (websocket!==null){
            let message = {
                senderId: userInfo.id,
                receiverId: selectedUser.id,
                content: text,
            }
            updateChatHistory(message);
            messageBoxRef.current.value="";
        }
        else {
            alert("you are not connected to the server, please login again")
        }
    }   

    return (
        <div className="input-bar">
            <div className="send">
                <input type="text" className="messageBox" placeholder="Message" ref={messageBoxRef}  onKeyDown={handleInputKeyDown}></input>
                <button className="sendButton" onClick={sendMessage}>
                    send
                </button>
            </div>
        </div>
    )
}