import React from 'react';
import MenuIcon from './menu_icon';

export default function ColorIcon({className, color, icon=[-1, -1]}){
  return (
      <div 
        className={`color-menu-icon ${className}`}
        style={{
          backgroundPositionX: -icon[0] * 18,
          backgroundPositionY: -icon[1] * 18
        }}
      >   
        <MenuIcon icon={icon}/>
        <div className='color-bar' style={{color}}>a</div>
      </div>
  )
}