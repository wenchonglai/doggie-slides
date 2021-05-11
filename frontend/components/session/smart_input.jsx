import React, { useEffect, useState } from "react"
import { withRouter } from "react-router";

function SmartInput({className = "", labelText="", children, value = "", staticContext, errors = [], onChange, note="", ...props} = {}){
  const [focus, setFocus] = useState(false);
  const [_value, _setValue] = useState(value);

  function handleFocus(){ setFocus(true); }
  function handleBlur(){ setFocus(false); }
  
  return (
    <div className={['smartinput'].concat(className.split(' ')).join(' ')}>
      <label className={errors.length > 0 ? "error" : ""}>
        <div className={`placeholder${focus ? ' focus' : ''}${_value ? ' has_val' : ''}`}>
          {labelText} 
        </div>
        <input
          {...props}
          onFocus={() => handleFocus()}
          onBlur={() => handleBlur()}
          onChange={(e) => {_setValue(e.target.value); onChange(e)}}
          value={_value}
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