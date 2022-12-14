import React, { useContext, useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";
import { authFire, database, provider } from "../service/firedase";
import firebase from "firebase";
function InitialPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();
  useEffect(() => {
    authFire.onAuthStateChanged((res) => {
      if (res) {
        setIsLoggedIn(true);
        navigate("/user");
      } else {
        setIsLoggedIn(false);
      }
    });
  }, [navigate]);

  const signIn = () => {
    authFire.setPersistence(firebase.auth.Auth.Persistence.LOCAL).then(() => {
      // Existing and future Auth states are now persisted in the current
      // session only. Closing the window would clear any existing state even
      // if a user forgets to sign out.
      // ...
      // New sign-in will be persisted with session persistence.
      return authFire
        .signInWithPopup(provider)
        .then((result) => {
          navigate("/");
          let exists = database.ref("user").child(result.user?.uid);
          if (exists) {
            database
              .ref("user")
              .child(result.user?.uid)
              .update({
                id: result.user?.uid,
                name: result.additionalUserInfo.profile.name,
                picture: result.additionalUserInfo.profile.picture,
              })
              .catch(alert);
          } else {
            database
              .ref("user")
              .child(result.user?.uid)
              .set({
                id: result.user?.uid,
                name: result.additionalUserInfo.profile.name,
                picture: result.additionalUserInfo.profile.picture,
              })
              .catch(alert);
          }
        })
        .catch(alert);
    });
  };
  return (
    !isLoggedIn && (
      <div
        style={{
          display: "grid",
          placeItems: "center",
          height: "100vh",
          fontSize: 24,
          backgroundColor: theme?.sidebar?.bg,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            color: theme?.sidebar?.itemText,
          }}
        >
          Welcome to Chat App
          <p
            style={{
              color: theme?.sidebar?.activePresence,
              marginLeft: 10,
              cursor: "pointer",
            }}
            onClick={signIn}
          >
            Login
          </p>
        </div>
      </div>
    )
  );
}

export default InitialPage;
