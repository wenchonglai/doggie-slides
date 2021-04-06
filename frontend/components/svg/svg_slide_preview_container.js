import { connect } from "react-redux";
import SVGSlidePreview from "./svg_slide_preview";

const SVGSlidePreviewContainer = connect(
  ({entities}, ownProps) => ({
    width: entities.docs[ownProps.docId].width,
    height: entities.docs[ownProps.docId].height,
    slide: entities.slides[ownProps.slideId],
  }),
  (dispatch, ownProps) => ({
  })
)(SVGSlidePreview);

export default SVGSlidePreviewContainer;