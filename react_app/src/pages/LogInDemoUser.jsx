import { useNavigate } from 'react-router-dom';
import useStore from '../node/store';


function LogInDemoUser() {

    const { setUserId, setIsDemo
        
    } = useStore(
        state => ({
            setUserId: state.setUserId,
            setIsDemo: state.setIsDemo,
        })
    );

    const navigate = useNavigate();

    const handleLogInDemoUser = () => {
        setUserId(999);
        setIsDemo(true);
        navigate("/");
    }


    return (
        <div>
            <h1>ログインページです。</h1>
            <button onClick={()=>handleLogInDemoUser()}>デモユーザとしてログイン</button>
        </div>
    )
}

export default LogInDemoUser