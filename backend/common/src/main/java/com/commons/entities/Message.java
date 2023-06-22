package com.commons.entities;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.Date;

@Data
@AllArgsConstructor
public class Message {
    private long id;
    private String content;
    private long senderId;
    private long receiverId;
    private Timestamp datetime;

//    sent, seen, delivered
    private int flag;

    Message(){
        datetime = Timestamp.valueOf(LocalDateTime.now());
        flag = 0;
    }

}
