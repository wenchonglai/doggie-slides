import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useRef, useState } from 'react';
import useSizeAware from "react-resize-aware";
import { withRouter } from 'react-router';
import {SVGSlidePreviewContainer} from '../svg/svg_slide_containers';

function SlidePreviewItem({
  pageWidth, pageHeight, className, slide, isGridView, skipped,
  clickHandler, dragStartHandler, dragOverHandler, dragEndHandler
}){
  const width = isGridView ? 300 : 150;
  const height = width * pageHeight / pageWidth | 0;

  return (
    <div className={`filmstrip-item ${className}`}
      draggable={true}
      onMouseDown={(e) => clickHandler(e, slide.id)}
      onDoubleClick={(e) => clickHandler(e, slide.id, true)}
      onDragStart={(e) => dragStartHandler(e, slide.id)}
      onDragEnd={(e) => dragEndHandler(e, slide.id)}
      onDragOver={(e) => dragOverHandler(e, slide.page)}
    >
      <div className='page-number' fill="black">
        {slide.page}
      </div>
      <svg width={isGridView ? width : "200px"} height={height + 16}>
        <defs>
          <clipPath id="clipping-mask">
            <rect x={0} y={8} width={width} height={height} />
          </clipPath>
        </defs>
        <g transform={`translate(${isGridView ? 0 : 40} 0)`}>
          <rect x={-2} y={6} className="box" width={width + 4} height={height + 4} rx={4}></rect>
          <g clipPath="url(#clipping-mask)">
            <SVGSlidePreviewContainer containerWidth={width} slideId={slide.id}/>
          </g>
        </g>
      </svg>
      { skipped && <FontAwesomeIcon icon="eye-slash" />}
    </div>
  )
}

function FilmStrip({
  pageWidth, pageHeight, currentSlideId, slides, isGridView, history,
  moveSlideHandler, updateCurrentSlideHandler, handleContextMenu
}){
  const [_moveToPage, _setMoveToPage] = useState(-1);
  const [_ulWidth, _setULWidth] = useState();
  const animationFrameRef = useRef();
  const [resizeListener, sizes] = useSizeAware();

  function clickHandler(e, slideId, forceRedirect){
    updateCurrentSlideHandler(slideId, history, !isGridView || forceRedirect);
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
      const y = e.nativeEvent[isGridView ? "offsetX" : "offsetY"];
      const halfHeight = isGridView ? 150 : pageHeight / pageWidth * 75 + 8;
      
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
    ( <SlidePreviewItem 
        className={`${slide.id == currentSlideId ? 'active' : ''} ${slide.skipped ? 'skipped' : ''}`}
        key={slide.id}
        skipped={slide.skipped}
        {...{slide, isGridView, pageWidth, pageHeight, clickHandler, dragOverHandler, dragStartHandler, dragEndHandler}}
      />
    )
  );

  const length = slidesComponents.length;
  const children = [];

  for (let i = 0; i < length; i += 1){
    children.push(
      <li key={i}>
        <div>
          <hr className={((_moveToPage - 1) == i) ? 'active' : ''}/>
          {slidesComponents[i]}
          { i === length - 1 && 
              <hr className={((_moveToPage - 1) == i + 1) ? 'active' : ''}/>
          }
        </div>
      </li>
    );
  }
  
  useEffect(() => {
    isGridView && _setULWidth( ((sizes.width - 14) / 326 | 0) * 326 + 14 );
  }, [sizes]);

  return (
    <div>
      {resizeListener}
      <ul className='filmstrip' onContextMenu={(e) => handleContextMenu(e, 'slide')}
        style={isGridView ? {width: _ulWidth} : {}}
      >
       {children}
      </ul>
    </div>
  )
};

export default withRouter(FilmStrip);