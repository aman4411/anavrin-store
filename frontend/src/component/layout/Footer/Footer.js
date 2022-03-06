import React from 'react'
import playStore from '../../../images/playstore.png'
import appStore from '../../../images/Appstore.png'
import './Footer.css'

const Footer = () => {
  return (
    <footer id='footer'>
        <div className='leftFooter'>
            <h4>Download our App</h4>
            <p>Download app for android and IOS smartphone</p>
            <img src={playStore} alt="playStore" />
            <img src={appStore} alt="appStore" />
        </div>

        <div className='midFooter'>
            <h1>Anavrin Store</h1>
            <p>Customer satisfaction is our first priority</p>
            <p>Copyright 2022 &copy; Aman Mehta</p>
        </div>

        <div className='rightFooter'>
            <h4>Follow Us</h4>
            <a href="https://www.instagram.com/its_aman_mehta/">Instagram</a>
            <a href="https://www.linkedin.com/in/aman4411/">Linkedin</a>
            <a href="https://github.com/aman4411">Github</a>
        </div>
    </footer>
  )
}

export default Footer;