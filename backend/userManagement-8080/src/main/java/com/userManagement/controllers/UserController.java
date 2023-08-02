package com.userManagement.controllers;

import com.commons.entities.*;
import com.userManagement.services.UserService;
import jakarta.annotation.Resource;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@EnableDiscoveryClient
@EnableConfigurationProperties
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
    @PostMapping("user/connection/add")
    public CommonResult addConnectionRequest(@RequestBody Connection connection){
        return userService.publishConnectionRequest(connection);
    }

    @PostMapping("user/connection/handle")
    public CommonResult addConnectionHandler(@RequestBody Connection connection){
        return userService.handleInvitation(connection);
    }

    @PostMapping("user/connection/delete")
    public CommonResult deleteConnection(@RequestBody ConnectionPair connectionPair){
        User user1 = connectionPair.getUser1();
        User user2 = connectionPair.getUser2();
        return userService.deleteConnection(user1, user2);
    }

    @PostMapping("user/remark/add")
    public CommonResult addRemark(@RequestBody AddRemarkBody addRemarkBody){
        return userService.addRemark(addRemarkBody);
    }

    @PostMapping("user/username/change")
    public CommonResult changeUsername(@RequestBody User user){
        return userService.changeUserName(user);
    }

    @PostMapping("user/searchuser")
    public CommonResult searchUserByNameStart(@RequestBody String username){
        System.out.println(username);
        return userService.searchUserByNameStart(username);
    }

    @GetMapping("user/verify")
    public CommonResult verifyUser(@RequestParam("token") String token){
        return userService.userVerify(token);
    }
}
