import React from 'react';
import DropdownMenu from '../utils/dropdown_menu';
import MenuItemContainer from './menu_item_container'

export default function Menu({className = "", items, tier = 0, requireClick=true}){
  function getChildComponent(item){
    let childComponent = null;
    let children = item.children;
  
    if (children === undefined || children === null) {
    } else if (Array.isArray(children)){
      childComponent = <Menu
                        tier={tier + 1}
                        items={children}
                        requireClick={false}
                      />;
    } else {
      let ChildClass = children;
      childComponent = <ChildClass />

    }

    return childComponent;
  }

  return (
    <ul className={`menu tier-${tier} ${className}`}>
      { items.map((item, i) => 
          ( item ? ( <li key={item.name}>
                <DropdownMenu
                  className={items.className || ""}
                >
                  <MenuItemContainer item={item}/>
                  {getChildComponent(item)}
                </DropdownMenu>
              </li>
            ) : <hr className='separator' key={i}/>
          )
        )
      }
    </ul>
  )
}