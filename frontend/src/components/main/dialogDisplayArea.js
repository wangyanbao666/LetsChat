import { useContext } from "react";
import { DataContext } from "../common/dataContext";
import DialogBox from "./dialogBox";
import UserStatusBar from "./userStatusBar";

export default function DialogDisplayArea(){
    const {selectedUser, setSelectedUser} = useContext(DataContext);
    let active = selectedUser!=null;

    return (
        <div className="dialog-display-area">
            {active && <UserStatusBar></UserStatusBar>}
            <DialogBox text="this is a dialog box" self={false}></DialogBox>
        </div>
    )
}