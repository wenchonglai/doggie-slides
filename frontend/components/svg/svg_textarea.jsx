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
    let offset = text._segmentMap.get(i);
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
    blocks.push(<rect key={key} x={0} y={endOffset[1] - startOffset[2]} width={endOffset[0]} height={startOffset[2]}/>);
  }

  return (<g className={className}>
    {blocks}
  </g>)
}

export default function SVGTextArea({
  active, editMode, updateEditMode, slideObjectId,
  width, height,
  className='', defaultFont, text, styleStrings, 
  updateTextHandler, updateUITextSelection, 
  svgDOM, isPreview,
  ...props
}){

  function handleUpdate(){
    clearTimeout(_timeout.current);

    _timeout.current = setTimeout(() => {
      updateTextHandler(slideObjectId, textRef.current.toReduxState());
    }, 1000);
  }

  function keyDownListener(e){
    cancelAnimationFrame(animationFrameRef.current);

    if (!active){ return; }
    if (!editMode){ updateEditMode(true); }

    const altKey = e.altKey;
    const shiftKey = e.shiftKey;

    let updatable = false;
    let inputCache = inputCacheRef.current;

    function _removeText(minRemoveLength = 0){
      let dLen =  Math.max(
        Math.abs(cursorOffsetRef.current - selectOffsetRef.current), 
      1);

      if (inputCache > 0){
        inputCacheRef.current = inputCache.slice(0, Math.min(0, inputCache.length - dLen));
        dLen -= Math.min(dLen, inputCache.length);
      } 

      let [leftOffset, rightOffset] = [cursorOffsetRef.current, selectOffsetRef.current]
        .sort((a, b)=>a - b);

      cursorOffsetRef.current = textRef.current.remove(
        Math.min(
          altKey ?
            textRef.current.getSegmentStartOffset(leftOffset) :
            rightOffset - minRemoveLength,
          rightOffset - dLen
        ),
        rightOffset
      );

      selectOffsetRef.current = cursorOffsetRef.current
    }

    if (e.metaKey){
      if (e.key === 'a'){
        updatable = true;
        e.preventDefault();
        cursorOffsetRef.current = 0;
        selectOffsetRef.current = textRef.current.length - 1;
      }
    } else {
      updatable = true;

      e.preventDefault();

      if (e.key === 'Backspace'){
        _removeText();
          // if (cursorOffsetRef.current > 0) cursorOffsetRef.current -= 1;
      } else if (KEYCODE_MAP[e.keyCode]) {
        inputCacheRef.current += KEYCODE_MAP[e.keyCode];
      } else if (e.key.length > 1){
        switch (e.keyCode){
          case 37: { //left arrow
            updatable = false;
            cursorOffsetRef.current = Math.max(
              altKey ? 
                textRef.current.getSegmentStartOffset(cursorOffsetRef.current) :
                cursorOffsetRef.current - 1,
            0);

            if (!shiftKey) selectOffsetRef.current = cursorOffsetRef.current;
          }; break; 
          case 39: { //right arrow
            updatable = false;
            cursorOffsetRef.current = Math.min(
              altKey ? 
              textRef.current.getSegmentEndOffset(cursorOffsetRef.current) :
              cursorOffsetRef.current + 1,
            textRef.current.lastOffset - 1);

            if (!shiftKey) selectOffsetRef.current = cursorOffsetRef.current;
          }; break; 
          default: {
          }
        }

      } else {
        if (selectOffsetRef.current !== cursorOffsetRef.current){
          _removeText();
        }
        inputCacheRef.current += e.key;
      }
    }

    updatable && handleUpdate();

    animationFrameRef.current = requestAnimationFrame( () => {
      
      let inputCacheLength = inputCacheRef.current.length;

      if (inputCacheLength){
        textRef.current.insert(inputCacheRef.current, cursorOffsetRef.current);

        cursorOffsetRef.current += inputCacheLength;
        selectOffsetRef.current = cursorOffsetRef.current;
      }

      inputCacheRef.current = '';
      componentsRef.current = textRef.current.toReactComponents(width);

      updateUITextSelection({
        textboxId: slideObjectId, 
        uiTextData: textRef.current.toReduxState(),
        cursorOffset: cursorOffsetRef.current,
        selectOffset: selectOffsetRef.current
      });

      _setSelectOffset(selectOffsetRef.current);
      _setCursorOffset(cursorOffsetRef.current);
    });
  }

  function forceUpdate(){
    _forceUpdate(!_);
  }

  const [_, _forceUpdate] = useState(true);
  
  const _timeout = useRef();
  const textRef = useRef();
  const inputCacheRef = useRef('');
  const componentsRef = useRef();
  const animationFrameRef = useRef();
  const eventListenerRef = useRef();
  
  const cursorOffsetRef = useRef(0);
  const [_cursorOffset, _setCursorOffset] = useState(0); 

  const selectOffsetRef = useRef(0);
  const [_selectOffset, _setSelectOffset] = useState(0); 

  textRef.current ||= new DynamicText(text, styleStrings);

  componentsRef.current ||= textRef.current.toReactComponents(width);

  const [cursorX, cursorY, lineHeight] = (textRef.current.getPositionByOffset(_cursorOffset));

  useEffect(() => {
    textRef.current = new DynamicText(text, styleStrings);
    componentsRef.current = textRef.current.toReactComponents(width);
    forceUpdate();
    
  }, [styleStrings.map(obj => Object.entries(obj).toString()).join("|"), width]);
  
  if (!isPreview){
    useEffect(() => {
      document.removeEventListener('keydown', eventListenerRef.current);

      if (active){
        eventListenerRef.current = keyDownListener;
        document.addEventListener('keydown', eventListenerRef.current);
      }
    }, [active, editMode]);
  
    useEffect(() => {
      eventListenerRef.current = keyDownListener;
      
      return () => {
        document.removeEventListener('keydown', eventListenerRef.current);
        eventListenerRef.current = undefined;
      }
    }, []);
  }
  
  return (
    <g {...props}
      className={`svg-textarea ${className} ${editMode ? 'active' : ''}`}
      fill="none"
    > 
      <rect height={height} width={width} pointerEvents="all"></rect>
      <SVGTextAreaSelect
        className='svg-textarea-select'
        text={textRef.current}
        start={cursorOffsetRef.current}
        end={selectOffsetRef.current}
      />
      { componentsRef.current }
      <rect className="cursor"
        width="2"
        height={lineHeight}
        x={cursorX} y={cursorY - lineHeight}
      ></rect>
    </g>
  );
}