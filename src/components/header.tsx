import React from 'react';
import { Menu, Dropdown } from 'antd';

const Header = (props: any) => {
  const username = localStorage.getItem('jwtToken')
    ? localStorage.getItem('user_username')
    : '系统用户';

  //退出当前用户,清空本地浏览器相关用户数据
  const logout = () => {
    localStorage.clear();
    window.history.go();
  };

  const menu = (
    <Menu>
      <Menu.Item>
        <a onClick={logout}>退出</a>
      </Menu.Item>
    </Menu>
  );

  return (
    <div className="header-index-header">
      <span className="header-index-account ant-dropdown-trigger">
        <span className="ant-avatar header-index-avatar ant-avatar-sm ant-avatar-circle ant-avatar-image">
          <img
            src="https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png"
            alt="avatar"
          />
        </span>
        <Dropdown overlay={menu}>
          <a className="ant-dropdown-link header-index-name" href="#">
            {username}
          </a>
        </Dropdown>
      </span>
    </div>
  );
};

export default Header;
