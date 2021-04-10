import React from 'react';
import * as ItemThunkActions from '../../actions/item_thunk_actions';
import MenuIcon from '../utils/menu_icon';

export default function MenuItem({item, dispatch}){
  const clickAttribute = {}

  if (typeof item.actionName == 'string'){
    clickAttribute.onClick = (e) => {
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