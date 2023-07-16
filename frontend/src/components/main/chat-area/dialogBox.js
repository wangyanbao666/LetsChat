// text within a box

import { useContext } from "react";
import { getTime } from "../../../utils/commonMethods";
import { DataContext, DataProvider } from "../../common/dataContext";

// props: content
export default function DialogBox(props){
    const {timeZone} = useContext(DataContext);
    const dateTime = new Date(props.datetime);
    let curTime = dateTime.toLocaleString('en-US', {timeZone: timeZone, hour12: false, hour: '2-digit', minute: '2-digit'})
    return (
        <div className={props.self==true ? "dialog-box2" : "dialog-box1"}>
            {!props.success && <div className="sent-fail">!</div>}
            <div className={props.self==true ? "dialog-box2-text" : "dialog-box1-text"}>
                <div className="msg-content">{props.text}</div>
                <div className="msg-time">{curTime}</div>
            </div>
        </div>
    )
}