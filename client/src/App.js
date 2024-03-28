
import React, { useContext } from "react";
import "./App.css";

import LoginPage from "./components/Login";
import ChatPage from "./components/ChatPage";
import AppContextProvider, { AppContext } from "./context/AppContex";

function App() {
  return (
    <AppContextProvider>
      <AppContent />
    </AppContextProvider>
  );
}

function AppContent() {
  const {
    appState: { loginStatus },
  } = useContext(AppContext);

  return !loginStatus ? <LoginPage /> : <ChatPage />;
}

export default App;
