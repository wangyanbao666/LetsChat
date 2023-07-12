// text within a box
// props: content
export default function DialogBox(props){
    return (
        <div className={props.self==true ? "dialog-box2" : "dialog-box1"}>
            <p>{props.text}</p>
        </div>
    )
}