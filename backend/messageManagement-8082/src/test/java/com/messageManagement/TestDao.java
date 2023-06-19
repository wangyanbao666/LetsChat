package com.messageManagement;


import com.commons.entities.Message;
import com.messageManagement.dao.MessageDao;
import jakarta.annotation.Resource;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;

@SpringBootTest
public class TestDao {
    @Resource
    private MessageDao messageDao;

    @Test
    public void test0(){
        List<Message> messageByReceiverId = messageDao.getMessageByReceiverId(2);
        System.out.println(messageByReceiverId);
    }
    @Test
    public void test1(){
        List<Message> messageBySenderId = messageDao.getMessageBySenderId(2);
        System.out.println(messageBySenderId);
    }

    @Test
    public void test2(){
        Message message = new Message();
        message.setContent("a test message3");
        message.setSenderId(2);
        message.setReceiverId(1);
        message.setDatetime(Timestamp.valueOf(LocalDateTime.now()));
        messageDao.insertMessage(message);
    }

    @Test
    public void test3(){
        List<Message> messageByReceiverId = messageDao.getMessageByReceiverId(2);
        Message message = messageByReceiverId.get(0);
        message.setFlag(2);
        messageDao.updateMessage(message);
    }

}
