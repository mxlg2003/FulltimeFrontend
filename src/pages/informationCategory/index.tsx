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
  Switch,
  Icon,
  Upload,
} from 'antd';
import axios from 'axios';
import moment from 'moment';
import 'moment/locale/zh-cn';
import * as Constants from '../../utils/constants';
//   import district from '../../utils/district';
// import ShopAddModal from './modal';
import useForm from 'rc-form-hooks';

const Option = Select.Option;
moment.locale('zh-cn');

const InformationCategory = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  interface iCategory {
    category_name: string;
    category_sort: string;
    category_icon: string;
    show_contact: string;
    show_banner: string;
    banner_link?: string;
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

  useEffect(() => {
    fetchData(`${Constants.API_URL}categorys`);
  }, []);

  const columns = [
    {
      title: '类别名称',
      dataIndex: 'category_name',
      key: 'id',
    },

    {
      title: '排序号',
      dataIndex: 'category_sort',
    },

    {
      title: '类别图标',
      dataIndex: 'category_icon',
      render: (text: any, record: any) => (
        <img
          src={record.category_icon}
          style={{ width: '60px', height: '60px' }}
        />
      ),
    },

    {
      title: '公开联系方式',
      dataIndex: 'show_contact',
      render: (text: any, record: any) => {
        if (record.show_contact) {
          return <Tag color="green">公开</Tag>;
        } else {
          return <Tag>隐藏</Tag>;
        }
      },
    },
    {
      title: '显示广告位',
      dataIndex: 'show_banner',
      render: (text: any, record: any) => {
        if (record.show_banner) {
          return <Tag color="green">公开</Tag>;
        } else {
          return <Tag>隐藏</Tag>;
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
          <CategoryEditModal record={record} />

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
    deleteCategorys(id);
  }
  const deleteCategorys = (id: any) => {
    axios
      .delete(`${Constants.API_URL}category/${id}`)
      .then(function(response) {
        if (response.data.success) {
          fetchData(`${Constants.API_URL}categorys`);
          message.success(response.data.massage, 5);
        } else {
          message.error(response.data.massage, 5);
        }
      })
      .catch(function(error) {
        console.log(error);
      });
  };

  //   信息类别修改组件
  const CategoryEditModal = (record: any) => {
    const category: any = record.record;
    const [visible, setVisible] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);

    const {
      getFieldDecorator,
      validateFields,
      getFieldsValue,
      resetFields,
    } = useForm<iCategory>();

    const categoryPost = (values: object) => {
      var value: any = values;
      console.log(value);
      value.id = category.id;
      value.users_id = localStorage.getItem('user_id');
      value.banner_pic = compoundUploadPicUrl(fileList);
      var e: any = JSON.stringify(value, null, 2);
      console.log(e);
      // setConfirmLoading(true);
      axios.defaults.headers.post['Content-Type'] =
        'application/json; charset=utf-8';
      axios
        .post(`${Constants.API_URL}categorys`, e)
        .then(function(response) {
          if (response.data.success) {
            setConfirmLoading(false);
            handleReset();
            message.success(response.data.massage, 5);
            fetchData(`${Constants.API_URL}categorys`);
          } else {
            message.error(response.data.massage, 5);
          }
        })
        .catch(function(error) {
          console.log(error);
        });
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
      if (
        information.banner_pic == null ||
        information.banner_pic == ''
      ) {
        return [];
      } else {
        // let temp: any = [];
        let fileListHash = information.banner_pic.split(',');
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
      setFileList(defaultFileList(category));
    }, []);

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

    const handleReset = () => {
      setVisible(false);
      resetFields();
    };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      // validateFields()
      //   .then((values: any) => {
      //     categoryPost(values);
      //   })
      //   .catch(console.error);
      var values: any = getFieldsValue();
      categoryPost(values);
    };

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
          title={category.category_name}
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
            <Form.Item label="类别名称">
              {getFieldDecorator('category_name', {
                initialValue: category.category_name,
                rules: [
                  {
                    required: true,
                    message: '此项必填',
                  },
                ],
              })(<Input placeholder="类别名称" />)}
            </Form.Item>
            <Form.Item label="类别排序">
              {getFieldDecorator('category_sort', {
                initialValue: category.category_sort,
              })(<Input placeholder="类别排序由大到小" />)}
            </Form.Item>
            <Form.Item label="类别图标地址">
              {getFieldDecorator('category_icon', {
                initialValue: category.category_icon,
              })(<Input placeholder="类别图标地址" />)}
            </Form.Item>
            <Form.Item label="公开联系方式">
              {getFieldDecorator('show_contact')(
                <Switch
                  checkedChildren={<Icon type="check" />}
                  unCheckedChildren={<Icon type="close" />}
                  defaultChecked={category.show_contact}
                />,
              )}
            </Form.Item>
            <Form.Item label="显示广告位">
              {getFieldDecorator('show_banner')(
                <Switch
                  checkedChildren={<Icon type="check" />}
                  unCheckedChildren={<Icon type="close" />}
                  defaultChecked={category.show_banner}
                />,
              )}
            </Form.Item>
            <Form.Item label="广告链接地址">
              {getFieldDecorator('banner_link', {
                initialValue: category.banner_link,
              })(<Input placeholder="广告链接地址" />)}
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
                {fileList.length >= 2 ? null : uploadButton}
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

  const CategoryAddModal = () => {
    const [visible, setVisible] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);

    const {
      getFieldDecorator,
      validateFields,
      getFieldsValue,
      resetFields,
    } = useForm<iCategory>();

    const categoryPost = (values: object) => {
      var value: any = values;
      console.log(value);
      value.users_id = localStorage.getItem('user_id');
      value.banner_pic = compoundUploadPicUrl(fileList);
      var e: any = JSON.stringify(value, null, 2);

      console.log(e);
      // setConfirmLoading(true);
      axios.defaults.headers.post['Content-Type'] =
        'application/json; charset=utf-8';
      axios
        .post(`${Constants.API_URL}categorys`, e)
        .then(function(response) {
          console.log(response);
          if (response.data.success) {
            setConfirmLoading(false);
            handleReset();
            fetchData(`${Constants.API_URL}categorys`);
            message.success(response.data.massage, 5);
          } else {
            message.error(response.data.massage, 5);
          }
        })
        .catch(function(error) {
          console.log(error);
        });
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

    const handleReset = () => {
      setVisible(false);
      resetFields();
    };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      var values: any = getFieldsValue();
      categoryPost(values);
    };

    return (
      <div style={{ margin: '0 0 24px' }}>
        <button
          className="ant-btn ant-btn-primary"
          onClick={() => setVisible(true)}
        >
          新增信息类别
        </button>
        <Modal
          title="新增信息类别"
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
            <Form.Item label="类别名称">
              {getFieldDecorator('category_name', {
                rules: [
                  {
                    required: true,
                    message: '此项必填',
                  },
                ],
              })(<Input placeholder="类别名称" />)}
            </Form.Item>
            <Form.Item label="类别排序">
              {getFieldDecorator('category_sort')(
                <Input placeholder="类别排序由大到小" />,
              )}
            </Form.Item>
            <Form.Item label="类别图标地址">
              {getFieldDecorator('category_icon')(
                <Input placeholder="类别图标地址" />,
              )}
            </Form.Item>
            <Form.Item label="公开联系方式">
              {getFieldDecorator('show_contact')(
                <Switch
                  checkedChildren={<Icon type="check" />}
                  unCheckedChildren={<Icon type="close" />}
                />,
              )}
            </Form.Item>
            <Form.Item label="显示广告位">
              {getFieldDecorator('show_banner')(
                <Switch
                  checkedChildren={<Icon type="check" />}
                  unCheckedChildren={<Icon type="close" />}
                />,
              )}
            </Form.Item>
            <Form.Item label="广告链接地址">
              {getFieldDecorator('banner_link')(
                <Input placeholder="广告链接地址" />,
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

  return (
    <Fragment>
      <CategoryAddModal />

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

export default InformationCategory;
