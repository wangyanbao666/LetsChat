package com.communication.dao;

import com.commons.entities.User;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Component;

import java.sql.Timestamp;

@Mapper
public interface UserDao {
    User getUserById(@Param("id") long id);
    void updateUserStatusOnline(@Param("id") long id);
    void updateUserStatusOffline(@Param("id") long id, @Param("last_online") Timestamp lastOnline);
}
