import { forwardRef, useContext, useRef } from "react"
import { DataContext } from "../../common/dataContext";
import $ from "jquery"

const ChangeProfilePopup = forwardRef((props,ref) => {
    const {userInfo, changeUsername} = useContext(DataContext)
    const imageLink = userInfo.image==null ? "/imgs/selfie-place-holder.jpg" : userInfo.image;
    const usernameInputRef = useRef(null) 

    const changeUsernameHandler = () => {
        let newUsername = usernameInputRef.current.value;
        if (newUsername !== "" && newUsername!=userInfo.username){
            changeUsername(newUsername)
        }
    }
    return (
        <div className="change-profile-popup popup" ref={ref}>
            <div className="change-avatar">
                <img src={imageLink} className="user-card-img"></img>
                <button className="change-avatar-button bottom button">change avatar</button>
            </div>
            <div className="change-username">
                <input type="text" className="username-edit-box" placeholder={userInfo.username} ref={usernameInputRef}></input>
                <button className="change-username-button bottom button" onClick={changeUsernameHandler}>change username</button>
            </div>
        </div>
    )
})

export default ChangeProfilePopup