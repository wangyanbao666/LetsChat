
export default function ConnectionRequestCard(props){
    const invitation = props.invitation;
    const imageLink = invitation.senderImageUrl==null ? "/imgs/selfie-place-holder.jpg" : invitation.senderImageUrl;
    return (
        <div className="connection-request-card">
            <img src={imageLink} className="user-card-img"></img>
            <div className="username">{invitation.senderName}</div>
            <button className="accept">accept</button>
            <button className="refuse">refuse</button>
        </div>
    )
}