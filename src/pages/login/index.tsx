import React, { useEffect, useState } from 'react';
import { message, Button, Form, Input, Icon } from 'antd';
import axios from 'axios';
import * as Constants from '../../utils/constants';
import useForm from 'rc-form-hooks';
import './style/index.css';
import { object } from 'prop-types';

const Login = (props: any) => {
  interface iLogin {
    mobile: string;
    password: string;
  }
  const { getFieldDecorator, getFieldsValue } = useForm<iLogin>();
  const [loginform, setLoginform] = useState({
    username: '',
    password: '',
  });

  useEffect(() => {
    verifyLogin(localStorage.getItem('jwtToken'));
  }, []);

  // 验证是否登录
  const verifyLogin = (token: any) => {
    if (token) {
      props.history.push('/');
    }
  };

  const getToken = (formData: any) => {
    console.log(formData);
    axios
      .post(`${Constants.API_URL}users/token`, formData)
      .then(res => {
        const { token } = res.data;
        console.log(res.data);
        //储存token到local
        localStorage.setItem('jwtToken', token);
        localStorage.setItem('user_mobile', formData.mobile);
        localStorage.setItem('user_id', res.data.id);
        localStorage.setItem('user_username', res.data.username);
        props.history.push('/');
      })
      .catch(function(error) {
        alert('用户名或密码错误');
      });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    var values: any = getFieldsValue();
    getToken(values);
  };
  return (
    <div className="antd-pro-layouts-user-layout-content">
      <div className="antd-pro-layouts-user-layout-top">
        <div className="antd-pro-layouts-user-layout-header">
          <img src="/fan-fang.png" style={{ width: '150px' }} />
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
                  id="mobile"
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
                  id="password"
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
