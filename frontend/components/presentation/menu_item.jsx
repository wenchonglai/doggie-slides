import React from 'react';
import * as ItemThunkActions from '../../actions/item_thunk_actions';
import MenuIcon from '../utils/menu_icon';

function filterInput(value, {min = 1, max = 100} = {}){
  if (Number.isNaN(Number(value))){
    return undefined;
  } else {
    return Math.max(Math.min(value, max), min);
  }
}

function ImageUpload({item, handleChange}){
  const handleSubmit = (e) => {
    const reader = new FileReader();
    const formData = new FormData(e.currentTarget);
    const file = formData.get("image[file]");

    reader.onloadend = (e) => {

      handleChange(e, formData);
    }

    
    if (file)
      reader.readAsDataURL(file);
  }
  return (
    <form onChange={e => handleSubmit(e)}>
      <label onClick={e => {e.stopPropagation()}}> 
        <MenuIcon className='menu-item-icon' icon={item.icon}/>
        {item.name}
        <input style={
          {opacity: 0, zIndex: -1, position: "absolute"}}
          type="file" name="image[file]" accept="image/*"
        />
      </label>
    </form>
  );
}

export default function MenuItem({
  className="", item, dispatch, onClick, onMouseMove,
  parentData, parentHandleChange, parentHandleBlur
}){

  const handleBlur = e => {
    const currentTarget = e.nativeEvent.path[3];
    let htmlElement = e.relatedTarget;

    while (htmlElement){
      if (htmlElement === currentTarget){
        e.preventDefault(); e.stopPropagation();
        return;
      }
      htmlElement = htmlElement.parentNode;
    }

    parentHandleBlur && parentHandleBlur(e);
  };

  function handleChange(e, value = undefined){
    let func;

    value ||= e.target.value;
    
    switch (typeof item.actionName){
      case 'string': func = ItemThunkActions[item.actionName]; break;
      default: func = item.actionName; break;
    }

    switch (item.type){
      case 'boolean': value = (parentData !== item.trueValue ? item.trueValue : undefined); break;
      default: value = value === undefined ? item.value : value; break;
    }
    
    if (!item.children){
      dispatch(func(value) );
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
          onKeyDownCapture={(e) => {
            e.stopPropagation();
            if (e.key === 'Enter'){
              let value = filterInput(parentData.replace('px', ''));
              if (value){
                dispatch(ItemThunkActions[item.actionName](value + 'px'));
                handleBlur(e);
              }
            }
          }}
          onChange={(e) => {
            e.stopPropagation();
            parentHandleChange && 
              parentHandleChange(e,
                (e.currentTarget.value + 'px') || parentData
              );
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
      onClick={handleChange}
    >
      { item.type === 'image-upload' ? 
        <ImageUpload item={item} handleChange={handleChange}/> :
        ( <>
            <div className='icon-box'>
              {getMenuIcon(item.type)}
              <div className='color-box' style={{backgroundColor: parentData || ''}}/>
            </div>
            <div className='menu-item-name' {...style}>
              {item.name}
            </div>
          </>
        )
      }
      {(item.children ? 
          <div className='submenu-indicator' />
          : null
      )}
    </div>
  );
}