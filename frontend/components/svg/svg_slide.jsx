import React, {useState, useEffect, useRef} from 'react';
import { connect } from 'react-redux';
import SVGTextAreaContainer from './svg_textarea_container';
import SVGEditFrame from './svg_edit_frame'

const SVGWrapper = function({wrapper, editable, svgDOM, pageWidth, pageHeight, ...props}){
  const {slideObjectId, slideObjectType, translateX=0, translateY=0, rotate=0, width = 300, height = 200} = wrapper;
  const [_size, _setSize] = useState({width, height});
  const [_translate, _setTranslate] = useState({x: translateX, y: translateY});
  const [_rotate, _setRotate] = useState(rotate); 

  function handleMove(e){
    e.stopPropagation();
    const clientRect = svgDOM.children[0].children[0].children[0].getBoundingClientRect();
    const scale = pageWidth / clientRect.width;
    const {dx, dy} = e;
    const angle = _rotate * Math.PI / 180;
    const COS = Math.cos(angle) * scale;
    const SIN = Math.sin(angle) * scale;
  
    _setTranslate({
      x: _translate.x + dx * scale,
      y: _translate.y + dy * scale,
    });
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

    _setRotate( (Math.atan2(dx, -dy) * 180 / Math.PI) | 0 );
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

  return (
    <g className='SVGWrapper'
      transform={`rotate(${_rotate}) translate(${_translate.x}, ${_translate.y})`}
      transform-origin={`${_translate.x + _size.width / 2} ${_translate.y +_size.height / 2}`}
    >
      { editable ? 
          <SVGEditFrame
            {...{svgDOM, handleMove, handleRotate}}
            width={_size.width} height={_size.height}
          >
            {component}
          </SVGEditFrame> : 
          component
      }
    </g>
  )
}

const mapSTPCreator = editable => ({entities, ui}, {wrapperId, svgDOM}) => ({
  editable,
  svgDOM: editable ? svgDOM : undefined,
  pageWidth: ui.pageSettings.pageWidth,
  paggHeight: ui.pageSettings.pageHeight,
  wrapper: entities.wrappers[wrapperId]
});

const SVGWrapperContainer = connect(
  mapSTPCreator(true),
  null
)(SVGWrapper);

const SVGNoWrapperContainer = connect(
  mapSTPCreator(false),
  null
)(SVGWrapper);

const ReactSVG = React.forwardRef(({children, isPreview, containerWidth, width, height, slide, ...props}, ref) => {
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
    >
      
			<g transform="translate(1000 1000)">
        <g>
          <rect width={width} height={height} fill="#FFFFFF"></rect>
        </g>
        { (slide.wrapperIds).map(wrapperId => (
            isPreview ?
              <SVGNoWrapperContainer key={wrapperId} wrapperId = {wrapperId}/> :
              <SVGWrapperContainer key={wrapperId} wrapperId = {wrapperId} svgDOM={ref.current}/>
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