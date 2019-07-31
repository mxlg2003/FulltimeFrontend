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
import UsersModal from './modal';
import useForm from 'rc-form-hooks';

const Option = Select.Option;
moment.locale('zh-cn');

const Users = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [shopData, setShopData] = useState([]);
  const useDataApi = (url: any) => {
    const fetchData = async () => {
      const response = await axios
        .get(url)
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
      fetchData();
    }, []);

    return data;
  };

  const fetchData = async (url: any) => {
    const response = await axios
      .get(url)
      .then(function(response) {
        console.log(response);
        setShopData(response.data);
      })
      .catch(function(error) {
        console.log(error);
      });
  };

  useEffect(() => {
    fetchData(`${Constants.API_URL}shops`);
  }, []);

  const [resumes, setResumes] = useState(
    useDataApi(`${Constants.API_URL}users`),
  );

  const columns = [
    {
      title: '姓名',
      dataIndex: 'username',
      key: 'id',
    },

    {
      title: '手机号',
      dataIndex: 'mobile',
      key: 'mobile',
    },
    {
      title: '所属门店',
      dataIndex: 'shop_name',
    },
    {
      title: '备注',
      dataIndex: 'remark',
    },
    {
      title: '更新人',
      dataIndex: 'update_user_name',
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
    deleteUsers(id);
  }
  const deleteUsers = (id: any) => {
    axios
      .delete(`${Constants.API_URL}users/${id}`)
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
      password?: string;
      shop_id?: number;
      remark?: string;
    }

    const {
      getFieldDecorator,
      validateFields,
      resetFields,
      getFieldsValue,
    } = useForm<iUser>();

    const userPost = (values: object) => {
      var value: any = values;
      console.log(value);
      value.users_id = localStorage.getItem('user_id');
      var e: any = JSON.stringify(value, null, 2);
      console.log(e);
      // setConfirmLoading(true);
      axios.defaults.headers.post['Content-Type'] =
        'application/json; charset=utf-8';
      axios
        .post(`${Constants.API_URL}users/${user.id}`, e)
        .then(function(response) {
          console.log(response);
          setConfirmLoading(false);
          handleReset();
          message.success('修改系统用户信息成功', 5);
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
          console.log(values);
          //var values: any = getFieldsValue();
          userPost(values);
        })
        .catch(console.error);
    };

    function onChange(value: any) {
      console.log(`selected ${value}`);
    }

    function onBlur() {
      console.log('blur');
    }

    function onFocus() {
      console.log('focus');
    }

    function onSearch(val: any) {
      console.log('search:', val);
    }
    const options = shopData.map((d: any) => (
      <Option key={d.id} value={d.id}>
        {d.shop_name}
      </Option>
    ));
    return (
      <Fragment>
        <button
          className="ant-btn ant-btn-primary"
          onClick={() => setVisible(true)}
          style={{ margin: '0 24px 0 0' }}
        >
          修改
        </button>
        {visible && (
          <Modal
            // title="修改系统用户信息"
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
                  ],
                })(<Input placeholder="电话" />)}
              </Form.Item>
              <Form.Item label="密码">
                {getFieldDecorator('password')(
                  <Input placeholder="密码" type="password" />,
                )}
              </Form.Item>
              <Form.Item label="所属门店">
                {getFieldDecorator('shop_id', {
                  rules: [
                    {
                      required: false,
                      message: '',
                    },
                  ],
                  initialValue: user.shop_id,
                })(
                  <Select
                    showSearch
                    style={{ width: 200 }}
                    placeholder="请选择所属门店"
                    optionFilterProp="children"
                    onChange={onChange}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    onSearch={onSearch}
                    allowClear={true}
                    // value={user.shop_id}
                    // defaultValue={user.shop_id}
                    // filterOption={(input, option) =>
                    //   option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    // }
                  >
                    {options}
                  </Select>,
                )}
              </Form.Item>
              <Form.Item label="备注">
                {getFieldDecorator('remark', {
                  initialValue: user.remark,
                  rules: [
                    {
                      required: false,
                      message: '',
                    },
                  ],
                })(<Input placeholder="备注" />)}
              </Form.Item>
            </Form>
          </Modal>
        )}
      </Fragment>
    );
  };

  return (
    <Fragment>
      <UsersModal />

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

export default Users;
