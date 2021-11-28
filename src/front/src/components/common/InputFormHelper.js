import React from "react";
import "../../App.css";
import { Input, Select } from "antd";

const { Option } = Select;

/**
 * Useful functions for the EditInfo subcomponent 
 * (used by the Profile component) and the InfoForm component.
 * Used to create the form items for editing the Tidbits and QAs 
 * for a user and the inital info gathering form for a new user.
 */


/* Tidbits */
const DesiredRelationship = () => {
  return {
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
};

const Education = () => {
  return {
    child: <Input />,
    name: "education",
    label: "Education",
  };
};

const Occupation = () => {
  return {
    child: <Input />,
    name: "occupation",
    label: "Occupation",
  };
};

const SexualOrientation = () => {
  return {
    child: <Input />,
    name: "sexual_orientation",
    label: "Sexual Orientation",
  };
};

const Location = () => {
  return {
    child: <Input />,
    name: "location",
    label: "My Location",
  };
};

const PoliticalView = () => {
  return {
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
};

const Height = () => {
  return {
    child: <Input />,
    name: "height",
    label: "Height",
  };
};

/* QAs */
const LifeGoal = () => {
  return {
    child: <Input />,
    name: "life_goal",
    label: "Life goal of mine...",
  };
};

const BelieveOrNot = () => {
  return {
    child: <Input />,
    name: "believe_or_not",
    label: "Believe it or not, I...",
  };
};

const LifePeaked = () => {
  return {
    child: <Input />,
    name: "life_peaked",
    label: "My life peaked when...",
  };
};

const FeelFamous = () => {
  return {
    child: <Input />,
    name: "feel_famous",
    label: "I feel famous when...",
  };
};

const BiggestRisk = () => {
  return {
    child: <Input />,
    name: "biggest_risk",
    label: "Biggest risk I've ever taken",
  };
};

const tidbits = [
  DesiredRelationship(),
  Education(),
  Occupation(),
  SexualOrientation(),
  Location(),
  PoliticalView(),
  Height(),
];
const QAs = [
  LifeGoal(),
  BelieveOrNot(),
  LifePeaked(),
  FeelFamous(),
  BiggestRisk(),
];

/**
 * Function to generate the Tidbits and QAs in the EditInfo subcomponent.
 * @param {Object} user - the user that is viewing their Profile page to edit
 * their Tidbits or QAs
 * @returns {Object Array}
 */
export function createEditInfoItems(user) {
  let content = [];
  user.tidbits.map((tidbit, ind) => {
    const { key, val } = tidbit;
    let item;
    switch (key) {
      case "desired_relationship":
        item = DesiredRelationship();
        break;
      case "education":
        item = Education();
        break;
      case "occupation":
        item = Occupation();
        break;
      case "sexual_orientation":
        item = SexualOrientation();
        break;
      case "location":
        item = Location();
        break;
      case "political_view":
        item = PoliticalView();
        break;
      case "height":
        item = Height();
        break;
      default:
    }
    if (val) {
      item["initialValue"] = val;
      item["defaultValue"] = val;
    }
    return content.push(item);
  });
  user.QAs.map((QA, ind) => {
    let item;
    switch (QA.Q) {
      case "Life goal of mine...":
        item = LifeGoal();
        break;
      case "Believe it or not, I...":
        item = BelieveOrNot();
        break;
      case "My life peaked when...":
        item = LifePeaked();
        break;
      case "I feel famous when...":
        item = FeelFamous();
        break;
      case "Biggest risk I've ever taken":
        item = BiggestRisk();
        break;
      default:
    }
    if (QA.A) item["initialValue"] = QA.A;
    return content.push(item);
  });
  return content;
}

/**
 * Function to generate the Tidbits and QAs in the InfoForm component.
 * @param {Object Array} contents - the other fields of the form that the Tidbits
 * and QAs will be added onto
 * @returns {Object Array}
 */
export function createInfoItems(contents) {
  tidbits.map((tidbit, ind) => {
    return contents.push(tidbit);
  });
  QAs.map((QA, ind) => {
    return contents.push(QA);
  });
  return contents;
}
