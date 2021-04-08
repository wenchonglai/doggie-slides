import React, { useEffect } from 'react'
import '../../utils/data-structure/dynamic-text'
import DynamicText from '../../utils/data-structure/dynamic-text';

const KEYCODE_MAP = {
  9: '\t',  //tab
  13: '\n',  //return
};

export default function SVGTextArea({className, defaultFont, value, textStyles, ...props}){
  function handleKeyDown(e){
    if (e.metaKey){
      
    } else {
      const altKey = e.altKey;
      let inputCache = inputCacheRef.current;

      e.preventDefault();

      if (e.key === 'Backspace'){
        if (inputCache > 0){
          inputCacheRef.current = inputCache.slice(0, inputCache.length - 1);
        } else {
          cursorPositionRef.current = textRef.current.remove(
            altKey ?
              textRef.current.getSegmentStartIndex(cursorPositionRef.current) :
              cursorPositionRef.current - 1,
            cursorPositionRef.current
          );
          // if (cursorPositionRef.current > 0) cursorPositionRef.current -= 1;
        }
      } else if (KEYCODE_MAP[e.keyCode]) {
        inputCacheRef.current += KEYCODE_MAP[e.keyCode];
      } else if (e.key.length > 1){

        switch (e.keyCode){
          case 37: { //left arrow
            cursorPositionRef.current = Math.max(
              altKey ? 
                textRef.current.getSegmentStartIndex(cursorPositionRef.current) :
                cursorPositionRef.current - 1,
            0);
          }; break; 
          case 39: { //right arrow
            cursorPositionRef.current = Math.min(
              altKey ? 
                textRef.current.getSegmentEndIndex(cursorPositionRef.current) :
                cursorPositionRef.current + 1,
            textRef.current.lastOffset - 1)
          }; break; 
          default: {console.log(e.keyCode);}
        }

      } else {
        inputCacheRef.current += e.key;
      }

      requestAnimationFrame( () => {
        textRef.current.insert(inputCacheRef.current, cursorPositionRef.current);
        cursorPositionRef.current += inputCacheRef.current.length;
        inputCacheRef.current = '';
        componentsRef.current = textRef.current.toReactComponents();

        setCursorPosition(cursorPositionRef.current);
      });
    }
  }

  function handleClick(e){
  }

  function forceUpdate(){
    _forceUpdate(!_);
  }

  const [_, _forceUpdate] = React.useState(true);
  
  const textRef = React.useRef();
  const inputCacheRef = React.useRef('');
  const componentsRef = React.useRef();
  
  const cursorPositionRef = React.useRef(0);
  const [cursorPosition, setCursorPosition] = React.useState(0); 

  textRef.current ||= new DynamicText(value);
  componentsRef.current ||= textRef.current.toReactComponents();

  const [cursorX, cursorY] = (textRef.current.getOffsetByIndex(cursorPosition));

  useEffect(() => {
    textRef.current = new DynamicText(value);
    componentsRef.current = textRef.current.toReactComponents();

    forceUpdate();
  }, [value])

  return (
    <g 
      {...props}
      className={`svg-textarea ${className}`}
      onKeyDown={(e) => handleKeyDown(e)}
      onClick={(e) => handleClick(e)}
    >
      <a xlinkHref="#" onClick={e => {e.preventDefault()}} width="100%" height="100%">
        <rect 
          height={Math.max(textRef.current._offsetMap.last[1] + 60, 60)}
          width='800' fill="#ddd"
        ></rect>
        { componentsRef.current }
      </a>
      <rect className="cursor"
        width="2"
        height="60"
        x={cursorX} y={cursorY - 60}
        fill="#777"
      ></rect>
    </g>
  );
}