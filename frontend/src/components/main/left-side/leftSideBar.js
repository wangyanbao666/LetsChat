import { useRef, useState } from "react";
import UserList from "./chatUserList";
import ConnectionList from "./connectionsList";

export default function LeftSideBar(){
    const [isChat, setIsChat] = useState(true);
    const userListRef = useRef(null)
    const connectionListRef = useRef(null);

    const swicthToChat = () => {
        setIsChat(true);
    }

    const swicthToConnections = () => {
        setIsChat(false);
    }

    return (
        <div className="left-side-bar">
            <div className="toggle-bar">
                <button onClick={swicthToChat}>chat</button>
                <button onClick={swicthToConnections}>connections</button>
            </div>
            {isChat && <UserList></UserList>}
            {!isChat && <ConnectionList></ConnectionList>}
            {/* <div ref={userListRef} className="active"><UserList></UserList></div>
            <div ref={connectionListRef} className="slide-right"><ConnectionList></ConnectionList></div> */}
        </div>
    )
}