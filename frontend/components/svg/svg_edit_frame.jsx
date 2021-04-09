import React, {useState} from 'react';
import SVGDraggable from './svg_draggable'

const SVGControlPoint = function({svgDOM, type, x, y, transform, onDrag}){

  return (
    <SVGDraggable svgDOM={svgDOM} className={`control-point ${type}`}
      transform={transform}
      onDrag={onDrag}
      onDragEnd={onDrag}
    >
      { type === 'rotation' ?
        <circle cx="0" cy="0" r="4"/> :
        <rect x={-4} y={-4} width={8} height={8}/>
      }
    </SVGDraggable>
  );
}

const SVGMoveControl = function({svgDOM, width, height, onDrag}){
  return (
    <SVGDraggable svgDOM={svgDOM} className='control-box move-control'
      onDrag={onDrag}
      onDragEnd={onDrag}
    >
      <rect width={width} height={height} stroke="2px"></rect>
    </SVGDraggable>
  )
}

const SVGEditFrame = function({width, height, handleMove, handleRotate, svgDOM, children}){
  const halfWidth = width / 2;
  const halfHeight = height / 2;

  const controlPoints = [
    <SVGControlPoint svgDOM={svgDOM} key={0} type="nwse-resize" transform={`translate(0 0)`}/>,
    <SVGControlPoint svgDOM={svgDOM} key={1} type="ns-resize" transform={`translate(${halfWidth} 0)`}/>,
    <SVGControlPoint svgDOM={svgDOM} key={2} type="nesw-resize" transform={`translate(${width} 0)`}/>,
    <SVGControlPoint svgDOM={svgDOM} key={3} type="ew-resize" transform={`translate(0 ${halfHeight})`}/>,
    <SVGControlPoint 
      svgDOM={svgDOM} key={4} type="rotate"
      transform={`translate(${halfWidth} -30)`}
      onDrag={(e) => handleRotate(e)}
    />,
    <SVGControlPoint svgDOM={svgDOM} key={5} type="ew-resize" transform={`translate(${width} ${halfHeight})`}/>,
    <SVGControlPoint svgDOM={svgDOM} key={6} type="nesw-resize" transform={`translate(0 ${height})`}/>,
    <SVGControlPoint svgDOM={svgDOM} key={7} type="ns-resize" transform={`translate(${halfWidth} ${height})`}/>,
    <SVGControlPoint svgDOM={svgDOM} key={8} type="nwse-resize" transform={`translate(${width} ${height})`}/>
  ];

  return (
    <g>
      <g className='svg-edit-frame'>
        <SVGMoveControl {...{svgDOM, width, height}}
          onDrag={e => handleMove(e)}
        />
        <path d={`M${halfWidth} 0 l 0 -30`}/>
        {controlPoints}
      </g>
      {children}
    </g>
  )
}

export default SVGEditFrame;