package com.messageManagement;

import com.messageManagement.dao.MessageDao;
import jakarta.annotation.Resource;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class MessageManagementApplication implements ApplicationRunner {
    @Resource
    private MessageDao messageDao;

    public static void main(String[] args) {
        SpringApplication.run(MessageManagementApplication.class, args);
    }

    @Override
    public void run(ApplicationArguments args) throws Exception {
        messageDao.createTable();
    }
}
