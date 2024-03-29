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
// import UsersModal from './modal';
import useForm from 'rc-form-hooks';

const Option = Select.Option;
const checkPhoneNub = Constants.CheckPhoneNub;
moment.locale('zh-cn');

const Users = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [shopData, setShopData] = useState([]);
  const [roleData, setRoleData] = useState([]);

  const fetchUserData = async (url: any) => {
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
        setData(response.data);
      })
      .catch(function(error) {
        console.log(error);
      });
  };

  const fetchShopData = async (url: any) => {
    await axios
      .get(url)
      .then(function(response) {
        console.log(response);
        setShopData(response.data);
      })
      .catch(function(error) {
        console.log(error);
      });
  };
  const fetchRoleData = async (url: any) => {
    await axios
      .get(url)
      .then(function(response) {
        console.log(response);
        setRoleData(response.data);
      })
      .catch(function(error) {
        console.log(error);
      });
  };

  useEffect(() => {
    fetchUserData(`${Constants.API_URL}users`);
    fetchShopData(`${Constants.API_URL}shops`);
    fetchRoleData(`${Constants.API_URL}roles`);
  }, []);

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
      title: '角色',
      dataIndex: 'role_name',
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
      role_id?: number;
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
          fetchUserData(`${Constants.API_URL}users`);

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

    function onShopChange(value: any) {
      console.log(`selected ${value}`);
    }
    function onRoleChange(value: any) {
      console.log(`selected ${value}`);
    }

    function onShopSearch(val: any) {
      console.log('search:', val);
    }

    function onRoleSearch(val: any) {
      console.log('search:', val);
    }
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
              <Form.Item label="手机号">
                {getFieldDecorator('mobile', {
                  initialValue: user.mobile,
                  rules: [
                    {
                      required: true,
                      message: '此项必填',
                    },
                    { validator: checkPhoneNub },
                  ],
                })(<Input placeholder="手机号" />)}
              </Form.Item>
              <Form.Item label="密码">
                {getFieldDecorator('password')(
                  <Input placeholder="密码" type="password" />,
                )}
              </Form.Item>
              <Form.Item label="角色">
                {getFieldDecorator('role_id', {
                  rules: [
                    {
                      required: true,
                      message: '此项必填',
                    },
                  ],
                  initialValue: user.role_id,
                })(
                  <Select
                    showSearch
                    style={{ width: 200 }}
                    placeholder="请选择角色"
                    optionFilterProp="children"
                    onChange={onRoleChange}
                    onSearch={onRoleSearch}
                    allowClear={true}
                    // value={user.shop_id}
                    // defaultValue={user.shop_id}
                    // filterOption={(input, option) =>
                    //   option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    // }
                  >
                    {roleData.map((d: any) => (
                      <Option key={d.id} value={d.id}>
                        {d.name}
                      </Option>
                    ))}
                  </Select>,
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
                    onChange={onShopChange}
                    onSearch={onShopSearch}
                    allowClear={true}
                    // value={user.shop_id}
                    // defaultValue={user.shop_id}
                    // filterOption={(input, option) =>
                    //   option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    // }
                  >
                    {shopData.map((d: any) => (
                      <Option key={d.id} value={d.id}>
                        {d.shop_name}
                      </Option>
                    ))}
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

  const UsersModal = () => {
    const [visible, setVisible] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    interface iUser {
      username: string;
      mobile: string;
      password: string;
      shop_id?: number;
      role_id?: number;
      remark?: string;
    }

    const {
      getFieldDecorator,
      validateFields,
      resetFields,
    } = useForm<iUser>();

    const userPost = (values: object) => {
      var value: any = values;
      value.users_id = localStorage.getItem('user_id');
      var e: any = JSON.stringify(value, null, 2);

      console.log(e);
      // setConfirmLoading(true);
      axios.defaults.headers.post['Content-Type'] =
        'application/json; charset=utf-8';
      axios
        .post(`${Constants.API_URL}users`, e)
        .then(function(response) {
          console.log(response);
          setConfirmLoading(false);
          handleReset();
          fetchUserData(`${Constants.API_URL}users`);
          message.success('新增系统用户成功', 5);
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

    return (
      <div style={{ margin: '0 0 24px' }}>
        <button
          className="ant-btn ant-btn-primary"
          onClick={() => setVisible(true)}
        >
          新增系统用户
        </button>
        <Modal
          title="新增系统用户"
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
              })(<Input placeholder="姓名" />)}
            </Form.Item>
            <Form.Item label="手机号">
              {getFieldDecorator('mobile', {
                rules: [
                  {
                    required: true,
                    message: '此项必填',
                  },
                  { validator: checkPhoneNub },
                ],
              })(<Input placeholder="手机号" />)}
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
            <Form.Item label="角色">
              {getFieldDecorator('role_id', {
                rules: [
                  {
                    required: true,
                    message: '此项必填',
                  },
                ],
              })(
                <Select
                  showSearch
                  style={{ width: 200 }}
                  placeholder="请选择角色"
                  optionFilterProp="children"
                  allowClear={true}
                  // value={user.shop_id}
                  // defaultValue={user.shop_id}
                  // filterOption={(input, option) =>
                  //   option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  // }
                >
                  {roleData.map((d: any) => (
                    <Option key={d.id} value={d.id}>
                      {d.name}
                    </Option>
                  ))}
                </Select>,
              )}
            </Form.Item>
            <Form.Item label="所属门店">
              {getFieldDecorator('shop_id')(
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
                  // filterOption={(input, option) =>
                  //   option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  // }
                >
                  {shopData.map((d: any) => (
                    <Option key={d.id} value={d.id}>
                      {d.shop_name}
                    </Option>
                  ))}
                </Select>,
              )}
            </Form.Item>
            <Form.Item label="备注">
              {getFieldDecorator('remark')(
                <Input placeholder="备注" />,
              )}
            </Form.Item>
          </Form>
        </Modal>
      </div>
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
