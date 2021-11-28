import React, { useContext } from "react";
import "../../App.css";
import { Form, Input, Button, Select } from "antd";
import { AuthContext } from "../../Context";
import { processUserInfo } from "../../helpers";

const { Item } = Form;
const { Option } = Select;

const InfoFormItem = ({ child, ...props }) => {
  return <Item {...props}>{child}</Item>;
};

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

  /**
   * Function to reset form fields back to the original answers.
   * @memberof EditInfo
   * @returns {void}
   * @private
   */
  const onReset = () => {
    form.resetFields();
  };

  /**
   * Function to generate the Tidbits and QAs items in the form.
   * @memberof EditInfo
   * @returns {Array}
   * @private
   */
  const CreateQAs = () => {
    let content = [];
    user.tidbits.map((tidbit, ind) => {
      const { key, val } = tidbit;
      let item;
      switch (key) {
        case "desired_relationship":
          item = {
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
          };
          break;
        case "education":
          item = {
            child: <Input />,
            name: "education",
            label: "Education",
          };
          break;
        case "occupation":
          item = {
            child: <Input />,
            name: "occupation",
            label: "Occupation",
          };
          break;
        case "sexual_orientation":
          item = {
            child: <Input />,
            name: "sexual_orientation",
            label: "Sexual Orientation",
          };
          break;
        case "location":
          item = {
            child: <Input />,
            name: "location",
            label: "My Location",
          };
          break;
        case "political_view":
          item = {
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
          };
          break;
        case "height":
          item = {
            child: <Input />,
            name: "height",
            label: "Height",
          };
          break;
        default:
      }
      if (val) {
        item["initialValue"] = val;
        item["defaultValue"] = val;
      }
      content.push(item);
    });
    user.QAs.map((QA, ind) => {
      let itemName;
      switch (QA.Q) {
        case "Life goal of mine...":
          itemName = "life_goal";
          break;
        case "Believe it or not, I...":
          itemName = "believe_or_not";
          break;
        case "My life peaked when...":
          itemName = "life_peaked";
          break;
        case "I feel famous when...":
          itemName = "feel_famous";
          break;
        case "Biggest risk I've ever taken":
          itemName = "biggest_risk";
          break;
        default:
      }
      let item = {
        child: <Input />,
        name: itemName,
        label: QA.Q,
      };
      if (QA.A) item["initialValue"] = QA.A;
      content.push(item);
    });
    return content;
  };

  let contents = CreateQAs();

  return (
    <>
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
    </>
  );
};

export default EditInfo;
