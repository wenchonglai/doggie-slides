import { connect } from "react-redux";
import { withRouter } from "react-router";
import { moveSlide } from "../../actions/presentation_actions";
import { updateCurrentSlide } from "../../actions/ui_actions";
import FilmStrip from "./filmstrip";

const mapSTP = ({entities, ui}) => ({
  slides: entities.slides,
  pageWidth: ui.pageWidth,
  pageHeight: ui.pageHeight,
  currentSlideId: ui.slideId
});

const mapDTP = (dispatch) => ({
  updateCurrentSlideHandler: (slideId) => dispatch(updateCurrentSlide(slideId)),
  moveSlideHandler: (data) => dispatch(moveSlide(data))
});

const FilmStripContainer = withRouter(connect(mapSTP, mapDTP)(FilmStrip));

export default FilmStripContainer;