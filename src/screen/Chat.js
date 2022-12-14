import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import firebase from "firebase";
import React, { useContext, useEffect, useRef, useState } from "react";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { BiCheckDouble } from "react-icons/bi";
import { FaPaperPlane } from "react-icons/fa";
import { GrDocumentText } from "react-icons/gr";
import { MdOutlineAttachFile } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useParams } from "react-router-dom";
import DocumentMessage from "../components/DocumentMessage";
import ImageMessage from "../components/ImageMessage";
import VideoMessage from "../components/VideoMessage";
import { ThemeContext } from "../context/ThemeContext";
import { getMessageNode } from "../helpers/getMessageNode";
import { authFire, database, storage } from "../service/firedase";
import { GiFiles } from "react-icons/gi";
dayjs.extend(localizedFormat);
let typingTimeout = null;
function Chat() {
  const [input, setInput] = useState("");
  const { id } = useParams();
  const [messages, setMessages] = useState([]);
  const [activeHoverEl, setActiveHoverEl] = useState(null);
  const chatRef = useRef(null);
  const [isOtherUserOnline, setIsOtherUserOnline] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isOtherUserTyping, setIsOtherUserTyping] = useState(false);
  const [otherUserInfo, setOtherUserInfo] = useState(null);
  const { theme } = useContext(ThemeContext);
  const [fileUpload, setFileUpload] = useState([]);
  const inputRef = useRef(null);
  const fileRef = useRef(null);
  const [imgSend, setImgSend] = useState([]);
  const [progress, setProgress] = useState(false);
  const [progressCount, setProgressCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [dragActive, setDragActive] = React.useState(false);

  useEffect(() => {
    database
      .ref(`user/${id}`)
      .get()
      .then((res) => {
        setOtherUserInfo(res?.val());
      });
    setInput("");
  }, [id]);
  const fetchMessages = () => {
    try {
      database
        .ref("messages")
        .child(
          getMessageNode({
            myId: authFire?.currentUser?.uid,
            otherId: id,
          })
        )
        .on("value", (snapshot) => {
          let temp = [];
          setMessages([]);
          snapshot.forEach((x) => {
            temp.push(x.val());
          });
          setMessages([...temp]);
        });
    } catch (error) {
      console.log("fetch mesageserr ", error);
    }
  };

  useEffect(() => {
    inputRef?.current?.focus();
    authFire.onAuthStateChanged((res) => {
      if (res === null) {
        setMessages([]);
      } else {
        fetchMessages();
      }
    });

    return () => {
      database
        .ref("messages")
        .child(
          getMessageNode({
            myId: authFire.currentUser?.uid,
            otherId: id,
          })
        )
        .off();
    };
  }, [id]);

  useEffect(() => {
    if (id) {
      database
        .ref("user")
        .child(id)
        .on("value", (snapshot) => {
          setIsOtherUserOnline(snapshot?.val()?.online);
          setIsOtherUserTyping(snapshot?.val()?.chattingWith);
        });
    }

    return () => {
      database.ref("user").child(id).off();
    };
  }, [id]);
  useEffect(() => {
    if (authFire?.currentUser?.uid) {
      database
        .ref("user")
        .child(authFire?.currentUser?.uid)
        .on("value", (snapshot) => {
          setIsTyping(snapshot?.val()?.chattingWith);
        });
    }

    return () => {
      database.ref("user").child(id).off();
    };
  }, [id]);

  const handleImgSend = () => {
    setFileUpload([]);
    setImgSend([]);
    let temp = [...messages];

    fileUpload?.forEach((x) => {
      temp.push(x);
    });
    setMessages(temp);
    let date = Date.now();
    for (let i = 0; i < fileUpload.length; i++) {
      let uploadFile = storage
        .ref()
        .child(`${fileUpload[i]?.messageType}/${date}/${imgSend[i]?.name}`)
        .put(imgSend[i]);
      uploadFile.on(
        "state_changed",
        (snapshot) => {
          var progressImg =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

          setProgressCount(progressImg);
          setProgress(true);

          if (progressImg === 100) {
            setProgress(false);
          }
        },
        (error) => {
          console.log("unUpload", error);
        },
        () => {
          handleSend(
            uploadFile.snapshot.ref.fullPath,
            fileUpload[i]?.messageType
          );
        }
      );
    }
  };

  useEffect(() => {
    let channelInfo = {
      channelId: getMessageNode({
        myId: authFire?.currentUser?.uid,
        otherId: id,
      }),
      members: [authFire?.currentUser?.uid, id],
      lastMessage: "",
      unreadCount: {
        [authFire.currentUser.uid]: {
          count: 0,
        },
        [id]: {
          count: 0,
        },
      },
      channelName: `${authFire?.currentUser?.displayName}-${otherUserInfo?.name}`,
      createdAt: Date.now(),
    };
    channelInfo.members?.forEach(async (x) => {
      let channelNodeExists = await database
        .ref("channels")
        .child(x)
        .child(channelInfo?.channelId);
      if (!channelNodeExists?.length) {
        await channelNodeExists.update(channelInfo).catch((err) => {
          console.log("update channel err", err);
        });
      }
    });
  }, [id]);

  const selectedFileDelete = (index) => {
    let temp = fileUpload?.length > 0 ? [...fileUpload] : [];
    temp.splice(index, 1);
    setFileUpload(temp);
  };
  const handleSend = (imgPath, type) => {
    // console.log(otherUserInfo?.activeChannelId, authFire?.currentUser?.uid);
    try {
      if (!input.trim() && !imgPath) return;
      let dateNow = Date.now();
      let lastInputText = input;
      setInput("");
      database
        .ref("messages")
        .child(
          getMessageNode({
            myId: authFire.currentUser?.uid,
            otherId: id,
          })
        )
        .child(dateNow)
        .set({
          message: lastInputText,
          sentBy: {
            id: authFire.currentUser.uid,
            name: authFire?.currentUser?.displayName,
            photo: authFire?.currentUser?.photoURL,
          },
          createdAt: dateNow,
          img: imgPath,
          messageType: type,
          read: 1,
        })
        .catch((err) => {
          setInput(lastInputText);
        })
        .finally(() => {
          setIsLoading(false);
        });
      let channelInfo = {
        channelId: getMessageNode({
          myId: authFire?.currentUser?.uid,
          otherId: id,
        }),
        members: [authFire?.currentUser?.uid, id],
        lastMessage: lastInputText,
        unreadCount: [authFire?.currentUser?.uid, id]?.reduce(function (
          obj,
          v
        ) {
          obj[v] = {
            count:
              authFire?.currentUser?.uid === v
                ? 0
                : firebase.database.ServerValue.increment(1),
          };
          return obj;
        },
        {}),
        channelName: `${authFire?.currentUser?.displayName}-${otherUserInfo?.name}`,
        createdAt: dateNow,
      };

      channelInfo.members?.forEach(async (x) => {
        await database
          .ref("channels")
          .child(x)
          .child(channelInfo?.channelId)
          .update(channelInfo)
          .catch((err) => {
            console.log("update channel err", err);
          });
      });
    } catch (err) {
      console.log("handle send err", err);
    }
  };

  const scrollToBottom = () => {
    let scroll =
      chatRef?.current?.scrollHeight - chatRef?.current?.clientHeight;
    chatRef?.current?.scrollTo(0, scroll);
  };

  const isSentByMe = (message) => {
    return authFire.currentUser.uid === message.sentBy?.id;
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleDelete = (x, i) => {
    let temp = [...messages];
    temp.splice(i, 1);
    setMessages(temp);
    try {
      database
        .ref("messages")
        .child(
          getMessageNode({
            myId: authFire?.currentUser?.uid,
            otherId: id,
          })
        )
        .child(x?.createdAt)
        .remove();
      storage.ref().child(x.img).delete();
    } catch (err) {
      console.log("handle delete err", err);
    }
  };

  const handleInput = (e) => {
    try {
      setInput(e.target.value);
      let currUserRef = database.ref("user").child(authFire?.currentUser?.uid);
      if (!isTyping) {
        currUserRef.update({ chattingWith: id });
      }

      if (typingTimeout) {
        clearInterval(typingTimeout);
        typingTimeout = null;
      }
      typingTimeout = setTimeout(() => {
        if (typingTimeout)
          database
            .ref("user")
            .child(authFire?.currentUser?.uid)
            .update({ chattingWith: null });
      }, 1000);
    } catch (err) {
      console.log("handle input err", err);
    }
  };

  const uploadImg = (e) => {
    let temp = fileUpload?.length > 0 ? [...fileUpload] : [];
    if (e.target?.files[0]?.size < 20000000) {
      let fileType = e?.target?.files[0]?.type.split("/");
      setImgSend([...imgSend, e?.target?.files[0]]);
      temp.push({
        createdAt: Date.now(),
        messageType: fileType[0],
        message: input,
        isLoading: true,
        img: URL?.createObjectURL(e?.target?.files[0]),
        sentBy: {
          id: authFire?.currentUser?.uid,
          name: authFire?.currentUser?.displayName,
          photo: authFire?.currentUser?.photoURL,
        },
      });
      setFileUpload(temp);
      e.target.value = "";
    } else {
      alert("please select file size less then 20MB");
    }
  };

  const handleDragUpload = (e) => {
    let t = fileUpload?.length > 0 ? [...fileUpload] : [];

    for (let i = 0; i < e?.length; i++) {
      if (e[i]?.size < 20000000) {
        let fileType = e[i]?.type.split("/");
        setImgSend([...imgSend, e[i]]);
        t.push({
          createdAt: Date.now(),
          messageType: fileType[0],
          message: input,
          isLoading: true,
          img: URL?.createObjectURL(e[i]),
          sentBy: {
            id: authFire?.currentUser?.uid,
            name: authFire?.currentUser?.displayName,
            photo: authFire?.currentUser?.photoURL,
          },
        });
      } else {
        alert("please select file size less then 20MB");
      }
    }
    setFileUpload([...t]);
  };

  const updateTime = (x) => {
    if (x?.read === 1) {
      database
        ?.ref("messages")
        .child(
          getMessageNode({
            myId: authFire?.currentUser?.uid,
            otherId: id,
          })
        )
        ?.child(x?.createdAt)
        .update({ read: 2 });
    }
  };
  // handle drag events
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // triggers when file is dropped
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      let t = [];
      Object.entries(e.dataTransfer?.files).forEach(([key, value]) => {
        t.push(value);
      });
      handleDragUpload(t);
    }
  };
  return (
    <div
      onDragEnter={handleDrag}
      className="chatBox"
      style={{
        backgroundColor: theme?.chat?.bg,
        height: "93vh",

        position: "relative",
        flex: 0.86,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          backgroundColor: theme?.chat?.headerBg,
          boxShadow:
            "0px 2px 11px 0 rgb(0 0 0 / 20%), 0px -2px 0px 0px rgb(0 0 0 / 19%)",
          minHeight: "42px",
          maxHeight: "42px",
        }}
      >
        <img
          src={otherUserInfo?.picture}
          style={{
            width: "35px",
            height: "35px",
            borderRadius: "50%",
            margin: "0 12px",
          }}
          alt="img"
        />

        <p
          style={{
            fontWeight: "bold",
            display: "flex",
            flexDirection: "column",
            color: theme?.chat?.headerText,
          }}
        >
          {otherUserInfo?.name}
          {isOtherUserTyping === authFire?.currentUser?.uid ? (
            <span
              style={{
                color: theme?.chat?.headerText,
                fontSize: "10px",
                fontWeight: "600",
              }}
            >
              typing ...
            </span>
          ) : isOtherUserOnline ? (
            <span
              style={{
                color: theme?.chat?.headerText,
                fontSize: "10px",
                fontWeight: "600",
              }}
            >
              Online
            </span>
          ) : null}
        </p>
      </div>
      <div
        className="chat"
        ref={chatRef}
        style={{ height: fileUpload?.length > 0 && "72vh" }}
      >
        {progress && (
          <progress
            style={{
              position: "absolute",
              left: "35%",
              top: "12%",
              fontSize: "25px",
            }}
            value={progressCount}
            max="100"
          ></progress>
        )}
        {messages?.map((x, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              justifyContent: isSentByMe(x) ? "flex-end" : "flex-start",
            }}
          >
            {authFire?.currentUser?.uid === otherUserInfo?.activeChannelId &&
              updateTime(x)}
            <div
              className="roll-out"
              style={{
                display: "flex",
                alignItems: "center",
                maxWidth: "60%",
              }}
              onMouseEnter={() => {
                setActiveHoverEl(x?.createdAt);
              }}
              onMouseLeave={() => setActiveHoverEl(null)}
            >
              <p
                style={{
                  backgroundColor: isSentByMe(x)
                    ? theme?.chat?.messageBg
                    : theme?.chat?.senderBg,

                  padding: "6px 13px",
                  color: "white",
                  display: "flex",
                  borderRadius: isSentByMe(x)
                    ? "0px 6px 6px 6px"
                    : "6px 0px 6px 6px",
                  fontSize: 14,
                  alignItems: "end",
                }}
              >
                {x?.messageType === "text" && (
                  <span
                    style={{
                      color: isSentByMe(x)
                        ? theme?.chat?.messageText
                        : theme?.chat?.senderText,
                      wordBreak: "break-all",
                    }}
                  >
                    {x?.message}
                  </span>
                )}

                {x?.messageType === "image" && (
                  <span style={{ position: "relative" }}>
                    <ImageMessage
                      path={x?.img}
                      isLoading={x?.isLoading}
                      textColor={
                        isSentByMe(x)
                          ? theme?.chat?.messageText
                          : theme?.chat?.senderText
                      }
                    />
                  </span>
                )}
                {x?.messageType === "video" && (
                  <span style={{ position: "relative" }}>
                    <VideoMessage
                      path={x.img}
                      isLoading={x?.isLoading}
                      textColor={
                        isSentByMe(x)
                          ? theme?.chat?.messageText
                          : theme?.chat?.senderText
                      }
                    />
                  </span>
                )}
                {x?.messageType === "application" && (
                  <DocumentMessage
                    path={x.img}
                    textColor={
                      isSentByMe(x)
                        ? theme?.chat?.messageText
                        : theme?.chat?.senderText
                    }
                  />
                )}
                <span
                  style={{
                    fontSize: "7px",
                    marginLeft: "12px",
                    display: "flex",
                    alignItems: "center",
                    // marginTop: "10px",
                    color: isSentByMe(x)
                      ? theme?.chat?.messageText
                      : theme?.chat?.senderText,
                  }}
                >
                  {dayjs(x?.createdAt).format("LT")}
                  {x?.read === 2
                    ? isSentByMe(x) && (
                        <BiCheckDouble
                          style={{
                            fontSize: "14px",
                            color: theme?.sidebar?.activePresence,
                          }}
                        />
                      )
                    : isSentByMe(x) && (
                        <BiCheckDouble
                          style={{
                            fontSize: "14px",
                          }}
                        />
                      )}
                </span>
              </p>

              {isSentByMe(x) && (
                <span onClick={() => handleDelete(x, index)}>
                  {!x?.isLoading && (
                    <RiDeleteBin6Line
                      className={`render
                   ${activeHoverEl === x?.createdAt ? "show" : undefined}
                 `}
                      style={{
                        fontSize: "18px",
                        color: "red",
                        marginLeft: 5,
                      }}
                    />
                  )}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            position: "absolute",
            bottom: 0,
            width: "96%",
            display: "flex",
            height: "45px",
            backgroundColor: theme?.chat?.inputBg,
            borderRadius: "25px",
            marginBottom: "10px",
            paddingBottom: fileUpload?.length > 0 && "94px",
          }}
        >
          <input
            ref={inputRef}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSend(null, "text");
              }
            }}
            onChange={handleInput}
            value={input}
            type="text"
            placeholder={`Message ${otherUserInfo?.name}...`}
            style={{
              width: "90%",
              // height: "40px",
              backgroundColor: theme?.chat?.inputBg,
              border: "none",
              borderRadius: "25px",
              // margin: "8px 12px",
              // paddingLeft: "10px",
              outline: "none",
              color: theme?.chat?.inputText,
              padding: "0 12px",
            }}
          />
          {fileUpload?.length > 0 &&
            fileUpload.map((x, i) => (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: `${i * 100 + 10}px`,
                  bottom: "6px",
                  padding: " 3px 2px",
                  borderRadius: "6px",
                  boxShadow: " 0px 0px 4px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {x?.messageType === "video" && (
                  <video width="70px" height="75px">
                    <source src={x?.img} type="video/mp4" />
                  </video>
                )}
                {x?.messageType === "image" && (
                  <img src={x?.img} width="70px" height="75px" />
                )}
                {x?.messageType === "application" && (
                  <GrDocumentText fontSize={70} />
                )}
                <AiOutlineCloseCircle
                  style={{ position: "absolute", top: "-9px", right: "-9px" }}
                  color={theme?.chat?.inputText}
                  onClick={() => selectedFileDelete(i)}
                />
              </div>
            ))}
          <div
            style={{
              position: "absolute",
              top: "20%",
              right: "54px",

              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "25px",
              width: "25px",
              fontSize: "20px",
              transform: "rotate(42deg)",
            }}
          >
            <input
              type="file"
              ref={fileRef}
              onChange={(e) => uploadImg(e)}
              multiple
              style={{ display: "none" }}
            />
            <MdOutlineAttachFile
              color={theme?.chat?.sendIcon}
              onClick={() => fileRef?.current?.click()}
            />
          </div>
          <div
            style={{
              position: "absolute",
              top: "20%",
              right: "20px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "25px",
              width: "25px",
            }}
            onClick={() =>
              fileUpload?.length > 0
                ? handleImgSend()
                : handleSend(null, "text")
            }
          >
            <FaPaperPlane color={theme?.chat?.sendIcon} />
          </div>
        </div>
      </div>
      {dragActive && (
        <div
          id="drag-file-element"
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <GiFiles size={50} />
          <div style={{ fontSize: "22px", fontWeight: "500" }}>Upload File</div>
        </div>
      )}
    </div>
  );
}

export default React.memo(Chat);
