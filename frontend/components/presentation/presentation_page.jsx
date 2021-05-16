import React, { useEffect, useState, useRef, useCallback } from 'react';
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import {NavLink, withRouter} from "react-router-dom";

import MenuContainer from './menu_container'
import {SLIDE_TOOLBAR_ITEMS, TEXTBOX_TOOLBAR_ITEMS, IMAGE_TOOLBAR_ITEMS, SLIDE_CONTEXT_MENU_ITEMS, WRAPPER_CONTEXT_MENU_ITEMS} from './menu-items';
import FilmStripContainer from './filmstrip_container';
import WorkspaceContainer from './workspace_container';
import PresentationHeader from './presentation_header';
import FullScreenPresentationContainer from './full_screen_presentation_container';
import MenuIcon from '../utils/menu_icon';

const handleContextMenu = e => {e.preventDefault()};

export function PresentationPage({
  currentSlideId, isFullScreen, doc, uiSelections, 
  fetchPresentationHandler, updateCurrentSlideHandler, saveDocHandler, presentHandler,
  history, match, ...args
}){

  const _docHook = useState();
  const [_doc, _setDoc] = _docHook;
  const [_gridView, _setGridView] = useState(false);
  const [_loading, _setLoading] = useState(true);
  const [_rightClick, _setRightClick] = useState(false);

  const contextMenuRef = useRef();
  const fullScreen = useFullScreenHandle();
  const {slideObjectType} = uiSelections;

  const chooseToolbar = function(){
    switch (slideObjectType){
      case "Textbox": return TEXTBOX_TOOLBAR_ITEMS;
      case "Image": return IMAGE_TOOLBAR_ITEMS;
      default: return SLIDE_TOOLBAR_ITEMS;
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
    if (isFullScreen) 
      fullScreen.enter();
  }, [isFullScreen]);

  useEffect(() => {
    const pathname = history.location.pathname;
    const isGridView = !pathname.match(/\/\d+\/?$/);

    if (isGridView && _gridView === false) {
      _setGridView(true);
    } else if (!isGridView && _gridView === true) {
      _setGridView(false);
    }
  }, [history.location.pathname])

  useEffect(() => {
    if (_rightClick){
      contextMenuRef.current.focus();
    }
  }, [_rightClick]);

  useEffect(() => {
    if (doc){
      if (!currentSlideId){
        let {docId, slideId} = match.params;
        
        docId = Number(docId);
        slideId = Number(slideId);

        if (doc && doc.id == docId && doc.slideIds.includes(slideId))
          currentSlideId ||= slideId;
          
        updateCurrentSlideHandler(currentSlideId, history, true);
      }
      _setLoading(false);
    }
    _setDoc({..._doc, ...doc});
  }, [doc]);

  return ( _loading ? null :
    (<section className='page presentation' onContextMenu={handleContextMenu}>
      <PresentationHeader {...{
        doc, _docHook, saveDocHandler, fullScreen,
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
            <section className={`filmstrip${_gridView ? ' grid-view' : ''}`}>
              <FilmStripContainer handleContextMenu={onContextMenu} isGridView={_gridView}/>
              <ul className='view-options'>
                <NavLink 
                  exact to={history.location.pathname.replace(/\/\d+\/?$/, '') + `/${currentSlideId}`}
                  activeClassName="selected"
                >
                  <div>
                    <MenuIcon icon={[1, 13]} />
                  </div>
                </NavLink>
                <NavLink exact to={history.location.pathname.replace(/\/\d+\/?$/, '')}
                  activeClassName="selected"
                >
                  <div>
                    <MenuIcon icon={[2, 13]} />
                  </div>
                </NavLink>
              </ul>
            </section>

            { _gridView ||
                <WorkspaceContainer handleContextMenu={onContextMenu} slideId={currentSlideId}/>
            }

          </section>
        </section>
        <section className='app-switcher'>
          <a className="portfolio" target="_blank" title="Wenchong's Portfolio" href="https://wenchonglai.github.io/portfolio/"/>
          <a className="linkedin" target="_blank" title="LinkedIn" href="https://www.linkedin.com/in/wenchong-lai-4296424b/"/>
          <a className="github" target="_blank" title="GitHub" href="https://github.com/wenchonglai/"/>
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
      <section className={`full-screen-wrapper${isFullScreen ? ' active' : ''}`}>
        <FullScreen handle={fullScreen} onChange={(e) => {
          if (!e) presentHandler();
        }}>{
          isFullScreen &&
            <FullScreenPresentationContainer 
              slideId={currentSlideId}
              presentHandler={(slideId) => { presentHandler(slideId); }}
              fullScreenHandle={fullScreen}
            />
        }</FullScreen>
      </section>
    </section>)
  );
}

export default withRouter(PresentationPage);