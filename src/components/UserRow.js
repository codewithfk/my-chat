import React, { useContext, useEffect, useState } from "react";
import { BsCircleFill } from "react-icons/bs";
import { Link, useParams } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";
import { authFire, database } from "../service/firedase";
// import { getMessageNode } from "../helpers/getMessageNode";

function UserRow({ item }) {
  const [user, setUser] = useState(null);
  const { theme } = useContext(ThemeContext);
  // const [lastMessage, setLastMessage] = useState(null);
  const { id } = useParams();
  useEffect(() => {
    setUser(null);
    let otherUserId = item?.members?.find(
      (x) => x !== authFire?.currentUser?.uid
    );

    getOtherUserInfo(otherUserId);
  }, [item]);
  // useEffect(() => {
  //   lastMessageExist();
  // }, [user]);
  const getOtherUserInfo = async (id) => {
    try {
      let userData = await database.ref("user").child(id).get();
      setUser({
        ...item,
        userInfo: userData?.val(),
      });
      return userData?.val();
    } catch (err) {
      console.log("get other user info err", err);
    }
  };
  // const lastMessageExist = () => {
  //   try {
  //     database
  //       .ref("messages")
  //       .child(
  //         getMessageNode({
  //           myId: authFire?.currentUser?.uid,
  //           otherId: id,
  //         })
  //       )
  //       .on("value", (snapshot) => {
  //         snapshot.forEach((x) => {
  //           if (x.val()?.createdAt === user?.createdAt) {
  //             setLastMessage(x.val());
  //           }
  //         });
  //       });
  //   } catch (error) {
  //     console.log("fetch mesageserr ", error);
  //   }
  // };
  return (
    <Link
      className="userRow"
      state={{ data: user }}
      to={`/user/${user?.userInfo?.id}`}
      style={{
        color:
          id === user?.userInfo?.id
            ? theme?.sidebar?.activeItemText
            : theme?.sidebar?.itemText,
        backgroundColor:
          id === user?.userInfo?.id
            ? theme?.sidebar?.activeItemBg
            : theme?.sidebar?.bg,
        position: "relative",
      }}
    >
      <img
        src={user?.userInfo?.picture}
        height="30px"
        width="30px"
        style={{ borderRadius: 25 }}
        alt="userImg"
      />
      {user?.userInfo?.online && (
        <BsCircleFill
          color={theme?.sidebar?.activePresence}
          style={{
            position: "absolute",
            left: "24px",
            top: "4px",
            fontSize: "11px",
          }}
        />
      )}
      <div style={{ display: "flex", alignItems: "center" }}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ paddingLeft: "8px", color: theme?.sidebar?.itemText }}>
            {user?.userInfo?.name}
          </span>
          {user?.lastMessage && (
            <span
              style={{
                fontSize: "8px",
                paddingLeft: "8px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                maxWidth: "100px",
              }}
            >
              {user?.lastMessage}
            </span>
          )}
        </div>

        {user?.unreadCount?.[authFire?.currentUser?.uid]?.count !== 0 && (
          <span
            style={{
              marginLeft: "18px",
              width: "20px",
              height: "20px",
              fontSize: "13px",
              textAlign: "center",
              backgroundColor: theme?.sidebar?.activePresence,
              borderRadius: "50%",
            }}
          >
            {user?.unreadCount?.[authFire?.currentUser?.uid]?.count}
          </span>
        )}
      </div>
    </Link>
  );
}

export default UserRow;
