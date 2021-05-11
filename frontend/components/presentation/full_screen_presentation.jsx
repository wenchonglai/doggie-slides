import React from 'react';
import { withRouter } from 'react-router';
import { SVGSlidePreviewContainer } from '../svg/svg_slide_containers';

function FullScreenPresentation({slideId}){
  function handleClick(e){
    console.log(e);
  }
  return (
    <SVGSlidePreviewContainer onClick={e => handleClick(e)} slideId={slideId}/>
  );
}

export default withRouter(FullScreenPresentation);