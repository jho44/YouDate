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
