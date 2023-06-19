package com.userManagement.services;

import com.commons.entities.CommonResult;
import com.commons.entities.Message;
import com.commons.entities.User;
import com.userManagement.clients.MessageManagementClient;
import com.userManagement.dao.UserDao;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@Service
public class UserService {
    @Resource
    private UserDao userDao;

    @Resource
    private MessageManagementClient messageManagementClient;
    public CommonResult<User> userRegister(User user){
        User userCheck = userDao.getUserByName(user.getUsername());
        CommonResult<User> result;
        if (userCheck == null){
            try {
                userDao.insertUser(user);
                result = new CommonResult<User>(200, "Account created successfully!", user);
                return result;
            } catch (Exception e){
                result = new CommonResult<User>(400, "There is something wrong with the server, please try again later", user);
                return result;
            }
        }
        else {
            result = new CommonResult<User>(401, "The username has existed, please choose another username.", null);
            return result;
        }
    }

//    need to return chat history
    public CommonResult<Map<String, Object>> userLogin(User user){
        CommonResult<Map<String, Object>> result;
        Map<String, Object> info = new HashMap<>();
        User checkUser = userDao.getUserByName(user.getUsername());
        if (checkUser != null){
            if (Objects.equals(checkUser.getPassword(), user.getPassword())){
                try {
                    info.put("user", checkUser);
                    checkUser.setStatus(1);
                    userDao.updateUser(checkUser);
                    CommonResult<Map<Long, List<Message>>> commonResult = messageManagementClient.getChatHistory(checkUser.getId());
                    Map<Long, List<Message>> chatHistory;
                    if (commonResult.getCode()==200){
                        chatHistory = commonResult.getData();
                        info.put("chatHistory", chatHistory);
                    }
                    else {
                        throw new Exception();
                    }
                    result = new CommonResult(200, "Login Successfully!", info);
                    return result;
                } catch (Exception e){
                    e.getStackTrace();
                    result = new CommonResult(402, "The server has internal errors, please wait for a while.", null);
                    return result;
                }

            }
            result = new CommonResult(401, "The password is not correct.", null);
            return result;
        }
        result = new CommonResult(400, "The username does not exist.", null);
        return result;
    }
}
