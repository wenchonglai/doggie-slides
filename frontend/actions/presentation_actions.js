import { getTextstylesByTextboxId } from '../selectors/selectors';
import * as PresentationUtils from '../utils/presentation_utils';

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

export const RECEIVE_SLIDE_CONTENT = 'RECEIVE_SLIDE_CONTENT';
export const receiveSlideContent = (data) => ({type: RECEIVE_SLIDE_CONTENT, data});

export const RECEIVE_WRAPPERS = "RECEIVE_WRAPPERS";
export const RECEIVE_WRAPPER = "RECEIVE_WRAPPER";

export const receiveWrappers = (wrappers) => ({type: RECEIVE_WRAPPERS, wrappers});
export const receiveWrapper = (wrapper) => ({type: RECEIVE_WRAPPER, wrapper});

export const RECEIVE_TEXT = "RECEIVE_TEXT";
export const receiveText = (textData, wrapperData) => ({
  type: RECEIVE_TEXT, 
  textData, 
  wrapperData
});

export const RECEIVE_IMAGE = "RECEIVE_IMAGE";
export const receiveImage = (imageData, wrapperData) => ({
  type: RECEIVE_IMAGE, 
  imageData,
  wrapperData
})

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

// slides

export const updateSlide = formData => dispatch => 
  PresentationUtils.asyncUpdateSlide(formData)
    .then((data) => {
      dispatch(receiveSlide(data));
    });

export const fetchSlide = () => (dispatch) => 
  PresentationUtils.asyncFetchSlideContent()
    .then((data) => {
      dispatch(receiveSlide(data))
    })

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

// wrappers

export const updateWrapper = (formWrapper) => (dispatch) => {
  return PresentationUtils.asyncUpdateWrapper(formWrapper)
    .then((resData) => {
      dispatch(receiveWrapper(resData));
      return resData;
    });
}


// texts
export const createText = (textData) => (dispatch) =>
  PresentationUtils.asyncCreateText(textData)
    .then((resData) => {
      const wrapperAttributes = resData.wrapperAttributes;
      const wrapperData = Object.values(wrapperAttributes)[0];

      dispatch(receiveText(resData, wrapperData));
      return resData;
    });

export const updateText = (textboxId, textData) => (dispatch, getState) => {
  const state = getState();
  const {entities, ui} = state;

  const textstyles = getTextstylesByTextboxId(state, textboxId);
  const textstylesAttributes = textData.textstylesAttributes;

  const textstylesAttributeIndexedOnOffset = new Map(
    textstylesAttributes.map(attribute => [attribute.offset, attribute])
  );

  textstyles.forEach(textstyle => {
    let attribute = textstylesAttributeIndexedOnOffset.get(textstyle.offset);

    if (attribute && attribute.offset >= 0){
      attribute.id = textstyle.id;
      delete attribute.textboxId;
    } else {
      textstylesAttributes.push({id: textstyle.id, _destroy: 1});
    }
  });
  
  return PresentationUtils.asyncUpdateText(textboxId, textData)
    .then((resData) => {
      const wrapperAttributes = resData.wrapperAttributes;
      const wrapperData = Object.values(wrapperAttributes)[0];
      
      dispatch(receiveText(resData, wrapperData));
      return resData;
    });
}

export const uploadImage = (formData) => (dispatch, getState) => {
  return PresentationUtils.asyncUploadImage(formData)
    .then((resData) => {
      const {wrapperAttributes} = resData;
      delete resData.wrapperAttributes;
      dispatch(receiveImage(resData, Object.values(wrapperAttributes)[0]));
    })
}

export const moveWrapper = (offset) => (dispatch, getState) => {
  const {entities, ui} = getState();
  const slide_id = ui.slideSettings.slideId;
  const wrapperIds = ui.selections.wrapperIds;

  return PresentationUtils.asyncMoveWrapper({
    wrapper: {
      slide_id, 
      wrapperIds,
      offset
    }
  }).then((resData) => {
    const wrappers = {...entities.wrappers};

    // has to do this; otherwise receiveWrappers will destroy all wrappers not in the slide
    for (let wrapper of Object.values(wrappers))
      if (wrapper.slide_id === slide_id)
        delete wrappers[wrapper.id];

    dispatch(receiveWrappers({...wrappers, ...resData}));
  })
}