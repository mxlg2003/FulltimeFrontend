import React, { Fragment, useEffect, useState } from 'react';
import {
  Table,
  Popconfirm,
  message,
  Form,
  Input,
  Select,
  InputNumber,
  DatePicker,
  Tag,
  Button,
  Modal,
} from 'antd';
import axios from 'axios';
import moment from 'moment';
import 'moment/locale/zh-cn';
import * as Constants from '../../utils/constants';

import useForm from 'rc-form-hooks';
import TextArea from 'antd/lib/input/TextArea';
// import { Button } from 'antd/lib/radio';

const Option = Select.Option;
moment.locale('zh-cn');

const MyResumes = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState({
    username: '',
    mobile: '',
    sex: '',
    job_intention: '',
    cuisine: '',
    stature: '',
    yid: '',
    service_year: '',
    residence: '',
    working_state: '',
    cooperation_state: '',
    update_time: '',
  });
  const job_intentions = Constants.job_intentions;
  const cuisine = Constants.cuisine;

  const fetchData = async (url: any) => {
    await axios
      .get(url, {
        params: search,
        headers: {
          Authorization: localStorage.getItem('jwtToken'),
          // jwt: Constants.USER_ID,
        },
      })
      .then(function(response) {
        console.log(response);
        setLoading(false);
        setData(response.data);
      })
      .catch(function(error) {
        console.log(error);
      });
  };

  useEffect(() => {
    fetchData(`${Constants.API_URL}myResumes`);
  }, [search]);

  const columns = [
    {
      title: '姓名',
      dataIndex: 'username',
      key: 'id',
      width: 100,
      sorter: (a: any, b: any) => a.username - b.username,
    },

    {
      title: '手机号',
      dataIndex: 'mobile',
      key: 'mobile',
      sorter: (a: any, b: any) => a.mobile - b.mobile,
    },
    {
      title: '性别',
      dataIndex: 'sex',
      sorter: (a: any, b: any) => a.sex - b.sex,
    },
    {
      title: '求职意向',
      dataIndex: 'job_intention',
    },
    {
      title: '菜系',
      dataIndex: 'cuisine',
    },
    {
      title: '期望月薪',
      dataIndex: 'expected_salary',
      sorter: (a: any, b: any) =>
        a.expected_salary - b.expected_salary,
    },
    {
      title: '工作年限',
      dataIndex: 'service_year',
      sorter: (a: any, b: any) => a.service_year - b.service_year,
    },
    {
      title: '身高',
      dataIndex: 'stature',
      sorter: (a: any, b: any) => a.stature - b.stature,
    },
    {
      title: '最高学历',
      dataIndex: 'education',
      filters: [
        {
          text: '高中及以下',
          value: '高中及以下',
        },
        {
          text: '大专',
          value: '大专',
        },
        {
          text: '本科',
          value: '本科',
        },
        {
          text: '硕士及以上',
          value: '硕士及以上',
        },
      ],
      onFilter: (value: any, record: any) =>
        record.education.indexOf(value) === 0,
    },
    {
      title: '社保',
      dataIndex: 'social_security',
      filters: [
        {
          text: '不需要',
          value: '不需要',
        },
        {
          text: '无所谓',
          value: '无所谓',
        },
        {
          text: '必须要',
          value: '必须要',
        },
      ],
      onFilter: (value: any, record: any) =>
        record.social_security.indexOf(value) === 0,
    },
    {
      title: '出生日期',
      dataIndex: 'birthday',
      sorter: (a: any, b: any) => a.birthday - b.birthday,
      render: (text: any, record: any) =>
        moment.unix(record.birthday).format('YYYY年MM月DD日'),
    },
    {
      title: '现居住地',
      dataIndex: 'residence',
      filters: [
        {
          text: '镜湖区',
          value: '镜湖区',
        },
        {
          text: '弋江区',
          value: '弋江区',
        },
        {
          text: '鸠江区',
          value: '鸠江区',
        },
        {
          text: '三山区',
          value: '三山区',
        },
      ],
      onFilter: (value: any, record: any) =>
        record.residence.indexOf(value) === 0,
    },
    {
      title: '合作状态',
      dataIndex: 'cooperation_state',
      filters: [
        {
          text: '未合作',
          value: '未合作',
        },
        {
          text: '合作中',
          value: '合作中',
        },
      ],
      onFilter: (value: any, record: any) =>
        record.cooperation_state.indexOf(value) === 0,
      render: (text: any, record: any) => {
        let color = 'red';
        switch (record.cooperation_state) {
          case '未合作':
            color = 'geekblue';
            break;
          case '合作中':
            color = 'green';
            break;
        }
        return (
          <Tag color={color} key={record.id}>
            {record.cooperation_state}
          </Tag>
        );
      },
    },
    {
      title: '在职状态',
      dataIndex: 'working_state',
      sorter: (a: any, b: any) => a.working_state - b.working_state,
    },
    {
      title: '登记时间',
      dataIndex: 'create_time',
      sorter: (a: any, b: any) => a.create_time - b.create_time,

      render: (text: any, record: any) =>
        moment.unix(record.create_time).format('YYYY年MM月DD日'),
    },
    {
      title: '最后更新时间',
      dataIndex: 'update_time',
      sorter: (a: any, b: any) => a.update_time - b.update_time,

      render: (text: any, record: any) =>
        moment.unix(record.update_time).format('YYYY年MM月DD日'),
    },
    {
      title: '业务员id',
      dataIndex: 'yid',
      sorter: (a: any, b: any) => a.yid - b.yid,
    },
    {
      title: 'Action',

      render: (text: any, record: any) => (
        <Fragment>
          <MyResumesEditModal record={record} />
          <Popconfirm
            title="确认删除这个简历? "
            onConfirm={() => confirm(record.id)}
            okText="确认"
            cancelText="取消"
          >
            <Button type="danger" size="small">
              删除
            </Button>
          </Popconfirm>
          <Popconfirm
            title="确认变更合作状态"
            onConfirm={() => change_cooperation_state(record.id)}
            okText="确认"
            cancelText="取消"
          >
            <Button
              size="small"
              style={{ margin: '12px 12px 0px 0px' }}
            >
              变更合作状态
            </Button>
          </Popconfirm>
        </Fragment>
      ),
    },
  ];
  const MyResumesEditModal = (record: any) => {
    const [value, setValue] = useState(record.record);
    const [visible, setVisible] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    // console.log(value.job_intention_id);

    interface iResumes {
      id: number;
      birthday: string;
      username: string;
      mobile: string;
      sex: number;
      job_intention: string;
      cuisine: string;
      stature: string;
      service_year: string;
      residence: string;
      working_state: string;
      work_experience: string;
      education: string;
      expected_salary: number;
      social_security: number;
      // cooperation_state: string;
      // update_time: string;
    }
    const {
      getFieldDecorator,
      validateFields,
      resetFields,
      getFieldsValue,
    } = useForm<iResumes>();

    const handleReset = () => {
      setVisible(false);
      resetFields();
    };

    const resumesEditPost = (values: object) => {
      var postValue: any = values;
      postValue.id = value.id;
      postValue.job_intention = postValue.job_intention.join(',');
      postValue.cuisine = postValue.cuisine.join(',');
      var e: any = JSON.stringify(postValue, null, 2);
      console.log(e);

      axios.defaults.headers.post['Content-Type'] =
        'application/json; charset=utf-8';
      axios.defaults.headers.post[
        'Authorization'
      ] = localStorage.getItem('jwtToken');
      axios
        .post(`${Constants.API_URL}resumes`, e)
        .then(function(response) {
          console.log(response);
          setConfirmLoading(false);
          handleReset();
          fetchData(`${Constants.API_URL}myResumes`);
          message.success('简历修改成功', 5);
        })
        .catch(function(error) {
          console.log(error);
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      var values: any = getFieldsValue();
      console.log(values);
      resumesEditPost(values);
      // validateFields()
      //   .then((values: any) => {
      //     console.log(values);
      //     resumesEditPost(values);
      //   })
      //   .catch(console.error);
    };
    return (
      <Fragment>
        <Button
          className="ant-btn ant-btn-primary"
          size="small"
          style={{ margin: '0px 12px 0px 0px' }}
          onClick={() => setVisible(true)}
        >
          修改
        </Button>
        <Modal
          title="修改补贴记录"
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
                initialValue: value.username,
                rules: [
                  {
                    required: true,
                    message: '此项必填',
                  },
                ],
              })(<Input placeholder="姓名" />)}
            </Form.Item>
            <Form.Item label="手机号">
              {getFieldDecorator('mobile', {
                initialValue: value.mobile,
                rules: [
                  {
                    required: true,
                    message: '此项必填',
                  },
                ],
              })(<Input placeholder="手机号" type="number" />)}
            </Form.Item>
            <Form.Item label="性别">
              {getFieldDecorator('sex', {
                initialValue: String(value.sex_id),
                rules: [
                  {
                    required: true,
                    message: '此项必填',
                  },
                ],
              })(
                <Select placeholder="性别" style={{ width: 80 }}>
                  <Option value="">全部</Option>
                  <Option value="1">男</Option>
                  <Option value="2">女</Option>
                </Select>,
              )}
            </Form.Item>
            <Form.Item label="出生日期">
              {getFieldDecorator('birthday', {
                initialValue: moment
                  .unix(value.birthday)
                  .format('YYYY-MM-DD'),
                rules: [
                  {
                    required: true,
                    message: '此项必填',
                  },
                ],
              })(<Input placeholder="出生日期" type="date" />)}
            </Form.Item>
            <Form.Item label="最高学历">
              {getFieldDecorator('education', {
                initialValue: String(value.education_id),
                rules: [
                  {
                    required: true,
                    message: '此项必填',
                  },
                ],
              })(
                <Select placeholder="最高学历">
                  <Option value="1">高中及以下</Option>
                  <Option value="2">大专</Option>
                  <Option value="3">本科</Option>
                  <Option value="4">硕士及以上</Option>
                </Select>,
              )}
            </Form.Item>
            <Form.Item label="期望月薪">
              {getFieldDecorator('expected_salary', {
                initialValue: value.expected_salary,
                rules: [
                  {
                    required: true,
                    message: '此项必填',
                  },
                ],
              })(
                <InputNumber
                  placeholder="期望月薪"
                  style={{ width: 100 }}
                />,
              )}
            </Form.Item>
            <Form.Item label="是否需要企业购买社保">
              {getFieldDecorator('social_security', {
                initialValue: String(value.social_security_id),
                rules: [
                  {
                    required: true,
                    message: '此项必填',
                  },
                ],
              })(
                <Select
                  placeholder="是否需要企业购买社保"
                  style={{ width: 200 }}
                >
                  <Option value="0">不需要</Option>
                  <Option value="1">无所谓</Option>
                  <Option value="2">必须要</Option>
                </Select>,
              )}
            </Form.Item>
            <Form.Item label="求职意向">
              {getFieldDecorator('job_intention', {
                initialValue: value.job_intention_id,
                rules: [
                  {
                    required: true,
                    message: '此项必填',
                  },
                ],
              })(
                <Select mode="multiple" placeholder="求职意向">
                  {job_intentions.map(job => (
                    <Option value={job.value} key={job.value}>
                      {job.label}
                    </Option>
                  ))}
                </Select>,
              )}
            </Form.Item>
            <Form.Item label="擅长菜系">
              {getFieldDecorator('cuisine', {
                initialValue: value.cuisine_id || [],
              })(
                <Select mode="multiple" placeholder="擅长菜系">
                  {cuisine.map(x => (
                    <Option value={x.value} key={x.value}>
                      {x.label}
                    </Option>
                  ))}
                </Select>,
              )}
            </Form.Item>
            <Form.Item label="身高">
              {getFieldDecorator('stature', {
                initialValue: value.stature,
                rules: [
                  {
                    required: true,
                    message: '此项必填',
                  },
                ],
              })(
                <InputNumber
                  placeholder="160"
                  style={{ width: 70 }}
                />,
              )}
            </Form.Item>
            <Form.Item label="工作年限">
              {getFieldDecorator('service_year', {
                initialValue: String(value.service_year),
              })(
                <Select placeholder="工作年限">
                  <Option value="0">未在餐饮企业工作过</Option>
                  <Option value="1">1年及以上</Option>
                  <Option value="2">2年及以上</Option>
                  <Option value="3">3年及以上</Option>
                  <Option value="4">4年及以上</Option>
                  <Option value="5">5年及以上</Option>
                  <Option value="6">6年及以上</Option>
                  <Option value="7">7年及以上</Option>
                  <Option value="8">8年及以上</Option>
                  <Option value="9">9年及以上</Option>
                  <Option value="10">10年及以上</Option>
                </Select>,
              )}
            </Form.Item>
            <Form.Item label="在职状态">
              {getFieldDecorator('working_state', {
                initialValue: String(value.working_state_id),
              })(
                <Select placeholder="在职状态" style={{ width: 120 }}>
                  <Option value="0">即将离职</Option>
                  <Option value="1">已离职</Option>
                  <Option value="2">有更好可考虑</Option>
                  <Option value="3">在职,较满意</Option>
                </Select>,
              )}
            </Form.Item>
            <Form.Item label="现居住地">
              {getFieldDecorator('residence', {
                initialValue: String(value.residence_id),
              })(
                <Select placeholder="现居住地" style={{ width: 120 }}>
                  <Option value="0">镜湖区</Option>
                  <Option value="1">弋江区</Option>
                  <Option value="2">鸠江区</Option>
                  <Option value="3">三山区</Option>
                </Select>,
              )}
            </Form.Item>
            <Form.Item label="工作经历">
              {getFieldDecorator('work_experience', {
                initialValue: value.work_experience,
              })(<TextArea placeholder="工作经历" />)}
            </Form.Item>
          </Form>
        </Modal>
      </Fragment>
    );
  };

  function confirm(id: any) {
    console.log(id);
    deleteResumes(id);
  }
  function change_cooperation_state(id: any) {
    console.log(id);
    axios
      .get(`${Constants.API_URL}resumes_cooperation_state/${id}`, {
        headers: {
          Authorization: localStorage.getItem('jwtToken'),
        },
      })
      .then(function() {
        fetchData(`${Constants.API_URL}myResumes`);
        message.success('修改成功', 5);
      })
      .catch(function(error) {
        console.log(error);
      });
  }
  const deleteResumes = (id: any) => {
    axios
      .delete(`${Constants.API_URL}resumes/${id}`, {
        headers: {
          Authorization: localStorage.getItem('jwtToken'),
          // jwt: Constants.USER_ID,
        },
      })
      .then(function(response) {
        setData(data.filter((e: any) => e.id !== id));
        message.success('删除成功', 5);
      })
      .catch(function(error) {
        console.log(error);
      });
  };

  const ResumesSearch = () => {
    interface iResume {
      username?: string;
      mobile?: string;
      sex?: string;
      job_intention?: string;
      cuisine?: string;
      update_time?: string;
      service_year?: string;
      education?: string;
      cooperation_state?: string;
      working_state?: string;
      residence?: string;
      address?: string;
      yid?: string;
      stature?: string;
    }

    const {
      getFieldDecorator,

      getFieldsValue,
    } = useForm<iResume>();

    const handleSearch = (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      var values: any = getFieldsValue();
      setSearch(values);
    };

    const handleReset = (e: React.FormEvent) => {
      e.preventDefault();
      setSearch({
        username: '',
        mobile: '',
        sex: '',
        job_intention: '',
        cuisine: '',
        stature: '',
        yid: '',
        residence: '',
        working_state: '',
        cooperation_state: '',
        service_year: '',
        update_time: '',
      });
      // console.log(search);
      // resumeSearch(search);
    };

    const resumeSearch = (values?: object) => {
      var value: any = values;
      if (value.update_time) {
        value.update_time = moment(value.update_time).format(
          'YYYY-MM-DD',
        );
        console.log(value.update_time);
      }

      axios
        .get(`${Constants.API_URL}myResumes`, {
          params: search,
          headers: {
            Authorization: Constants.JWT,
          },
        })
        .then(function(response) {
          console.log(response);
          setLoading(false);
          setData(response.data);
        })
        .catch(function(error) {
          console.log(error);
        });
    };

    return (
      <Form layout="inline" onSubmit={handleSearch}>
        <Form.Item label="姓名">
          {getFieldDecorator('username', {
            initialValue: search.username,
          })(<Input placeholder="姓名" style={{ width: 100 }} />)}
        </Form.Item>
        <Form.Item label="手机号">
          {getFieldDecorator('mobile', {
            initialValue: search.mobile,
          })(
            <InputNumber
              type="tel"
              placeholder="手机号"
              style={{ width: 150 }}
            />,
          )}
        </Form.Item>
        <Form.Item label="性别">
          {getFieldDecorator('sex', {
            initialValue: search.sex,
          })(
            <Select placeholder="性别" style={{ width: 80 }}>
              <Option value="">全部</Option>
              <Option value="1">男</Option>
              <Option value="2">女</Option>
            </Select>,
          )}
        </Form.Item>
        <Form.Item label="求职意向">
          {getFieldDecorator('job_intention', {
            initialValue: search.job_intention,
          })(
            <Select placeholder="求职意向" style={{ width: 100 }}>
              {job_intentions.map(job => (
                <Option value={job.value} key={job.value}>
                  {job.label}
                </Option>
              ))}
            </Select>,
          )}
        </Form.Item>
        <Form.Item label="擅长菜系">
          {getFieldDecorator('cuisine', {
            initialValue: search.cuisine,
          })(
            <Select placeholder="擅长菜系" style={{ width: 100 }}>
              {cuisine.map(x => (
                <Option value={x.value} key={x.value}>
                  {x.label}
                </Option>
              ))}
            </Select>,
          )}
        </Form.Item>
        <Form.Item label="身高至少">
          {getFieldDecorator('stature', {
            initialValue: search.stature,
          })(<InputNumber placeholder="160" style={{ width: 70 }} />)}
        </Form.Item>

        <Form.Item label="最后更新时间">
          {getFieldDecorator('update_time', {
            initialValue: search.update_time,
          })(<DatePicker />)}
        </Form.Item>

        <Form.Item label="业务员id">
          {getFieldDecorator('yid', {
            initialValue: search.yid,
          })(<Input placeholder="123456" style={{ width: 100 }} />)}
        </Form.Item>
        <Form.Item label="工作年限">
          {getFieldDecorator('service_year', {
            initialValue: search.service_year,
          })(
            <Select placeholder="工作年限" style={{ width: 120 }}>
              <Option value="0">全部</Option>
              <Option value="1">1年及以上</Option>
              <Option value="2">2年及以上</Option>
              <Option value="3">3年及以上</Option>
              <Option value="4">4年及以上</Option>
              <Option value="5">5年及以上</Option>
              <Option value="6">6年及以上</Option>
              <Option value="7">7年及以上</Option>
              <Option value="8">8年及以上</Option>
              <Option value="9">9年及以上</Option>
              <Option value="10">10年及以上</Option>
            </Select>,
          )}
        </Form.Item>
        <Form.Item label="合作状态">
          {getFieldDecorator('cooperation_state', {
            initialValue: search.cooperation_state,
          })(
            <Select placeholder="合作状态" style={{ width: 120 }}>
              <Option value="">全部</Option>
              <Option value="0">未合作</Option>
              <Option value="1">合作中</Option>
            </Select>,
          )}
        </Form.Item>
        <Form.Item label="在职状态">
          {getFieldDecorator('working_state', {
            initialValue: search.working_state,
          })(
            <Select placeholder="在职状态" style={{ width: 120 }}>
              <Option value="">全部</Option>
              <Option value="0">即将离职</Option>
              <Option value="1">已离职</Option>
              <Option value="2">有更好可考虑</Option>
              <Option value="3">在职,较满意</Option>
            </Select>,
          )}
        </Form.Item>
        <Form.Item label="现居住地">
          {getFieldDecorator('residence', {
            initialValue: search.residence,
          })(
            <Select placeholder="现居住地" style={{ width: 120 }}>
              <Option value="">全部</Option>
              <Option value="0">镜湖区</Option>
              <Option value="1">弋江区</Option>
              <Option value="2">鸠江区</Option>
              <Option value="3">三山区</Option>
            </Select>,
          )}
        </Form.Item>
        <Form.Item>
          <button className="ant-btn ant-btn-primary">过滤</button>
          <button
            className="ant-btn "
            style={{ marginLeft: 8 }}
            onClick={handleReset}
          >
            重置
          </button>
        </Form.Item>
      </Form>
    );
  };

  return (
    <Fragment>
      {/* <ResumesModal /> */}
      <ResumesSearch />
      <Table
        columns={columns}
        dataSource={data}
        bordered={true}
        pagination={{
          pageSize: 20,
          defaultCurrent: 1,
        }}
        loading={loading}
        rowKey="id"
        //   scroll={{ x: 1600, y: 800 }}
      />
    </Fragment>
  );
};

export default MyResumes;
