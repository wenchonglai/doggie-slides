import React, { useEffect, useRef, useState } from 'react';
import {SVGSlidePreviewContainer} from '../svg/svg_slide_containers';

function SlidePreviewListItem({
  pageWidth, pageHeight, className, slide, clickHandler, dragStartHandler, dragOverHandler, dragEndHandler
}){
  const width = 150;
  const height = 150 * pageHeight / pageWidth | 0;

  return (
    <li className={`filmstrip-item ${className}`}
      draggable={true}
      onMouseDown={(e) => clickHandler(e, slide.id)}
      onDragStart={(e) => dragStartHandler(e, slide.id)}
      onDragEnd={(e) => dragEndHandler(e, slide.id)}
      onDragOver={(e) => dragOverHandler(e, slide.page)}
    >
      <svg width="200px" height={height + 16}>
        <defs>
          <clipPath id="clipping-mask">
            <rect x={0} y={8} width={width} height={height} />
          </clipPath>
        </defs>
        <text x={24} y={16} fontSize="12" className='page-number'>
          {slide.page}
        </text>
        
        <g transform="translate(40 0)">
          <rect x={-2} y={6} className="box" width={width + 4} height={height + 4} rx={4}></rect>
          <g clipPath="url(#clipping-mask)">
            <SVGSlidePreviewContainer containerWidth={width} slideId={slide.id}/>
          </g>
          <rect x={-2} y={6} className="skip-box" width={width + 4} height={height + 4} rx={4}></rect>
        </g>
      </svg>
    </li>
  )
}

export default function FilmStrip({pageWidth, pageHeight, currentSlideId, slides, history, moveSlideHandler, updateCurrentSlideHandler, handleContextMenu}){
  const [_moveToPage, _setMoveToPage] = useState(-1);
  const animationFrameRef = useRef();

  function clickHandler(e, slideId){
    updateCurrentSlideHandler(slideId);
  };

  function dragStartHandler(e, slideId){
    cancelAnimationFrame(animationFrameRef.current);
    e.stopPropagation();
    const img = new Image();
    img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=';
    e.dataTransfer.setDragImage(img, 0, 0);
  }

  function dragOverHandler(e, page){
    e.preventDefault();

    
    cancelAnimationFrame(animationFrameRef.current);
    animationFrameRef.current = requestAnimationFrame(() => {
      const y = e.nativeEvent.offsetY;
      const halfHeight = pageHeight / pageWidth * 75 + 8;
      
      if (y > halfHeight) page += 1;
      if (page && page !== _moveToPage){ _setMoveToPage(page); }
    });
  };

  function dragEndHandler(e, slideId){
    const page = slides[currentSlideId].page;

    cancelAnimationFrame(animationFrameRef.current);
    moveSlideHandler({start: page, end: page, offset: _moveToPage - page - (_moveToPage - page > 0 ? 1 : 0) });
    _setMoveToPage(-1);
  }

  const slidesComponents = Object.values(slides).sort((a, b) => a.page - b.page).map(slide => 
        ( <SlidePreviewListItem 
            className={`${slide.id == currentSlideId ? 'active' : ''} ${slide.skipped ? 'skipped' : ''}`}
            key={slide.id}
            {...{slide, pageWidth, pageHeight, clickHandler, dragOverHandler, dragStartHandler, dragEndHandler}}
          />
        )
      );

  const length = slidesComponents.length;
  const children = [];

  for (let i = 0; i <= 2 * length; i += 1){
    children.push( (i & 1) == 0 ? 
      (<hr className={((_moveToPage - 1) == i >> 1) ? 'active' : ''} key={(i >> 1) - 0.5}/>) : (slidesComponents[i >> 1])
    );
  }
  
  return (
    <ul className='filmstrip' onContextMenu={(e) => handleContextMenu(e, 'slide')}>
      {children}
    </ul>
  )
};