import { __decorate } from "tslib";
import { css, html, LitElement, property, query, queryAll, state, } from 'lit-element';
import { translate } from 'lit-translate';
import '@material/mwc-dialog';
import '@material/mwc-list';
import '@material/mwc-list/mwc-list-item';
import '@material/mwc-list/mwc-check-list-item';
import '@material/mwc-list/mwc-radio-list-item';
import { Dialog } from '@material/mwc-dialog';
import '../filtered-list.js';
import { find, getChildElementsByTagName, identity, newActionEvent, } from '../foundation.js';
import { getFunctionNamingPrefix, getNonLeafParent, getSpecificationIED, getUniqueFunctionName, } from './virtualtemplateied/foundation.js';
/** converts FunctionElementDescription's to LDeviceDescription's */
function getLDeviceDescriptions(functions, selectedLNodes, selectedLLN0s) {
    const lDeviceDescriptions = [];
    Object.values(functions).forEach(functionDescription => {
        if (functionDescription.lNodes.some(lNode => selectedLNodes.includes(lNode))) {
            const lLN0 = selectedLLN0s.find(selectedLLN0 => selectedLLN0.includes(functionDescription.uniqueName));
            const lnType = lLN0?.split(': ')[1];
            lDeviceDescriptions.push({
                validLdInst: functionDescription.uniqueName,
                anyLNs: [
                    { prefix: null, lnClass: 'LLN0', inst: '', lnType },
                    ...functionDescription.lNodes
                        .filter(lNode => selectedLNodes.includes(lNode))
                        .map(lNode => {
                        return {
                            prefix: getFunctionNamingPrefix(lNode),
                            lnClass: lNode.getAttribute('lnClass'),
                            inst: lNode.getAttribute('lnInst'),
                            lnType: lNode.getAttribute('lnType'),
                        };
                    }),
                ],
            });
        }
    });
    return lDeviceDescriptions;
}
/** Groups all incomming LNode's with non-leaf parent function type elements */
function groupLNodesToFunctions(lNodes) {
    const functionElements = {};
    lNodes.forEach(lNode => {
        const parentFunction = getNonLeafParent(lNode);
        if (!parentFunction)
            return;
        if (functionElements[identity(parentFunction)])
            functionElements[identity(parentFunction)].lNodes.push(lNode);
        else {
            functionElements[identity(parentFunction)] = {
                uniqueName: getUniqueFunctionName(parentFunction),
                lNodes: [lNode],
                lln0: getChildElementsByTagName(parentFunction, 'LNode').find(lNode => lNode.getAttribute('lnClass') === 'LLN0'),
            };
        }
    });
    return functionElements;
}
export default class VirtualTemplateIED extends LitElement {
    constructor() {
        super(...arguments);
        this.editCount = -1;
    }
    get isValidManufacturer() {
        const manufacturer = this.dialog?.querySelector('wizard-textfield[label="manufacturer"]').value;
        return (manufacturer && manufacturer !== '') || false;
    }
    get isValidApName() {
        const apName = this.dialog?.querySelector('wizard-textfield[label="AccessPoint name"]').value;
        return (apName && apName !== '') || false;
    }
    get someItemsSelected() {
        if (!this.selectedLNodeItems)
            return false;
        return !!this.selectedLNodeItems.length;
    }
    get validPriparyAction() {
        return (this.someItemsSelected && this.isValidManufacturer && this.isValidApName);
    }
    get unreferencedLNodes() {
        return Array.from(this.doc.querySelectorAll('LNode[iedName="None"]')).filter(lNode => lNode.getAttribute('lnClass') !== 'LLN0');
    }
    get lLN0s() {
        return Array.from(this.doc.querySelectorAll('LNodeType[lnClass="LLN0"]'));
    }
    async run() {
        this.dialog.open = true;
    }
    onPrimaryAction(functions) {
        const selectedLNode = Array.from(this.dialog.querySelectorAll('mwc-check-list-item[selected]:not([disabled])') ?? []).map(selectedItem => find(this.doc, 'LNode', selectedItem.value));
        if (!selectedLNode.length)
            return;
        const selectedLLN0s = Array.from(this.dialog.querySelectorAll('mwc-select') ?? []).map(selectedItem => selectedItem.value);
        const manufacturer = this.dialog.querySelector('wizard-textfield[label="manufacturer"]').value;
        const desc = this.dialog.querySelector('wizard-textfield[label="desc"]').maybeValue;
        const apName = this.dialog.querySelector('wizard-textfield[label="AccessPoint name"]').value;
        const ied = getSpecificationIED(this.doc, {
            manufacturer,
            desc,
            apName,
            lDevices: getLDeviceDescriptions(functions, selectedLNode, selectedLLN0s),
        });
        // checkValidity: () => true disables name check as is the same here: SPECIFICATION
        this.dispatchEvent(newActionEvent({
            new: { parent: this.doc.documentElement, element: ied },
            checkValidity: () => true,
        }));
        this.dialog.close();
    }
    onClosed(ae) {
        if (!(ae.target instanceof Dialog && ae.detail?.action))
            return;
    }
    renderLLN0s(functionID, lLN0Types, lNode) {
        if (!lNode && !lLN0Types.length)
            return html ``;
        if (lNode)
            return html `<mwc-select
        disabled
        naturalMenuWidth
        value="${functionID + ': ' + lNode.getAttribute('lnType')}"
        style="width:100%"
        label="LLN0"
        >${html `<mwc-list-item
          value="${functionID + ': ' + lNode.getAttribute('lnType')}"
          >${lNode.getAttribute('lnType')}
        </mwc-list-item>`}</mwc-select
      >`;
        return html `<mwc-select
      naturalMenuWidth
      style="width:100%"
      label="LLN0"
      value="${functionID + ': ' + lLN0Types[0].getAttribute('id')}"
      >${lLN0Types.map(lLN0Type => {
            return html `<mwc-list-item
          value="${functionID + ': ' + lLN0Type.getAttribute('id')}"
          >${lLN0Type.getAttribute('id')}</mwc-list-item
        >`;
        })}</mwc-select
    >`;
    }
    renderLNodes(lNodes, disabled) {
        return lNodes.map(lNode => {
            const prefix = getFunctionNamingPrefix(lNode);
            const lnClass = lNode.getAttribute('lnClass');
            const lnInst = lNode.getAttribute('lnInst');
            const label = prefix + ' ' + lnClass + ' ' + lnInst;
            return html `<mwc-check-list-item
        ?disabled=${disabled}
        value="${identity(lNode)}"
        >${label}</mwc-check-list-item
      >`;
        });
    }
    render() {
        if (!this.doc)
            return html ``;
        const existValidLLN0 = this.lLN0s.length !== 0;
        const functionElementDescriptions = groupLNodesToFunctions(this.unreferencedLNodes);
        return html `<mwc-dialog
      heading="Create SPECIFICATION type IED"
      @closed=${this.onClosed}
      ><div>
        <wizard-textfield
          label="manufacturer"
          .maybeValue=${''}
          required
          @keypress=${() => this.requestUpdate()}
        ></wizard-textfield>
        <wizard-textfield
          label="desc"
          .maybeValue=${null}
          nullable
        ></wizard-textfield>
        <wizard-textfield
          label="AccessPoint name"
          .maybeValue=${''}
          required
          @keypress=${() => this.requestUpdate()}
        ></wizard-textfield>
        <filtered-list multi @selected=${() => this.requestUpdate()}
          >${Object.entries(functionElementDescriptions).flatMap(([id, functionDescription]) => [
            html `<mwc-list-item
                twoline
                noninteractive
                value="${id}"
                style="font-weight:500"
                ><span>${functionDescription.uniqueName}</span
                ><span slot="secondary"
                  >${existValidLLN0 ? id : 'Invalid LD: Missing LLN0'}</span
                ></mwc-list-item
              >`,
            this.renderLLN0s(functionDescription.uniqueName, this.lLN0s, functionDescription.lln0),
            ...this.renderLNodes(functionDescription.lNodes, !existValidLLN0),
            html `<li padded divider role="separator"></li>`,
        ])}</filtered-list
        >
      </div>
      <mwc-button
        slot="secondaryAction"
        dialogAction="close"
        label="${translate('close')}"
        style="--mdc-theme-primary: var(--mdc-theme-error)"
      ></mwc-button>
      <mwc-button
        ?disabled=${!this.validPriparyAction}
        slot="primaryAction"
        icon="save"
        label="${translate('save')}"
        trailingIcon
        @click=${() => this.onPrimaryAction(functionElementDescriptions)}
      ></mwc-button
    ></mwc-dialog>`;
    }
}
VirtualTemplateIED.styles = css `
    mwc-dialog {
      --mdc-dialog-max-width: 92vw;
    }

    div {
      display: flex;
      flex-direction: column;
    }

    div > * {
      display: block;
      margin-top: 16px;
    }
  `;
__decorate([
    property({ attribute: false })
], VirtualTemplateIED.prototype, "doc", void 0);
__decorate([
    property({ type: Number })
], VirtualTemplateIED.prototype, "editCount", void 0);
__decorate([
    state()
], VirtualTemplateIED.prototype, "isValidManufacturer", null);
__decorate([
    state()
], VirtualTemplateIED.prototype, "isValidApName", null);
__decorate([
    state()
], VirtualTemplateIED.prototype, "someItemsSelected", null);
__decorate([
    state()
], VirtualTemplateIED.prototype, "validPriparyAction", null);
__decorate([
    query('mwc-dialog')
], VirtualTemplateIED.prototype, "dialog", void 0);
__decorate([
    queryAll('mwc-check-list-item[selected]')
], VirtualTemplateIED.prototype, "selectedLNodeItems", void 0);
//# sourceMappingURL=VirtualTemplateIED.js.map