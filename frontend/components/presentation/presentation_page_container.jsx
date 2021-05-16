import { connect } from "react-redux";
import PresentationPage from "./presentation_page";
import {fetchPresentation, updateDoc} from "../../actions/presentation_actions";
import {updateCurrentSlide, enterPresentMode} from '../../actions/ui_actions';

const PresentationPageContainer = connect(
  ({ui, entities}, ownProps) => ({
    currentSlideId: ui.slideSettings.slideId,
    isFullScreen: ui.slideSettings.isFullScreen,
    uiSelections: {...ui.selections},
    doc: Object.values(entities.docs)[0],
    slides: Object.values(entities.slides).sort((a, b) => a.page - b.page)
  }),
  dispatch => ({
    updateCurrentSlideHandler: (slideId, history, redirect) => dispatch(updateCurrentSlide(slideId, history, redirect)),
    fetchPresentationHandler: () => dispatch(fetchPresentation()),
    saveDocHandler: (doc) => dispatch(updateDoc(doc)),
    presentHandler: (slideId, handle) => dispatch(enterPresentMode(slideId, handle))
  })
)(PresentationPage);

export default PresentationPageContainer;