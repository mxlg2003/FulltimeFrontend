import React, { Fragment, Component, useState } from 'react';
import {
  Modal,
  Form,
  Input,
  Button,
  Radio,
  message,
  DatePicker,
  Checkbox,
  Select,
  InputNumber,
} from 'antd';
import useForm from 'rc-form-hooks';
import axios from 'axios';
import * as Constants from '../../utils/constants';

const SalesModal = () => {
  const [visible, setVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  interface iUser {
    username: string;
    mobile: string;
    password: string;
  }

  const { getFieldDecorator, validateFields, resetFields } = useForm<
    iUser
  >();

  const userPost = (values: object) => {
    var value: any = values;

    var e: any = JSON.stringify(value, null, 2);

    console.log(e);
    // setConfirmLoading(true);
    axios.defaults.headers.post['Content-Type'] =
      'application/json; charset=utf-8';
    axios
      .post(`${Constants.API_URL}sales`, e)
      .then(function(response) {
        console.log(response);
        setConfirmLoading(false);
        handleReset();
        message.success('新增业务员成功', 5);
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

export default SalesModal;
