import * as PresentationUtils from '../utils/presentation_utils';
import { receiveCurrentSlide, updatePageSettings } from './ui_actions';

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

export const fetchPresentation = () => (dispatch, getState) =>
  PresentationUtils.asyncFetchPresentation()
    .then((entities) => {
      const doc = Object.values(entities.docs)[0];
      const ui = getState();

      if (!doc.slideIds.includes(ui.slideId)){
        const locationArr = window.location.href.split('/');
        const newSlideId = Object.values(entities.slides).sort((a, b) => a.page - b.page)[0].id;
        const href = locationArr.join('/');
        const newHref = [...locationArr.slice(0, -1), newSlideId].join('/');

        dispatch(receiveCurrentSlide(newSlideId));

        location.replace(`#/presentation/${newSlideId}`);
      }
      
      dispatch(updatePageSettings({pageWidth: doc.width, pageHeight: doc.height}));
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