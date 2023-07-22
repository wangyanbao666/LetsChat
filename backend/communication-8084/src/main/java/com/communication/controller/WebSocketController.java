package com.communication.controller;


import com.commons.entities.*;
import com.communication.clients.MessageManagementClient;
import com.communication.dao.UserDao;
import com.communication.service.WebSocketService;
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
    @Resource
    private WebSocketService webSocketService;


    @MessageMapping("/chat")
    public void processChatMessage(Message message){
        webSocketService.processChatMessage(message);
    }


    @PostMapping("connection/send")
    public void sendInvitation(@RequestBody Connection connection){
        webSocketService.sendInvitation(connection);
    }

    @PostMapping("connection/result")
    public void sendInvitationHandleResult(@RequestBody InvitationRequest invitationRequest){
        webSocketService.sendInvitationHandleResult(invitationRequest);
    }
}
