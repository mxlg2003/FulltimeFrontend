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
import OrderModal from './modal';
import useForm from 'rc-form-hooks';

const Option = Select.Option;
moment.locale('zh-cn');

const Order = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState({
    enterprise_name: '',
    order_postName: '',
    create_time: '',
    effective_date: '',
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
    useDataApi(`${Constants.API_URL}orders`),
  );

  const columns = [
    {
      title: '岗位名称',
      dataIndex: 'order_postName',
      render: (text: any, record: any) => (
        <a href={'/order/detail/' + record.id}>{text}</a>
      ),
    },
    {
      title: '关联商户名称',
      dataIndex: 'enterprise_name',
      key: 'id',
    },

    {
      title: '登记时间',
      dataIndex: 'sex',
      render: (text: any, record: any) =>
        moment.unix(record.create_time).format('YYYY年MM月DD日'),
    },
    {
      title: '共收费',
      dataIndex: 'total_income',
    },
    {
      title: '费用有效日期',
      dataIndex: 'effective_date',
      render: (text: any, record: any) =>
        record.effective_date
          ? moment
              .unix(record.effective_date)
              .format('YYYY年MM月DD日')
          : '未收入',
    },
    {
      title: '补贴发放合计',
      dataIndex: 'total_disbursement',
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
      .delete(`${Constants.API_URL}orders/${id}`)
      .then(function(response) {
        setData(data.filter((e: any) => e.id !== id));
        message.success('删除成功', 5);
      })
      .catch(function(error) {
        console.log(error);
      });
  };

  const OrdersSearch = () => {
    interface iResume {
      enterprise_name?: string;
      order_postName?: string;
      create_time?: string;
      effective_date?: string;
    }

    const {
      getFieldDecorator,

      getFieldsValue,
    } = useForm<iResume>();

    const handleSearch = (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      var values: any = getFieldsValue();
      // if (values.effective_date) {
      //   values.effective_date = moment(values.effective_date).format(
      //     'YYYY-MM-DD',
      //   );
      //   console.log(values.effective_date);
      // }
      setSearch(values);
    };

    const handleReset = (e: React.FormEvent) => {
      e.preventDefault();
      setSearch({
        enterprise_name: '',
        order_postName: '',
        create_time: '',
        effective_date: '',
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
        <Form.Item label="创建时间">
          {getFieldDecorator('create_time', {
            initialValue: search.create_time,
          })(<DatePicker />)}
        </Form.Item>
        <Form.Item label="费用有效期(之前)">
          {getFieldDecorator('effective_date', {
            initialValue: search.effective_date,
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
      <OrderModal />
      <OrdersSearch />
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

export default Order;
