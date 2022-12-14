import React, { useContext, useEffect, useState } from "react";
import { RiArrowDownSFill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";
import { authFire, database } from "../service/firedase";
import Theme from "./Theme";

function Header() {
  const [user, setUser] = useState(null);
  const [showTheme, setShowTheme] = useState(false);
  const { theme } = useContext(ThemeContext);
  let navigate = useNavigate();

  const logOut = () => {
    authFire
      .signOut()
      .then((result) => {
        let userRef = database.ref("user").child(user?.id);
        userRef?.update({
          online: false,
          activeChannelId: null,
        });
        setUser(null);
        navigate("/");
      })
      .catch(alert);
  };

  useEffect(() => {
    authFire.onAuthStateChanged((res) => {
      setUser({
        name: res?.displayName,
        id: res?.uid,
        picture: res?.photoURL,
      });
    });
  }, []);

  return (
    <>
      <div
        style={{
          backgroundColor: theme?.sidebar?.bg,
        }}
        className="header boxShadow"
      >
        <div className="left-side">ChatApp</div>

        <div className="right-side">
          <div className="dropdown">
            <div
              className="dropdownBtn"
              style={{
                color: theme?.sidebar?.itemText,
                cursor: "pointer",
                alignItems: "center",
                display: "flex",
              }}
            >
              <img
                src={user?.picture}
                height="30px"
                width="30px"
                style={{ borderRadius: 25 }}
                alt="userImg"
              />
              <RiArrowDownSFill />
            </div>
            <div
              className="dropdownContent"
              style={{ backgroundColor: theme?.chat?.bg }}
            >
              <div
                onClick={() => setShowTheme(true)}
                className="dropdownContentOption"
              >
                Change Theme
              </div>
              <div className="dropdownContentOption" onClick={() => logOut()}>
                LogOut
              </div>
            </div>
          </div>
        </div>
      </div>

      {showTheme && <Theme isVisible={showTheme} setVisible={setShowTheme} />}
    </>
  );
}

export default Header;
