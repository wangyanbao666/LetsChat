package com.userManagement.dao;

import com.commons.entities.User;
import com.commons.entities.Verification;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Component;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;


@Mapper
public interface UserDao {
    void createTable();
    User getUserById(@Param("id") long id);
    List<User> getUserByIds(@Param("ids") List<Long> ids);
    User getUserByName(@Param("username") String username);
    User getUserByEmail(@Param("email") String email);
    List<User> searchUserByNameStart(@Param("username") String username);

    Verification getVerificationByCode(@Param("verificationCode") String verificationCode);
    void insertUser(@Param("user") User user, @Param("verificationCode") String verificationCode, @Param("timestamp") Timestamp timestamp);

//    may be replaced with more specific conditions
    void updateUser(@Param("user") User user);
    void updateUsername(@Param("id") long id, @Param("username") String newUsername);
    void updateUserConnection(@Param("username") String username, @Param("connections") List<Long> connections);
    void updateVerified(@Param("email") String email);
    void updateVerificationCode(@Param("email") String email, @Param("verificationCode") String verificationCode, @Param("timestamp") Timestamp timestamp);

}
