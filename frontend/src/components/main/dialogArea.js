// display time, dialog box and input bar.

import DialogDisplayArea from "./dialogDisplayArea";
import InputBar from "./inputBar.js"

export default function DialogArea(){
    return(
        <div className="dialog-area">
            <DialogDisplayArea></DialogDisplayArea>
            <InputBar></InputBar>
        </div>
    )
}