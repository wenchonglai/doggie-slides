import { getTextboxById, getTextstylesByTextbox } from "../selectors/selectors";

export const RECEIVE_PAGE_SETTINGS = 'RECEIVE_PAGE_SETTINGS';
export const RECEIVE_CURRENT_SLIDE = 'RECEIVE_CURRENT_SLIDE';
export const RECEIVE_PRESENTING_SLIDE = 'RECEIVE_PRESENTING_SLIDE';
export const RECEIVE_SELECTED_WRAPPERS = 'RECEIVE_SELECTED_WRAPPERS';
export const RECEIVE_SELECTED_TEXT = 'RECEIVE_SELECTED_TEXT';
export const RECEIVE_MENU_ACTION = 'RECEIVE_MENU_ACTION';
export const CLEAR_UI = 'CLEAR_UI';

export const receiveCurrentSlide = (slideId) => ({
  type: RECEIVE_CURRENT_SLIDE,
  slideId
});

export const receivePresentingSlide = (slideId) => ({
  type: RECEIVE_PRESENTING_SLIDE,
  slideId
})

export const receiveSelectedWrappers = ({wrapperIds, sharedAttributes}) => ({
  type: RECEIVE_SELECTED_WRAPPERS,
  wrapperIds,
  sharedAttributes
});

export const receiveSelectedText = (args) => ({
  type: RECEIVE_SELECTED_TEXT,
  ...args
});

// const receivePageSettings = (pageSettings) => ({
//   type: RECEIVE_PAGE_SETTINGS,
//   pageSettings
// });

export const receiveMenuAction = (nextMenuAction) => ({
  type: RECEIVE_MENU_ACTION,
  nextMenuAction
});

export const clearUI = () => ({
  type: CLEAR_UI
})

export const updateCurrentSlide = slideId => (dispatch, getState) => {
  let {ui} = getState();
  let newURL = '';

  if (!slideId){
    const slides = getState().entities.slides;
    const slide = Object.values(slides).sort((a, b) => a.page - b.page)[0];

    slideId = slide.id;
    newURL = `/#/presentation/${slide.docId}/slides/${slideId}`;
  } else {
    newURL = `/#/presentation/${ui.pageSettings.docId}/slides/${slideId}`;
  }
 
  dispatch(receiveCurrentSlide(slideId));
  window.location.replace(newURL);
}

function getCommonAttributes(obj1, obj2, ...keys){
  const returnVal = {};

  (keys || Object.keys(obj1)).forEach(key => {
    if (obj1[key] === obj2[key]) returnVal[key] = obj1[key];
  })

  return returnVal;
}

function getWrapperSelectionInfo(wrapperIds, entities){
  const wrappers = wrapperIds.map(id => entities.wrappers[id]);

  const sharedAttributes = wrapperIds.length ? wrappers
    .reduce((obj, curr) => 
      getCommonAttributes(obj, curr,
        'stroke', 'fill', 'strokeWidth', 'strokeDasharray', 'slideObjectType'
      ), wrappers[0]
    ) : {};

  return {wrapperIds, sharedAttributes};
}


export const updateWrapperSelection = wrapperIds => (dispatch, getState) => {
  const {entities} = getState();

  dispatch(receiveSelectedWrappers(
    getWrapperSelectionInfo(wrapperIds, entities))
  );
}

export const deleteWrapperSelection = (arg) => (dispatch, getState) => {
  const {entities, ui} = getState();
  const wrapperIds = ui.selections.wrapperIds.filter(id => !arg.includes(id));

  if (wrapperIds.length)
    dispatch(receiveSelectedWrappers(
      getWrapperSelectionInfo(wrapperIds, entities))
    );
}

export const updateUITextSelection = ({cursorOffset, selectOffset, textboxId, uiTextData}) => 
  (dispatch, getState) => {
  // cursorOffset: 7
  // selectOffset: 7
  // textboxId: 335
  // uiTextData:
  // text: "012345679012356789"
  //   textstylesAttributes: Array(3)
  //     0: {offset: 0, styleString: "font: 48px comic sans ms; fill: green"}
  //     1: {offset: 3, styleString: "font: 48px comic sans ms; fill: #ffaf3f"}
  //     2: {offset: 17, styleString: "font: 48px comic sans ms; fill: green"}
    const state = getState();
    const textBox = getTextboxById(state, textboxId);       
    const prevTextstyleAttributes = getTextstylesByTextbox(state, textBox);  //array
    const {text, textstylesAttributes} = uiTextData;
    const textstyleIds = [];

    for (let i = 0, len = prevTextstyleAttributes.length, textLen = text.length; i < len; i++){
      let prevAttribute = prevTextstyleAttributes[i];
      let newAttribute = textstylesAttributes[i];

      if (newAttribute && (!textLen || newAttribute.offset < textLen) ){
        textstylesAttributes[i] = {...prevAttribute, ...newAttribute};
      } else {
        textstylesAttributes[i] = {id: prevAttribute.id, offset: -1, _destroy: 1}
      }
      textstyleIds.push(prevAttribute.id);
    }

    dispatch(receiveSelectedText({
      cursorOffset,
      selectOffset,
      textboxData: {
        [textboxId]: {
          id: textboxId,
          text,
          textstyleIds
        }
      },
      textstyleData: Object.fromEntries(
        textstylesAttributes
          .filter(x => x.id !== undefined)
          .map(x => [x.id, x])
      )
    }))
  }

export const updateMenuAction = (action) => (dispatch, getState) => {
  dispatch(receiveMenuAction(action));
}

export const enterPresentMode = (slideId, handle) => dispatch => {
  dispatch(receivePresentingSlide(slideId));
}