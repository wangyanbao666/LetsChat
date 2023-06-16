package com.commons;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Message {
    private long id;
    private String content;
    private long senderId;
    private long receiverId;
    private Date timestamp;

//    sent, seen, delivered
    private int flag;

}
