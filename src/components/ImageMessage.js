import React, { useEffect, useState } from "react";
import { storage } from "../service/firedase";

function ImageMessage({ path, isLoading, textColor }) {
  const [imgURl, setImgUrl] = useState(path);

  const getImageUrl = () => {
    try {
      storage
        .ref(path)
        .getDownloadURL()
        .then((url) => {
          setImgUrl(url);
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.log("Error", error);
    }
  };
  useEffect(() => {
    getImageUrl();
  }, []);
  return (
    <>
      {isLoading && (
        <>
          <span className="overlay" />
          <span className="iframe-loading" />
        </>
      )}
      <img src={imgURl} width="200" height="100%" />
    </>
  );
}

export default ImageMessage;
