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
import { string, object } from 'prop-types';

const { TextArea } = Input;
moment.locale('zh-cn');

const ProjectMessage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async (url: any) => {
    await axios
      .get(url)
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
    fetchData(`${Constants.API_URL}projectMessages/`);
  }, []);

  const columns = [
    {
      title: '所属项目',
      dataIndex: 'project_name',
      key: 'id',
      // render: (text: any, record: any) => (
      //   <a href={'/project/' + record.project_id} target="_blank">
      //     {record.project_name}
      //   </a>
      // ),
    },

    {
      title: '联系人姓名',
      dataIndex: 'username',
    },

    {
      title: '联系人手机号',
      dataIndex: 'mobile',
    },
    {
      title: '留言内容',
      dataIndex: 'content',
    },
    {
      title: '留言时间',
      dataIndex: 'create_time',
      render: (text: any, record: any) =>
        moment.unix(record.create_time).format('LLL'),
    },
    {
      title: 'Action',

      render: (text: any, record: any) => (
        <Fragment>
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

  function confirm(id: any) {
    console.log(id);
    deleteMessage(id);
  }

  const deleteMessage = (id: any) => {
    axios
      .delete(`${Constants.API_URL}projectMessage/${id}`)
      .then(function(response) {
        if (response.data.success) {
          fetchData(`${Constants.API_URL}projectMessages/`);
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

export default ProjectMessage;
