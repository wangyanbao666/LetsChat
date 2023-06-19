package com.messageManagement.dao;

import com.commons.entities.Message;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface MessageDao {
    void createTable();
    List<Message> getMessageBySenderId(@Param("id") long id);
    List<Message> getMessageByReceiverId(@Param("id") long id);
    List<Message> getMessageBySenderIdReceiverId(@Param("senderId") long senderId, @Param("receiverId") long receiverId);
    void insertMessage(@Param("message") Message message);
    void updateMessage(@Param("message") Message message);
    void updateMessages(@Param("messages") List<Message> messages);

}
