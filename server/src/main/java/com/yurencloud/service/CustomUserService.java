package com.yurencloud.service;

import com.yurencloud.mapper.UserMapper;
import com.yurencloud.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

public class CustomUserService implements UserDetailsService { //1
	@Autowired
	UserMapper userMapper;

	@Override
	public UserDetails loadUserByUsername(String username) { //2
		User user = userMapper.selectByUsername(username);
		if(user == null){
			throw new UsernameNotFoundException("用户名不存在");
		}

		return user;
	}

}
