import React, { useEffect, useState } from 'react';
import SVGSlidePreviewContainer from '../svg/svg_slide_preview_container';

function SlidePreview({className, slide, clickHandler}){
  function handleClick(e, slideId){
    clickHandler(slideId);
  }
  return (
    <li className={`filmstrip-item ${className}`} onClick={(e) => handleClick(e, slide.id)}>
      <div className='page-number'>
        {slide.page}
      </div>
      <div className='box'>
        <SVGSlidePreviewContainer docId={slide.docId} slideId={slide.id}/>
      </div>
    </li>
  )
}

export default function FilmStrip({doc, slides, history, updateCurrentSlideHandler}){
  const [currentSlideId, setCurrentSlideId] = useState(1);

  function clickHandler(slideId){
    updateCurrentSlideHandler(slideId);
    setCurrentSlideId(slideId);
  };

  useEffect(() => {
    history.replace(`/presentation/${currentSlideId}`);
  }, [currentSlideId]);
  
  return (
    <ul className='filmstrip'>
      {(slides || []).map(slide => 
        ( <SlidePreview 
            className={slide.id == currentSlideId ? 'active' : ''}
            key={slide.id}
            slide={slide}
            clickHandler={clickHandler}
          />
        )
      )}
    </ul>
  )
};