package com.commons.entities;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.sql.Timestamp;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class Connection implements Serializable {
    private String senderName;
    private long senderId;
    private String receiverName;
    private long receiverId;
    private int handled;
    private Timestamp datetime;

    public Connection(){
        handled = 0;
        datetime = Timestamp.valueOf(LocalDateTime.now());
    }
}
