import { connect } from "react-redux";
import { updateText } from "../../actions/presentation_actions";
import { updateUITextSelection } from "../../actions/ui_actions";
import { getTextstylesByTextbox } from "../../selectors/selectors";
import SVGTextArea from "./svg_textarea";

export default connect(
  ({entities, ui}, {textboxId, width}) => {
    const textbox = entities.textboxes[textboxId];

    return ({
      ui, entities,
      text: textbox.text,
      styleStrings: getTextstylesByTextbox({entities}, textbox)
    })
  },
  (dispatch, ownProps) => ({
    updateTextHandler: (id, data) => dispatch(updateText(id, data)),
    updateUITextSelection: 
      (args) => dispatch(updateUITextSelection(args))
  })
)(SVGTextArea);