import * as PresentationUtils from '../utils/presentation_utils';
import { receiveCurrentSlide, updatePageSettings } from './ui_actions';

export const RECEIVE_DOCS = 'RECEIVE_DOCS';
export const RECEIVE_DOC = 'RECEIVE_DOC';
export const RECEIVE_SLIDES = 'RECEIVE_SLIDES';
export const RECEIVE_SLIDE = 'RECEIVE_SLIDE';

const receiveDocs = (docs) => ({
  type: RECEIVE_DOCS,
  docs
});

const receiveDoc = (doc) => ({
  type: RECEIVE_DOC,
  doc
});


export const receiveSlides = (slides) => ({
  type: RECEIVE_SLIDES,
  slides
});

export const receiveSlide = (slide) => ({
  type: RECEIVE_SLIDE,
  slide
});

export const fetchPresentation = () => (dispatch, getState) =>
  PresentationUtils.asyncFetchPresentation()
    .then((entities, ...args) => {
      const doc = Object.values(entities.docs)[0];
      doc && dispatch(updatePageSettings({docId: doc.id, pageWidth: doc.width, pageHeight: doc.height}));
      dispatch(receiveDocs(entities.docs));
      dispatch(receiveSlides(entities.slides));
      
      return entities;
    }, (err) => {});

export const updateDoc = (formDoc) => (dispatch) => 
  PresentationUtils.asyncUpdateDoc(formDoc)
    .then((doc) => {
      dispatch(receiveDoc(doc));
      return doc;
    });

export const moveSlide = ({start, end=start, offset}) => (dispatch) => 
  PresentationUtils.asyncMoveSlide({start, end, offset})
    .then((slides) => {
      dispatch(receiveSlides(slides));
      return slides;
    });

export const addSlide = (formSlide) => (dispatch) => 
  PresentationUtils.asyncAddSlide(formSlide)
    .then((slide) => {
      dispatch(receiveSlide(slide));
      return slide;
    });