import React from 'react';
import SVGSlideContainer from '../svg/svg_slide_container'

export default function Workspace({slide, ui, slideId, entities}){
  // console.log(ui, slideId, entities)
  return (
    <section className='workspace'>
      <SVGSlideContainer slide={slide}/>
    </section>
  )
}