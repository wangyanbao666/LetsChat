package com.userManagement.dao;

import com.commons.entities.User;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;


@Mapper
public interface UserDao {
    void createTable();
    User getUserById(@Param("id") long id);
    User getUserByName(@Param("username") String username);
    void insertUser(@Param("user") User user);

//    may be replaced with more specific conditions
    void updateUser(@Param("user") User user);
}
