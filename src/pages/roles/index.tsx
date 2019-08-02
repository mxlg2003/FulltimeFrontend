import React, { Fragment, useEffect, useState } from 'react';
import {
  Table,
  Popconfirm,
  message,
  Form,
  Input,
  Select,
  Modal,
  Checkbox,
} from 'antd';
import axios from 'axios';
import moment from 'moment';
import 'moment/locale/zh-cn';
import * as Constants from '../../utils/constants';
import UsersModal from './modal';
import useForm from 'rc-form-hooks';
import { string } from 'prop-types';

const CheckboxGroup = Checkbox.Group;

moment.locale('zh-cn');

const Roles = () => {
  interface iMenuOptions {
    label: string;
    value: string;
  }
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [menuOptions, setMenuOptions] = useState<iMenuOptions[]>([]);
  const fetchData = async (url: any) => {
    await axios
      .get(url)
      .then(function(response) {
        console.log(response);
        setLoading(false);
        setData(response.data);
      })
      .catch(function(error) {
        console.log(error);
      });
  };
  const getAllMenu = async (url: any) => {
    await axios
      .get(url)
      .then(function(response) {
        console.log(response.data);
        let value: iMenuOptions[] = [];
        for (let x of response.data) {
          let item: any = x;
          value.push({
            label: item.ItemName,
            value: item.ItemId,
          });
        }
        console.log(value);
        setMenuOptions(value);
      })
      .catch(function(error) {
        console.log(error);
      });
  };

  useEffect(() => {
    fetchData(`${Constants.API_URL}roles`);
    getAllMenu(`${Constants.API_URL}menus`);
  }, []);

  const columns = [
    {
      title: '角色名',
      dataIndex: 'name',
    },

    {
      title: '角色描述',
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
          <RoleEditModal record={record} />

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
    deleteRoles(id);
  }
  const deleteRoles = (id: any) => {
    axios
      .delete(`${Constants.API_URL}roles/${id}`)
      .then(function(response) {
        setData(data.filter((e: any) => e.id !== id));
        message.success('删除成功', 5);
      })
      .catch(function(error) {
        console.log(error);
      });
  };

  const RoleEditModal = (record: any) => {
    const role: any = record.record;
    const [visible, setVisible] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [indeterminate, setIndeterminate] = useState(false);
    const [checkedList, setCheckedList] = useState([]);
    const [checkAll, setCheckAll] = useState(false);

    interface iRole {
      name: string;
      menus: string;
      remark?: string;
    }

    const {
      getFieldDecorator,
      validateFields,
      resetFields,
      getFieldsValue,
    } = useForm<iRole>();

    const rolePost = (values: object) => {
      var value: any = values;
      console.log(value);
      value.id = role.id;
      value.users_id = localStorage.getItem('user_id');
      var e: any = JSON.stringify(value, null, 2);
      console.log(e);
      // setConfirmLoading(true);
      axios.defaults.headers.post['Content-Type'] =
        'application/json; charset=utf-8';
      axios
        .post(`${Constants.API_URL}roles/${value.id}`, e)
        .then(function(response) {
          console.log(response);
          setConfirmLoading(false);
          handleReset();
          message.success('修改角色信息成功', 5);
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
          rolePost(values);
        })
        .catch(console.error);
    };

    function onChange(checkedList: any) {
      console.log('checked = ', checkedList);
      setCheckedList(checkedList);
      // indeterminate: !!checkedList.length && checkedList.length < plainOptions.length,
      // if checkedList.length === menuOptions.length,
      console.log(checkedList.length == menuOptions.length);
      setCheckAll(checkedList.length == menuOptions.length);
    }

    function onCheckAllChange(e: any) {
      // setCheckedList(checkAll ? menuOptions : []);
      // indeterminate: false,
      // checkAll: e.target.checked,
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
            title={role.username}
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
              <Form.Item label="角色名">
                {getFieldDecorator('name', {
                  initialValue: role.name,
                  rules: [
                    {
                      required: true,
                      message: '此项必填',
                    },
                  ],
                })(<Input placeholder="角色名" />)}
              </Form.Item>
              <Form.Item label="角色描述">
                {getFieldDecorator('remark', {
                  initialValue: role.remark,
                  rules: [
                    {
                      required: false,
                      message: '',
                    },
                  ],
                })(<Input placeholder="角色描述" />)}
              </Form.Item>
              <Form.Item label="角权权限">
                <div>
                  <div style={{ borderBottom: '1px solid #E9E9E9' }}>
                    <Checkbox
                      indeterminate={indeterminate}
                      onChange={onCheckAllChange}
                      checked={checkAll}
                    >
                      全选
                    </Checkbox>
                  </div>
                  <br />
                  <CheckboxGroup
                    options={menuOptions}
                    value={checkedList}
                    onChange={onChange}
                  />
                </div>
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
        rowKey="id"
        dataSource={data}
        bordered={true}
        pagination={{
          pageSize: 20,
          defaultCurrent: 1,
        }}
        loading={loading}

        //   scroll={{ x: 1600, y: 800 }}
      />
    </Fragment>
  );
};

export default Roles;
