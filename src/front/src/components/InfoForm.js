import React, { useState } from "react";
import {
  Form,
  Input,
  Button,
  DatePicker,
  Upload,
  Typography,
  Select,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { getBase64, beforeUpload } from "../fileUpload";
import "../App.css";

const { Item } = Form;
const { Title, Paragraph } = Typography;
const { Option } = Select;

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
   * @typedef {Boolean} validImg
   * @description (Private) Whether the uploaded image is valid (less than 2MB and a jpg/png).
   * @memberof InfoForm
   */
  /**
   * @typedef {Function} setValidImg
   * @param {Boolean} newState - Whether the new image is valid.
   * @description Sets `validImg` to `newState`.
   * @returns {void}
   * @memberof InfoForm
   * @private
   */
  const [validImg, setValidImg] = useState(false);

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
    if (validImg) {
      getBase64(info.file, (imageUrl) => {
        setImg(imageUrl);
      });

      setFileList([...info.fileList]);
    } else {
      setImg();
      setFileList([]);
    }
  };

  /**
   * Function to send user's basic info to our Neo4j.
   * @memberof InfoForm
   * @returns {void}
   * @private
   */
  const onFinish = (values) => {
    console.log(values);
    console.log(img);
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
      name: "email",
      label: "Email",
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
      name: "birth_month",
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
          beforeUpload={(file) =>
            beforeUpload(file, (validPic) => {
              setValidImg(validPic);
            })
          }
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
      name: "profile_pic",
      label: "Profile Picture",
      valuePropName: "props",
    },
    {
      child: (
        <Select style={{ width: "50%" }}>
          <Option value="casual">Go with the flow</Option>
          <Option value="short-term">Short Term</Option>
          <Option value="long-term">Long Term</Option>
          <Option value="other">Other</Option>
        </Select>
      ),
      name: "desired_relationship",
      label: "Desired Relationship",
      rules: [{ required: true }],
    },
    {
      child: <Input />,
      name: "education",
      label: "Education",
    },
    {
      child: <Input />,
      name: "occupation",
      label: "Occupation",
    },
    {
      child: <Input />,
      name: "sexual_orientation",
      label: "Sexual Orientation",
    },
    {
      child: <Input />,
      name: "location",
      label: "My Location",
    },
    {
      child: (
        <Select style={{ width: "50%" }} allowClear>
          <Option value="anarchism">Anarchism</Option>
          <Option value="communism">Communism</Option>
          <Option value="conservatism">Conservatism</Option>
          <Option value="environmentalism">Environmentalism</Option>
          <Option value="fascism">Fascism</Option>
          <Option value="feminism">Feminism</Option>
          <Option value="liberalism">Liberalism</Option>
          <Option value="nationalism">Nationalism</Option>
          <Option value="populism">Populism</Option>
          <Option value="socialism">Socialism</Option>
          <Option value="other">Other</Option>
        </Select>
      ),
      name: "political_view",
      label: "Political View",
    },
    {
      child: <Input />,
      name: "height",
      label: "Height",
    },
    {
      child: <Input />,
      name: "life_goal",
      label: "Life goal of mine...",
    },
    {
      child: <Input />,
      name: "believe_or_not",
      label: "Believe it or not, I...",
    },
    {
      child: <Input />,
      name: "life_peaked",
      label: "My life peaked when...",
    },
    {
      child: <Input />,
      name: "feel_famous",
      label: "I feel famous when...",
    },
    {
      child: <Input />,
      name: "biggest_risk",
      label: "Biggest risk I've ever taken",
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