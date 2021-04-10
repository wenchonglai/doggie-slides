import React from 'react'
import MenuIcon from '../utils/menu_icon';
import * as ItemThunkActions from '../../actions/item_thunk_actions';

const COLORS = [
  [ "#000000", "light black 2"], [ "#1f1f1f", "dark grey 4"], [ "#3f3f3f", "dark grey 3"], [ "#5f5f5f", "dark grey 2"], [ "#7f7f7f", "grey"], [ "#9f9f9f", "light grey 1"], [ "#bfbfbf", "light grey 2"], [ "#dfdfdf", "light grey 3"], [ "#ffffff", "white", true],
  [ "#ff0000", "red"], [ "#ff7f00", "orange"], [ "#ffff00", "yellow", true], [ "#00ff00", "green"], [ "#00ffff", "cyan"], [ "#007fff", "cornflower blue"], [ "#0000ff", "blue"], [ "#7f00ff", "purple"], [ "#ff00ff", "magenta"],
  [ "#ffbfbf", "light red 3"], [ "#ffdfbf", "light orange 3"], [ "#ffffbf", "light yellow 3", true], [ "#bfffbf", "light green 3"], [ "#bfffff", "light cyan 3"], [ "#bfdfff", "light cornflower blue 3"], [ "#bfbfff", "light blue 3"], [ "#dfbfff", "light purple 3"], [ "#ffbfff", "light magenta 3"],
  [ "#ff7f7f", "light red 2"], [ "#ffbf7f", "light orange 2"], [ "#ffff7f", "light yellow 2", true], [ "#7fff7f", "light green 2"], [ "#7fffff", "light cyan 2"], [ "#7fbfff", "light cornflower blue 2"], [ "#7f7fff", "light blue 2"], [ "#bf7fff", "light purple 2"], [ "#ff7fff", "light magenta 2"],
  [ "#ff3f3f", "light red 1"], [ "#ffaf3f", "light orange 1"], [ "#ffff3f", "light yellow 1", true], [ "#3fff3f", "light green 1"], [ "#3fffff", "light cyan 1"], [ "#3fafff", "light cornflower blue 1"], [ "#3f3fff", "light blue 1"], [ "#af3fff", "light purple 1"], [ "#ff3fff", "light magenta 1"],
  [ "#bf0000", "dark red 1"], [ "#bf5f00", "dark orange 1"], [ "#bfbf00", "dark yellow 1"], [ "#00bf00", "dark green 1"], [ "#00bfbf", "dark cyan 1"], [ "#005fbf", "dark cornflower blue 1"], [ "#0000bf", "dark blue 1"], [ "#5f00bf", "dark purple 1"], [ "#bf00bf", "dark magenta 1"],
  [ "#7f0000", "dark red 2"], [ "#7f3f00", "dark orange 2"], [ "#7f7f00", "dark yellow 2"], [ "#007f00", "dark green 2"], [ "#007f7f", "dark cyan 2"], [ "#003f7f", "dark cornflower blue 2"], [ "#00007f", "dark blue 2"], [ "#3f007f", "dark purple 2"], [ "#7f007f", "dark magenta 2"],
  [ "#3f0000", "dark red 3"], [ "#3f1f00", "dark orange 3"], [ "#3f3f00", "dark yellow 3"], [ "#003f00", "dark green 3"], [ "#003f3f", "dark cyan 3"], [ "#001f3f", "dark cornflower blue 3"], [ "#00003f", "dark blue 3"], [ "#1f003f", "dark purple 3"], [ "#3f003f", "dark magenta 3"],
];

function ColorPicker({color, tooltip, border, onClick}){
  
  return (
    <div className='color-picker' onClick={onClick}>
      <div title={tooltip} style={{backgroundColor: color, borderColor: border ? '#ddd' : color}}>
      </div>
    </div>
  )
}

export default function ColorPalette({color = '', item, dispatch, parentHandleBlur}){
  // this code is identical to menu_item.jsx; DRY it up when necessary
  function handleClick(e, color){
    console.log(item)
    console.log(parentHandleBlur);
    //dispatch(ItemThunkActions[item.actionName](color));
    parentHandleBlur(e);
  }

  return (
    <div className='color-palette'>
      <div className='transparent' onClick={handleClick}>
        <MenuIcon className='item-icon' icon={[0, 12]}/>
        <div className='item-name'>Transparent</div>
      </div>
      {/* <div className='palette-colors'> */}
        { COLORS.map( ([color, tooltip, border]) => (
            <ColorPicker
              key={color} {...{color, tooltip, border}}
              onClick={e => handleClick(e, color)}
            />
          ))
        }
      {/* </div> */}
    </div>
  )
}