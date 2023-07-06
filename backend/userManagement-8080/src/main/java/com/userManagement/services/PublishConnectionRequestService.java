package com.userManagement.services;

import com.commons.entities.Connection;
import com.commons.entities.InvitationRequest;
import com.commons.entities.User;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.userManagement.clients.CommunicationClient;
import com.userManagement.dao.RedisDao;
import com.userManagement.manager.QueueManager;
import jakarta.annotation.Resource;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.data.redis.core.HashOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@Slf4j
public class PublishConnectionRequestService {
    private final RabbitTemplate rabbitTemplate;
    private final QueueManager queueManager;
    private final RedisDao redisDao;
    private CommunicationClient communicationClient;

    @Value("${connection.exchange-name}")
    private String connectionExchangerName;


    @Autowired
    PublishConnectionRequestService(RabbitTemplate rabbitTemplate, QueueManager queueManager, RedisDao redisDao, CommunicationClient communicationClient){
        this.rabbitTemplate = rabbitTemplate;
        this.queueManager = queueManager;
        this.redisDao = redisDao;
        this.communicationClient = communicationClient;
    }

    public void publishConnectionRequest(Connection connection){
        List<Connection> connections = redisDao.getConnections(connection.getReceiverId());
        if (connections!=null){
            for (Connection connection1: connections){
                log.info(connection1.toString());
                if (Objects.equals(connection1.getSenderName(), connection.getSenderName())){
                    if (connection1.getHandled()!=2){
                        return;
                    }
                    System.out.println(connection);
                    redisDao.updateConnection(connection);
                    communicationClient.sendInvitation(connection);
                    return;
                }
            }
        }
        redisDao.insertConnection(connection);
        communicationClient.sendInvitation(connection);
    }

    public List<Connection> getConnections(long id){
        List<Connection> connections = redisDao.getConnections(id);
        return connections;
    }

    public boolean handleConnectionRequest(Connection connection, User user){
        try {
            InvitationRequest invitationRequest = new InvitationRequest();
            invitationRequest.setUser(user);
            invitationRequest.setConnection(connection);
            redisDao.updateConnection(connection);
            communicationClient.sendInvitationHandleResult(invitationRequest);
            return true;
        } catch (Exception e){
            log.error(Arrays.toString(e.getStackTrace()));
            return false;
        }
    }

    private boolean publishToMQ(User user, String name, HashMap<String, Object> map) throws JsonProcessingException {
        ObjectMapper objectMapper = new ObjectMapper();
        byte[] serializedUserObject = objectMapper.writeValueAsBytes(map);
        log.info("user: "+user);
        log.info("exchanger name: "+connectionExchangerName);
        log.info("receiver name: "+name);
        rabbitTemplate.convertAndSend(connectionExchangerName, name, serializedUserObject);
        return true;
    }

    public void createNewQueue(String queueName){
        try {
            if (!queueManager.queueExists(queueName)){
                queueManager.createNewQueue(queueName);
            }
        } catch (Exception e){
            log.error(Arrays.toString(e.getStackTrace()));
        }

    }
}
