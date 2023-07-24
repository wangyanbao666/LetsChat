import { useContext } from "react";
import { DataContext } from "../../common/dataContext";
import $ from 'jquery'
import config from "../../../config";
import generateUuid from "../../../utils/generateUuid";
import { updateConnection } from "../../../utils/commonMethods"


export default function AddConnectionUserCard(props){
    const {userInfo, setShowAddConnectionPopUp, setConnectionRequest} = useContext(DataContext)
    let receiverName = props.username
    function sendInvitation(){
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
                    setShowAddConnectionPopUp(false);
                    setConnectionRequest(previousConnectionRequest => updateConnection(previousConnectionRequest, invitation))
                }
                else {
                    alert(result.message);
                }
            }
        })
    }
    return(
        <div className="user-card" onClick={sendInvitation}>
            <img src={props.imgSrc} className="user-card-img"></img>
            <div>{props.username}</div>

        </div>
    )
}