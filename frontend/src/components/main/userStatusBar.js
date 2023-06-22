import { useContext, useEffect } from "react";
import { DataContext } from "../common/dataContext";
import { useState } from "react";

export default function UserStatusBar(){
    const {selectedUser, setSelectedUser} = useContext(DataContext);
    useEffect(() => {
        // This code will run whenever selectedUserId changes
        // Place the code you want to auto reload here
        // console.log('UserStatusBar reloaded!');
      }, [selectedUser]);

    const imageLink = selectedUser.image==null ? "/imgs/selfie-place-holder.jpg" : selectedUser.image;

    return (
        <div className="user-statusbar">
            <img src={imageLink} className="user-statusbar-img"></img>
            <div className="user-statusbar-text-region">
                <div className="username">{selectedUser.username}</div>
                <div>{selectedUser.status===0 ? "offline" : "online"}</div>
            </div>
        </div>
    )
}