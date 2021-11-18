import React, { useState } from "react";

/**
 * React Context object that contains a Provider and Consumer Component.
 * @typedef AuthContext
 */
export const AuthContext = React.createContext(null);

/**
 * Provider from AuthContext for handling some near-global states.
 * @property {Component} children - Consumers (everything within our Router).
 * @class
 */
export const ContextProvider = ({ children }) => {
  /**
   * @description Logged-in user's access and refresh tokens
   * @typedef {Object} tokens
   * @memberof ContextProvider
   */
  /**
   * @typedef {Function} setTokens
   * @param {Object} newState - The new Spotify tokens of the user who just logged in.
   * @description Sets `tokens` to `newState`.
   * @returns {void}
   * @memberof ContextProvider
   */
  const [tokens, setTokens] = useState(null);

  return (
    <AuthContext.Provider
      value={{
        tokens,
        setTokens,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
