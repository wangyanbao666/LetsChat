package com.userManagement;

import com.commons.entities.User;
import com.userManagement.dao.UserDao;
import jakarta.annotation.Resource;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.Arrays;

@SpringBootTest
public class TestUserDao {
    @Resource
    private UserDao userDao;

    @Test
    public void test1(){
        User user = userDao.getUserByName("test1");
        System.out.println(user);
    }

    @Test
    public void Test2(){
        User user = new User();
        user.setUsername("abc");
        user.setConnections(Arrays.asList(1L,2L,3L));
        user.setGroupIds(Arrays.asList(1L,2L,3L));
        userDao.insertUser(user);
    }
    @Test
    public void Test3(){
        User user = new User();
        user.setId(4);
        user.setUsername("abc");
        user.setPassword("1234567");
        user.setConnections(Arrays.asList(1L,2L,3L,4L,5L));
        user.setGroupIds(Arrays.asList(1L,2L,3L));
        userDao.updateUser(user);
    }
}
