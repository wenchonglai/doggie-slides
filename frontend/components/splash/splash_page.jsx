import React, { useState } from 'react';
import {Link} from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DoggieLogo from '../utils/doggie_logo';
import ProductIcon from '../utils/product_icon';

const BODYTEXT = {
  'Docs': 'With Google Docs, you can write, edit, and collaborate wherever you are. For Free.',
  'Sheets': 'With Google Sheets, you can create, edit, and collaborate wherever you are. For free.',
  'Slides': 'With Google Slides, you can create, edit, collaborate, and present wherever you are. For free.',
  'Forms': 'Collect and organize information big and small with Google Forms. For free.'
}

function NavLink({keyword, iconIndex}){
  return (
    <Link className='nav-link' to={`/${keyword}/about`}>
      
      <ProductIcon iconIndex={iconIndex}/>
      {keyword[0].toUpperCase() + keyword.substring(1)}
    </Link>
  )
}

function SplashNavBar(){
  const [isHidden, setIsHidden] = useState(true);

  function toggleMenu(){ setIsHidden(!isHidden); }
  
  return (
    <nav className={isHidden ? 'hidden' : ''}>
      <div className="nav-toggle-wrapper" >
        <button className="nav-toggle-wrap" onClick={() => toggleMenu()}>
          { isHidden ? <FontAwesomeIcon icon='bars' /> : <FontAwesomeIcon icon='times' />
          }
        </button>
      </div>
      <ul className='splash nav-main'>
        {
          ['docs', 'sheets', 'slides', 'forms'].map((key, i) => (
            <li key={key}>
              <NavLink keyword={key} iconIndex={i + 1}/>
            </li>
          ))
        }
      </ul>
      <ul className='splash nav-tertiary'>
        <li>
          <a className='nav-anchor' target="_blank" href="https://www.google.com/slides/about/">For Real</a>
        </li>
        <li>
          <a className='nav-anchor' target="_blank" href="https://github.com/wenchonglai/doggie-slides">Help</a>
        </li>
      </ul>
    </nav>
  );
}

function HeadLineItem({title, iconIndex, children}){
  return (
    <div className='headline-item'>
      <h2>{title}</h2>
      <ProductIcon className="hero-icon" iconIndex={iconIndex}/>
      {children}
    </div>
  );
}

function Headline({productName, googleProductBodyText}){
  return (
    <div className='one-whole'>
      <h1>Dis {productName[0].toUpperCase() + productName.substring(1,productName.length - 1).toLowerCase()}, So Beautiful, wow~</h1>
      <div className='headline-items'>
        { productName === 'Slides' ?
          ( <HeadLineItem title="Clone" iconUrl={window.productIconUrl} iconIndex={3}>
              <p>
                Dis DoggIe Slide is made by 
                <a style={{display: "inline"}} target="_blank" href="https://www.linkedin.com/in/wenchong-lai-4296424b/">
                  &nbsp;one human&nbsp;
                </a> 
                in two weeks, from scratch.
                He wishes he has more time. Blep.
              </p>
              <Link className='splash button-anchor' to={`/presentation/`} >Go to DoggIe Slides</Link>
            </HeadLineItem>
          ) : null
        }
        <HeadLineItem title="Real" iconUrl={window.productIconUrl} iconIndex={5}>
          <p>{googleProductBodyText}</p>
          <a className='splash button-anchor' target="_blank" href={`https://www.google.com/${productName.toLowerCase()}/about/`}>
            The Real Google {productName}
          </a>
        </HeadLineItem>
      </div>
    </div>
  )
}

export default function SplashPage(props){
  const productName = (s => s[0].toUpperCase() + s.substring(1))(props.match.params.productName);
  return (
    <section className='splash'>
      <header className='splash header'>
        <DoggieLogo />
        <SplashNavBar />
      </header>
      <section className='section-intro'>
        <Headline productName={productName} googleProductBodyText={BODYTEXT[productName]}/>
      </section>
    </section>
  );
}