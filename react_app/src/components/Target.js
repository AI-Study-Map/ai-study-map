import React from 'react'
import styled from 'styled-components';

const TargetContainer = styled.div`
  border: 2px solid #999;
  padding: 20px 20px;
  border-radius: 10px;
  width: 30%;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const TargetElement = styled.div`
  font-size: 35px;
  z-index: 1000;
  pointer-events: none;
  margin: 10px;
  display: flex;
  flex-direction: row;
`;

const Target = ({value}) => {
  return (
    <div>
        <TargetContainer>
            <TargetElement>{value}を探し出せ！</TargetElement>
        </TargetContainer>
    </div>
  )
}

export default Target