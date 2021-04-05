import React from 'react';

export default function DoggieLogo({color = "bw", url="http://www.jka-la.com/LAB/"}){
  return (<div className='splash logo doggie-logo'>
    <a href={url}>
      <img src={`/assets/logo-${color}.svg`} alt="Doggie Logo"/>
    </a>
  </div>)
}
