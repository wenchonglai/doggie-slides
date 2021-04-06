import React, { useEffect, useState } from 'react';
import UserInfoContainer from '../session/user_info_container';
import ProductIcon from '../utils/product_icon';
import Menu from './menu'
import {MENU_ITEMS, BASE_TOOLBAR_ITEMS, TEXTBOX_TOOLBAR_ITEMS, IMAGE_TOOLBAR_ITEMS} from './menu-items';
import AutosaveInputContainer from '../utils/autosave_input_container';
import LastUpdate from '../utils/last_update'
import FilmStripContainer from './filmstrip_container';

export default function PresentationPage({doc, slides, fetchPresentationHandler, saveDocHandler}){
  
  useEffect(() => {
    fetchPresentationHandler()
  }, []);
  
  const _docHook = useState({});
  const [_doc, _setDoc] = _docHook;

  useEffect(() => {
    _setDoc({..._doc, ...doc});
  }, [doc]);

  useEffect(() => {
    
  }, [slides]);

  return ( _doc.id ? 
    (<section className='page presentation'>
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
              <Menu
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
            <Menu
              className="toolbar-menu"
              items={BASE_TOOLBAR_ITEMS}
              respondToMouseOut={false}
            />
            
          </section>
          <section className='two-panel-layout'>
            <section className='filmstrip'>
              <FilmStripContainer doc={doc} slides={slides}/>
            </section>
            <section className='workspace'>slidesview</section>
          </section>
        </section>
        <section className='app-switcher'>appswitcher</section>
      </section>
    </section>) : null
  );
}