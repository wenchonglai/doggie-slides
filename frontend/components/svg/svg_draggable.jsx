import React, {useState, useRef} from 'react';

const SVGDraggable = function({className, children, svgDOM, onDragStart, onDrag, onDragEnd, ...props}){
  const dragging = useRef(false);
  const startPos = useRef({})
  const pos = useRef({})

  function handleDragStart(e){
    e.preventDefault();

    if (!dragging.current){
      dragging.current = true;
      startPos.current = {x: e.nativeEvent.clientX, y: e.nativeEvent.clientY};
      pos.current = {x: e.nativeEvent.clientX, y: e.nativeEvent.clientY};

      svgDOM.addEventListener('mousemove', handleDrag);
      svgDOM.addEventListener('mouseup', handleDragEnd);
      svgDOM.addEventListener('mouseleave', handleDragEnd);

      onDragStart && onDragStart({
        clientX: e.nativeEvent.clientX, 
        clientY: e.nativeEvent.clientY, 
        startX: startPos.current.x, startY: startPos.current.y,
        dx: 0, dy: 0
      });

      onDragEnd && onDragEnd(
        Object.assign(e.nativeEvent, {
          startX: startPos.current.x, startY: startPos.current.y,
          dx: 0, dy: 0
        })
      );
    }
  }

  function handleDrag(e){
    e.preventDefault();
    
    if (dragging.current){
      pos.current = {x: e.clientX, y: e.clientY};

      onDragEnd && onDragEnd(
        Object.assign(e, {
          startX: startPos.current.x, startY: startPos.current.y,
          dx: pos.current.x - startPos.current.x, dy: pos.current.y - startPos.current.y
        })
      );

    } else {
      console.error('memory leak!');
    }
  }

  function handleDragEnd(e){
    e.preventDefault();

    if (dragging.current){
      dragging.current = false;
      
      onDragEnd && onDragEnd(
        Object.assign(e, {
          startX: startPos.current.x, startY: startPos.current.y,
          dx: pos.current.x - startPos.current.x, dy: pos.current.y - startPos.current.y
        })
      );

      startPos.current = {};
      pos.current = {};

      svgDOM.removeEventListener('mousemove', handleDrag);
      svgDOM.removeEventListener('mouseup', handleDragEnd);
      svgDOM.removeEventListener('mouseleave', handleDragEnd);
    } else {
      console.error('memory leak!');
    }
  }

  return (
    <g  className={`draggable ${className}`} pointerEvents="all"
        onMouseDown={e => handleDragStart(e)}
        {...props}
    >
      {children}
    </g>
  );
}

export default SVGDraggable;