package com.commons.entities;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class User {
    private long id;
    private String username;
    private String password;
    private List<Long> connections = new ArrayList<>();
    private String email;
    private List<Long> groupIds = new ArrayList<>();;
    private int status;
    private Timestamp lastOnline;


}
