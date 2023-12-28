import React, { useState } from 'react';
import styled from 'styled-components';
import useStore from '../node/store';

// Define themes with different colors
const themes = {
  yellow: '#FFE867',
  pink: '#FFC8C8',
  orange: '#FF8B67',
};

// Styled components
const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ffffe0;
  padding: 10px;
`;

const ColorChoice = styled.label`
  display: flex;
  align-items: center;
  margin: 0 5px;
  cursor: pointer;
`;

const ColorIndicator = styled.div`
  width: 24px;
  height: 24px;
  /* border-radius: 50%; */
  background-color: ${(props) => props.color};
  border: 2px solid 'transparent';
`;

const RadioButton = styled.input.attrs({ type: 'radio' })`
  margin-right: 5px;
  cursor: pointer;
`;

// Main component
const ThemeSwitcher = () => {
    const { setThemeColorId } = useStore(state => ({
        setThemeColorId: state.setThemeColorId
    }));
    const [selectedTheme, setSelectedTheme] = useState('yellow');

    const handleThemeChange = (theme) => {
        setSelectedTheme(theme);
        const keys = Object.keys(themes);
        const colorIndex = keys.indexOf(theme);
        setThemeColorId(colorIndex);
    };

  return (
    <Container>
      {Object.keys(themes).map((theme) => (
        <ColorChoice key={theme} onClick={() => handleThemeChange(theme)}>
            <RadioButton
                name="theme"
                checked={selectedTheme === theme}
                onChange={() => handleThemeChange(theme)}
            />
            <ColorIndicator color={themes[theme]}/>
        </ColorChoice>
      ))}
    </Container>
  );
};

export default ThemeSwitcher;