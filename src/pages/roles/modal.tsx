import React, {
  Fragment,
  Component,
  useState,
  useEffect,
} from 'react';
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

const { Option } = Select;

const UsersModal = () => {
  const [visible, setVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [data, setData] = useState([]);
  interface iUser {
    username: string;
    mobile: string;
    password: string;
    shop_id?: number;
    remark?: string;
  }

  const { getFieldDecorator, validateFields, resetFields } = useForm<
    iUser
  >();

  const fetchData = async (url: any) => {
    const response = await axios
      .get(url)
      .then(function(response) {
        console.log(response);
        setData(response.data);
      })
      .catch(function(error) {
        console.log(error);
      });
  };

  useEffect(() => {
    fetchData(`${Constants.API_URL}shops`);
  }, []);

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
  const options = (data || []).map((d: any) => (
    <Option key={d.id}>{d.shop_name}</Option>
  ));

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
          <Form.Item label="电话">
            {getFieldDecorator('mobile', {
              rules: [
                {
                  required: true,
                  message: '此项必填',
                },
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
                {options}
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

export default UsersModal;
