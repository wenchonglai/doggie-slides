import { connect } from "react-redux";
import { withRouter } from "react-router";
import FilmStrip from "./filmstrip";
import PresentationPage from "./presentation_page";
import {updateCurrentSlide} from '../../actions/ui_actions';

const mapSTP = ({entities}) => ({
  entities: {entities}
});


const mapDTP = (dispatch) => ({
  updateCurrentSlideHandler: (slideId) => dispatch(updateCurrentSlide(slideId))
});

const FilmStripContainer = withRouter(connect(mapSTP, mapDTP)(FilmStrip));

export default FilmStripContainer;