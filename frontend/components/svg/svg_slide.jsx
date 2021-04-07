import React, {useState, useEffect} from 'react';

// const CONTROL_POINT_SETTINGS = {
//   radius: 4
// }

// const SVGControlPoint = function({x, y}){
//   function handleDrag(e) {

//   }
  
//   return (
//     <g>
//       <a onDrag={e => handleDrag(e)}>
//         <circle cx={0} cy={0} radius={CONTROL_POINT_SETTINGS.radius}/>
//       </a>
//     </g>
//   );
// }

// const SVGEditFrame = function({width, height, rotation=0}){
//   const halfWidth = width / 2;
//   const halfHeight = height / 2;

//   const controlPoints = [
//     <SVGControlPoint key={0} type="vertex" transform={`translate(${-halfWidth} ${-halfHeight}`}/>,
//     <SVGControlPoint key={1} type="edge" transform={`translate(${0} ${-halfHeight}`}/>,
//     <SVGControlPoint key={2} type="vertex" transform={`translate(${halfWidth} ${-halfHeight}`}/>,
//     <SVGControlPoint key={3} type="edge" transform={`translate(${-halfWidth} ${0}`}/>,
//     <SVGControlPoint key={4} type="edge" transform={`translate(${0} ${-halfHeight - 30}`}/>,
//     <SVGControlPoint key={5} type="edge" transform={`translate(${halfWidth} ${0}`}/>,
//     <SVGControlPoint key={6} type="vertex" transform={`translate(${-halfWidth} ${halfHeight}`}/>,
//     <SVGControlPoint key={7} type="edge" transform={`translate(${0} ${halfHeight}`}/>,
//     <SVGControlPoint key={8} type="vertex" transform={`translate(${halfWidth} ${halfHeight}`}/>
//   ];

//   return (
//     <g className='svg-edit-frame'>
//       <rect width={width} height={height} trasform={`rotate(${rotation}deg) translate(${-halfWidth} ${-halfHeight})`}/>
//       <path path="M0 0 L0 -30" transform={}/>
//       {controlPoints}
//     </g>
//   )
// }

// const SVGWrapper = function({wrapper, textboxes, images, shapes, allowEdit, ...props}){
//   function getComponent(){
//     let {type, id} = wrapper;

//     switch (type){
//       case 'textbox': return <SVGTextbox id={id} allowEdit={allowEdit}/>;
//       case 'image': return <SVGImage id={id} allowEdit={allowEdit}/>;
//       case 'diagram': return <SVGShape id={id} allowEdit={allowEdit}/>;
//     }
//   }

//   return (
//     <g className='SVGNoWrapper' transform={wrapper.transformString}>
//       {allowEdit ? <SVGEditFrame />: null}
//       {getComponent()}
//     </g>
//   )
// }

// const mapSTPCreator = allowEdit => ({entities}, ownProps) => ({
//   allowEdit,
//   wrapper: entities.wrapper[ownProps.wrapperId],
// });

// const SVGWrapperContainer = connect(
//   mapSTPCreator(true),
//   null
// )(SVGWrapper);

// const SVGNoWrapperContainer = connect(
//   mapSTPCreator(false),
//   null
// )(SVGWrapper);

export default function SVGSlide({isPreview, containerWidth, width, height, slide}){
  let widthAttr = {};
  if (containerWidth) { widthAttr = {width: containerWidth}; }

  return (
    <svg 
      version="1.1" 
      className="svg-slide"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      viewBox={`0 0 ${width} ${height}`}
      xmlSpace="preserve"
      {...widthAttr}
    > 
      <g>
        <rect width={width} height={height} fill="#FFFFFF"></rect>
      </g>
      {/* { (slide.wrapperIds || []).map(wrapperId => (
          // <SVGNoWrapperContainer wrapperId={wrapperId} />
        )
      } */}
      <text x={800} y={400} alignmentBaseline="middle" textAnchor="middle" fontSize="60">{`Slide #${slide.id} (Page ${slide.page})`}</text>
      <rect x='200' width="1200" y ="300" height="200" stroke='#777' fill="none">
        
      </rect>
      <rect x='500' width="600" y ="600" height="200" stroke='#777' fill="none"></rect>
    </svg>
  )
}