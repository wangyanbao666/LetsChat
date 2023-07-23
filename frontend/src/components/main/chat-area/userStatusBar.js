import { useContext, useEffect, useState } from "react";
import { DataContext } from "../../common/dataContext";

export default function UserStatusBar(){
    const {selectedUser, friends, remarks} = useContext(DataContext);
    const [status, setStatus] = useState(selectedUser.status);

    useEffect(() => {
        console.log("detect change in friends")
        console.log(friends)
        if (selectedUser!=null){
            for (let friend of friends){
                if (friend.id == selectedUser.id){
                    setStatus(friend.status)
                }
            }
        }
    }, [friends, selectedUser])

    const imageLink = selectedUser.image==null ? "/imgs/selfie-place-holder.jpg" : selectedUser.image;

    return (
        <div className="user-statusbar">
            <img src={imageLink} className="user-statusbar-img"></img>
            <div className="user-statusbar-text-region">
                <div className="username">{remarks[selectedUser.id]!==undefined && remarks[selectedUser.id]!=="" ? remarks[selectedUser.id] :selectedUser.username}</div>
                <div>{status===0 ? "offline" : "online"}</div>
            </div>
        </div>
    )
}