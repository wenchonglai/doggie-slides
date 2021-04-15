import React, { useEffect, useState, useRef } from 'react';
import UserInfoContainer from '../session/user_info_container';
import ProductIcon from '../utils/product_icon';
import MenuContainer from './menu_container'
import {MENU_ITEMS, BASE_TOOLBAR_ITEMS, TEXTBOX_TOOLBAR_ITEMS, IMAGE_TOOLBAR_ITEMS, WRAPPER_CONTEXT_MENU_ITEMS} from './menu-items';
import AutosaveInputContainer from '../utils/autosave_input_container';
import LastUpdate from '../utils/last_update';
import FilmStripContainer from './filmstrip_container';
import WorkspaceContainer from './workspace_container';
import { ColorPalette } from '../utils/color_palette';

const handleContextMenu = e => {e.preventDefault()};


export default function PresentationPage({
  currentSlideId, doc, uiSelections, 
  fetchPresentationHandler, updateCurrentSlideHandler, saveDocHandler
}){
  const _docHook = useState({});
  const [_doc, _setDoc] = _docHook;
  const [_loading, _setLoading] = useState(true);
  const [_rightClick, _setRightClick] = useState(false);
  const contextMenuRef = useRef();

  const chooseToolbar = function(){
    switch (uiSelections.slideObjectType){
      case "Textbox": return TEXTBOX_TOOLBAR_ITEMS;
      default: return BASE_TOOLBAR_ITEMS;
    }
  }

  const onContextMenu = function(e){
    _setRightClick({x: e.clientX, y: e.clientY});
  }

  const handleContextMenuBlur = e => {
    _setRightClick(false);
  }

  useEffect(() => {
    fetchPresentationHandler();
    _setLoading(true);
  }, []);

  useEffect(() => {
    if (_rightClick){ contextMenuRef.current.focus(); }
  }, [_rightClick]);


  useEffect(() => {
    // updateCurrentSlideHandler(currentSlideId);
    if (doc){
      if (!currentSlideId){
        updateCurrentSlideHandler();
      }
      _setLoading(false);
    }
    _setDoc({..._doc, ...doc});
  }, [doc]);

  return ( _loading ? null :
    (<section className='page presentation' onContextMenu={handleContextMenu}>
      <header>
        <div className='icon-wrapper'>
          <ProductIcon iconIndex={3}/>  
        </div>

        <section className="titlebar">
          <div className='docs-title-widget'>
            
            <AutosaveInputContainer
              keyName="filename"
              className="doc-title-input"
              _docHook={_docHook}
              saveHandler = {saveDocHandler}
            />
            
            <div>
              <MenuContainer
                className="docs-menu"
                items={MENU_ITEMS}
                respondToMouseOut={false}
              />
              
              <LastUpdate time={doc.updatedAt} />
            </div>
          </div>
          <section className="titlebar-buttons">
            <UserInfoContainer />
          </section>
        </section>
      </header>

      <section className='body'>
        <section>
          <section className='toolbar'>
            <MenuContainer
              className="toolbar-menu"
              items={chooseToolbar()}
              respondToMouseOut={false}
            />
            
          </section>
          <section className='two-panel-layout'>
            <section className='filmstrip'>
              <FilmStripContainer/>
            </section>

            <WorkspaceContainer handleContextMenu={onContextMenu} slideId={currentSlideId}/>

          </section>
        </section>
        <section className='app-switcher'>appswitcher</section>
      </section>

      <section 
        className={`context-menu-wrapper ${_rightClick ? 'active' : ''}`}
        tabIndex="0"
        onMouseDownCapture={e => e.preventDefault()}
        onBlur={handleContextMenuBlur}
        style = {{
          transform: `translate(${_rightClick.x}px, ${_rightClick.y}px)`
        }}
        ref={contextMenuRef}
      >
        <MenuContainer
          className="context-menu"
          items={WRAPPER_CONTEXT_MENU_ITEMS}
          respondToMouseOut={false}
          parentHandleBlur={handleContextMenuBlur}
        />
      </section>
    </section>)
  );
}