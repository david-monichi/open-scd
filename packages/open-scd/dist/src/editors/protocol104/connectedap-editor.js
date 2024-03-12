import { __decorate } from "tslib";
import { customElement, html, property } from 'lit-element';
import '@material/mwc-fab';
import '../../action-icon.js';
import { newActionEvent, newWizardEvent } from '../../foundation.js';
import { editConnectedApWizard } from './wizards/connectedap.js';
import { Base104Container } from './base-container.js';
/** [[`104`]] subeditor for a `ConnectedAP` element. */
let ConnectedAP104Editor = class ConnectedAP104Editor extends Base104Container {
    openEditWizard() {
        this.dispatchEvent(newWizardEvent(() => editConnectedApWizard(this.element, this.element.querySelectorAll('Address > P[type^="RG"]').length > 0)));
    }
    remove() {
        if (this.element)
            this.dispatchEvent(newActionEvent({
                old: {
                    parent: this.element.parentElement,
                    element: this.element,
                    reference: this.element.nextSibling,
                },
            }));
    }
    render() {
        return html `
      <action-icon
        label="${this.element.getAttribute('apName') ?? 'UNDEFINED'}"
        icon="settings_input_hdmi"
        ><mwc-fab
          slot="action"
          mini
          icon="edit"
          @click="${() => this.openEditWizard()}"
        ></mwc-fab>
        <mwc-fab
          slot="action"
          mini
          icon="delete"
          @click="${() => this.remove()}}"
        ></mwc-fab
      ></action-icon>
    `;
    }
};
__decorate([
    property({ attribute: false })
], ConnectedAP104Editor.prototype, "element", void 0);
ConnectedAP104Editor = __decorate([
    customElement('connectedap-104-editor')
], ConnectedAP104Editor);
export { ConnectedAP104Editor };
//# sourceMappingURL=connectedap-editor.js.map