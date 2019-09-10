import React from 'react';
import { Card, Col, Row } from 'antd';
import * as QrCode from 'qrcode.react';

const Qr_Code = () => {
  const personal = `https://xcx.mskjzg.com/mskj/fulltime/personal-fulltime.html?shop_code=${localStorage.getItem(
    'shop_code',
  )}`;

  const enterprise = `https://xcx.mskjzg.com/mskj/fulltime/enterprise-fulltime.html?shop_code=${localStorage.getItem(
    'shop_code',
  )}`;
  const personal_summer = `https://xcx.mskjzg.com/mskj/fulltime/personal-summer.html?shop_code=${localStorage.getItem(
    'shop_code',
  )}`;

  const enterprise_summer = `https://xcx.mskjzg.com/mskj/fulltime/enterprise-summer.html?shop_code=${localStorage.getItem(
    'shop_code',
  )}`;
  const personal_winter = `https://xcx.mskjzg.com/mskj/fulltime/personal-winter.html?shop_code=${localStorage.getItem(
    'shop_code',
  )}`;

  const enterprise_winter = `https://xcx.mskjzg.com/mskj/fulltime/enterprise-winter.html?shop_code=${localStorage.getItem(
    'shop_code',
  )}`;

  return (
    <div style={{ background: '#ECECEC', padding: '30px' }}>
      <Row gutter={16}>
        <Col span={12}>
          <Card
            title="简历录入二维码(含门店编码)"
            bordered={false}
            style={{ width: 300 }}
          >
            <QrCode value={personal} size={250} />
          </Card>
        </Col>
        <Col span={12}>
          <Card
            title="招聘录入二维码(含门店编码)"
            bordered={false}
            style={{ width: 300 }}
          >
            <QrCode value={enterprise} size={250} />
          </Card>
        </Col>
        <Col span={12}>
          <Card
            title="暑假工简历录入二维码(含门店编码)"
            bordered={false}
            style={{ width: 300, 'margin-top': '50px' }}
          >
            <QrCode value={personal_summer} size={250} />
          </Card>
        </Col>
        <Col span={12}>
          <Card
            title="暑假招聘录入二维码(含门店编码)"
            bordered={false}
            style={{ width: 300, 'margin-top': '50px' }}
          >
            <QrCode value={enterprise_summer} size={250} />
          </Card>
        </Col>
        <Col span={12}>
          <Card
            title="寒假工简历录入二维码(含门店编码)"
            bordered={false}
            style={{ width: 300, 'margin-top': '50px' }}
          >
            <QrCode value={personal_winter} size={250} />
          </Card>
        </Col>
        <Col span={12}>
          <Card
            title="寒假招聘录入二维码(含门店编码)"
            bordered={false}
            style={{ width: 300, 'margin-top': '50px' }}
          >
            <QrCode value={enterprise_winter} size={250} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Qr_Code;
