import React, { useState } from "react"
import { withRouter } from "react-router";

function SmartInput({className = "", labelText="", children, value, staticContext, errors = [], note="", ...props} = {}){
  const [focus, setFocus] = useState(false);
  const [inputValue, setInputValue] = useState('');

  function handleFocus(){ setFocus(true); }
  function handleBlur(){ setFocus(false); }

  return (
    <div className={['smartinput'].concat(className.split(' ')).join(' ')}>
      <label className={errors.length > 0 ? "error" : ""}>
        <div className={`placeholder${focus ? ' focus' : ''}${value ? ' has_val' : ''}`}>
          {labelText} 
        </div>
        <input
          {...props}
          onFocus={() => handleFocus()}
          onBlur={() => handleBlur()}
          value={value}
        />
        <div className="errors">
          {errors[0] || note}&nbsp;
        </div>
      </label>
      {children}
    </div>
  )
}

const SmartInputContainer = withRouter(SmartInput);
export default SmartInputContainer;