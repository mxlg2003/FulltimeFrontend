import React, { Fragment, useEffect, useState } from 'react';
import {
  Table,
  Popconfirm,
  message,
  Button,
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
// import ResumesModal from './modal_antd';
const Option = Select.Option;
moment.locale('zh-cn');

const Enterprises = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState({
    enterprise_name: '',
    abbreviation_name: '',
    username: '',
    mobile: '',
    telephone: '',
    posts: '',
    update_time: '',
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
    };

    useEffect(() => {
      fetchData();
    }, [search]);

    return data;
  };

  const [enterprises, setEnterprises] = useState(
    useDataApi(`${Constants.API_URL}enterprises`),
  );

  const columns = [
    {
      title: '商户全称',
      dataIndex: 'enterprise_name',
      key: 'id',
    },

    {
      title: '简称',
      dataIndex: 'abbreviation_name',
    },
    {
      title: '联系人姓名',
      dataIndex: 'username',
    },
    {
      title: '联系人职位',
      dataIndex: 'title',
    },
    {
      title: '联系人手机号',
      dataIndex: 'mobile',
    },
    {
      title: '门店吧台电话',
      dataIndex: 'telephone',
    },
    {
      title: '门店地址',
      dataIndex: 'address',
    },
    {
      title: '招聘岗位',
      dataIndex: 'posts',
      render: (text: any, record: any) =>
        record.posts.map((e: any) => {
          let color = 'red';
          switch (parseInt(e.post_id) / 20) {
            case 1:
              color = 'geekblue';
              break;
            case 2:
              color = 'green';
              break;
            case 3:
              color = 'orange';
              break;
            case 4:
              color = 'purple';
              break;
            default:
              color = 'red';
          }
          var content = e.post_name + ' x ' + e.number;

          return (
            <Tag color={color} key={e.post_id}>
              {content}
            </Tag>
          );
        }),
    },

    {
      title: '登记时间',
      dataIndex: 'create_time',
      key: 'create_time',
      render: (text: any, record: any) =>
        moment.unix(record.create_time).format('YYYY年MM月DD日'),
    },
    {
      title: '最后更新时间',
      dataIndex: 'update_time',
      key: 'update_time',
      sorter: (a: any, b: any) => a.update_time - b.update_time,
      render: (text: any, record: any) =>
        moment.unix(record.update_time).format('YYYY年MM月DD日'),
    },

    {
      title: '操作',

      render: (text: any, record: any) => (
        <Popconfirm
          title="确认删除? "
          onConfirm={() => confirm(record.id)}
          okText="确认"
          cancelText="取消"
        >
          {/* <a href="">删除</a> */}
          <Button type="danger" size="small">
            删除
          </Button>
        </Popconfirm>
      ),
    },
  ];

  function confirm(id: any) {
    console.log(id);
    deleteEnterprises(id);
  }

  const deleteEnterprises = (id: any) => {
    axios
      .delete(`${Constants.API_URL}enterprises/${id}`)
      .then(function(response) {
        setData(data.filter((e: any) => e.id !== id));
        message.success('删除成功', 5);
      })
      .catch(function(error) {
        console.log(error);
      });
  };

  const EnterprisesSearch = () => {
    interface iEnterprise {
      enterprise_name?: string;
      abbreviation_name?: string;
      username?: string;
      mobile?: string;
      telephone?: string;
      posts?: string;
      update_time?: string;
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

    const {
      getFieldDecorator,

      getFieldsValue,
    } = useForm<iEnterprise>();

    const handleSearch = (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      var values: any = getFieldsValue();
      setSearch(values);
    };
    const handleReset = (e: React.FormEvent) => {
      e.preventDefault();
      setSearch({
        enterprise_name: '',
        abbreviation_name: '',
        username: '',
        mobile: '',
        telephone: '',
        posts: '',
        update_time: '',
      });
      // console.log(search);
      // resumeSearch(search);
    };

    const enterpriseSearch = (values: object) => {
      var value: any = values;
      if (value.update_time) {
        value.update_time = moment(value.update_time).format(
          'YYYY-MM-DD',
        );
        console.log(value.update_time);
      }
      axios
        .get(`${Constants.API_URL}enterprises`, {
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
        <Form.Item label="商户全称">
          {getFieldDecorator('enterprise_name', {
            initialValue: search.enterprise_name,
          })(<Input placeholder="商户全称" style={{ width: 100 }} />)}
        </Form.Item>
        <Form.Item label="商户简称">
          {getFieldDecorator('abbreviation_name', {
            initialValue: search.abbreviation_name,
          })(<Input placeholder="商户简称" style={{ width: 100 }} />)}
        </Form.Item>
        <Form.Item label="联系人姓名">
          {getFieldDecorator('username', {
            initialValue: search.username,
          })(
            <Input placeholder="联系人姓名" style={{ width: 100 }} />,
          )}
        </Form.Item>
        <Form.Item label="手机号">
          {getFieldDecorator('mobile', {
            initialValue: search.mobile,
          })(
            <InputNumber
              placeholder="手机号"
              style={{ width: 150 }}
            />,
          )}
        </Form.Item>
        <Form.Item label="门店吧台电话">
          {getFieldDecorator('telephone', {
            initialValue: search.telephone,
          })(
            <InputNumber
              placeholder="门店吧台电话"
              style={{ width: 150 }}
            />,
          )}
        </Form.Item>
        <Form.Item label="用工意向">
          {getFieldDecorator('posts', {
            initialValue: search.posts,
          })(
            <Select placeholder="用工意向" style={{ width: 100 }}>
              {job_intentions.map(job => (
                <Option value={job.value} key={job.value}>
                  {job.label}
                </Option>
              ))}
            </Select>,
          )}
        </Form.Item>

        <Form.Item label="最后更新时间">
          {getFieldDecorator('update_time', {
            initialValue: search.update_time,
          })(<DatePicker />)}
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
      {/* <EnterprisesModal /> */}
      <EnterprisesSearch />
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

export default Enterprises;
