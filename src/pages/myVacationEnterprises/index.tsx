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
  Tag,
  Button,
  Modal,
} from 'antd';
import axios from 'axios';
import moment from 'moment';
import 'moment/locale/zh-cn';
import * as Constants from '../../utils/constants';
import useForm from 'rc-form-hooks';
import FormItem from 'antd/lib/form/FormItem';
// import ResumesModal from './modal_antd';
const Option = Select.Option;
moment.locale('zh-cn');

const MyVacationEnterprises = () => {
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
    vacation_type: '',
  });

  const job_intentions = Constants.job_intentions_vacation;

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
    fetchData(`${Constants.API_URL}myVacationEnterprises`);
  }, [search]);

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
          switch (Math.floor(parseInt(e.post_id) / 20)) {
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
        <Fragment>
          <MyEnterprisesEditModal record={record} />
          <MyEnterprisesPostsEditModal record={record} />
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
        </Fragment>
      ),
    },
  ];

  function confirm(id: any) {
    console.log(id);
    deleteEnterprises(id);
  }

  const deleteEnterprises = (id: any) => {
    axios
      .delete(`${Constants.API_URL}vacationEnterprises/${id}`)
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
      vacation_type?: string;
    }

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
        vacation_type: '',
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
        .get(`${Constants.API_URL}vacationEnterprises`, {
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

  const MyEnterprisesEditModal = (record: any) => {
    const [value, setValue] = useState(record.record);
    const [visible, setVisible] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);

    interface iResumes {
      id: number;
      address: string;
      enterprise_name: string;
      abbreviation_name: string;
      mobile: string;
      username: string;
      title: string;
      telephone: string;
      vacation_type: number;
      [propName: string]: any;
    }
    const {
      getFieldDecorator,
      validateFields,
      resetFields,
      getFieldsValue,
    } = useForm<iResumes>();

    const handleReset = () => {
      setVisible(false);
      resetFields();
    };

    const enterprisesEditPost = (values: object) => {
      var postValue: any = values;
      postValue.id = value.id;
      postValue.vacation_type = value.vacation_type_id;
      // postValue.posts = postValue.posts.join(',');
      // postValue.cuisines = postValue.cuisines.join(',');
      var e: any = JSON.stringify(postValue, null, 2);
      console.log(e);

      axios.defaults.headers.post['Content-Type'] =
        'application/json; charset=utf-8';
      axios.defaults.headers.post[
        'Authorization'
      ] = localStorage.getItem('jwtToken');
      axios
        .post(`${Constants.API_URL}vacationEnterprises`, e)
        .then(function(response) {
          console.log(response);
          setConfirmLoading(false);
          handleReset();
          fetchData(`${Constants.API_URL}myEnterprises`);
          message.success('简历修改成功', 5);
        })
        .catch(function(error) {
          console.log(error);
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      var values: any = getFieldsValue();
      console.log(values);
      enterprisesEditPost(values);
      // validateFields()
      //   .then((values: any) => {
      //     console.log(values);
      //     resumesEditPost(values);
      //   })
      //   .catch(console.error);
    };
    return (
      <Fragment>
        <Button
          className="ant-btn ant-btn-primary"
          size="small"
          style={{ margin: '0px 12px 12px 0px' }}
          onClick={() => setVisible(true)}
        >
          修改基本信息
        </Button>
        <Modal
          title="修改基本信息"
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
            <Form.Item label="寒/暑假">
              {getFieldDecorator('vacation_type', {
                initialValue: value.vacation_type,
              })(
                <Select placeholder="寒/暑假" style={{ width: 80 }}>
                  <Option value="">全部</Option>
                  <Option value="0">暑假</Option>
                  <Option value="1">寒假</Option>
                </Select>,
              )}
            </Form.Item>
            <Form.Item label="商户全称">
              {getFieldDecorator('enterprise_name', {
                initialValue: value.enterprise_name,
                rules: [
                  {
                    required: true,
                    message: '此项必填',
                  },
                ],
              })(<Input placeholder="商户全称" />)}
            </Form.Item>
            <Form.Item label="商户简称">
              {getFieldDecorator('abbreviation_name', {
                initialValue: value.abbreviation_name,
                rules: [
                  {
                    required: true,
                    message: '此项必填',
                  },
                ],
              })(<Input placeholder="商户简称" />)}
            </Form.Item>

            <Form.Item label="联系人姓名">
              {getFieldDecorator('username', {
                initialValue: value.username,
                rules: [
                  {
                    required: true,
                    message: '此项必填',
                  },
                ],
              })(<Input placeholder="联系人姓名" />)}
            </Form.Item>
            <Form.Item label="联系人职位">
              {getFieldDecorator('title', {
                initialValue: value.title,
                rules: [
                  {
                    required: true,
                    message: '此项必填',
                  },
                ],
              })(<Input placeholder="联系人职位" />)}
            </Form.Item>
            <Form.Item label="联系人手机号">
              {getFieldDecorator('mobile', {
                initialValue: value.mobile,
                rules: [
                  {
                    required: true,
                    message: '此项必填',
                  },
                ],
              })(<Input placeholder="联系人手机号" type="number" />)}
            </Form.Item>
            <Form.Item label="门店吧台电话">
              {getFieldDecorator('telephone', {
                initialValue: value.telephone,
                rules: [
                  {
                    required: true,
                    message: '此项必填',
                  },
                ],
              })(<Input placeholder="门店吧台电话" />)}
            </Form.Item>
            <Form.Item label="门店地址">
              {getFieldDecorator('address', {
                initialValue: value.address,
                rules: [
                  {
                    required: true,
                    message: '此项必填',
                  },
                ],
              })(<Input placeholder="门店地址" />)}
            </Form.Item>
          </Form>
        </Modal>
      </Fragment>
    );
  };

  const MyEnterprisesPostsEditModal = (record: any) => {
    const [value, setValue] = useState(record.record);
    const [visible, setVisible] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);

    interface iPost {
      number: number;
      value: string;
    }
    interface iPosts {
      [propName: string]: any;
    }

    const {
      getFieldDecorator,
      validateFields,
      resetFields,
      getFieldsValue,
    } = useForm<iPosts>();

    const handleReset = () => {
      setVisible(false);
      resetFields();
    };

    const enterprisesPostsEditPost = (values: object) => {
      let postValue: any = values;
      let p = { posts: new Array(), vacationEnterprise_id: 0 };
      console.log(postValue);
      for (let key in postValue) {
        if (postValue[key]) {
          console.log(key + ':' + postValue[key]);
          let t = { post_id: key, number: Number(postValue[key]) };
          p.posts.push(t);
          console.log(p.posts);
        }
      }
      p.vacationEnterprise_id = value.id;

      // postValue.cuisines = postValue.cuisines.join(',');
      let e: any = JSON.stringify(p, null, 2);
      console.log(e);

      axios.defaults.headers.post['Content-Type'] =
        'application/json; charset=utf-8';
      axios.defaults.headers.post[
        'Authorization'
      ] = localStorage.getItem('jwtToken');
      axios
        .post(`${Constants.API_URL}vacationPosts`, e)
        .then(function(response) {
          console.log(response);
          setConfirmLoading(false);
          handleReset();
          fetchData(`${Constants.API_URL}myVacationEnterprises`);
          message.success('岗位修改成功', 5);
        })
        .catch(function(error) {
          console.log(error);
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      var values: any = getFieldsValue();
      console.log(values);
      enterprisesPostsEditPost(values);
      // validateFields()
      //   .then((values: any) => {
      //     console.log(values);
      //     resumesEditPost(values);
      //   })
      //   .catch(console.error);
    };
    return (
      <Fragment>
        <Button
          className="ant-btn ant-btn-primary"
          size="small"
          style={{ margin: '0px 12px 12px 0px' }}
          onClick={() => setVisible(true)}
        >
          修改岗位信息
        </Button>
        <Modal
          title="修改岗位信息"
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
            layout="inline"
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
          >
            {job_intentions.map((job, index) => (
              <FormItem label={job.label}>
                {getFieldDecorator(`${job.value}`)(
                  <Input type="number" width="50px" />,
                )}
              </FormItem>
            ))}
          </Form>
        </Modal>
      </Fragment>
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

export default MyVacationEnterprises;
