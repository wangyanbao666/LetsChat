package com.communication.controller;


import com.commons.entities.*;
import com.communication.clients.MessageManagementClient;
import com.communication.dao.UserDao;
import jakarta.annotation.Resource;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Slf4j
public class WebSocketController {
    @Resource
    private UserDao userDao;

    @Resource
    private SimpMessagingTemplate simpMessagingTemplate;

    @Resource
    private MessageManagementClient messageManagementClient;


    @MessageMapping("/chat")
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

    @MessageMapping("/")

    @PostMapping("connection/send")
    public void sendInvitation(@RequestBody Connection connection){
        simpMessagingTemplate.convertAndSend("/queue/"+connection.getReceiverId()+"/invitation", connection);
    }

    @PostMapping("connection/result")
    public void sendInvitationHandleResult(@RequestBody InvitationRequest invitationRequest){
        User user = invitationRequest.getUser();
        long id = invitationRequest.getConnection().getSenderId();
        simpMessagingTemplate.convertAndSend("/queue/"+id+"/invitation/result", invitationRequest);
    }
}
