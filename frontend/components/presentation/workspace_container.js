import { connect } from "react-redux";
import Workspace from "./workspace";

export default connect(({entities, ui}) => ({
  entities,
  ui,
  slideId: ui.slideId
}), null)(Workspace);