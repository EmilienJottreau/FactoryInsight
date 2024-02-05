import { useState, useRef ,useEffect } from 'react';
import { NavBar } from './nav/navbar';
import { LeftMenu } from './menu/leftmenu';
import { Scrim } from './scrim';

import { Outlet } from 'react-router-dom';





function App() {

  const [menuVisible, setMenuVisible] = useState(false)
  const toggleChecked = () => setMenuVisible(value => !value);


  


  return (
    <div className="App">



      <NavBar toggleMenu={toggleChecked} menuVisible={menuVisible}/>

      <div className='below-nav'>
        {menuVisible && <LeftMenu/>}
        <div className='mainContent'>
          <Outlet/>
          {menuVisible && <Scrim/>}
        </div>
      </div>

    </div>
  );
}

export default App;
