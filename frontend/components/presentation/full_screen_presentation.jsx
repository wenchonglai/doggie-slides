import React, { useEffect, useRef } from 'react';
import { withRouter } from 'react-router';
import { SVGSlidePreviewContainer } from '../svg/svg_slide_containers';

function FullScreenPresentation({
  presentingSlidePage, slides, slideId,
  presentHandler, handle
}){
  const eventListenerRef = useRef();

  function handleClick(e){
    // console.log(presentingSlidePage, slideId, slides);
  }

  function handleKeyDown(e){
    switch (e.key){
      case 'Enter':;
      case 'ArrowDown':;
      case 'ArrowRight': {
        if (slides[presentingSlidePage + 1])
          presentHandler(presentingSlidePage + 1)
      }; break;

      case 'ArrowUp':;
      case 'ArrowLeft': {
        if (slides[presentingSlidePage - 1])
          presentHandler(presentingSlidePage - 1)
      }; break;
    }
  }

  useEffect(() => {
    eventListenerRef.current = handleKeyDown;
    document.body.addEventListener('keydown', eventListenerRef.current, true);

    return () => {
      document.body.removeEventListener('keydown', eventListenerRef.current, true);
    }
  }, [slideId]);

  return (
    <SVGSlidePreviewContainer onClick={e => handleClick(e)} slideId={slideId}/>
  );
}

export default withRouter(FullScreenPresentation);