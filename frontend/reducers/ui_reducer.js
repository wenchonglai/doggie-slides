import * as UIActions from '../actions/ui_actions';
import * as PresentationActions from '../actions/presentation_actions';

export default function UIReducer(state = {}, action){
  Object.freeze(state);

  switch (action.type){
    case PresentationActions.RECEIVE_ENTITIES: {
      const doc = Object.values(action.entities.docs)[0];

      return doc ?
        {...state, docId: doc.id, pageWidth: doc.width, pageHeight: doc.height} :
        {};
    }
    case UIActions.RECEIVE_CURRENT_SLIDE:
      return {...state, slideId: action.slideId};
    case UIActions.RECEIVE_PAGE_SETTINGS: {
      return {...state, ...action.pageSettings}
    };
    case UIActions.CLEAR_UI:
      return {};
    default: return state;
  }
} 