import React, {
  Fragment,
  Component,
  useState,
  useEffect,
} from 'react';
import {
  Modal,
  Form,
  Input,
  Button,
  Radio,
  message,
  DatePicker,
  Checkbox,
  Select,
  InputNumber,
} from 'antd';
import useForm from 'rc-form-hooks';
import axios from 'axios';
import * as Constants from '../../utils/constants';

const CheckboxGroup = Checkbox.Group;

const RolesModal = () => {
  interface iRole {
    name: string;
    menus: string;
    remark?: string;
  }
  interface iMenuOptions {
    label: string;
    value: string;
  }
  const [menuOptions, setMenuOptions] = useState<iMenuOptions[]>([]);

  const [visible, setVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [checkedList, setCheckedList] = useState<string[]>([]);
  const [indeterminate, setIndeterminate] = useState(false);
  const [checkAll, setCheckAll] = useState(false);
  const { getFieldDecorator, validateFields, resetFields } = useForm<
    iRole
  >();

  const getAllMenu = async (url: any) => {
    await axios
      .get(url)
      .then(function(response) {
        console.log(response.data);
        let value: iMenuOptions[] = [];
        for (let x of response.data) {
          let item: any = x;
          value.push({
            label: item.ItemName,
            value: item.ItemId,
          });
        }
        console.log(value);
        setMenuOptions(value);
      })
      .catch(function(error) {
        console.log(error);
      });
  };

  useEffect(() => {
    getAllMenu(`${Constants.API_URL}menus`);
  }, []);

  const rolePost = (values: object) => {
    var value: any = values;
    value.users_id = localStorage.getItem('user_id');
    value.menus = checkedList;
    var e: any = JSON.stringify(value, null, 2);

    console.log(e);
    // setConfirmLoading(true);
    axios.defaults.headers.post['Content-Type'] =
      'application/json; charset=utf-8';
    axios
      .post(`${Constants.API_URL}roles`, e)
      .then(function(response) {
        console.log(response);
        setConfirmLoading(false);
        handleReset();
        message.success('新增角色用户成功', 5);
      })
      .catch(function(error) {
        console.log(error);
      });
  };

  function onChange(checkedList: any) {
    //console.log('checked = ', checkedList);
    setCheckedList(checkedList);
    console.log(checkedList);
    setIndeterminate(
      !!checkedList.length && checkedList.length < menuOptions.length,
    );
    // if checkedList.length === menuOptions.length,
    //console.log(checkedList.length == menuOptions.length);
    setCheckAll(checkedList.length == menuOptions.length);
  }

  function onCheckAllChange(e: any) {
    console.log(e.target.checked);
    let dataList: string[] = [];
    for (var v of menuOptions) {
      dataList.push(v.value);
    }
    setCheckedList(e.target.checked ? dataList : []);
    console.log(checkedList);
    setIndeterminate(false);
    setCheckAll(e.target.checked);
  }

  const handleReset = () => {
    setVisible(false);
    resetFields();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    validateFields()
      .then((values: any) => {
        rolePost(values);
      })
      .catch(console.error);
  };

  return (
    <div style={{ margin: '0 0 24px' }}>
      <button
        className="ant-btn ant-btn-primary"
        onClick={() => setVisible(true)}
      >
        新增角色
      </button>
      <Modal
        title="新增角色"
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
          <Form.Item label="角色名">
            {getFieldDecorator('name', {
              rules: [
                {
                  required: true,
                  message: '此项必填',
                },
              ],
            })(<Input placeholder="角色名" />)}
          </Form.Item>
          <Form.Item label="角色描述">
            {getFieldDecorator('remark', {
              rules: [
                {
                  required: false,
                  message: '',
                },
              ],
            })(<Input placeholder="角色描述" />)}
          </Form.Item>
          <Form.Item label="角权权限">
            <div>
              <div style={{ borderBottom: '1px solid #E9E9E9' }}>
                <Checkbox
                  indeterminate={indeterminate}
                  onChange={onCheckAllChange}
                  checked={checkAll}
                >
                  全选
                </Checkbox>
              </div>
              <CheckboxGroup
                options={menuOptions}
                value={checkedList}
                onChange={onChange}
              />
            </div>
            ,
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default RolesModal;
