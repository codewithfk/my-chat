// import { getDatabase, onValue, ref } from 'firebase/database';
import React, { useContext, useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { ThemeContext } from "./context/ThemeContext";
import "./index.css";
import MessageModal from "./MessageModal";
import reportWebVitals from "./reportWebVitals";
import { database } from "./service/firedase";

const root = ReactDOM.createRoot(document.getElementById("root"));
const ChatApp = () => {
  const [currentTheme, setCurrentTheme] = useState({});
  const [themeData, setThemeData] = useState([]);
  const [isAppLoading, setIsAppLoading] = useState(false);
  const [isDatabaseConnected, setIsDatabaseConnected] = useState(false);

  useEffect(() => {
    setIsAppLoading(true);
    database
      .ref("theme")
      .get()
      .then((res) => {
        if (res?.val()) {
          setThemeData(res?.val());
          setCurrentTheme(res?.val()?.[0]);
        }
      })
      .finally(() => {
        setIsAppLoading(false);
      });
  }, []);

  useEffect(() => {
    database.ref(".info/connected").on("value", (snapshot) => {
      if (snapshot.val() === true) {
        setIsDatabaseConnected(true);
      } else {
        setIsDatabaseConnected(false);
      }
    });
  }, []);

  return (
    <ThemeContext.Provider
      value={{
        theme: currentTheme,
        setTheme: setCurrentTheme,
        themeData,
      }}
    >
      <BrowserRouter>
        <MessageModal>
          {isAppLoading || !isDatabaseConnected ? (
            <div
              style={{
                height: window?.innerHeight,
                width: window?.innerWidth,
                color: "#fff",
                display: "grid",
                placeItems: "center",
              }}
            >
              {isAppLoading ? (
                <div className="loading" />
              ) : (
                <div>There is a problem connecting to our server</div>
              )}
            </div>
          ) : (
            <App />
          )}
        </MessageModal>
      </BrowserRouter>
    </ThemeContext.Provider>
  );
};
root.render(
  <ChatApp />
  // <React.StrictMode>

  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
