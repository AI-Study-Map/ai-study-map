import { useState } from 'react';
import styled from 'styled-components';
import useAddNode from '../node/useAddNode';
import MapDataSave from '../save/MapDataSave';
import { useNavigate } from 'react-router-dom';
import AiStudyMap_logo from '../images/ai-study-map-logo.png';
import ThemeSwitcher from '../components/ThemeSwitcher';
import useStore from '../node/store';
import ApiCounter from '../components/ApiCounter';

const themeColors = ["#FFE867", "#FFC8C8", "#FF7F67", "#478577"]
const subThemeColors = ["#7BC74D", "#66A83E", "#CD7160", "#70C79D"]

const StyledHeader = styled.header`
  background-color: ${(props) => themeColors[props.themeColorId]};
  display: flex;
  justify-content: center;
  align-items: center;
  height: 8vh;
  color: #7BC74D;
  position: relative;
  z-index: 10;
`;


const Logo = styled.div`
  background-image: url(${AiStudyMap_logo});
  background-repeat: no-repeat;
  background-position: 30px;
  background-size: contain;
  flex-shrink: 0;
  height: 100%;
  width: 150px;
  left: 0px;
  position: absolute;
`;

const SidebarMenu = styled.div`
  height: 100%;
  position: fixed;
  right: 0;
  width: 250px;
  margin-top: 0;
  transform: translateX(${props => (props.$isOpen ? "0" : "250px")});
  transition: transform 250ms ease-in-out;
  background: ${(props) => themeColors[props.themeColorId]};
  z-index: 10000;
`;

const SidebarMenuInner = styled.ul`
  margin: 0;
  padding: 0;
  border-top: 1px solid rgba(255, 255, 255, 0.10);
  li {
    list-style: none;
    color: ${(props) => props.themeColorId === 2 || props.themeColorId === 3 ? "#FAFFF7": "#7BC74D"};
    text-transform: uppercase;
    font-weight: bold;
    padding: 20px;
    cursor: pointer;
    border-bottom: 1px solid rgba(255, 255, 255, 0.379);
    transition: 0.15s ease;
    span {
      display: block;
      font-size: 14px;
      color: rgba(255, 255, 255, 0.50);
    }
    &:hover {
    background-color: ${(props) => subThemeColors[props.themeColorId]}; // ホバー時の背景色変更
    color: ${(props) => props.themeColorId === 2 || props.themeColorId === 3 ? "#FAFFF7": themeColors[props.themeColorId]}; // ホバー時の文字色変更
  }
  }
`;

const SidebarIconToggle = styled.label`
  cursor: pointer;
  position: absolute;
  z-index: 99;
  height: 22px;
  width: 22px;
  top: 24px;
  right: 27px;

`;

const Spinner = styled.div`
  background-color: ${(props) => props.themeColorId === 2 || props.themeColorId === 3 ? "#FAFFF7": "#7BC74D"};
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
  const { themeColorId } = useStore(state => ({
    themeColorId: state.themeColorId
  }));
  const [isOpen, setIsOpen] = useState(false);
  const [goStart, setGoStart] = useState(false);
  const [goTop, setGoTop] = useState(false);

  const addNewNode = useAddNode();
  const navigate = useNavigate();

  const handleGoStart = () => {
    setGoStart(true);
  }

  const handleGoTop = () => {
    setGoTop(true);
  }



  return (
    <>
      <StyledHeader themeColorId={themeColorId}>
      <Logo onClick={() => handleGoTop()} >
        <MapDataSave goStart={goStart} goTop={goTop}/>
      </Logo>
        {title}
        <ApiCounter />
        <SidebarIconToggle onClick={() => setIsOpen(!isOpen)}>
          <Spinner className="diagonal part-1" $isOpen={isOpen} themeColorId={themeColorId}/>
          <Spinner className="horizontal" $isOpen={isOpen} themeColorId={themeColorId}/>
          <Spinner className="diagonal part-2" $isOpen={isOpen} themeColorId={themeColorId}/>
        </SidebarIconToggle>
      </StyledHeader>
      <SidebarMenu $isOpen={isOpen} themeColorId={themeColorId}>
        <SidebarMenuInner themeColorId={themeColorId}>
          <li onClick={()=>handleGoStart()}><p><MapDataSave goStart={goStart} goTop={goTop}/>セーブしてホームに戻る</p></li>
          <li><ThemeSwitcher /></li>
        </SidebarMenuInner>
      </SidebarMenu>
    </>
  );
}

export default Header