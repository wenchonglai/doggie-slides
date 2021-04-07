import * as PresentationActions from '../actions/presentation_actions';
import * as UIActions from '../actions/ui_actions';
import * as PresentationUtils from '../utils/presentation_utils';

export const newSlide = () => (dispatch, getState) => {
  const {ui, entities} = getState();
  const reqSlide = {
    docId: ui.docId,
    page: entities.slides[ui.slideId].page + 1,
    skipped: false
  }

  return PresentationUtils.asyncAddSlide(reqSlide)
    .then(resSlides => {
      const newSlideId = Math.max(...Object.keys(resSlides));

      dispatch(PresentationActions.receiveSlides(resSlides));
      dispatch(UIActions.receiveCurrentSlide(newSlideId));
    }, (err) => {console.log(err)});
}

export const deleteSlide = () => (dispatch, getState) => {
  const {ui, entities} = getState();
  const slideId = ui.slideId;
  const page = entities.slides[slideId].page;

  return PresentationUtils.asyncDeleteSlide(slideId)
    .then(resSlides => {
      const newSlideId = Object.values(resSlides).filter(slide => slide.page == page)[0].id;

      dispatch(PresentationActions.receiveSlides(resSlides));
      dispatch(UIActions.receiveCurrentSlide(newSlideId));
    }, (err) => {console.log(err)});
}

export const skipSlide = () => (dispatch, getState) => {
  const {ui, entities} = getState();
  const reqSlide = {...entities.slides[ui.slideId]};
  reqSlide.skipped = !reqSlide.skipped

  return PresentationUtils.asyncUpdateSlide(reqSlide)
    .then(resSlide => {
      dispatch(PresentationActions.receiveSlide(resSlide));
    }, (err) => {console.log(err)});
}