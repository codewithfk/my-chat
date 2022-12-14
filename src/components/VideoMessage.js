import React, { useEffect, useState } from "react";
import { storage } from "../service/firedase";

function VideoMessage({ path, textColor, isLoading }) {
  const [videoURl, setVideoUrl] = useState("");

  const getImageUrl = async () => {
    try {
      let url = await storage.ref(path).getDownloadURL();
      setVideoUrl(url);
    } catch (error) {
      console.log("Error", error);
    }
  };
  useEffect(() => {
    getImageUrl();
  }, [path]);
  return (
    <>
      {isLoading && (
        <>
          <span className="overlay" />
          <span className="iframe-loading" />
        </>
      )}
      <iframe
        loading="eager"
        src={videoURl}
        height="100%"
        width={200}
        style={{
          border: "none",
        }}
      />
    </>
  );
}

export default React.memo(VideoMessage);
