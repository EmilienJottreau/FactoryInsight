

export function Button({text, onClick,  disabled=false}){


    return <button className="buttonIlot" onClick={onClick} disabled={disabled}> 
        {text}
    </button>
}