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
    }, (err) => {console.error(err)});
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
    }, (err) => {console.error(err)});
}

export const skipSlide = () => (dispatch, getState) => {
  const {ui, entities} = getState();
  const reqSlide = {...entities.slides[ui.slideSettings.slideId]};
  reqSlide.skipped = !reqSlide.skipped;

  return dispatch(PresentationActions.updateSlide(reqSlide));
}

export const select = () => (dispatch, getState) => {
  return new Promise(res => res())
    .then(() => dispatch(UIActions.updateMenuAction('Select')))
}

export const textbox = () => (dispatch, getState) => {
  return new Promise(res => res())
    .then(() => dispatch(UIActions.updateMenuAction('Text Box')))
}

export const circle = () => (dispatch, getState) => {
  return new Promise(res => res())
    .then(() => dispatch(UIActions.updateMenuAction('shape(circle)')))
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
      }, (err) => {console.error(err)});
  }

export const fillColor = updateWrapperAttribute('fill');
export const borderColor = updateWrapperAttribute('stroke');
export const borderWeight = updateWrapperAttribute('strokeWidth');
export const borderDash = updateWrapperAttribute('stroke-dasharray');

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

export const updateTextstyleAttributeCreator = (key) => 
  (value) => (dispatch, getState) => {
    const state = getState();
    const {entities, ui} = state;
    const {selectOffset, cursorOffset} = ui.selections;
    const textbox = getSelectedTextbox(state);
    const dynamicText = DynamicText
      .fromTexbox(state, textbox)
      .setStyle(
        ...[cursorOffset, selectOffset].sort((a, b) => a - b),
        {[key]: value}
      );
    const dynamicTextReduxState = dynamicText.toReduxState();

    dispatch(PresentationActions.updateText(textbox.id, dynamicTextReduxState));
  }

export const textColor = updateTextstyleAttributeCreator('fill');
export const bold = updateTextstyleAttributeCreator('fontWeight');
export const italic = updateTextstyleAttributeCreator('fontStyle');
export const underline = updateTextstyleAttributeCreator('textDecoration');
export const fontFamily = updateTextstyleAttributeCreator('fontFamily');
export const fontSize = updateTextstyleAttributeCreator('fontSize');

export const updateFontSizeCreator = (value) =>
  () => (dispatch, getState) => {
    const state = getState();
    const {selectOffset, cursorOffset} = state.ui.selections;
    const textbox = getSelectedTextbox(state);
    const dynamicText = DynamicText
      .fromTexbox(state, textbox)
      .changeFontSize(
        ...[cursorOffset, selectOffset].sort((a, b) => a - b),
        value
      );
    const dynamicTextReduxState = dynamicText.toReduxState();
    
    dispatch(PresentationActions.updateText(textbox.id, dynamicTextReduxState));
  }

export const increaseFontSize = updateFontSizeCreator(2);
export const decreaseFontSize = updateFontSizeCreator(-2);

export const uploadFromComputer = (formData) => (dispatch, getState) => {
  const {ui} = getState();
  const slideId = ui.slideSettings.slideId;

  formData.append("image[wrapper_attributes[slide_id]]", slideId);
  return dispatch(PresentationActions.uploadImage(formData));
}

const moveWrapperCreator = (offset) => () => (dispatch, getState) => {
  return dispatch(PresentationActions.moveWrapper(offset));
}

export const bringToFront = moveWrapperCreator(65535);
export const bringForward = moveWrapperCreator(1);
export const sendBackward = moveWrapperCreator(-1);
export const sendToBack = moveWrapperCreator(-65535);

export const zoom = value => dispatch =>
  dispatch(UIActions.updateZoomLevel(value));

export const zoomIn = () => (dispatch, getState) => {
  const {ui} = getState();
  const {zoom} = ui.slideSettings;

  return dispatch(UIActions.updateZoomLevel(Math.min((zoom || 1) * 2, 8)));
}

export const zoomOut = () => (dispatch, getState) => {
  const {ui} = getState();
  const {zoom} = ui.slideSettings;

  return dispatch(UIActions.updateZoomLevel(Math.max((zoom || 1) / 2, 0.125)));
}

export const present = () => (dispatch, getState) => {
  const {ui} = getState();
  const {slideId} = ui.slideSettings;

  return dispatch(UIActions.enterPresentMode(slideId))
}

export const changeBackground = value => (dispatch, getState) => {
  const {ui, entities} = getState();
  const {slideId} = ui.slideSettings;
  const slide = entities.slides[slideId];

  dispatch(PresentationActions.updateSlide({...slide, background: value}));
}

export const cropImage = () => dispatch => 
  dispatch(UIActions.updateEditMode(true))