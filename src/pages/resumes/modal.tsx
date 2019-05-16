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
} from 'antd';
import useForm from 'rc-form-hooks';
import axios from 'axios';
import * as Constants from '../../utils/constants';

const ResumesModal = () => {
  const RadioButton = Radio.Button;
  const RadioGroup = Radio.Group;
  const { MonthPicker, RangePicker, WeekPicker } = DatePicker;
  const CheckboxGroup = Checkbox.Group;

  const { TextArea } = Input;
  const [visible, setVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  interface iResume {
    username: string;
    mobile: string;
    sex: number;
    job_intention: number[];
    birthday?: Date;
    service_year?: number;
    education?: number;
    school?: string;
    address?: string;
    work_experience?: string;
    stature?: number;
  }

  const job_intentions = [
    { label: '服务员', value: '01' },
    { label: '传菜员', value: '02' },
    { label: '收银员', value: '03' },
    { label: '果汁员', value: '04' },
    { label: '保洁', value: '05' },
    { label: '领班', value: '06' },
    { label: '经理', value: '07' },
    { label: '店长', value: '08' },
    { label: '营运总监', value: '09' },
    { label: '迎宾员', value: '10' },
    { label: '总经理', value: '11' },
    { label: '灶台', value: '20' },
    { label: '切配', value: '21' },
    { label: '打荷', value: '22' },
    { label: '蒸灶', value: '23' },
    { label: '冷菜', value: '24' },
    { label: '学徒', value: '25' },
    { label: '勤杂', value: '26' },
    { label: '厨师长', value: '27' },
    { label: '行政总厨', value: '28' },
    { label: '采购', value: '40' },
    { label: '司机', value: '41' },
    { label: '维修', value: '42' },
    { label: '后勤部长', value: '43' },
    { label: '文员', value: '61' },
    { label: '客服', value: '62' },
    { label: '人事经理', value: '63' },
    { label: '办公室主任', value: '64' },
    { label: '督导', value: '65' },
    { label: '出纳', value: '66' },
    { label: '主办会计', value: '67' },
    { label: '财务经理', value: '68' },
    { label: 'CFO', value: '69' },
    { label: '营销人员', value: '80' },
    { label: '客户经理', value: '81' },
  ];
  const { getFieldDecorator, validateFields, resetFields } = useForm<
    iResume
  >();

  const resumePost = (values: object) => {
    var value: any = values;
    if (!value.job_intention) value.job_intention = [];
    value.job_intention = Array.prototype.join.call(
      value.job_intention,
    );
    var e: any = JSON.stringify(value, null, 2);

    console.log(e);
    // setConfirmLoading(true);
    axios.defaults.headers.post['Content-Type'] =
      'application/json; charset=utf-8';
    axios
      .post(`${Constants.API_URL}resumes`, e)
      .then(function(response) {
        console.log(response);
        setConfirmLoading(false);
        handleReset();
        message.success('新增简历成功', 5);
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
        resumePost(values);
      })
      .catch(console.error);
  };

  return (
    <div style={{ margin: '0 0 24px' }}>
      <button
        className="ant-btn ant-btn-primary"
        onClick={() => setVisible(true)}
      >
        新增简历
      </button>
      <Modal
        title="新增简历"
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
          <Form.Item label="性别">
            {getFieldDecorator('sex', {
              rules: [
                {
                  required: true,
                  message: '此项必填',
                },
              ],
            })(
              <RadioGroup name="sex">
                <Radio value={1}>男</Radio>
                <Radio value={2}>女</Radio>
              </RadioGroup>,
            )}
          </Form.Item>
          <Form.Item label="身高">
            {getFieldDecorator('stature', {
              rules: [
                {
                  required: true,
                  message: '此项必填',
                },
              ],
            })(<Input placeholder="身高" />)}
          </Form.Item>
          <Form.Item label="出生年月">
            {getFieldDecorator('birthday', {
              rules: [
                {
                  required: true,
                  message: '此项必填',
                },
              ],
            })(<Input placeholder="出生年月" type="date" />)}
          </Form.Item>
          <Form.Item label="工作年限">
            {getFieldDecorator('service_year', {
              rules: [
                {
                  required: true,
                  message: '此项必填',
                },
              ],
            })(
              <Select defaultValue="0">
                <option value="0">未在餐饮企业工作过</option>
                <option value="1">1年</option>
                <option value="2">2年</option>
                <option value="3">3年</option>
                <option value="4">4年</option>
                <option value="5">5年</option>
                <option value="6">6年</option>
                <option value="7">7年</option>
                <option value="8">8年</option>
                <option value="9">9年</option>
                <option value="10">10年及以上</option>
              </Select>,
            )}
          </Form.Item>
          <Form.Item label="求职意向">
            {getFieldDecorator('job_intention', {
              rules: [
                {
                  required: true,
                  message: '此项必填',
                },
              ],
            })(<CheckboxGroup options={job_intentions} />)}
          </Form.Item>
          <Form.Item label="最高学历">
            {getFieldDecorator('education', {
              rules: [
                {
                  required: true,
                  message: '此项必填',
                },
              ],
            })(
              <RadioGroup name="education">
                <RadioButton value="1 " defaultChecked>
                  高中及以下
                </RadioButton>
                <RadioButton value="2">大专</RadioButton>
                <RadioButton value="3">本科</RadioButton>
                <RadioButton value="4">硕士及以上</RadioButton>
              </RadioGroup>,
            )}
          </Form.Item>
          <Form.Item label="毕业学校">
            {getFieldDecorator('school')(
              <Input placeholder="毕业学校" />,
            )}
          </Form.Item>
          <Form.Item label="家庭住址">
            {getFieldDecorator('address')(<TextArea rows={4} />)}
          </Form.Item>
          <Form.Item label="工作经历">
            {getFieldDecorator('work_experience')(
              <TextArea rows={4} />,
            )}
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ResumesModal;
