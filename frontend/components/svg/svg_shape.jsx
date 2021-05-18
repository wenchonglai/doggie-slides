import React from "react";

export default function Shape({
  type, path, width, height, ...args
}){
  switch (type.toLowerCase()){
    case 'circle': 
      return (
        <ellipse 
          cx={width / 2} cy={height / 2} rx={width / 2} ry = {height / 2}
          {...args}
        />
      );
    default: return <rect {...{width, height, ...args}} />
  }
}