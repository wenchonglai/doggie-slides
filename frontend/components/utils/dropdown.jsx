import React, { useEffect, useRef, useState } from 'react';

export default function Dropdown({className, children, active=false, requireClick=true, nextMenuAction, name}) {
  const [_active, _setActive] = useState(active);
  const _timeout = useRef();
  const hasChild = !!children[1];
  
  const handleMouseOver = (e) => {
    clearTimeout(_timeout.current);

    _timeout.current = setTimeout(() => {
      _setActive(true);
    }, 100);
  }

  const handleMouseDown = (e) => {
    e.preventDefault();
  }

  const toggleVisibility = () => {
    _setActive(!_active);
  }

  const handleBlur = (e) => {
    clearTimeout(_timeout.current);
    e.preventDefault();
    _setActive(false);
  }

  useEffect(() => {

  }, [active])

  return (
    <section
      className={`dropdown ${_active && hasChild ? '' : 'hidden'} ${className}`}
      onBlur={e => handleBlur(e)}
      onMouseLeave={requireClick ? undefined : e => handleBlur(e)}
      tabIndex="0"
    >
      <div
        className='button dropdown-button'
        onClick={requireClick ? () => toggleVisibility() : null}
        onMouseOver={requireClick ? null : () => handleMouseOver() }
      >
        {children[0]}
      </div>
      { children[1] && /*&& active ?*/ (
          <div
            className='dropdown-body'
            onMouseDown={e => handleMouseDown(e)}
          >
            {children.slice(1)}
          </div>
        ) //: null
      }
    </section>
  );
}