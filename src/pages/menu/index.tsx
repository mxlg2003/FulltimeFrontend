import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Icon } from 'antd';
import axios from 'axios';
import * as Constants from '../../utils/constants';

const Menu = () => {
  const [sidebarData, setSidebarData] = useState([]);
  const search = { use_id: localStorage.getItem('user_id') };
  function getMenu(url: string, search: any) {
    axios
      .get(url, {
        params: search,
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
    getMenu(`${Constants.API_URL}menus`, search);
  }, []);
  // [
  //   {
  //     ClassName: 'table',
  //     ItemId: '2abe9632-1e36-475f-a359-3bfec4e9d7b8',
  //     ItemName: '简历库',
  //     Url: '/resumes/',
  //   },
  //   {
  //     ClassName: 'crown',
  //     ItemId: '4B3DAA3F-7B2C-4C3F-8D94-B195021540E3',
  //     ItemName: '企业库',
  //     Url: '/enterprises/',
  //   },
  //   {
  //     ClassName: 'table',
  //     ItemId: '18CA902F-22B7-49A7-AFFA-CFF8DCF39780',
  //     ItemName: '假期简历库',
  //     URL: '/vacationResumes/',
  //   },
  //   {
  //     ClassName: 'crown',
  //     ItemId: 'F61DA552-A619-437B-BC95-05FB31F40AC6',
  //     ItemName: '假期招聘库',
  //     Url: '/vacationEnterprises/',
  //   },
  //   {
  //     ClassName: 'crown',
  //     ItemId: 'ae2cd37b-e233-468a-8fd1-50f3d1a66ed9',
  //     ItemName: '订单',
  //     Url: '/orders/',
  //   },
  //   {
  //     ClassName: 'crown',
  //     ItemId: '3126177c-0a44-4ca0-8c26-fa4bad519276',
  //     ItemName: '系统用户',
  //     Url: '/users/',
  //   },
  //   {
  //     ClassName: 'crown',
  //     ItemId: 'a14895a3-171a-4e88-a5c1-e05cc7b205d1',
  //     ItemName: '业务员',
  //     Url: '/sales/',
  //   },
  //   {
  //     ClassName: 'crown',
  //     ItemId: 'bf45fcec-34c1-40ae-9d77-8f46e01ffe4f',
  //     ItemName: '派遣记录',
  //     Url: '/dispatchs/',
  //   },
  //   {
  //     ClassName: 'crown',
  //     ItemId: '546e6fd8-85df-4c3c-98d8-0060507776a4',
  //     ItemName: '收入记录',
  //     Url: '/incomes/',
  //   },
  //   {
  //     ClassName: 'crown',
  //     ItemId: 'b4cdcb2e-c98f-44d7-bbf7-e8ab1d65a6ad',
  //     ItemName: '补贴记录',
  //     Url: '/disbursements/',
  //   },
  //   {
  //     ClassName: 'crown',
  //     ItemId: '46d9d5b4-1a74-40b7-9f43-5063d9c52550',
  //     ItemName: '角色管理',
  //     Url: '/role/',
  //   },
  //   {
  //     ClassName: 'crown',
  //     ItemId: '73945fe3-d2c1-46a9-88ae-64888dfb830e',
  //     ItemName: '门店管理',
  //     Url: '/shop/',
  //   },
  // ];

  return (
    <ul className="ant-menu ant-menu-dark ant-menu-root ant-menu-inline">
      {sidebarData.map((item: any) => (
        <NavLink exact to={item.Url || '/'} key={item.ItemId}>
          <Icon type={item.ClassName} />
          {item.ItemName}
        </NavLink>
      ))}
      {/* <NavLink exact to="/resumes/">
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
      </NavLink> */}
    </ul>
  );
};

export default Menu;
