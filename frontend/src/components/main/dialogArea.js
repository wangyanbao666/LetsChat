// display time, dialog box and input bar.

import DialogDisplayArea from "./dialogDisplayArea";
import InputBar from "./inputBar.js"
import { DataContext } from "../common/dataContext";
import { useContext, useState } from "react"
import UserStatusBar from "./userStatusBar";


export default function DialogArea(){
    const {selectedUser, setSelectedUser} = useContext(DataContext);
    let active = selectedUser!=null;
    return(
        <div className="dialog-area">
            {active && <UserStatusBar></UserStatusBar>}       
            {active && <DialogDisplayArea></DialogDisplayArea>}
            {active && <InputBar></InputBar>}
            
        </div>
    )
}