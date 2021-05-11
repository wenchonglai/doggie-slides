import React, {useEffect, useRef, useState} from 'react';
import { connect } from 'react-redux';
import MenuItemContainer from './menu_item_container'
import MenuContainer from './menu_container'

function DropdownMenu({
  className, item, active=false, data, requireClick=true, tier = 0, parentHandleBlur, 
  dispatch
}) {
  const [_active, _setActive] = useState(active);
  const [_data, _setData] = useState(data);
  const _timeout = useRef();
  
  const handleMouseOver = (e) => {
    clearTimeout(_timeout.current);
    
    _timeout.current = setTimeout(() => {
      _setActive(true);

    }, 100);
  }

  const toggleVisibility = (e) => {
    _setActive(!_active);
    
    item.children || (parentHandleBlur && parentHandleBlur(e));
  }
  
  const handleBlur = (e, value) => {
    e.preventDefault();
    e.stopPropagation();
      
    if (!e.target.contains || !e.target.contains(e.relatedTarget)){
      _setActive(false);
      parentHandleBlur && parentHandleBlur(e);
    }
    
    // parentHandleBlur && parentHandleBlur(e);
  }
  
  const handleChange = (e, value) => {
    _setData(value);
  }
  
  const getChildComponent = (item) => {
    let childComponent = null;
    let children = item.children;
    
  if (children === undefined || children === null) {
  } else if (Array.isArray(children)){
    childComponent = (
      <MenuContainer
        tier={tier + 1}
        items={children}
        requireClick={false}
        parentHandleBlur={handleBlur}
        parentData={_data}
      />
      );
  } else {
    const ChildContainerClass = connect(
      null, dispatch => ({dispatch})
    )(children);
    
    return (
      <ChildContainerClass 
      item={item}
      tier={tier + 1}
      requireClick={false}
      parentHandleBlur={handleBlur}
      parentHandleChange={handleChange}
      parentData={_data}
      />);
    }
    
    return childComponent;
  }
      
  let childComponent = getChildComponent(item);
  
  useEffect(() => {
    _setActive(active);
  }, [active]);
  
  useEffect(() => {
    _setData(data);
  }, [data]);

  return (
    <section
      className={`dropdown-menu ${item.type} ${(item.type === 'boolean' ? _data : _active) ? '' : 'hidden'} ${className}`}
      onBlur={e => requireClick ? handleBlur(e) : undefined}
      onMouseLeave={requireClick ? undefined : e => handleBlur(e)}
      tabIndex="0"
    >
      <MenuItemContainer
        className='button dropdown-button'
        item={item} 
        onClick={requireClick ? (e) => {toggleVisibility(e)} : null}
        onMouseOver={requireClick ? null : (e) => handleMouseOver(e) }
        parentHandleChange={handleChange}
        parentHandleBlur={handleBlur}
        parentData={_data}
      />

      { childComponent ? (
        <div className='dropdown-body'>
            {getChildComponent(item)} 
          </div>
        ) : null
      }
    </section>
  );
}

const DropdownMenuContainer = connect(
  (state, {item}) => ({
    data: item && item.key && (
      (item.key instanceof Function) ?
        (item.key)(state) : 
        state.ui.selections[item.key]
    )
  }), 
  dispatch => ({dispatch})
)(DropdownMenu);

export default function Menu({className = "", items, tier = 0, requireClick=true, nextMenuAction, parentHandleBlur}){
  return (
    <ul className={`menu tier-${tier} ${className}`}>
      { items.map((item, i) => 
          ( item ? ( 
              <div key={item.name}>
                <DropdownMenuContainer
                  item={item}
                  className={items.className || ""}
                  active={nextMenuAction === item.name}
                  parentHandleBlur={parentHandleBlur}
                />
              </div>
            ) : <hr className='separator' key={i}/>
          )
        )
      }
    </ul>
  )
}