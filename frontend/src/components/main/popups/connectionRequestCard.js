import { useContext, useState } from "react";
import $ from "jquery";
import config from "../../../config";
import { DataContext } from "../../common/dataContext";
import { checkUserExistance } from "../../../utils/commonMethods";
import { compareByName } from "../../../utils/compareMethods";

export default function ConnectionRequestCard(props){
    const invitation = props.invitation;
    const [handled, setHandled] = useState(invitation.handled);
    const {friends, setFriends, updateChatHistory, userInfo, unHandledConnectionNum, setUnHandledConnectionNum} = useContext(DataContext);
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
                    if (!checkUserExistance(friends, newConnection)){
                        console.log("user not exisit")
                        setFriends(previousFriends => {
                          let newFriends = [newConnection, ...previousFriends];
                          newFriends.sort((a, b) => compareByName(a.username, b.username));
                          return newFriends;
                        });
                      }
                    // updateChatHistory(newConnection.id, `Hi I'm ${userInfo.username}`, true, userInfo.id, newConnection.id, true)
                    setUnHandledConnectionNum(unHandledConnectionNum-1);
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
                    setUnHandledConnectionNum(unHandledConnectionNum-1);
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
            <div className="username">{invitation.senderName==userInfo.username ? invitation.receiverName : invitation.senderName}</div>
            {handled==0 && invitation.senderId!=userInfo.id && <button className="accept" onClick={accept}>accept</button>}
            {handled==0 && invitation.senderId!=userInfo.id && <button className="refuse" onClick={reject}>reject</button>}
            {handled==0 && invitation.senderId==userInfo.id && <div className="display-text">Sent</div>}
            {handled==1 && <div className="display-text">Accepted</div>}
            {handled==2 && <div className="display-text">Rejected</div>}
            
        </div>
    )
}