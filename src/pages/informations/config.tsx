import React, { Fragment, useEffect, useState } from 'react';
import {
  Table,
  Popconfirm,
  message,
  Form,
  Input,
  Select,
  Modal,
  Cascader,
  Tag,
  Radio,
  Tooltip,
  Icon,
  Upload,
} from 'antd';
import axios from 'axios';
import moment from 'moment';
import 'moment/locale/zh-cn';
import * as Constants from '../../utils/constants';
import useForm from 'rc-form-hooks';

const { TextArea } = Input;
moment.locale('zh-cn');

const InformationConfig = () => {
  const [data, setData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [loading, setLoading] = useState(true);

  const columns = [
    {
      title: 'id',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '代码',
      dataIndex: 'name',
    },
    {
      title: '值',
      dataIndex: 'value',
    },
    {
      title: '说明',
      dataIndex: 'remark',
    },
    {
      title: '更新时间',
      dataIndex: 'update_time',
      render: (text: any, record: any) =>
        moment.unix(record.create_time).format('LLL'),
    },
    {
      title: 'Action',

      render: (text: any, record: any) => (
        <Fragment>
          {/* <InformationEditModal record={record} /> */}

          <Popconfirm
            title="确认删除? "
            onConfirm={() => confirm(record.id)}
            okText="确认"
            cancelText="取消"
          >
            <button className="ant-btn ant-btn-danger">删除</button>
          </Popconfirm>
        </Fragment>
      ),
    },
  ];

  const fetchData = async (url: any) => {
    await axios
      .get(url, {
        headers: {
          Authorization: localStorage.getItem('jwtToken'),
          // jwt: Constants.USER_ID,
        },
      })
      .then(function(response) {
        console.log(response);
        setLoading(false);
        setData(response.data.data);
      })
      .catch(function(error) {
        console.log(error);
      });
  };
  useEffect(() => {
    fetchData(`${Constants.API_URL}informationConfig`);
  }, []);

  function confirm(id: any) {
    console.log(id);
    deleteInformations(id);
  }

  const deleteInformations = (id: any) => {
    axios
      .delete(`${Constants.API_URL}information/${id}`)
      .then(function(response) {
        if (response.data.success) {
          //   fetchData(`${Constants.API_URL}informations`);
          message.success(response.data.massage, 5);
        } else {
          message.error(response.data.massage, 5);
        }
      })
      .catch(function(error) {
        console.log(error);
      });
  };
  return (
    <Fragment>
      {/* <InformationAddModal /> */}

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

export default InformationConfig;
