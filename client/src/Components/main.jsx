import { useFetchAtStart } from '../hooks/useFetch';
import { Button } from './ilot/button';
import { Cuve } from './ilot/cuve';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'




export function Main(){



    
    //const {loading, data, errors} = useFetchAtStart('https://jsonplaceholder.typicode.com/posts?_limit=10&_delay=2000')
    function changeState(param, value){
        fetch("http://localhost:8080/" + param + "?val=" + value).catch((e) => {console.log(e)})
    }

    return <main>
    <div className='leftContainer'>
        <div>
            <h1>ILOT 1</h1>
            <div className='textDescription'>
    description du procédé?
    unt aut facere repellat provident occaecati excepturi optio reprehenderi</div>
        </div>
        <div className='informations'>
            <div className='logo-info'>
                <FontAwesomeIcon icon="fa-solid fa-temperature-half" />
                <div>55°C</div>
            </div>
            <div className='logo-info'>
                <FontAwesomeIcon icon="fa-solid fa-arrows-up-down" />
                <div>2.4m</div>
            </div>
            <div className='logo-info'>
                <FontAwesomeIcon icon="fa-solid fa-arrows-rotate" />
                <div>Agitateur en marche</div>
            </div>
        </div>
    </div>
    <Cuve/>
    <div className='buttonContainer'>
        <div className='coupleButtons'>
            <label>Chaufage</label>
            <div className='twoButtons'>
                <Button text={"Allumer"} onClick={() => {changeState("temp", 1)}}/>
                <Button text={"Eteindre"}/>
            </div>
        </div>
        <div className='coupleButtons'>
            <label>Agitateur</label>
            <div className='twoButtons'>
                <Button text={"Allumer"}/>
                <Button text={"Eteindre"}/>
            </div>
        </div>
        <div className='coupleButtons'>
            <label>Volume</label>
            <div className='twoButtons'>
                <Button text={"Remplir"}/>
                <Button text={"Vider"}/>
            </div>
        </div>

    </div>



    </main>
}
/*

    <div>
        {loading && <div>Chargement ...</div>}
        {data && <div>{JSON.stringify(data)}</div>}
    </div>

*/