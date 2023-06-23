package com.communication.controller;


import com.commons.entities.Message;
import com.communication.clients.MessageManagementClient;
import jakarta.annotation.Resource;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.messaging.simp.user.SimpUser;
import org.springframework.messaging.simp.user.SimpUserRegistry;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;

import java.security.Principal;

@Controller
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
}
