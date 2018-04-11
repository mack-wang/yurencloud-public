package com.yurencloud.controller.api;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.yurencloud.mapper.ArticleMapper;
import com.yurencloud.mapper.CatalogMapper;
import com.yurencloud.model.*;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
public class CatalogController {

    @Autowired
    private CatalogMapper catalogMapper;

    @Autowired
    private ArticleMapper articleMapper;

    @ApiOperation(value="获取全部文章目录", notes="公开")
    @GetMapping("/public/catalog")
    public Message getAllCatalog (){
        CatalogExample example = new CatalogExample();
        return new Message(true,catalogMapper.selectByExample(example)) ;
    }

    @ApiOperation(value="获取未关闭的全部文章目录", notes="公开")
    @GetMapping("/public/catalog/menu")
    public Message getCatalogMenu (){
        CatalogExample example = new CatalogExample();
        example.or().andOffEqualTo((byte) 0);
        return new Message(catalogMapper.selectByExample(example)) ;
    }

    @ApiOperation(value="获取当前菜单下的所有目录", notes="公开")
    @ApiImplicitParam(name = "id", value = "目录菜单id",required = true, dataType = "Integer", paramType = "path")
    @GetMapping("/public/catalog/nav/{id}")
    public Message getCatalogNav (@PathVariable("id") Integer id){
        CatalogExample example = new CatalogExample();
        example.or().andPidEqualTo(id);
        example.or().andGidEqualTo(id);
        return new Message(catalogMapper.selectByExample(example)) ;
    }

    @ApiOperation(value = "获取全部文章目录分页", notes = "获取全部文章目录分页")
    @ApiImplicitParams(value = {
            @ApiImplicitParam(name = "page", value = "当前页数",required = true, dataType = "Integer", paramType = "query"),
            @ApiImplicitParam(name = "pageSize", value = "每页条数",required = true, dataType = "Integer", paramType = "query"),
    })
    @GetMapping("/public/catalog/page")
    public Message getAllCatalogPage (@RequestParam("page") Integer page,@RequestParam("pageSize") Integer pageSize){
        PageHelper.startPage(page, pageSize);
        CatalogExample example = new CatalogExample();
        example.setOrderByClause("id desc");
        List<Catalog> catalogs = catalogMapper.selectByExample(example);
        PageInfo pageInfo = new PageInfo(catalogs);
        return new Message(true,pageInfo) ;
    }

    @ApiOperation(value="获取目录的级联数组", notes="获取目录的级联数组")
    @ApiImplicitParam(name = "id", value = "目录id",required = true, dataType = "Integer", paramType = "path")
    @GetMapping("/public/catalog/cascader/{id}")
    public Message getCatalogCascader (@PathVariable("id") Integer id){
        Catalog three = catalogMapper.selectByPrimaryKey(id);
        Catalog second = catalogMapper.selectByPrimaryKey(three.getPid());
        List<Integer> list = new ArrayList<>();
        list.add(second.getPid());
        list.add(second.getId());
        list.add(id);
        return new Message(true,list) ;
    }

    @ApiOperation(value="修改目录名称", notes="修改目录名称")
    @ApiImplicitParams(value = {
        @ApiImplicitParam(name = "id", value = "目录id",required = true, dataType = "Integer", paramType = "body"),
        @ApiImplicitParam(name = "name", value = "目录名称",required = true, dataType = "String", paramType = "body"),
    })
    @PatchMapping("/catalog")
    public Message modifyCatalog (@RequestBody Catalog catalog){
        Integer count = catalogMapper.updateByPrimaryKeySelective(catalog);
        Boolean result = (count == 1);
        return new Message(result,result?"目录名称修改成功！":"目录名称修改失败！");
    }

    @ApiOperation(value="关闭/开启目录", notes="关闭/开启目录")
    @ApiImplicitParams(value = {
            @ApiImplicitParam(name = "id", value = "目录id",required = true, dataType = "Integer", paramType = "path"),
    })
    @PatchMapping("/catalog/off/{id}")
    public Message modifyCatalog (@PathVariable("id") Integer id){
        Catalog catalog = catalogMapper.selectByPrimaryKey(id);
        catalog.setOff(catalog.getOff()==0?(byte) 1:(byte) 0);
        catalogMapper.updateByPrimaryKeySelective(catalog);
        return new Message(true,catalog.getOff()==0?"目录开启成功！":"目录关闭成功！");
    }


    @ApiOperation(value = "删除指定目录及其子目录，并将该目录下的所有文章转为未定义目录 11", notes = "删除指定目录及其子目录，并将该目录下的所有文章转为未定义目录 11")
    @ApiImplicitParam(name = "id", value = "文章id",required = true, dataType = "Integer", paramType = "path")
    @DeleteMapping("/catalog/{id}")
    public Message deleteArticle(@PathVariable("id") Integer id){
        if(id == 1 || id == 6 || id == 11){
            return new Message(false,"未定义目录不得删除!");
        }
        Catalog catalog = catalogMapper.selectByPrimaryKey(id);
        //如果该目录是菜单目录
        List<Catalog> list = new ArrayList<>();
        if(catalog.getLevel()==0){
            //获取所有gid是他的二级目录
            CatalogExample example = new CatalogExample();
            example.or().andGidEqualTo(catalog.getId());
            list = catalogMapper.selectByExample(example);
        }

        //如果该目录是一级目录
        if(catalog.getLevel()==1){
            //获取所有pid是他的二级目录
            CatalogExample example = new CatalogExample();
            example.or().andPidEqualTo(catalog.getId());
            list = catalogMapper.selectByExample(example);
        }

        //如果该目录是二级目录
        if(catalog.getLevel()==2){
            list.add(catalog);
        }

        //把所有文章转移到未定义目录
        if(list.size()>0){
            ArticleExample example = new ArticleExample();
            List<Integer> ids = new ArrayList<>();
            for(Catalog item : list){
                ids.add(item.getId());
            }
            example.or().andCatalogIdIn(ids);
            Article target = new Article();
            target.setCatalogId(11);
            articleMapper.updateByExampleSelective(target,example);
        }

        // 转移完成后，直接删除所有目录
        // 不用管这个目录是几级的，获取id,pid,gid是这个目录的所有目录
        CatalogExample example = new CatalogExample();
        example.or().andIdEqualTo(id);
        example.or().andPidEqualTo(id);
        example.or().andGidEqualTo(id);
        catalogMapper.deleteByExample(example);

        return new Message(true,"目录删除成功!");
    }


    @ApiOperation(value="创建目录", notes="创建目录")
    @ApiImplicitParams(value = {
            @ApiImplicitParam(name = "id", value = "父级目录id", dataType = "Integer", paramType = "body"),
            @ApiImplicitParam(name = "name", value = "目录名称", dataType = "String", paramType = "body"),
    })
    @PostMapping("/catalog")
    public Message createCatalog (
            @RequestParam(value = "id",required = false ) Integer id,
            @RequestParam("name") String name
    ){
        // 如果没有指定父级目录，则是创建菜单
        Catalog catalog = new Catalog();
        catalog.setName(name);
        catalog.setOff((byte) 0);
        if(id==null){
            catalog.setLevel((byte) 0);
            catalog.setPid(0);
            catalog.setGid(0);
        }else{
            // 如果有父级目录
            Catalog catalog1 = catalogMapper.selectByPrimaryKey(id);
            if(catalog1.getLevel()==0){
                catalog.setLevel((byte) 1);
                catalog.setPid(id);
                catalog.setGid(0);
            }else{
                catalog.setLevel((byte) 2);
                catalog.setPid(id);
                catalog.setGid(catalog1.getPid());
            }
        }
        catalogMapper.insert(catalog);
        return new Message(true,"目录创建成功！");
    }

    @ApiOperation(value="根据文章id获取所在目录", notes="根据文章id获取所在目录")
    @ApiImplicitParam(name = "id", value = "文章id", dataType = "Integer", paramType = "body")
    @GetMapping("/public/catalog/article/{id}")
    public Message getCatalogByArticleId (@PathVariable("id") Integer id) {
        Article article = articleMapper.selectByPrimaryKey(id);
        Catalog catalog = article.getCatalog();
        Catalog parent = catalogMapper.selectByPrimaryKey(catalog.getPid());
        Catalog grandpa = catalogMapper.selectByPrimaryKey(catalog.getGid());
        List list = new ArrayList();
        list.add(catalog.getName());
        list.add(parent.getName());
        list.add(grandpa.getName());
        return new Message(true,list);
    }



}
