import { useOutletContext, useSearchParams } from "react-router-dom"
import { useFetch } from "../../hooks/useFetch"

export function MainHistoryGraph(){

    const [searchParams] = useSearchParams()
    const [lastStation, setLastStation] = useOutletContext()

    const tag = searchParams.get("tag")

    // const [loading, data, errors] = useFetch('http://127.0.0.1/')

    return <>
        <div className="center">
            <div>
                Ici sera mis les graphiques de {tag} pour station {lastStation}
            </div>
        </div>
    </>
}