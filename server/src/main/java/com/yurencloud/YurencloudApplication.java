package com.yurencloud;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

@SpringBootApplication
@MapperScan("com.yurencloud.mapper")
@EnableSwagger2
public class YurencloudApplication {
	public static void main(String[] args) {
		SpringApplication.run(YurencloudApplication.class, args);
	}
}
