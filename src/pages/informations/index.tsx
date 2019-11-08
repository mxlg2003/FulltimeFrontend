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

const { TextArea } = Input;
moment.locale('zh-cn');

const Informations = () => {
  const [data, setData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [loading, setLoading] = useState(true);

  interface iInformation {
    title: string;
    content: string;
    username: string;
    mobile: string;
    category_id: number;
    type: number;
    status: number;
    recommend: number;
    tags: string;
    shop_code: number;
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
        console.log(response);
        setLoading(false);
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
    fetchData(`${Constants.API_URL}informations`);
    fetchCategoryData(`${Constants.API_URL}categorys`);
  }, []);

  const columns = [
    {
      title: '信息标题',
      dataIndex: 'title',
      key: 'id',
    },

    {
      title: '联系人',
      dataIndex: 'username',
    },
    {
      title: '联系电话',
      dataIndex: 'mobile',
    },

    {
      title: '所属类别',
      dataIndex: 'category_name',
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
        {
          text: '已使用且失效',
          value: '已使用且失效',
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
          <InformationEditModal record={record} />

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
    deleteInformations(id);
  }
  const deleteInformations = (id: any) => {
    axios
      .delete(`${Constants.API_URL}information/${id}`)
      .then(function(response) {
        if (response.data.success) {
          fetchData(`${Constants.API_URL}informations`);
          message.success(response.data.massage, 5);
        } else {
          message.error(response.data.massage, 5);
        }
      })
      .catch(function(error) {
        console.log(error);
      });
  };

  const InformationAddModal = () => {
    const [visible, setVisible] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);

    const {
      getFieldDecorator,
      validateFields,
      getFieldsValue,
      resetFields,
    } = useForm<iInformation>();

    const informationPost = (values: object) => {
      var value: any = values;
      console.log(value);
      value.type = 1;
      value.users_id = localStorage.getItem('user_id');
      value.shop_code = localStorage.getItem('shop_code');
      value.pic = compoundUploadPicUrl(fileList);
      var e: any = JSON.stringify(value, null, 2);

      console.log(e);
      // setConfirmLoading(true);
      axios.defaults.headers.post['Content-Type'] =
        'application/json; charset=utf-8';
      axios
        .post(`${Constants.API_URL}informations`, e)
        .then(function(response) {
          console.log(response);
          if (response.data.success) {
            setConfirmLoading(false);
            handleReset();
            fetchData(`${Constants.API_URL}informations`);
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
          informationPost(values);
        })
        .catch(console.error);
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

    const uploadHandleRemove = (file: any) => {
      // console.log(file);
      // console.log(fl);
    };

    const previewHandleCancel = () => setPreviewVisible(false);

    return (
      <div style={{ margin: '0 0 24px' }}>
        <button
          className="ant-btn ant-btn-primary"
          onClick={() => setVisible(true)}
        >
          新增分类信息
        </button>
        <Modal
          title="新增分类信息"
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
              })(<TextArea rows={4} />)}
            </Form.Item>
            <Form.Item label="联系人姓名">
              {getFieldDecorator('username', {
                rules: [
                  {
                    required: true,
                    message: '此项必填',
                  },
                ],
              })(<Input placeholder="联系人姓名" />)}
            </Form.Item>
            <Form.Item label="联系人手机号">
              {getFieldDecorator('mobile', {
                rules: [
                  {
                    required: true,
                    message: '此项必填',
                  },
                ],
              })(<Input placeholder="联系人手机号" />)}
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
                  <Radio.Button value="3">已使用且失效</Radio.Button>
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
            <Form.Item label="上传图片">
              <Upload
                action={Constants.QINIU_SERVER}
                listType="picture-card"
                className="upload-list-inline"
                // defaultFileList={fileList}
                data={uploadData}
                accept="image/png, image/jpeg, image/jpg"
                // customRequest = {customRequest}
                onPreview={uploadHandlePreview}
                onChange={uploadHandleChange}
                onRemove={uploadHandleRemove}
                multiple={false}
              >
                {fileList.length >= 8 ? null : uploadButton}
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

  const InformationEditModal = (record: any) => {
    const information: any = record.record;
    const [visible, setVisible] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [fileList, setFileList] = useState([]);
    const [previewVisible, setPreviewVisible] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewName, setPreviewName] = useState('');

    const {
      getFieldDecorator,
      validateFields,
      getFieldsValue,
      resetFields,
    } = useForm<iInformation>();

    const informationPost = (values: object) => {
      var value: any = values;
      console.log(value);
      value.id = information.id;
      value.type = 1;
      value.users_id = localStorage.getItem('user_id');
      value.shop_code = localStorage.getItem('shop_code');
      value.pic = compoundUploadPicUrl(fileList);
      var e: any = JSON.stringify(value, null, 2);

      console.log(e);
      // setConfirmLoading(true);
      axios.defaults.headers.post['Content-Type'] =
        'application/json; charset=utf-8';
      axios
        .post(`${Constants.API_URL}informations`, e)
        .then(function(response) {
          console.log(response);
          if (response.data.success) {
            setConfirmLoading(false);
            handleReset();
            fetchData(`${Constants.API_URL}informations`);
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
          informationPost(values);
        })
        .catch(console.error);
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

      console.log(information);
      if (information.pic == null) {
        return [];
      } else {
        // let temp: any = [];
        let fileListHash = information.pic.split(',');
        console.log(fileListHash);

        let temp: any = fileListHash.map(
          (item: string, index: number) => {
            let file: iFile = {
              uid: item + Math.floor(Math.random() * 100),
              name: item,
              status: 'done',
              url: Constants.BASE_QINIU_URL + item,
              response: { hash: item },
            };
            console.log(item);
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
      setFileList(defaultFileList(information));
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
                initialValue: information.title,
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
                initialValue: information.content,
                rules: [
                  {
                    required: true,
                    message: '此项必填',
                  },
                ],
              })(<TextArea rows={4} />)}
            </Form.Item>
            <Form.Item label="联系人姓名">
              {getFieldDecorator('username', {
                initialValue: information.username,
                rules: [
                  {
                    required: true,
                    message: '此项必填',
                  },
                ],
              })(<Input placeholder="联系人姓名" />)}
            </Form.Item>
            <Form.Item label="联系人手机号">
              {getFieldDecorator('mobile', {
                initialValue: information.mobile,
                rules: [
                  {
                    required: true,
                    message: '此项必填',
                  },
                ],
              })(<Input placeholder="联系人手机号" />)}
            </Form.Item>
            <Form.Item label="所属类别">
              {getFieldDecorator('category_id', {
                initialValue: information.category_id,
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
                initialValue: information.status.toString(),
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
                initialValue: information.tags.join(),
              })(<Input placeholder="标签请用','号分隔" />)}
            </Form.Item>

            <Form.Item label="推荐状态">
              {getFieldDecorator('recommend', {
                initialValue: information.recommend.toString(),
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
                {fileList.length >= 8 ? null : uploadButton}
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
      <InformationAddModal />

      <Table
        columns={columns}
        dataSource={data}
        bordered={true}
        pagination={{
          pageSize: 20,
          defaultCurrent: 1,
        }}
        loading={loading}
        rowKey="id"
        //   scroll={{ x: 1600, y: 800 }}
      />
    </Fragment>
  );
};

export default Informations;
