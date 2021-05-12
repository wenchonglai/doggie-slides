import React from 'react';

export default function MenuIcon({className='', icon=[-1, -1]}){
  return (
    <div 
      className={`menu-icon ${className}`}
      style={{
        backgroundPositionX: -icon[0] * 18,
        backgroundPositionY: -icon[1] * 18
      }}
    > 
    </div>
  )
}