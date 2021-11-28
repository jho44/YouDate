import React from "react";
import "./App.css";
import { Input, Select } from "antd";

const { Option } = Select;

/**
 * This file stores helper functions to do with Tidbits and QAs.
 * This makes it easier to add tidbits and questions later on.
 */

/**
 * Function to create an user object.
 * @param {Object} user - the user that is being processed
 * @returns {Object}
 */
export function processUserInfo(user) {
  const datifyUser = { ...user };
  datifyUser["QAs"] = [
    {
      Q: "Life goal of mine...",
      A: datifyUser.life_goal,
    },
    {
      Q: "Believe it or not, I...",
      A: datifyUser.believe_or_not,
    },
    {
      Q: "My life peaked when...",
      A: datifyUser.life_peaked,
    },
    {
      Q: "I feel famous when...",
      A: datifyUser.feel_famous,
    },
    {
      Q: "Biggest risk I've ever taken",
      A: datifyUser.biggest_risk,
    },
  ];

  const qas = [
    "life_goal",
    "believe_or_not",
    "life_peaked",
    "feel_famous",
    "biggest_risk",
  ];
  for (const qa of qas) {
    delete datifyUser[qa];
  }

  datifyUser["tidbits"] = [
    {
      key: "desired_relationship",
      val: datifyUser.desired_relationship,
    },
    {
      key: "education",
      val: datifyUser.education,
    },
    {
      key: "occupation",
      val: datifyUser.occupation,
    },
    {
      key: "sexual_orientation",
      val: datifyUser.sexual_orientation,
    },
    {
      key: "location",
      val: datifyUser.location,
    },
    {
      key: "political_view",
      val: datifyUser.political_view,
    },
    {
      key: "height",
      val: datifyUser.height,
    },
  ];

  const tidbits = [
    "desired_relationship",
    "education",
    "occupation",
    "sexual_orientation",
    "location",
    "political_view",
    "height",
  ];
  for (const tidbit of tidbits) {
    delete datifyUser[tidbit];
  }

  const today = new Date();
  let age =
    today.getFullYear() - datifyUser.birth_month._DateTime__date._Date__year;
  const m =
    today.getMonth() - datifyUser.birth_month._DateTime__date._Date__month;
  if (m < 0) age--;

  datifyUser["age"] = age;
  return datifyUser;
}

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
 * @returns {Array.<Object>}
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
 * @param {Array.<Object>} contents - the other fields of the form that the Tidbits
 * and QAs will be added onto
 * @returns {Array.<Object>}
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

/**
 * Function to match the Tidbits and QAs with the form onFinish
 * in the EditInfo subcomponent.
 * @param {Object} values - the values of the fields of the edit Tidbits
 * and QAs form
 * @returns {Object}
 */
export function factsData(values) {
  return {
    ...tidbitData(values),
    ...QAData(values),
  };
}

/**
 * Function to match the Tidbits with the form in the InfoForm component.
 * @param {Object} values - the values of the fields of the edit Tidbits
 * @returns {Object}
 */
export function tidbitData(values) {
  return {
    desired_relationship: values.desired_relationship || null,
    education: values.education || null,
    occupation: values.occupation || null,
    sexual_orientation: values.sexual_orientation || null,
    location: values.location || null,
    political_view: values.political_view || null,
    height: values.height || null,
  };
}

/**
 * Function to match the QAs with the form the InfoForm component.
 * @param {Object} values - the values of the fields of the edit QAs
 * @returns {Object}
 */
export function QAData(values) {
  return {
    life_goal: values.life_goal || null,
    believe_or_not: values.believe_or_not || null,
    life_peaked: values.life_peaked || null,
    feel_famous: values.feel_famous || null,
    biggest_risk: values.biggest_risk || null,
  };
}
