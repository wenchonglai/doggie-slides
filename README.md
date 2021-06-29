# DoggIe Slides

**[Click Here to Launch the App](https://doggie-slides.herokuapp.com/)**

Welcome to DoggIe Slides! DoggIe Slides, a clone of Google Slides, is a full-stack, single-page editing and presentation application that supports the create, read, update, delete, as well as rendering of basic slides, texts, and graphics. The system design utilizes React Hooks and Redux in the front end, Ruby on Rails in the backend, as well as a PostgresSQL database. A SVGTextArea component, powered by the DynamicText text editing engine developed by the user, was implemented for better multi-line svg text editing.

## Technologies
- Vendor Libraries
  - React/Redux
    - with React-Redux and React-Router
  - SASS/CSS
  - Webpack
  - Ruby on Rails
  - PostgreSQL
- User Libraries
  - Dynamic Text
  - SortedMap

## Key Features

### Textbox Editing
* The developer designed the SVG-based DynamicText that implements the richtext data structure and serves as a multi-line text editing engine
* Throttling function, animation frame controls, as well as ad-hoc keyboard event listeners responsive to React component life cycles were implemented to support smooth text insertion, deletion, selection, which were not originally supported by SVG1.1

```jsx
// svg_textarea.jsx
function SVGTextArea({/* ... */}){
  const textRef = useRef();
  const inputCacheRef = useRef('');
  const eventListenerRef = useRef();

  function keyDownListener(e){
    cancelAnimationFrame(animationFrameRef.current);
    // ...
    let inputCache = inputCacheRef.current;

    animationFrameRef.current = requestAnimationFrame( () => {
      // ...
      textRef.current.insert(inputCacheRef.current, cursorOffsetRef.current);
      inputCacheRef.current = '';

      updateUITextSelection({
        // ...
        uiTextData: textRef.current.toReduxState(),
        // ...
      });
      // ...
    });
  }

  useEffect(() => {
    document.removeEventListener('keydown', eventListenerRef.current);

    if (active){
      eventListenerRef.current = keyDownListener;
      document.addEventListener('keydown', eventListenerRef.current);
    }
  }, [active]);

  useEffect(() => {
    eventListenerRef.current = keyDownListener;
    
    return () => {
      document.removeEventListener('keydown', eventListenerRef.current);
      eventListenerRef.current = undefined;
    }
  }, []);

  //...

  return (
    <g {/*...*/}>
      {/*...*/}
    </g>
  )
}
```

```jsx
// dynamic-text.js
class DynamicText{
  static fromCurrentSelection(state){
    const textData = getSelectedText(state);
    return new DynamicText(textData[0].text, textData[1].map(({offset, styleString}) => ({offset, styleString})));
  }

  static fromTexbox(state, textbox){
    const textstyles = getTextstylesByTextbox(state, textbox);
    return new DynamicText(textbox.text, textstyles.map(({offset, styleString}) => ({offset, styleString})))
  }

  constructor(text = '', styleStrings){
    this._text = '';
    this._bufferSize = 256;
    this._indices = {
      spaces: new SortedArray(),
      tabs: new SortedArray(),
      returns: new SortedArray()
    };

    this._styleMap = new SortedMap(
      styleStrings
        .filter(
          styleString => styleString.offset >= 0 && 
            styleString.offset <= text.length
        ).map(
          styleString => 
            [styleString.offset, parseStyleString(styleString.styleString)]
        )
    );

    this._segmentMap = new SortedMap();
    
    /* ... */
    
    this.insert(text, 0, true);
  }

  insert(text, offset = this.length, init = false){/* ... */}
  remove(index1 = this.length - 1, index2 = index1 + 1){/* ... */}
  setStyle(offset1 = 0, offset2 = this.length, style){/* ... */}
  measureSubstringSize(substring, style = {}){/* ... */}
  toReactComponents(maxWidth = 800, {tabValue = 72} = {}){/* ... */}
  toReduxState(){/* ... */}
}
