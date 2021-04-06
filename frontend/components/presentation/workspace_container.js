import { connect } from "react-redux";
import Workspace from "./workspace";

export default connect(({entities}, ownProps) => ({
  slide: entities.slides[ownProps.slideId]
}), null)(Workspace);