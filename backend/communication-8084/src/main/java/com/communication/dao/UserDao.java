package com.communication.dao;

import com.commons.entities.User;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Component;

@Mapper
public interface UserDao {
    User getUserById(@Param("id") long id);
}
