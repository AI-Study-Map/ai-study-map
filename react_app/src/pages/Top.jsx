import NodeTreeMake from "../node/NodeTreeMake";
import React from 'react';
import styled from 'styled-components';


const Container = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 2rem;
  background-color: #e9e9e9; // 適切な背景色を設定
`;
const LeftSection = styled.div`
  background-color: #4caf50; // 適切な背景色を設定
  padding: 1rem 2rem;
  flex: 0.5;
  h1 {
    font-size: 1.5rem;
    color: white;
  }
  p {
    margin-top: 1rem;
    color: white;
  }
`;
const RightSection = styled.div`
  background-color: white; // 適切な背景色を設定
  padding: 1rem 2rem;
  flex: 0.5;
  border: 1px dashed #4caf50;
  h2 {
    font-size: 1.5rem;
  }
`;
const Button = styled.button`
  background-color: #4caf50;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;


function Top() {
  return (
    <>
    <Container>
      <LeftSection>
        <h1>logo</h1>
        <p>適切なテキスト内容をこちらに記述します。</p>
      </LeftSection>
      <RightSection>
        <NodeTreeMake />
      </RightSection>
    </Container>
    </>
  );
}

export default Top;