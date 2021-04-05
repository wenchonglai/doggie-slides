import React, { useState } from 'react';
import {Link} from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DoggieLogo from '../utils/doggie_logo';
import ProductIcon from '../utils/product_icon';

const BODYTEXT = {
  'docs': 'With Google Docs, you can write, edit, and collaborate wherever you are. For Free.',
  'sheets': 'With Google Sheets, you can create, edit, and collaborate wherever you are. For free.',
  'slides': 'With Google Slides, you can create, edit, collaborate, and present wherever you are. For free.',
  'forms': 'Collect and organize information big and small with Google Forms. For free.'
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
          <a className='nav-anchor' href="https://www.google.com/slides/about/">For Real</a>
        </li>
        <li>
          <a className='nav-anchor' href="https://github.com/wenchonglai/doggie-slides">Help</a>
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
      <h1>Thicc {productName[0].toUpperCase() + productName.substring(1,productName.length - 1).toLowerCase()}, So Beautiful, wow~</h1>
      <div className='headline-items'>
        { productName === 'slides' ?
          ( <HeadLineItem title="Clone" iconUrl="/assets/icons.png" iconIndex={3}>
              <p>
                The splash page CSS took me the whole night. Please extend the deadline T_T
              </p>
              <Link className='splash button-anchor' to={`/presentation/`} >Go to DoggIe Slides</Link>
            </HeadLineItem>
          ) : null
        }
        <HeadLineItem title="Real" iconUrl="/assets/icons.png" iconIndex={5}>
          <p>{googleProductBodyText}</p>
          <a className='splash button-anchor' href="https://www.google.com/slides/about/">The Real Google Slides</a>
        </HeadLineItem>
      </div>
    </div>
  )
}

export default function SplashPage(props){
  const productName = props.match.params.productName;
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