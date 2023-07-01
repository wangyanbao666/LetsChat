package com.userManagement.manager;

import jakarta.annotation.Resource;
import org.springframework.amqp.core.AmqpAdmin;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.DirectExchange;
import org.springframework.amqp.core.Queue;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class QueueManager {

    private final AmqpAdmin amqpAdmin;
    private final DirectExchange directExchange;
    @Autowired
    QueueManager(AmqpAdmin amqpAdmin, DirectExchange directExchange){
        this.amqpAdmin = amqpAdmin;
        this.directExchange = directExchange;
    }

    public void createNewQueue(String queueName){
        Queue queue = new Queue(queueName);
        amqpAdmin.declareQueue(queue);
        addBinding(queue, queueName);
    }

    public void addBinding(Queue queue, String queueName){
        amqpAdmin.declareBinding(BindingBuilder.bind(queue).to(directExchange).with(queueName));
    }

    public boolean queueExists(String queueName) {
        return amqpAdmin.getQueueProperties(queueName) != null;
    }
}
