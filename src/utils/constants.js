// export const API_URL = 'http://127.0.0.1:5000/api/';
export const API_URL = 'http://212.64.68.191:5000/api/';

export const USER_ID = localStorage.getItem('user_id');
export const JWT = localStorage.getItem('jwtToken');

export const CheckPhoneNub = (rule, value, callback) => {
  var regu = '^1[0-9]{10}$'; //手机号码验证regEx:第一位数字必须是1，11位数字
  var re = new RegExp(regu);
  if (re.test(value)) {
    callback();
  } else {
    callback('请正确输入手机号！');
  }
};

export const job_intentions = [
  { label: '服务员', value: '01' },
  { label: '传菜员', value: '02' },
  { label: '收银员', value: '03' },
  { label: '果汁员', value: '04' },
  { label: '保洁', value: '05' },
  { label: '领班', value: '06' },
  { label: '经理', value: '07' },
  { label: '店长', value: '08' },
  { label: '营运总监', value: '09' },
  { label: '迎宾员', value: '10' },
  { label: '总经理', value: '11' },
  { label: '灶台', value: '20' },
  { label: '切配', value: '21' },
  { label: '打荷', value: '22' },
  { label: '蒸灶', value: '23' },
  { label: '冷菜', value: '24' },
  { label: '学徒', value: '25' },
  { label: '勤杂', value: '26' },
  { label: '厨师长', value: '27' },
  { label: '行政总厨', value: '28' },
  { label: '采购', value: '40' },
  { label: '司机', value: '41' },
  { label: '维修', value: '42' },
  { label: '后勤部长', value: '43' },
  { label: '文员', value: '60' },
  { label: '客服', value: '61' },
  { label: '人事经理', value: '62' },
  { label: '办公室主任', value: '63' },
  { label: '督导', value: '64' },
  { label: '出纳', value: '65' },
  { label: '主办会计', value: '66' },
  { label: '财务经理', value: '67' },
  { label: 'CFO', value: '68' },
  { label: '营销人员', value: '80' },
  { label: '客户经理', value: '81' },
];

export const cuisine = [
  { label: '徽系', value: '01' },
  { label: '本地系', value: '02' },
  { label: '川系', value: '03' },
  { label: '沪杭系', value: '04' },
  { label: '湘系', value: '05' },
  { label: '粤系', value: '06' },
  { label: '淮扬系', value: '07' },
  { label: '东北系', value: '08' },
  { label: '火锅系', value: '09' },
  { label: '赣系', value: '10' },
  { label: '鲁系', value: '11' },
];

export const job_intentions_vacation = [
  { label: '服务员', value: '01' },
  { label: '传菜员', value: '02' },
  { label: '收银员', value: '03' },
  { label: '果汁员', value: '04' },
  { label: '保洁', value: '05' },
  { label: '迎宾员', value: '10' },
  { label: '打荷', value: '22' },
  { label: '学徒', value: '25' },
];
