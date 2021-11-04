
import { onAuthStateChanged } from '@firebase/auth';
import React, { createContext, useEffect, useState } from 'react'
import { useHistory } from 'react-router';
import { getDocument, logOut } from '../config/CustomHooks.jsx';
import { auth } from '../config/firebase.jsx';
import { collectionTypes } from '../types/databaseTypes.js';


export const AuthContext = createContext();

export const AuthProvider = (props) => {
  const initialState = {
    isAuthenticated: false,
    user: {},
  }
  const history = useHistory();
  const [stateUser, setStateUser] = useState(initialState);

  const currentUser = React.useCallback(() => {
    onAuthStateChanged(auth, async (user) => {

      if (user) {

        getDocument(collectionTypes.USERS, user.uid)
          .then(response => {

            if (response.role === "pendiente") {
              cerrarSession()
              history.push('/login')
              return
            }

            setStateUser({
              isAuthenticated: true,
              user: response,
            })
          })
          .catch(error => {
            setStateUser({
              isAuthenticated: false,
              user: {},
            })
          });
        return user

      } else {
        setStateUser({
          isAuthenticated: false,
          user: {},

        });
      }

    })
  }, [history, setStateUser])

  useEffect(() => {
    currentUser()
  }, [currentUser])


  const cerrarSession = () => logOut();

  return (
    <AuthContext.Provider value={{
      stateUser,
      setStateUser,
      cerrarSession
    }}>
      {props.children}
    </AuthContext.Provider>
  )
}
