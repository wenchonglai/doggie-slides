import * as PresentationUtils from '../utils/presentation_utils';
import { updatePageSettings } from './ui_actions';

export const RECEIVE_DOCS = 'RECEIVE_DOCS';
export const RECEIVE_DOC = 'RECEIVE_DOC';
export const RECEIVE_SLIDES = 'RECEIVE_SLIDES';

const receiveDocs = (docs) => ({
  type: RECEIVE_DOCS,
  docs
});

const receiveDoc = (doc) => ({
  type: RECEIVE_DOC,
  doc
});


const receiveSlides = (slides) => ({
  type: RECEIVE_SLIDES,
  slides
});

export const fetchPresentation = () => (dispatch) =>
  PresentationUtils.asyncFetchPresentation()
    .then((entities) => {
      let doc = Object.values(entities.docs)[0];
      dispatch(updatePageSettings({pageWidth: doc.width, pageHeight: doc.height}));
      dispatch(receiveDocs(entities.docs));
      dispatch(receiveSlides(entities.slides));
      return entities;
    }, (err) => {console.log(err)});

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