import React, {useState, useEffect, useRef} from 'react';

import {SVGWrapperContainer, SVGNoWrapperContainer} from './svg_wrapper_containers';

const ReactSVG = React.forwardRef(({children, isPreview, containerWidth, width, height, slide, slideId, ...props}, ref) => {
	let widthAttr = {};

  if (containerWidth) { widthAttr = {width: containerWidth}; }

	return (
		<svg
      version="1.1" 
      className="react-svg svg-slide"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      width="100%"
      height="100%"
      viewBox={`1000 1000 ${width} ${height}`}
      xmlSpace="preserve"
      ref={ref}
      {...widthAttr}
      {...props}
    >
      
			<g transform="translate(1000 1000)">
        <g className={'svg-background'}>
          <rect width={width} height={height} fill="#FFFFFF"></rect>
        </g>
        { (slide ? slide.wrapperIds : []).map(wrapperId => (
            isPreview ?
              <SVGNoWrapperContainer key={wrapperId} wrapperId = {wrapperId}/> :
              <SVGWrapperContainer key={wrapperId} slideId={slideId} wrapperId = {wrapperId} svgDOM={ref.current}/>
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