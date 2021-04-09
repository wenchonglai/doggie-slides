import * as PresentationUtils from '../utils/presentation_utils';
import { receiveCurrentSlide, updatePageSettings } from './ui_actions';

function actionCreatorCreator({verb='receive', noun, nouns = noun + 's'}){
  const verbNoun = verb.toLowerCase() + noun[0].toUpperCase() + noun.substring(1).toLowerCase();
  const verbNouns = verb.toLowerCase() + nouns[0].toUpperCase() + nouns.substring(1).toLowerCase();
  const VERB_NOUN = [verb, noun].map(x => x.toUpperCase()).join('_');
  const VERB_NOUNS = [verb, nouns].map(x => x.toUpperCase()).join('_');

  return (
    `export const ${VERB_NOUNS} = "${VERB_NOUNS}";\nexport const ${VERB_NOUN} = "${VERB_NOUN}";\n\nexport const ${verbNouns} = (${nouns}) => ({type: ${VERB_NOUNS}, ${nouns}});\nexport const ${verbNoun} = (${noun}) => ({type: ${VERB_NOUN}, ${noun}});\n`
  )
}

export const RECEIVE_ENTITIES = 'RECEIVE_ENTITIES';
export const receiveEntities = (entities) => ({type: RECEIVE_ENTITIES, entities});

export const RECEIVE_DOCS = 'RECEIVE_DOCS';
export const RECEIVE_DOC = 'RECEIVE_DOC';

export const receiveDocs = (docs) => ({ type: RECEIVE_DOCS, docs });
export const receiveDoc = (doc) => ({ type: RECEIVE_DOC, doc });

export const RECEIVE_SLIDES = 'RECEIVE_SLIDES';
export const RECEIVE_SLIDE = 'RECEIVE_SLIDE';

export const receiveSlides = (slides) => ({ type: RECEIVE_SLIDES, slides });
export const receiveSlide = (slide) => ({ type: RECEIVE_SLIDE, slide });

export const RECEIVE_WRAPPERS = "RECEIVE_WRAPPERS";
export const RECEIVE_WRAPPER = "RECEIVE_WRAPPER";

export const receiveWrappers = (wrappers) => ({type: RECEIVE_WRAPPERS, wrappers});
export const receiveWrapper = (wrapper) => ({type: RECEIVE_WRAPPER, wrapper});

export const RECEIVE_TEXT = "RECEIVE_TEXT";
export const receiveText = (data) => ({type: RECEIVE_TEXT, data});

export const RECEIVE_TEXTBOXES = "RECEIVE_TEXTBOXES";
export const RECEIVE_TEXTBOX = "RECEIVE_TEXTBOX";

export const receiveTextboxes = (textboxes) => ({type: RECEIVE_TEXTBOXES, textboxes});
export const receiveTextbox = (textbox) => ({type: RECEIVE_TEXTBOX, textbox});

export const RECEIVE_TEXTSTYLES = "RECEIVE_TEXTSTYLES";
export const RECEIVE_TEXTSTYLE = "RECEIVE_TEXTSTYLE";

export const receiveTextstyles = (textstyles) => ({type: RECEIVE_TEXTSTYLES, textstyles});
export const receiveTextstyle = (textstyle) => ({type: RECEIVE_TEXTSTYLE, textstyle});

// thunk action creators below

export const fetchPresentation = () => (dispatch, getState) =>
  PresentationUtils.asyncFetchPresentation()
    .then((entities, ...args) => {
      dispatch(receiveEntities(entities));
      // const doc = Object.values(entities.docs)[0];
      // doc && dispatch(updatePageSettings({docId: doc.id, pageWidth: doc.width, pageHeight: doc.height}));
      // dispatch(receiveDocs(entities.docs));
      // dispatch(receiveSlides(entities.slides));
      // dispatch(receiveWrappers(entities.wrappers));
      // dispatch(receiveTextstyles(entities.textstyles));
      // dispatch(receiveTextboxes(entities.textboxes));
      
      return entities;
    }, (err) => {});

export const updateDoc = (formDoc) => (dispatch) => 
  PresentationUtils.asyncUpdateDoc(formDoc)
    .then((doc) => {
      dispatch(receiveDoc(doc));
      return doc;
    });

export const moveSlide = ({start, end=start, offset}) => (dispatch) => {
  return PresentationUtils.asyncMoveSlide({start, end, offset})
    .then((slides) => {
      dispatch(receiveSlides(slides));
      return slides;
    });
}

export const addSlide = (formSlide) => (dispatch) => 
  PresentationUtils.asyncAddSlide(formSlide)
    .then((slide) => {
      dispatch(receiveSlide(slide));
      return slide;
    });

export const createText = (textboxData) => (dispatch) => 
  PresentationUtils.asyncUpdateText(textboxData)
    .then((resData) => {
      dispatch(receiveText(resData));
      return resData;
    });

export const updateText = (textboxId, textboxData) => (dispatch) => 
  PresentationUtils.asyncUpdateText(textboxId, textboxData)
    .then((resData) => {
      dispatch(receiveText(resData));
      return resData;
    });

export const updateWrapper = (formWrapper) => (dispatch) => 
  PresentationUtils.asyncUpdateText(formWrapper)
    .then((resData) => {
      dispatch(receiveWrapper(resData));
      return resData;
    });