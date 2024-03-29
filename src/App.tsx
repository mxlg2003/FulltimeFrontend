import React, { useEffect, useContext } from 'react';
import { Layout, Icon } from 'antd';
import { Route, Switch } from 'react-router-dom';
import './antd.css';
import './App.css';
import Logo from './components/logo';
import Header from './components/header';
import NoMatch from './components/error';
import SystemMenu from './pages/menu';
import Resumes from './pages/resumes/index';
import MyResumes from './pages/myResumes/index';

import Enterprises from './pages/enterprises/index';
import MyEnterprises from './pages/myEnterprises/index';
import VacationEnterprises from './pages/vacationEnterprises/index';
import VacationResumes from './pages/vacationResumes/index';
import MyVacationEnterprises from './pages/myVacationEnterprises/index';
import MyVacationResumes from './pages/myVacationResumes/index';
import Users from './pages/users/index';
import Sales from './pages/sales/index';
import Order from './pages/order/index';
import Dispatch from './pages/dispatch/index';
import Income from './pages/income/index';
import Disbursement from './pages/disbursement/index';
import OrderDetail from './pages/order/detail';
import Shops from './pages/shops/index';
import Roles from './pages/roles/index';
import Qr_Code from './pages/qrCode/index';
import ShopReport from './pages/shopReport/index';
import InformationCategory from './pages/informationCategory/index';
import Informations from './pages/informations/index';
import InformationDetail from './pages/informations/detail';
import UserInformations from './pages/informations/user_informations';
import InformationConfig from './pages/informations/config';
import NewsCategory from './pages/newsCategory/index';
import News from './pages/news/index';
import ProjectCategory from './pages/projectCategory/index';
import Projects from './pages/projects/index';
import ProjectMessage from './pages/projectMessage/index';
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
        <SystemMenu />
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
            <Route path="/myResumes/" exact component={MyResumes} />
            <Route path="/enterprises/" component={Enterprises} />
            <Route path="/myEnterprises/" component={MyEnterprises} />
            <Route
              path="/vacationResumes/"
              component={VacationResumes}
            />
            <Route
              path="/myVacationResumes/"
              component={MyVacationResumes}
            />
            <Route
              path="/vacationEnterprises/"
              component={VacationEnterprises}
            />
            <Route
              path="/myVacationEnterprises/"
              component={MyVacationEnterprises}
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
            <Route path="/qrcode/" component={Qr_Code} />
            <Route path="/shopReport/" component={ShopReport} />
            <Route
              path="/informationCategory/"
              component={InformationCategory}
            />
            <Route path="/informations/" component={Informations} />
            <Route
              path="/userInformations/"
              component={UserInformations}
            />
            <Route
              path="/information/detail"
              component={InformationDetail}
            />
            <Route
              path="/InformationConfig"
              component={InformationConfig}
            />
            <Route path="/newsCategory" component={NewsCategory} />
            <Route path="/news" component={News} />
            <Route
              path="/projectCategory"
              component={ProjectCategory}
            />
            <Route path="/projects/" component={Projects} />
            <Route
              path="/projectMessages/"
              component={ProjectMessage}
            />

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
