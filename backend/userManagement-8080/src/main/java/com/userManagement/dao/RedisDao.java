package com.userManagement.dao;

import com.commons.entities.Connection;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.HashOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Repository;

import java.util.*;

/**
 * when inserting or updating the connection, we will operate on
 * both the receiver and the sender
 */
@Repository
@Slf4j
public class RedisDao {
    private final RedisTemplate redisTemplate;
    private final String CONNECTION_DICT_KEY = "connection";
    private final String REMARK_DICT_KEY = "remark";

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
            if (Objects.equals(connection1.getSenderId(), connection.getSenderId()) && Objects.equals(connection1.getReceiverId(), connection.getReceiverId())){
                connection1.setHandled(connection.getHandled());
                connection1.setDatetime(connection.getDatetime());
            }
        }
        List<Connection> connections2 = getConnections(connection.getSenderId());
        for (Connection connection1: connections2){
            if (Objects.equals(connection1.getSenderId(), connection.getSenderId()) && Objects.equals(connection1.getReceiverId(), connection.getReceiverId())){
                connection1.setHandled(connection.getHandled());
                connection1.setDatetime(connection.getDatetime());
            }
        }
        hashOps.put(CONNECTION_DICT_KEY, String.valueOf(connection.getReceiverId()), connections);
        hashOps.put(CONNECTION_DICT_KEY, String.valueOf(connection.getSenderId()), connections2);
    }

    public void addRemark(long userId, long friendId, String remark){
        HashOperations<String, Long, HashMap<Long, String>> hashOperations = redisTemplate.opsForHash();
        if (hashOperations.get(REMARK_DICT_KEY, userId)==null){
            hashOperations.put(REMARK_DICT_KEY, userId, new HashMap<>());
        }
        HashMap<Long, String> map = hashOperations.get(REMARK_DICT_KEY, userId);
        assert map != null;
        map.put(friendId, remark);
        hashOperations.put(REMARK_DICT_KEY, userId, map);

    }

    public Map<Long, String> getRemark(long userId){
        HashOperations<String, Long, HashMap<Long, String>> hashOperations = redisTemplate.opsForHash();
        return hashOperations.get(REMARK_DICT_KEY, userId);
    }

    public void removeRemark(long userId, long friendId){
        HashOperations<String, Long, HashMap<Long, String>> hashOperations = redisTemplate.opsForHash();
        HashMap<Long, String> map = hashOperations.get(REMARK_DICT_KEY, userId);
        assert map != null;
        map.remove(userId);
        hashOperations.put(REMARK_DICT_KEY, userId, map);    }

}
