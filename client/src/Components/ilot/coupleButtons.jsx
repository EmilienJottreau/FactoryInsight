import { Button } from "./button";

export function CoupleButtons({name, state, url, options={}}) {
  const ChangeTagValue = (value)=>{
    console.log("url+value " + url + value)
    fetch(url+value, {
      // ...options,
      // headers:{
      //   'Accept':'application/json; charset=UTF-8',
      //   ...options.headers
      // }
    }).then((r) => r.json())
  }


  return (
    <>
      <div className="coupleButtons">
        <label>{name.title}</label>
        <div className="twoButtons">
          <Button text={name.on}  onClick={()=>{ChangeTagValue(1)}} disabled={state}/>
          <Button text={name.off} onClick={()=>{ChangeTagValue(0)}} disabled={!state}/>
        </div>
      </div>
    </>
  );
}
