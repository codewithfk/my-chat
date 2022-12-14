import React, { useContext, useEffect, useState } from "react";
import { Outlet, useParams } from "react-router-dom";
import TopHeader from "../components/TopHeader";
import UserRow from "../components/UserRow";
import { ThemeContext } from "../context/ThemeContext";
import { authFire, database } from "../service/firedase";
import Header from "./Header";

function Users() {
  const [users, setUsers] = useState([]);
  const [channels, setChannels] = useState([]);
  const [search, setSearch] = useState("");
  const { theme, themeData, setTheme } = useContext(ThemeContext);
  const { id } = useParams();

  const getUserData = () => {
    let ref = database.ref("user");
    ref.on("value", (snapshot) => {
      let temp = [];
      snapshot.forEach((x) => {
        if (x.val().id !== authFire?.currentUser?.uid) temp.push(x.val());
      });

      setUsers([...temp]);
    });
    // return () => {
    //   database.ref('user').off('value');
    // };
  };
  const getChannels = () => {
    try {
      let channelRef = database
        .ref("channels")
        .child(authFire?.currentUser?.uid);
      channelRef.orderByChild("createdAt").on("value", (snapshot) => {
        let temp = [];

        snapshot?.forEach((x) => {
          temp.push(x?.val());
        });
        setChannels(temp.reverse());
      });
    } catch (err) {
      console.log("fetch channel info err", err);
    }
  };
  useEffect(() => {
    authFire.onAuthStateChanged((res) => {
      if (res === null) {
        setUsers([]);
      } else {
        getUserData();
        getChannels();
      }
    });
  }, [themeData, setTheme]);
  useEffect(() => {
    if (authFire?.currentUser?.uid) {
      database
        .ref("user")
        .child(authFire?.currentUser?.uid)
        .update({ activeChannelId: id ?? null });
    }
  }, [id]);
  return (
    <div
      style={{
        display: "flex",
        backgroundColor: theme?.chat?.bg,
        flexWrap: "wrap",
        height: "100vh",
        // overflowX: 'visible',
      }}
    >
      <TopHeader users={users} />
      <div
        className="userBox"
        style={{
          backgroundColor: theme?.sidebar?.bg,
          height: "93vh",
          flex: 0.15,
          // boxShadow: "3px 3px 6px -3px rgba(0,0,0,0.7)",
          // zIndex: 10,
          // overflowX: 'visible',
        }}
      >
        <Header />
        <div
          className="userContainer"
          style={{
            height: window.innerHeight - 42,
          }}
        >
          {channels?.map((x, i) => (
            <UserRow item={x} key={i} />
          ))}
        </div>
      </div>
      {!id && (
        <div
          style={{
            flex: 0.82,
            alignItems: "center",
            justifyContent: "center",
            display: "flex",
            color: theme?.sidebar?.itemText,
          }}
        >
          Please click on a user to start a converstion
        </div>
      )}
      <Outlet />
    </div>
  );
}

export default Users;
