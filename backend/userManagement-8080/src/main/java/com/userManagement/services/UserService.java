package com.userManagement.services;

import com.commons.entities.CommonResult;
import com.commons.entities.Connection;
import com.commons.entities.Message;
import com.commons.entities.User;
import com.userManagement.clients.MessageManagementClient;
import com.userManagement.dao.UserDao;
import jakarta.annotation.Resource;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
@Slf4j
public class UserService {
    @Resource
    private UserDao userDao;
    @Resource
    private PublishConnectionRequestService publishConnectionRequestService;
    @Resource
    private MessageManagementClient messageManagementClient;
    public CommonResult<User> userRegister(User user){
        User userCheck = userDao.getUserByName(user.getUsername());
        CommonResult<User> result;
        if (userCheck == null){
            try {
                userDao.insertUser(user);
                result = new CommonResult<User>(200, "Account created successfully!", user);
                publishConnectionRequestService.createNewQueue(user.getUsername());
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
//                try {
                    info.put("user", checkUser);
                    checkUser.setStatus(1);
                    userDao.updateUser(checkUser);
                    List<Long> connections = checkUser.getConnections();
//                    log.info(connections.toString());

                    List<User> users = new ArrayList<>();
                    if (connections.size()>0){
                        users = userDao.getUserByIds(connections);
                    }
                    log.info(users.toString());

                    users.forEach(userConnected -> {
                        userConnected.setPassword(null);
                    });
                    info.put("connections", users);

                    CommonResult<Map<Long, List<Message>>> commonResult = messageManagementClient.getChatHistory(checkUser.getId());
                    Map<Long, List<Message>> chatHistory;
                    chatHistory = commonResult.getData();
                    info.put("chatHistory", chatHistory);

                    List<Connection> invitations = publishConnectionRequestService.getConnections(checkUser.getId());
                    if (invitations!=null) {
                        log.info(invitations.toString());
                    }
                    info.put("invitations", invitations);

                    result = new CommonResult(200, "Login Successfully!", info);
                    publishConnectionRequestService.createNewQueue(user.getUsername());
                    return result;
//                } catch (Exception e){
//                    log.error(Arrays.toString(e.getStackTrace()));
//                    result = new CommonResult(402, "The server has internal errors, please wait for a while.", null);
//                    return result;
//                }

            }
            result = new CommonResult(401, "The password is not correct.", null);
            return result;
        }
        result = new CommonResult(400, "The username does not exist.", null);
        return result;
    }

    public CommonResult publishConnectionRequest(Connection connection){
        String receiverName = connection.getReceiverName();
        String senderName = connection.getSenderName();
        User receiver = userDao.getUserByName(receiverName);
        CommonResult result = new CommonResult();
        if (receiver==null){
            result.setCode(400);
            result.setMessage("There is no user named: "+receiverName);
            return result;
        }
        User sender = userDao.getUserByName(senderName);
        if (sender.getConnections().contains(receiver.getId())){
            result.setCode(400);
            result.setMessage("You already have connection with "+receiverName);
            return result;
        }
//        try {
            connection.setReceiverId(receiver.getId());
            publishConnectionRequestService.publishConnectionRequest(connection);
//            if (!success){
//                throw new Exception();
//            }
            result.setCode(200);
            result.setMessage("You have sent the invitation!");
            return result;
//        } catch (Exception e){
//            result.setCode(401);
//            result.setMessage("There is something wrong with the server, please try again later");
//            return result;
//        }
    }


    @Transactional
    public CommonResult handleInvitation(Connection connection){
        CommonResult result = new CommonResult();
        try {
            result.setCode(200);
            result.setMessage("");
//            update database if accept is true
            if (connection.getHandled() == 1){
                User sender = userDao.getUserByName(connection.getSenderName());
                User receiver = userDao.getUserByName(connection.getReceiverName());
                sender.getConnections().add(receiver.getId());
                receiver.getConnections().add(sender.getId());
                userDao.updateUser(sender);
                userDao.updateUser(receiver);
            }
            publishConnectionRequestService.handleConnectionRequest(connection);
            return result;
        } catch (Exception e){
            result.setCode(401);
            return result;
        }

    }
}
