import { useContext, useEffect, useRef, useState } from "react";
import { DataContext } from "../common/dataContext";
import AddConnectionPopUp from "./popups/addConnectionPopUp";
import HandleConnectionPopUp from "./popups/handleConnectionPopUp";
import ChangeProfilePopup from "./popups/changeProfilePopup";


export default function TopBar(){
    const {showAddConnectionPopUp, setShowAddConnectionPopUp, showHandleConnectionPopUp, 
        setShowHandleConnectionPopUp, unHandledConnectionNum, 
        showChangeProfilePopup, setShowChangeProfilePopup} = useContext(DataContext);
    const screen = document.getElementsByClassName("main-content");

    function addConnectionPopUp(){
        // console.log("add connection...")
        if (!showAddConnectionPopUp && !showHandleConnectionPopUp && !showChangeProfilePopup){
            expandAreaRef.current.style.maxHeight = 0
            setShowAddConnectionPopUp(true);
        }
    }
    function handleConnectionPopUp(){
        // console.log("add connection...")
        if (!showAddConnectionPopUp && !showHandleConnectionPopUp && !showChangeProfilePopup){
            expandAreaRef.current.style.maxHeight = 0
            setShowHandleConnectionPopUp(true);
        }
    }
    function changeProfilePopup(){
        if (!showAddConnectionPopUp && !showHandleConnectionPopUp && !showChangeProfilePopup){
            expandAreaRef.current.style.maxHeight = 0
            setShowChangeProfilePopup(true);
        }
    }

    const addConnectionPopUpRef = useRef(null);
    const handleConnectionPopUpRef = useRef(null);
    const changeProfilePopupRef = useRef(null);
    const topBarRef = useRef(null);
    const expandAreaRef = useRef(null);

    useEffect(() => {
        if (showAddConnectionPopUp || showHandleConnectionPopUp || showChangeProfilePopup){
            expandAreaRef.current.style.maxHeight = 0
            screen[0].style.opacity = "0.3";
        }
        else {
            screen[0].style.opacity = "1";
        }
    }, [showAddConnectionPopUp, showHandleConnectionPopUp, showChangeProfilePopup])


    useEffect(() => {
        const handleClickOutside = (event) => {   
            if (addConnectionPopUpRef.current && !addConnectionPopUpRef.current.contains(event.target) && !topBarRef.current.contains(event.target)) {
                setShowAddConnectionPopUp(false);
            }
 
            if (handleConnectionPopUpRef.current && !handleConnectionPopUpRef.current.contains(event.target) && !topBarRef.current.contains(event.target)){
                setShowHandleConnectionPopUp(false);
            }

            if (changeProfilePopupRef.current && !changeProfilePopupRef.current.contains(event.target) && !topBarRef.current.contains(event.target)){
                setShowChangeProfilePopup(false);
            }

            if (expandAreaRef.current && !expandAreaRef.current.contains(event.target)){
                expandAreaRef.current.style.maxHeight = 0
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
          document.removeEventListener('mousedown', handleClickOutside);
        };
      }, []);

    const expand = (() => {
        expandAreaRef.current.style.maxHeight = "500px"
    })

    return (
        <div className="top-bar" ref={topBarRef}>
            <div className="menu-icon" onClick={expand}>
                    <span></span>
                    <span></span>
                    <span></span>
                    <div className="expand-area" ref={expandAreaRef}>
                        <ul>
                            <li>
                                <div onClick={addConnectionPopUp}>Add Connection</div>
                            </li>
                            <li>
                                <div onClick={handleConnectionPopUp}>Handle Connection
                                    {unHandledConnectionNum>0 && <div className="new-invitation-indication">{unHandledConnectionNum}</div>}
                                </div>
                            </li>
                            <li>
                                <div onClick={changeProfilePopup}>Edit Profile</div>
                            </li>
                        </ul>
                        
                    </div>
            </div>
            {showAddConnectionPopUp && <AddConnectionPopUp ref={addConnectionPopUpRef}></AddConnectionPopUp>}
            {showHandleConnectionPopUp && <HandleConnectionPopUp ref={handleConnectionPopUpRef}></HandleConnectionPopUp>}
            {showChangeProfilePopup && <ChangeProfilePopup ref={changeProfilePopupRef}></ChangeProfilePopup>}
            {/* <div className="topbar-button"><button onClick={goToLogin}>Login</button></div> */}

            
        </div>
    )
}