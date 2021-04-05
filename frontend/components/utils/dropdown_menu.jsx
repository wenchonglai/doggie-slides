import React, { useRef, useState } from 'react';

export default function DropdownMenu({className, children, requireClick=true}) {
  const [visible, setVisible] = useState(false);
  const _timeout = useRef();
  
  const handleMouseOver = (e) => {
    clearTimeout(_timeout.current);

    _timeout.current = setTimeout(() => {
      setVisible(true);
    }, 100);
  }

  const handleMouseDown = (e) => {
    e.preventDefault();
  }

  const toggleVisibility = () => {
    setVisible(!visible);
  }

  const handleBlur = (e) => {
    clearTimeout(_timeout.current);
    e.preventDefault();
    setVisible(false);
  }
  return (
    <section
      className={`dropdown-menu ${visible ? '' : 'hidden'} ${className}`}
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
      { children[1] && /*&& visible ?*/ (
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