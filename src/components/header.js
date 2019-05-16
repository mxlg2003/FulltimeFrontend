import * as React from 'react';

const Header = () => {
  return (
    <div className="header-index-header">
      <span className="header-index-account ant-dropdown-trigger">
        <span className="ant-avatar header-index-avatar ant-avatar-sm ant-avatar-circle ant-avatar-image">
          <img
            src="https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png"
            alt="avatar"
          />
        </span>
        <span className="header-index-name">Serati Ma</span>
      </span>
    </div>
  );
};

export default Header;
