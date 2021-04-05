import React, { useState } from 'react';
import { connect } from 'react-redux';
import UserInfoContainer from '../session/user_info_container';
import ProductIcon from '../utils/product_icon';
import Menu from './menu'
import {MENU_ITEMS, BASE_TOOLBAR_ITEMS, TEXTBOX_TOOLBAR_ITEMS, IMAGE_TOOLBAR_ITEMS} from './menu-items';
import AutosaveInputContainer from '../utils/autosave_input_container';
import FilmStripContainer from './filmstrip_container';

export default function PresentationPage(props){
  const docHook = useState({
    filename: "Untitled presentation"
  });

  return (
    <section className='page presentation'>
      <header>
        <div className='icon-wrapper'>
          <ProductIcon iconIndex={3}/>  
        </div>

        <section className="titlebar">
          <div className='docs-title-widget'>
            <AutosaveInputContainer
              keyName="filename"
              className="doc-title-input"
              stateHook = {docHook}
              saveHandler = {() => {console.log('save', docHook[0])}}
            />
            <Menu
              className="docs-menu"
              items={MENU_ITEMS}
              respondToMouseOut={false}
            />
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
              items={IMAGE_TOOLBAR_ITEMS}
              respondToMouseOut={false}
            />
          </section>
          <section>
            <section className='filmstrip'>
              <FilmStripContainer />
            </section>
            <section className='slides-view'>slidesview</section>
          </section>
        </section>
        <section className='app-switcher'>appswitcher</section>
      </section>
    </section>
  );
}