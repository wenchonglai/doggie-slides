import React, { useState } from "react"
import { withRouter } from "react-router";

function SmartInput({className = "", labelText="", children, value, staticContext, ...props} = {}){
  const [focus, setFocus] = useState(false);
  const [inputValue, setInputValue] = useState('');

  function handleFocus(){ setFocus(true); }
  function handleBlur(){ setFocus(false); }

  return (
    <div className={['smartinput'].concat(className.split(' ')).join(' ')}>
      <label>
        <div className={`placeholder${focus ? ' focus' : ''}${value ? ' has_val' : ''}`}>
          {labelText} 
        </div>
        <input
          {...props}
          onFocus={() => handleFocus()}
          onBlur={() => handleBlur()}
          value={value}
        />
      </label>
      {children}
    </div>
  )
}

const SmartInputContainer = withRouter(SmartInput);
export default SmartInputContainer;