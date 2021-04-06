export const RECEIVE_PAGE_SETTINGS = 'RECEIVE_PAGE_SETTINGS';
export const RECEIVE_CURRENT_SLIDE = 'RECEIVE_CURRENT_SLIDE';

const receiveCurrentSlide = (slideId) => ({
  type: RECEIVE_CURRENT_SLIDE,
  slideId
});

const receivePageSettings = (pageSettings) => ({
  type: RECEIVE_PAGE_SETTINGS,
  pageSettings
});

export const updateCurrentSlide = slideId => dispatch =>
  dispatch(receiveCurrentSlide(slideId));

export const updatePageSettings = slideId => dispatch =>
  dispatch(receivePageSettings(slideId));