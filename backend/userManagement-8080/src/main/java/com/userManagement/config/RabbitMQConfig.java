package com.userManagement.config;

import org.springframework.amqp.core.DirectExchange;
import org.springframework.amqp.core.ExchangeBuilder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {
    @Value("${connection.exchange-name}")
    private String connectionExchangerName;

    @Bean
    public DirectExchange directExchange(){
        return ExchangeBuilder.directExchange(connectionExchangerName).build();
    }
}
