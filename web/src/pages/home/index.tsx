import React from 'react';
import { FiLogIn} from 'react-icons/fi'
import { Link } from 'react-router-dom'

import './styles.css';
import logo from '../../assets/logo.svg';

const Home = () => {
    return(
        <div id="page-home">
            <div className="content">
               <header>
                    <img src={logo} alt=""/>
               </header>

               <main>

                   <h1>Seu marktplace de coleta de resíduos.</h1>
                   <p>Ajudamos pessoas a encontrar cpontos de coleta de forma efeciente.</p>

                   <Link to="/create-point">
                       <span><FiLogIn /></span>
                       <strong>Cadastre um ponto de coleta</strong>
                   </Link>
               </main>
            </div>
        </div>
    )
}

export default Home;