import { connect } from "react-redux";
import { updateWrapper } from '../../actions/presentation_actions';
import { updateWrapperSelection, deleteWrapperSelection, updateEditMode } from '../../actions/ui_actions';

import SVGWrapper from './svg-wrapper';

const mapSTPCreator = isPreview => ({entities, ui}, {wrapperId, svgDOM}) => ({
  isPreview,
  svgDOM: isPreview ? undefined : svgDOM,
  pageWidth: ui.pageSettings.pageWidth,
  pageHeight: ui.pageSettings.pageHeight,
  selectedWrapperIds: ui.selections.wrapperIds,
  wrapper: entities.wrappers[wrapperId],
  editMode: ui.selections.editMode,
});

export const SVGWrapperContainer = connect(
  mapSTPCreator(false),
  (dispatch) => ({
    updateWrapperHandler: formData => dispatch(updateWrapper(formData)),
    updateWrapperSelection: wrapperIds => dispatch(updateWrapperSelection(wrapperIds)),
    deleteWrapperSelection: wrapperIds => dispatch(deleteWrapperSelection(wrapperIds)),
    updateEditMode: value => dispatch(updateEditMode(value))
  })
)(SVGWrapper);

export const SVGNoWrapperContainer = connect(
  mapSTPCreator(true),
  null
)(SVGWrapper);