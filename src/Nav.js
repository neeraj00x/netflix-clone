import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import './Nav.css'

function Nav() {
    const [show, handleShow] = useState(false);
    const navigate = useNavigate()

    const transitionNavBar = () => {
        if (window.scrollY > 150) {
            handleShow(true);
        } else {
            handleShow(false)
        }
    }

    useEffect(() => {
        window.addEventListener("scroll", transitionNavBar);
        return () => window.removeEventListener('scroll', transitionNavBar);
    }, [])


    return (
        <div className={`nav ${show && "nav_black"}`}>
            <div className="nav_contents">
                <img
                    onClick={() => navigate("/")}
                    className='nav_logo'
                    src='https://lh3.googleusercontent.com/pw/AM-JKLWxmqDzPs0ZW8T744qZ-T-J6yxAFlP8yeQwDHFlfrmYf39W8ZUHA3ECvWm0sEjzpFfhzmehcV_mZVqDApRwsaIRhRvGEDi1wcOTtOHd4yQuVzSNHOtM9bh5uMM0hQ3-Wf-_HfI1A08WeDtOzzX9ZDPh=w1563-h879-no'
                    alt=''
                />
                <img
                    onClick={() => navigate("/profile")}
                    className='nav_avatar'
                    src='https://www.abbeysurestart.com/wp-content/uploads/2021/03/blank-profile.png'
                    alt=''
                />
            </div>
        </div>
    )
}

export default Nav;