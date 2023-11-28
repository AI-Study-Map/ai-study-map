import styled, { keyframes } from 'styled-components';

const circleAnimation = keyframes`
    0% {
        top:6em;
        height:0.5em;
        border-radius: 5em 5em 2.5em 2.5em;
        transform: scaleX(1.7);
    }
    40% {
        height:2em;
        border-radius: 50%;
        transform: scaleX(1);
    }
    100% {
        top:0%;
    }
`;

const shadowAnimation = keyframes`
    0% {
        transform: scaleX(1.5);
    }
    40% {
        transform: scaleX(1);
        opacity: .7;
    }
    100% {
        transform: scaleX(.2);
        opacity: .4;
    }
`;

const Wrapper = styled.div`
    width: 2em;
    height: 6em;
    position: absolute;
    left: 41%;
    top: 35%;
    transform: translate(-50%, -50%);
`;

const Circle = styled.div`
    width: 2em;
    height: 2em;
    position: absolute;
    border-radius: 50%;
    background-color: #696969;
    left: 15%;
    transform-origin: 50%;
    animation: ${circleAnimation} .5s alternate infinite ease;

    &:nth-child(2) {
        left: 150%;
        animation-delay: .2s;
    }
    &:nth-child(3) {
        left: 285%;
        animation-delay: .3s;
    }
`;

const Shadow = styled.div`
    width: 2em;
    height: 0.4em;
    border-radius: 50%;
    background-color: rgba(0, 0, 0, .5);
    position: absolute;
    top: 6.2em;
    transform-origin: 50%;
    z-index: -1;
    left: 15%;
    filter: blur(1px);
    animation: ${shadowAnimation} .5s alternate infinite ease;

    &:nth-child(4) {
        left: 150%;
        animation-delay: .2s;
    }
    &:nth-child(5) {
        left: 285%;
        animation-delay: .3s;
    }
`;

const LoadingText = styled.span`
    position: absolute;
    top: 5em;
    font-family: 'Lato';
    font-size: 2.0em;
    letter-spacing: 0.5em;
    color: #696969;
    left: -160%;
`;

const LoadingScreen = () => (
    <Wrapper>
        <Circle />
        <Circle />
        <Circle />
        <Shadow />
        <Shadow />
        <Shadow />
        <LoadingText>Loading</LoadingText>
    </Wrapper>
);

export default LoadingScreen;
