import React, { Fragment, useEffect, useState } from 'react';
import {
  Modal,
  Form,
  Input,
  Radio,
  message,
  DatePicker,
  Checkbox,
  Popconfirm,
  Table,
  Select,
  Button,
} from 'antd';
import axios from 'axios';
import useForm from 'rc-form-hooks';
import moment from 'moment';
import 'moment/locale/zh-cn';
import * as Constants from '../../utils/constants';

const { Option } = Select;
const checkPhoneNub = Constants.CheckPhoneNub;

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
    {
      title: '操作',
      render: (text: any, record: any) => (
        <Fragment>
          <DispatchEditModal record={record} />

          <Popconfirm
            title="确认删除? "
            onConfirm={() => deleteDispatch(record.id)}
            okText="确认"
            cancelText="取消"
          >
            <Button className="ant-btn ant-btn-danger" size="small">
              删除
            </Button>
          </Popconfirm>
        </Fragment>
      ),
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
    {
      title: '操作',
      render: (text: any, record: any) => (
        <Fragment>
          <IncomeEditModal record={record} />

          <Popconfirm
            title="确认删除? "
            onConfirm={() => deleteIncome(record.id)}
            okText="确认"
            cancelText="取消"
          >
            <Button className="ant-btn ant-btn-danger" size="small">
              删除
            </Button>
          </Popconfirm>
        </Fragment>
      ),
    },
  ];

  const IncomeModal = (order: any) => {
    const { TextArea } = Input;

    const [visible, setVisible] = useState(false);
    //   const [enterprise_id, setEnterprise_id] = useState();
    const [user_id, setUse_id] = useState(
      localStorage.getItem('user_id') || '',
    );
    const [confirmLoading, setConfirmLoading] = useState(false);
    interface iIncome {
      order_id: number;
      income_date: string;
      effective_date: string;
      sum: number;
      remark?: string;
    }

    const {
      getFieldDecorator,
      validateFields,
      resetFields,
    } = useForm<iIncome>();

    const incomePost = (values: object) => {
      var value: any = values;
      value.users_id = user_id;
      value.order_id = order.order_id;
      value.shop_code = localStorage.getItem('shop_code');
      var e: any = JSON.stringify(value, null, 2);

      console.log(e);

      axios.defaults.headers.post['Content-Type'] =
        'application/json; charset=utf-8';
      axios.defaults.headers.post[
        'Authorization'
      ] = localStorage.getItem('jwtToken');
      axios
        .post(`${Constants.API_URL}incomes`, e)
        .then(function(response) {
          console.log(response);
          setConfirmLoading(false);
          handleReset();
          fetchData();
          message.success('收入记录保存成功', 5);
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
          incomePost(values);
        })
        .catch(console.error);
    };

    return (
      <div
        style={{
          margin: '0  24px',
          textAlign: 'right',
          display: 'inline',
        }}
      >
        <button
          className="ant-btn ant-btn-primary"
          onClick={() => setVisible(true)}
        >
          新增收入记录
        </button>
        <Modal
          title="新增收入记录"
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
            {/* {console.log(
              enterprise_id.enterprise_id,
              enterprise_id.order_id,
            )} */}
            <Form.Item label="金额">
              {getFieldDecorator('sum', {
                rules: [
                  {
                    required: true,
                    message: '此项必填',
                  },
                ],
              })(<Input placeholder="金额" type="number" />)}
            </Form.Item>
            <Form.Item label="缴费时间">
              {getFieldDecorator('income_date', {
                rules: [
                  {
                    required: true,
                    message: '此项必填',
                  },
                ],
              })(<Input placeholder="缴费时间" type="date" />)}
            </Form.Item>
            <Form.Item label="费用有效日期">
              {getFieldDecorator('effective_date', {
                rules: [
                  {
                    required: true,
                    message: '此项必填',
                  },
                ],
              })(<Input placeholder="费用有效日期" type="date" />)}
            </Form.Item>

            <Form.Item label="备注">
              {getFieldDecorator('remark')(
                <TextArea
                  placeholder=""
                  autosize={{ minRows: 2, maxRows: 6 }}
                />,
              )}
            </Form.Item>
          </Form>
        </Modal>
      </div>
    );
  };
  const IncomeEditModal = (record: any) => {
    const { TextArea } = Input;
    const [value, setValue] = useState(record.record);
    const [visible, setVisible] = useState(false);
    //   const [enterprise_id, setEnterprise_id] = useState();
    const [user_id, setUse_id] = useState(
      localStorage.getItem('user_id') || '',
    );
    const [confirmLoading, setConfirmLoading] = useState(false);
    interface iIncome {
      order_id: number;
      income_date: string;
      effective_date: string;
      sum: number;
      remark?: string;
    }

    const {
      getFieldDecorator,
      validateFields,
      resetFields,
      setFieldsValue,
      getFieldsValue,
    } = useForm<iIncome>();

    const incomePost = (values: object) => {
      var postValue: any = values;
      postValue.users_id = user_id;
      postValue.shop_code = localStorage.getItem('shop_code');
      var e: any = JSON.stringify(postValue, null, 2);

      console.log(e);

      axios.defaults.headers.post['Content-Type'] =
        'application/json; charset=utf-8';
      axios.defaults.headers.post[
        'Authorization'
      ] = localStorage.getItem('jwtToken');
      axios
        .post(`${Constants.API_URL}income/${value.id}`, e)
        .then(function(response) {
          console.log(response);
          setConfirmLoading(false);
          handleReset();
          fetchData();
          message.success('收入记录保存成功', 5);
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
      var values: any = getFieldsValue();
      console.log(values);
      incomePost(values);
      // validateFields()
      //   .then((values: any) => {
      //     console.log(values);
      //     incomePost(values);
      //   })
      //   .catch(console.error);
    };

    return (
      <Fragment>
        <Button
          className="ant-btn ant-btn-primary"
          size="small"
          style={{ margin: '0px 12px 0px 0px' }}
          onClick={() => setVisible(true)}
        >
          修改
        </Button>
        <Modal
          title="修改收入记录"
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
            {/* {console.log(
              enterprise_id.enterprise_id,
              enterprise_id.order_id,
            )} */}
            <Form.Item label="金额">
              {getFieldDecorator('sum', {
                initialValue: value.sum,
                rules: [
                  {
                    required: true,
                    message: '此项必填',
                  },
                ],
              })(<Input placeholder="金额" type="number" />)}
            </Form.Item>
            <Form.Item label="缴费时间">
              {getFieldDecorator('income_date', {
                initialValue: moment
                  .unix(value.income_date)
                  .format('YYYY-MM-DD'),
                rules: [
                  {
                    required: true,
                    message: '此项必填',
                  },
                ],
              })(<Input placeholder="缴费时间" type="date" />)}
            </Form.Item>
            <Form.Item label="费用有效日期">
              {getFieldDecorator('effective_date', {
                initialValue: moment
                  .unix(value.effective_date)
                  .format('YYYY-MM-DD'),
                rules: [
                  {
                    required: true,
                    message: '此项必填',
                  },
                ],
              })(<Input placeholder="费用有效日期" type="date" />)}
            </Form.Item>

            <Form.Item label="备注">
              {getFieldDecorator('remark', {
                initialValue: value.remark,
              })(
                <TextArea
                  placeholder=""
                  autosize={{ minRows: 2, maxRows: 6 }}
                />,
              )}
            </Form.Item>
          </Form>
        </Modal>
      </Fragment>
    );
  };

  const deleteIncome = (id: any) => {
    axios
      .delete(`${Constants.API_URL}income/${id}`, {
        headers: {
          Authorization: localStorage.getItem('jwtToken'),
        },
      })
      .then(function(response) {
        console.log(response.data.code);
        if (response.data.code == 10010) {
          message.warning(response.data.massage, 5);
        } else {
          fetchData();
          message.success('删除成功', 5);
        }
      })
      .catch(function(error) {
        console.log(error);
      });
  };

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
    {
      title: '操作',
      render: (text: any, record: any) => (
        <Fragment>
          <DisbursementEditModal record={record} />

          <Popconfirm
            title="确认删除? "
            onConfirm={() => deleteDisbursement(record.id)}
            okText="确认"
            cancelText="取消"
          >
            <Button className="ant-btn ant-btn-danger" size="small">
              删除
            </Button>
          </Popconfirm>
        </Fragment>
      ),
    },
  ];

  const DisbursementModal = (order: any) => {
    const { TextArea } = Input;
    const [visible, setVisible] = useState(false);
    //   const [enterprise_id, setEnterprise_id] = useState();
    const [user_id, setUse_id] = useState(
      localStorage.getItem('user_id') || '',
    );
    const [confirmLoading, setConfirmLoading] = useState(false);
    interface iDisbursement {
      order_id: number;
      issue_date: string;
      start_date: string;
      end_date: string;
      username: string;
      mobile: string;
      sum: number;
      remark?: string;
    }

    const {
      getFieldDecorator,
      validateFields,
      resetFields,
    } = useForm<iDisbursement>();

    const disbursementPost = (values: object) => {
      var value: any = values;
      value.users_id = user_id;
      value.order_id = order.order_id;
      value.shop_code = localStorage.getItem('shop_code');
      var e: any = JSON.stringify(value, null, 2);

      console.log(e);

      axios.defaults.headers.post['Content-Type'] =
        'application/json; charset=utf-8';
      axios.defaults.headers.post[
        'Authorization'
      ] = localStorage.getItem('jwtToken');
      axios
        .post(`${Constants.API_URL}disbursements`, e)
        .then(function(response) {
          console.log(response);
          setConfirmLoading(false);
          handleReset();
          fetchData();
          message.success('补贴记录保存成功', 5);
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
          disbursementPost(values);
        })
        .catch(console.error);
    };

    return (
      <div
        style={{
          margin: '0  24px',
          textAlign: 'right',
          display: 'inline',
        }}
      >
        <button
          className="ant-btn ant-btn-primary"
          onClick={() => setVisible(true)}
        >
          新增补贴记录
        </button>
        <Modal
          title="新增补贴记录"
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
            {/* {console.log(
              enterprise_id.enterprise_id,
              enterprise_id.order_id,
            )} */}
            <Form.Item label="金额">
              {getFieldDecorator('sum', {
                rules: [
                  {
                    required: true,
                    message: '此项必填',
                  },
                ],
              })(<Input placeholder="金额" type="number" />)}
            </Form.Item>
            <Form.Item label="补贴发放日期">
              {getFieldDecorator('issue_date', {
                rules: [
                  {
                    required: true,
                    message: '此项必填',
                  },
                ],
              })(<Input placeholder="补贴发放日期" type="date" />)}
            </Form.Item>
            <Form.Item label="收款人姓名">
              {getFieldDecorator('username', {
                rules: [
                  {
                    required: true,
                    message: '此项必填',
                  },
                ],
              })(<Input placeholder="收款人姓名" />)}
            </Form.Item>
            <Form.Item label="收款人手机号">
              {getFieldDecorator('mobile', {
                rules: [
                  {
                    required: true,
                    message: '此项必填',
                  },
                  { validator: checkPhoneNub },
                ],
              })(<Input placeholder="收款人手机号" />)}
            </Form.Item>
            <Form.Item label="本次补贴计时开始日期">
              {getFieldDecorator('start_date', {
                rules: [
                  {
                    required: true,
                    message: '此项必填',
                  },
                ],
              })(
                <Input
                  placeholder="本次补贴计时开始日期"
                  type="date"
                />,
              )}
            </Form.Item>
            <Form.Item label="本次补贴计时结束日期">
              {getFieldDecorator('end_date', {
                rules: [
                  {
                    required: true,
                    message: '此项必填',
                  },
                ],
              })(
                <Input
                  placeholder="本次补贴计时结束日期"
                  type="date"
                />,
              )}
            </Form.Item>
            <Form.Item label="备注">
              {getFieldDecorator('remark')(
                <TextArea
                  placeholder=""
                  autosize={{ minRows: 2, maxRows: 6 }}
                />,
              )}
            </Form.Item>
          </Form>
        </Modal>
      </div>
    );
  };

  const DisbursementEditModal = (record: any) => {
    const { TextArea } = Input;
    const [value, setValue] = useState(record.record);
    const [visible, setVisible] = useState(false);
    //   const [enterprise_id, setEnterprise_id] = useState();
    const [user_id, setUse_id] = useState(
      localStorage.getItem('user_id') || '',
    );
    const [confirmLoading, setConfirmLoading] = useState(false);
    interface iDisbursement {
      order_id: number;
      issue_date: string;
      start_date: string;
      end_date: string;
      username: string;
      mobile: string;
      sum: number;
      remark?: string;
    }

    const {
      getFieldDecorator,
      validateFields,
      resetFields,
      getFieldsValue,
    } = useForm<iDisbursement>();

    const disbursementPost = (values: object) => {
      var postValue: any = values;
      postValue.users_id = user_id;
      postValue.shop_code = localStorage.getItem('shop_code');
      var e: any = JSON.stringify(postValue, null, 2);

      console.log(e);

      axios.defaults.headers.post['Content-Type'] =
        'application/json; charset=utf-8';
      axios.defaults.headers.post[
        'Authorization'
      ] = localStorage.getItem('jwtToken');
      axios
        .post(`${Constants.API_URL}disbursement/${value.id}`, e)
        .then(function(response) {
          console.log(response);
          setConfirmLoading(false);
          handleReset();
          fetchData();
          message.success('补贴记录保存成功', 5);
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
      var values: any = getFieldsValue();
      console.log(values);
      disbursementPost(values);
      // validateFields()
      //   .then((values: any) => {
      //     console.log(values);
      //     disbursementPost(values);
      //   })
      //   .catch(console.error);
    };

    return (
      <Fragment>
        <Button
          className="ant-btn ant-btn-primary"
          size="small"
          style={{ margin: '0px 12px 0px 0px' }}
          onClick={() => setVisible(true)}
        >
          修改
        </Button>
        <Modal
          title="修改补贴记录"
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
            {/* {console.log(
              enterprise_id.enterprise_id,
              enterprise_id.order_id,
            )} */}
            <Form.Item label="金额">
              {getFieldDecorator('sum', {
                initialValue: value.sum,
                rules: [
                  {
                    required: true,
                    message: '此项必填',
                  },
                ],
              })(<Input placeholder="金额" type="number" />)}
            </Form.Item>
            <Form.Item label="补贴发放日期">
              {getFieldDecorator('issue_date', {
                initialValue: moment
                  .unix(value.issue_date)
                  .format('YYYY-MM-DD'),
                rules: [
                  {
                    required: true,
                    message: '此项必填',
                  },
                ],
              })(<Input placeholder="补贴发放日期" type="date" />)}
            </Form.Item>
            <Form.Item label="收款人姓名">
              {getFieldDecorator('username', {
                initialValue: value.username,
                rules: [
                  {
                    required: true,
                    message: '此项必填',
                  },
                ],
              })(<Input placeholder="收款人姓名" />)}
            </Form.Item>
            <Form.Item label="收款人手机号">
              {getFieldDecorator('mobile', {
                initialValue: value.mobile,
                rules: [
                  {
                    required: true,
                    message: '此项必填',
                  },
                  { validator: checkPhoneNub },
                ],
              })(<Input placeholder="收款人手机号" />)}
            </Form.Item>
            <Form.Item label="本次补贴计时开始日期">
              {getFieldDecorator('start_date', {
                initialValue: moment
                  .unix(value.start_date)
                  .format('YYYY-MM-DD'),
                rules: [
                  {
                    required: true,
                    message: '此项必填',
                  },
                ],
              })(
                <Input
                  placeholder="本次补贴计时开始日期"
                  type="date"
                />,
              )}
            </Form.Item>
            <Form.Item label="本次补贴计时结束日期">
              {getFieldDecorator('end_date', {
                initialValue: moment
                  .unix(value.end_date)
                  .format('YYYY-MM-DD'),
                rules: [
                  {
                    required: true,
                    message: '此项必填',
                  },
                ],
              })(
                <Input
                  placeholder="本次补贴计时结束日期"
                  type="date"
                />,
              )}
            </Form.Item>
            <Form.Item label="备注">
              {getFieldDecorator('remark', {
                initialValue: value.remark,
              })(
                <TextArea
                  placeholder=""
                  autosize={{ minRows: 2, maxRows: 6 }}
                />,
              )}
            </Form.Item>
          </Form>
        </Modal>
      </Fragment>
    );
  };

  const deleteDisbursement = (id: any) => {
    axios
      .delete(`${Constants.API_URL}disbursement/${id}`, {
        headers: {
          Authorization: localStorage.getItem('jwtToken'),
        },
      })
      .then(function(response) {
        console.log(response.data.code);
        if (response.data.code == 10010) {
          message.warning(response.data.massage, 5);
        } else {
          fetchData();
          message.success('删除成功', 5);
        }
      })
      .catch(function(error) {
        console.log(error);
      });
  };

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
  const deleteDispatch = (id: any) => {
    axios
      .delete(`${Constants.API_URL}dispatch/${id}`, {
        headers: {
          Authorization: localStorage.getItem('jwtToken'),
        },
      })
      .then(function(response) {
        console.log(response.data.code);
        if (response.data.code == 10010) {
          message.warning(response.data.massage, 5);
        } else {
          fetchData();
          message.success('删除成功', 5);
        }
      })
      .catch(function(error) {
        console.log(error);
      });
  };

  const DispatchModal = (order: any) => {
    const { TextArea } = Input;
    const [value, setValue] = useState();
    const [visible, setVisible] = useState(false);
    const [user_id, setUse_id] = useState(
      localStorage.getItem('user_id') || '',
    );
    const [confirmLoading, setConfirmLoading] = useState(false);
    interface iDispatch {
      enterprise_id: number;
      order_id: number;
      resume_id?: string;
      resume_username?: string;
      resume_mobile?: string;
      search_resume_name?: string;
      search_resume_mobile?: string;
      start_date?: string;
      end_date?: string;
      remark?: string;
    }

    const {
      getFieldDecorator,
      validateFields,
      setFieldsValue,
      resetFields,
    } = useForm<iDispatch>();

    const dispatchPost = (values: object) => {
      var value: any = values;
      value.users_id = user_id;
      value.order_id = order.order_id;
      value.enterprise_id = order.enterprise_id;
      value.shop_code = localStorage.getItem('shop_code');
      var e: any = JSON.stringify(value, null, 2);

      console.log(e);
      // setConfirmLoading(true);
      axios.defaults.headers.post['Content-Type'] =
        'application/json; charset=utf-8';
      axios.defaults.headers.post[
        'Authorization'
      ] = localStorage.getItem('jwtToken');
      axios
        .post(`${Constants.API_URL}dispatchs`, e)
        .then(function(response) {
          console.log(response);
          setConfirmLoading(false);
          handleReset();
          fetchData();
          message.success('派遣记录保存成功', 5);
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
          dispatchPost(values);
        })
        .catch(console.error);
    };

    //用关键字搜索简历中姓名
    const SearchInput = (props: any) => {
      const [data, setData] = useState([]);

      const fetchData = (value: any) => {
        if (value.trim()) {
          if (/^\d+$/.test(value)) {
            axios
              .get(`${Constants.API_URL}resumes?mobile=${value}`, {
                headers: {
                  Authorization: localStorage.getItem('jwtToken'),
                  // jwt: Constants.USER_ID,
                },
              })
              .then(function(response) {
                console.log(response);
                setData(response.data);
              })
              .catch(function(error) {
                console.log(error);
              });
          } else {
            axios
              .get(`${Constants.API_URL}resumes?username=${value}`, {
                headers: {
                  Authorization: localStorage.getItem('jwtToken'),
                  // jwt: Constants.USER_ID,
                },
              })
              .then(function(response) {
                console.log(response);
                setData(response.data);
              })
              .catch(function(error) {
                console.log(error);
              });
          }
        }
      };
      const handleSearch = (value: string) => {
        fetchData(value);
      };

      const handleChange = (value: any) => {
        console.log(value.label);
        setFieldsValue({
          resume_id: value.key,
          resume_username: value.label,
        });
        // setEnterprise_id(value.key);
        // setEnterprise_name(value.label);
        setValue(value.label);
      };

      const options = data.map((d: any) => (
        <Option key={d.id}>
          {d.username}[{d.mobile}]
        </Option>
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
      <div
        style={{
          margin: '0  24px',
          textAlign: 'right',
          display: 'inline',
        }}
      >
        <button
          className="ant-btn ant-btn-primary"
          onClick={() => setVisible(true)}
        >
          新增派遣记录
        </button>
        <Modal
          title="新增派遣记录"
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
            <Form.Item label="搜索简历">
              {getFieldDecorator('search_resume_name')(
                <SearchInput placeholder="请在简历中搜索派遣员工姓名或手机号" />,
              )}
            </Form.Item>
            {/* {console.log(
              enterprise_id.enterprise_id,
              enterprise_id.order_id,
            )} */}
            <Form.Item label="简历id">
              {getFieldDecorator('resume_id', {
                rules: [
                  {
                    required: true,
                    message: '此项必填',
                  },
                ],
              })(
                <Input
                  placeholder="简历id"
                  readOnly
                  disabled={true}
                />,
              )}
            </Form.Item>
            <Form.Item label="姓名/电话">
              {getFieldDecorator('resume_username', {
                rules: [
                  {
                    required: true,
                    message: '此项必填',
                  },
                ],
              })(
                <Input placeholder="姓名" readOnly disabled={true} />,
              )}
            </Form.Item>

            <Form.Item label="派遣开始日期">
              {getFieldDecorator('start_date', {
                rules: [
                  {
                    required: true,
                    message: '此项必填',
                  },
                ],
              })(<Input placeholder="派遣开始日期" type="date" />)}
            </Form.Item>
            <Form.Item label="派遣结束日期">
              {getFieldDecorator('end_date')(
                <Input placeholder="派遣开始日期" type="date" />,
              )}
            </Form.Item>
            <Form.Item label="备注">
              {getFieldDecorator('remark')(
                <TextArea
                  placeholder=""
                  autosize={{ minRows: 2, maxRows: 6 }}
                />,
              )}
            </Form.Item>
          </Form>
        </Modal>
      </div>
    );
  };

  const DispatchEditModal = (record: any) => {
    const { TextArea } = Input;

    const [value, setValue] = useState(record.record);
    const [visible, setVisible] = useState(false);
    const [user_id, setUse_id] = useState(
      localStorage.getItem('user_id') || '',
    );
    const [confirmLoading, setConfirmLoading] = useState(false);
    interface iDispatch {
      enterprise_id: number;
      order_id: number;
      resume_id?: string;
      resume_username?: string;
      resume_mobile?: string;
      search_resume_name?: string;
      search_resume_mobile?: string;
      start_date?: string;
      end_date?: string;
      remark?: string;
    }

    const {
      getFieldDecorator,
      validateFields,
      getFieldsValue,
      setFieldsValue,
      resetFields,
    } = useForm<iDispatch>();

    useEffect(() => {
      setFieldsValue({
        resume_id: record.resume_id,
        resume_username: record.resume_username,
        start_date: record.start_date,
        end_date: record.end_date,
        remark: record.remark,
      });
    }, []);

    const dispatchPost = (values: object) => {
      console.log('values');
      var postValue: any = values;

      postValue.users_id = user_id;
      // let id = value.id;
      postValue.enterprise_id = order.enterprise_id;
      postValue.shop_code = localStorage.getItem('shop_code');
      var e: any = JSON.stringify(postValue, null, 2);

      console.log(e);
      // setConfirmLoading(true);
      axios.defaults.headers.post['Content-Type'] =
        'application/json; charset=utf-8';
      axios.defaults.headers.post[
        'Authorization'
      ] = localStorage.getItem('jwtToken');
      axios
        .post(`${Constants.API_URL}dispatch/${value.id}`, e)
        .then(function(response) {
          console.log(response);
          setConfirmLoading(false);
          handleReset();
          fetchData();
          message.success('派遣记录保存成功', 5);
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
      // console.log('111');
      var values: any = getFieldsValue();
      console.log(values);
      dispatchPost(values);
      // validateFields()
      //   .then((values: any) => {
      //   })
      //   .catch(console.error);
    };

    //用关键字搜索简历中姓名
    const SearchInput = (props: any) => {
      const [data, setData] = useState([]);

      const fetchData = (value: any) => {
        if (value.trim()) {
          if (/^\d+$/.test(value)) {
            axios
              .get(`${Constants.API_URL}resumes?mobile=${value}`, {
                headers: {
                  Authorization: localStorage.getItem('jwtToken'),
                  // jwt: Constants.USER_ID,
                },
              })
              .then(function(response) {
                console.log(response);
                setData(response.data);
              })
              .catch(function(error) {
                console.log(error);
              });
          } else {
            axios
              .get(`${Constants.API_URL}resumes?username=${value}`, {
                headers: {
                  Authorization: localStorage.getItem('jwtToken'),
                  // jwt: Constants.USER_ID,
                },
              })
              .then(function(response) {
                console.log(response);
                setData(response.data);
              })
              .catch(function(error) {
                console.log(error);
              });
          }
        }
      };
      const handleSearch = (value: string) => {
        fetchData(value);
      };

      const handleChange = (value: any) => {
        console.log(value.label);
        // setEnterprise_id(value.key);
        // setEnterprise_name(value.label);
        setFieldsValue({
          resume_id: value.key,
          resume_username: value.label,
        });
        // setSearchValue(value.label);
      };

      const options = data.map((d: any) => (
        <Option key={d.id}>
          {d.username}[{d.mobile}]
        </Option>
      ));
      return (
        <Select
          showSearch
          // value={searchValue}
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
      <Fragment>
        <Button
          className="ant-btn ant-btn-primary"
          size="small"
          style={{ margin: '0px 12px 0px 0px' }}
          onClick={() => setVisible(true)}
        >
          修改
        </Button>
        <Modal
          title="修改派遣记录"
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
            <Form.Item label="搜索简历">
              {getFieldDecorator('search_resume_name')(
                <SearchInput placeholder="请在简历中搜索派遣员工姓名或手机号" />,
              )}
            </Form.Item>
            {/* {console.log(
              enterprise_id.enterprise_id,
              enterprise_id.order_id,
            )} */}
            <Form.Item label="简历id">
              {getFieldDecorator('resume_id', {
                initialValue: value.resume_id,
                rules: [
                  {
                    required: true,
                    message: '此项必填',
                  },
                ],
              })(
                <Input
                  placeholder="简历id"
                  readOnly
                  disabled={true}
                />,
              )}
            </Form.Item>
            <Form.Item label="姓名/电话">
              {getFieldDecorator('resume_username', {
                initialValue: value.resume_username,
                rules: [
                  {
                    required: true,
                    message: '此项必填',
                  },
                ],
              })(
                <Input placeholder="姓名" readOnly disabled={true} />,
              )}
            </Form.Item>

            <Form.Item label="派遣开始日期">
              {getFieldDecorator('start_date', {
                initialValue: moment
                  .unix(value.start_date)
                  .format('YYYY-MM-DD'),
                rules: [
                  {
                    required: true,
                    message: '此项必填',
                  },
                ],
              })(<Input placeholder="派遣开始日期" type="date" />)}
            </Form.Item>
            <Form.Item label="派遣结束日期">
              {getFieldDecorator('end_date', {
                initialValue: moment
                  .unix(value.end_date)
                  .format('YYYY-MM-DD'),
              })(<Input placeholder="派遣结束日期" type="date" />)}
            </Form.Item>
            <Form.Item label="备注">
              {getFieldDecorator('remark', {
                initialValue: value.remark,
              })(
                <TextArea
                  placeholder=""
                  autosize={{ minRows: 2, maxRows: 6 }}
                />,
              )}
            </Form.Item>
          </Form>
        </Modal>
      </Fragment>
    );
  };

  return order_loading ? <div> Loading... </div> : <Content />;
};

export default Detail;
