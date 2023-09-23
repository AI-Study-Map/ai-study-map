import { useState } from 'react';
import styled from 'styled-components';
import useAddNode from '../node/useAddNode';

const StyledHeader = styled.header`
  background-color: #FFE867;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 60px;
  color: #7BC74D;
  position: relative;
  z-index: 10;
`;

const SidebarMenu = styled.div`
  height: 100%;
  position: fixed;
  right: 0;
  width: 250px;
  margin-top: 0;
  transform: translateX(${props => (props.$isOpen ? "0" : "250px")});
  transition: transform 250ms ease-in-out;
  background: #FFE867;
  z-index: 10000;
`;

const SidebarMenuInner = styled.ul`
  margin: 0;
  padding: 0;
  border-top: 1px solid rgba(255, 255, 255, 0.10);
  li {
    list-style: none;
    color: #7BC74D;
    text-transform: uppercase;
    font-weight: bold;
    padding: 20px;
    cursor: pointer;
    border-bottom: 1px solid rgba(255, 255, 255, 0.379);
    span {
      display: block;
      font-size: 14px;
      color: rgba(255, 255, 255, 0.50);
    }
    &:hover {
    background-color: #ff5757; // ホバー時の背景色変更
    color: #fff; // ホバー時の文字色変更
  }
  }
`;

const SidebarIconToggle = styled.label`
  cursor: pointer;
  position: absolute;
  z-index: 99;
  height: 22px;
  width: 22px;
  top: 22px;
  right: 15px;
`;

const Spinner = styled.div`
  background-color: #7BC74D;
  height: 3px;
  width: 22px;
  position: absolute;
  transition: all 0.3s;
  &.horizontal {
    margin-top: 8px;
    opacity: ${props => (props.$isOpen ? 0 : 1)};
  }
  &.diagonal.part-1 {
    transform: ${props => (props.$isOpen ? "rotate(135deg)" : "rotate(0)")};
    margin-top: ${props => (props.$isOpen ? "8px" : "0")};
  }
  &.diagonal.part-2 {
    transform: ${props => (props.$isOpen ? "rotate(-135deg)" : "rotate(0)")};
    margin-top: ${props => (props.$isOpen ? "8px" : "16px")};
  }
`;


const Header = ({ title }) => {
  const [isOpen, setIsOpen] = useState(false);

  const addNewNode = useAddNode();

  return (
    <>
      <StyledHeader>
        {title}
        <SidebarIconToggle onClick={() => setIsOpen(!isOpen)}>
          <Spinner className="diagonal part-1" $isOpen={isOpen} />
          <Spinner className="horizontal" $isOpen={isOpen} />
          <Spinner className="diagonal part-2" $isOpen={isOpen} />
        </SidebarIconToggle>
      </StyledHeader>
      <SidebarMenu $isOpen={isOpen}>
        <SidebarMenuInner>
          <li><p>ホーム</p></li>
          <li onClick={() => addNewNode("数値型", "文字列型")}><p>ノードを追加</p></li>
        </SidebarMenuInner>
      </SidebarMenu>
    </>
  );
}

export default Header