import React, { Fragment, useEffect, useState } from 'react';
import {
  Table,
  Popconfirm,
  message,
  Form,
  Input,
  Select,
  Modal,
} from 'antd';
import axios from 'axios';
import moment from 'moment';
import 'moment/locale/zh-cn';
import * as Constants from '../../utils/constants';
// import SalesModal from './modal';
import useForm from 'rc-form-hooks';

// const Option = Select.Option;
moment.locale('zh-cn');

const checkPhoneNub = Constants.CheckPhoneNub;
//  { validator: checkPhoneNub },

const Sales = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async (url: any) => {
    await axios
      .get(url || `${Constants.API_URL}sales`, {
        headers: {
          Authorization: localStorage.getItem('jwtToken'),
          // jwt: Constants.USER_ID,
        },
      })
      .then(function(response) {
        console.log(response);
        setLoading(false);
        setData(response.data);
      })
      .catch(function(error) {
        console.log(error);
      });

    // setData(response.data);
    // setLoading(false);
  };

  useEffect(() => {
    fetchData(`${Constants.API_URL}sales`);
  }, []);

  const columns = [
    {
      title: 'yid',
      dataIndex: 'id',
      key: 'id',
      width: 50,
    },

    {
      title: '姓名',
      dataIndex: 'username',
      width: 100,
    },

    {
      title: '手机号',
      dataIndex: 'mobile',
      key: 'mobile',
    },

    {
      title: '简历数',
      dataIndex: 'resumes',
      key: 'resumes',
    },
    {
      title: 'Action',

      render: (text: any, record: any) => (
        <Fragment>
          <UserEditModal record={record} />

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

  function confirm(id: any) {
    console.log(id);
    deleteSales(id);
  }
  const deleteSales = (id: any) => {
    axios
      .delete(`${Constants.API_URL}sales/${id}`, {
        headers: {
          Authorization: localStorage.getItem('jwtToken'),
          // jwt: Constants.USER_ID,
        },
      })
      .then(function(response) {
        setData(data.filter((e: any) => e.id !== id));
        message.success('删除成功', 5);
      })
      .catch(function(error) {
        console.log(error);
      });
  };

  const UserEditModal = (record: any) => {
    const user: any = record.record;
    const [visible, setVisible] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    interface iUser {
      username: string;
      mobile: string;
      password: string;
    }

    const {
      getFieldDecorator,
      validateFields,
      resetFields,
    } = useForm<iUser>();

    const userPost = (values: object) => {
      var value: any = values;
      console.log(value);
      value.id = user.id;
      var e: any = JSON.stringify(value, null, 2);
      console.log(e);
      // setConfirmLoading(true);
      axios.defaults.headers.post['Content-Type'] =
        'application/json; charset=utf-8';
      axios.defaults.headers.post[
        'Authorization'
      ] = localStorage.getItem('jwtToken');
      axios
        .post(`${Constants.API_URL}sales/${user.id}`, e)
        .then(function(response) {
          console.log(response);
          fetchData(`${Constants.API_URL}sales`);
          setConfirmLoading(false);

          handleReset();
          message.success('修改业务员信息成功', 5);
        })
        .catch(function(error) {
          console.log(error);
        });
    };

    const handleReset = () => {
      setVisible(false);
      resetFields();
    };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      validateFields()
        .then((values: any) => {
          userPost(values);
        })
        .catch(console.error);
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
          // title="修改业务员信息"
          title={user.username}
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
            <Form.Item label="姓名">
              {getFieldDecorator('username', {
                initialValue: user.username,
                rules: [
                  {
                    required: true,
                    message: '此项必填',
                  },
                ],
              })(<Input placeholder="姓名" />)}
            </Form.Item>

            <Form.Item label="电话">
              {getFieldDecorator('mobile', {
                initialValue: user.mobile,
                rules: [
                  {
                    required: true,
                    message: '此项必填',
                  },
                  { validator: checkPhoneNub },
                ],
              })(<Input placeholder="电话" />)}
            </Form.Item>
            <Form.Item label="密码">
              {getFieldDecorator('password', {
                rules: [
                  {
                    required: true,
                    message: '此项必填',
                  },
                ],
              })(<Input placeholder="密码" type="password" />)}
            </Form.Item>
          </Form>
        </Modal>
      </Fragment>
    );
  };

  const SalesModal = () => {
    const [visible, setVisible] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    interface iUser {
      username: string;
      mobile: string;
      password: string;
    }

    const {
      getFieldDecorator,
      validateFields,
      resetFields,
    } = useForm<iUser>();

    const userPost = (values: object) => {
      var value: any = values;

      var e: any = JSON.stringify(value, null, 2);

      console.log(e);
      // setConfirmLoading(true);
      axios.defaults.headers.post['Content-Type'] =
        'application/json; charset=utf-8';
      axios.defaults.headers.post[
        'Authorization'
      ] = localStorage.getItem('jwtToken');
      axios
        .post(`${Constants.API_URL}sales`, e)
        .then(function(response) {
          if (response.data.code == 10010) {
            console.log(response);
            setConfirmLoading(false);
            handleReset();
            // fetchData(`${Constants.API_URL}sales`);
            message.warning(response.data.massage, 5);
          } else {
            fetchData(`${Constants.API_URL}sales`);
            message.success('新增业务员成功', 5);
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    };

    const handleReset = () => {
      setVisible(false);
      resetFields();
    };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      validateFields()
        .then((values: any) => {
          userPost(values);
        })
        .catch(console.error);
    };

    return (
      <div style={{ margin: '0 0 24px' }}>
        <button
          className="ant-btn ant-btn-primary"
          onClick={() => setVisible(true)}
        >
          新增业务员
        </button>
        <Modal
          title="新增业务员"
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
            <Form.Item label="姓名">
              {getFieldDecorator('username', {
                rules: [
                  {
                    required: true,
                    message: '此项必填',
                  },
                ],
              })(<Input placeholder="姓名" id="username" />)}
            </Form.Item>
            <Form.Item label="电话">
              {getFieldDecorator('mobile', {
                rules: [
                  {
                    required: true,
                    message: '此项必填',
                  },
                  { validator: checkPhoneNub },
                ],
              })(<Input placeholder="电话" id="mobile" />)}
            </Form.Item>
            <Form.Item label="密码">
              {getFieldDecorator('password', {
                rules: [
                  {
                    required: true,
                    message: '此项必填',
                  },
                ],
              })(
                <Input
                  placeholder="密码"
                  id="password"
                  type="password"
                />,
              )}
            </Form.Item>
          </Form>
        </Modal>
      </div>
    );
  };

  return (
    <Fragment>
      <SalesModal />

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

export default Sales;
