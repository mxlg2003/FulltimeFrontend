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

const Disbursement = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState({
    enterprise_name: '',
    order_postName: '',
    username: '',
    mobile: '',
    sum: 0,
    start_date: '',
    issue_date: '',
    end_date: '',
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
    useDataApi(`${Constants.API_URL}disbursements`),
  );

  const columns = [
    {
      title: '岗位名称',
      dataIndex: 'order_postName',
      key: 'id',
    },
    {
      title: '企业名称',
      dataIndex: 'enterprise_name',
    },

    {
      title: '收款人姓名',
      dataIndex: 'username',
    },
    {
      title: '收款人手机号',
      dataIndex: 'mobile',
    },
    {
      title: '金额',
      dataIndex: 'sum',
    },
    {
      title: '补贴发放日期',
      dataIndex: 'issue_date',
      render: (text: any, record: any) =>
        moment.unix(record.issue_date).format('YYYY年MM月DD日'),
    },
    {
      title: '补贴计时开始',
      dataIndex: 'start_date',
      render: (text: any, record: any) =>
        moment.unix(record.start_date).format('YYYY年MM月DD日'),
    },
    {
      title: '补贴计时结束',
      dataIndex: 'end_date',
      render: (text: any, record: any) =>
        moment.unix(record.end_date).format('YYYY年MM月DD日'),
    },
    {
      title: '备注',
      dataIndex: 'remark',
    },

    {
      title: '最后更新时间',
      dataIndex: 'update_time',
      render: (text: any, record: any) =>
        moment.unix(record.update_time).format('YYYY年MM月DD日'),
    },
    {
      title: 'Action',
      render: (text: any, record: any) => (
        <Popconfirm
          title="确认删除这个订单? "
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
    deleteOrders(id);
  }
  const deleteOrders = (id: any) => {
    axios
      .delete(`${Constants.API_URL}disbursements/${id}`)
      .then(function(response) {
        setData(data.filter((e: any) => e.id !== id));
        message.success('删除成功', 5);
      })
      .catch(function(error) {
        console.log(error);
      });
  };

  const DisbursementsSearch = () => {
    interface iResume {
      enterprise_name?: string;
      order_postName?: string;
      sum?: number;
      start_date?: string;
      end_date?: string;
      username?: string;
      mobile?: string;
      issue_date?: string;
    }

    const {
      getFieldDecorator,

      getFieldsValue,
    } = useForm<iResume>();

    const handleSearch = (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      var values: any = getFieldsValue();
      console.log(values);
      setSearch(values);
    };

    const handleReset = (e: React.FormEvent) => {
      e.preventDefault();
      setSearch({
        enterprise_name: '',
        order_postName: '',
        username: '',
        mobile: '',
        sum: 0,
        start_date: '',
        issue_date: '',
        end_date: '',
      });
      // console.log(search);
      // resumeSearch(search);
    };

    return (
      <Form layout="inline" onSubmit={handleSearch}>
        <Form.Item label="关联商户名称">
          {getFieldDecorator('enterprise_name', {
            initialValue: search.enterprise_name,
          })(
            <Input
              placeholder="关联商户名称"
              style={{ width: 100 }}
            />,
          )}
        </Form.Item>
        <Form.Item label="岗位名称">
          {getFieldDecorator('order_postName', {
            initialValue: search.order_postName,
          })(
            <Input
              type="tel"
              placeholder="岗位名称"
              style={{ width: 150 }}
            />,
          )}
        </Form.Item>
        <Form.Item label="姓名">
          {getFieldDecorator('username', {
            initialValue: search.username,
          })(<Input placeholder="姓名" />)}
        </Form.Item>
        <Form.Item label="电话">
          {getFieldDecorator('mobile', {
            initialValue: search.mobile,
          })(<Input placeholder="电话" />)}
        </Form.Item>
        <Form.Item label="金额(以上)">
          {getFieldDecorator('sum', {
            initialValue: search.sum,
          })(
            <InputNumber placeholder="金额" style={{ width: 100 }} />,
          )}
        </Form.Item>
        <Form.Item label="补贴计时开始(之前)">
          {getFieldDecorator('start_date', {
            initialValue: search.start_date,
          })(<DatePicker />)}
        </Form.Item>
        <Form.Item label="补贴计时结束(之前)">
          {getFieldDecorator('end_date', {
            initialValue: search.end_date,
          })(<DatePicker />)}
        </Form.Item>
        <Form.Item label="补贴发放日期(之前)">
          {getFieldDecorator('issue_date', {
            initialValue: search.issue_date,
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
      <DisbursementsSearch />
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

export default Disbursement;
