package com.userManagement.dao;

import com.commons.User;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;


@Mapper
public interface UserDao {
    User getUserById(@Param("id") long id);
    User getUserByName(@Param("username") String username);
    void insertUser(User user);

//    may be replaced with more specific conditions
    void updateUser(User user);
}
