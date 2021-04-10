import React, {useState, useEffect, useRef} from 'react';

import SVGTextAreaContainer from './svg_textarea_container';
import SVGEditFrame from './svg_edit_frame'

function throttle(e, timeoutRef, func, ...args){
  switch (e.type){
    case 'mouseup': {
      timeoutRef.current = setTimeout(
        () => func(...args),
        500
      );
    }; break;
    default: {
      clearTimeout(timeoutRef.current)
    }
  }
}

export default function SVGWrapper({
  wrapper, editable, svgDOM, pageWidth, pageHeight,
  updateWrapperHandler, updateWrapperSelection, deleteWrapperSelection,
  ...props
}){
  const {
    slideObjectId, slideObjectType,
    translateX=0, translateY=0, rotate=0, width = 300, height = 200,
    fill="none", stroke="none", strokeWidth="0", strokeDasharray=""
  } = wrapper;
  const [_size, _setSize] = useState({width, height});
  const [_translate, _setTranslate] = useState({x: translateX, y: translateY});
  const [_rotate, _setRotate] = useState(rotate); 
  const blurTimeoutRef = useRef();
  const [_active, _setActive] = useState(false);
  const timeoutRef = useRef();
  function onFocus(e){
    e.stopPropagation();
    
    clearTimeout(blurTimeoutRef.current);
    svgDOM.addEventListener('mousedown', handleBlur);
    
    _setActive(true);
  }
  
  function handleBlur(e){
    // e.preventDefault();

    blurTimeoutRef.current = setTimeout(() => {
      _setActive(false);
    }, 0)
    
    svgDOM.removeEventListener('mousedown', handleBlur);
  }
  
  function handleMove(e){
    e.stopPropagation();
    const clientRect = svgDOM.children[0].children[0].children[0].getBoundingClientRect();
    const scale = pageWidth / clientRect.width;
    const {dx, dy} = e;
    const translateX = _translate.x + dx * scale;
    const translateY = _translate.y + dy * scale;
    
    _setTranslate({
      x: translateX,
      y: translateY
    });
    throttle(e, timeoutRef, updateWrapperHandler, {...wrapper, translateX, translateY, width: _size.width, height: _size.height, rotate: _rotate});
  }
  
  function handleRotate(e){
    const clientRect = svgDOM.children[0].children[0].children[0].getBoundingClientRect();
    const scale = pageWidth / clientRect.width;
    const centerX = (_size.width / 2 + _translate.x) / scale + clientRect.x;
    const centerY = (_size.height / 2 + _translate.y) / scale + clientRect.y;
    let dx = e.clientX - centerX;
    let dy = e.clientY - centerY;
    let tan = dx / dy
    
    if (Math.abs(tan) < 0.125) dx = 0;
    else if (Math.abs(tan) > 8) dy = 0;
    
    if (Math.abs(tan) > 0.8 && Math.abs(tan) < 1.25)
    dx = dy * tan / Math.abs(tan);
    
    const rotate = (Math.atan2(dx, -dy) * 180 / Math.PI) | 0;
    
    _setRotate(rotate);
    throttle(e, timeoutRef, updateWrapperHandler, {...wrapper, translateX: _translate.x, translateY: _translate.y, width: _size.width, height: _size.height, rotate});
  }
  
  function handleResize(e, horiz = 0, vert = 0){
    const clientRect = svgDOM.children[0].children[0].children[0].getBoundingClientRect();
    const scale = pageWidth / clientRect.width;
    const angle = _rotate * Math.PI / 180;
    const COS = Math.cos(angle);
    const SIN = Math.sin(angle);
    
    const {dx, dy} = e;
    let {width, height} = _size;
    let {x, y} = _translate;
    let dW = 0, dH = 0;
    
    if (horiz !== 0){
      dW += (dx * COS + dy * SIN) * scale;
      width += dW * horiz;
      
      if (width < 10){
        dW += (10 - width)* horiz
        width = 10;
      }
      
      x += dW * (COS - horiz)/ 2;
      y += dW * SIN / 2;
    } 
    
    if (vert != 0){
      dH += (-dx * SIN + dy * COS) * scale;
      height += dH * vert;
      
      if (height < 10){
        dH += (10 - height)* vert
        height = 10;
      }
      
      x -= dH * SIN / 2;
      y += dH * (COS - vert)/ 2;
    }
    
    _setSize({width, height});
    _setTranslate({x, y});
    
    throttle(e, timeoutRef, updateWrapperHandler, {...wrapper, width, height, translateX: x, translateY: y, rotate: _rotate});
  }
  
  function getComponent(){
    switch (slideObjectType){
      case 'Textbox': 
      return (
        <SVGTextAreaContainer
        editable={editable}
        textboxId={slideObjectId}
        width={_size.width} height={_size.height}
        />);
        // case 'image': return <SVGImage id={id} editable={editable}/>;
        // case 'diagram': return <SVGShape id={id} editable={editable}/>;
      }
    }
    
    const component = getComponent();

    useEffect(() => {
      return () => {
        svgDOM && svgDOM.removeEventListener('mousedown', handleBlur);
        clearTimeout(timeoutRef.current);
      }
    });
    
    useEffect(() => {
      const {translateX=0, translateY=0, rotate=0, width = 300, height = 200} = wrapper;

      _setTranslate({x: translateX, y: translateY});
      _setRotate(rotate);
      _setSize({width, height});
    }, [wrapper]);

    editable && useEffect(() => {
      _active ?
      updateWrapperSelection([wrapper.id]) :
      deleteWrapperSelection([wrapper.id])
    }, [_active])
    
    useEffect(() => {
      return () => {
        svgDOM && svgDOM.removeEventListener('mousedown', handleBlur);
        clearTimeout(timeoutRef.current);
      }
    }, [svgDOM]);

    return ( wrapper ?
    <g className='SVGWrapper'
      transform={`rotate(${_rotate}) translate(${_translate.x}, ${_translate.y})`}
      transform-origin={`${_translate.x + _size.width / 2} ${_translate.y +_size.height / 2}`}
      onMouseDown={editable && svgDOM ? onFocus : null}
    > 
      <rect 
        width={width} height={height}
        {...{fill, stroke}}
        strokeWidth={strokeWidth || stroke && 1}
        strokeDasharray={strokeDasharray && strokeDasharray.split(" ").map(x => x * strokeWidth).join(" ")}
      />
        { editable ?  
            <SVGEditFrame
              active={_active}
              {...{svgDOM, handleMove, handleRotate, handleResize}}
              width={_size.width} height={_size.height}
              
            >
              {component}
            </SVGEditFrame> : 
            component
        }
    </g> : null
  )
}