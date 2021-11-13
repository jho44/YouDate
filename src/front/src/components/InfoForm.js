import React, { useState } from "react";
import { Form, Input, Button, DatePicker, Upload, Typography } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { getBase64, beforeUpload } from "../fileUpload";
import "../App.css";

const { Item } = Form;
const { Title, Paragraph } = Typography;

const InfoFormItem = ({ child, ...props }) => {
  return <Item {...props}>{child}</Item>;
};

/**
 * Form for new Datify user to fill in their basic information.
 *
 * @returns {HTML} Page containing form asking for things like name, pronouns, birth month, etc.
 *
 * @class
 */
const InfoForm = () => {
  /**
   * @typedef {String} img
   * @description (Private) base64 string of user's uploaded profile picture.
   * @memberof InfoForm
   */
  /**
   * @typedef {Function} setImg
   * @param {String} newState - The new image we're uploading.
   * @description Sets `img` to `newState`.
   * @returns {void}
   * @memberof InfoForm
   * @private
   */
  const [img, setImg] = useState();

  /**
   * @typedef {Array} fileList
   * @description (Private) Array of File used internally by Ant
   * Design's `<Upload />`
   * @memberof InfoForm
   */
  /**
   * @typedef {Function} setFileList
   * @param {File} newState - The new image we're uploading.
   * @description Sets `fileList` to `newState`.
   * @returns {void}
   * @memberof InfoForm
   * @private
   */
  const [fileList, setFileList] = useState([]);
  const [form] = Form.useForm();

  /**
   * Function for getting base64 string from uploaded profile picture.
   * @memberof InfoForm
   * @returns {void}
   * @private
   */
  const handleChange = (info) => {
    getBase64(info.file, (imageUrl) => {
      setImg(imageUrl);
    });

    setFileList([...info.fileList]);
  };

  /**
   * Function to send user's basic info to our Neo4j.
   * @memberof InfoForm
   * @returns {void}
   * @private
   */
  const onFinish = (values) => {
    console.log(values);
  };

  /**
   * Function to reset form fields to empty.
   * @memberof InfoForm
   * @returns {void}
   * @private
   */
  const onReset = () => {
    setImg();
    form.resetFields();
  };

  const contents = [
    {
      child: <Input />,
      name: "name",
      label: "Name",
      rules: [{ required: true }],
    },
    {
      child: <Input />,
      name: "pronouns",
      label: "Pronouns",
      rules: [{ required: true }],
    },
    {
      child: <DatePicker picker="month" />,
      name: "birth-month",
      label: "Birth Month",
      rules: [{ required: true }],
    },
    {
      child: <Input />,
      name: "description",
      label: "Description",
      rules: [{ required: true }],
    },
    {
      child: (
        <Upload
          name="avatar"
          listType="picture-card"
          className="avatar-uploader"
          showUploadList={false}
          beforeUpload={beforeUpload}
          onChange={handleChange}
          fileList={fileList}
        >
          {img ? (
            <div
              className="photo"
              style={{
                backgroundImage: `url('${img}')`,
                width: "100%",
                height: "100%",
              }}
            />
          ) : (
            <div className="column-flex">
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>Upload</div>
            </div>
          )}
        </Upload>
      ),
      name: "profile-pic",
      label: "Profile Picture",
      valuePropName: "props",
    },
  ];

  return (
    <div className="container">
      <Title>Basic Info</Title>
      <Paragraph>Help us help you build your profile!</Paragraph>
      <Form layout="vertical" form={form} name="basic-info" onFinish={onFinish}>
        {contents.map((content, ind) => (
          <InfoFormItem {...content} key={ind} />
        ))}
        <Item className="form-btns">
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
          <Button htmlType="button" onClick={onReset}>
            Reset
          </Button>
        </Item>
      </Form>
    </div>
  );
};

export default InfoForm;
