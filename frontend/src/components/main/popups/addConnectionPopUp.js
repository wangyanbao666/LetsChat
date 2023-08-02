import { forwardRef, useContext, useEffect, useRef, useState } from "react"
import { DataContext } from "../../common/dataContext"
import config from "../../../config"
import $ from "jquery"
import generateUuid from "../../../utils/generateUuid"
import { updateConnection } from "../../../utils/commonMethods"
import AddConnectionUserCard from "./addConnectionUserCard"


const AddConnectionPopUp = forwardRef(({props},ref) =>{
    const {setShowAddConnectionPopUp, userInfo, setConnectionRequest} = useContext(DataContext);
    const [usersFound, setUsersFound] = useState([])
    const inputRef = useRef(null);

    const handleInputKeyDown = (event) => {
        if (event.key === 'Enter') {
            sendInvitation();
        }
    };

    function sendInvitation(){
        if (inputRef.current.value !== ""){
            setShowAddConnectionPopUp(false);
            let receiverName = inputRef.current.value
            if (receiverName == userInfo.username){
                alert("You can't send invitation to yourself")
                return;
            }
            let invitation = {
                "uuid": generateUuid(),
                "senderName": userInfo.username,
                "receiverName": receiverName,
                "senderId": userInfo.id,
                "handled": 0,
            }
            // send to backend
            $.ajax({
                url: config.sendInvitationUrl,
                type: "POST",
                contentType: "application/json",
                data: JSON.stringify(invitation),
                success: function(result){
                    if (result.code == 200){
                        alert("You have sent invitation to: "+receiverName);
                        setConnectionRequest(previousConnectionRequest => updateConnection(previousConnectionRequest, invitation))
                    }
                    else {
                        alert(result.message);
                    }
                }
            })
            
        }
    }

    const searchUsername = () => {
        let username = inputRef.current.value
        console.log("sending...")
        if (username !== ""){
            $.ajax({
                url: config.searchUserByNameStartUrl,
                method: "POST",
                data: username, // Send the username string directly
                contentType: "text/plain",
                success: function(result){
                    if (result.code===200){
                        if (result.data !== null){
                            setUsersFound(result.data.slice(0,10))
                            console.log(result.data)
                        }
                    }
                }
            })
        }
        else {
            setUsersFound([])
        }
    }

    const debounce = (fn, wait) => {
        var timeout = null;
        return function(){
            if (timeout!==null){
                clearTimeout(timeout);
            }
            timeout = setTimeout(()=>fn(),wait);
        }
    }

    var listener = debounce(searchUsername, 300);
    useEffect(() => {
        inputRef.current.removeEventListener("input", listener);
        inputRef.current.addEventListener("input", listener);
        return () => {
            if (inputRef.current!==null){
                inputRef.current.removeEventListener("input",listener);
            }
        }
    }, [])

    return (
        <div className="add-connection-popup popup" ref={ref}>
                {/* <button className="send-invitation" onClick={sendInvitation}>Send Invitation</button> */}
                <input type="text" placeholder="search username" className="usersearchbar" ref={inputRef} tabIndex={0} onKeyDown={handleInputKeyDown}></input>
                <div className="user-result">
                    {usersFound.length!==0 ? usersFound.map(user => {
                        if (user.id === userInfo.id){
                            return;
                        }
                        const imageLink = user.image==null ? "/imgs/selfie-place-holder.jpg" : user.image;
                        return <AddConnectionUserCard imgSrc={imageLink} username={user.username}></AddConnectionUserCard>
                    }) : 
                        <div className="no-result">
                            {/* No result found. */}
                        </div>
                    }
                </div>
        </div> 
    )
})

export default AddConnectionPopUp