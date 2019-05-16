import * as React from 'react';
import { Layout, Icon } from 'antd';
import { Route, Switch } from 'react-router-dom';
import './antd.css';
import './App.css';
import Logo from './components/logo';
import Header from './components/header';
import NoMatch from './components/error';
import Menu from './components/menu';
import Resumes from './pages/resumes/index';
import Enterprises from './pages/enterprises/index';
import Users from './pages/users/index';
import Sales from './pages/sales/index';

const { Content, Footer, Sider } = Layout;

// function About() {
//   return 'about page';
// }

const App = () => {
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
            <Route path="/" exact component={Resumes} />
            <Route path="/enterprises/" component={Enterprises} />
            <Route path="/users/" component={Users} />
            <Route path="/sales/" component={Sales} />
            {/* <Route path="/login/" exact component={Login} /> */}
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
