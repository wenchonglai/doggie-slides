export const RECEIVE_CURRENT_SLIDE = 'RECEIVE_CURRENT_SLIDE';

const receiveCurrentSlide = (slideId) => ({
  type: RECEIVE_CURRENT_SLIDE,
  slideId
});

export const updateCurrentSlide = slideId => dispatch =>
  dispatch(receiveCurrentSlide(slideId));