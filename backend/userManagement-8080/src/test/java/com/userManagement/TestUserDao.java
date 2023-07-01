package com.userManagement;

import com.commons.entities.Connection;
import com.commons.entities.User;
import com.userManagement.dao.UserDao;
import com.userManagement.services.PublishConnectionRequestService;
import com.userManagement.services.UserService;
import jakarta.annotation.Resource;
import org.junit.jupiter.api.Test;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@SpringBootTest
@EnableConfigurationProperties
public class TestUserDao {
    @Resource
    private UserDao userDao;

    @Resource
    private PublishConnectionRequestService publishConnectionRequestService;

    @Resource
    private UserService userService;

    @Test
    public void test1(){
        User user = userDao.getUserByName("test1");
        System.out.println(user);
    }

    @Test
    public void test2(){
        User user = new User();
        user.setUsername("abc");
        user.setConnections(Arrays.asList(1L,2L,3L));
        user.setGroupIds(Arrays.asList(1L,2L,3L));
        userDao.insertUser(user);
    }
    @Test
    public void test3(){
        User user = new User();
        user.setId(4);
        user.setUsername("abc");
        user.setPassword("1234567");
        user.setConnections(Arrays.asList(1L,2L,3L,4L,5L));
        user.setGroupIds(Arrays.asList(1L,2L,3L));
        userDao.updateUser(user);
    }

    @Test
    public void test4(){
        List<Long> list = new ArrayList<>();
        list.add(1L);
        list.add(2L);
        userDao.getUserByIds(list);
    }

    @Test
    public void test5(){
        publishConnectionRequestService.createNewQueue("wyb");
    }
    @Test
    public void test6(){
        Connection connection = new Connection();
        connection.setSenderName("wyb");
        connection.setReceiverName("wybbb");
        userService.publishConnectionRequest(connection);
//        userService.
    }
}
