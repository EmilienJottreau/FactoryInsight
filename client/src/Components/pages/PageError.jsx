import { useRouteError } from 'react-router-dom';


export function PageError() {
    const error = useRouteError() // renvoie la dernier erreur connue
    console.log(error)
    return <>
        <h1> Une erreur est survenue</h1>
        <p>
            {error?.error?.toString() ?? error?.toString()}
        </p>
    </>
}