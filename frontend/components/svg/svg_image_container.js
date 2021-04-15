import { connect } from "react-redux";
import SVGImage from "./svg_image"
// import { updateImage } from "../../actions/presentation_actions";
// import { updateUIImageSelection } from "../../actions/ui_actions";
// import { getImagestylesByImagebox } from "../../selectors/selectors";
import SVGTextArea from "./svg_textarea";

export default connect(
  ({entities, ui}, {slideObjectId}) => {
    return ({
      image: entities.images[slideObjectId]
    })
  },
  (dispatch) => ({
    // updateImageHandler: (id, data) => dispatch(updateImage(id, data))
  })
)(SVGImage);