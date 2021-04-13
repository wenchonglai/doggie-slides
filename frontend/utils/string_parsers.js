export function parseStyleString(styleString){
  const stringObj = Object.fromEntries(
    styleString
      .split(/\ *\;\ */)
      .map(x => x.split(/\ *\:\ /)
    )
  );
  
  let fontStyles = stringObj.font;

  if (fontStyles){
    Object.assign(stringObj, parseFontString(fontStyles));
    // delete stringObj.font;
  }

  return stringObj;
}

export function parseFontString(fontString){
  if (!fontString) return {};

  const fontStyles = {};
  const [firstString, fontSize, lineHeight, fontFamily] = fontString.split(/(\d+px)(?:\/([\d\.]+(?:px)?))?/);
  const fontWeight = firstString.match(/\d+|bold/);
  const fontStyle = firstString.match(/italic/);

  if (fontSize) fontStyles.fontSize = fontSize;
  if (lineHeight) fontStyles.lineHeight = lineHeight;
  if (fontFamily) fontStyles.fontFamily = fontFamily;
  if (fontWeight) fontStyles.fontWeight = fontWeight[0];
  if (fontStyle) fontStyles.fontStyle = fontStyle[0];

  return fontStyles;
}

export function toStyleString(styleObject){
  const {fontStyle, fontWeight, fontSize, fontFamily, ...args } = styleObject;
  const fontString = [fontStyle, fontWeight, fontSize, fontFamily]
    .filter(x => x)
    .join(' ');

  return Object.entries({font: fontString, ...args})
    .filter(([k, v]) => v !== undefined)
    .map(([k, v]) => `${k}: ${v}`)
    .join("; ");
}
