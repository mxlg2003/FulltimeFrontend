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

const DisbursementModal = (order: any) => {
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
  interface iDisbursement {
    order_id: number;
    issue_date: string;
    start_date: string;
    end_date: string;
    username: string;
    mobile: string;
    sum: number;
    remark?: string;
  }

  const {
    getFieldDecorator,
    getFieldsValue,
    validateFields,
    setFieldsValue,
    resetFields,
  } = useForm<iDisbursement>();

  const disbursementPost = (values: object) => {
    var value: any = values;
    value.users_id = user_id;
    value.order_id = order.order_id;

    var e: any = JSON.stringify(value, null, 2);

    console.log(e);

    axios.defaults.headers.post['Content-Type'] =
      'application/json; charset=utf-8';
    axios
      .post(`${Constants.API_URL}disbursements`, e)
      .then(function(response) {
        console.log(response);
        setConfirmLoading(false);
        handleReset();
        message.success('补贴记录保存成功', 5);
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
        disbursementPost(values);
      })
      .catch(console.error);
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
        新增收入记录
      </button>
      <Modal
        title="新增收入记录"
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
          {/* {console.log(
            enterprise_id.enterprise_id,
            enterprise_id.order_id,
          )} */}
          <Form.Item label="金额">
            {getFieldDecorator('sum', {
              rules: [
                {
                  required: true,
                  message: '此项必填',
                },
              ],
            })(<Input placeholder="金额" type="number" />)}
          </Form.Item>
          <Form.Item label="补贴发放日期">
            {getFieldDecorator('issue_date', {
              rules: [
                {
                  required: true,
                  message: '此项必填',
                },
              ],
            })(<Input placeholder="补贴发放日期" type="date" />)}
          </Form.Item>
          <Form.Item label="收款人姓名">
            {getFieldDecorator('username', {
              rules: [
                {
                  required: true,
                  message: '此项必填',
                },
              ],
            })(<Input placeholder="收款人姓名" />)}
          </Form.Item>
          <Form.Item label="收款人手机号">
            {getFieldDecorator('mobile', {
              rules: [
                {
                  required: true,
                  message: '此项必填',
                },
              ],
            })(<Input placeholder="收款人手机号" />)}
          </Form.Item>
          <Form.Item label="本次补贴计时开始日期">
            {getFieldDecorator('start_date', {
              rules: [
                {
                  required: true,
                  message: '此项必填',
                },
              ],
            })(
              <Input
                placeholder="本次补贴计时开始日期"
                type="date"
              />,
            )}
          </Form.Item>
          <Form.Item label="本次补贴计时结束日期">
            {getFieldDecorator('end_date', {
              rules: [
                {
                  required: true,
                  message: '此项必填',
                },
              ],
            })(
              <Input
                placeholder="本次补贴计时结束日期"
                type="date"
              />,
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

export default DisbursementModal;
