import { html } from 'lit';
import { get, translate } from 'lit-translate';
import '@material/mwc-list';
import '@material/mwc-list/mwc-list-item';
import '../wizard-textfield.js';
import { cloneElement, getValue, } from '../foundation.js';
import { patterns } from './foundation/limits.js';
const lDeviceNamePattern = '[A-Za-z][0-9A-Za-z_]{0,2}|' +
    '[A-Za-z][0-9A-Za-z_]{4,63}|' +
    '[A-MO-Za-z][0-9A-Za-z_]{3}|' +
    'N[0-9A-Za-np-z_][0-9A-Za-z_]{2}|' +
    'No[0-9A-Za-mo-z_][0-9A-Za-z_]|' +
    'Non[0-9A-Za-df-z_]';
export function renderLdeviceWizard(ldName, readOnly, desc, ldInst) {
    return [
        readOnly
            ? html `<wizard-textfield
          label="ldName"
          .maybeValue=${ldName}
          helper="${translate('ldevice.wizard.noNameSupportHelper')}"
          helperPersistent
          readOnly
          disabled
        ></wizard-textfield>`
            : html `<wizard-textfield
          label="ldName"
          .maybeValue=${ldName}
          nullable
          helper="${translate('ldevice.wizard.nameHelper')}"
          validationMessage="${translate('textfield.required')}"
          dialogInitialFocus
          pattern="${lDeviceNamePattern}"
        ></wizard-textfield>`,
        html `<wizard-textfield
      label="desc"
      .maybeValue=${desc}
      nullable
      helper="${translate('ldevice.wizard.descHelper')}"
      pattern="${patterns.normalizedString}"
    ></wizard-textfield>`,
        html `<wizard-textfield
      label="ldInst"
      .maybeValue=${ldInst}
      readOnly
      disabled
    ></wizard-textfield>`,
    ];
}
function ldNameIsAllowed(element) {
    const ConfLdName = element
        .closest('IED')
        ?.querySelector('Services > ConfLdName');
    if (ConfLdName)
        return true;
    return false;
}
function updateAction(element) {
    return (inputs) => {
        const ldAttrs = {};
        const ldKeys = ['ldName', 'desc'];
        ldKeys.forEach(key => {
            ldAttrs[key] = getValue(inputs.find(i => i.label === key));
        });
        if (ldKeys.some(key => ldAttrs[key] !== element.getAttribute(key))) {
            const newElement = cloneElement(element, ldAttrs);
            return [
                {
                    old: { element },
                    new: { element: newElement },
                },
            ];
        }
        return [];
    };
}
export function editLDeviceWizard(element) {
    return [
        {
            title: get('ldevice.wizard.title.edit'),
            element,
            primary: {
                icon: 'edit',
                label: get('save'),
                action: updateAction(element),
            },
            content: renderLdeviceWizard(element.getAttribute('ldName'), !ldNameIsAllowed(element), element.getAttribute('desc'), element.getAttribute('inst')),
        },
    ];
}
//# sourceMappingURL=ldevice.js.map