import React from 'react';
import SVGSlideContainer from '../svg/svg_slide_container'

export default function Workspace({slideId, ui}){
  // console.log(ui, slideId, entities)
  console.log(ui, slideId);
  return (
    <section className='workspace'>
      <SVGSlideContainer slideId={slideId}/>
    </section>
  )
}