import React, { useState, useEffect, useRef, useContext } from 'react';
import {useSelector, useDispatch} from 'react-redux';
import { Form, InputGroup } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import {faMagnifyingGlass, faGear, faCircle} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-regular-svg-icons";

import "./style.css";
import logo from '../../assets/images/Logo.png';
import {clearCurrUser} from '../../store/Slices/UserSlice';
import NotificationContext from '../../Context/NotificationContext'
import { axiosInstance } from '../../api/config';

function Header() {
  const {notifications, setNotifications} = useContext(NotificationContext)
  const {currentUser, synced} = useSelector(state => state.currentUser)
  const [searchQuery, setSearchQuery] = useState('');
  const dispatch = useDispatch()
  const navigate = useNavigate()
 
  function useInterval(callback, delay) {
    const savedCallback = useRef();
  
    // Remember the latest callback.
    useEffect(() => {
      savedCallback.current = callback;
    }, [callback]);
  
    // Set up the interval.
    useEffect(() => {
      function tick() {
        savedCallback.current();
      }
      if (delay !== null) {
        let id = setInterval(tick, delay);
        return () => clearInterval(id);
      }
    }, [delay]);
  }

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/explore?query=${searchQuery}`);
  };

  const logout = () => {
    dispatch(clearCurrUser())
  }

  const checkNotifications = () => {
    axiosInstance.get('/chats/check/').then(res => {
      setNotifications(res.data.new);
    }).catch((err)=>{console.log(err)})
  }

  useInterval(()=>{
    checkNotifications()
  }, (synced && !notifications) ? 10000:null)

  useEffect(()=>{
    if (synced){
      checkNotifications()
    }
  },[])

  return (
    <nav className="navbar navbar-expand-lg fixed-top">
      <div className="container">
        <Link to='/' className="navbar-brand text-primary">
          <img src={logo} alt='logo' style={{height:"32px", marginRight:"10px"}}/>
          Pet.me
        </Link>

        <div className="offcanvas offcanvas-end"
          tabIndex="-1" id="offcanvasNavbar" aria-labelledby="offcanvasNavbarLabel">
          <div className="offcanvas-header me-lg-2">
          <Link to='/' className="navbar-brand text-primary">
            <img src={logo} alt='logo' style={{height:"32px", marginRight:"10px"}}/>
            Pet.me
          </Link>
          <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
          </div>

          <div className="offcanvas-body ms-lg-5">
            <ul className="navbar-nav justify-content-center flex-grow-1 pe-3">
              <li className="nav-item">
                <Link
                  className="nav-link mx-lg-2"
                  aria-current="page"
                  to="/explore">
                  Explore
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link mx-lg-2" to="/blog">
                  Blog
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link mx-lg-2" to="/about">
                  About
                </Link>
              </li>
              <li className="nav-item ms-auto me-5 d-flex align-items-center w-50 mb-5 mb-lg-0">
                <form className="input-group mx-lg-2" onSubmit={handleSearch}>
                  <InputGroup className="p-1">
                    <InputGroup.Text id="basic-addon1" className="bg-transparent border-0">
                      <button type="submit" className="border-0 bg-transparent">
                        <FontAwesomeIcon icon={faMagnifyingGlass} style={{color:'#8c594d' , fontSize:'18px'}}/>
                      </button>
                      </InputGroup.Text>
                    <Form.Control
                      className="p-0"
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search here ..."
                      aria-label="Search"
                      id="search"
                      aria-describedby="basic-addon1"
                    />
                  </InputGroup>
                </form>
              </li>
            </ul>

            <div className="d-flex align-items-center justify-content-between">
              {synced? <> 
              <Link to="/chats" className='position-relative'>
                  <FontAwesomeIcon icon={faEnvelope} className="text-primary fw-bold fs-4"/>
                  {notifications && <FontAwesomeIcon icon={faCircle} className='text-danger position-absolute' 
                  style={{fontSize:"15px", right:"-5px", top:"-4px"}}/>}
              </Link>

              {currentUser.is_superuser ? 
                <Link to="/admin-panel">
                    <FontAwesomeIcon icon={faGear} className="text-primary fw-bold fs-4 ps-4" style={{color:'#bf7245'}}/>
                </Link> : 
            ""
              }

              <Link to={`/profile/${currentUser.id}`} className="mx-4">
                <img class="rounded-circle shadow-1-strong" id="profile_picture"
                    src={`${currentUser.picture}`} alt="avatar" width="40"
                    height="40"/>  
              </Link>

              <Link to="/" className="text-primary text-decoration-none fw-bold" onClick={logout}>
                Logout
              </Link>
              </>:<>
              <Link to="/register/login" className="login-button mx-lg-2">
                Login
              </Link>
              </>}
            </div>

          </div>

        </div>


        
        <button
          className="navbar-toggler pe-0"
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#offcanvasNavbar"
          aria-controls="offcanvasNavbar"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
      </div>
    </nav>


  );
}

export default Header;
