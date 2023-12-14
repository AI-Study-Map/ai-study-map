import React, { useState } from 'react';
import styled from 'styled-components';
import CheckMark from '../images/ClearLogo.png';
import Confetti from 'react-confetti'
import useWindowSize from 'react-use/lib/useWindowSize'
import ConfettiExplosion from 'react-confetti-explosion';

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.7);
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #000;
`;

const Image = styled.img`
  width: 100px;
  height: 100px;
`;

const Letter = styled.p`
  margin-top: 110px;
  color: #17594A;
  font-size: 40px;
  font-weight: bold;
  white-space: pre-wrap;
  text-align: center;
  line-height: 1.2;
`;

const SaveButton = styled.button`
  margin-top: -10px;
  padding: 10px 20px;
  font-size: 16px;
  background-color: #7BC74D;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 11%;
  right: 5%;
  padding: 10px;
  font-size: 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  background: none;
`;

const Clear = ({ letter }) => {
  const [isClearEnabled, setIsClearEnabled] = useState(false);
  const { width, height } = useWindowSize()

  const toggleClear = () => {
    setIsClearEnabled(!isClearEnabled);
  };

  const handleSaveMap = () => {
  };

  const handleClose = () => {
    setIsClearEnabled(false);
  };

  return (
    <>
      {isClearEnabled && (
        <Overlay>
          <ConfettiExplosion
            duration={3500}
            zIndex={1000}
            width={width}
            height={height}
          />
          <Confetti
            width={width}
            height={height}
            recycle={true}
          />
          <CloseButton onClick={handleClose}>
            <svg width="20" height="20" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path id="Union" fillRule="evenodd" clipRule="evenodd" d="M31.1223 1.17157C32.6844 -0.390524 35.217 -0.390524 36.7791 1.17157C38.3412 2.73367 38.3412 5.26633 36.7791 6.82843L24.6322 18.9753L36.7791 31.1223C38.3412 32.6844 38.3412 35.217 36.7791 36.7791C35.217 38.3412 32.6844 38.3412 31.1223 36.7791L18.9754 24.6322L6.82842 36.7791C5.26632 38.3412 2.73366 38.3412 1.17156 36.7791C-0.390536 35.217 -0.390537 32.6844 1.17156 31.1223L13.3185 18.9753L1.17158 6.82843C-0.390521 5.26633 -0.390521 2.73367 1.17158 1.17157C2.73367 -0.390524 5.26633 -0.390524 6.82843 1.17157L18.9754 13.3185L31.1223 1.17157Z" fill="#17594A"/>
            </svg>
          </CloseButton>
          <Image src={CheckMark} alt="Check Mark" />
          <Letter>{letter} Study Map{'\n'}完成！</Letter>
          <SaveButton onClick={handleSaveMap}>マップを保存する</SaveButton>
        </Overlay>
      )}
    </>
  );
};

export default Clear;
