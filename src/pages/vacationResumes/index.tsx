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
} from 'antd';
import axios from 'axios';
import moment from 'moment';
import 'moment/locale/zh-cn';
import * as Constants from '../../utils/constants';
import useForm from 'rc-form-hooks';

const Option = Select.Option;
moment.locale('zh-cn');

const VacationResumes = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState({
    username: '',
    mobile: '',
    sex: '',
    job_intention: '',
    stature: '',
    yid: '',
    update_time: '',
    vacation_type: '',
  });
  const useDataApi = (url: any) => {
    const fetchData = async () => {
      const response = await axios
        .get(url, {
          params: search,
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
      fetchData();
    }, [search]);

    return data;
  };

  const [resumes, setResumes] = useState(
    useDataApi(`${Constants.API_URL}vacations`),
  );

  const columns = [
    {
      title: '姓名',
      dataIndex: 'username',
      key: 'id',
      width: 100,
    },

    {
      title: '手机号',
      dataIndex: 'mobile',
      key: 'mobile',
    },
    {
      title: '性别',
      dataIndex: 'sex',
    },
    {
      title: '寒/暑假',
      dataIndex: 'vacation_type',
    },
    {
      title: '求职意向',
      dataIndex: 'job_intention',
    },
    {
      title: '期望月薪',
      dataIndex: 'expected_salary',
    },
    {
      title: '身高',
      dataIndex: 'stature',
    },
    {
      title: '出生日期',
      dataIndex: 'birthday',

      render: (text: any, record: any) =>
        moment.unix(record.birthday).format('YYYY年MM月DD日'),
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
      title: 'Action',

      render: (text: any, record: any) => (
        <Popconfirm
          title="确认删除这个简历? "
          onConfirm={() => confirm(record.id)}
          okText="确认"
          cancelText="取消"
        >
          <button className="ant-btn ant-btn-danger">删除</button>
        </Popconfirm>
      ),
    },
  ];

  function confirm(id: any) {
    console.log(id);
    deleteResumes(id);
  }
  const deleteResumes = (id: any) => {
    axios
      .delete(`${Constants.API_URL}vacations/${id}`)
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
      update_time?: string;
      yid?: string;
      stature?: string;
      vacation_type?: string;
    }

    const job_intentions = [
      { label: '服务员', value: '01' },
      { label: '传菜员', value: '02' },
      { label: '收银员', value: '03' },
      { label: '果汁员', value: '04' },
      { label: '保洁', value: '05' },
      { label: '迎宾员', value: '10' },
      { label: '打荷', value: '22' },
      { label: '学徒', value: '25' },
    ];

    const { getFieldDecorator, getFieldsValue } = useForm<iResume>();

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
        stature: '',
        yid: '',
        update_time: '',
        vacation_type: '',
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
        .get(`${Constants.API_URL}vacations`, {
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
        <Form.Item label="寒/暑假">
          {getFieldDecorator('vacation_type', {
            initialValue: search.vacation_type,
          })(
            <Select placeholder="寒/暑假" style={{ width: 80 }}>
              <Option value="">全部</Option>
              <Option value="0">暑假</Option>
              <Option value="1">寒假</Option>
            </Select>,
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

export default VacationResumes;
