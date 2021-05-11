import React, {useState, useEffect, useRef} from 'react';
import { asyncUpdateDoc } from '../../utils/presentation_utils';
import SVGEditable from './svg_editable'

function throttle(e, timeoutRef, func, ...args){
  switch (e.type){
    case 'mouseup': {
      clearTimeout(timeoutRef.current)
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
  wrapperId, wrapper, isPreview, svgDOM, pageWidth, pageHeight,
  updateWrapperHandler, updateWrapperSelection, deleteWrapperSelection,
  handleContextMenu, selectedWrapperIds,
  ...props
}){
  const { 
    slideObjectId, slideObjectType,
    x = 0, y = 0, rotate = 0, width = 300, height = 200,
    cropX = 0, cropY = 0, cropWidth = 300, cropHeight = 200,
    fill = "none", stroke = "none", strokeWidth = "0", strokeDasharray = ""
  } = wrapper;

  function requestTransformAnimation(args){
    cancelAnimationFrame(animationFrameRef.current);
    animationFrameRef.current = _setTransform(args);
  }

  function onFocus(e){
    clearTimeout(blurTimeoutRef.current)
    _setActive(true);
  }
  
  function handleMove(e){
    // x, y: change;
    // width, height: contant
    // rotate: constant
    // cropX/cropY: constant
    // cropWidth/cropHeight: constant
    const clientRect = svgDOM.children[0].children[0].children[0].getBoundingClientRect();
    const screenScale = pageWidth / clientRect.width;
    const {dx, dy} = e;
    const x = _transform.x + dx * screenScale;
    const y = _transform.y + dy * screenScale;
    
    requestTransformAnimation({rotate, x, y, width, height, cropX, cropY, cropWidth, cropHeight});
    throttle(e, timeoutRef, updateWrapperHandler, {...wrapper, x, y});
  }

  function handleCropMove(e){
    // x, y: change;
    // width, height: contant
    // rotate: constant
    // cropX/cropY: constant
    // cropWidth/cropHeight: constant
    const clientRect = svgDOM.children[0].children[0].children[0].getBoundingClientRect();
    const screenScale = pageWidth / clientRect.width;
    const angle = rotate * Math.PI / 180;
    const COS = Math.cos(angle);
    const SIN = Math.sin(angle);
    const dx = e.dx * screenScale, dy = e.dy * screenScale;
    
    const cropX = _transform.cropX + dx * COS + dy * SIN;
    const cropY = _transform.cropY - dx * SIN + dy * COS;

    requestTransformAnimation({rotate, x, y, width, height, cropX, cropY, cropWidth, cropHeight});
    throttle(e, timeoutRef, updateWrapperHandler, {...wrapper, cropX, cropY});
  }

  function handleCropResize(e, horiz = 0, vert = 0){
    const clientRect = svgDOM.children[0].children[0].children[0].getBoundingClientRect();
    const screenScale = pageWidth / clientRect.width;
    const {x, y, width, height, cropX, cropY, cropWidth, cropHeight, rotate} = _transform;
    const angle = rotate * Math.PI / 180;
    const COS = Math.cos(angle);
    const SIN = Math.sin(angle);
    const dx = e.dx * screenScale, dy = e.dy * screenScale;

    const dCropWidth = horiz * (dx * COS + dy * SIN);
    const dCropHeight = vert * (dy * COS - dx * SIN);

    let cropWidth1 = cropWidth + dCropWidth;
    let cropHeight1 = cropHeight + dCropHeight;
    let cropX1 = cropX - (horiz === -1 ? dCropWidth : 0);
    let cropY1 = cropY - (vert === -1 ? dCropHeight : 0);

    let newTransform = {
      ..._transform, 
      x, y, width, height,
      cropX: cropX1, cropY: cropY1, cropWidth: cropWidth1, cropHeight: cropHeight1
    };

    requestTransformAnimation(newTransform);
    throttle(e, timeoutRef, updateWrapperHandler, {...wrapper, ...newTransform});
  }
  
  function handleRotate(e){
    // x, y: change based on rotate and cropX/cropY;
    // width, height: contant
    // rotate: change
    // cropX/cropY: constant
    // cropWidth/cropHeight: constant
    const clientRect = svgDOM.children[0].children[0].children[0].getBoundingClientRect();
    const screenScale = pageWidth / clientRect.width;
    const {x, y, width, height, cropX, cropY, cropWidth, cropHeight, rotate} = _transform;
    const angle = rotate * Math.PI / 180;
    const COS = Math.cos(angle);
    const SIN = Math.sin(angle);

    const cropCenterX = cropX + cropWidth / 2;
    const cropCenterY = cropY + cropHeight / 2;
    const centerX = x + COS * cropCenterX - SIN * cropCenterY;
    const centerY = y + COS * cropCenterY + SIN * cropCenterX;

    let dx = (e.clientX - clientRect.left) * screenScale - centerX;
    let dy = (e.clientY - clientRect.top) * screenScale - centerY;
    let tan = dx / dy
    
    if (Math.abs(tan) < 0.125) dx = 0;
    else if (Math.abs(tan) > 8) dy = 0;
    
    if (Math.abs(tan) > 0.8 && Math.abs(tan) < 1.25)
      dx = dy * tan / Math.abs(tan);
    
    const rotate1 = (Math.atan2(dx, -dy) * 180 / Math.PI) | 0;
    const angle1 = rotate1 * Math.PI / 180;
    const COS1 = Math.cos(angle1);
    const SIN1 = Math.sin(angle1);
    const x1 = x - cropCenterX * (COS1 - COS) + cropCenterY * (SIN1 - SIN);
    const y1 = y - cropCenterY * (COS1 - COS) - cropCenterX * (SIN1 - SIN);
    const newTransform = {x: x1, y: y1, rotate: rotate1, width, height, cropX, cropY, cropWidth, cropHeight}

    requestTransformAnimation(newTransform);
    throttle(e, timeoutRef, updateWrapperHandler, {...wrapper, x: x1, y: y1, rotate: rotate1});
  }
  
  function handleResize(e, horiz = 0, vert = 0){
    // x, y: change
    // width, height: change
    // rotate: constant
    // cropX/cropY: change
    // cropWidth/cropHeight: change
    const clientRect = svgDOM.children[0].children[0].children[0].getBoundingClientRect();
    const screenScale = pageWidth / clientRect.width;
    const {x, y, width, height, cropX, cropY, cropWidth, cropHeight, rotate} = _transform;
    const angle = rotate * Math.PI / 180;
    const COS = Math.cos(angle);
    const SIN = Math.sin(angle);
    const dx = e.dx * screenScale, dy = e.dy * screenScale;

    const dCropWidth = horiz * (dx * COS + dy * SIN);
    const dCropHeight = vert * (dy * COS - dx * SIN);

    let cropWidth1 = cropWidth + dCropWidth;
    let cropHeight1 = cropHeight + dCropHeight;
    let cropX1 = cropX * cropWidth1 / cropWidth;
    let cropY1 = cropY * cropHeight1 / cropHeight;
    let width1 = width * cropWidth1 / cropWidth;
    let height1 = height * cropHeight1 / cropHeight;
    let x1 = x - 
      (cropX + (horiz === -1 ? cropWidth : 0)) * (COS * dCropWidth / cropWidth) + 
      (cropY + (vert === -1 ? cropHeight : 0)) * (SIN * dCropHeight / cropHeight)

    let y1 = y - 
      (cropX + (horiz === -1 ? cropWidth : 0)) * (SIN * dCropWidth / cropWidth) -
      (cropY + (vert === -1 ? cropHeight : 0)) * (COS * dCropHeight / cropHeight); 

    let newTransform = {
      ..._transform, 
      x: x1, y: y1, width: width1, height: height1,
      cropX: cropX1, cropY: cropY1, cropWidth: cropWidth1, cropHeight: cropHeight1
    };

    requestTransformAnimation(newTransform);
    throttle(e, timeoutRef, updateWrapperHandler, {...wrapper, ...newTransform});
  }

  const blurTimeoutRef = useRef();
  const timeoutRef = useRef();
  const animationFrameRef = useRef();
  const eventListenerRef = useRef(
    function handleBlur(e){
      blurTimeoutRef.current = setTimeout(() => _setActive(false), 0)
    }
  );
  
  const [_transform, _setTransform] = useState({
    x, y, width, height, rotate, cropX, cropY, cropWidth, cropHeight
  });
  const [_active, _setActive] = useState(selectedWrapperIds.includes(wrapperId));

  useEffect(() => {
    return () => {
      clearTimeout(timeoutRef.current);
    }
  }, []);
    
  useEffect(() => {
    const {x=0, y=0, rotate=0, width = 300, height = 200, cropX, cropY, cropWidth, cropHeight} = wrapper;
    
    _setTransform({x, y, width, height, rotate, cropX, cropY, cropWidth, cropHeight});
  }, [wrapper]);

  if (!isPreview){
    useEffect(() => {
      if (_active){
        svgDOM && svgDOM.addEventListener('mousedown', eventListenerRef.current);
        updateWrapperSelection([wrapper.id]);
      } else {
        svgDOM && svgDOM.removeEventListener('mousedown', eventListenerRef.current);
        deleteWrapperSelection([wrapper.id]);
      }
    }, [_active]);

    useEffect(() => {
      _setActive(selectedWrapperIds.includes(wrapperId));
    }, [selectedWrapperIds])
  }
  
  useEffect(() => {
    return () => {
      svgDOM && svgDOM.removeEventListener('mousedown', eventListenerRef.current);
      clearTimeout(timeoutRef.current);
    }
  }, [svgDOM]);

  const COS = Math.cos(_transform.rotate * Math.PI / 180);
  const SIN = Math.sin(_transform.rotate * Math.PI / 180);
  const transformX = _transform.x + _transform.cropX * COS - _transform.cropY * SIN;
  const transformY = _transform.y + _transform.cropY * COS + _transform.cropX * SIN;

  return ( wrapper ?
    <g className='SVGWrapper'
      transform={`translate(${transformX}, ${transformY}) rotate(${_transform.rotate})`}
      // transform-origin={`${_transform.x + _transform.width / 2} ${_transform.y +_transform.height / 2}`}
      onMouseDown={!isPreview && svgDOM ? onFocus : null}
      onContextMenu={isPreview ? null : e => handleContextMenu(e, wrapper)}
    > 

      <rect 
        width={_transform.cropWidth} height={_transform.cropHeight}
        {...{fill, stroke}}
        strokeWidth={strokeWidth || stroke && 1}
        strokeDasharray={strokeDasharray && strokeDasharray.split(" ").map(x => x * strokeWidth).join(" ")}
      />

      { <SVGEditable
          active={_active}
          {...{svgDOM, 
            handleMove, handleRotate, handleResize, handleCropMove, handleCropResize,
            slideObjectId, slideObjectType, isPreview
          }}
          transform={_transform}
          width={_transform.cropWidth} height={_transform.cropHeight}
        />
      }
    </g> : null
  )
}