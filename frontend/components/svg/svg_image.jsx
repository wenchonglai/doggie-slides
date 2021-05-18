import React, { useEffect, useState } from "react"

export default function SVGImage({id, width, height, cropX, cropY, image, clipPath}){
  const [_translate, _setTranslate] = useState({x: image.x, y: image.y});
  const [_scale, _setScale] = useState({x: width / image.width, y: height / image.height});
  const [_rotate, _setRotate] = useState(image.rotate);

  useEffect(() => {
    _setScale({ x: width / image.width, y: height / image.height })
  }, [width, height]);
  
  return (
    <image
      href={image.href}
      width={image.width}
      height={image.height}
      transform={
        `translate(${_translate.x - cropX} ${_translate.y - cropY}) rotate(${_rotate}) scale(${_scale.x} ${_scale.y})`
      }
    />
  )
}