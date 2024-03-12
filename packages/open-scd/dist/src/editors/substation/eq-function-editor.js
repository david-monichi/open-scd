import { __decorate } from "tslib";
import { html, LitElement, css } from 'lit';
import { property, customElement, state, query } from 'lit/decorators.js';
import { translate } from 'lit-translate';
import '@material/mwc-icon-button';
import '@material/mwc-list/mwc-list-item';
import '@material/mwc-menu';
import '../../action-pane.js';
import './eq-sub-function-editor.js';
import './general-equipment-editor.js';
import { getChildElementsByTagName, newActionEvent, newWizardEvent, tags, } from '../../foundation.js';
import { emptyWizard, wizards } from '../../wizards/wizard-library.js';
import { renderGeneralEquipment } from './foundation.js';
function childTags(element) {
    if (!element)
        return [];
    return tags[element.tagName].children.filter(child => wizards[child].create !== emptyWizard);
}
/** Pane rendering `EqFunction` element with its children */
let EqFunctionEditor = class EqFunctionEditor extends LitElement {
    constructor() {
        super(...arguments);
        this.editCount = -1;
        this.showfunctions = false;
    }
    get header() {
        const name = this.element.getAttribute('name');
        const desc = this.element.getAttribute('desc');
        const type = this.element.getAttribute('type');
        return `${name}${desc ? ` - ${desc}` : ''}${type ? ` (${type})` : ''}`;
    }
    openEditWizard() {
        const wizard = wizards['EqFunction'].edit(this.element);
        if (wizard)
            this.dispatchEvent(newWizardEvent(wizard));
    }
    remove() {
        if (this.element.parentElement)
            this.dispatchEvent(newActionEvent({
                old: {
                    parent: this.element.parentElement,
                    element: this.element,
                },
            }));
    }
    openCreateWizard(tagName) {
        const wizard = wizards[tagName].create(this.element);
        if (wizard)
            this.dispatchEvent(newWizardEvent(wizard));
    }
    updated() {
        this.addMenu.anchor = this.addButton;
    }
    renderLNodes() {
        const lNodes = getChildElementsByTagName(this.element, 'LNode');
        return lNodes.length
            ? html `<div class="container lnode">
          ${lNodes.map(lNode => html `<l-node-editor
                .editCount=${this.editCount}
                .doc=${this.doc}
                .element=${lNode}
              ></l-node-editor>`)}
        </div>`
            : html ``;
    }
    renderEqSubFunctions() {
        const eqSubFunctions = getChildElementsByTagName(this.element, 'EqSubFunction');
        return html ` ${eqSubFunctions.map(eqSubFunction => html `<eq-sub-function-editor
          .editCount=${this.editCount}
          .doc=${this.doc}
          .element=${eqSubFunction}
          ?showfunctions=${this.showfunctions}
        ></eq-sub-function-editor>`)}`;
    }
    renderAddButtons() {
        return childTags(this.element).map(child => html `<mwc-list-item value="${child}"
          ><span>${child}</span></mwc-list-item
        >`);
    }
    render() {
        return html `<action-pane
      label="${this.header}"
      icon="functions"
      secondary
      highlighted
      ><abbr slot="action" title="${translate('edit')}">
        <mwc-icon-button
          icon="edit"
          @click=${() => this.openEditWizard()}
        ></mwc-icon-button> </abbr
      ><abbr slot="action" title="${translate('remove')}">
        <mwc-icon-button
          icon="delete"
          @click=${() => this.remove()}
        ></mwc-icon-button> </abbr
      ><abbr
        slot="action"
        style="position:relative;"
        title="${translate('add')}"
      >
        <mwc-icon-button
          icon="playlist_add"
          @click=${() => (this.addMenu.open = true)}
        ></mwc-icon-button
        ><mwc-menu
          corner="BOTTOM_RIGHT"
          menuCorner="END"
          @action=${(e) => {
            const tagName = e.target.selected.value;
            this.openCreateWizard(tagName);
        }}
          >${this.renderAddButtons()}</mwc-menu
        ></abbr
      >
      ${renderGeneralEquipment(this.doc, this.element, this.showfunctions)}
      ${this.renderLNodes()}${this.renderEqSubFunctions()}</action-pane
    >`;
    }
};
EqFunctionEditor.styles = css `
    abbr {
      text-decoration: none;
      border-bottom: none;
    }

    .container.lnode {
      display: grid;
      grid-gap: 12px;
      padding: 8px 12px 16px;
      box-sizing: border-box;
      grid-template-columns: repeat(auto-fit, minmax(64px, auto));
    }
  `;
__decorate([
    property({ attribute: false })
], EqFunctionEditor.prototype, "doc", void 0);
__decorate([
    property({ type: Number })
], EqFunctionEditor.prototype, "editCount", void 0);
__decorate([
    property({ attribute: false })
], EqFunctionEditor.prototype, "element", void 0);
__decorate([
    property({ type: Boolean })
], EqFunctionEditor.prototype, "showfunctions", void 0);
__decorate([
    state()
], EqFunctionEditor.prototype, "header", null);
__decorate([
    query('mwc-menu')
], EqFunctionEditor.prototype, "addMenu", void 0);
__decorate([
    query('mwc-icon-button[icon="playlist_add"]')
], EqFunctionEditor.prototype, "addButton", void 0);
EqFunctionEditor = __decorate([
    customElement('eq-function-editor')
], EqFunctionEditor);
export { EqFunctionEditor };
//# sourceMappingURL=eq-function-editor.js.map