import React from 'react';
import * as ItemThunkActions from '../../actions/item_thunk_actions';
import MenuIcon from '../utils/menu_icon';

const handleBlur = e => {
  const currentTarget = e.nativeEvent.path[3];
  let htmlElement = e.relatedTarget;

  while (htmlElement){
    if (htmlElement === currentTarget){
      e.preventDefault(); e.stopPropagation();
    }
    htmlElement = htmlElement.parentNode;
  }
};

function filterInput(value, {min = 1, max = 100} = {}){
  if (Number.isNaN(Number(value))){
    return undefined;
  } else {
    return Math.max(Math.min(value, max), min);
  }
}

export default function MenuItem({
  className="", item, dispatch, onClick, onMouseMove,
  parentData, parentHandleChange
}){

  function handleClick(e, value = undefined){
    console.log(ItemThunkActions[item.actionName], value, item.value);
    if (!item.children){
      dispatch(
        ( typeof item.actionName == 'string' ? 
          ItemThunkActions[item.actionName] :
          item.actionName
        )( item.type === 'boolean' ? 
          (parentData !== item.trueValue ? item.trueValue : undefined) :
          value === undefined ? item.value : value
        )
      );
    }

    onClick(e);
    parentHandleChange && parentHandleChange(e, value === undefined ? item.value : value);
  }

  function getMenuIcon(type){
    switch (type){
      case 'font': return (
        <div>{
          parentData && parentData.length > 12 ? 
            (parentData.substring(0, 10) + '...') :
            parentData
        }</div>);
      case 'input': return (
        <input type="text" 
          onBlur={handleBlur}
          onChange={(e) => {
            parentHandleChange && 
              parentHandleChange(e,
                (e.currentTarget.value + 'px') || parentData
              );
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter'){
              let value = filterInput(parentData.replace('px', ''));
              if (value)
                dispatch(ItemThunkActions[item.actionName](value + 'px'));
            }
          }}
          value={parentData ? parentData.replace('px', '') : ''}
        />
      )
      default: return (<MenuIcon className='menu-item-icon' icon={item.icon}/>);
    }
  }

  let style = item.type === 'font-item' ? {style: {fontFamily: item.value}} : {};

  return (
    <div 
      className={
        `menu-item ${className} ${item.type || ''} ${item.actionName ? '' : 'no-action'}`
      }
      onMouseMove={onMouseMove}
      onClick={handleClick}
    >
      <div className='icon-box'>
        {getMenuIcon(item.type)}
        <div className='color-box' style={{backgroundColor: parentData || ''}}/>
      </div>
      <div className='menu-item-name' {...style}>
        {item.name}
      </div>
      {(item.children ? 
          <div className='submenu-indicator' />
          : null
      )}
    </div>
  );
}