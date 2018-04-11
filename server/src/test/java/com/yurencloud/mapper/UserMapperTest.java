package com.yurencloud.mapper;


import java.util.List;

import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import com.yurencloud.model.User;


@RunWith(SpringRunner.class)
@SpringBootTest
public class UserMapperTest {

    @Autowired
    private UserMapper UserMapper;

    @Test
    public void testInsert() throws Exception {
//        UserMapper.insert(new UserEntity("aa", "a123456", UserSexEnum.MAN));
//        UserMapper.insert(new UserEntity("bb", "b123456", UserSexEnum.WOMAN));
//        UserMapper.insert(new UserEntity("cc", "b123456", UserSexEnum.WOMAN));

//        Assert.assertEquals(3, UserMapper.findAll().size());
    }

    @Test
    public void testQuery() throws Exception {
//        List<User> users = UserMapper.findAll();
//        System.out.println(users.toString());
    }


    @Test
    public void testUpdate() throws Exception {
//        User user = UserMapper.findById(1);
//        System.out.println(user.toString());
//        user.setNickname("neo");
//        UserMapper.update(user);
//        Assert.assertTrue(("neo".equals(UserMapper.findById(1).getNickname())));
    }

}