import { useParams } from "react-router-dom"

export function CuveRoute(){

    const {id} = useParams()

    return <div>
        <h1>Cuve {id}</h1>
    </div>
}