import * as React from 'react';
import { NavLink } from 'react-router-dom';
import { Icon } from 'antd';

const Menu = () => {
  return (
    <ul className="ant-menu ant-menu-dark ant-menu-root ant-menu-inline">
      <NavLink exact to="/resumes/">
        <Icon type="table" />
        简历库
      </NavLink>
      <NavLink exact to="/enterprises/">
        <Icon type="crown" />
        企业库
      </NavLink>
      <NavLink exact to="/vacationResumes/">
        <Icon type="table" />
        假期简历库
      </NavLink>
      <NavLink exact to="/vacationEnterprises/">
        <Icon type="crown" />
        假期招聘库
      </NavLink>
      <NavLink exact to="/orders/">
        <Icon type="crown" />
        订单
      </NavLink>
      <NavLink exact to="/users/">
        <Icon type="crown" />
        系统用户
      </NavLink>
      <NavLink exact to="/sales/">
        <Icon type="crown" />
        业务员
      </NavLink>
      <NavLink exact to="/dispatchs/">
        <Icon type="crown" />
        派遣记录
      </NavLink>
      <NavLink exact to="/incomes/">
        <Icon type="crown" />
        收入记录
      </NavLink>
      <NavLink exact to="/disbursements/">
        <Icon type="crown" />
        补贴记录
      </NavLink>
      <NavLink exact to="/role/">
        <Icon type="crown" />
        角色管理
      </NavLink>
      <NavLink exact to="/shops/">
        <Icon type="crown" />
        门店管理
      </NavLink>
    </ul>
  );
};

export default Menu;
