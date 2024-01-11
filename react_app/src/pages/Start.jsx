import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useNavigate } from 'react-router-dom';
import NodeTreeMake from '../node/NodeTreeMake';
import { GlobalStyle } from './Top';
import Header from '../layout/Header';
import styled from 'styled-components';
import NodeTreeChoice from '../node/NodeTreeChoice';

const Title = styled.h1`
  margin: -10px 0px;
`

const Example = styled.div`
  text-align: center;
  margin-top: 15px;
  font-size: 25px;
  padding-right: 30%;
`

function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3 }}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }
  
  CustomTabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
  };
  
  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

function Start() {
    const [value, setValue] = React.useState(0);
    const [isTabsDisabled, setIsTabsDisabled] = React.useState(true);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const navigate = useNavigate();

    const handleButtonGoLibrary = () => {
        navigate("/library");
    }

    const handleEnableTabs = () => {
        setIsTabsDisabled(false);
    };

    return (
        <div>
            <GlobalStyle />
            <Header />
            <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" sx={{'& .MuiTabs-indicator': {backgroundColor: '#7BC74D'}}}>
                        <Tab label="Tutorial" {...a11yProps(0)} sx={{'&.Mui-selected': {color: '#7BC74D'}}}/>
                        <Tab label="Set Theme" {...a11yProps(1)} disabled={isTabsDisabled} sx={{'&.Mui-selected': {color: '#7BC74D'}}}/>
                        <Tab label="Library" {...a11yProps(2)} disabled={isTabsDisabled} sx={{'&.Mui-selected': {color: '#7BC74D'}}}/>
                    </Tabs>
            </Box>
            <CustomTabPanel value={value} index={0}>
                <Title>チュートリアル</Title>
                <button onClick={handleEnableTabs}>チュートリアル完了</button>
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
                <Title>セットテーマ</Title>
                <NodeTreeMake />
                <Example>テーマ例: 料理、スポーツ、Python</Example>
            </CustomTabPanel>
            <CustomTabPanel value={value} index={2}>
                <Title>ライブラリ</Title>
                <NodeTreeChoice />
            </CustomTabPanel>
            </Box>
        </div>
    )
}

export default Start;