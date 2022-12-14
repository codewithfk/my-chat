import React, { useContext, useEffect, useRef, useState } from "react";
import { BsCircleFill } from "react-icons/bs";
import { AiOutlineSearch } from "react-icons/ai";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";

function TopHeader({ users }) {
  const [search, setSearch] = useState("");
  const [searchUser, setSearchUser] = useState(false);
  const [filter, setFilter] = useState([]);
  const { theme } = useContext(ThemeContext);
  const { id } = useParams();
  const inputRef = useRef(null);
  const userRef = useRef(null);
  const [cursor, setCursor] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    document.addEventListener("keydown", (e) => {
      if (e.code === "KeyG" && e.ctrlKey) {
        e.preventDefault();
        setSearchUser(true);
        inputRef?.current?.focus();
      }
      if (e.code === "Escape") {
        inputRef?.current?.blur();
        setCursor(0);
      }
    });
  }, []);
  useEffect(() => {
    const filterUser = users?.filter((item) => {
      return Object.values(item)
        .join()
        .toLowerCase()
        .includes(search.toLowerCase());
    });
    setFilter(filterUser);
  }, [search, searchUser]);
  const handleKeyDown = (e) => {
    if (e.code === "ArrowDown") {
      if (cursor === users?.length - 1) {
        setCursor(0);
        return;
      }
      setCursor((prev) => prev + 1);
    }

    if (e.code === "Enter") {
      navigate(`/user/${users[cursor]?.id}`);
      inputRef?.current?.blur();
    }
  };
  const handleKeyUp = (e) => {
    if (e.code === "ArrowUp") {
      if (cursor === 0) {
        setCursor(users?.length - 1);
        return;
      }
      setCursor((prev) => prev - 1);
    }
  };

  return (
    <div
      style={{
        width: "100%",
        backgroundColor: theme?.sidebar?.bg,
        textAlign: "center",
        height: "7vh",
      }}
    >
      <div className="inputWrapper">
        <div
          className="search-new-user"
          style={{
            display: "flex",
            alignItems: "center",
            backgroundColor: theme?.sidebar?.activeItemBg,
            color: theme?.sidebar?.activeItemText,
          }}
        >
          <AiOutlineSearch color="#FFFF" />
          <input
            ref={inputRef}
            className="search-new-user"
            type={"text"}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search User"
            onKeyDown={handleKeyDown}
            onKeyUp={handleKeyUp}
            style={{
              backgroundColor: theme?.sidebar?.activeItemBg,
              color: theme?.sidebar?.activeItemText,
              width: "100%",
            }}
          />
        </div>

        <div className="searchContent">
          {filter?.map((x, i) => (
            <Link
              className="userRow"
              key={x?.id}
              state={{ data: x }}
              to={`/user/${x.id}`}
              style={{
                color:
                  id === x?.id
                    ? theme?.sidebar?.activeItemText
                    : theme?.sidebar?.itemText,

                backgroundColor:
                  i === cursor ? theme?.sidebar?.activeItemBg : "",
                position: "relative",
              }}
            >
              <img
                src={x?.picture}
                height="30px"
                width="30px"
                style={{ borderRadius: 25 }}
                alt="userImg"
              />
              {x?.online && (
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
              <p
                style={{
                  paddingLeft: "8px",
                  color: theme?.sidebar?.itemText,
                }}
              >
                {x?.name}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TopHeader;
