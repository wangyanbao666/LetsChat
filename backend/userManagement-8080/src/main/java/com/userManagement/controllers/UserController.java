package com.userManagement.controllers;

import com.commons.entities.CommonResult;
import com.commons.entities.User;
import com.userManagement.services.UserService;
import jakarta.annotation.Resource;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@EnableDiscoveryClient
public class UserController {
    @Resource
    private UserService userService;

//    register user info into database
    @PostMapping("user/register")
    public CommonResult userRegister(@RequestBody User user){
        return userService.userRegister(user);
    }

//    compare username and password with database
//    return chathistory together with user info
    @PostMapping("user/login")
    public CommonResult userLogin(@RequestBody User user){
        return userService.userLogin(user);
    }

    public void userLogout(){

    }

//    add a user to a user's connection list
    public void addConnectionRequest(){

    }

    public void addConnectionHandler(){

    }
}
