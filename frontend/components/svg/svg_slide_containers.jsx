import { connect } from "react-redux";
import { updateMenuAction } from "../../actions/ui_actions";
import { createText } from "../../actions/presentation_actions"
import SVGSlide from "./svg_slide";

const generateSTP = (isPreview) => ({entities, ui}, ownProps) => {
  const slide = entities.slides[ownProps.slideId];

  return ({
    isPreview,
    slide,
    wrappers: slide.wrapperIds
      .map(id => entities.wrappers[id])
      .sort((a, b) => a.zIndex - b.zIndex),
    width: ui.pageSettings.pageWidth || 0,
    height: ui.pageSettings.pageHeight || 0,
    menuAction: ui.selections.nextMenuAction
  })
};

export const SVGSlideContainer = connect(
  generateSTP(false),
  (dispatch, ownProps) => ({
    updateMenuAction: (args) => dispatch(updateMenuAction(args)),
    createText: (textData) => {
      dispatch(createText(textData))
    }
  })
)(SVGSlide);

export const SVGSlidePreviewContainer = connect(
  generateSTP(true),
  (dispatch, ownProps) => ({
  })
)(SVGSlide);