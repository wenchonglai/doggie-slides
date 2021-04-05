import React, { useRef, useState } from 'react';

export default function AutosaveInput({className, type="text", keyName: key, value="", saveHandler, stateHook = []}){
  const _timeout = useRef();
  const [data, setData] = stateHook;

  const handleChange = (e) => {
    setData({...data, [key]: e.target.value});

    clearTimeout(_timeout.current);

    _timeout.current = setTimeout(() => {
      saveHandler(data);
    }, 800);
  }

  return (
    <input
      className={`autosave ${className}`}
      type={type}
      name={key}
      value={data[key]}
      onChange={(e) => handleChange(e)}
    />
  )
}