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
  Cascader,
} from 'antd';
import useForm from 'rc-form-hooks';
import axios from 'axios';
import * as Constants from '../../utils/constants';
import district from '../../utils/district';

const ShopAddModal = () => {
  const [visible, setVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [districtCode, setDistrictCode] = useState(['0', '0', '0']);
  const [districtName, setDistrictName] = useState('');
  const [districtFullName, setDistrictFullName] = useState([
    '',
    '',
    '',
  ]);
  interface iShop {
    shop_name: string;
    shop_district_code: string[];
    shop_district_name: string;
    shop_district_fullname: string[];
    shop_phone: string;
    shop_address: string;
    remark?: string;
  }

  const {
    getFieldDecorator,
    validateFields,
    resetFields,
    getFieldsValue,
  } = useForm<iShop>();

  function districtChange(value: string[], selectedOptions: any) {
    console.log(value, selectedOptions);
    setDistrictCode(value);
    setDistrictName(selectedOptions[2].label);
    setDistrictFullName([
      selectedOptions[0].label,
      selectedOptions[1].label,
      selectedOptions[2].label,
    ]);
    console.log(districtCode, districtName, districtFullName);
  }

  const shopPost = (values: object) => {
    var value: any = values;
    console.log(value);
    value.users_id = localStorage.getItem('user_id');
    value.shop_district_code = districtCode;
    value.shop_district_name = districtName;
    value.shop_district_fullname = districtFullName;
    var e: any = JSON.stringify(value, null, 2);

    console.log(e);
    // setConfirmLoading(true);
    axios.defaults.headers.post['Content-Type'] =
      'application/json; charset=utf-8';
    axios
      .post(`${Constants.API_URL}shops`, e)
      .then(function(response) {
        console.log(response);
        setConfirmLoading(false);
        handleReset();
        message.success('新增门店成功', 5);
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
        shopPost(values);
      })
      .catch(console.error);
  };

  return (
    <div style={{ margin: '0 0 24px' }}>
      <button
        className="ant-btn ant-btn-primary"
        onClick={() => setVisible(true)}
      >
        新增门店
      </button>
      <Modal
        title="新增门店"
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
          <Form.Item label="门店名称">
            {getFieldDecorator('shop_name', {
              rules: [
                {
                  required: true,
                  message: '此项必填',
                },
              ],
            })(<Input placeholder="门店名称" />)}
          </Form.Item>
          <Form.Item label="门店所属区域">
            {/* {getFieldDecorator('shop_district_code', {
                initialValue: districtCode,
                rules: [
                  {
                    required: true,
                    message: '此项必填',
                  },
                ],
              })(
                <Cascader
                  defaultValue={districtCode}
                  options={district}
                  onChange={onChange}
                />,
              )} */}
            <Cascader options={district} onChange={districtChange} />
          </Form.Item>
          <Form.Item label="门店电话">
            {getFieldDecorator('shop_phone', {
              rules: [
                {
                  required: true,
                  message: '此项必填',
                },
              ],
            })(<Input placeholder="门店电话" />)}
          </Form.Item>
          <Form.Item label="门店地址">
            {getFieldDecorator('shop_address', {
              rules: [
                {
                  required: true,
                  message: '此项必填',
                },
              ],
            })(<Input placeholder="门店地址" />)}
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

export default ShopAddModal;
