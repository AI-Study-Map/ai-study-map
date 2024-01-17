import { useNavigate } from 'react-router-dom';


function Page404() {
    const navigate = useNavigate();

    const handleButtonGoTop = () => {
        navigate("/");
    }
    
    const handleButtonGoMap = () => {
        navigate("/map");
    }

    return (
        <div>
            <h1>404 Not Found</h1>
            <button onClick={()=>handleButtonGoTop()}>Topへ</button>
            <br />
            <h1></h1>
            <button onClick={()=>handleButtonGoMap()}>Mapへ</button>
        </div>
    )
}

export default Page404