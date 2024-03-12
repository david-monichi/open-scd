import { __decorate } from "tslib";
import { customElement, html, LitElement, property, state, css, query, } from 'lit-element';
import { translate } from 'lit-translate';
import '@material/mwc-icon-button';
import '@material/mwc-list/mwc-list-item';
import '@material/mwc-menu';
import '@material/mwc-fab';
import '../../action-pane.js';
import '../../editors/substation/eq-function-editor.js';
import '../../editors/substation/l-node-editor.js';
import { generalConductingEquipmentIcon } from '../../icons/icons.js';
import { getChildElementsByTagName, newActionEvent, newWizardEvent, tags, } from '../../foundation.js';
import { emptyWizard, wizards } from '../../wizards/wizard-library.js';
function childTags(element) {
    if (!element)
        return [];
    return tags[element.tagName].children.filter(child => wizards[child].create !== emptyWizard);
}
let GeneralEquipmentEditor = class GeneralEquipmentEditor extends LitElement {
    constructor() {
        super(...arguments);
        this.editCount = -1;
        /** Whether `Function` and `SubFunction` are rendered */
        this.showfunctions = false;
    }
    get header() {
        const name = this.element.getAttribute('name') ?? '';
        const desc = this.element.getAttribute('desc');
        if (!this.showfunctions)
            return `${name}`;
        return `${name} ${desc ? `—  ${desc}` : ''}`;
    }
    openEditWizard() {
        const wizard = wizards['GeneralEquipment'].edit(this.element);
        if (wizard)
            this.dispatchEvent(newWizardEvent(wizard));
    }
    openCreateWizard(tagName) {
        const wizard = wizards[tagName].create(this.element);
        if (wizard)
            this.dispatchEvent(newWizardEvent(wizard));
    }
    updated() {
        if (this.addMenu && this.addButton)
            this.addMenu.anchor = this.addButton;
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
    renderEqFunctions() {
        const eFunctions = getChildElementsByTagName(this.element, 'EqFunction');
        return eFunctions.length
            ? html `${eFunctions.map(eFunction => html ` <eq-function-editor
              .editCount=${this.editCount}
              .doc=${this.doc}
              .element=${eFunction}
            ></eq-function-editor>`)}`
            : html ``;
    }
    renderAddButtons() {
        return childTags(this.element).map(child => html `<mwc-list-item value="${child}"
          ><span>${child}</span></mwc-list-item
        >`);
    }
    render() {
        if (this.showfunctions)
            return html `<action-pane label=${this.header}>
        <abbr slot="action" title="${translate('edit')}">
          <mwc-icon-button
            icon="edit"
            @click=${() => this.openEditWizard()}
          ></mwc-icon-button>
        </abbr>
        <abbr slot="action" title="${translate('remove')}">
          <mwc-icon-button
            icon="delete"
            @click=${() => this.remove()}
          ></mwc-icon-button>
        </abbr>
        <abbr
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
        ${this.renderLNodes()} ${this.renderEqFunctions()}
      </action-pane>`;
        return html `<action-icon label=${this.header}>
      <mwc-icon slot="icon">${generalConductingEquipmentIcon}</mwc-icon>
      <mwc-fab
        slot="action"
        mini
        icon="edit"
        @click="${() => this.openEditWizard()}}"
      ></mwc-fab>
      <mwc-fab
        slot="action"
        mini
        icon="delete"
        @click="${() => this.remove()}}"
      ></mwc-fab>
    </action-icon>`;
    }
};
GeneralEquipmentEditor.styles = css `
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
], GeneralEquipmentEditor.prototype, "doc", void 0);
__decorate([
    property({ type: Number })
], GeneralEquipmentEditor.prototype, "editCount", void 0);
__decorate([
    property({ attribute: false })
], GeneralEquipmentEditor.prototype, "element", void 0);
__decorate([
    property({ type: Boolean })
], GeneralEquipmentEditor.prototype, "showfunctions", void 0);
__decorate([
    state()
], GeneralEquipmentEditor.prototype, "header", null);
__decorate([
    query('mwc-menu')
], GeneralEquipmentEditor.prototype, "addMenu", void 0);
__decorate([
    query('mwc-icon-button[icon="playlist_add"]')
], GeneralEquipmentEditor.prototype, "addButton", void 0);
GeneralEquipmentEditor = __decorate([
    customElement('general-equipment-editor')
], GeneralEquipmentEditor);
export { GeneralEquipmentEditor };
//# sourceMappingURL=general-equipment-editor.js.map