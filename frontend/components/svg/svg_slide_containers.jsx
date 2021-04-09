import { connect } from "react-redux";
import SVGSlide from "./svg_slide";

const generateSTP = (isPreview) => ({entities, ui}, ownProps) => {
  // const slide = entities.slides[ownProps.slideId];
  // const wrappers = slide.wrapperIds.map(id => {
  //   const wrapper = entities.wrappers[id];
  //   let slideObject = undefined;

  //   switch (wrapper.slideObjectType){
  //     case 'Textbox': {
  //       slideObject = entities.textboxes[wrapper.slideObjectId];
  //       const textStyles = slideObject.textstyleIds
  //         .map(id => entities.textstyles[id]);

  //       return {...wrapper, slideObject: {...slideObject, textStyles}};
  //     };
  //     default: return wrapper;
  //   }
  // });

  return ({
    isPreview,
    slide: entities.slides[ownProps.slideId],
    // wrapperIds: entities.slides[ownProps.slideId].wrapperIds,
    width: ui.pageSettings.pageWidth || 0,
    height: ui.pageSettings.pageHeight || 0
  })
};

export const SVGSlideContainer = connect(
  generateSTP(false),
  (dispatch, ownProps) => ({
  })
)(SVGSlide);

export const SVGSlidePreviewContainer = connect(
  generateSTP(true),
  (dispatch, ownProps) => ({
  })
)(SVGSlide);