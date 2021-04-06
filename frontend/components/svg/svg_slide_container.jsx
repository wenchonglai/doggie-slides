import { connect } from "react-redux";
import SVGSlide from "./svg_slide";

const SVGSlidePreviewContainer = connect(
  ({entities, ui}, ownProps) => {
    console.log('----', ui);
    return ({
    isPreview: false,
    width: ui.pageWidth || 0,
    height: ui.pageHeight || 0,
    slide: entities.slides[ownProps.slideId],
  })
},
  (dispatch, ownProps) => ({
  })
)(SVGSlide);

export default SVGSlidePreviewContainer;