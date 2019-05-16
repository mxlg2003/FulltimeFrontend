import React, {
  Fragment,
  useEffect,
  useReducer,
  useState,
  useRef,
} from 'react';
import {
  Table,
  Divider,
  Popconfirm,
  message,
  Button,
  Form,
  Input,
  Select,
  InputNumber,
  Cascader,
  DatePicker,
  Icon,
  Checkbox,
} from 'antd';
import axios from 'axios';
import * as Constants from '../../utils/constants';
import useForm from 'rc-form-hooks';
import './style/index.css';

const Login = () => {
  interface iLogin {
    mobile: string;
    password: string;
  }
  const { getFieldDecorator, validateFields, resetFields } = useForm<
    iLogin
  >();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('111');
    validateFields()
      .then((values: any) => {
        // resumePost(values);
        console.log('222');
      })
      .catch(console.error);
  };
  return (
    <div className="antd-pro-layouts-user-layout-content">
      <div className="antd-pro-layouts-user-layout-top">
        <div className="antd-pro-layouts-user-layout-header">
          <img src="https://keenthemes.com/metronic/preview/demo1/custom/pages/user/assets/media/company-logos/logo-2.png" />
        </div>
        <div className="antd-pro-layouts-user-layout-desc">
          饭秀才灵活用工 - 全职信息管理系统
        </div>
      </div>
      <div className="antd-pro-pages-user-login-main">
        <div className="antd-pro-components-login-index-login">
          <Form onSubmit={handleSubmit} className="login-form">
            <Form.Item>
              {getFieldDecorator('mobile', {
                rules: [
                  {
                    required: true,
                    message: '请输入手机号!',
                  },
                ],
              })(
                <Input
                  prefix={
                    <Icon
                      type="user"
                      style={{ color: 'rgba(0,0,0,.25)' }}
                    />
                  }
                  placeholder="手机号"
                />,
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator('password', {
                rules: [
                  {
                    required: true,
                    message: '请输入密码!',
                  },
                ],
              })(
                <Input
                  prefix={
                    <Icon
                      type="lock"
                      style={{ color: 'rgba(0,0,0,.25)' }}
                    />
                  }
                  type="password"
                  placeholder="密码"
                />,
              )}
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                登录
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Login;
