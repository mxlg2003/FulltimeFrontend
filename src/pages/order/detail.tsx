import React, { Fragment, useEffect, useState } from 'react';
import { Table } from 'antd';
import axios from 'axios';
import moment from 'moment';
import 'moment/locale/zh-cn';
import * as Constants from '../../utils/constants';
import DispatchModal from './dispatch_modal';
import IncomeModal from './income_modal';
import DisbursementModal from './disbursement_modal';

moment.locale('zh-cn');

const Detail = ({ match }: any) => {
  const order_id = parseInt(match.params.id);
  const url_order = `${Constants.API_URL}order/${order_id}`;
  const [order, setOrder] = useState({
    id: 0,
    enterprise_id: 0,
    enterprise_name: '',
    order_postName: '',
    effective_date: 1,
    total_income: 0,
    create_time: 1,
    total_disbursement: 0,
    dispatch: [],
    incomes: [],
    disbursement: [],
  });
  const [order_loading, setOrder_loading] = useState(true);

  const dispatch_columns = [
    {
      title: '姓名',
      dataIndex: 'resume_username',
      key: 'id',
    },

    {
      title: '手机号',
      dataIndex: 'resume_mobile',
    },

    {
      title: '派遣开始日期',
      dataIndex: 'start_date',
      render: (text: any, record: any) =>
        moment.unix(record.start_date).format('YYYY年MM月DD日'),
    },
    {
      title: '派遣结束日期',
      dataIndex: 'end_date',

      render: (text: any, record: any) =>
        record.end_date
          ? moment.unix(record.end_date).format('YYYY年MM月DD日')
          : '',
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
  ];

  const incomes_columns = [
    {
      title: '金额',
      dataIndex: 'sum',
    },
    {
      title: '缴费时间',
      dataIndex: 'income_date',
      render: (text: any, record: any) =>
        moment.unix(record.income_date).format('YYYY年MM月DD日'),
    },
    {
      title: '费用有效日期',
      dataIndex: 'effective_date',
      render: (text: any, record: any) =>
        moment.unix(record.effective_date).format('YYYY年MM月DD日'),
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
  ];

  const disbursement_columns = [
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
  ];

  const fetchData = async () => {
    axios
      .get(url_order)
      .then(function(response) {
        setOrder_loading(false);
        setOrder(response.data[0]);
        // console.log(response.data[0]);
      })
      .catch(function(error) {
        console.log(error);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  // interface iOrder {
  //   enterprise_name?: string;
  //   order_postName?: string;
  //   effective_date?: any;
  //   total_income?: number;
  //   create_time?: any;
  //   total_disbursement?: number;
  // }

  const Content = () => {
    return (
      <Fragment>
        <h1>订单详情:</h1>
        <div className="ant-divider ant-divider-horizontal" />
        <div className="ant-row">
          <div className="ant-col ant-col-xs-24 ant-col-sm-12 ant-col-md-8">
            <span className="m-16">订单编号:</span>
            {order.id}
          </div>
          <div className="ant-col ant-col-xs-24 ant-col-sm-12 ant-col-md-8">
            <span className="m-16">岗位名称:</span>
            {order.order_postName}
          </div>
          <div className="ant-col ant-col-xs-24 ant-col-sm-12 ant-col-md-8">
            <span className="m-16">关联商户名称:</span>
            {order.enterprise_name}
          </div>
          <div className="ant-col ant-col-xs-24 ant-col-sm-12 ant-col-md-8">
            <span className="m-16">登记时间:</span>
            {moment.unix(order.create_time).format('YYYY年MM月DD日')}
          </div>
          <div className="ant-col ant-col-xs-24 ant-col-sm-12 ant-col-md-8">
            <span className="m-16"> 共收费:</span>
            {order.total_income}
          </div>
          <div className="ant-col ant-col-xs-24 ant-col-sm-12 ant-col-md-8">
            <span className="m-16">费用有效日期:</span>
            {order.effective_date
              ? moment
                  .unix(order.effective_date)
                  .format('YYYY年MM月DD日')
              : '未收入'}
          </div>
          <div className="ant-col ant-col-xs-24 ant-col-sm-12 ant-col-md-8">
            <span className="m-16">补贴发放合计:</span>
            {order.total_disbursement}
          </div>
        </div>

        <div className="ant-divider ant-divider-horizontal" />
        <h1
          style={{ display: 'flex', justifyContent: 'space-between' }}
        >
          派遣记录:
          <DispatchModal
            enterprise_id={order.enterprise_id}
            order_id={order_id}
          />
        </h1>
        <div className="ant-table">
          <Table
            columns={dispatch_columns}
            dataSource={order.dispatch}
            bordered={true}
            pagination={{
              pageSize: 10,
              defaultCurrent: 1,
            }}
            loading={order_loading}
            rowKey="id"
            size="small"
          />
        </div>
        <div className="ant-divider ant-divider-horizontal" />
        <h1
          style={{ display: 'flex', justifyContent: 'space-between' }}
        >
          收入记录:
          <IncomeModal order_id={order_id} />
        </h1>
        <div className="ant-table">
          <Table
            columns={incomes_columns}
            dataSource={order.incomes}
            bordered={true}
            pagination={{
              pageSize: 10,
              defaultCurrent: 1,
            }}
            loading={order_loading}
            rowKey="id"
            size="small"
          />
        </div>
        <div className="ant-divider ant-divider-horizontal" />
        <h1
          style={{ display: 'flex', justifyContent: 'space-between' }}
        >
          补贴记录:
          <DisbursementModal order_id={order_id} />
        </h1>
        <div className="ant-table">
          <Table
            columns={disbursement_columns}
            dataSource={order.disbursement}
            bordered={true}
            pagination={{
              pageSize: 10,
              defaultCurrent: 1,
            }}
            loading={order_loading}
            rowKey="id"
            size="small"
          />
        </div>
      </Fragment>
    );
  };

  return order_loading ? <div> Loading... </div> : <Content />;
};

export default Detail;
