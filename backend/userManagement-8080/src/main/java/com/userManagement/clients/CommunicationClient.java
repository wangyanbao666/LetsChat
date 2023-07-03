package com.userManagement.clients;

import com.commons.entities.Connection;
import com.commons.entities.InvitationRequest;
import com.commons.entities.User;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(value = "WEBSOCKET-COMMUNICATION")
@Component
public interface CommunicationClient {
    @PostMapping("connection/send")
    void sendInvitation(@RequestBody Connection connection);

    @PostMapping("connection/result")
    void sendInvitationHandleResult(@RequestBody InvitationRequest invitationRequest);
}
