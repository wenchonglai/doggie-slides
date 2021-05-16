import React, {useRef} from 'react';
import {SVGSlideContainer} from '../svg/svg_slide_containers'

export default function Workspace({slideId, ui, handleContextMenu, zoom}){
  const ref = useRef();

  return (
    <section className='workspace'>
      <div className="svg-wrapper" ref={ref}>
        <SVGSlideContainer 
          handleContextMenu={handleContextMenu} 
          slideId={slideId} 
          zoom={zoom}
          outerHeight={ref.current && ref.current.clientHeight}
        />
      </div>
    </section>
  )
}