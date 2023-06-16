import { useContext, useState } from "react"
import { DataContext } from "../common/dataContext";

// including username, user status, user image and the last message
export default function UserCard(props){

    const {selectedUser, setSelectedUser} = useContext(DataContext)
    
    const user = props.user;
    const onClick = props.onClick;
    const imageLink = user.image==null ? "/imgs/selfie-place-holder.jpg" : user.image;
    const handleClick = () => {
        onClick(user.id);
        setSelectedUser(user);
      };
    return (
        <div className={`user-card ${props.selected? "selected":""}`}>
            <img src={imageLink} className="user-card-img"></img>
            <div className="text-region" onClick={handleClick}>
                <div className="username">{user.username}</div>
                <div>{props.lastMessage}</div>
            </div>
        </div>
    )
}