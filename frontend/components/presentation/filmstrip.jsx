import React, { useEffect, useRef, useState } from 'react';
import SVGSlidePreviewContainer from '../svg/svg_slide_preview_container';

function SlidePreviewListItem({pageWidth, pageHeight, className, slide, clickHandler, dragStartHandler, dragOverHandler, dragEndHandler}){
  const width = 150;
  const height = 150 * pageHeight / pageWidth | 0
  ;
  return (
    <li className={`filmstrip-item ${className}`}
      draggable={true}
      onMouseDown={(e) => clickHandler(e, slide.id)}
      onDragStart={(e) => dragStartHandler(e, slide.id)}
      onDragEnd={(e) => dragEndHandler(e, slide.id)}
      onDragOver={(e) => dragOverHandler(e, slide.page)}
    >
      <svg width="200px" height={height + 16}>
        <text x={24} y={16} fontSize="12" className='page-number'>
          {slide.page}
        </text>
        
        <g transform="translate(40 0)" >
          <rect x={-2} y={6} className="box" width={width + 4} height={height + 4} rx={4}></rect>
          <SVGSlidePreviewContainer containerWidth={width} docId={slide.docId} slideId={slide.id}/>
        </g>
      </svg>
    </li>
  )
}

export default function FilmStrip({pageWidth, pageHeight, slides, history, moveSlideHandler}){
  const [activeSlideId, setActiveSlideId] = useState(1);
  const [moveToPage, setMoveToPage] = useState(-1);
  const animationFrameRef = useRef();
console.log(slides, Object.values(slides));
  function clickHandler(e, slideId){
    setActiveSlideId(slideId);
  };

  function dragStartHandler(e, slideId){
    cancelAnimationFrame(animationFrameRef.current);
    e.stopPropagation();
    const img = new Image();
    img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=';
    e.dataTransfer.setDragImage(img, 0, 0);
  }

  function dragOverHandler(e, page){
    cancelAnimationFrame(animationFrameRef.current);
    animationFrameRef.current = requestAnimationFrame(() => {
      const y = e.nativeEvent.offsetY;
      const halfHeight = pageHeight / pageWidth * 75 + 8;

      if (y > halfHeight) page += 1;
      if (page && page !== moveToPage){ setMoveToPage(page); }
    });
  };

  function dragEndHandler(e, slideId){
    const page = slides[activeSlideId].page;

    cancelAnimationFrame(animationFrameRef.current);
    moveSlideHandler({start: page, end: page, offset: moveToPage - page});
    setMoveToPage(-1);
  }

  useEffect(() => {
    history.replace(`/presentation/${activeSlideId}`);
  }, [activeSlideId]);

  const slidesComponents = Object.values(slides).sort((a, b) => a.page - b.page).map(slide => 
        ( <SlidePreviewListItem 
            className={slide.id == activeSlideId ? 'active' : ''}
            key={slide.id}
            {...{slide, pageWidth, pageHeight, clickHandler, dragOverHandler, dragStartHandler, dragEndHandler}}
          />
        )
      );

  const length = slidesComponents.length;
  const children = [];

  for (let i = 0; i <= 2 * length; i += 1){
    children.push( (i & 1) == 0 ? 
      (<hr className={((moveToPage - 1) == i >> 1) ? 'active' : ''} key={(i >> 1) - 0.5}/>) : (slidesComponents[i >> 1])
    );
  }
  
  return (
    <ul className='filmstrip'>
      {children}
    </ul>
  )
};