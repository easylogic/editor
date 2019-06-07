import { html } from "../../../../../util/functions/func";
import icon from "../../../icon/icon";
import {
  LOAD,
  CLICK,
  DRAGSTART,
  DRAGOVER,
  DROP,
  PREVENT
} from "../../../../../util/Event";
import { WHITE_STRING } from "../../../../../util/css/types";
import {
  Transform
} from "../../../../../editor/css-property/Transform";
import { editor } from "../../../../../editor/editor";
import UIElement, { EVENT } from "../../../../../util/UIElement";
import RangeEditor from "./RangeEditor";
import { Length } from "../../../../../editor/unit/Length";


var transformList = [
  'matrix',
  'matrix3d',
  'translate',
  'translateX',  
  'translateY',
  'translateZ',
  'translate3d',
  'scale',
  'scaleX',
  'scaleY',
  'scaleZ',
  'scale3d',
  'rotate',
  'rotateX',
  'rotateY',
  'rotateZ',
  'rotate3d',  
  'skewX',    
  'skewY',   
  'perspective'
];

export default class TransformEditor extends UIElement {

  components() {
    return {
      RangeEditor
    }
  }

  initState() {
    return {
      transforms: Transform.parseStyle(this.props.value)
    }
  }

  template() {
    return html`
      <div class='transform-editor transform-list' ref='$transformList'>
          <div class='label' >
              <label>Transform</label>
              <div class='tools'>
                <select ref="$transformSelect">
                  ${transformList.map(transform => {
                    return `<option value='${transform}'>${transform}</option>`;
                  })}
                </select>
                <button type="button" ref="$add" title="add Transform">${icon.add}</button>
              </div>
          </div>
          <div class='transform-list' ref='$transformList'></div>
      </div>`;
  }

  getLabel(type, index) {
    switch(type) {
      case 'scale':
      case 'translate':
        if (index === 0) return 'X';
        else if (index === 1) return 'Y';
      case 'matrix':
        if (index === 0) return 'a'
        else if (index === 1) return 'c'
        else if (index === 2) return 'b'
        else if (index === 3) return 'd'
        else if (index === 4) return 'tx'
        else if (index === 5) return 'ty'
      }
    return ''
  }

  getRange(type) {

    switch(type) {
      case 'translateX': 
      case 'translateY': 
      case 'translateZ': 
      case 'translate':      
      case 'skewY':
      case 'skewX':      
        return { min: -1000, max : 1000, step: 1, units: 'px,%,em'}
      case 'matrix':
      case 'matrix3d':     
        return { min: -1000, max : 1000, step: 0.1,units: 'number'}                           
      case 'rotateX': 
      case 'rotateY': 
      case 'rotateZ': 
      case 'rotate':  
      return { min: -360, max : 360, step: 0.1, units: 'deg,turn,rad'}              
      case 'perspective':
          return { min: 0, max : 10000, step: 1, units: 'px,%,em'}
      case 'scale': 
      case 'scaleX': 
      case 'scaleY': 
        return { min: 0, max : 10, step: 0.1,units: 'number'}           
    }


    return { min: 0, max : 100, step : 1,units: 'px,%,em' }
  }

  makeOneTransformTemplate(type, transform, index) {
    return html`
      <div class="transform-item" data-index="${index}">
        <div class="title" draggable="true" data-index="${index}">
          <label><span>${(+index)+1}</span> ${type}</label>
          <div class="transform-menu">
            <button type="button" class="del" data-index="${index}">
              ${icon.remove2}
            </button>
          </div>
        </div>
        <div class="transform-ui">
          ${transform.value.map( (it, tindex) => {

            var label = this.getLabel(type, tindex);
            var {min, max, step, units} = this.getRange(type);

            return `<RangeEditor 
                      ref='$range${index}_${tindex}' 
                      min="${min}" 
                      max="${max}" 
                      step="${step}" 
                      label="${label}" 
                      key="${index}" 
                      params='${tindex}' 
                      value="${it}" 
                      units="${units}" 
                      onchange="changeRangeEditor" />`
          }).join(WHITE_STRING)}          
        </div>
      </div>
    `;
  }

  makeTransformTemplate(transform, index) {
    return this.makeOneTransformTemplate(
      transform.type,
      transform,
      index
    );
  }

  [LOAD("$transformList")]() {
    return this.state.transforms.map((transform, index) => {
      return this.makeTransformTemplate(transform, index.toString());
    });
  }

  // transform-item 을 통째로  dragstart 를 걸어버리니깐
  // 다른 ui 를 핸들링 할 수가 없어서
  // title  에만 dragstart 거는 걸로 ok ?
  [DRAGSTART("$transformList .transform-item .title")](e) {
    this.startIndex = +e.$delegateTarget.attr("data-index");
  }

  // drop 이벤트를 걸 때 dragover 가 같이 선언되어 있어야 한다.
  [DRAGOVER("$transformList .transform-item") + PREVENT](e) {}



  sortItem(arr, startIndex, targetIndex) {
    arr.splice(
      targetIndex + (startIndex < targetIndex ? -1 : 0),
      0,
      ...arr.splice(startIndex, 1)
    );
  }

  sortTransform(startIndex, targetIndex) {
      this.sortItem(this.state.transforms, startIndex, targetIndex);
  }

  [DROP("$transformList .transform-item") + PREVENT](e) {
    var targetIndex = +e.$delegateTarget.attr("data-index");
    var current = editor.selection.current;
    if (!current) return;

    this.sortTransform(this.startIndex, targetIndex);

    this.refresh();

    this.modifyTransform()
  }

  modifyTransform () {
    var value = this.state.transforms.join(WHITE_STRING);

    this.parent.trigger(this.props.onchange, value)
  }

  getDefaultValue (type) {

    switch(type) {
      case 'translateX': 
      case 'translateY': 
      case 'translateZ': 
        return [Length.px(0)]            
      case 'rotateX': 
      case 'rotateY': 
      case 'rotateZ': 
      case 'rotate':  
      case 'skewY':
      case 'skewX':
      case 'perspective':
        return [Length.deg(0)]            
      case 'translate': 
        return [Length.px(0),Length.px(0)]
      case 'scale': 
        return [Length.number(1),Length.number(1)]
      case 'scaleX': 
      case 'scaleY': 
        return [Length.number(1)]
      case 'matrix':
        return [
          Length.number(1),
          Length.number(1),
          Length.number(1),
          Length.number(1),
          Length.number(1),
          Length.number(1)          
        ]
      case 'matrix3d':
        return [
          Length.number(1),
          Length.number(1),
          Length.number(1),
          Length.number(1),
          Length.number(1),
          Length.number(1),
          Length.number(1),
          Length.number(1),
          Length.number(1)          
        ]        
    }


    return [Length.number(0)]
  }

  makeTransform(type, opt = {}) {

    var value = this.getDefaultValue(type)

    return Transform.parse({ ...opt, type, value });
  }

  [CLICK("$add")]() {
    var transformType = this.refs.$transformSelect.value;

    this.state.transforms.push(this.makeTransform(transformType))

    this.refresh();

    this.modifyTransform()
  }

  [CLICK("$transformList .transform-menu .del")](e) {
    var index = +e.$delegateTarget.attr("data-index");
    this.state.transforms.splice(index, 1);

    this.refresh();

    this.modifyTransform()
  }

  [EVENT('changeRangeEditor')] (key, value, params) {
    if (params) {
      this.state.transforms[+key].value[+params] = value; 
    } else {
      this.state.transforms[+key].reset({ 
        value 
      });
    }
    

    this.modifyTransform();
  }
}
