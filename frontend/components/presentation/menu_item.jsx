import React from 'react';
import * as ItemThunkActions from '../../actions/item_thunk_actions';
import MenuIcon from '../utils/menu_icon';

export default function MenuItem({className="", item, dispatch, onClick, onMouseMove}){

  function handleClick(e){

    if (typeof item.actionName == 'string'){
      dispatch(ItemThunkActions[item.actionName]());
    }

    onClick(e);
  }
 

  return (
    <div 
      className={`menu-item ${className} ${item.actionName ? '' : 'no-action'}`}
      onMouseMove={onMouseMove}
      onClick={handleClick}
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