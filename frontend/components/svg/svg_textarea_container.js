import { connect } from "react-redux";
import { updateText } from "../../actions/presentation_actions";
import SVGTextArea from "./svg_textarea";

export default connect(
  ({entities}, {textboxId, width}) => {
    const textbox = entities.textboxes[textboxId];

  return ({
    text: textbox.text,
    styleStrings: textbox.textstyleIds.map(id => entities.textstyles[id])
  })
  },
  (dispatch, ownProps) => ({
    updateTextHandler: (id, data) => dispatch(updateText(id, data))
  })
)(SVGTextArea);