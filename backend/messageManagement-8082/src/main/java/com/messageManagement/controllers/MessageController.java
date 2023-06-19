package com.messageManagement.controllers;

import com.commons.entities.CommonResult;
import com.commons.entities.Message;
import com.messageManagement.services.MessageService;
import jakarta.annotation.Resource;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class MessageController {
    @Resource
    private MessageService messageService;

    @PostMapping("message/getHistory")
    public CommonResult getChatHistory(@RequestParam("id") long id){
        return messageService.getChatHistory(id);
    }

    @PostMapping("message/save")
    public CommonResult saveMessage(@RequestBody Message message){
        return messageService.saveMessage(message);
    }

    @PostMapping("message/update")
    public CommonResult updateMessage(@RequestBody List<Message> messages){
        return messageService.updateMessage(messages);
    }
}
