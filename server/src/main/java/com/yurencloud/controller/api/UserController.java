package com.yurencloud.controller.api;

import com.yurencloud.mapper.UserMapper;
import com.yurencloud.model.User;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
public class UserController {

    @Autowired
    UserMapper userMapper;

    @ApiOperation(value="获取用户详细信息", notes="根据url的id来获取用户详细信息")
    @ApiImplicitParam(name = "id", value = "用户ID", required = true, dataType = "Integer", paramType = "path")
    @GetMapping("/user/{id}")
    public User getUserById (@PathVariable(value = "id") Integer id){
        return userMapper.selectByPrimaryKey(id);
    }


}
