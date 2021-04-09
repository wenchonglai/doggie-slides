import { connect } from "react-redux";
import { updateWrapper } from '../../actions/presentation_actions';

import SVGWrapper from './svg-wrapper';

const mapSTPCreator = editable => ({entities, ui}, {wrapperId, svgDOM}) => ({
  editable,
  svgDOM: editable ? svgDOM : undefined,
  pageWidth: ui.pageSettings.pageWidth,
  paggHeight: ui.pageSettings.pageHeight,
  wrapper: entities.wrappers[wrapperId]
});

export const SVGWrapperContainer = connect(
  mapSTPCreator(true),
  dispatch => ({
    updateWrapperHandler: (formData) => dispatch(updateWrapper(formData))
  })
)(SVGWrapper);

export const SVGNoWrapperContainer = connect(
  mapSTPCreator(false),
  null
)(SVGWrapper);