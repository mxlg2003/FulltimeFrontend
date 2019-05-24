import React, { useEffect } from 'react';

const VerifyLogin = (props: any) => {
  useEffect(() => {
    verifyLogin(localStorage.getItem('jwtToken'));
  }, []);

  // 验证是否登录
  const verifyLogin = (token: any) => {
    if (!token) {
      props.history.push('/login');
    }
  };
  return true;
};

export default VerifyLogin;
