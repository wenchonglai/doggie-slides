import { connect } from "react-redux";
import Workspace from "./workspace";

export default connect(({entities, ui}) => ({
  entities,
  slide: entities.slides[ui.slideId],
  ui
}), null)(Workspace);