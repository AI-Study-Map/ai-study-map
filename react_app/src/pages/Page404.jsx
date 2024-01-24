import { useNavigate } from 'react-router-dom';
import Header from '../layout/Header';
import { GlobalStyle, BottomSection } from './Top';


function Page404() {
    const navigate = useNavigate();

    const handleButtonGoTop = () => {
        navigate("/");
    }

    return (
        <div>
            <GlobalStyle />
            <Header />
            <BottomSection>
                <h1>ページがありません</h1>
                <button onClick={()=>handleButtonGoTop()}>Topへ</button>
            </BottomSection>
        </div>
    )
}

export default Page404