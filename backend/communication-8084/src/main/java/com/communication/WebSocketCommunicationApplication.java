package com.communication;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;

@SpringBootApplication(exclude = {DataSourceAutoConfiguration.class})
public class WebSocketCommunicationApplication {
    public static void main(String[] args) {
        SpringApplication.run(WebSocketCommunicationApplication.class, args);
    }
}
