import { useNavigate } from 'react-router-dom';
import NodeTreeChoice from '../node/NodeTreeChoice';
import Header from '../layout/Header';
import { GlobalStyle } from './Top';


function StartLibrary() {
    const navigate = useNavigate();

    return (
        <div>
            <GlobalStyle />
            <Header />
            <h1>ライブラリ</h1>
            <NodeTreeChoice />
        </div>
    )
}

export default StartLibrary;