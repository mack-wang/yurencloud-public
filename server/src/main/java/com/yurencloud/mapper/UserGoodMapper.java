package com.yurencloud.mapper;

import com.yurencloud.model.UserGood;
import com.yurencloud.model.UserGoodExample;
import java.util.List;
import org.apache.ibatis.annotations.Param;

public interface UserGoodMapper {
    long countByExample(UserGoodExample example);

    int deleteByExample(UserGoodExample example);

    int insert(UserGood record);

    int insertSelective(UserGood record);

    List<UserGood> selectByExample(UserGoodExample example);

    int updateByExampleSelective(@Param("record") UserGood record, @Param("example") UserGoodExample example);

    int updateByExample(@Param("record") UserGood record, @Param("example") UserGoodExample example);
}