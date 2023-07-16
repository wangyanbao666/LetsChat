// contain all the user card

import { useContext, useState } from "react"
import { DataContext } from "../../common/dataContext";
import UserCard from "./userCard"


export default function UserList(){
    const [selectedId, setSelectedId] = useState(0);
    const {friendsForChat, chatHistory} = useContext(DataContext);
    const handleClick = (id) => {
        setSelectedId(id);
      }
    return (
        <div className="chat-history-user-list">
            {friendsForChat.map( (user) => {
                return <UserCard user={user} key={user.id} selected={selectedId==user.id} onClick={handleClick} inChat={true} lastMessage={chatHistory[user.id][chatHistory[user.id].length-1]["content"]}></UserCard>
            } )}
        </div>
    )

}