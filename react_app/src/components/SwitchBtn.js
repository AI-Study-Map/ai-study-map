import styled from "styled-components";
import useStore from "../node/store";

const Svg = styled.svg`
  width: 18px;
  cursor: pointer;
  fill: white;
`;

const SwitchBtn = (props) => {
  const { flipped } = props
  const { setFlipped } = useStore(
    state => ({ setFlipped: state.setFlipped})
    );

  return (
    <div>
      <Svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1024 1024"
        onClick={() => setFlipped()}
      >
        {(flipped) ? (
          <g transform="translate(0, 1024) scale(1, -1)">
            <path d="M104.704 685.248a64 64 0 0 0 90.496 0l316.8-316.8l316.8 316.8a64 64 0 0 0 90.496-90.496L557.248 232.704a64 64 0 0 0-90.496 0L104.704 594.752a64 64 0 0 0 0 90.496z" />
          </g>
        ) : (
          <path d="M104.704 685.248a64 64 0 0 0 90.496 0l316.8-316.8l316.8 316.8a64 64 0 0 0 90.496-90.496L557.248 232.704a64 64 0 0 0-90.496 0L104.704 594.752a64 64 0 0 0 0 90.496z" />
        )}
      </Svg>
    </div>
  );
}

export default SwitchBtn
