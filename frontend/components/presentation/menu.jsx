import React, {useRef, useState} from 'react';
import { connect } from 'react-redux';
import MenuItemContainer from './menu_item_container'
import MenuContainer from './menu_container'

function DropdownMenu({className, item, active=false, requireClick=true, tier = 0, parentHandleBlur, children}) {
  const [_active, _setActive] = useState(active);
  const _timeout = useRef();
  
  const handleMouseOver = (e) => {
    clearTimeout(_timeout.current);

    _timeout.current = setTimeout(() => {
      _setActive(true);
    }, 100);
  }

  const toggleVisibility = (e) => {
    _setActive(!_active);

    // parentHandleBlur && parentHandleBlur(e, true);
  }

  const handleBlur = (e) => {
    console.log(item.name, parentHandleBlur, e, e.target, e.relatedTarget)
    e.preventDefault();
    e.stopPropagation();

    if (!e.target.contains(e.relatedTarget)){
      clearTimeout(_timeout.current);
      _setActive(false);
      parentHandleBlur && parentHandleBlur(e);
    }

    // parentHandleBlur && parentHandleBlur(e);
  }

  const getChildComponent = (item) => {
    let childComponent = null;
    let children = item.children;
    let ChilcContainerClass;
  
    if (children === undefined || children === null) {
    } else if (Array.isArray(children)){
      childComponent = <MenuContainer
                        tier={tier + 1}
                        items={children}
                        requireClick={false}
                        parentHandleBlur={handleBlur}
                      />;
    } else {
      const ChildContainerClass = connect(
        null, 
        dispatch => ({dispatch})
      )(children);

      return (
        <ChildContainerClass 
          item={item}
          tier={tier + 1}
          requireClick={false}
          parentHandleBlur={handleBlur}
        />)
    }
    
    return childComponent;
  }

  let childComponent = getChildComponent(item);

  return (
    <section
      className={`dropdown-menu ${_active ? '' : 'hidden'} ${className}`}
      // onMouseDown={e => {console.log('down', item);  e.stopPropagation();}}
      onBlur={e => requireClick ? handleBlur(e) : undefined}
      onMouseLeave={requireClick ? undefined : e => handleBlur(e)}
      tabIndex="0"
    >
      <MenuItemContainer
        className='button dropdown-button'
        item={item} 
        
        onClick={requireClick ? (e) => {toggleVisibility(e)} : null}
        onMouseOver={requireClick ? null : () => handleMouseOver() }
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

export default function Menu({className = "", items, tier = 0, requireClick=true, nextMenuAction, parentHandleBlur}){
  const [_, _forceUpdate] = useState(false);
  const forceUpdate = function(){ _forceUpdate(!_); }

  return (
    <ul className={`menu tier-${tier} ${className}`}>
      { items.map((item, i) => 
          ( item ? ( 
              <li key={item.name}>
                <DropdownMenu
                  item={item}
                  className={items.className || ""}
                  active={nextMenuAction === item.name}
                  parentHandleBlur={parentHandleBlur}
                />
              </li>
            ) : <hr className='separator' key={i}/>
          )
        )
      }
    </ul>
  )
}