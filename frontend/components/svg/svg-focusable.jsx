import React, {useState, useRef} from 'react';

export default function Focusable({onBlur, onFocus, children}){
  return (
    <a xlinkHref="#" onClick={e => e.preventDefault()} onMouseDown={onFocus} onBlur={onBlur}>
      {children}
    </a>
  )
}