import React, { useContext, useEffect, useState } from 'react';
import { BsCheckLg } from 'react-icons/bs';
import ReactModal from 'react-modal';
import { ThemeContext } from '../context/ThemeContext';
import { authFire, database } from '../service/firedase';

function Theme({ isVisible, setVisible }) {
  const { theme, themeData } = useContext(ThemeContext);
  const [selectedTheme, setSelectedTheme] = useState(null);

  useEffect(() => {
    setSelectedTheme(theme);
  }, [theme]);

  const handleThemeChange = (x, i) => {
    database.ref('user').child(authFire?.currentUser?.uid).update({
      themeId: x?.id,
    });
  };

  console.log({ theme });
  return (
    <ReactModal
      ariaHideApp={false}
      onRequestClose={() => setVisible(false)}
      isOpen={isVisible}
      shouldCloseOnOverlayClick={true}
      style={{
        content: {
          width: window.innerWidth * 0.62,
          height: window.innerHeight * 0.7,
          margin: 0,
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: theme?.chatColor,
          backgroundImage: `linear-gradient(to right,${theme?.sidebar?.bg}, ${theme?.chat?.bg}, ${theme?.chat?.headerBg})`,
        },
        overlay: {
          backgroundColor: 'rgba(0,0,0,0.3)',
        },
      }}
      shouldCloseOnEsc={true}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0px 20px',
          marginBottom: 30,
        }}>
        <h2 style={{ color: theme?.chatColor }}>Select Theme</h2>
        <div
          style={{
            position: 'absolute',
            right: 50,
            color: theme?.headerColor,
            fontSize: 18,
            cursor: 'pointer',
          }}
          onClick={() => setVisible(false)}>
          Close
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
        {themeData.map((x, i) => {
          return (
            <div
              key={i}
              onClick={() => {
                handleThemeChange(x, i);
              }}
              style={{
                width: 260,
                height: 170,
                margin: 10,
                position: 'relative',
              }}>
              <div style={{ display: 'flex', width: 260, height: 150 }}>
                <div style={{ width: 100, backgroundColor: x?.sidebar?.bg }}>
                  <div
                    className='boxShadow'
                    style={{ height: 30, backgroundColor: x?.sidebar?.bg }}
                  />
                </div>
                <div style={{ width: 280, backgroundColor: x?.chat?.bg }}>
                  <div
                    className='boxShadow'
                    style={{ height: 30, backgroundColor: x?.chat?.bg }}
                  />
                </div>
              </div>
              {selectedTheme?.id === x?.id && (
                <div
                  style={{
                    position: 'absolute',
                    top: '50%',
                    // bottom: 0,
                    left: '50%',
                    // right: 0,
                  }}>
                  <BsCheckLg />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </ReactModal>
  );
}

export default Theme;
