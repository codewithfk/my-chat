import { useContext, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import { ThemeContext } from "./context/ThemeContext";
import Chat from "./screen/Chat";
import InitialPage from "./screen/InitialPage";
import Users from "./screen/Users";
import { authFire, database } from "./service/firedase";
import runOneSignal from "./service/onesignal";
function App() {
  const { setTheme, themeData } = useContext(ThemeContext);

  useEffect(() => {
    authFire.onAuthStateChanged((res) => {
      if (res !== null) {
        let userRef = database.ref("user").child(res?.uid);
        userRef?.update({
          online: true,
        });
        userRef.on("value", (snapshot) => {
          let temp = {};

          let d = snapshot.val();
          temp = themeData.find((item) => item.id === d?.themeId);
          if (temp) {
            setTheme(temp);
          }
        });
      }
    });
  }, [themeData, setTheme]);

  useEffect(() => {
    // runOneSignal();
    if (authFire?.currentUser?.uid) {
      database
        .ref("user")
        .child(authFire.currentUser?.uid)
        .onDisconnect()
        .update({ online: false, activeChannelId: null });
    }
  }, []);
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<InitialPage />} />
        <Route path="user" element={<Users />}>
          <Route path="/user/:id" element={<Chat />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
