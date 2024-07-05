import * as fcl from "@onflow/fcl";
import PropTypes from "prop-types";
import { createContext, useEffect, useState } from "react";

export const AppContext = createContext({
  currentUser: null,
});

export const AppContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(
    () =>
      fcl.currentUser().subscribe((newUser) => {
        if (newUser?.loggedIn) {
          setCurrentUser(newUser);
        } else {
          setCurrentUser(null);
        }
      }),
    []
  );

  const value = {
    currentUser,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

AppContextProvider.propTypes = {
  children: PropTypes.node,
};
