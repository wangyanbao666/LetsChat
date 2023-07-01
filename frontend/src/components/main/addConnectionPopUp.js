import { forwardRef, useContext, useRef } from "react"
import { DataContext } from "../common/dataContext"
import TopBar from "./topBar"
import config from "../../config"
import $ from "jquery"


const AddConnectionPopUp = forwardRef(({props},ref) =>{
    const {showAddConnectionPopUp, setShowAddConnectionPopUp, userInfo} = useContext(DataContext);
    const inputRef = useRef(null);

    const handleInputKeyDown = (event) => {
        if (event.key === 'Enter') {
            sendInvitation();
        }
    };

    function sendInvitation(){
        if (inputRef.current.value !== ""){
            setShowAddConnectionPopUp(false);
            let receiverName = inputRef.current.value
            let connectionRequest = {
                "senderName": userInfo.username,
                "receiverName": receiverName,
                "senderId": userInfo.id
            }
            // send to backend
            $.ajax({
                url: config.sendInvitationUrl,
                type: "POST",
                contentType: "application/json",
                data: JSON.stringify(connectionRequest),
                success: function(result){
                    if (result.code == 200){
                        alert("You have sent invitation to: "+receiverName);
                    }
                    else {
                        alert(result.message);
                    }
                }
            })
            
        }
    }

    return (
        <div className="add-connection-popup" ref={ref}>
            <input type="text" placeholder="search username" className="usersearchbar" ref={inputRef} tabIndex={0} onKeyDown={handleInputKeyDown}></input>
            <button className="send-invitation" onClick={sendInvitation}>Send Invitation</button>
        </div> 
    )
})

export default AddConnectionPopUp