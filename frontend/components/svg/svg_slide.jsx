import React, {useState, useEffect, useRef, useLayoutEffect} from 'react';
import { updateMenuAction } from '../../actions/ui_actions';

import {SVGWrapperContainer, SVGNoWrapperContainer} from './svg_wrapper_containers';

const ReactSVG = React.forwardRef(({
  children, isPreview, containerWidth, width, height, slide, slideId,
  menuAction, updateMenuAction, createText, handleContextMenu, wrappers, onClick,
  zoom, outerHeight,
  ...props
}, ref) => {

	let widthAttr = {};

  if (containerWidth) { widthAttr = {width: containerWidth}; }

  function handleMouseDownCapture(e){
    menuAction === 'Select' || e.stopPropagation();
  }

  function handleClick(e){
    const rect = e.currentTarget.children[0].children[0].children[0].getBoundingClientRect();
    const scale = width / rect.width;
    const x = e.clientX - rect.x;
    const y = e.clientY - rect.y;
    const textData = {
      text: "wow", 
      wrapperAttributes: {
        slideId,
        groupId: null,
        width: 400,
        height: 50,
        x: x * scale,
        y: y * scale,
        crop_x: 0,
        crop_y: 0,
        crop_width: 400,
        crop_height: 50
      },
      textstylesAttributes: [{
        styleString: "font: 20px Arial; fill: black",
        offset: 0
      }]
    };

    switch (menuAction){
      case 'Select': return;
      case 'Text Box': {
        createText(textData);
      }
      default: return updateMenuAction('Select');
    };
  }

  const [_height, _setHeight] = useState('100%');

  // if (zoom)
  useEffect(() => {
    if (!zoom || outerHeight >= zoom * height)
      _setHeight('100%');
    else 
      _setHeight(zoom * height);
  }, [zoom]);

	return (
		<svg
      version="1.1" 
      className="react-svg svg-slide"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      width={zoom ? zoom * width : '100%'}
      height={_height}
      viewBox={`1000 1000 ${width} ${height}`}
      xmlSpace="preserve"
      ref={ref}
      {...widthAttr}
      {...props}
      onMouseDownCapture={isPreview ? undefined : (e) => handleMouseDownCapture(e)}
      onClick={isPreview ? onClick : (e) => handleClick(e)}
    >
			<g transform="translate(1000 1000)">
        <g className={'svg-background'}>
          <rect width={width} height={height} fill={slide.background || '#ffffff'}></rect>
        </g>
        { wrappers
            .map(({id}) => (
            isPreview ?
              <SVGNoWrapperContainer key={id} wrapperId={id}/> :
              <SVGWrapperContainer 
                key={id} slideId={slideId} wrapperId = {id} svgDOM={ref.current}
                handleContextMenu={handleContextMenu}
              />
          ))
        }
        
        {/* <text x={width - 100} y={height - 100} alignmentBaseline="middle" textAnchor="middle" fontSize="20">{`Page ${slide.page}`}</text>
        <rect x='200' width="1200" y ="300" height="200" stroke='#777' fill="none">
          
        </rect>
        <SVGTextArea transform={"translate(400 420)"} value={`Title for Slide #${slide.id}`}/>
        <SVGTextArea transform={"translate(400 720)"} value={`Subtitle for ${slide.id}`}/>
        <rect x='500' width="600" y ="600" height="200" stroke='#777' fill="none"></rect> */}
      </g>  
      <def>
        
      </def>
		</svg>
	);
});


const useSVG = function (svgRef){
	const [ svg, setSVG ] = useState(undefined);

	useEffect( () => {
		setSVG(svgRef.current);
	}, []);

	return [svg];
}

export default function SVGSlide(props){
  let svgRef = useRef();
  let svg = useSVG(svgRef);

  return (
    <ReactSVG ref={svgRef} {...props} />
  )
}