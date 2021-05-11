import { connect } from "react-redux";
import { updateWrapper } from '../../actions/presentation_actions';
import { updateWrapperSelection, deleteWrapperSelection } from '../../actions/ui_actions';

import SVGWrapper from './svg-wrapper';

const mapSTPCreator = isPreview => ({entities, ui}, {wrapperId, svgDOM}) => ({
  isPreview,
  svgDOM: isPreview ? undefined : svgDOM,
  pageWidth: ui.pageSettings.pageWidth,
  paggHeight: ui.pageSettings.pageHeight,
  selectedWrapperIds: ui.selections.wrapperIds,
  wrapper: entities.wrappers[wrapperId]
});

export const SVGWrapperContainer = connect(
  mapSTPCreator(false),
  (dispatch) => ({
    updateWrapperHandler: (formData) => dispatch(updateWrapper(formData)),
    updateWrapperSelection: (wrapperIds) => {dispatch(updateWrapperSelection(wrapperIds))},
    deleteWrapperSelection: (wrapperIds) => {dispatch(deleteWrapperSelection(wrapperIds))}
  })
)(SVGWrapper);

export const SVGNoWrapperContainer = connect(
  mapSTPCreator(true),
  null
)(SVGWrapper);