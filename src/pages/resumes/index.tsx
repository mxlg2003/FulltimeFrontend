import React, { Fragment, useEffect, useState } from 'react';
import {
  Table,
  message,
  Form,
  Input,
  Select,
  InputNumber,
  DatePicker,
  Tag,
} from 'antd';
import axios from 'axios';
import moment from 'moment';
import 'moment/locale/zh-cn';
import * as Constants from '../../utils/constants';
import useForm from 'rc-form-hooks';

const Option = Select.Option;
moment.locale('zh-cn');

const Resumes = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState({
    // username: '',
    // mobile: '',
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
  const fetchData = async (url: any) => {
    await axios
      .get(url, {
        params: search,
        headers: {
          Authorization: localStorage.getItem('jwtToken'),
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

    // setData(response.data);
    // setLoading(false);
  };

  useEffect(() => {
    fetchData(`${Constants.API_URL}resumes`);
  }, [search]);

  const columns = [
    {
      title: '性别',
      dataIndex: 'sex',
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
    },
    {
      title: '工作年限',
      dataIndex: 'service_year',
    },
    {
      title: '身高',
      dataIndex: 'stature',
    },
    {
      title: '最高学历',
      dataIndex: 'education',
    },
    {
      title: '社保',
      dataIndex: 'social_security',
    },
    {
      title: '出生日期',
      dataIndex: 'birthday',

      render: (text: any, record: any) =>
        moment.unix(record.birthday).format('YYYY年MM月DD日'),
    },
    {
      title: '现居住地',
      dataIndex: 'residence',
    },
    {
      title: '合作状态',
      dataIndex: 'cooperation_state',
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
    },
    {
      title: '登记时间',
      dataIndex: 'create_time',

      render: (text: any, record: any) =>
        moment.unix(record.create_time).format('YYYY年MM月DD日'),
    },
    {
      title: '最后更新时间',
      dataIndex: 'update_time',

      render: (text: any, record: any) =>
        moment.unix(record.update_time).format('YYYY年MM月DD日'),
    },
    {
      title: '业务员id',
      dataIndex: 'yid',
    },
    {
      title: '门店',
      dataIndex: 'shop_name',
    },
    {
      title: '门店所属区域',
      dataIndex: 'shop_district_fullname',
    },
    {
      title: '门店电话',
      dataIndex: 'shop_phone',
    },
  ];

  function confirm(id: any) {
    console.log(id);
    deleteResumes(id);
  }
  function change_cooperation_state(id: any) {
    console.log(id);
    axios
      .post(`${Constants.API_URL}resumes_cooperation_state/${id}`)
      .then(function() {
        fetchData(`${Constants.API_URL}resumes`);
        message.success('修改成功', 5);
      })
      .catch(function(error) {
        console.log(error);
      });
  }
  const deleteResumes = (id: any) => {
    axios
      .delete(`${Constants.API_URL}resumes/${id}`)
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
      // username?: string;
      // mobile?: string;
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

    const cuisine = [
      { label: '徽系', value: '01' },
      { label: '本地系', value: '02' },
      { label: '川系', value: '03' },
      { label: '沪杭系', value: '04' },
      { label: '湘系', value: '05' },
      { label: '粤系', value: '06' },
      { label: '淮扬系', value: '07' },
      { label: '东北系', value: '08' },
      { label: '火锅系', value: '09' },
      { label: '赣系', value: '10' },
      { label: '鲁系', value: '11' },
    ];

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
        // username: '',
        // mobile: '',
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
        .get(`${Constants.API_URL}resumes`, {
          params: value,
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

export default Resumes;
