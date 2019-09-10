import React, { useEffect, useState } from 'react';
import { message, Button, Form, Input, Icon, Checkbox } from 'antd';
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
  const [autologin, setAutologin] = useState(0);
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
      console.log(token);
      axios
        .get(`${Constants.API_URL}users/verifyJwt`, {
          headers: {
            Authorization: localStorage.getItem('jwtToken'),
            // jwt: Constants.USER_ID,
          },
        })
        .then(res => {
          console.log(res.data);
          //储存token到localStorage
          localStorage.setItem('jwtToken', res.data.token);
          localStorage.setItem('user_mobile', res.data.mobile);
          localStorage.setItem('user_id', res.data.id);
          localStorage.setItem('user_username', res.data.username);
          localStorage.setItem('shop_id', res.data.shop_id);
          localStorage.setItem('shop_code', res.data.shop_code);
          props.history.push('/');
        })
        .catch(function(error) {
          localStorage.clear();
          alert('密钥过期,请重新登录');
        });
    }
  };

  // 自动登录
  function autoLogin() {
    if (autologin == 0) {
      setAutologin(1);
    } else {
      setAutologin(0);
    }
  }

  const getToken = (formData: any) => {
    formData['auto_login'] = autologin;
    console.log(formData);
    axios
      .post(`${Constants.API_URL}users/token`, formData)
      .then(res => {
        console.log(res.data);
        //储存token到localStorage
        localStorage.setItem('jwtToken', res.data.token);
        localStorage.setItem('user_mobile', res.data.mobile);
        localStorage.setItem('user_id', res.data.id);
        localStorage.setItem('user_username', res.data.username);
        localStorage.setItem('shop_id', res.data.shop_id);
        localStorage.setItem('shop_code', res.data.shop_code);
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
              <Checkbox onChange={autoLogin}>自动登录</Checkbox>
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
