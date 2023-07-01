import { useContext, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { DataContext } from "../common/dataContext";
import AddConnectionPopUp from "./addConnectionPopUp";


export default function TopBar(){
    const navigate = useNavigate();
    const {isLoggedIn} = useContext(DataContext)
    const {showAddConnectionPopUp, setShowAddConnectionPopUp} = useContext(DataContext);
    const screen = document.getElementsByClassName("main-content");

    function goToLogin(){
        navigate("/login");
    }
    function addConnectionPopUp(){
        // console.log("add connection...")
        if (!showAddConnectionPopUp){
            setShowAddConnectionPopUp(true);
        }
    }

    const addConnectionPopUpRef = useRef(null);
    const topBarRef = useRef(null);

    useEffect(() => {
        if (showAddConnectionPopUp){
            screen[0].style.opacity = "0.5";
        }
        else {
            screen[0].style.opacity = "1";
        }
    }, [showAddConnectionPopUp])


    useEffect(() => {
        const handleClickOutside = (event) => {
            // console.log(event.target)
            // console.log(addConnectionPopUpRef.current)
            
            if (addConnectionPopUpRef.current && !addConnectionPopUpRef.current.contains(event.target) && !topBarRef.current.contains(event.target)) {
                setShowAddConnectionPopUp(false);
                
            }
        };
    
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
          document.removeEventListener('mousedown', handleClickOutside);
        };
      }, []);

    function handleConnectionPopUp(){

    }
    return (
        <div className="top-bar" ref={topBarRef}>
            <button onClick={goToLogin}>Login</button>
            {/* <button onClick={addConnectionPopUp}>Add Connection</button>
            <button onClick={handleConnectionPopUp}>Handle Connection</button> */}
            {showAddConnectionPopUp && <AddConnectionPopUp ref={addConnectionPopUpRef}></AddConnectionPopUp>}
            {isLoggedIn && <button onClick={addConnectionPopUp}>Add Connection</button>}
            {isLoggedIn && <button onClick={handleConnectionPopUp}>Handle Connection</button>}
        </div>
    )
}