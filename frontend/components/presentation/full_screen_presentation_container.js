import { connect } from "react-redux";
import FullScreenPresentation from "./full_screen_presentation";

const mapSTP = ({entities, ui}, {slideId}) => ({
  presentingSlidePage: entities.slides[slideId].page,
  slides: Object.fromEntries(
    Object.values(entities.slides)
      .map(slide => [slide.page, slide])
  )
});

const mapDTP = dispatch => ({
});

const FullScreenPresentationContainer = connect(mapSTP, null)(FullScreenPresentation);

export default FullScreenPresentationContainer;