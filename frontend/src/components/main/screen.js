// put up everything under this folder
// send request to backend to get user information, friends information and chat history

import { useContext, useEffect } from "react";
import DialogArea from "./chat-area/dialogArea";
import TopBar from "./topBar";
import LeftSideBar from "./left-side/leftSideBar";
import { DataContext } from "../common/dataContext";
import { useNavigate } from "react-router-dom";

export default function Screen(){
    return (
        <div className="screen">
            <TopBar></TopBar>
            <div className="main-content">
                <LeftSideBar></LeftSideBar>
                <DialogArea></DialogArea>
            </div>
        </div>
    )
}