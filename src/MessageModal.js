import React, { ReactNode, useEffect } from 'react';
// import CustomButton from "../customButton/CustomButton";
// import colors from "src/utils/colors.module.scss";
// import DefaultHeading from "../defaultHeading/DefaultHeading";
// import CloseIcon from "src/assets/svg/crossIcon.svg";
// import SvgIcon from "../svgIcon/SvgIcon";
// import {Button, Dimensions, Text, View} from 'react-native';
// import Animated, {ZoomIn, ZoomOut} from 'react-native-reanimated';

const MessageModal = ({ children }) => {
  const [handler, setHandeler] = React.useState({
    title: '',
    message: '',
    isVisible: false,
  });
  useEffect(() => {
    showMessage = ({ message, title, successFn }) => {
      setHandeler({
        isVisible: true,
        message,
        title,
        ...(successFn && { successFn }),
      });
      return null;
    };

    hideMessage = () => {
      setHandeler({ ...handler, isVisible: false });
      return null;
    };
  }, [handler]);

  return (
    <div
      style={{
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
        width: '100%',
      }}>
      {children}
      {handler.isVisible ? (
        <div
          style={{
            display: 'flex',
            height: '100%',
            width: '100%',
            position: 'fixed',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0px 20px',
            backgroundColor: 'rgba(0,0,0,0.4)',
          }}>
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '15px',
              alignSelf: 'center',

              //   width: "100%",
              width: `${window.innerWidth * 0.5}px`,
              //   width: "400px",
            }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '12px 13px',
              }}>
              <div style={{ fontSize: 22, color: 'black' }}>
                {handler.title}
              </div>
              {/* <SvgIcon
                src={CloseIcon}
                fill="#000"
                onClick={() =>
                  setHandeler((prev) => {
                    return {
                      ...prev,
                      isVisible: false,
                    };
                  })
                }
              /> */}
            </div>
            <div
              style={{ width: '100%,', borderBottom: '1px solid #E2E2E2' }}
            />

            <div
              style={{
                fontSize: 18,
                color: 'black',
                padding: '10px 13px',
              }}>
              {handler.message}
            </div>
            <div
              style={{
                // width: "100%",
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
                padding: '10px 13px ',
                backgroundColor: '#EEECEC',
                borderEndEndRadius: '15px',
                borderEndStartRadius: '15px',
              }}>
              <button
                onClick={() => {
                  handler.successFn && handler.successFn();
                  setHandeler((prev) => {
                    return {
                      ...prev,
                      isVisible: false,
                    };
                  });
                }}>
                ok
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export let showMessage = ({
  title = '',
  message = '',
  successFn = () => null,
}) => null;
export let hideMessage = () => null;

export default MessageModal;
