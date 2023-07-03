package com.communication.controller;


import com.commons.entities.Connection;
import com.commons.entities.Message;
import com.commons.entities.User;
import com.communication.clients.MessageManagementClient;
import com.commons.entities.InvitationRequest;
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
    private SimpMessagingTemplate simpMessagingTemplate;

    @Resource
    private MessageManagementClient messageManagementClient;


    @MessageMapping("/chat")
//    @SendTo("/user/queue/chat")
    public void processChatMessage(Message message){
        log.info("message is: "+message);
        System.out.println(message);
        long receiverId = message.getReceiverId();
        messageManagementClient.saveMessage(message);
        simpMessagingTemplate.convertAndSend("/queue/"+receiverId+"/chat", message);
        System.out.println("receiver id is: "+receiverId);
    }


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
