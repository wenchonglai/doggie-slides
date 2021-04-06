import { connect } from "react-redux";
import PresentationPage from "./presentation_page";
import {fetchPresentation, updateDoc} from "../../actions/presentation_actions";
import {updateCurrentSlide} from '../../actions/ui_actions';

const PresentationPageContainer = connect(
  (state, ownProps) => ({
    currentSlideId: ownProps.match.params.slideId,
    doc: Object.values(state.entities.docs)[0],
    slides: Object.values(state.entities.slides).sort((a, b) => a.page - b.page)
  }),
  dispatch => ({
    updateCurrentSlideHandler: (slideId) => dispatch(updateCurrentSlide(slideId)),
    fetchPresentationHandler: () => dispatch(fetchPresentation()),
    saveDocHandler: (doc) => dispatch(updateDoc(doc))
  })
)(PresentationPage);

export default PresentationPageContainer;