import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { translate } from 'lit-translate';
import '@material/mwc-checkbox';
import '@material/mwc-formfield';
import '../wizard-textfield.js';
import { createElement } from '../foundation.js';
import { typeNullable, typePattern } from './foundation/p-types.js';
export function contentGseOrSmvWizard(content) {
    return [
        html `<mwc-formfield
      label="${translate('connectedap.wizard.addschemainsttype')}"
    >
      <mwc-checkbox
        id="instType"
        ?checked="${content.hasInstType}"
      ></mwc-checkbox>
    </mwc-formfield>`,
        html `${Object.entries(content.attributes).map(([key, value]) => html `<wizard-textfield
          label="${key}"
          ?nullable=${typeNullable[key]}
          .maybeValue=${value}
          pattern="${ifDefined(typePattern[key])}"
          required
        ></wizard-textfield>`)}`,
    ];
}
function isEqualAddress(oldAddr, newAdddr) {
    if (oldAddr.querySelectorAll('P').length !==
        newAdddr.querySelectorAll('P').length)
        return false;
    return (Array.from(oldAddr.querySelectorAll('P')).filter(pType => !newAdddr
        .querySelector(`Address > P[type="${pType.getAttribute('type')}"]`)
        ?.isEqualNode(pType)).length === 0);
}
export function createAddressElement(inputs, parent, instType) {
    const element = createElement(parent.ownerDocument, 'Address', {});
    Object.entries(inputs)
        .filter(([key, value]) => value !== null)
        .forEach(([key, value]) => {
        const type = key;
        const child = createElement(parent.ownerDocument, 'P', { type });
        if (instType)
            child.setAttributeNS('http://www.w3.org/2001/XMLSchema-instance', 'xsi:type', 'tP_' + key);
        child.textContent = value;
        element.appendChild(child);
    });
    return element;
}
export function updateAddress(parent, inputs, instType) {
    const actions = [];
    const newAddress = createAddressElement(inputs, parent, instType);
    const oldAddress = parent.querySelector('Address');
    if (oldAddress !== null && !isEqualAddress(oldAddress, newAddress)) {
        //address & child elements P are changed: cannot use replace editor action
        actions.push({
            old: {
                parent: parent,
                element: oldAddress,
                reference: oldAddress.nextSibling,
            },
        });
        actions.push({
            new: {
                parent: parent,
                element: newAddress,
                reference: oldAddress.nextSibling,
            },
        });
    }
    else if (oldAddress === null)
        actions.push({
            new: {
                parent: parent,
                element: newAddress,
            },
        });
    return actions;
}
//# sourceMappingURL=address.js.map