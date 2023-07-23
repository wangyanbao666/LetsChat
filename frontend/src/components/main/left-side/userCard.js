import { useContext, useEffect, useState, useRef } from "react"
import { DataContext } from "../../common/dataContext";
import $ from 'jquery'
import config from "../../../config";
import ChangeRemarkPopup from "../popups/changeRemarkPopup";

// including username, user status, user image and the last message
export default function UserCard(props){

    const {setSelectedUser, setFriends, userInfo, numOfuUnseenMessage, remarks} = useContext(DataContext)
    const user = props.user;
    const onClick = props.onClick;
    const inChat = props.inChat;
    const imageLink = user.image==null ? "/imgs/selfie-place-holder.jpg" : user.image;
    const [unseenMessagesCount, setUnseenMessagesCount] = useState(numOfuUnseenMessage[user.id]);
    const [expanded, setExpanded] = useState(false);
    const [showRemarkPopup, setShowRemarkPopup] = useState(false);
    const expandRef = useRef(null);
    const changeRemarkRef = useRef(null);
    const screen = document.getElementsByClassName("main-content");
    
    const handleClick = () => {
        if (inChat){
            setSelectedUser(user);
            onClick(user.id);
        }
      };

    const expand = () => {
        setExpanded(true)
    }

    const deleteConnection = () => {
        $.ajax({
            url: config.deleteConnectionUrl,
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({
                user1: userInfo,
                user2: user
            }),
            success: function(data){
                if (data.code===200){
                    alert("You have deleted the connection")
                    setFriends((prevFriends) => {
                        let prevFriendsCopy = [...prevFriends];
                        for (let i=0;i<prevFriends.length;i++){
                            if (prevFriends[i].id == user.id){
                                prevFriendsCopy.splice(i, 1);
                            }
                        }
                        return prevFriendsCopy;
                    })
                }
                else {
                    alert("The server is busy now, please try again later")
                }
            }
        })
    }

    const startChat = () => {
        setSelectedUser(user);
    }

    const changeRemarkHandler = () => {
        setShowRemarkPopup(true)
    }

    useEffect(() => {
        setUnseenMessagesCount(numOfuUnseenMessage[user.id])
    }, [numOfuUnseenMessage])

    useEffect(() => {
        const handleClickOutside = (event) => {   
            if (expandRef.current && !expandRef.current.contains(event.target)) {
                setExpanded(false);
            }
            if (changeRemarkRef.current && !changeRemarkRef.current.contains(event.target)){
                setShowRemarkPopup(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
          document.removeEventListener('mousedown', handleClickOutside);
        };
      }, []);

    return (
        <div className={`user-card ${props.selected? "selected":""}`}>
            <img src={imageLink} className="user-card-img"></img>
            <div className="text-region" onClick={handleClick}>
                <div className="username">{remarks[user.id]!==undefined && remarks[user.id]!=="" ? remarks[user.id] : user.username}</div>
                <div className="lastmessage">{props.lastMessage}</div>
            </div>
            {inChat && unseenMessagesCount>0 && <div className="new-message-indication">{unseenMessagesCount}</div>}
            {!inChat && !expanded && <div className="expand" onClick={expand}>
                <div className="menu-icon">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>}
            {!inChat && expanded && <div className="expanded-area" ref={expandRef}>
                    <div onClick={deleteConnection} className="user-expand-button">Delete</div>
                    <div onClick={startChat} className="user-expand-button">Chat</div>
                    <div onClick={changeRemarkHandler} className="user-expand-button">Change Remark</div>
                </div>}
            {showRemarkPopup && <ChangeRemarkPopup ref={changeRemarkRef} setShowRemarkPopup={setShowRemarkPopup} id={user.id} username={user.username}></ChangeRemarkPopup>}
        </div>
    )
}