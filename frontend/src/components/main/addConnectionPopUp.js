import { forwardRef, useContext, useRef } from "react"
import { DataContext } from "../common/dataContext"
import TopBar from "./topBar"
import config from "../../config"
import $ from "jquery"
import generateUuid from "../../utils/generateUuid"
import { updateConnection } from "../../utils/commonMethods"


const AddConnectionPopUp = forwardRef(({props},ref) =>{
    const {showAddConnectionPopUp, setShowAddConnectionPopUp, userInfo, setConnectionRequest} = useContext(DataContext);
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
            let invitation = {
                "uuid": generateUuid(),
                "senderName": userInfo.username,
                "receiverName": receiverName,
                "senderId": userInfo.id,
                "handled": 0,
            }
            // send to backend
            $.ajax({
                url: config.sendInvitationUrl,
                type: "POST",
                contentType: "application/json",
                data: JSON.stringify(invitation),
                success: function(result){
                    if (result.code == 200){
                        alert("You have sent invitation to: "+receiverName);
                        setConnectionRequest(previousConnectionRequest => updateConnection(previousConnectionRequest, invitation))
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