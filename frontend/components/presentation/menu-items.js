const NEW_SLIDE = { name: "New Slide", icon: [6, 11], shortCut: undefined, action: undefined};
const CUT = { name: "Cut", icon: [2, 1], shortCut: undefined, action: undefined};
const COPY = { name: "Copy", icon: [3, 1], shortCut: undefined, action: undefined};
const PASTE = { name: "Paste", icon: [4, 1], shortCut: undefined, action: undefined};
const PASTE_WITHOUT_FORMATTING = { name: "Paste without formatting", icon: [5, 1], shortCut: undefined, action: undefined};
const SELECT_ALL = { name: "Select all", icon: undefined, shortCut: undefined, action: undefined};
const PRESENT = { name: "Present", icon: undefined, shortCut: undefined, action: undefined};
const MASTER = { name: "Master", icon: undefined, shortCut: undefined, action: undefined};
const GRID_VIEW = { name: "Grid View", icon: undefined, shortCut: undefined, action: undefined};
const ZOOM = { name: "Zoom", icon: [5, 8], children: [
  { name: "Fit", icon: [0, 2], shortCut: undefined, action: undefined},
  { name: "50%", icon: undefined, shortCut: undefined, action: undefined},
  { name: "100%", icon: undefined, shortCut: undefined, action: undefined},
  { name: "200%", icon: undefined, shortCut: undefined, action: undefined},
  { name: "Zoom in", icon: undefined, shortCut: undefined, action: undefined},
  { name: "Zoom out", icon: undefined, shortCut: undefined, action: undefined},
]};
const SPEAKER_NOTES = { name: "speaker notes", icon: undefined, shortCut: undefined, action: undefined};
const FULL_SCREEN = { name: "Full Screen", icon: undefined, shortCut: undefined, action: undefined};
const IMAGE = { name: "Image", icon: [0, 3], shortCut: undefined, action: undefined};
const TEXTBOX = { name: "Text Box", icon: [7, 3], shortCut: undefined, action: undefined};
const SHAPE = { name: "Shape", icon: [10, 3], shortCut: undefined, action: undefined};
const DUPLICATE_SLIDE = { name: "Duplicate Slide", icon: undefined, shortCut: undefined, action: undefined};
const DELETE_SLIDE = { name: "Delete Slide", icon: undefined, shortCut: undefined, action: undefined};
const SKIP_SLIDE = { name: "Skip Slide", icon: undefined, shortCut: undefined, action: undefined};
const SELECT = { name: "Select", icon: [7, 8], shortCut: undefined, action: undefined};

const FILL_COLOR = { name: "Fill color", icon: [0, 9], shortCut: undefined, action: undefined};
const BORDER_COLOR = { name: "Border color", icon: [1, 9], shortCut: undefined, action: undefined};
const BORDER_WEIGHT = { name: "Border weight", icon: [2, 9], shortCut: undefined, action: undefined};
const BORDER_DASH = { name: "Border dash", icon: [3, 9], shortCut: undefined, action: undefined};

const BOLD = { name: "Bold", icon: [4, 9], shortCut: undefined, action: undefined};
const ITALIC = { name: "Italic", icon: [5, 9], shortCut: undefined, action: undefined};
const UNDERLINE = { name: "Underline", icon: [6, 9], shortCut: undefined, action: undefined};
const TEXT_COLOR = { name: "Text color", icon: [7, 9], shortCut: undefined, action: undefined};
const HIGHLIGHT_COLOR = { name: "Highlight color", icon: [8, 9], shortCut: undefined, action: undefined};

const ALIGN = { name: "Align", icon: [11, 9], shortCut: undefined, action: undefined, children: [
  { name: "Left", icon: [0, 6], shortCut: undefined, action: undefined},
  { name: "Center", icon: [1, 6], shortCut: undefined, action: undefined},
  { name: "Right", icon: [2, 6], shortCut: undefined, action: undefined},
  { name: "Justify", icon: [3, 6], shortCut: undefined, action: undefined},
]};

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