import React from 'react';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import styled from '@emotion/styled';

const Wrapper = styled.div`
  position: relative;
  margin-top: 40px;
  margin-right: 50px;
`;

const Contents = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  background-color: #fff;
  border: 1px solid #17594A;
  border-radius: 3px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 1000;
`;

const Title = styled.div`
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 8px;
  border-bottom: 1px solid #17594A;
  padding: 2px 100px 2px 12px;
  text-align: left;
`;

const ThemeText = styled.span`
  font-size: 18px;
`;

const StyledLinearProgress = styled(LinearProgress)`
  padding: 5px;
  margin: 4px auto 12px 4px;
  display: block;
`;

const StyledTypography = styled(Typography)`
  margin: 4px 15px 12px 0px;
  color: #17594A;
`;

const GaugeBar = ({ ClearNodes, AllNodes, theme }) => {

  function LinearProgressWithLabel(props) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box sx={{ width: '100%', mr: 1 }}>
          <StyledLinearProgress variant="determinate" {...props} />
        </Box>
        <Box sx={{ minWidth: 35 }}>
          <StyledTypography variant="body2" color="text.secondary">{`${Math.round(props.value)}%`}</StyledTypography>
        </Box>
      </Box>
    );
  }

  return (
    <Wrapper>
      <Contents>
        <Title>
          <ThemeText>{theme}</ThemeText> Study Map
        </Title>
        <Box sx={{ width: '100%', textAlign: 'center' }}>
          <LinearProgressWithLabel color="success" value={((ClearNodes / AllNodes) * 100)} />
        </Box>
      </Contents>
    </Wrapper>
  );
};

export default GaugeBar;