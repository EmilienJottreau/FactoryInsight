import logo from '../../assets/img/Icon_User.svg';






export function NavUser({link, user}){


    return <a style={{"textDecoration": "none",
                    "color": "white",
                    "alignItems" : "center"}        }
        href = "link" className='d-flex flex-wrap'>
        <div className='me-3'>{user}</div>
        <img src={logo} alt="logo" />
    </a>
}