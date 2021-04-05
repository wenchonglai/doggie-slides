import React from 'react';
import DropdownMenu from '../utils/dropdown_menu';

const MenuIcon = function({className, icon=[-1, -1]}){
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

const MenuItem = function({item}){
  return (
    <div className='menu-item'>
      <MenuIcon className='menu-item-icon' icon={item.icon}/>
      <div className='menu-item-name'>{item.name}</div>
      {(item.children ? 
          <div className='submenu-indicator' />
          : null
      )}
    </div>
  );
}

export default function Menu({className = "", items, tier = 0, requireClick=true}){
  return (
    <ul className={`menu tier-${tier} ${className}`}>
      { items.map((item, i) => 
          ( item ? ( <li key={item.name}>
                <DropdownMenu
                  className={items.className || ""}
                  requireClick={requireClick}
                >
                  <MenuItem item={item}/>
                  { item.children ?
                    <Menu
                      tier={tier + 1}
                      items={item.children}
                      requireClick={false}
                    /> : null
                  }
                </DropdownMenu>
              </li>
            ) : <hr className='separator' key={i}/>
          )
        )
      }
    </ul>
  )
}