import styled from 'styled-components';
import useStore from '../node/store';

const themes = {
  yellow: '#FFE867',
  pink: '#FFC8C8',
  orange: '#FF8B67',
  green: '#478577'
};

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background: #FAFFF7;
  padding: 15px;
`;

const ColorChoice = styled.label`
  display: flex;
  align-items: center;
  margin: 0 5px;
  cursor: pointer;
`;

const ColorIndicator = styled.div`
  width: 40px;
  height: 24px;
  background-image: ${(props) => `url(themeColor/pattern${props.index+1}.png)`};
  background-size: contain;
  background-repeat: no-repeat;
`;

const ThemeSwitcher = () => {
    const { setThemeColorId } = useStore(state => ({
        setThemeColorId: state.setThemeColorId
    }));

    const handleThemeChange = (theme) => {
        const keys = Object.keys(themes);
        const colorIndex = keys.indexOf(theme);
        setThemeColorId(colorIndex);
    };

  return (
    <Container>
      {Object.keys(themes).map((theme, index) => (
        <ColorChoice key={theme} onClick={() => handleThemeChange(theme)}>
            <ColorIndicator color={themes[theme]} index={index}/>
        </ColorChoice>
      ))}
    </Container>
  );
};

export default ThemeSwitcher;