package com.communication.service;

import com.commons.entities.*;
import com.communication.clients.MessageManagementClient;
import com.communication.dao.UserDao;
import jakarta.annotation.Resource;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.LocalDateTime;

@Service
@Slf4j
public class WebSocketService {
    @Resource
    private UserDao userDao;
    @Resource
    private SimpMessagingTemplate simpMessagingTemplate;
    @Resource
    private MessageManagementClient messageManagementClient;

    public void processChatMessage(Message message){
        log.info("message is: "+message);
        long receiverId = message.getReceiverId();
        long senderId = message.getSenderId();
//        check whether the receiver is connected with the sender
        User sender = userDao.getUserById(senderId);
        CommonResult result = new CommonResult();

        log.info(sender.getConnections().toString());
        if (!sender.getConnections().contains(receiverId)){
            result.setCode(400);
            result.setData(message);
            simpMessagingTemplate.convertAndSend("/queue/"+senderId+"/chat/confirm", result);
            return;
        }
        log.info("send success");
        messageManagementClient.saveMessage(message);
        simpMessagingTemplate.convertAndSend("/queue/"+receiverId+"/chat", message);
        result.setCode(200);
        result.setData(message);
        simpMessagingTemplate.convertAndSend("/queue/"+senderId+"/chat/confirm", result);
    }

    public void sendInvitation(Connection connection){
        simpMessagingTemplate.convertAndSend("/queue/"+connection.getReceiverId()+"/invitation", connection);
    }

    public void sendInvitationHandleResult(InvitationRequest invitationRequest){
        long id = invitationRequest.getConnection().getSenderId();
        simpMessagingTemplate.convertAndSend("/queue/"+id+"/invitation/result", invitationRequest);
    }

    public void goOnline(long id){
        userDao.updateUserStatusOnline(id);
        UserStatus userStatus = new UserStatus(id, 1);
        simpMessagingTemplate.convertAndSend("/queue/"+id+"/status", userStatus);
    }

    public void goOffline(long id){
        Timestamp time = Timestamp.valueOf(LocalDateTime.now());
        userDao.updateUserStatusOffline(id, time);
        UserStatus userStatus = new UserStatus(id, 0);
        simpMessagingTemplate.convertAndSend("/queue/"+id+"/status", userStatus);
    }
}
