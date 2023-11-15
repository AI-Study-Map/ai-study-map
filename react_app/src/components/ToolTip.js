import React from 'react';
import styled from 'styled-components';

const TooltipContainer = styled.div`
  position: absolute;
  top: -85px;
  left: 50%;
  transform: translateX(-50%);
  padding: 20px 45px;
  max-width: 1000px;
  border-radius: 45px;
  background-color: #111111;
  color: #FFFFFF;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s ease-in-out;
  font-size: 20px;

  &::before {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    margin-left: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: #111111 transparent transparent transparent;
  }
`;

const TooltipElement = styled.p`
    padding-left: 10px;
    padding-right: 10px;
    white-space: nowrap;
    margin: 0;
`

const Proficiency = styled.span`
  font-family: 'Arial', sans-serif;
  color: #7BC74D;
  font-weight: bold;
  font-size:33px;
`;

const Tooltip = ({ theme, proficiency, children }) => {
  const handleMouseEnter = (e) => {
    const tooltip = e.currentTarget.querySelector('.tooltip');
    tooltip.style.opacity = 1;
    tooltip.style.visibility = 'visible';
  };

  const handleMouseLeave = (e) => {
    const tooltip = e.currentTarget.querySelector('.tooltip');
    tooltip.style.opacity = 0;
    tooltip.style.visibility = 'hidden';
  };

  return (
    <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} style={{ position: 'relative', zIndex: 1 }}>
      {children}
      <TooltipContainer className="tooltip">
        <TooltipElement>{theme} 習熟度: <Proficiency>{proficiency}</Proficiency>%</TooltipElement>
      </TooltipContainer>
    </div>
  );
};

export default Tooltip;

