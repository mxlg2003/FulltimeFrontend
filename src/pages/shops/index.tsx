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
} from 'antd';
import axios from 'axios';
import moment from 'moment';
import 'moment/locale/zh-cn';
import * as Constants from '../../utils/constants';
import district from '../../utils/district';
// import ShopAddModal from './modal';
import useForm from 'rc-form-hooks';

const Option = Select.Option;
moment.locale('zh-cn');

const Shops = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

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
        setData(response.data);
      })
      .catch(function(error) {
        console.log(error);
      });
  };

  useEffect(() => {
    fetchData(`${Constants.API_URL}shops`);
  }, []);

  const columns = [
    {
      title: '门店名称',
      dataIndex: 'shop_name',
      key: 'id',
    },

    {
      title: '门店所属区域',
      dataIndex: 'shop_district_fullname',
    },

    {
      title: '门店电话',
      dataIndex: 'shop_phone',
    },

    {
      title: '门店地址',
      dataIndex: 'shop_address',
    },
    {
      title: '门店编码',
      dataIndex: 'shop_code',
    },

    {
      title: '登记时间',
      dataIndex: 'create_time',
    },

    {
      title: '最后更新时间',
      dataIndex: 'update_time',
    },

    {
      title: '更新人',
      dataIndex: 'update_user_name',
    },
    {
      title: 'Action',

      render: (text: any, record: any) => (
        <Fragment>
          <ShopEditModal record={record} />

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
    deleteShops(id);
  }
  const deleteShops = (id: any) => {
    axios
      .delete(`${Constants.API_URL}shops/${id}`)
      .then(function(response) {
        setData(data.filter((e: any) => e.id !== id));
        message.success('删除成功', 5);
      })
      .catch(function(error) {
        console.log(error);
      });
  };

  const ShopEditModal = (record: any) => {
    const shop: any = record.record;
    const [visible, setVisible] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [districtCode, setDistrictCode] = useState(
      shop.shop_district_code,
    );
    const [districtName, setDistrictName] = useState(
      shop.shop_district_name,
    );
    const [districtFullName, setDistrictFullName] = useState(
      shop.shop_district_fullname,
    );

    interface iShop {
      shop_name: string;
      shop_code: string;
      shop_district_code: string[];
      shop_district_name: string;
      shop_district_fullname: string[];
      shop_phone: string;
      shop_address: string;
      remark?: string;
    }

    function districtChange(value: any, selectedOptions: any) {
      console.log(value, selectedOptions);
      setDistrictCode(value);
      setDistrictName(selectedOptions[2].label);
      setDistrictFullName([
        selectedOptions[0].label,
        selectedOptions[1].label,
        selectedOptions[2].label,
      ]);
      console.log(districtCode, districtName, districtFullName);
    }

    const {
      getFieldDecorator,
      validateFields,
      getFieldsValue,
      resetFields,
    } = useForm<iShop>();

    const shopPost = (values: object) => {
      var value: any = values;
      console.log(value);
      value.id = shop.id;
      value.users_id = localStorage.getItem('user_id');
      value.shop_district_code = districtCode;
      value.shop_district_name = districtName;
      value.shop_district_fullname = districtFullName;
      var e: any = JSON.stringify(value, null, 2);
      console.log(e);
      // setConfirmLoading(true);
      axios.defaults.headers.post['Content-Type'] =
        'application/json; charset=utf-8';
      axios
        .post(`${Constants.API_URL}shop/${value.id}`, e)
        .then(function(response) {
          if (response.data.code == 10010) {
            setConfirmLoading(false);
            handleReset();
            message.warning(response.data.massage, 5);
          } else {
            fetchData(`${Constants.API_URL}shops`);
            message.success('修改门店信息成功', 5);
          }
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
          shopPost(values);
        })
        .catch(console.error);
    };

    return (
      <Fragment>
        <button
          className="ant-btn ant-btn-primary"
          onClick={() => setVisible(true)}
          style={{ margin: '0 24px 0 0' }}
        >
          修改
        </button>
        <Modal
          // title="修改系统用户信息"
          title={shop.username}
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
            <Form.Item label="门店名称">
              {getFieldDecorator('shop_name', {
                initialValue: shop.shop_name,
                rules: [
                  {
                    required: true,
                    message: '此项必填',
                  },
                ],
              })(<Input placeholder="门店名称" />)}
            </Form.Item>
            <Form.Item label="门店编码">
              {getFieldDecorator('shop_code', {
                initialValue: shop.shop_code,
                rules: [
                  {
                    required: true,
                    message: '此项必填',
                  },
                ],
              })(<Input placeholder="01" />)}
            </Form.Item>
            <Form.Item label="门店所属区域">
              {/* {getFieldDecorator('shop_district_code', {
                initialValue: districtCode,
                rules: [
                  {
                    required: true,
                    message: '此项必填',
                  },
                ],
              })(
                <Cascader
                  defaultValue={districtCode}
                  options={district}
                  onChange={onChange}
                />,
              )} */}
              <Cascader
                defaultValue={districtCode}
                options={district}
                onChange={districtChange}
              />
            </Form.Item>
            <Form.Item label="门店电话">
              {getFieldDecorator('shop_phone', {
                initialValue: shop.shop_phone,
                rules: [
                  {
                    required: true,
                    message: '此项必填',
                  },
                ],
              })(<Input placeholder="门店电话" />)}
            </Form.Item>
            <Form.Item label="门店地址">
              {getFieldDecorator('shop_address', {
                initialValue: shop.shop_address,
                rules: [
                  {
                    required: true,
                    message: '此项必填',
                  },
                ],
              })(<Input placeholder="门店地址" />)}
            </Form.Item>
            <Form.Item label="备注">
              {getFieldDecorator('remark', {
                initialValue: shop.remark,
                rules: [
                  {
                    required: false,
                    message: '',
                  },
                ],
              })(<Input placeholder="备注" />)}
            </Form.Item>
          </Form>
        </Modal>
      </Fragment>
    );
  };

  const ShopAddModal = () => {
    const [visible, setVisible] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [districtCode, setDistrictCode] = useState(['0', '0', '0']);
    const [districtName, setDistrictName] = useState('');
    const [districtFullName, setDistrictFullName] = useState([
      '',
      '',
      '',
    ]);
    interface iShop {
      shop_name: string;
      shop_code: string;
      shop_district_code: string[];
      shop_district_name: string;
      shop_district_fullname: string[];
      shop_phone: string;
      shop_address: string;
      remark?: string;
    }

    const {
      getFieldDecorator,
      validateFields,
      resetFields,
      getFieldsValue,
    } = useForm<iShop>();

    function districtChange(value: string[], selectedOptions: any) {
      console.log(value, selectedOptions);
      setDistrictCode(value);
      setDistrictName(selectedOptions[2].label);
      setDistrictFullName([
        selectedOptions[0].label,
        selectedOptions[1].label,
        selectedOptions[2].label,
      ]);
      console.log(districtCode, districtName, districtFullName);
    }

    const shopPost = (values: object) => {
      var value: any = values;
      console.log(value);
      value.users_id = localStorage.getItem('user_id');
      value.shop_district_code = districtCode;
      value.shop_district_name = districtName;
      value.shop_district_fullname = districtFullName;
      var e: any = JSON.stringify(value, null, 2);

      console.log(e);
      // setConfirmLoading(true);
      axios.defaults.headers.post['Content-Type'] =
        'application/json; charset=utf-8';
      axios
        .post(`${Constants.API_URL}shops`, e)
        .then(function(response) {
          console.log(response);
          setConfirmLoading(false);
          handleReset();
          fetchData(`${Constants.API_URL}shops`);
          message.success('新增门店成功', 5);
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
          shopPost(values);
        })
        .catch(console.error);
    };

    return (
      <div style={{ margin: '0 0 24px' }}>
        <button
          className="ant-btn ant-btn-primary"
          onClick={() => setVisible(true)}
        >
          新增门店
        </button>
        <Modal
          title="新增门店"
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
            <Form.Item label="门店名称">
              {getFieldDecorator('shop_name', {
                rules: [
                  {
                    required: true,
                    message: '此项必填',
                  },
                ],
              })(<Input placeholder="门店名称" />)}
            </Form.Item>
            <Form.Item label="门店编码">
              {getFieldDecorator('shop_code', {
                rules: [
                  {
                    required: true,
                    message: '此项必填',
                  },
                ],
              })(<Input placeholder="01" />)}
            </Form.Item>
            <Form.Item label="门店所属区域">
              {/* {getFieldDecorator('shop_district_code', {
                  initialValue: districtCode,
                  rules: [
                    {
                      required: true,
                      message: '此项必填',
                    },
                  ],
                })(
                  <Cascader
                    defaultValue={districtCode}
                    options={district}
                    onChange={onChange}
                  />,
                )} */}
              <Cascader
                options={district}
                onChange={districtChange}
              />
            </Form.Item>
            <Form.Item label="门店电话">
              {getFieldDecorator('shop_phone', {
                rules: [
                  {
                    required: true,
                    message: '此项必填',
                  },
                ],
              })(<Input placeholder="门店电话" />)}
            </Form.Item>
            <Form.Item label="门店地址">
              {getFieldDecorator('shop_address', {
                rules: [
                  {
                    required: true,
                    message: '此项必填',
                  },
                ],
              })(<Input placeholder="门店地址" />)}
            </Form.Item>
            <Form.Item label="备注">
              {getFieldDecorator('remark')(
                <Input placeholder="备注" />,
              )}
            </Form.Item>
          </Form>
        </Modal>
      </div>
    );
  };

  return (
    <Fragment>
      <ShopAddModal />

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

export default Shops;
