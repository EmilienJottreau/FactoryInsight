

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { NavUser } from './navuser'

import navCircle from '../../assets/img/Nav_Circle.svg';
import { useEffect, useRef, useState } from 'react';


const color = {
  backgroundColor : "#34495E",
  zIndex : 2,
  position : "relative",
}


export function NavBar({toggleMenu, menuVisible}){




    return <nav style={color} className="nav d-flex justify-content-between align-items-center">
    <div className='d-flex justify-content-between align-items-center' style={{width : "50px"}}>

      <button className='ms-2 me-2 p-2' href="#section" style={{
        background: 'none',
        color: 'inherit',
        border: 'none',
        padding: 0,
        font: 'inherit',
        cursor: 'pointer',
        outline: 'inherit',
      }}
      onClick={toggleMenu}
      >
        <FontAwesomeIcon icon="fa-solid fa-bars" style={{color: "#fcfcfc"}} />
      </button>
      {menuVisible && <div style={{color : "white"}}>
        Menu
      </div>}
    </div>
    <div className='d-flex flex-wrap'>
      <a className="nav-link active" aria-current="page" href="#section"><img src={navCircle} alt="navCircle" /></a>
      <a className="nav-link" href="#section"><img src={navCircle} alt="navCircle" /></a>
      <a className="nav-link" href="#section"><img src={navCircle} alt="navCircle" /></a>
      <a className="nav-link" href="#section"><img src={navCircle} alt="navCircle" /></a>
      <a className="nav-link" href="#section"><img src={navCircle} alt="navCircle" /></a>
    </div>
    <NavUser link={null} user={"Emilien"}/>
  </nav>

}