package com.userManagement.services;

import com.commons.entities.*;
import com.userManagement.clients.CommunicationClient;
import com.userManagement.clients.MessageManagementClient;
import com.userManagement.dao.RedisDao;
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
    private RedisDao redisDao;
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
                info.put("user", checkUser);
                List<Long> connections = checkUser.getConnections();

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

                Map<Long, String> remarks = redisDao.getRemark(checkUser.getId());
                info.put("remarks", remarks);

                result = new CommonResult(200, "Login Successfully!", info);
                publishConnectionRequestService.createNewQueue(user.getUsername());
                return result;

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
            User sender = userDao.getUserByName(connection.getSenderName());
            User receiver = userDao.getUserByName(connection.getReceiverName());
            if (connection.getHandled() == 1){
//                check whether they are connection with each other
                if (!sender.getConnections().contains(receiver.getId())){
                    sender.getConnections().add(receiver.getId());
                    receiver.getConnections().add(sender.getId());
                    userDao.updateUser(sender);
                    userDao.updateUser(receiver);
                    result.setData(sender);
                }
            }
            publishConnectionRequestService.handleConnectionRequest(connection, receiver);
            return result;
        } catch (Exception e){
            result.setCode(401);
            return result;
        }

    }

    public CommonResult deleteConnection(User user1, User user2){
        CommonResult result = new CommonResult<>();
        User user1Check = userDao.getUserById(user1.getId());
        User user2Check = userDao.getUserById(user2.getId());
        user1Check.getConnections().remove(user2Check.getId());
        user2Check.getConnections().remove(user1Check.getId());
        userDao.updateUser(user1Check);
        userDao.updateUser(user2Check);
        result.setCode(200);
        return result;
    }

    public CommonResult addRemark(AddRemarkBody addRemarkBody){
        CommonResult result = new CommonResult();
        redisDao.addRemark(addRemarkBody.getUserId(), addRemarkBody.getFriendId(), addRemarkBody.getRemark());
        result.setCode(200);
        return result;
    }

    public CommonResult changeUserName(User user){
        CommonResult commonResult = new CommonResult();
        long id = user.getId();
        String username = user.getUsername();
        User checkUser = userDao.getUserByName(username);
        if (checkUser!=null){
            commonResult.setCode(400);
            return commonResult;
        }
        userDao.updateUsername(id, username);
        commonResult.setCode(200);
        return commonResult;
    }

    public CommonResult searchUserByNameStart(String username){
        CommonResult commonResult = new CommonResult();
        List<User> users = userDao.searchUserByNameStart(username);
        commonResult.setCode(200);
        commonResult.setData(users);
        return commonResult;
    }
}
