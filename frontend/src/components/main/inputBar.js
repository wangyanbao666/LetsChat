// text bar + a send button
export default function InputBar(){
    return (
        <div className="input-bar">
            <div className="send">
                <input type="text" className="messageBox" placeholder="Message"></input>
                <button type="submit" className="sendButton">
                    send
                </button>
            </div>
        </div>
    )
}