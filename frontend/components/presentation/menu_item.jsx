import React from 'react';
import * as ItemThunkActions from '../../actions/item_thunk_actions';
import MenuIcon from '../utils/menu_icon';

export default function MenuItem({
  className="", item, dispatch, onClick, onMouseMove,
  parentData, parentHandleChange
}){

  function handleClick(e){
    console.log(handleClick);
    if (typeof item.actionName == 'string'){
      item.children || dispatch(ItemThunkActions[item.actionName](
        item.type === 'boolean' ? 
          (parentData !== item.trueValue ? item.trueValue : undefined) :
          item.value
      ));
    }

    onClick(e);

    parentHandleChange && parentHandleChange(e);  
  }
 

  return (
    <div 
      className={`menu-item ${className} ${item.type || ''} ${item.actionName ? '' : 'no-action'}`}
      onMouseMove={onMouseMove}
      onClick={handleClick}
    >
      <div className='icon-box'>
        <MenuIcon className='menu-item-icon' icon={item.icon}/>
        <div className='color-box' style={{
          backgroundColor: parentData || ''
        }}/>
      </div>
      <div className='menu-item-name'>{item.name}</div>
      {(item.children ? 
          <div className='submenu-indicator' />
          : null
      )}
    </div>
  );
}