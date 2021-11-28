import React, { useContext } from "react";
import "../../App.css";
import { Form } from "antd";
import { AuthContext } from "../../Context";
import { processUserInfo } from "../../helpers";
import { createEditInfoItems } from "./InputFormHelper";
import InputForm from "./InputForm";

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
      facts: {
        life_goal: values.life_goal || null,
        believe_or_not: values.believe_or_not || null,
        life_peaked: values.life_peaked || null,
        feel_famous: values.feel_famous || null,
        biggest_risk: values.biggest_risk || null,
        desired_relationship: values.desired_relationship || null,
        education: values.education || null,
        occupation: values.occupation || null,
        sexual_orientation: values.sexual_orientation || null,
        location: values.location || null,
        political_view: values.political_view || null,
        height: values.height || null,
      },
      email: user.email,
    };

    fetch("http://localhost:8000/updateUserFacts", {
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
