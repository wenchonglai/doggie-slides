import React, {useEffect, useState, useRef} from 'react';
import Focusable from './svg-focusable';
import SVGDraggable from './svg_draggable'

const SVGControlPoint = function({svgDOM, type, x, y, transform, onDrag}){

  return (
    <SVGDraggable svgDOM={svgDOM} className={`control-point ${type}`}
      transform={transform}
      onDrag={onDrag}
      onDragEnd={onDrag}
    >
      { type === 'rotate' ?
        <circle cx="0" cy="0" r="4"/> :
        <rect x={-4} y={-4} width={8} height={8}/>
      }
    </SVGDraggable>
  );
}

const SVGMoveControl = function({svgDOM, width, height, onDrag, ...props}){
  return (
    <SVGDraggable svgDOM={svgDOM} className='control-box move-control'
      onDrag={onDrag}
      onDragEnd={onDrag}
      {...props}
    >
      <rect width={width} height={height} stroke="2px"></rect>
    </SVGDraggable>
  )
}

const SVGEditFrame = function({width, height, handleMove, handleRotate, handleResize, svgDOM, children, active, scale}){
  const halfWidth = width / 2;
  const halfHeight = height / 2;

  const controlPoints = [
    <SVGControlPoint svgDOM={svgDOM} key={0} type="nwse-resize" onDrag={e => handleResize(e, -1, -1)} transform={`translate(0 0)`}/>,
    <SVGControlPoint svgDOM={svgDOM} key={1} type="ns-resize" onDrag={e => handleResize(e, 0, -1)} transform={`translate(${halfWidth} 0)`}/>,
    <SVGControlPoint svgDOM={svgDOM} key={2} type="nesw-resize" onDrag={e => handleResize(e, 1, -1)} transform={`translate(${width} 0)`}/>,
    <SVGControlPoint svgDOM={svgDOM} key={3} type="ew-resize" onDrag={e => handleResize(e, -1, 0)} transform={`translate(0 ${halfHeight})`}/>,
    <SVGControlPoint 
      svgDOM={svgDOM} key={4} type="rotate"
      transform={`translate(${halfWidth} -30)`}
      onDrag={(e) => handleRotate(e)}
    />,
    <SVGControlPoint svgDOM={svgDOM} key={5} type="ew-resize" onDrag={e => handleResize(e, 1, 0)} transform={`translate(${width} ${halfHeight})`}/>,
    <SVGControlPoint svgDOM={svgDOM} key={6} type="nesw-resize" onDrag={e => handleResize(e, -1, 1)} transform={`translate(0 ${height})`}/>,
    <SVGControlPoint svgDOM={svgDOM} key={7} type="ns-resize"  onDrag={e => handleResize(e, 0, 1)} transform={`translate(${halfWidth} ${height})`}/>,
    <SVGControlPoint svgDOM={svgDOM} key={8} type="nwse-resize" onDrag={e => handleResize(e, 1, 1)} transform={`translate(${width} ${height})`}/>
  ];

  return (
    <g className={`edit-frame ${active ? 'active' : ''}`}>
      <SVGMoveControl className='control-background' {...{svgDOM, width, height}}
        onDrag={e => handleMove(e)}
      />
      {children}
      { active ? (
          <g className='svg-edit-frame'>
            <SVGMoveControl {...{svgDOM, width, height}}
              onDrag={e => handleMove(e)}
              // pointerEvents="stroke"
            />
            <path className='control-line' d={`M${halfWidth} 0 l 0 -30`}/>
            {controlPoints}
          </g>
        ) : null
      }
    </g>
  )
}

export default SVGEditFrame;