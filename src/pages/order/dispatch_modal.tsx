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
const { TextArea } = Input;

const DispatchModal = (order: any) => {
  //   const order_id = match.params.id;
  const RadioButton = Radio.Button;
  const RadioGroup = Radio.Group;
  // const { MonthPicker, RangePicker, WeekPicker } = DatePicker;
  const CheckboxGroup = Checkbox.Group;

  const { TextArea } = Input;
  const [value, setValue] = useState();
  const [visible, setVisible] = useState(false);
  //   const [enterprise_id, setEnterprise_id] = useState();
  const [user_id, setUse_id] = useState(
    localStorage.getItem('user_id') || '',
  );
  const [confirmLoading, setConfirmLoading] = useState(false);
  interface iDispatch {
    enterprise_id: number;
    order_id: number;
    resume_id?: string;
    resume_username?: string;
    resume_mobile?: string;
    search_resume_name?: string;
    search_resume_mobile?: string;
    start_date?: string;
    end_date?: string;
    remark?: string;
  }

  const {
    getFieldDecorator,
    getFieldsValue,
    validateFields,
    setFieldsValue,
    resetFields,
  } = useForm<iDispatch>();

  const dispatchPost = (values: object) => {
    var value: any = values;
    value.users_id = user_id;
    value.order_id = order.order_id;
    value.enterprise_id = order.enterprise_id;
    var e: any = JSON.stringify(value, null, 2);

    console.log(e);
    // setConfirmLoading(true);
    axios.defaults.headers.post['Content-Type'] =
      'application/json; charset=utf-8';
    axios
      .post(`${Constants.API_URL}dispatchs`, e)
      .then(function(response) {
        console.log(response);
        setConfirmLoading(false);
        handleReset();
        message.success('派遣记录保存成功', 5);
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
        dispatchPost(values);
      })
      .catch(console.error);
  };

  //用关键字搜索简历中姓名
  const SearchInput = (props: any) => {
    const [data, setData] = useState([]);

    const fetchData = (value: any) => {
      if (value.trim()) {
        if (/^\d+$/.test(value)) {
          axios
            .get(`${Constants.API_URL}resumes?mobile=${value}`)
            .then(function(response) {
              console.log(response);
              setData(response.data);
            })
            .catch(function(error) {
              console.log(error);
            });
        } else {
          axios
            .get(`${Constants.API_URL}resumes?username=${value}`)
            .then(function(response) {
              console.log(response);
              setData(response.data);
            })
            .catch(function(error) {
              console.log(error);
            });
        }
      }
    };
    const handleSearch = (value: string) => {
      fetchData(value);
    };

    const handleChange = (value: any) => {
      console.log(value.label);
      setFieldsValue({
        resume_id: value.key,
        resume_username: value.label,
      });
      // setEnterprise_id(value.key);
      // setEnterprise_name(value.label);
      setValue(value.label);
    };

    const options = data.map((d: any) => (
      <Option key={d.id}>
        {d.username}[{d.mobile}]
      </Option>
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
    <div
      style={{
        margin: '0  24px',
        textAlign: 'right',
        display: 'inline',
      }}
    >
      <button
        className="ant-btn ant-btn-primary"
        onClick={() => setVisible(true)}
      >
        新增派遣记录
      </button>
      <Modal
        title="新增派遣记录"
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
          <Form.Item label="搜索简历">
            {getFieldDecorator('search_resume_name')(
              <SearchInput placeholder="请在简历中搜索派遣员工姓名或手机号" />,
            )}
          </Form.Item>
          {/* {console.log(
            enterprise_id.enterprise_id,
            enterprise_id.order_id,
          )} */}
          <Form.Item label="简历id">
            {getFieldDecorator('resume_id', {
              rules: [
                {
                  required: true,
                  message: '此项必填',
                },
              ],
            })(
              <Input placeholder="简历id" readOnly disabled={true} />,
            )}
          </Form.Item>
          <Form.Item label="姓名/电话">
            {getFieldDecorator('resume_username', {
              rules: [
                {
                  required: true,
                  message: '此项必填',
                },
              ],
            })(<Input placeholder="姓名" readOnly disabled={true} />)}
          </Form.Item>

          <Form.Item label="派遣开始日期">
            {getFieldDecorator('start_date', {
              rules: [
                {
                  required: true,
                  message: '此项必填',
                },
              ],
            })(<Input placeholder="派遣开始日期" type="date" />)}
          </Form.Item>
          <Form.Item label="派遣结束日期">
            {getFieldDecorator('end_date')(
              <Input placeholder="派遣开始日期" type="date" />,
            )}
          </Form.Item>
          <Form.Item label="备注">
            {getFieldDecorator('remark')(
              <TextArea
                placeholder=""
                autosize={{ minRows: 2, maxRows: 6 }}
              />,
            )}
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DispatchModal;
