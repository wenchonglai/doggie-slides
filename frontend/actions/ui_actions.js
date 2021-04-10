export const RECEIVE_PAGE_SETTINGS = 'RECEIVE_PAGE_SETTINGS';
export const RECEIVE_CURRENT_SLIDE = 'RECEIVE_CURRENT_SLIDE';
export const RECEIVE_SELECTED_WRAPPERS = 'RECEIVE_SELECTED_WRAPPERS';
export const REMOVE_SELECTED_WRAPPERS = 'REMOVE_SELECTED_WRAPPERS';
export const CLEAR_UI = 'CLEAR_UI';

export const receiveCurrentSlide = (slideId) => ({
  type: RECEIVE_CURRENT_SLIDE,
  slideId
});

export const receiveSelectedWrappers = ({wrapperIds, sharedAttributes}) => ({
  type: RECEIVE_SELECTED_WRAPPERS,
  wrapperIds,
  sharedAttributes
});

export const removeSelectedWrappers = () => ({
  type: REMOVE_SELECTED_WRAPPERS,
});

// const receivePageSettings = (pageSettings) => ({
//   type: RECEIVE_PAGE_SETTINGS,
//   pageSettings
// });

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
  
  dispatch(receiveSelectedWrappers(
    getWrapperSelectionInfo(wrapperIds, entities))
  );
}