import { createContext, useReducer, useEffect } from "react";
import useAxiosWrapper from "../hooks/useAxiosWrapper";

const initialAppState = {
  loginStatus: false,
  loading: true,
  userId: null,
  
};
export const AppContext = createContext(initialAppState);

const reducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_STATUS":
      return { ...state, loginStatus: action.value };
    case "LOADING_STATUS":
      return { ...state, loading: action.value };
    case "UID":
      return { ...state, userId: action.value };
    default:
      return state;
  }
};

export default function AppContextProvider({ children }) {
  const [appState, dispatch] = useReducer(reducer, initialAppState);
  const { data, fetchData } = useAxiosWrapper();

  /*This useEffect will get the status of login state*/
  useEffect(
    () =>
      fetchData("/auth/status", {
        method: "GET",
      }),
    []
  );
  /*After the login state is fetched this will update the login state in appstate and make the loding false*/
  useEffect(() => {
    dispatch({ type: "LOGIN_STATUS", value: data?.loginStatus });
    dispatch({ type: "UID", value: data?.user_id });
    if (data && Object.prototype.hasOwnProperty.call(data, "loginStatus")) 
      dispatch({ type: "LOADING_STATUS", value: false });
  }, [data]);

  return (
    <AppContext.Provider value={{ appState, dispatch }}>
      {appState.loading ? <h2>Loading...</h2> : children}
    </AppContext.Provider>
  );
}
