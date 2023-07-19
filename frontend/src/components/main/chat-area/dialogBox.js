// text within a box

import { useContext } from "react";
import { convertSystemTime, getTime } from "../../../utils/commonMethods";
import { DataContext, DataProvider } from "../../common/dataContext";

// props: content
export default function DialogBox(props){
    return (
        <div className={props.self==true ? "dialog-box2" : "dialog-box1"}>
            {!props.success && <div className="sent-fail">!</div>}
            <div className={props.self==true ? "dialog-box2-text" : "dialog-box1-text"}>
                <div className="msg-content">{props.text}</div>
                <div className="msg-time">{props.datetime}</div>
            </div>
        </div>
    )
}