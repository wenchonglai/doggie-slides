import * as PresentationActions from '../actions/presentation_actions';
import * as UIActions from '../actions/ui_actions';
import { getSelectedText, getSelectedTextbox, getTextboxByWrapper } from '../selectors/selectors';
import DynamicText from '../utils/data-structure/dynamic-text';
import * as PresentationUtils from '../utils/presentation_utils';

export const newSlide = () => (dispatch, getState) => {
  const {ui, entities} = getState();
  const reqSlide = {
    docId: ui.pageSettings.docId,
    page: entities.slides[ui.slideSettings.slideId].page + 1,
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
  const slideId = ui.slideSettings.slideId;
  const page = entities.slides[slideId].page;
  const maxPage = Math.max(...Object.values(entities.slides).map(slide => slide.page));

  return PresentationUtils.asyncDeleteSlide(slideId)
    .then(resSlides => {
      const newSlideId = Object.values(resSlides)
        .filter(slide => slide.page == page - (page == maxPage ? 1 : 0) )[0]
        .id;

      dispatch(PresentationActions.receiveSlides(resSlides));
      dispatch(UIActions.receiveCurrentSlide(newSlideId));
    }, (err) => {console.log(err)});
}

export const skipSlide = () => (dispatch, getState) => {
  const {ui, entities} = getState();
  const reqSlide = {...entities.slides[ui.slideSettings.slideId]};
  reqSlide.skipped = !reqSlide.skipped

  return dispatch(PresentationActions.receiveSlide(resSlide));
}

export const textbox = () => (dispatch, getState) => {
  return new Promise(res => {
    res();
  }).then(() => {dispatch(UIActions.updateMenuAction('Text Box'))})
  
  
  // PresentationUtils.asyncUpdateSlide(reqSlide)
  //   .then(resSlide => {
  //     dispatch(PresentationActions.receiveSlide(resSlide));
  //   }, (err) => {console.log(err)});
}

export const updateWrapperAttribute = (key) => 
  (value) => (dispatch, getState) => {
    const {ui, entities} = getState();
    const wrappers = ui.selections.wrapperIds.map(
      id => entities.wrappers[id]
    );

    if (wrappers.length > 1){ console.warn('The feature of updating multiple wrappers is yet to be implemented.'); }

    const wrapper = {...wrappers[0], [key]: value}

    return wrapper && PresentationUtils.asyncUpdateWrapper(wrapper)
      .then(resWrapper => {
        dispatch(PresentationActions.receiveWrapper(resWrapper));
      }, (err) => {console.log(err)});
  }

export const fillColor = updateWrapperAttribute('fill');
export const borderColor = updateWrapperAttribute('stroke');
export const borderWeight = updateWrapperAttribute('strokeWidth');
export const borderDash = updateWrapperAttribute('stroke-dasharray');

export const bold = (...args) => (dispatch, getState) => {
  const {ui, entities} = getState();

  console.log(ui);
}

export const deleteWrappers = () => (dispatch, getState) => {
  const {entities, ui} = getState();
  const slideId = ui.slideSettings.slideId;

  const slideData = {
    ...entities.slides[slideId], 
    wrappersAttributes: ui.selections.wrapperIds.map(id => ({id, _destroy: 1}))
  };

  delete slideData.wrapperIds;

  // currently only supports deleting one feature
  return PresentationUtils.asyncDeleteWrappers(slideId, slideData)
    .then((resData) => {
      dispatch(PresentationActions.receiveSlide(resData));
      return resData;
    });
}

export const updateTextstyleAttribute = (key) => 
  (value) => (dispatch, getState) => {
    const state = getState();
    const {entities, ui} = state;
    const {selectOffset, cursorOffset} = ui.selections;
    const textbox = getSelectedTextbox(state);
    const dynamicText = DynamicText.fromTexbox(state, textbox);
 
    dynamicText.setStyle(
      ...[cursorOffset, selectOffset].sort((a, b) => a - b),
      {[key]: value}
    );

    dispatch(PresentationActions.updateText(textbox.id, dynamicText.toReduxState()));
    // if (wrappers.length > 1){ console.warn('The feature of updating multiple wrappers is yet to be implemented.'); }

    // return wrapper && PresentationUtils.asyncUpdateWrapper(wrapper)
    //   .then(resWrapper => {
    //     dispatch(PresentationActions.receiveWrapper(resWrapper));
    //   }, (err) => {console.log(err)});
  }

export const textColor = updateTextstyleAttribute('fill');