import React, { useEffect, useContext } from 'react';
import { Layout, Icon } from 'antd';
import { Route, Switch } from 'react-router-dom';
import './antd.css';
import './App.css';
import Logo from './components/logo';
import Header from './components/header';
import NoMatch from './components/error';
import Menu from './pages/menu';
import Resumes from './pages/resumes/index';
import Enterprises from './pages/enterprises/index';
import VacationEnterprises from './pages/vacationEnterprises/index';
import VacationResumes from './pages/vacationResumes/index';
import Users from './pages/users/index';
import Sales from './pages/sales/index';
import Order from './pages/order/index';
import Dispatch from './pages/dispatch/index';
import Income from './pages/income/index';
import Disbursement from './pages/disbursement/index';
import OrderDetail from './pages/order/detail';
import Shops from './pages/shops/index';
import Roles from './pages/roles/index';

const { Content, Footer, Sider } = Layout;

// function About() {
//   return 'about page';
// }

const App = (props: any) => {
  useEffect(() => {
    verifyLogin(localStorage.getItem('jwtToken'));
  }, []);

  // 验证是否登录
  const verifyLogin = (token: any) => {
    if (!token) {
      props.history.push('/login');
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider>
        <Logo />
        <Menu />
      </Sider>
      <Layout>
        <Header style={{ background: '#fff', padding: 0 }} />
        <Content
          style={{
            margin: '24px',
            padding: '24px',
            background: '#fff',
          }}
        >
          <Switch>
            <Route path="/Resumes/" exact component={Resumes} />
            <Route path="/enterprises/" component={Enterprises} />
            <Route
              path="/VacationResumes/"
              component={VacationResumes}
            />
            <Route
              path="/vacationEnterprises/"
              component={VacationEnterprises}
            />
            <Route path="/users/" component={Users} />
            <Route path="/orders/" component={Order} />
            <Route path="/sales/" component={Sales} />
            <Route path="/dispatchs/" component={Dispatch} />
            <Route path="/incomes/" component={Income} />
            <Route path="/disbursements/" component={Disbursement} />
            <Route
              path="/order/detail/:id/"
              component={OrderDetail}
            />
            <Route path="/shops/" component={Shops} />
            <Route path="/roles/" component={Roles} />
            <Route component={NoMatch} />
          </Switch>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          Copyright <Icon type="copyright" /> 2019 马上科技出品
        </Footer>
      </Layout>
    </Layout>
  );
};

export default App;
