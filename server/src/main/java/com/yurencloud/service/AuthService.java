package com.yurencloud.service;


import com.yurencloud.model.Message;
import com.yurencloud.model.User;

public interface AuthService {
    Message register(User user);
    String login(String username, String password);
    String refresh(String oldToken);
}