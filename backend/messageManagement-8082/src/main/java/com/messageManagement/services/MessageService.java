package com.messageManagement.services;

import com.commons.entities.CommonResult;
import com.commons.entities.Message;
import com.messageManagement.dao.MessageDao;
import jakarta.annotation.Resource;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@Slf4j
public class MessageService {
    @Resource
    private MessageDao messageDao;

    public CommonResult<Map<Long, List<Message>>> getChatHistory(long id){
        Map<Long, List<Message>> chatHistory = new HashMap<>();
//        construct a map: k: userId, v: list of message ordered by datetime
        try {
            List<Message> messages = messageDao.getMessageBySenderIdReceiverId(id);
            for (Message message: messages){
                long friendId;
                if (message.getSenderId() == id){
                    friendId = message.getReceiverId();
                }
                else {
                    friendId = message.getSenderId();
                }
                chatHistory.putIfAbsent(friendId, new ArrayList<>());
                chatHistory.get(friendId).add(message);
            }
            System.out.println(chatHistory);
            return new CommonResult(200, "chat history loaded successfully.", chatHistory);
        } catch (Exception e){
            log.error(Arrays.toString(e.getStackTrace()));
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
