import { Property } from "el/editor/items/Property";
import { uuidShort } from "el/base/functions/math";
import { SVGFilterClassName } from "../SVGFilter";
import { clone, isString } from "el/base/functions/func";

const  Primitive = 'SourceGraphic,SourceAlpha,BackgroundImage,BackgroundAlpha,FillPaint,StrokePaint'.split(',')

const DEFAULT_ATTRIBUTES = {
  xChannelSelector: true,
  yChannelSelector: true  
}

export class BaseSVGFilter extends Property {

  static parse (obj) {
    var FilterClass = SVGFilterClassName[obj.type];
  
    return new FilterClass(obj);
  }  

  hasLight () {
    return false; 
  }

  isLight () {
    return false; 
  }

  isSource () {
    return false; 
  }

  getDefaultObject(obj = {}) {
    var id  = uuidShort()
    return super.getDefaultObject({ 
      itemType: "svgfilter", 
      id,
      in: [],
      bound: { x: 100, y: 100, targetX: 0, targetY: 0 },
      connected: [],
      ...obj 
    });
  }

  getInCount () {
    return 0; 
  }

  setIn  (index, target) {
    this.json.in[index] = {id: target.id, type: target.type}; 
  }

  setConnected (target ) {

    var f = this.json.connected.filter(c => c.id === target.id);

    if (f.length === 0) {
      this.json.connected.push({id: target.id });
    }

  }  

  convert(json) {


    if (isString(json.in)) {
      json.in = JSON.parse(json.in);
    }
    if (isString(json.bound)) {
      json.bound = JSON.parse(json.bound);  
    }

    if (isString(json.connected)) {
      json.connected = JSON.parse(json.connected);  
    }

    
    return json; 
  }

  toCloneObject() {
    return {
      ...super.toCloneObject(),
      ...this.attrs('id', 'in', 'bound', 'connected')
    }
  }

  getDefaultAttribute () {
    var list = [] 

    if (this.json.connected.length) {
      list.push(`result="${this.json.id}result"`)
    }

    Object.keys(DEFAULT_ATTRIBUTES).filter(key => {
      return !!this.json[key]
    }).forEach(key => {
      list.push(`${key}="${this.json[key]}"`)
    })

    return list.join(' ') + ' ' + this.getSourceInAttribute();
  }

  hasInIndex () {
    return false; 
  }

  getSourceInAttribute (inList) {
    return (inList || this.json.in).map((it, index) => {

      if (!it) return '';

      var indexString = index === 0 ? '' : (index + 1) + '' 

      if (!this.hasInIndex()) {
        indexString = ''; 
      }

      if (Primitive.includes(it.type)) {
        return `in${indexString}="${it.type}"`
      }
      return `in${indexString}="${it.id}result"`
    }).join(' ')
  }


  toString() {
    var { type , value } = this.json; 
    return `<fe${type} value="${value}" ${this.getDefaultAttribute()} />`;
  }
}


