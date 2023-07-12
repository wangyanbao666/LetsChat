import { useContext, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { DataContext } from "../common/dataContext";
import AddConnectionPopUp from "./popups/addConnectionPopUp";
import HandleConnectionPopUp from "./popups/handleConnectionPopUp";


export default function TopBar(){
    const navigate = useNavigate();
    const {isLoggedIn} = useContext(DataContext)
    const {showAddConnectionPopUp, setShowAddConnectionPopUp, showHandleConnectionPopUp, 
        setShowHandleConnectionPopUp, unHandledConnectionNum, setUnHandledConnectionNum} = useContext(DataContext);
    const screen = document.getElementsByClassName("main-content");

    function goToLogin(){
        navigate("/login");
    }
    function addConnectionPopUp(){
        // console.log("add connection...")
        if (!showAddConnectionPopUp && !showHandleConnectionPopUp){
            setShowAddConnectionPopUp(true);
        }
    }
    function handleConnectionPopUp(){
        // console.log("add connection...")
        if (!showAddConnectionPopUp && !showHandleConnectionPopUp){
            setShowHandleConnectionPopUp(true);
        }
    }

    const addConnectionPopUpRef = useRef(null);
    const handleConnectionPopUpRef = useRef(null);
    const topBarRef = useRef(null);

    useEffect(() => {
        if (showAddConnectionPopUp || showHandleConnectionPopUp){
            screen[0].style.opacity = "0.3";
        }
        else {
            screen[0].style.opacity = "1";
        }
    }, [showAddConnectionPopUp, showHandleConnectionPopUp])


    useEffect(() => {
        const handleClickOutside = (event) => {   
            if (addConnectionPopUpRef.current && !addConnectionPopUpRef.current.contains(event.target) && !topBarRef.current.contains(event.target)) {
                setShowAddConnectionPopUp(false);
            }
 
            if (handleConnectionPopUpRef.current && !handleConnectionPopUpRef.current.contains(event.target) && !topBarRef.current.contains(event.target)){
                setShowHandleConnectionPopUp(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
          document.removeEventListener('mousedown', handleClickOutside);
        };
      }, []);

    return (
        <div className="top-bar" ref={topBarRef}>
            <div className="topbar-button"><button onClick={goToLogin}>Login</button></div>
            {/* <button onClick={addConnectionPopUp}>Add Connection</button>
            <button onClick={handleConnectionPopUp}>Handle Connection</button> */}
            {showAddConnectionPopUp && <AddConnectionPopUp ref={addConnectionPopUpRef}></AddConnectionPopUp>}
            {showHandleConnectionPopUp && <HandleConnectionPopUp ref={handleConnectionPopUpRef}></HandleConnectionPopUp>}
            {isLoggedIn && 
                <div className="topbar-button">
                    <button onClick={addConnectionPopUp}>Add Connection</button>
                </div>}
            {isLoggedIn && 
                <div className="topbar-button">
                    <button onClick={handleConnectionPopUp}>Handle Connection
                        {unHandledConnectionNum>0 && <div className="new-invitation-indication">{unHandledConnectionNum}</div>}
                    </button>
                   
                </div>}

                {/* <div className="topbar-button">
                    <button onClick={handleConnectionPopUp}>Handle Connection</button>
                    {unHandledConnectionNum>0 && <div className="new-invitation-indication">{unHandledConnectionNum}</div>}
                </div> */}
        </div>
    )
}