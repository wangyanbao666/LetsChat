package com.userManagement.dao;

import com.commons.entities.Connection;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.HashOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

/**
 * when inserting or updating the connection, we will operate on
 * both the receiver and the sender
 */
@Repository
@Slf4j
public class RedisDao {
    private final RedisTemplate redisTemplate;
    private final String CONNECTION_DICT_KEY = "connection";

    @Autowired
    public RedisDao(RedisTemplate redisTemplate){
        this.redisTemplate = redisTemplate;
    }

    public void insertConnection(Connection connection){
        HashOperations<String, String, List<Connection>> hashOps = redisTemplate.opsForHash();
        List<Connection> list = hashOps.get(CONNECTION_DICT_KEY, String.valueOf(connection.getReceiverId()));
        if (list == null){
            list = new ArrayList<>();
        }
        list.add(connection);
        List<Connection> list2 = hashOps.get(CONNECTION_DICT_KEY, String.valueOf(connection.getSenderId()));
        if (list2 == null){
            list2 = new ArrayList<>();
        }
        list2.add(connection);
//        System.out.println(list);
        hashOps.put(CONNECTION_DICT_KEY, String.valueOf(connection.getReceiverId()), list);
        hashOps.put(CONNECTION_DICT_KEY, String.valueOf(connection.getSenderId()), list2);
    }

    public List<Connection> getConnections(long userId){
        HashOperations<String, String, List<Connection>> hashOps = redisTemplate.opsForHash();
        return hashOps.get(CONNECTION_DICT_KEY, String.valueOf(userId));
    }

    public void updateConnection(Connection connection){
        log.info("state: "+String.valueOf(connection.getHandled()));
        HashOperations<String, String, List<Connection>> hashOps = redisTemplate.opsForHash();
        List<Connection> connections = getConnections(connection.getReceiverId());
        for (Connection connection1: connections){
            if (Objects.equals(connection1.getUuid(), connection.getUuid())){
                connection1.setHandled(connection.getHandled());
                connection1.setDatetime(connection.getDatetime());
            }
        }
        List<Connection> connections2 = getConnections(connection.getSenderId());
        for (Connection connection1: connections2){
            if (Objects.equals(connection1.getUuid(), connection.getUuid())){
                connection1.setHandled(connection.getHandled());
                connection1.setDatetime(connection.getDatetime());
            }
        }
        hashOps.put(CONNECTION_DICT_KEY, String.valueOf(connection.getReceiverId()), connections);
        hashOps.put(CONNECTION_DICT_KEY, String.valueOf(connection.getSenderId()), connections2);
    }

}
