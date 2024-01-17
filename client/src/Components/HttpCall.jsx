import { useEffect, useState } from "react";

export default function HttpCall() {
  const [data, setData] = useState("");

  useEffect(() => {
    fetch("http://127.0.0.1:5000/aa", {
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(function(response) { var a = response.json()
        //console.log(a)
        return a
      })   
      .then(function(responseData){
        console.log(responseData)
        setData(responseData.data)

      } 
      );
});
return (
  <>
    <h2>HTTP Communication</h2>
    <h3 className="http">{data}</h3>
  </>
);
}
