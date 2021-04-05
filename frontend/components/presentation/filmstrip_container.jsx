import { connect } from "react-redux";
import { withRouter } from "react-router";
import FilmStrip from "./filmstrip";
import PresentationPage from "./presentation_page";

const mapSTP = ({entities}) => ({
  entities: {entities}
});


const mapDTP = (dispatch) => ({
  
});

const FilmStripContainer = withRouter(connect(mapSTP, mapDTP)(FilmStrip));

export default FilmStripContainer;