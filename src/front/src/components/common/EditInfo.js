import React, { useContext } from "react";
import "../../App.css";
import { Form } from "antd";
import { AuthContext } from "../../Context";
import { processUserInfo } from "../../helpers";
import { createEditInfoItems, factsData } from "../../helpers";
import InputForm from "./InputForm";
import { backendUrl } from "../../firebase";

/**
 * EditInfo sub-component used by Profile component.
 * Used to create the form for editing the Tidbits and QAs
 * for a user.
 *
 * @returns {HTML} Styled div wrapped around a form for Tidbits
 * and QAs
 *
 * @package
 * @class
 */
const EditInfo = () => {
  const {
    /**
     * `ContextProvider` state of logged-in user's info.
     * @type {Object}
     * @memberof EditInfo
     */
    user,
    /**
     * Function from `ContextProvider` for setting logged-in user's info.
     * @type {Function}
     * @memberof EditInfo
     */
    setUser,
  } = useContext(AuthContext);

  const [form] = Form.useForm();

  /**
   * Function to send user's new Tidbits and QAs to our Neo4j.
   * @memberof EditInfo
   * @returns {void}
   * @private
   */
  const onFinish = (values) => {
    // for tidbits and qas, need to send `null` if have `undefined` field
    // so that our server doesn't discard the `undefined` vals
    const data = {
      facts: factsData(values),
      email: user.email,
    };

    fetch(`${backendUrl}/updateUserFacts`, {
      method: "PUT",
      mode: "cors",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((res_data) => {
        if (res_data[1] === 200) {
          let datifyUser = res_data[0];
          const user = processUserInfo(datifyUser);
          setUser(user);
        } // TODO: error handling
      })
      .catch((err) => console.error(err));
  };

  let contents = createEditInfoItems(user);
  return (
    <InputForm
      profile={true}
      form={form}
      onFinish={onFinish}
      contents={contents}
    />
  );
};

export default EditInfo;
