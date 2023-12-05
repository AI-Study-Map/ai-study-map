import { useNavigate } from 'react-router-dom';
import NodeTreeMake from '../node/NodeTreeMake';
import { GlobalStyle } from './Top';
import Header from '../layout/Header';


function Start() {
    const navigate = useNavigate();

    const handleButtonGoLibrary = () => {
        navigate("/library");
    }

    return (
        <div>
            <GlobalStyle />
            <Header />
            <h1>この中にNodeTreeMakeとNodeTreeChoiceを置く(NodeTreeChoiceはまた別ページ)</h1>
            <NodeTreeMake />
            <p>ライブラリへ(仮)</p>
            <button onClick={()=>handleButtonGoLibrary()}>ライブラリへ(仮)</button>
        </div>
    )
}

export default Start;