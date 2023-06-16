package com.commons;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class User {
    private long id;
    private String username;
    private String password;
    private long[] connections;
    private String email;
    private long[] groupIds;
    private int status;
    private Date lastOnline;


}
