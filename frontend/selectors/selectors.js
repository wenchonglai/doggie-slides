export const getTextstylesByTextbox = ( {entities}, textbox) => {
  return textbox.textstyleIds.map(id => entities.textstyles[id]);
}

export const getTextstylesByTextboxId = (state, textboxId) => {
  const textbox = getTextboxById(state, textboxId);
  return getTextstylesByTextbox(state, textbox);
}

export const getWrapperById = ({entities}, id) => 
  entities.wrappers[id]

export const getTextboxById = ({entities}, id) => 
  entities.textboxes[id]

const getSelectedWrapper = ({ui, entities}) => 
  entities.wrappers[ui.selections.wrapperIds[0] || -1]

export const getSelectedTextbox = (state) => {
  const wrapper = getSelectedWrapper(state);
  return getTextboxById(state, wrapper.slideObjectId);
}

export const getSelectedText = (state) => {
  const textbox = getSelectedTextbox(state);
  const textstyles = getTextstylesByTextbox(state, textbox);
  return [textbox, textstyles];
}