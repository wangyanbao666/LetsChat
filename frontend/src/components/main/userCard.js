import { useContext, useEffect, useState } from "react"
import { DataContext } from "../common/dataContext";
import $ from 'jquery'
import config from "../../config";

// including username, user status, user image and the last message
export default function UserCard(props){

    const {selectedUser, setSelectedUser, chatHistory, userInfo, numOfuUnseenMessage, setNumOfUnseenMessage} = useContext(DataContext)
    const user = props.user;
    const onClick = props.onClick;
    const imageLink = user.image==null ? "/imgs/selfie-place-holder.jpg" : user.image;
    const [unseenMessagesCount, setUnseenMessagesCount] = useState(numOfuUnseenMessage[user.id]);

    
    const handleClick = () => {
        if (unseenMessagesCount>0){
            $.ajax({
                url: config.updateMessageSeenUrl,
                method: "POST",
                contentType: "application/json",
                data: JSON.stringify({
                    receiverId: userInfo.id,
                    senderId: user.id,
                }),
                success: function(result){
                    if (result.code==200){
                        setNumOfUnseenMessage(previousNumOfUnseenMessage => {
                            let id = user.id;
                            let newNumOfUnseenMessage = {...previousNumOfUnseenMessage, [id]:0};
                            console.log(newNumOfUnseenMessage);
                            return newNumOfUnseenMessage;
                        })
                    }
                }
            })
        }
        onClick(user.id);
        setSelectedUser(user);
      };

    useEffect(() => {
        setUnseenMessagesCount(numOfuUnseenMessage[user.id])
    }, [numOfuUnseenMessage])
    return (
        <div className={`user-card ${props.selected? "selected":""}`}>
            <img src={imageLink} className="user-card-img"></img>
            <div className="text-region" onClick={handleClick}>
                <div className="username">{user.username}</div>
                <div>{props.lastMessage}</div>
            </div>
            {unseenMessagesCount>0 && <div className="new-message-indication">{unseenMessagesCount}</div>}
        </div>
    )
}