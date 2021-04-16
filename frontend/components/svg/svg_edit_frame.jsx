import React, {useEffect, useState, useRef} from 'react';
import Focusable from './svg-focusable';
import SVGDraggable from './svg_draggable'
import SVGTextAreaContainer from './svg_textarea_container';
import SVGImageContainer from './svg_image_container';

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

function getComponent({clipId, width, height, slideObjectId, slideObjectType, active, svgDOM}){

  switch (slideObjectType){
    case 'Textbox': 
      return (
        <SVGTextAreaContainer {...{width, height, slideObjectId, active, svgDOM, clipPath: `url(#${clipId})`}} />
      );
    case 'Image':
      return (
        <SVGImageContainer {...{width, height, slideObjectId, active, clipPath: `url(#${clipId})`}} />
      );
  }
}

const SVGMoveControl = function({svgDOM, width, height, onDrag, editMode, ...props}){
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

const SVGEditable = function({
  width, height, handleMove, handleRotate, handleResize, svgDOM, active,
  slideObjectId, slideObjectType, isPreview
}){
  console.log(svgDOM);
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

  const [_editMode, _setEditMode] = useState(false);
  const svgMoveControl = (
    <SVGMoveControl className='control-background' {...{svgDOM, width, height}}
      onDoubleClick={e => _setEditMode(true)}
      onDrag={e => {
        handleMove(e);
        if (e.type === 'mouseup' && e.dx && e.dy)
          _setEditMode(false);
      }}
    />
  );
  
  useEffect(() => {
    if (!active) _setEditMode(false);
  }, [active]);

  const clipId = `${slideObjectType}${slideObjectId}clip`;
  const component = getComponent({clipId, width, height, slideObjectId, slideObjectType, active, svgDOM});

  return ( isPreview ? 
    ( <g>
        <clipPath id={clipId}>
          <rect width={width / 2} height={height} />
        </clipPath>
        <g clipPath={`url(#${clipId})`}>
          {component}
        </g>
      </g>
    ) : (
      <g className={`edit-frame ${active ? 'active' : ''}`}>
        <g clipPath={`url(#${clipId})`}>
          {component}
        </g>

        {_editMode || svgMoveControl}

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
  )
}

export default SVGEditable;