import React, { useEffect, useRef, useState } from 'react';

export default function AutosaveInput({className, type="text", keyName: key, saveHandler, value="", _docHook}){

  const _timeout = useRef();
  const [_doc, _setDoc] = _docHook;

  const handleChange = (e) => {
    const newVal = {..._doc, [key]: e.target.value};

    _setDoc(newVal);

    clearTimeout(_timeout.current);

    _timeout.current = setTimeout(() => {
      saveHandler(newVal);
    }, 500);
  }

  return (
    <input
      className={`autosave ${className}`}
      type={type}
      name={key}
      value={_docHook[0].filename}
      onChange={(e) => handleChange(e)}
    />
  )
}