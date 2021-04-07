export const RECEIVE_PAGE_SETTINGS = 'RECEIVE_PAGE_SETTINGS';
export const RECEIVE_CURRENT_SLIDE = 'RECEIVE_CURRENT_SLIDE';
export const CLEAR_UI = 'CLEAR_UI';

export const receiveCurrentSlide = (slideId) => ({
  type: RECEIVE_CURRENT_SLIDE,
  slideId
});

const receivePageSettings = (pageSettings) => ({
  type: RECEIVE_PAGE_SETTINGS,
  pageSettings
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
    newURL = `/#/presentation/${ui.docId}/slides/${slideId}`;
  }
 
  dispatch(receiveCurrentSlide(slideId));
  window.location.replace(newURL);
}

export const updatePageSettings = slideId => dispatch =>
  dispatch(receivePageSettings(slideId));