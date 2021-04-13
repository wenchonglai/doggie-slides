import {addSlide} from '../../actions/presentation_actions';
import DynamicText from '../../utils/data-structure/dynamic-text';
import ColorPalette from '../utils/color_palette';

const NEW_SLIDE = {
  name: "New Slide", icon: [6, 11], shortCut: undefined, actionName: 'newSlide'
};

const CUT = { name: "Cut", icon: [2, 1], shortCut: undefined, actionName: undefined};
const COPY = { name: "Copy", icon: [3, 1], shortCut: undefined, actionName: undefined};
const PASTE = { name: "Paste", icon: [4, 1], shortCut: undefined, actionName: undefined};
const PASTE_WITHOUT_FORMATTING = { name: "Paste without formatting", icon: [5, 1], shortCut: undefined, actionName: undefined};
const SELECT_ALL = { name: "Select all", icon: undefined, shortCut: undefined, actionName: undefined};
const PRESENT = { name: "Present", icon: undefined, shortCut: undefined, actionName: undefined};
const MASTER = { name: "Master", icon: undefined, shortCut: undefined, actionName: undefined};
const GRID_VIEW = { name: "Grid View", icon: undefined, shortCut: undefined, actionName: undefined};
const ZOOM = { name: "Zoom", icon: [5, 8], children: [
  { name: "Fit", icon: [0, 2], shortCut: undefined, actionName: undefined},
  { name: "50%", icon: undefined, shortCut: undefined, actionName: undefined},
  { name: "100%", icon: undefined, shortCut: undefined, actionName: undefined},
  { name: "200%", icon: undefined, shortCut: undefined, actionName: undefined},
  undefined,
  { name: "Zoom in", icon: undefined, shortCut: undefined, actionName: undefined},
  { name: "Zoom out", icon: undefined, shortCut: undefined, actionName: undefined},
]};
const SPEAKER_NOTES = { name: "speaker notes", icon: undefined, shortCut: undefined, actionName: undefined};
const FULL_SCREEN = { name: "Full Screen", icon: undefined, shortCut: undefined, actionName: undefined};
const IMAGE = { name: "Image", icon: [0, 3], shortCut: undefined, actionName: undefined};
const TEXTBOX = { name: "Text Box", icon: [7, 3], shortCut: undefined, actionName: 'textbox'};
const SHAPE = { name: "Shape", icon: [10, 3], shortCut: undefined, actionName: undefined};
const DUPLICATE_SLIDE = { name: "Duplicate Slide", icon: undefined, shortCut: undefined, actionName: undefined};
const DELETE_SLIDE = { name: "Delete Slide", icon: undefined, shortCut: undefined, actionName: "deleteSlide"};
const SKIP_SLIDE = { name: "Skip Slide", icon: undefined, shortCut: undefined, actionName: "skipSlide"};
const SELECT = { name: "Select", icon: [7, 8], shortCut: undefined, actionName: undefined};
const FILL_COLOR = { name: "Fill color", icon: [0, 9], type: 'color', key: "fill", shortCut: undefined, children: ColorPalette, actionName: 'fillColor'};
const BORDER_COLOR = { name: "Border color", icon: [1, 9], type: 'color', key: "stroke", shortCut: undefined, children: ColorPalette, actionName: 'borderColor'};
const BORDER_WEIGHT = { name: "Border weight", icon: [2, 9], shortCut: undefined, children: [
  { name: "none", shortCut: undefined, actionName: "borderWeight", value: "none"},
  undefined,
  { name: "1px", shortCut: undefined, actionName: "borderWeight", value: 1},
  { name: "2px", shortCut: undefined, actionName: "borderWeight", value: 2},
  { name: "3px", shortCut: undefined, actionName: "borderWeight", value: 3},
  { name: "4px", shortCut: undefined, actionName: "borderWeight", value: 4},
  { name: "6px", shortCut: undefined, actionName: "borderWeight", value: 6},
  { name: "8px", shortCut: undefined, actionName: "borderWeight", value: 8},
]};
const BORDER_DASH = { name: "Border dash", icon: [3, 9], shortCut: undefined, children: [
  { name: "none", shortCut: undefined, actionName: "borderDash", value: ""},
  undefined,
  { name: "short dash", shortCut: undefined, actionName: "borderDash", value: "4 4"},
  { name: "dash", shortCut: undefined, actionName: "borderDash", value: "6 4"},
  { name: "dotted", shortCut: undefined, actionName: "borderDash", value: "1 1"},
  { name: "dash dotted", shortCut: undefined, actionName: "borderDash", value: "8 2 1 2"},
  { name: "dash double dotted", shortCut: undefined, actionName: "borderDash", value: "8 2 1 1 1 2"},
  { name: "long dash", shortCut: undefined, actionName: "borderDash", value: "12 4"},
]};

function getCommonTextStyleByKey(key){
  return (state) => {
    let {selectOffset, cursorOffset} = state.ui.selections;
    let dynamicText = DynamicText.fromCurrentSelection(state);
    return dynamicText.getCommonStyle(...[selectOffset, cursorOffset].sort((a, b) => a - b), key);
  }
}

const BOLD = { name: "Bold", icon: [4, 9], type: 'boolean', trueValue: 'bold', key: getCommonTextStyleByKey('fontWeight'), shortCut: undefined, actionName: 'bold'};
const ITALIC = { name: "Italic", icon: [5, 9], type: 'boolean', trueValue: 'italic', key: getCommonTextStyleByKey('fontStyle'), shortCut: undefined, actionName: 'italic'};
const UNDERLINE = { name: "Underline", icon: [6, 9], type: 'boolean', trueValue: 'underline', key: getCommonTextStyleByKey('textDecoration'), shortCut: undefined, actionName: 'underline'};
const TEXT_COLOR = { name: "Text color", icon: [7, 9], type: 'color', key: getCommonTextStyleByKey('fill'), shortCut: undefined, children: ColorPalette, actionName: 'textColor'};
const HIGHLIGHT_COLOR = { name: "Highlight color", icon: [8, 9], shortCut: undefined, children: ColorPalette, actionName: 'highlightColor'};

const ALIGN = { name: "Align", icon: [11, 9], shortCut: undefined, actionName: undefined, children: [
  { name: "Left", icon: [0, 6], shortCut: undefined, actionName: undefined},
  { name: "Center", icon: [1, 6], shortCut: undefined, actionName: undefined},
  { name: "Right", icon: [2, 6], shortCut: undefined, actionName: undefined},
  { name: "Justify", icon: [3, 6], shortCut: undefined, actionName: undefined},
]};

const CROP_IMAGE = { name: "Crop image", icon: [5, 10], shortCut: undefined, actionName: undefined};
const RESET_IMAGE = { name: "Reset image", icon: [6, 10], shortCut: undefined, actionName: undefined};

const DELETE_WRAPPER = { name: "delete", icon: undefined, shortCut: undefined, actionName: "deleteWrappers"};

export const MENU_ITEMS = [
  { name: "Edit", icon: undefined, children: [
    CUT, COPY, PASTE, PASTE_WITHOUT_FORMATTING, SELECT_ALL
  ]},
  { name: "View", icon: undefined, children: [
    PRESENT, undefined, GRID_VIEW, ZOOM, undefined, SPEAKER_NOTES, undefined, FULL_SCREEN
    
  ]},
  { name: "Insert", icon: undefined, children: [
    IMAGE, TEXTBOX, SHAPE
  ]},
  { name: "Slide", icon: undefined, children: [
    NEW_SLIDE, DUPLICATE_SLIDE, DELETE_SLIDE, SKIP_SLIDE
  ]}
];

export const BASE_TOOLBAR_ITEMS = [
  NEW_SLIDE, undefined, ZOOM, SELECT, TEXTBOX, IMAGE, SHAPE
];

export const TEXTBOX_TOOLBAR_ITEMS = [
  ...BASE_TOOLBAR_ITEMS, undefined, 
  FILL_COLOR, BORDER_COLOR, BORDER_WEIGHT, BORDER_DASH, undefined,
  BOLD, ITALIC, UNDERLINE, TEXT_COLOR, HIGHLIGHT_COLOR, undefined, 
  ALIGN
];

export const IMAGE_TOOLBAR_ITEMS = [
  ...BASE_TOOLBAR_ITEMS, undefined, 
  BORDER_COLOR, BORDER_WEIGHT, BORDER_DASH, undefined,
  CROP_IMAGE, RESET_IMAGE
];

export const SLIDE_CONTEXT_MENU_ITEMS = [
  DELETE_SLIDE
];

export const WRAPPER_CONTEXT_MENU_ITEMS = [
  DELETE_WRAPPER
];