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

function getComponent({
  width, height, transform, slideObjectId, slideObjectType, 
  active, editMode, updateEditMode, svgDOM, isPreview
}){
  switch (slideObjectType){
    case 'Textbox': 
      return (
        <SVGTextAreaContainer {
          ...{width, height, slideObjectId, active, svgDOM, isPreview, editMode, updateEditMode}
        } />
      );
    case 'Image':
      return (
        <SVGImageContainer {
            ...{width, height, slideObjectId, active,}
          } 
          cropX={transform.cropX}
          cropY={transform.cropY}
        />
      );
    case 'Shape':
      return (
        <SVGShapeContainer />
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

const SVGEditFrame = function({svgDOM, width, height,
   handleRotate, handleResize, handleMove
}){
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
    <g className='svg-edit-frame'>
      <SVGMoveControl {...{svgDOM, width, height}}
        onDrag={e => handleMove(e)}
      />
      <path className='control-line' d={`M${halfWidth} 0 l 0 -30`}/>
      {controlPoints}
    </g>
  )
}

const SVGCropFrame = function({svgDOM, width, height,
   handleCropResize, handleCropMove
}){
  const halfWidth = width / 2;
  const halfHeight = height / 2;

  const controlPoints = [
    <SVGControlPoint svgDOM={svgDOM} key={0} type="nwse-resize" onDrag={e => handleCropResize(e, -1, -1)} transform={`translate(0 0)`}/>,
    <SVGControlPoint svgDOM={svgDOM} key={1} type="ns-resize" onDrag={e => handleCropResize(e, 0, -1)} transform={`translate(${halfWidth} 0)`}/>,
    <SVGControlPoint svgDOM={svgDOM} key={2} type="nesw-resize" onDrag={e => handleCropResize(e, 1, -1)} transform={`translate(${width} 0)`}/>,
    <SVGControlPoint svgDOM={svgDOM} key={3} type="ew-resize" onDrag={e => handleCropResize(e, -1, 0)} transform={`translate(0 ${halfHeight})`}/>,
    <SVGControlPoint svgDOM={svgDOM} key={5} type="ew-resize" onDrag={e => handleCropResize(e, 1, 0)} transform={`translate(${width} ${halfHeight})`}/>,
    <SVGControlPoint svgDOM={svgDOM} key={6} type="nesw-resize" onDrag={e => handleCropResize(e, -1, 1)} transform={`translate(0 ${height})`}/>,
    <SVGControlPoint svgDOM={svgDOM} key={7} type="ns-resize"  onDrag={e => handleCropResize(e, 0, 1)} transform={`translate(${halfWidth} ${height})`}/>,
    <SVGControlPoint svgDOM={svgDOM} key={8} type="nwse-resize" onDrag={e => handleCropResize(e, 1, 1)} transform={`translate(${width} ${height})`}/>
  ];

  return (
    <g className='svg-crop-frame'>
      <SVGMoveControl {...{svgDOM, width, height}}
        onDrag={e => handleCropMove(e)}
        // pointerEvents="stroke"
      />
      {controlPoints}
    </g>
  )
}

const SVGEditable = function({
  transform, handleMove, handleRotate, handleResize, svgDOM, active,
  slideObjectId, slideObjectType, isPreview, editMode, updateEditMode,
  handleCropResize, handleCropMove
}){
  const svgMoveControl = (
    <SVGMoveControl className='control-background' 
      svgDOM={svgDOM}
      width={transform.cropWidth}
      height={transform.cropHeight}
      onDoubleClick={e => updateEditMode(true)}
      onDrag={e => {
        handleMove(e);
        if (e.type === 'mouseup' && e.dx && e.dy)
          updateEditMode(false);
      }}
    />
  );
  
  useEffect(() => {
    if (!active && !isPreview) {
      updateEditMode(false);
    }
  }, [active]);

  const clipId = `${slideObjectType}-${slideObjectId}-clip${isPreview ? '-preview' : ''}`;
  const component = getComponent({
    clipId, 
    transform: transform,
    width: transform.width, height: transform.height, 
    slideObjectId, slideObjectType, active, editMode, updateEditMode,
    svgDOM, isPreview
  });

  return ( isPreview ? 
    ( <g>
        {/* <g clipPath={`url(#${clipId})`}>
          <clipPath id={clipId}>
            <rect width={transform.cropWidth} height={transform.cropHeight} />
          </clipPath>  */}
          {component}
        {/* </g> */}
      </g>
    ) : (
      <g className={`edit-frame ${active ? 'active' : ''}`}>
        <clipPath id={clipId}>
          <rect width={transform.cropWidth} height={transform.cropHeight} />
        </clipPath>
        <g clipPath={(editMode || slideObjectType === 'Textbox') ? null : `url(#${clipId})`}>
          {component}
        </g>

        {svgMoveControl}

        { active ? (
            editMode && slideObjectType !== 'Textbox' ? 
            <SVGCropFrame {...{svgDOM, handleCropResize, handleCropMove}}
              width={transform.cropWidth} height={transform.cropHeight}
            /> :
            <SVGEditFrame {...{svgDOM, handleRotate, handleResize, handleMove}}
              width={transform.cropWidth} height={transform.cropHeight} 
            />
          ): null 
        }
      </g>
    )
  )
}

export default SVGEditable;