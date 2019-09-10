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
  Modal,
} from 'antd';
import { Route, Link } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import 'moment/locale/zh-cn';
import * as Constants from '../../utils/constants';
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

  const fetchData = async (url: any) => {
    await axios
      .get(url, {
        headers: {
          Authorization: localStorage.getItem('jwtToken'),
          // jwt: Constants.USER_ID,
        },
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
    fetchData(`${Constants.API_URL}orders`);
  }, [search]);

  const columns = [
    {
      title: '订单编号',
      dataIndex: 'id',
      render: (text: any, record: any) => (
        <Link to={'/order/detail/' + record.id}>{text}</Link>
      ),
      key: 'id',
    },
    {
      title: '岗位名称',
      dataIndex: 'order_postName',
      render: (text: any, record: any) => (
        <Link to={'/order/detail/' + record.id}>{text}</Link>
      ),
    },
    {
      title: '关联商户名称',
      dataIndex: 'enterprise_name',
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
    // {
    //   title: 'Action',
    //   render: (text: any, record: any) => (
    //     <Popconfirm
    //       title="确认删除这个订单? "
    //       onConfirm={() => confirm(record.id)}
    //       okText="确认"
    //       cancelText="取消"
    //     >
    //       <button className="ant-btn ant-btn-danger">删除</button>
    //     </Popconfirm>
    //   ),
    // },
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

  const OrderModal = () => {
    const [value, setValue] = useState();
    const [visible, setVisible] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    interface iOrder {
      enterprise_id: string;
      order_postName: string;
      enterprise_name?: string;
      search_enterprise_name?: string;
    }

    const {
      getFieldDecorator,

      validateFields,
      setFieldsValue,
      resetFields,
    } = useForm<iOrder>();

    const orderPost = (values: object) => {
      var value: any = values;
      value.users_id = localStorage.getItem('user_id');
      value.shop_code = localStorage.getItem('shop_code');
      console.log(value);
      var e: any = JSON.stringify(value, null, 2);

      console.log(e);
      // setConfirmLoading(true);
      axios.defaults.headers.post['Content-Type'] =
        'application/json; charset=utf-8';
      axios.defaults.headers.post[
        'Authorization'
      ] = localStorage.getItem('jwtToken');
      axios
        .post(`${Constants.API_URL}orders`, e)
        .then(function(response) {
          console.log(response);
          setConfirmLoading(false);
          handleReset();
          fetchData(`${Constants.API_URL}orders`);
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
            `${
              Constants.API_URL
            }myEnterprises?enterprise_name=${value}`,
            {
              headers: {
                Authorization: localStorage.getItem('jwtToken'),
              },
            },
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
                <Input
                  placeholder="企业id"
                  readOnly
                  disabled={true}
                />,
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
              })(<Input placeholder="岗位名称" />)}
            </Form.Item>
          </Form>
        </Modal>
      </div>
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
      />
    </Fragment>
  );
};

export default Order;
