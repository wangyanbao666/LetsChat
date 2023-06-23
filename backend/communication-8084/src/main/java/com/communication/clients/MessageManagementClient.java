package com.communication.clients;

import com.commons.entities.CommonResult;
import com.commons.entities.Message;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;
import java.util.Map;

@FeignClient(value = "MESSAGE-MANAGEMENT")
@Component
public interface MessageManagementClient {
    @PostMapping("message/save")
    CommonResult saveMessage(@RequestBody Message message);

}
