import { Button } from "./button";

export function CoupleButtons({name, state, action}) {
  return (
    <>
      <div className="coupleButtons">
        <label>{name.title}</label>
        <div className="twoButtons">
          <Button text={name.on}  onClick={action.on} disabled={state}/>
          <Button text={name.off} onClick={action.off} disabled={!state}/>
        </div>
      </div>
    </>
  );
}
