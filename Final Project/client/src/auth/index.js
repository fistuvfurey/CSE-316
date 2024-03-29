import React, { createContext, useEffect, useState } from "react";
import { useHistory } from 'react-router-dom'
import api from '../api'

const AuthContext = createContext();
console.log("create AuthContext: " + AuthContext);

// THESE ARE ALL THE TYPES OF UPDATES TO OUR AUTH STATE THAT CAN BE PROCESSED
export const AuthActionType = {
    GET_LOGGED_IN: "GET_LOGGED_IN",
    REGISTER_USER: "REGISTER_USER",
    LOGIN_USER: "LOGIN_USER",
    TOGGLE_IS_FAILURE: "TOGGLE_IS_FAILURE",
    LOGOUT_USER: "LOGOUT_USER",
    SET_LOGGED_IN: "SET_LOGGED_IN",
    CONTINUE_AS_GUEST: "CONTINUE_AS_GUEST"
}

function AuthContextProvider(props) {
    const [auth, setAuth] = useState({
        user: null,
        loggedIn: false,
        isFailure: false, 
        errMessage: null,
        isGuest: false
    });
    
    const history = useHistory();

    useEffect(() => {
        auth.getLoggedIn();
    }, []);

    const authReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
            case AuthActionType.GET_LOGGED_IN: {
                return setAuth({
                    user: payload.user,
                    loggedIn: payload.loggedIn,
                    isFailure: false,
                    errMessage: null,
                    isGuest: auth.isGuest
                });
            }
            case AuthActionType.REGISTER_USER: {
                return setAuth({
                    user: payload.user,
                    loggedIn: true,
                    isFailure: false,
                    errMessage: null,
                    isGuest: false
                });
            }
            case AuthActionType.LOGIN_USER: {
                return setAuth({
                    user: payload.user,
                    loggedIn: true,
                    isFailure: false,
                    errMessage: null,
                    isGuest: false
                });
            }
            case AuthActionType.TOGGLE_IS_FAILURE: {
                return setAuth({
                    user: auth.user,
                    loggedIn: auth.loggedIn,
                    isFailure: !auth.isFailure,
                    errMessage: payload,
                    isGuest: auth.isGuest
                });
            }
            case AuthActionType.LOGOUT_USER: {
                return setAuth({
                    user: null,
                    loggedIn: false,
                    isFailure: false,
                    errMessage: null,
                    isGuest: auth.isGuest
                });
            }
            case AuthActionType.SET_LOGGED_IN: {
                return setAuth({
                    user: payload.user,
                    loggedIn: payload.loggedIn,
                    isFailure: false,
                    errMessage: null,
                    isGuest: auth.isGuest
                });
            }
            case AuthActionType.CONTINUE_AS_GUEST: {
                return setAuth({
                    user: null,
                    loggedIn: true,
                    isFailure: false,
                    errMessage: null,
                    isGuest: true
                });
            }
            default:
                return auth;
        }
    }

    auth.getLoggedIn = async function () {
        try {
            const response = await api.getLoggedIn();
            authReducer({
                type: AuthActionType.SET_LOGGED_IN,
                payload: {
                    loggedIn: response.data.loggedIn,
                    user: response.data.user
                }
            });
        } catch (err) {
            console.log("No user logged in.");
        }
    }

    auth.registerUser = async function(userData, store) {
        try {
            const response = await api.registerUser(userData);      
            authReducer({
                type: AuthActionType.REGISTER_USER,
                payload: {
                    user: response.data.user
                }
            });
            history.push("/");
            store.loadHome();
        } catch (err) {
            let errMessage = err.response.data.errorMessage;
            console.log(errMessage);
            auth.toggleErrStatus(errMessage);
        }
    }

    auth.login = async function(userData, store) {
        try {
            const response = await api.login(userData);
            authReducer({
                type: AuthActionType.LOGIN_USER,
                payload: {
                    user: response.data.user
                }
            });
            history.push("/");
            store.loadHome();
        } catch (err) {
            console.log(err.response.data.errorMessage);
            auth.toggleErrStatus(err.response.data.errorMessage);
        }
    }

    auth.logoutUser = async function() {
        try {
            const response = await api.logoutUser();
            authReducer({
                type: AuthActionType.LOGOUT_USER,
                payload: null
            });
            history.push("/");
        } catch (err) {
            console.log(err.response.data.errorMessage);
        }
    }

    auth.toggleErrStatus = function(errMessage) {
        authReducer({
            type: AuthActionType.TOGGLE_IS_FAILURE,
            payload: errMessage
        });
    }

    auth.continueAsGuest = function() {
        authReducer({
            type: AuthActionType.CONTINUE_AS_GUEST,
            payload: null
        });
        history.push("/");
    }

    return (
        <AuthContext.Provider value={{
            auth
        }}>
            {props.children}
        </AuthContext.Provider>
    );
}

export default AuthContext;
export { AuthContextProvider };