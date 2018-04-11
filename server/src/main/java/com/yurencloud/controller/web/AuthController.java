package com.yurencloud.controller.web;


import com.yurencloud.component.JwtAuthenticationRequest;
import com.yurencloud.component.JwtAuthenticationResponse;
import com.yurencloud.model.Message;
import com.yurencloud.model.User;
import com.yurencloud.service.AuthService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.*;
import javax.servlet.http.HttpServletRequest;

@RestController
public class AuthController {

    private final Logger logger = LoggerFactory.getLogger(this.getClass());

    @Value("${jwt.header}")
    private String tokenHeader;

    @Autowired
    private AuthService authService;

    @PostMapping("/auth")
    public Message createAuthenticationToken(
            @RequestBody JwtAuthenticationRequest authenticationRequest) throws AuthenticationException {
        final String token = authService.login(authenticationRequest.getUsername(), authenticationRequest.getPassword());
        // Return the token
        return new Message(true,"成功获取token",token);
    }

    @GetMapping("/refresh")
    public ResponseEntity<?> refreshAndGetAuthenticationToken(
            HttpServletRequest request) throws AuthenticationException {
        String token = request.getHeader(tokenHeader);
        String refreshedToken = authService.refresh(token);
        if (refreshedToken == null) {
            return ResponseEntity.badRequest().body(null);
        } else {
            return ResponseEntity.ok(new JwtAuthenticationResponse(refreshedToken));
        }
    }

    //@RequestBody会自动将json的key和value转成相应实体的key-value及数据类型
    //如果传递的是日期时，要注意date得是 yyyy-MM-dd HH:mm 这样类型的，可省略末尾的分，时，等
    @PostMapping("/auth/register")
    public Message register(@RequestBody User user) throws AuthenticationException {
        return authService.register(user);
    }
}
