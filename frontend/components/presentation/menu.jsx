import React from 'react';
import { connect } from 'react-redux';
import DropdownMenu from '../utils/dropdown_menu';
import * as ItemThunkActions from '../../actions/item_thunk_actions'

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

const MenuItem = function({item, dispatch}){
  const clickAttribute = {}

  if (typeof item.actionName == 'string'){
    clickAttribute.onClick = (e) => {
      console.log(e);
      console.log(item.actionName);
      dispatch(ItemThunkActions[item.actionName]())
    };
  }

  return (
    <div 
      className={`menu-item ${item.actionName ? '' : 'no-action'}`}
      {...clickAttribute}
    >
      <MenuIcon className='menu-item-icon' icon={item.icon}/>
      <div className='menu-item-name'>{item.name}</div>
      {(item.children ? 
          <div className='submenu-indicator' />
          : null
      )}
    </div>
  );
}

const MenuItemContainer = connect(
  state => ({
    state
  }),
  dispatch => ({
    dispatch
  })
)(MenuItem)

export default function Menu({className = "", items, tier = 0, requireClick=true}){
  return (
    <ul className={`menu tier-${tier} ${className}`}>
      { items.map((item, i) => 
          ( item ? ( <li key={item.name}>
                <DropdownMenu
                  className={items.className || ""}
                >
                  <MenuItemContainer item={item}/>
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