package com.yurencloud.controller.api;

import com.yurencloud.mapper.UserMapper;
import com.yurencloud.model.Message;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

//验证各种信息
@RestController
public class CheckController {

    @Autowired
    private UserMapper userMapper;

    @ApiOperation(value = "判断用户名是否已经存在", notes = "根据url的id来获取用户详细信息")
    @ApiImplicitParam(name = "username", value = "用户名", required = true, dataType = "String", paramType = "body")
    @PostMapping("/public/check/username")
    public Message checkUsernameExists(@RequestParam("username") String username) {
        //使用@RequestParam时一定要用Content-Type:application/x-www-form-urlencoded
        Boolean result = userMapper.selectByUsername(username) != null;
        return new Message(result, result ? "用户名已经存在！" : "用户名不存在。");
    }

}
