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
 * @returns {HTML} Styled div wrapped around a form just for Tidbits
 * and QAs, or a form including name, email, Tidbits, QAs, etc
 * for new users.
 *
 * @package
 * @class
 */
const InputForm = ({ profile, form, onFinish, contents }) => {
  /**
   * Function to reset form fields back to the original answers.
   * @memberof InputForm
   * @returns {void}
   * @private
   */
  const onReset = () => {
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
