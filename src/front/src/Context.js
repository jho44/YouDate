import React, { useState } from "react";

export const AuthContext = React.createContext(null);

export const ContextProvider = (props) => {
  const [tokens, setTokens] = useState(null);

  return (
    <AuthContext.Provider
      value={{
        tokens,
        setTokens,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};
