package com.communication.config;

import com.communication.service.WebSocketService;
import jakarta.annotation.Resource;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Lazy;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Configuration
@EnableWebSocketMessageBroker
@Slf4j
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {
    private final Map<String, String> activeSessions = new ConcurrentHashMap<>();

    @Resource
    @Lazy
    private WebSocketService webSocketService;

    @Override
    public void configureMessageBroker(MessageBrokerRegistry messageBrokerRegistry){
        messageBrokerRegistry.enableSimpleBroker("/queue");
        messageBrokerRegistry.setApplicationDestinationPrefixes("/app");
//        messageBrokerRegistry.setUserDestinationPrefix("/user");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry stompEndpointRegistry){
        stompEndpointRegistry.addEndpoint("/websocket").setAllowedOrigins("*");
    }

    @Override
    public void configureClientInboundChannel(ChannelRegistration registration){
        registration.interceptors(new ChannelInterceptor() {
            @Override
            public Message<?> preSend(Message<?> message, MessageChannel channel) {
                StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);
                if(StompCommand.CONNECT.equals(accessor.getCommand())){
                    String userId = accessor.getFirstNativeHeader("userId");
                    log.info("user id: "+userId);
                    String sessionId = (String) accessor.getHeader("simpSessionId");
                    log.info("session id: "+sessionId);
                    activeSessions.put(sessionId, userId);
                    webSocketService.goOnline(Long.parseLong(userId));
                    System.out.println("Connect ");
                } else if(StompCommand.SUBSCRIBE.equals(accessor.getCommand())){
                    System.out.println("Subscribe ");
                } else if(StompCommand.SEND.equals(accessor.getCommand())){
                    System.out.println("Send message " );
                } else if(StompCommand.DISCONNECT.equals(accessor.getCommand())){
                    String sessionId = (String) accessor.getHeader("simpSessionId");
                    log.info("session id: "+sessionId);
                    String userId = activeSessions.get(sessionId);
                    log.info("user id: "+userId);
                    System.out.println("Exit ");
                    webSocketService.goOffline(Long.parseLong(userId));
                } else {
                }
                return message;
            }
        });
    }

}
