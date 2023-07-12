package com.userManagement.dao;

import com.commons.entities.User;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Component;

import java.util.List;


@Mapper
public interface UserDao {
    void createTable();
    User getUserById(@Param("id") long id);
    List<User> getUserByIds(@Param("ids") List<Long> ids);
    User getUserByName(@Param("username") String username);
    void insertUser(@Param("user") User user);

//    may be replaced with more specific conditions
    void updateUser(@Param("user") User user);
    void updateUserConnection(@Param("username") String username, @Param("connections") List<Long> connections);
}
