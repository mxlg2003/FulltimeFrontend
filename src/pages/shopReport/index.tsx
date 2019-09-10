import React, { Fragment, useEffect, useState } from 'react';
import {
  Table,
  Popconfirm,
  message,
  Form,
  Input,
  Select,
  Modal,
} from 'antd';
import axios from 'axios';
import moment from 'moment';
import 'moment/locale/zh-cn';
import * as Constants from '../../utils/constants';
import useForm from 'rc-form-hooks';

const Option = Select.Option;
moment.locale('zh-cn');

const ShopReport = () => {
  const [loading, setLoading] = useState(true);
  const [ShopData, setShopData] = useState([]);

  const fetchShopData = async (url: any) => {
    await axios
      .get(url)
      .then(function(response) {
        console.log(response.data);
        setLoading(false);
        setShopData(response.data);
      })
      .catch(function(error) {
        console.log(error);
      });
  };

  useEffect(() => {
    fetchShopData(`${Constants.API_URL}report`);
  }, []);

  const columns = [
    {
      title: '门店名称',
      dataIndex: 'shop_name',
      key: 'id',
    },

    {
      title: '简历总数量',
      dataIndex: 'resume_count',
    },
    {
      title: '简历已合作数量',
      dataIndex: 'resume_cooperationing_count',
    },
    {
      title: '企业数量',
      dataIndex: 'enterprise_count',
    },
    {
      title: '企业岗位数量',
      dataIndex: 'post_count',
    },
    {
      title: '订单总数',
      dataIndex: 'order_count',
    },
    {
      title: '收入总计',
      dataIndex: 'income_count',
    },
    {
      title: '支出总计',
      dataIndex: 'disbursement_count',
    },
  ];

  return (
    <Fragment>
      <Table
        columns={columns}
        dataSource={ShopData}
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

export default ShopReport;
