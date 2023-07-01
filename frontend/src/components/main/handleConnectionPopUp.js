// add user by it's username

import { forwardRef, useContext } from "react";
import ConnectionRequestCard from "./connectionRequestCard";
import { DataContext } from "../common/dataContext";

const HandleConnectionPopUp = forwardRef(({props}, ref) => {
    const {connectionRequest} = useContext(DataContext);
    return (
        <div className="handle-connection-popup" ref={ref}>
            {connectionRequest.map(invitation => {
               return <ConnectionRequestCard invitation={invitation} key={invitation.senderId}></ConnectionRequestCard>
            })}
        </div>
    )
})
export default HandleConnectionPopUp