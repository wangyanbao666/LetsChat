import $ from "jquery"
import { useContext, useEffect, useRef, useState } from "react";
import { DataContext } from "../common/dataContext";
import { useNavigate } from "react-router-dom";
import { compareByDatetime, compareByName } from "../../utils/compareMethods";
import config from "../../config";

export default function Login(){

	const navigate = useNavigate()
	const emailRef = useRef(null)
	const passwordRef = useRef(null)
	const usernameRef = useRef(null)
	const [isRegister, setIsRegister] = useState(false);
	const register = useRef(null)
	const login = useRef(null)
	const loginButton = useRef(null)
	const {setIsLoggedIn} = useContext(DataContext)

	const [loginVisibility, setLoginVisibility] = useState(false)
	const [registerVisibility, setRegisterVisibility] = useState(true)

	const {setUsername, setUserInfo, setChatHistory, setFriends, setFriendsForChat,
		setConnectionRequest, history, websocket, remarks, setRemarks,
		unHandledConnectionNum, setUnHandledConnectionNum, setNumOfUnseenMessage} = useContext(DataContext)


    function handleSubmit(event){
        event.preventDefault(); // 👈️ prevent page refresh
		let emailValue = emailRef.current.value
		let passwordValue = passwordRef.current.value
		if (isRegister){
			let username = usernameRef.current.value;
			$.ajax({
				url: config.registerUrl,
				type: 'POST',
				contentType: 'application/json',
				data: JSON.stringify({ email: emailValue, password: passwordValue, username: username }),
				success: function(result) {
					let statusCode = result.code;
					let message = result.message;
					alert(message);
					if (statusCode == 200){
						changeRegister();
					}
				},
			});
		}
		else {
			$.ajax({
				url: config.loginUrl,
				type: "POST",
				contentType: "application/json",
				data: JSON.stringify({email: emailValue, password: passwordValue}),
				success: function(result){
					let statusCode = result.code;
					let message = result.message;
					alert(message);
					if (statusCode == 200){
						console.log(result.data)
						let userId = result.data.user.id;
						setIsLoggedIn(true);
						loadUserData(result.data, userId);
						navigate("/");
					}
				}

			})
		}
        return false;
    }

	function backToMain(){
		navigate("/")
	}

	function loadUserData(data, userId){
		let connections = data.connections;
		let userInfo = data.user;
		let history = data.chatHistory;
		let invitations = data.invitations;
		let remarks = data.remarks || {};
		let processedResult = preprocessChatHistory(connections, history, userId);
		setUserInfo(userInfo);
		setFriends(processedResult.connections);
		setFriendsForChat(processedResult.processedConnectionsForChat);
		setChatHistory(processedResult.processedHistory);
		setNumOfUnseenMessage(processedResult.unseenCount);
		setRemarks(remarks);
		console.log(invitations)
		if (invitations==null){
			invitations = []
		}
		let unHandledInvitationNum = 0;
		invitations.forEach(invitation => {
			if (invitation.handled==0 && invitation.senderId!=userInfo.id){
				unHandledInvitationNum+=1;
			}
		})
		setUnHandledConnectionNum(unHandledInvitationNum);
		setConnectionRequest(invitations);
	}

	function preprocessChatHistory(connections, history, userId){
		let lastChat = [];
		let processedHistory = {};
		let unseenCount = {};
		let keys = Object.keys(history);
		for (let key of keys){
			lastChat.push(history[key][history[key].length-1]);
			processedHistory[key] = [];
			unseenCount[key] = 0;
			history[key].forEach(element => {
				let singleHistory = {}
				singleHistory["self"] = element.senderId === userId;
				singleHistory["content"] = element.content;
				singleHistory["flag"] = element.flag;
				singleHistory["success"] = true
				singleHistory["datetime"] = element.datetime
				if (element.flag === 0 && element.senderId !== userId){
					unseenCount[key]+=1;
				}
				processedHistory[key].push(singleHistory) 
			});
		}
		lastChat.sort(compareByDatetime)

		let processedConnectionsForChat = []
		for (let item of lastChat){
			let id = item.senderId === userId ? item.receiverId : item.senderId;
			for (let connection of connections){
				if (connection.id === id){
					processedConnectionsForChat.push(connection)
					break;
				}
			}
		}
		processedConnectionsForChat.reverse();
		connections.sort((a, b) => compareByName(a.username, b.username))
		// console.log(processedConnections)
		// console.log(processedHistory)
		return {"unseenCount": unseenCount, "processedConnectionsForChat": processedConnectionsForChat, 
		"processedHistory": processedHistory, "connections": connections}
	}


	function changeRegister(){
		if (isRegister){
			setIsRegister(false)
			let button = document.getElementById("loginButton")
			button.textContent = "Login"
			setLoginVisibility(false)
			setRegisterVisibility(true)
		}
		else {
			setIsRegister(true)
			let button = document.getElementById("loginButton")
			button.textContent = "Register"
			setLoginVisibility(true)
			setRegisterVisibility(false)
		}
	}

	useEffect(() => {
		/*==================================================================
    [ Focus input ]*/
    $('.input100').each(function(){
        $(this).on('blur', function(){
            if($(this).val().trim() != "") {
                $(this).addClass('has-val');
            }
            else {
                $(this).removeClass('has-val');
            }
        })    
    })
  
    /*==================================================================
    [ Show pass ]*/
    var showPass = 0;
    $('.btn-show-pass').on('click', function(){
        if(showPass == 0) {
            $(this).next('input').attr('type','text');
            $(this).find('i').removeClass('zmdi-eye');
            $(this).find('i').addClass('zmdi-eye-off');
            showPass = 1;
        }
        else {
            $(this).next('input').attr('type','password');
            $(this).find('i').addClass('zmdi-eye');
            $(this).find('i').removeClass('zmdi-eye-off');
            showPass = 0;
        }
        
    });
	})
	
    return (
        <div>
            <div className="limiter">
		<div className="container-login100">
			<div className="wrap-login100">

				<form className="login100-form validate-form" onSubmit={handleSubmit}>
					<span className="login100-form-title p-b-26">
						Welcome
					</span>
					<span className="login100-form-title p-b-48">
						<i className="zmdi zmdi-font"></i>
					</span>

					<div className="wrap-input100 validate-input" data-validate = "Valid email is: a@b.c">
						<input className="input100" type="text" name="email" ref={emailRef}></input>
						<span className="focus-input100" data-placeholder="Email"></span>
					</div>

					<div className="wrap-input100 validate-input" data-validate="Enter password">
						<span className="btn-show-pass">
							<i className="zmdi zmdi-eye"></i>
						</span>
						<input className="input100" type="password" name="pass" ref={passwordRef}></input>
						<span className="focus-input100" data-placeholder="Password"></span>
					</div>

					{
						isRegister && 
						<div className="wrap-input100 validate-input">
							<input className="input100" type="text" name="pass" ref={usernameRef}></input>
							<span className="focus-input100" data-placeholder="Username"></span>
						</div>
					}

					<div className="container-login100-form-btn">
						<div className="wrap-login100-form-btn">
							<div className="login100-form-bgbtn"></div>
							<button className="login100-form-btn" ref={loginButton} id="loginButton">
								Login
							</button>
						</div>
					</div>

					<div className="text-center">
						<button className="button-30" onClick={backToMain} style={
							{
								marginTop:"40px",
							}
						}>Back to main page</button>
					</div>



					<div className="text-center p-t-115" style={{display:registerVisibility?"block":"none"}} id="register">
						<span className="txt1">
							Don't have an account?
						</span>

						<a className="txt2" onClick={changeRegister}>
							Sign Up
						</a>
					</div>
					<div className="text-center p-t-115" style={{display:loginVisibility?"block":"none"}} id="login">
						<span className="txt1">
							Already have an account?
						</span>

						<a className="txt2" onClick={changeRegister}>
							Login
						</a>
					</div>
				</form>
			</div>
		</div>
	</div>
        </div>
    )
}