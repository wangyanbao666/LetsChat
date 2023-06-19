package com.messageManagement.services;

import com.commons.entities.CommonResult;
import com.commons.entities.Message;
import com.messageManagement.dao.MessageDao;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class MessageService {
    @Resource
    private MessageDao messageDao;

    public CommonResult<Map<Long, List<Message>>> getChatHistory(long id){
        Map<Long, List<Message>> chatHistory = new HashMap<>();
//        construct a map: k: userId, v: list of message ordered by datetime
        try {
            List<Message> messagesSent = messageDao.getMessageBySenderId(id);
            List<Message> messagesReceived = messageDao.getMessageByReceiverId(id);
            for (Message message: messagesSent){
                long receiverId = message.getReceiverId();
                chatHistory.putIfAbsent(receiverId, new ArrayList<>());
                chatHistory.get(receiverId).add(message);
            }
            for (Message message: messagesReceived){
                long senderId = message.getSenderId();
                chatHistory.putIfAbsent(senderId, new ArrayList<>());
                chatHistory.get(senderId).add(message);
            }
            return new CommonResult(200, "chat history loaded successfully.", chatHistory);
        } catch (Exception e){
            System.out.println(Arrays.toString(e.getStackTrace()));
            return new CommonResult(400, "failed to load chat history.", null);
        }
    }

    public CommonResult saveMessage(Message message){
        try {
            messageDao.insertMessage(message);
            return new CommonResult(200, "message saved successfully", null);
        } catch (Exception e){
            return new CommonResult(400, "failed to save the message.", null);
        }
    }

    public CommonResult updateMessage(Message message){
        try {
            messageDao.updateMessage(message);
            return new CommonResult(200, "message updated successfully", null);
        } catch (Exception e){
            return new CommonResult(400, "failed to update the message.", null);
        }
    }

    public CommonResult updateMessage(List<Message> message){
        try {
            messageDao.updateMessages(message);
            return new CommonResult(200, "message updated successfully", null);
        } catch (Exception e){
            return new CommonResult(400, "failed to update the message.", null);
        }
    }
}
