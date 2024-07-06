import React, { useContext } from "react";
import "./App.css";

import LoginPage from "./components/Login";
import ChatPage from "./components/ChatPage";
import AppContextProvider, { AppContext } from "./context/AppContex";
import { Route, Routes } from "react-router-dom";
import SignupPage from "./components/Signup";

function App() {
  return (
    <AppContextProvider>
      <AppContent />
    </AppContextProvider>
  );
}
function HomePage() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
    </Routes>
  );
}
function AppContent() {
  const {
    appState: { loginStatus },
  } = useContext(AppContext);

  return !loginStatus ? <HomePage /> : <ChatPage />;
}

export default App;
