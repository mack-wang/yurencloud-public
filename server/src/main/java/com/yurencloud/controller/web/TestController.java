package com.yurencloud.controller.web;

import com.github.pagehelper.Page;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.yurencloud.mapper.*;
import com.yurencloud.model.*;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.*;

@RestController
public class TestController {
    private final Logger logger = LoggerFactory.getLogger(this.getClass());


    @Autowired
    UserMapper userMapper;

    @Autowired
    RoleMapper roleMapper;

    @Autowired
    AccountMapper accountMapper;

    @Autowired
    ArticleMapper articleMapper;

    @Autowired
    CatalogMapper catalogMapper;

    @GetMapping("/public/test/jwt")
    public String jwt(){

        Map<String, Object> claims = new HashMap<>();
        claims.put("username","tom");

        Calendar c = Calendar.getInstance();
        c.setTime(new Date());
        //1天内有效
        c.add(Calendar.DATE,1);

        return Jwts.builder()
                .setClaims(claims)
                .setExpiration(c.getTime())
                .signWith(SignatureAlgorithm.HS512, "secret") //采用什么算法是可以自己选择的，不一定非要采用HS512
                .compact();
    }


    @GetMapping("/public/test/user")
    public User user(){
        return userMapper.selectByUsername("tom");
    }

    @GetMapping("/success")
    public String success(Principal principal){
        return "success"+principal.getName();
    }

    @GetMapping("/public/test/user/lazy")
    public User userLazy(){
        return userMapper.selectByPrimaryKey(1);
    }

    @GetMapping("/public/test/article/lazy")
    public Article articleLazy(){
        Article article = articleMapper.selectByPrimaryKey(1);
        return article;
    }

    @GetMapping("/public/test/account")
    public Account account(){
        return accountMapper.selectByPhone("15757130092");
    }


    @GetMapping("/public/test/logger")
    public void log(){
        logger.info("你好1");
        logger.error("你好2");
    }

    @GetMapping("/public/test/null")
    public User nullUser(){
        return null;
    }

//    @GetMapping("/public/test/message")
//    public Message userMessage(){
//        return new Message("success",userMapper.selectByUsername("tom"));
//    }

    @PostMapping("/public/test/param")
    public String param(@RequestParam("username") String username){
        return username;
    }



    @GetMapping("/public/get/user")
    public List<Catalog> getUser(){
        Integer id = 2;
        CatalogExample example = new CatalogExample();
        CatalogExample.Criteria criteria = example.createCriteria();
        criteria.andIdEqualTo(id);
        criteria.andPidEqualTo(id);
        criteria.andGidEqualTo(id);

        return catalogMapper.selectByExample(example);
    }

}
