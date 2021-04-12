import React from 'react';
import {SVGSlideContainer} from '../svg/svg_slide_containers'

export default function Workspace({slideId, ui, handleContextMenu}){
  // console.log(ui, slideId, entities)

  return (
    <section className='workspace'>
      <SVGSlideContainer handleContextMenu={handleContextMenu} slideId={slideId}/>
    </section>
  )
}