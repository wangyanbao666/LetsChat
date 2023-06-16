// contain all the user card

import { useState } from "react"
import UserCard from "./userCard"

export default function UserList(props){
    const users = props.users;
    const [selectedId, setSelectedId] = useState(0);
    const handleClick = (id) => {
        setSelectedId(id);
      }
    return (
        <div className="user-list">
            {users.map( (user) => {
                return <UserCard user={user} key={user.id} selected={selectedId==user.id} onClick={handleClick}></UserCard>
            } )}
        </div>
    )

}