// contain all the user card

import { useContext, useState } from "react"
import { DataContext } from "../common/dataContext";
import UserCard from "./userCard"


export default function UserList(props){
    const users = props.users;
    const [selectedId, setSelectedId] = useState(0);
    const {friends} = useContext(DataContext)
    const handleClick = (id) => {
        setSelectedId(id);
      }
    return (
        <div className="user-list">
            {friends.map( (user) => {
                return <UserCard user={user} key={user.id} selected={selectedId==user.id} onClick={handleClick}></UserCard>
            } )}
        </div>
    )

}