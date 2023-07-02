import { useContext, useState } from "react";
import $ from "jquery";
import config from "../../config";
import { DataContext } from "../common/dataContext";

export default function ConnectionRequestCard(props){
    const invitation = props.invitation;
    const [handled, setHandled] = useState(invitation.handled);
    const {friends, setFriends, updateChatHistory, userInfo} = useContext(DataContext);
    const imageLink = invitation.senderImageUrl==null ? "/imgs/selfie-place-holder.jpg" : invitation.senderImageUrl;
    
    function accept(){
        invitation.handled = 1;
        $.ajax({
            url: config.handleInvitationUrl,
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(invitation),
            success: (result) => {
                if (result.code == 200){
                    setHandled(1)
                    let newConnection = result.data
                    setFriends((previousFriends) => {
                        const newFriends = [...previousFriends, newConnection];
                        return newFriends;
                    })
                    updateChatHistory(newConnection.id, `Hi I'm ${userInfo.username}`, true, userInfo.id, newConnection.id)
                    alert("Accepted");
                }
                else {
                    alert(result.message)
                }
            }
        })
    }

    function reject(){
        invitation.handled = 2;
        $.ajax({
            url: config.handleInvitationUrl,
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(invitation),
            success: (result) => {
                if (result.code == 200){
                    setHandled(2)
                    alert("Rejected");
                }
                else {
                    alert(result.message)
                }
            }
        })
    }
    
    return (
        <div className="connection-request-card">
            <img src={imageLink} className="user-card-img"></img>
            <div className="username">{invitation.senderName}</div>
            {handled==0 && <button className="accept" onClick={accept}>accept</button>}
            {handled==0 && <button className="refuse" onClick={reject}>reject</button>}
            {handled==1 && <div className="display-text">Accepted</div>}
            {handled==2 && <div className="display-text">Rejected</div>}
            
        </div>
    )
}