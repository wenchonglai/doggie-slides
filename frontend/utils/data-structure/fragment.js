import '../monkey-patches/array';
import '../monkey-patches/object';
import '../monkey-patches/string'

const ctx = document.createElement('canvas').getContext('2d');

class Fragment{
  static setFontWidth(){}

  constructor(text, {...style} = {}){
    this._text = text;
    this._style = style;
    this._svgOffsets = undefined;
    this.refresh();
  }
  
  get text(){ return this._text; }
  set text(val){ this.refresh(); return this._text = val; }
  get style(){ return this._style; }
  get length(){ return this.text.length; }
  get width(){ 
    ctx.font = this._style.font || '400 16px sans-serif';
    return ctx.measureText(this.text).width;
  }
  get styleString(){
    return Object
      .keys(this._style)
      .sort()
      .map( key => `${key.toSnakeCase('-')}: ${this._style[key]}`)
      .join('; ');
  }


  splice(i){
    if (i > this.length || i < 0) return false;

    const newText = this.text.substring(i);
    this.text = this.text.substring(0, i);
    return new Fragment(newText, this._style);
  }
  setStyle(style){
    if (style.isEmpty || this.style.contains(style)) return;

    this.refresh();
    Object.assign(this._style, style);
  }
  refresh(){ this.id = new Date().getTime(); }
  toString(){ return this.text; }
  toSVG(){ 
    return `<text${this.styleString.length ? ` style="${this.styleString}"` : ""}>${this.text}</text>` 
  }
}

Fragment.fontWidthMap = {};

export default Fragment;