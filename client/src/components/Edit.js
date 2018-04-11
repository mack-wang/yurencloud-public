import React, { Component } from 'react';
import { Form, Input, Button, Cascader, Upload, Icon, Layout, Breadcrumb } from 'antd';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import { Editor } from 'react-draft-wysiwyg';
import Back from 'components/Back';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { connect } from 'dva';
import { upload } from 'services/article';
import config from 'utils/config';
import style from './Edit.css';


const FormItem = Form.Item;

const { Content } = Layout;

class EditForm extends Component {
  componentWillMount = () => {
    // 获取并更新目录
    this.props.dispatch({ type: 'catalog/cascader' });
  };

  componentWillUpdate = (nextProps) => {
    // 如果reset是true，则执行重置
    if (nextProps.reset) this.handleReset();
  };

  onEditorStateChange = (editorState) => {
    this.props.dispatch({ type: 'article/update', payload: { editorState } });
  };

  uploadCallback = (file) => {
    return upload(file, this.props.token);
  };

  getContentWords = (content) => {
    const str1 = content.replace(/<\/?.+?>/g, '');
    const str2 = str1.replace(/ /g, '');
    return str2.length;
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const content = draftToHtml(convertToRaw(this.props.editorState.getCurrentContent()));
        const data = {
          content,
          catalogId: values.catalog[2],
          title: values.title,
          words: this.getContentWords(content),
        };
        if (values.image) {
          data.image = values.image[0].response ?
            values.image[0].response.data.link
            : values.image[0].url;
        }
        this.props.dispatch({
          type: this.props.modify ?
            'article/modifySubmit'
            : 'article/submit',
          payload: data });
      }
    });
  };

  // 表单重置
  handleReset = () => {
    this.props.form.resetFields();
    // 重置富文本
    const blocksFromHtml = htmlToDraft('');
    const { contentBlocks, entityMap } = blocksFromHtml;
    const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);
    const editorState = EditorState.createWithContent(contentState);
    this.props.dispatch({ type: 'article/update', payload: { editorState, reset: false } });
  };


  normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  render() {
    const { token, catalog, form, editorState, cascader, fileList, modify, article, select } = this.props;
    const { getFieldDecorator } = form;
    const { Authorization } = `Bearer${token}`;
    return (
      <Layout style={{ padding: '0 24px 24px' }}>
        <Breadcrumb style={{ margin: '12px 0' }}>
          <Breadcrumb.Item>文章</Breadcrumb.Item>
          <Breadcrumb.Item>{ select === 'update' ? '修改文章' : '添加文章'}</Breadcrumb.Item>
        </Breadcrumb>
        <Content style={{ background: '#fff', padding: 24, margin: 0 }}>
          <Form onSubmit={this.handleSubmit} className="login-form">
            <FormItem>
              {getFieldDecorator('title', {
                rules: [{ required: true, message: '请输入文章标题' }],
                initialValue: modify ? article.title : undefined,
              })(
                <Input placeholder="文章标题" />,
            )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('catalog', {
                rules: [{ type: 'array', required: true, message: '请选择目录' }],
                initialValue: modify ? cascader : undefined,
              })(
                <Cascader options={catalog} popupClassName={style.normal} placeholder="请选择目录" />,
            )}
            </FormItem>

            <Editor
              // defaultEditorState={editorState} // 这两个属性是关键点
              editorState={editorState} // 使用这个属性可以正常的控制正在编辑的文本，重置，替换，清空
              toolbarClassName="toolbarClassName"
              editorClassName={style.wrapperClassName}
              onEditorStateChange={this.onEditorStateChange}
              toolbar={{
                options: ['inline', 'fontSize', 'list', 'textAlign', 'image', 'link', 'embedded', 'blockType', 'colorPicker', 'emoji', 'remove', 'history'],
                image: {
                  inputAccept: 'image/gif,image/jpeg,image/jpg,image/png,image/svg',
                  uploadCallback: this.uploadCallback,
                  defaultSize: {
                    height: 'auto',
                    width: '100%',
                  },
                },
                blockType: {
                  inDropdown: false,
                  options: ['Blockquote', 'Code', 'Normal', 'H1', 'H2', 'H3'],
                },
                textAlign: {
                  inDropdown: true,
                },
                list: {
                  inDropdown: true,
                },
                inline: {
                  inDropdown: false,
                  className: undefined,
                  component: undefined,
                  dropdownClassName: undefined,
                  options: ['bold', 'italic', 'underline', 'strikethrough', 'monospace', 'superscript', 'subscript'],
                },
              }}
            />

            <FormItem>
              {getFieldDecorator('image', {
                valuePropName: 'fileList',
                getValueFromEvent: this.normFile,
                initialValue: (modify && fileList) ? [...fileList] : undefined,
              })(
                <Upload
                  name="image"
                  action={config.api.uploadArticleImage}
                  listType="picture"
                  headers={Authorization}
                >
                  <Button>
                    <Icon type="upload" /> 上传标题图（可省略）
                </Button>
                </Upload>,
            )}
            </FormItem>

            <FormItem>
              <Button type="primary" htmlType="submit" className="login-form-button">
              提交
            </Button>
              <Button type="default" style={{ marginLeft: 8 }} onClick={this.handleReset} className="login-form-button">
              重置
            </Button>
              { modify ? <Back /> : '' }
            </FormItem>
          </Form>
        </Content>
      </Layout>
    );
  }
}

const Edit = Form.create()(EditForm);

const mapStateToProps = state => ({
  token: state.auth.token,
  catalog: state.catalog.catalog,
  reset: state.article.reset,
  modify: state.article.modify,
  article: state.article.article,
  editorState: state.article.editorState,
  cascader: state.article.cascader,
  fileList: state.article.fileList,
  select: state.adminSider.select,
});

// 返回的是一个经过Auth包装的组件，这个组件自带token、username,isAuth
export default connect(mapStateToProps)(Edit);
