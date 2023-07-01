package com.userManagement.dao;

import com.commons.entities.Connection;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.HashOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;

@Repository
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
//        System.out.println(list);
        hashOps.put(CONNECTION_DICT_KEY, String.valueOf(connection.getReceiverId()), list);
    }

    public List<Connection> getConnections(long userId){
        HashOperations<String, String, List<Connection>> hashOps = redisTemplate.opsForHash();
        return hashOps.get(CONNECTION_DICT_KEY, String.valueOf(userId));
    }

    public void updateConnection(Connection connection){
        HashOperations<String, String, List<Connection>> hashOps = redisTemplate.opsForHash();
        List<Connection> connections = getConnections(connection.getReceiverId());
        for (Connection connection1: connections){
            if (connection1.getSenderId() == connection.getSenderId()){
                connection1.setHandled(connection.getHandled());
            }
        }
        hashOps.put(CONNECTION_DICT_KEY, String.valueOf(connection.getReceiverId()), connections);
    }

}
