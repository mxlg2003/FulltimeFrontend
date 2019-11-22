import React, { Fragment, useEffect, useState } from 'react';
import {
  Table,
  Popconfirm,
  message,
  Form,
  Input,
  Select,
  Modal,
  Cascader,
  Tag,
  Radio,
  Tooltip,
  Icon,
  Upload,
} from 'antd';
import axios from 'axios';
import moment from 'moment';
import 'moment/locale/zh-cn';
import * as Constants from '../../utils/constants';
import useForm from 'rc-form-hooks';
import { string, object } from 'prop-types';
import BraftEditor from 'braft-editor';
import 'braft-editor/dist/index.css';
import * as qiniu from 'qiniu-js';

const { TextArea } = Input;
moment.locale('zh-cn');

const News = () => {
  const [data, setData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    defaultCurrent: 1,
    total: 10,
    pageSize: 10,
  });

  interface iNews {
    title: string;
    content: string;
    author?: string;
    category_id: number;
    status: string;
    recommend: string;
    tags?: string;
    pic?: string;
    views?: number;
    calls?: number;
  }

  const fetchData = async (url: any) => {
    await axios
      .get(url, {
        headers: {
          Authorization: localStorage.getItem('jwtToken'),
          // jwt: Constants.USER_ID,
        },
      })
      .then(function(response) {
        // console.log(response);
        setLoading(false);
        setPagination({
          defaultCurrent: response.data.page,
          total: response.data.total,
          pageSize: response.data.per_page,
        });
        setData(response.data.data);
      })
      .catch(function(error) {
        console.log(error);
      });
  };

  const fetchNewData = async (pagination: any) => {
    let url = `${Constants.API_URL}news`;
    await axios
      .get(url, {
        headers: {
          Authorization: localStorage.getItem('jwtToken'),
          // jwt: Constants.USER_ID,
          page: pagination.current,
        },
      })
      .then(function(response) {
        // console.log(response);
        setLoading(false);
        setPagination({
          defaultCurrent: response.data.page,
          total: response.data.total,
          pageSize: response.data.per_page,
        });
        setData(response.data.data);
      })
      .catch(function(error) {
        console.log(error);
      });
  };

  const fetchCategoryData = async (url: any) => {
    await axios
      .get(url, {
        headers: {
          Authorization: localStorage.getItem('jwtToken'),
          // jwt: Constants.USER_ID,
        },
      })
      .then(function(response) {
        console.log(response);
        setLoading(false);
        setCategoryData(response.data.data);
      })
      .catch(function(error) {
        console.log(error);
      });
  };

  useEffect(() => {
    fetchData(`${Constants.API_URL}news`);
    fetchCategoryData(`${Constants.API_URL}newsCategorys`);
  }, []);

  const columns = [
    {
      title: 'id',
      dataIndex: 'id',
      key: 'id',
    },

    {
      title: '信息标题',
      dataIndex: 'title',
    },

    {
      title: '作者',
      dataIndex: 'author',
    },
    {
      title: '所属类别',
      dataIndex: 'category_name',
    },
    {
      title: '访问次数',
      dataIndex: 'views',
    },
    {
      title: '状态',
      dataIndex: 'status_name',
      filters: [
        {
          text: '待审核',
          value: '待审核',
        },
        {
          text: '已发布',
          value: '已发布',
        },
        {
          text: '已失效',
          value: '已失效',
        },
      ],
      onFilter: (value: any, record: any) =>
        record.status_name.indexOf(value) === 0,
      render: (text: any, record: any) => {
        let color = 'red';
        switch (record.status) {
          case 1:
            color = 'geekblue';
            break;
          case 2:
            color = 'grey';
            break;
          case 3:
            color = 'grey';
            break;
          default:
            color = 'red';
        }
        var content = record.status_name;
        return (
          <Tag color={color} key={record.id}>
            {content}
          </Tag>
        );
      },
    },
    {
      title: '标签',
      dataIndex: 'tags',
      render: (text: any, record: any) =>
        record.tags.map((txt: any) => {
          if (txt == '') {
            return '';
          } else {
            return <Tag>{txt}</Tag>;
          }
        }),
    },

    {
      title: '发布时间',
      dataIndex: 'create_time',
      render: (text: any, record: any) =>
        moment.unix(record.create_time).format('LLL'),
    },
    {
      title: '是否推荐',
      dataIndex: 'recommend',
      render: (text: any, record: any) => {
        if (record.recommend == 0) {
          return <Tag key={record.id}>{'未推荐'}</Tag>;
        } else {
          return (
            <Tag color="green" key={record.id}>
              {'已推荐'}
            </Tag>
          );
        }
      },
    },
    {
      title: '更新人',
      dataIndex: 'update_user_name',
    },
    {
      title: 'Action',

      render: (text: any, record: any) => (
        <Fragment>
          <NewsEditModal record={record} />

          <Popconfirm
            title="确认删除? "
            onConfirm={() => confirm(record.id)}
            okText="确认"
            cancelText="取消"
          >
            <button className="ant-btn ant-btn-danger">删除</button>
          </Popconfirm>
        </Fragment>
      ),
    },
  ];

  const [uptoken, setUptoken] = useState('');

  const uploadData = {
    token: uptoken,
  };

  const URL = `${Constants.API_URL}uptoken`;

  const getUptoken = async (url: string) => {
    const result = false;
    await axios.get(url).then(function(response) {
      setUptoken(response.data);
    });
    return result;
  };

  useEffect(() => {
    getUptoken(URL);
  }, []);

  const uploadButton = (
    <div>
      <Icon type="plus" />
      <div className="ant-upload-text">Upload</div>
    </div>
  );

  function confirm(id: any) {
    console.log(id);
    deleteNews(id);
  }
  const deleteNews = (id: any) => {
    axios
      .delete(`${Constants.API_URL}news/${id}`)
      .then(function(response) {
        if (response.data.success) {
          fetchData(`${Constants.API_URL}news`);
          message.success(response.data.massage, 5);
        } else {
          message.error(response.data.massage, 5);
        }
      })
      .catch(function(error) {
        console.log(error);
      });
  };

  const uploadFn = (param: any) => {
    const token = uptoken;
    const putExtra = {};
    const config = {};
    const observer = {
      next(res: any) {
        param.progress(res.total.percent);
      },
      error(err: any) {
        param.error({
          msg: err.message,
        });
      },
      complete(res: any) {
        param.success({
          url: 'http://img.mskjzg.com/' + res.key,
        });
      },
    };
    qiniu
      .upload(param.file, param.name, token, putExtra, config)
      .subscribe(observer);
  };

  const NewsAddModal = () => {
    const [visible, setVisible] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [editorState, setEditorState] = useState(
      BraftEditor.createEditorState('<p></p>'),
    );

    const {
      getFieldDecorator,
      validateFields,
      getFieldsValue,
      resetFields,
    } = useForm<iNews>();

    const newsPost = (values: object) => {
      var value: any = values;
      console.log(value);
      value.type = 1;
      value.users_id = localStorage.getItem('user_id');
      value.pic = compoundUploadPicUrl(fileList);
      value.content = editorState.toHTML();
      var e: any = JSON.stringify(value, null, 2);

      console.log(e);
      // setConfirmLoading(true);
      axios.defaults.headers.post['Content-Type'] =
        'application/json; charset=utf-8';
      axios
        .post(`${Constants.API_URL}news`, e)
        .then(function(response) {
          console.log(response);
          if (response.data.success) {
            setConfirmLoading(false);
            handleReset();
            fetchData(`${Constants.API_URL}news`);
            message.success(response.data.massage, 5);
          } else {
            message.error(response.data.massage, 5);
          }
        })
        .catch(function(error) {
          console.log(error);
          message.error('信息保存失败', 5);
        });
    };

    const handleReset = () => {
      setVisible(false);
      resetFields();
    };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      validateFields()
        .then(() => {
          var values: any = getFieldsValue();
          newsPost(values);
        })
        .catch(console.error);
    };

    const handleMessageChange = (c: any) => {
      setEditorState(c);
      console.log(c);
    };
    const compoundUploadPicUrl = (fileList: any) => {
      let temp: any = [];
      fileList.map((item: any) => {
        temp.push(item.response.hash);
      });
      return temp.join(',');
    };

    const [fileList, setFileList] = useState([]);

    const [previewVisible, setPreviewVisible] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewName, setPreviewName] = useState('');

    const uploadHandlePreview = (file: any) => {
      console.log(file);
      setPreviewImage(
        Constants.BASE_QINIU_URL +
          file.response.hash +
          Constants.SMALL_IMG_URL,
      );
      setPreviewName(file.name);
      setPreviewVisible(true);
    };

    const uploadHandleChange = (info: any) => {
      if (info.file.status === 'done') {
        const fileList: any = info.fileList;
        setFileList(fileList);
        // console.log(fileList);
      }
    };
    // const editerUpload = (info: any) => {
    //   if (info.file.status === 'done') {
    //     console.log(editorState);
    //     let html: any =
    //       editorState.toHTML() +
    //       `<p><div class="media-wrap image-wrap"><img src="http://img.mskjzg.com/${info.file.response.hash}"/></div></p>`;
    //     console.log(html);
    //     console.log(BraftEditor.createEditorState(html));
    //     setEditorState(BraftEditor.createEditorState(html));

    //     console.log(editorState);
    //   }
    // };

    const uploadHandleRemove = (file: any) => {
      // console.log(file);
      // console.log(fl);
    };

    const previewHandleCancel = () => setPreviewVisible(false);

    const controls: any = [
      'bold',
      'italic',
      'underline',
      'text-color',
      'separator',
      'link',
      'separator',
      'media',
    ];

    const extendControls: any = [
      {
        key: 'antd-uploader',
        type: 'component',
        component: (
          <Upload
            action={Constants.QINIU_SERVER}
            showUploadList={false}
            data={uploadData}
            accept="image/png, image/jpeg, image/jpg"
            // customRequest = {customRequest}
            // onChange={editerUpload}
            multiple={false}
          >
            <button
              type="button"
              className="control-item button upload-button"
              data-title="插入图片"
            >
              <Icon type="picture" theme="filled" />
            </button>
          </Upload>
        ),
      },
    ];
    return (
      <div style={{ margin: '0 0 24px' }}>
        <button
          className="ant-btn ant-btn-primary"
          onClick={() => setVisible(true)}
        >
          新增新闻
        </button>
        <Modal
          title="新增新闻"
          visible={visible}
          onOk={handleSubmit}
          confirmLoading={confirmLoading}
          onCancel={handleReset}
          okText="提交"
          cancelText="取消"
          width="60%"
        >
          <Form
            onSubmit={handleSubmit}
            onReset={handleReset}
            layout="horizontal"
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
          >
            <Form.Item label="信息标题">
              {getFieldDecorator('title', {
                rules: [
                  {
                    required: true,
                    message: '此项必填',
                  },
                ],
              })(<Input placeholder="信息标题" />)}
            </Form.Item>
            <Form.Item label="信息内容">
              {getFieldDecorator('content', {
                rules: [
                  {
                    required: true,
                    message: '此项必填',
                  },
                ],
              })(
                <BraftEditor
                  className="bf-controlbar"
                  // controls={controls}
                  // extendControls={extendControls}
                  placeholder="请输入正文内容"
                  contentStyle={{
                    height: 510,
                    boxShadow: 'inset 0 1px 3px rgba(0,0,0,.1)',
                  }}
                  defaultValue={editorState}
                  value={editorState}
                  onChange={handleMessageChange}
                  media={{ uploadFn: uploadFn }}
                />,
              )}
            </Form.Item>
            <Form.Item label="作者">
              {getFieldDecorator('author')(
                <Input placeholder="作者" />,
              )}
            </Form.Item>
            <Form.Item label="所属类别">
              {getFieldDecorator('category_id', {
                rules: [
                  {
                    required: true,
                    message: '此项必填',
                  },
                ],
              })(
                <Radio.Group
                  defaultValue=""
                  buttonStyle="solid"
                  size="small"
                >
                  {categoryData.map((d: any) => (
                    <Radio.Button key={d.id} value={d.id}>
                      {' '}
                      {d.category_name}
                    </Radio.Button>
                  ))}
                </Radio.Group>,
              )}
            </Form.Item>
            <Form.Item label="信息类型">
              {getFieldDecorator('status', {
                initialValue: '1',
                rules: [
                  {
                    required: true,
                    message: '此项必填',
                  },
                ],
              })(
                <Radio.Group buttonStyle="solid" size="small">
                  <Radio.Button value="0">待审核</Radio.Button>
                  <Radio.Button value="1">已发布</Radio.Button>
                  <Radio.Button value="2">已失效</Radio.Button>
                </Radio.Group>,
              )}
            </Form.Item>
            <Form.Item label="标签" extra="请用','号分隔">
              {getFieldDecorator('tags')(
                <Input placeholder="标签请用','号分隔" />,
              )}
            </Form.Item>

            <Form.Item label="推荐状态">
              {getFieldDecorator('recommend', {
                initialValue: '0',
                rules: [
                  {
                    required: true,
                    message: '此项必填',
                  },
                ],
              })(
                <Radio.Group buttonStyle="solid" size="small">
                  <Radio.Button value="0">不推荐</Radio.Button>
                  <Radio.Button value="1">已推荐</Radio.Button>
                </Radio.Group>,
              )}
            </Form.Item>
            <Form.Item label="浏览次数">
              {getFieldDecorator('views')(
                <Input placeholder="浏览次数" />,
              )}
            </Form.Item>
            <Form.Item label="联系次数">
              {getFieldDecorator('calls')(
                <Input placeholder="联系次数" />,
              )}
            </Form.Item>
            <Form.Item label="上传图片">
              <Upload
                action={Constants.QINIU_SERVER}
                listType="picture-card"
                className="upload-list-inline"
                defaultFileList={fileList}
                data={uploadData}
                accept="image/png, image/jpeg, image/jpg"
                // customRequest = {customRequest}
                onPreview={uploadHandlePreview}
                onChange={uploadHandleChange}
                onRemove={uploadHandleRemove}
                multiple={false}
              >
                {fileList.length >= 1 ? null : uploadButton}
              </Upload>
              <Modal
                visible={previewVisible}
                footer={null}
                onCancel={previewHandleCancel}
              >
                <img
                  alt={previewName}
                  style={{ width: '100%' }}
                  src={previewImage}
                />
              </Modal>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    );
  };

  const NewsEditModal = (record: any) => {
    const news: any = record.record;
    const [visible, setVisible] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [fileList, setFileList] = useState([]);
    const [previewVisible, setPreviewVisible] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewName, setPreviewName] = useState('');
    const [editorState, setEditorState] = useState(
      BraftEditor.createEditorState(news.content),
    );

    const {
      getFieldDecorator,
      validateFields,
      getFieldsValue,
      resetFields,
    } = useForm<iNews>();

    const newsPost = (values: object) => {
      var value: any = values;
      console.log(value);
      value.id = news.id;
      value.type = 1;
      value.users_id = localStorage.getItem('user_id');
      value.pic = compoundUploadPicUrl(fileList);
      value.content = editorState.toHTML();
      var e: any = JSON.stringify(value, null, 2);

      console.log(e);
      // setConfirmLoading(true);
      axios.defaults.headers.post['Content-Type'] =
        'application/json; charset=utf-8';
      axios
        .post(`${Constants.API_URL}news`, e)
        .then(function(response) {
          console.log(response);
          if (response.data.success) {
            setConfirmLoading(false);
            handleReset();
            fetchData(`${Constants.API_URL}news`);
            message.success(response.data.massage, 5);
          } else {
            message.error(response.data.massage, 5);
          }
        })
        .catch(function(error) {
          console.log(error);
          message.error('信息保存失败', 5);
        });
    };

    const handleReset = () => {
      setVisible(false);
      resetFields();
    };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      let values: any = getFieldsValue();
      console.log(values);
      newsPost(values);
    };

    const defaultFileList = (information: any) => {
      interface iFileResponse {
        hash: string;
      }
      interface iFile {
        uid: string;
        name: string;
        status: string;
        url: string;
        response: iFileResponse;
      }

      // console.log(information);
      if (information.pic == null || information.pic == '') {
        return [];
      } else {
        // let temp: any = [];
        let fileListHash = information.pic.split(',');
        // console.log(fileListHash);

        let temp: any = fileListHash.map(
          (item: string, index: number) => {
            let file: iFile = {
              uid: item + Math.floor(Math.random() * 100),
              name: item,
              status: 'done',
              url: Constants.BASE_QINIU_URL + item,
              response: { hash: item },
            };
            // console.log(item);
            // file.uid = item + Math.floor(Math.random() * 100);
            // file.name = item;
            // file.status = 'done';
            // file.url = Constants.BASE_QINIU_URL + item;
            // file.response.hash = item;
            return file;
          },
        );
        console.log(temp);
        return temp;
      }
    };

    useEffect(() => {
      setFileList(defaultFileList(news));
    }, []);

    const compoundUploadPicUrl = (fileList: any) => {
      let temp: any = [];
      fileList.map((item: any) => {
        temp.push(item.response.hash);
      });
      return temp.join(',');
    };

    const uploadHandlePreview = (file: any) => {
      console.log(file);
      setPreviewImage(
        Constants.BASE_QINIU_URL +
          file.response.hash +
          Constants.SMALL_IMG_URL,
      );
      setPreviewName(file.name);
      setPreviewVisible(true);
    };

    const uploadHandleChange = (info: any) => {
      if (info.file.status === 'done') {
        const fileList: any = info.fileList;
        setFileList(fileList);
        console.log(fileList);
      }
    };

    const uploadHandleRemove = (file: any) => {
      let fl: any = fileList;
      fl = fl.filter(function(item: any) {
        console.log(item.response.hash, file.response.hash);
        return item.response.hash != file.response.hash;
      });
      console.log(file);
      console.log(fl);
      setFileList(fl);
    };

    const handleMessageChange = (c: any) => {
      setEditorState(c);
      console.log(c);
    };

    const previewHandleCancel = () => setPreviewVisible(false);

    return (
      <Fragment>
        <button
          className="ant-btn ant-btn-primary"
          onClick={() => setVisible(true)}
          style={{ margin: '0 24px 0 0' }}
        >
          修改
        </button>
        <Modal
          title="修改信息"
          visible={visible}
          onOk={handleSubmit}
          confirmLoading={confirmLoading}
          onCancel={handleReset}
          okText="提交"
          cancelText="取消"
          width="60%"
        >
          <Form
            onSubmit={handleSubmit}
            onReset={handleReset}
            layout="horizontal"
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
          >
            <Form.Item label="信息标题">
              {getFieldDecorator('title', {
                initialValue: news.title,
                rules: [
                  {
                    required: true,
                    message: '此项必填',
                  },
                ],
              })(<Input placeholder="信息标题" />)}
            </Form.Item>
            <Form.Item label="信息内容">
              {getFieldDecorator('content', {
                initialValue: news.content,
                rules: [
                  {
                    required: true,
                    message: '此项必填',
                  },
                ],
              })(
                <BraftEditor
                  className="bf-controlbar"
                  // controls={controls}
                  // extendControls={extendControls}
                  placeholder="请输入正文内容"
                  contentStyle={{
                    height: 510,
                    boxShadow: 'inset 0 1px 3px rgba(0,0,0,.1)',
                  }}
                  defaultValue={editorState}
                  value={editorState}
                  onChange={handleMessageChange}
                  media={{ uploadFn: uploadFn }}
                />,
              )}
            </Form.Item>
            <Form.Item label="作者">
              {getFieldDecorator('author', {
                initialValue: news.author,
              })(<Input placeholder="联系人姓名" />)}
            </Form.Item>
            <Form.Item label="所属类别">
              {getFieldDecorator('category_id', {
                initialValue: news.category_id,
                rules: [
                  {
                    required: true,
                    message: '此项必填',
                  },
                ],
              })(
                <Radio.Group
                  defaultValue=""
                  buttonStyle="solid"
                  size="small"
                >
                  {categoryData.map((d: any) => (
                    <Radio.Button key={d.id} value={d.id}>
                      {' '}
                      {d.category_name}
                    </Radio.Button>
                  ))}
                </Radio.Group>,
              )}
            </Form.Item>
            <Form.Item label="信息类型">
              {getFieldDecorator('status', {
                initialValue: news.status.toString(),
                rules: [
                  {
                    required: true,
                    message: '此项必填',
                  },
                ],
              })(
                <Radio.Group
                  defaultValue=""
                  buttonStyle="solid"
                  size="small"
                >
                  <Radio.Button value="0">待审核</Radio.Button>
                  <Radio.Button value="1">已发布</Radio.Button>
                  <Radio.Button value="2">已失效</Radio.Button>
                  <Radio.Button value="3">已使用且失效</Radio.Button>
                </Radio.Group>,
              )}
            </Form.Item>
            <Form.Item label="标签" extra="请用','号分隔">
              {getFieldDecorator('tags', {
                initialValue: news.tags.join(),
              })(<Input placeholder="标签请用','号分隔" />)}
            </Form.Item>
            <Form.Item label="浏览次数">
              {getFieldDecorator('views', {
                initialValue: news.views,
              })(<Input placeholder="浏览次数" />)}
            </Form.Item>
            <Form.Item label="联系次数">
              {getFieldDecorator('calls', {
                initialValue: news.calls,
              })(<Input placeholder="联系次数" />)}
            </Form.Item>

            <Form.Item label="推荐状态">
              {getFieldDecorator('recommend', {
                initialValue: news.recommend.toString(),
                rules: [
                  {
                    required: true,
                    message: '此项必填',
                  },
                ],
              })(
                <Radio.Group buttonStyle="solid" size="small">
                  <Radio.Button value="0">不推荐</Radio.Button>
                  <Radio.Button value="1">已推荐</Radio.Button>
                </Radio.Group>,
              )}
            </Form.Item>
            <Form.Item label="上传图片">
              <Upload
                action={Constants.QINIU_SERVER}
                listType="picture-card"
                className="upload-list-inline"
                defaultFileList={fileList}
                data={uploadData}
                accept="image/png, image/jpeg, image/jpg"
                // customRequest = {customRequest}
                onPreview={uploadHandlePreview}
                onChange={uploadHandleChange}
                onRemove={uploadHandleRemove}
                multiple={false}
              >
                {fileList.length >= 1 ? null : uploadButton}
              </Upload>
              <Modal
                visible={previewVisible}
                footer={null}
                onCancel={previewHandleCancel}
              >
                <img
                  alt={previewName}
                  style={{ width: '100%' }}
                  src={previewImage}
                />
              </Modal>
            </Form.Item>
          </Form>
        </Modal>
      </Fragment>
    );
  };

  return (
    <Fragment>
      <NewsAddModal />

      <Table
        columns={columns}
        dataSource={data}
        bordered={true}
        pagination={pagination}
        loading={loading}
        rowKey="id"
        onChange={fetchNewData}
        //   scroll={{ x: 1600, y: 800 }}
      />
    </Fragment>
  );
};

export default News;
