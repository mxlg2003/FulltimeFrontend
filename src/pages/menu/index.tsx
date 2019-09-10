import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Icon, Menu } from 'antd';
import axios from 'axios';
import * as Constants from '../../utils/constants';

const { SubMenu } = Menu;

const SystemMenu = () => {
  const [sidebarData, setSidebarData] = useState<any[]>([]);
  function getMenu(url: string) {
    axios
      .get(url, {
        headers: {
          Authorization: localStorage.getItem('jwtToken'),
        },
      })
      .then(function(response) {
        console.log(response.data);
        setSidebarData(response.data);
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  useEffect(() => {
    getMenu(`${Constants.API_URL}menus`);
    // setSidebarData(Constants.menu_test);
  }, []);

  return (
    // <ul className="ant-menu ant-menu-dark ant-menu-root ant-menu-inline">
    //   {sidebarData.map((item: any) => (
    //     <NavLink exact to={item.Url || '/'} key={item.ItemId}>
    //       <Icon type={item.ClassName} />
    //       {item.ItemName}
    //     </NavLink>
    //   ))}
    // </ul>
    <Menu
      defaultSelectedKeys={['foundationplatform']}
      theme="dark"
      mode="inline"
    >
      {sidebarData.map((item: any) => {
        if (item.SubItems) {
          return (
            <SubMenu
              key={item.ItemId}
              title={
                <span>
                  <Icon type={item.ClassName} />
                  <span>{item.ItemName}</span>
                </span>
              }
            >
              {item.SubItems.map((item: any) => {
                return (
                  <Menu.Item key={item.ItemId}>
                    <NavLink exact to={item.Url || '/'}>
                      <Icon type={item.ClassName} />
                      {item.ItemName}
                    </NavLink>
                  </Menu.Item>
                );
              })}
            </SubMenu>
          );
        }
        return (
          <Menu.Item key={item.ItemId}>
            <NavLink exact to={item.Url || '/'}>
              <Icon type={item.ClassName} />
              {item.ItemName}
            </NavLink>
          </Menu.Item>
        );
      })}
    </Menu>
  );
};

export default SystemMenu;
