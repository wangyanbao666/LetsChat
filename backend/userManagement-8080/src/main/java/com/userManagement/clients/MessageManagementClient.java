package com.userManagement.clients;

import com.commons.entities.CommonResult;
import com.commons.entities.Message;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;
import java.util.Map;

@FeignClient(value = "MESSAGE-MANAGEMENT")
@Component
public interface MessageManagementClient {
    @PostMapping("message/getHistory")
    CommonResult<Map<Long, List<Message>>> getChatHistory(@RequestParam("id") long id);

}
