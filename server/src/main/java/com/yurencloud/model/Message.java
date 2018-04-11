package com.yurencloud.model;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@NoArgsConstructor
public class Message implements Serializable {

    private static final long serialVersionUID = 1L;

    //无需返回http的状态码，因为服务器会自动返回

    //操作的成功和失败，比如删除，创建，搜索，获取
    private Boolean result;

    //文字提示内容，删除成功，下载成功
    private String content;

    //携带的对象信息，获取的信息对象，列表数据等
    private Object data;

    public Message(Boolean result) {
        this.result = result;
    }

    public Message(Boolean result, String content) {
        this.result = result;
        this.content = content;
    }

    public Message(Boolean result, Object data) {
        this.result = result;
        this.data = data;
    }

    public Message(Boolean result, String content, Object data) {
        this.result = result;
        this.content = content;
        this.data = data;
    }

    public Message(Object data) {
        this.data = data;
    }
}
