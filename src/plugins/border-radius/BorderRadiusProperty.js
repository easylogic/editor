import { DEBOUNCE, LOAD, SUBSCRIBE, SUBSCRIBE_SELF } from "el/base/Event";
import BaseProperty from "el/editor/ui/property/BaseProperty";

export default class BorderRadiusProperty extends BaseProperty {

  getTitle() {
    return this.$i18n('border.radius.property.title');  
  }


  hasKeyframe () {
    return true; 
  }

  getKeyframeProperty () {
    return 'border-radius'
  }

  getBody() {
    return /*html*/`<div class="property-item full border-radius-item" ref='$body'></div>`;
  }

  [LOAD('$body')] () {
    var current = this.$selection.current || {}; 
    var value = current['border-radius'] || ''

    return /*html*/`
      <object refClass="BorderRadiusEditor" ref='$1' value='${value}' onchange='changeBorderRadius' />
    `
  }



  [SUBSCRIBE('refreshSelection') + DEBOUNCE(100)]() {
    this.refreshShowIsNot(['project', 'svg-path', 'svg-polygon', 'svg-text', 'svg-textpath']);
  }  

  [SUBSCRIBE_SELF('changeBorderRadius')] (value) {

    this.command("setAttributeForMulti", 'change border radius', this.$selection.packByValue({ 
      'border-radius': value 
    }))
  }

}