import React, {useState, useEffect} from 'react';
import { connect } from 'react-redux';
import SVGTextArea from './svg-textarea';

const CONTROL_POINT_SETTINGS = {
  radius: 4
}

const SVGControlPoint = function({x, y}){
  function handleDrag(e) {

  }
  
  return (
    <g>
      <a onDrag={e => handleDrag(e)}>
        <circle cx={0} cy={0} radius={CONTROL_POINT_SETTINGS.radius}/>
      </a>
    </g>
  );
}

const SVGEditFrame = function({width, height, rotation=0}){
  const halfWidth = width / 2;
  const halfHeight = height / 2;

  const controlPoints = [
    <SVGControlPoint key={0} type="vertex" transform={`translate(${-halfWidth} ${-halfHeight}`}/>,
    <SVGControlPoint key={1} type="edge" transform={`translate(${0} ${-halfHeight}`}/>,
    <SVGControlPoint key={2} type="vertex" transform={`translate(${halfWidth} ${-halfHeight}`}/>,
    <SVGControlPoint key={3} type="edge" transform={`translate(${-halfWidth} ${0}`}/>,
    <SVGControlPoint key={4} type="edge" transform={`translate(${0} ${-halfHeight - 30}`}/>,
    <SVGControlPoint key={5} type="edge" transform={`translate(${halfWidth} ${0}`}/>,
    <SVGControlPoint key={6} type="vertex" transform={`translate(${-halfWidth} ${halfHeight}`}/>,
    <SVGControlPoint key={7} type="edge" transform={`translate(${0} ${halfHeight}`}/>,
    <SVGControlPoint key={8} type="vertex" transform={`translate(${halfWidth} ${halfHeight}`}/>
  ];

  return (
    <g className='svg-edit-frame'>
      <rect width={width} height={height} trasform={`rotate(${rotation}deg) translate(${-halfWidth} ${-halfHeight})`}/>
      {/* <path path="M0 0 L0 -30" transform={}/> */}
      {controlPoints}
    </g>
  )
}

const SVGWrapper = function({wrapper, allowEdit, ...props}){
  let {slideObjectType, slideObject, transformString} = wrapper;

  function getComponent(){
    switch (slideObjectType){
      case 'Textbox': return <SVGTextArea value={slideObject.text} textStyles={slideObject.textStyles}/>;
      // case 'image': return <SVGImage id={id} allowEdit={allowEdit}/>;
      // case 'diagram': return <SVGShape id={id} allowEdit={allowEdit}/>;
    }
  }

  return (
    <g className='SVGNoWrapper' transform={transformString}>
      {allowEdit ? <SVGEditFrame />: null}
      {getComponent()}
    </g>
  )
}

const mapSTPCreator = allowEdit => ({entities}, ownProps) => ({
  allowEdit
});

const SVGWrapperContainer = connect(
  mapSTPCreator(true),
  null
)(SVGWrapper);

const SVGNoWrapperContainer = connect(
  mapSTPCreator(false),
  null
)(SVGWrapper);

export default function SVGSlide({isPreview, containerWidth, width, height, slide = {}, wrappers}){
  let widthAttr = {};
  if (containerWidth) { widthAttr = {width: containerWidth}; }

  return (
    <svg 
      version="1.1" 
      className="svg-slide"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      width="100%"
      height="100%"
      viewBox={`0 0 ${width} ${height}`}
      xmlSpace="preserve"
      {...widthAttr}
    > 
      <g>
        <rect width={width} height={height} fill="#FFFFFF"></rect>
      </g>
      { (wrappers).map(wrapper => (
          isPreview ?
            <SVGNoWrapperContainer key={wrapper.id} wrapper={wrapper} /> :
            <SVGWrapperContainer key={wrapper.id} wrapper={wrapper} />
        ))
      }
      {/* <text x={width - 100} y={height - 100} alignmentBaseline="middle" textAnchor="middle" fontSize="20">{`Page ${slide.page}`}</text>
      <rect x='200' width="1200" y ="300" height="200" stroke='#777' fill="none">
        
      </rect>
      <SVGTextArea transform={"translate(400 420)"} value={`Title for Slide #${slide.id}`}/>
      <SVGTextArea transform={"translate(400 720)"} value={`Subtitle for ${slide.id}`}/>
      <rect x='500' width="600" y ="600" height="200" stroke='#777' fill="none"></rect> */}
    </svg>
  )
}