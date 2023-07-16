// text within a box

import { getTime } from "../../../utils/commonMethods";

// props: content
export default function DialogBox(props){
    return (
        <div className={props.self==true ? "dialog-box2" : "dialog-box1"}>
            {!props.success && <div className="sent-fail">!</div>}
            <div className={props.self==true ? "dialog-box2-text" : "dialog-box1-text"}>
                {props.text}
                <div>{props.time}</div>
            </div>
        </div>
    )
}