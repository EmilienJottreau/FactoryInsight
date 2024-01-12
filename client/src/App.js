import { useState, useRef ,useEffect } from 'react';
import './App.css';
import { NavBar } from './Components/nav/navbar';
import { LeftMenu } from './Components/menu/leftmenu';
import { Scrim } from './Components/scrim';

import { Main } from './Components/main';

const color = {
  "backgroundColor" : "#34495E",
}


function App() {

  const [menuVisible, setMenuVisible] = useState(false)
  const toggleChecked = () => setMenuVisible(value => !value);


  


  return (
    <div className="App">


      <NavBar toggleMenu={toggleChecked} menuVisible={menuVisible}/>

      <div className='below-nav'>
        {menuVisible && <LeftMenu/>}
        <div className='mainContent'>
          <Main/>
          {menuVisible && <Scrim/>}
        </div>
      </div>

    </div>
  );
}

export default App;
