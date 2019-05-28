import React, { useState, useEffect } from 'react';
import {
  Modal,
  Form,
  Input,
  Radio,
  message,
  DatePicker,
  Checkbox,
  Select,
} from 'antd';
import useForm from 'rc-form-hooks';
import axios from 'axios';
import * as Constants from '../../utils/constants';

const { Option } = Select;

const OrderModal = () => {
  const RadioButton = Radio.Button;
  const RadioGroup = Radio.Group;
  // const { MonthPicker, RangePicker, WeekPicker } = DatePicker;
  const CheckboxGroup = Checkbox.Group;

  const { TextArea } = Input;
  const [value, setValue] = useState();
  const [visible, setVisible] = useState(false);
  const [enterprise_id, setEnterprise_id] = useState();
  const [enterprise_name, setEnterprise_name] = useState();
  const [confirmLoading, setConfirmLoading] = useState(false);
  interface iOrder {
    enterprise_id: string;
    order_postName: string;
    enterprise_name?: string;
    search_enterprise_name?: string;
  }

  const {
    getFieldDecorator,
    getFieldsValue,
    validateFields,
    setFieldsValue,
    resetFields,
  } = useForm<iOrder>();

  const orderPost = (values: object) => {
    var value: any = values;
    var e: any = JSON.stringify(value, null, 2);

    console.log(e);
    // setConfirmLoading(true);
    axios.defaults.headers.post['Content-Type'] =
      'application/json; charset=utf-8';
    axios
      .post(`${Constants.API_URL}orders`, e)
      .then(function(response) {
        console.log(response);
        setConfirmLoading(false);
        handleReset();
        message.success('订单保存成功', 5);
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
        orderPost(values);
      })
      .catch(console.error);
  };

  //用关键字搜索企业名称
  const SearchInput = (props: any) => {
    const [data, setData] = useState([]);

    const fetchData = (value: string) => {
      axios
        .get(
          `${Constants.API_URL}enterprises?enterprise_name=${value}`,
        )
        .then(function(response) {
          console.log(response);
          setData(response.data);
        })
        .catch(function(error) {
          console.log(error);
        });
    };
    const handleSearch = (value: string) => {
      fetchData(value);
    };

    const handleChange = (value: any) => {
      console.log(value.label);
      setFieldsValue({
        enterprise_id: value.key,
        enterprise_name: value.label,
      });
      // setEnterprise_id(value.key);
      // setEnterprise_name(value.label);
      setValue(value.label);
    };

    const options = data.map((d: any) => (
      <Option key={d.id}>{d.enterprise_name}</Option>
    ));
    return (
      <Select
        showSearch
        value={value}
        placeholder={props.placeholder}
        style={props.style}
        defaultActiveFirstOption={false}
        showArrow={false}
        filterOption={false}
        labelInValue={true}
        onSearch={handleSearch}
        onChange={handleChange}
        notFoundContent={null}
      >
        {options}
      </Select>
    );
  };

  return (
    <div style={{ margin: '0 0 24px' }}>
      <button
        className="ant-btn ant-btn-primary"
        onClick={() => setVisible(true)}
      >
        新增订单
      </button>
      <Modal
        title="新增订单"
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
          <Form.Item label="搜索">
            {getFieldDecorator('search_enterprise_name')(
              <SearchInput placeholder="请搜索企业名称中包含的文字" />,
            )}
          </Form.Item>
          <Form.Item label="企业名称">
            {getFieldDecorator('enterprise_name', {
              rules: [
                {
                  required: true,
                  message: '此项必填',
                },
              ],
            })(
              <Input
                placeholder="企业名称"
                readOnly
                disabled={true}
              />,
            )}
          </Form.Item>
          <Form.Item label="企业id">
            {getFieldDecorator('enterprise_id', {
              rules: [
                {
                  required: true,
                  message: '此项必填',
                },
              ],
            })(
              <Input placeholder="企业id" readOnly disabled={true} />,
            )}
          </Form.Item>
          <Form.Item label="岗位名称">
            {getFieldDecorator('order_postName', {
              rules: [
                {
                  required: true,
                  message: '此项必填',
                },
              ],
            })(<Input placeholder="电话" />)}
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default OrderModal;
