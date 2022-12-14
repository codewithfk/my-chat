import React, { useContext, useEffect, useState } from "react";
import { HiDocumentDownload } from "react-icons/hi";
import { ThemeContext } from "../context/ThemeContext";
import { storage } from "../service/firedase";

function DocumentMessage({ path, textColor }) {
  const [DocURl, setDocUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const { theme } = useContext(ThemeContext);
  const getImageUrl = async () => {
    try {
      let url = await storage.ref(path).getDownloadURL();

      setDocUrl(url);
    } catch (error) {
      console.log("Error", error);
    }
  };
  useEffect(() => {
    setLoading(true);
    getImageUrl();
  }, [path]);
  return (
    <a
      href={DocURl}
      style={{ color: textColor, display: "flex", alignItems: "center" }}
      target="_blank"
    >
      <HiDocumentDownload size={30} />
      <span style={{ marginLeft: "8px" }}>{path.split("/")[2]}</span>
    </a>
  );
}

export default DocumentMessage;
