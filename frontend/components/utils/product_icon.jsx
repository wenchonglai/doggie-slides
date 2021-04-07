import React from 'react';

export default function ProductIcon({className, iconIndex = 0}){
  return (
      <div
        className={`product-icon ${className || ''} icon-${iconIndex}`}
        src={window.productIconUrl}>&nbsp;
      </div>
    );
}