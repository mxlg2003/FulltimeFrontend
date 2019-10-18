import React, { useEffect, useState } from 'react';
import { Icon, Modal, Upload, Button } from 'antd';
import axios from 'axios';
import * as Constants from '../../utils/constants';

const InformationDetail = () => {
  const [uptoken, setUptoken] = useState('');
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewName, setPreviewName] = useState('');

  const data = {
    token: uptoken,
  };

  const URL = `${Constants.API_URL}uptoken`;

  const [fileList, setFileList] = useState([]);

  const getUptoken = async (url: string) => {
    const result = false;
    await axios.get(url).then(function(response) {
      setUptoken(response.data);
    });
    return result;
  };

  useEffect(() => {
    getUptoken(URL);
  }, []);

  const uploadButton = (
    <div>
      <Icon type="plus" />
      <div className="ant-upload-text">Upload</div>
    </div>
  );

  const handlePreview = (file: any) => {
    console.log(file);
    setPreviewImage(
      Constants.BASE_QINIU_URL +
        file.response.hash +
        Constants.SMALL_IMG_URL,
    );
    setPreviewName(file.name);
    setPreviewVisible(true);
  };

  const handleChange = (info: any) => {
    if (info.file.status === 'done') {
      const fileList: any = info.fileList;
      setFileList(fileList);
      console.log(fileList);
    }
  };

  const handleRemove = () => {};

  const handleCancel = () => setPreviewVisible(false);
  return (
    <div>
      <Upload
        action={Constants.QINIU_SERVER}
        listType="picture-card"
        className="upload-list-inline"
        // defaultFileList={fileList}
        data={data}
        accept="image/png, image/jpeg, image/jpg"
        // customRequest = {customRequest}
        onPreview={handlePreview}
        onChange={handleChange}
        onRemove={handleRemove}
        multiple={false}
      >
        {fileList.length >= 8 ? null : uploadButton}
      </Upload>
      <Modal
        visible={previewVisible}
        footer={null}
        onCancel={handleCancel}
      >
        <img
          alt={previewName}
          style={{ width: '100%' }}
          src={previewImage}
        />
      </Modal>
    </div>
  );
};
export default InformationDetail;
