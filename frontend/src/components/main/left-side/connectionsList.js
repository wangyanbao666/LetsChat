import { useContext, useState } from "react"
import { DataContext } from "../../common/dataContext"
import UserCard from "./userCard"

export default function ConnectionList(){
    const [selectedId, setSelectedId] = useState(0);
    const {friends, friendsForChat} = useContext(DataContext)

    return (
        <div className="user-list">
            {friends.map( (user) => {
                return <UserCard user={user} key={user.id} selected={selectedId==user.id} isChat={false}></UserCard>
            } )}
        </div>
    )
    
}