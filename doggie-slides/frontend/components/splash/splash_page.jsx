import React from 'react';
import {Link} from 'react-router-dom';

function DoggieHeaderLogo(){
  return (<div className='splash doggie-logo'>
    <a href="http://www.jka-la.com/LAB/">
      <img src="/assets/logo-bw.svg" alt="Doggie"/>
    </a>
  </div>)
}

function NavLink({keyword, iconIndex}){
  return (
    <Link className='nav-link' to={`/${keyword}/about`}>
      <span className={`file-icon icon-${iconIndex}`}>&nbsp;</span>
      {keyword[0].toUpperCase() + keyword.substring(1)}
    </Link>
  )
}

function SplashNavBar(){
  return (
    <nav>
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

function HeadLineItem({title, iconUrl, iconIndex, children}){
  return (
    <div className='headline-item'>
      <h2>{title}</h2>
      <img className={`hero-icon icon-${iconIndex}`} src={iconUrl}/>
      {children}
    </div>
  );
}

function Headline(props){
  return (
    <div className='one-whole'>
      <h1>Thicc Slide, So Beautiful, wow</h1>
      <div className='headline-items'>
        <HeadLineItem title="Clone" iconUrl="/assets/icons.png" iconIndex={0}>
          <p>
            The splash page CSS took me the whole night. Please extend the deadline T_T
          </p>
          <Link className='splash button-anchor' to={`/presentation/`} >Go to DoggIe Slides</Link>
        </HeadLineItem>
        <HeadLineItem title="Real" iconUrl="/assets/icons.png" iconIndex={5}>
          <p>
            With Google Slides, you can create, edit, collaborate, and present wherever you are. For free.
          </p>
          <a className='splash button-anchor' href="https://www.google.com/slides/about/">The Real Google Slides</a>
        </HeadLineItem>
      </div>
    </div>
  )
}

export default function SplashPage(props){
  return (
    <section className='splash'>
      <header className='splash header'>
        <DoggieHeaderLogo />
        <SplashNavBar />
      </header>
      <section className='section-intro'>
        <Headline />
      </section>
    </section>
  );
}