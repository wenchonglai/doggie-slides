import React, { useState, useEffect, useRef } from 'react'
import '../../utils/data-structure/dynamic-text'
import DynamicText from '../../utils/data-structure/dynamic-text';

const KEYCODE_MAP = {
  9: '\t',  //tab
  13: '\n',  //return
};

function SVGTextAreaSelect({className, text, start, end}){

  if (start === end) return null;

  if (start > end) return SVGTextAreaSelect({className, text, start: end, end: start})

  const blocks = [];
  let startOffset = text.getPositionByOffset(start);
  let endOffset = text.getPositionByOffset(end);
  let key = start;

  for (let i = start + 1; i <= end; i++){
    let offset = text._offsetMap.get(i);
    if (offset){
      if (offset[1] == startOffset[1]){
        blocks.push(<rect key={key} x={startOffset[0]} y={startOffset[1] - startOffset[2]} width={offset[0] - startOffset[0]} height={startOffset[2]}/>)
      } else {
        let tempOffset = text.getPositionByOffset(i - 1);
        blocks.push(<rect key={key} x={startOffset[0]} y={startOffset[1] - startOffset[2]} width={tempOffset[0] - startOffset[0]} height={startOffset[2]}/>);  
      }

      startOffset = offset;
      key = i;
    }
  }

  if (endOffset[1] == startOffset[1]){
    blocks.push(<rect key={key} x={startOffset[0]} y={startOffset[1] - startOffset[2]} width={endOffset[0] - startOffset[0]} height={startOffset[2]}/>);
  } else {
    console.log(key);
    blocks.push(<rect key={key} x={0} y={endOffset[1] - startOffset[2]} width={endOffset[0]} height={startOffset[2]}/>);
  }

  return (<g className={className}>
    {blocks}
  </g>)
}

export default function SVGTextArea({editable = true, width, textboxId, className='', defaultFont, text, styleStrings, updateTextHandler, ...props}){
  function handleUpdate(){
    clearTimeout(_timeout.current);

    _timeout.current = setTimeout(() => {
      updateTextHandler(textboxId, textRef.current.toReduxState());
    }, 1000);
  }
  
  function handleKeyDown(e){
    if (!_active){ return; }
    const altKey = e.altKey;
    const shiftKey = e.shiftKey;

    let updatable = false;
    let inputCache = inputCacheRef.current;

    function _removeText(minRemoveLength = 0){
      let dLen =  Math.max(
        Math.abs(cursorPositionRef.current - selectPositionRef.current), 
      1);

      if (inputCache > 0){
        inputCacheRef.current = inputCache.slice(0, Math.min(0, inputCache.length - dLen));
        dLen -= Math.min(dLen, inputCache.length);
      } 

      let [leftOffset, rightOffset] = [cursorPositionRef.current, selectPositionRef.current]
        .sort((a, b)=>a - b);

      cursorPositionRef.current = textRef.current.remove(
        Math.min(
          altKey ?
            textRef.current.getSegmentStartOffset(leftOffset) :
            rightOffset - minRemoveLength,
          rightOffset - dLen
        ),
        rightOffset
      );

      selectPositionRef.current = cursorPositionRef.current
    }

    if (e.metaKey){
      if (e.key === 'a'){
        updatable = true;
        e.preventDefault();
        cursorPositionRef.current = 0;
        selectPositionRef.current = textRef.current.length - 1;
      }
    } else {
      updatable = true;

      e.preventDefault();

      if (e.key === 'Backspace'){
        _removeText(1);
          // if (cursorPositionRef.current > 0) cursorPositionRef.current -= 1;
      } else if (KEYCODE_MAP[e.keyCode]) {
        inputCacheRef.current += KEYCODE_MAP[e.keyCode];
      } else if (e.key.length > 1){

        switch (e.keyCode){
          case 37: { //left arrow
            updatable = false;
            cursorPositionRef.current = Math.max(
              altKey ? 
                textRef.current.getSegmentStartOffset(cursorPositionRef.current) :
                cursorPositionRef.current - 1,
            0);

            if (!shiftKey) selectPositionRef.current = cursorPositionRef.current;
          }; break; 
          case 39: { //right arrow
            updatable = false;
            cursorPositionRef.current = Math.min(
              altKey ? 
              textRef.current.getSegmentEndOffset(cursorPositionRef.current) :
              cursorPositionRef.current + 1,
            textRef.current.lastOffset - 1);

            if (!shiftKey) selectPositionRef.current = cursorPositionRef.current;
          }; break; 
          default: {
            // console.log(e.keyCode);
          }
        }

      } else {
        if (selectPositionRef.current !== cursorPositionRef.current){
          _removeText();
        }
        inputCacheRef.current += e.key;
      }
    }

    updatable && handleUpdate();

    requestAnimationFrame( () => {
      textRef.current.insert(inputCacheRef.current, cursorPositionRef.current);
      cursorPositionRef.current += inputCacheRef.current.length;
      if (inputCacheRef.current.length) 
        selectPositionRef.current = cursorPositionRef.current;

      inputCacheRef.current = '';
      componentsRef.current = textRef.current.toReactComponents(width);

      _setSelectPosition(selectPositionRef.current);
      _setCursorPosition(cursorPositionRef.current);
    });
  }

  function clickHandler(e){
    e.preventDefault();
    _setActive(editable);
    // console.log(e.nativeEvent.offsetX, e.nativeEvent.offsetY, textRef.current._offsetMap);
  }

  function blurHandler(e){
    e.preventDefault();
    clearTimeout(_timeout.current);

    _timeout.current = setTimeout(() => {
      updateTextHandler(textboxId, textRef.current.toReduxState());
    }, 100);
    
    _setActive(false);
  }

  function forceUpdate(){
    _forceUpdate(!_);
  }

  const [_, _forceUpdate] = useState(true);
  const [_active, _setActive] = useState(false);
  
  const _timeout = useRef();
  const textRef = useRef();
  const inputCacheRef = useRef('');
  const componentsRef = useRef();
  
  const cursorPositionRef = useRef(0);
  const [_cursorPosition, _setCursorPosition] = useState(0); 

  const selectPositionRef = useRef(0);
  const [_selectPosition, _setSelectPosition] = useState(0); 

  textRef.current ||= new DynamicText(text, styleStrings);
  componentsRef.current ||= textRef.current.toReactComponents(width);

  const [cursorX, cursorY, lineHeight] = (textRef.current.getPositionByOffset(_cursorPosition));

  useEffect(() => {
    textRef.current = new DynamicText(text, styleStrings);
    componentsRef.current = textRef.current.toReactComponents(width);

    forceUpdate();
  }, [text, styleStrings])

  const actualHeight = Math.max(textRef.current._offsetMap.last[1] + 60, 60);

  return (
    <g 
      {...props}
      className={`svg-textarea ${className} ${_active ? 'active' : ''}`}
      onKeyDown={(e) => handleKeyDown(e)}
      fill="none"
    > 
      <a xlinkHref="#" 
        onClick={e => clickHandler(e)}
        onBlur={e => blurHandler(e)}
        height={actualHeight}
        width={width}
      >
        {/* <rect height={actualHeight} width={width} ></rect> */}
        <SVGTextAreaSelect
          className='svg-textarea-select'
          text={textRef.current}
          start={cursorPositionRef.current}
          end={selectPositionRef.current}
        />
        { componentsRef.current }
      </a>
      <rect className="cursor"
        width="2"
        height={lineHeight}
        x={cursorX} y={cursorY - lineHeight}
      ></rect>
    </g>
  );
}