import React from "react";
import "../../App.css";
import { Form, Button } from "antd";

const { Item } = Form;

const InfoFormItem = ({ child, ...props }) => {
  return <Item {...props}>{child}</Item>;
};

/**
 * InputForm sub-component used by EditInfo subcomponent
 * (used by the Profile component) and the InfoForm component.
 * Used to create the form for editing the Tidbits and QAs
 * for a user and the inital info gathering form for a new user.
 *
 * @property {Boolean} profile - determines if this is for
 * the Profile component or EditInfo subcomponent
 * @property {Function} resetImg - function for reseting an image on
 * the form
 * @property {Object} form - form hook from Ant Design
 * @property {Function} onFinish - function called when form is submitted
 * @property {Array.<Object>} contents - the fields of the form
 *
 * @package
 * @class
 */
const InputForm = ({ profile, resetImg, form, onFinish, contents }) => {
  /**
   * Function to reset form fields back to the original answers.
   * @memberof InputForm
   * @returns {void}
   * @private
   */
  const onReset = () => {
    if (!profile) resetImg();
    form.resetFields();
  };
  return (
    <>
      <Form layout="vertical" form={form} name="basic-info" onFinish={onFinish}>
        {contents.map((content, ind) => (
          <InfoFormItem {...content} key={ind} />
        ))}
        {profile ? (
          <Item className="form-btns">
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
            <Button htmlType="button" onClick={onReset}>
              Reset
            </Button>
          </Item>
        ) : (
          <Item className="form-btns">
            <Button type="primary" size="large" htmlType="submit">
              Submit
            </Button>
            <Button htmlType="button" size="large" onClick={onReset}>
              Reset
            </Button>
          </Item>
        )}
      </Form>
    </>
  );
};

export default InputForm;
