import React, { useEffect, useState, useRef } from 'react';

import MenuContainer from './menu_container'
import {BASE_TOOLBAR_ITEMS, TEXTBOX_TOOLBAR_ITEMS, IMAGE_TOOLBAR_ITEMS, SLIDE_CONTEXT_MENU_ITEMS, WRAPPER_CONTEXT_MENU_ITEMS} from './menu-items';
import FilmStripContainer from './filmstrip_container';
import WorkspaceContainer from './workspace_container';
import PresentationHeader from './presentation_header';
import FullScreenPresentationContainer from './full_screen_presentation_container';

const handleContextMenu = e => {e.preventDefault()};

export default function PresentationPage({
  currentSlideId, doc, uiSelections, 
  fetchPresentationHandler, updateCurrentSlideHandler, saveDocHandler, presentHandler
}){
  const _docHook = useState();
  const [_doc, _setDoc] = _docHook;
  const [_loading, _setLoading] = useState(true);
  const [_rightClick, _setRightClick] = useState(false);
  const contextMenuRef = useRef();

  const chooseToolbar = function(){
    switch (uiSelections.slideObjectType){
      case "Textbox": return TEXTBOX_TOOLBAR_ITEMS;
      case "Image": return IMAGE_TOOLBAR_ITEMS;
      default: return BASE_TOOLBAR_ITEMS;
    }
  }

  const onContextMenu = function(e, wrapper){
    _setRightClick({x: e.clientX, y: e.clientY, type: wrapper && wrapper.slideObjectType ? wrapper.slideObjectType : wrapper});
  }

  const handleContextMenuBlur = (e) => {
    _setRightClick(false);
  }

  useEffect(() => {
    fetchPresentationHandler();
    _setLoading(true);
  }, []);

  useEffect(() => {
    if (_rightClick){
      contextMenuRef.current.focus();
    }
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
      <PresentationHeader {...{
        doc, _docHook, saveDocHandler, 
        handlePresent: () => presentHandler(currentSlideId)}
      }/>
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
              <FilmStripContainer handleContextMenu={onContextMenu}/>
            </section>

            <WorkspaceContainer handleContextMenu={onContextMenu} slideId={currentSlideId}/>

          </section>
        </section>
        <section className='app-switcher'>
          <a className="linkedin" title="LinkedIn" href="https://www.linkedin.com/in/wenchong-lai-4296424b/"/>
          <a className="github" title="GitHub" href="https://github.com/wenchonglai/"/>
        </section>
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
          items={
            _rightClick.type === 'slide' ? 
              SLIDE_CONTEXT_MENU_ITEMS:
              WRAPPER_CONTEXT_MENU_ITEMS
          }
          respondToMouseOut={false}
          parentHandleBlur={handleContextMenuBlur}
        />
      </section>
      { uiSelections.presentingSlideId &&
        <section className="full-screen-wrapper">{
          <FullScreenPresentationContainer slideId={674}/>
        }</section>
      }
      
    </section>)
  );
}