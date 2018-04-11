package com.yurencloud.controller.api;

import com.yurencloud.mapper.UserMapper;
import com.yurencloud.model.Message;
import com.yurencloud.model.User;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;

@RestController
public class InfoController {

    @Autowired
    UserMapper userMapper;

    @ApiOperation(value="登入用户获取自己的个人信息", notes="根据token获取用户信息")
    @ApiImplicitParam(name = "token", value = "授权票据", required = true, dataType = "String", paramType = "header")
    @GetMapping("/userInfo")
    public Message getUserById (Principal principal){
        return new Message(true,"个人信息获取成功！",userMapper.selectByUsername(principal.getName()));
    }


}
