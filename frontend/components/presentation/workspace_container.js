import { connect } from "react-redux";
import Workspace from "./workspace";

export default connect(({entities, ui}) => ({
  entities,
  ui,
  slideId: ui.slideSettings.slideId,
  zoom: ui.slideSettings.zoom
}), null)(Workspace);