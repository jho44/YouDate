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

  /**
   * @description Logged-in user's info
   * @typedef {Object} user
   * @memberof ContextProvider
   */
  /**
   * @typedef {Function} setUser
   * @param {Object} newState - The user who's just logged in.
   * @description Sets `user` to `newState`.
   * @returns {void}
   * @memberof ContextProvider
   */
  const [user, setUser] = useState(null);

  /**
   * @description Logged-in user's list of unmet users.
   * @typedef {Object} unmetList
   * @memberof ContextProvider
   */
  /**
   * @typedef {Function} setUnmetList
   * @param {Object} newState - The next set of users the current user hasn't met.
   * @description Sets `unmetList` to `newState`.
   * @returns {void}
   * @memberof ContextProvider
   */
  const [unmetList, setUnmetList] = useState([]);

  /**
   * @description Index of the next unmet user to appear on Meet page.
   * @typedef {Object} unmetListInd
   * @memberof ContextProvider
   */
  /**
   * @typedef {Function} setUnmetListInd
   * @param {Object} newState - The next index in `unmetList` that should appear on Meet page.
   * @description Sets `unmetListInd` to `newState`.
   * @returns {void}
   * @memberof ContextProvider
   */
  const [unmetListInd, setUnmetListInd] = useState(0);

  return (
    <AuthContext.Provider
      value={{
        tokens,
        setTokens,
        user,
        setUser,
        unmetList,
        setUnmetList,
        unmetListInd,
        setUnmetListInd,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
