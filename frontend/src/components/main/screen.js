// put up everything under this folder

import DialogArea from "./dialogArea";
import DialogBox from "./dialogBox";
import TopBar from "./topBar";
import UserList from "./userList";

export default function Screen(){
    return (
        <div className="screen">
            <TopBar></TopBar>
            <div className="main-content">
                <UserList users={[{"id":1,"username":"wyb", "image":null, "status":"online"}, {"id":2,"username":"abc", "image":null, "status":"offline"}]}></UserList>
                <DialogArea></DialogArea>
            </div>
        </div>
    )
}