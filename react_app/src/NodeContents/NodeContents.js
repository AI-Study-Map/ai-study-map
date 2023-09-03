import { useEffect, useState } from "react";

function NodeContents() {

    const [num, setNum] = useState(0);

    function onClick() {
        setNum(num + 1);
        console.log(num);
    }

    useEffect(() => {
        console.log("useEffect");
    }, []);

    return (
    <>
        <button onClick={onClick}>Click me</button>
        <p>{num}</p>
    </>
    );
  }
  
  export default NodeContents;
  