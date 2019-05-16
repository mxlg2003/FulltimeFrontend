import * as React from 'react';
import { NavLink } from 'react-router-dom';
import { Icon } from 'antd';

const Menu = () => {
  return (
    <ul className="ant-menu ant-menu-dark ant-menu-root ant-menu-inline">
      <NavLink exact to="/">
        <Icon type="table" />
        简历库
      </NavLink>
      <NavLink exact to="/enterprises/">
        <Icon type="crown" />
        企业库
      </NavLink>
      <NavLink exact to="/users/">
        <Icon type="crown" />
        系统用户
      </NavLink>
      <NavLink exact to="/sales/">
        <Icon type="crown" />
        业务员
      </NavLink>
      <NavLink exact to="/login/">
        <Icon type="crown" />
        登录页
      </NavLink>
    </ul>
  );
};

export default Menu;
