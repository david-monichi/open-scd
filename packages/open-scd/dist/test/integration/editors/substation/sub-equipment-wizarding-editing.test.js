import { fixture, html, expect } from '@open-wc/testing';
import '../../../mock-wizard-editor.js';
import '../../../../src/editors/substation/sub-equipment-editor.js';
const openAndCancelMenu = (parent, element) => new Promise(async (resolve) => {
    expect(parent.wizardUI.dialog).to.be.undefined;
    element?.shadowRoot
        ?.querySelector("mwc-icon-button[icon='playlist_add']")
        .click();
    const lnodMenuItem = element?.shadowRoot?.querySelector(`mwc-list-item[value='LNode']`);
    lnodMenuItem.click();
    await new Promise(resolve => setTimeout(resolve, 100)); // await animation
    expect(parent.wizardUI.dialog).to.exist;
    const secondaryAction = (parent.wizardUI.dialog?.querySelector('mwc-button[slot="secondaryAction"]'));
    secondaryAction.click();
    await new Promise(resolve => setTimeout(resolve, 100)); // await animation
    expect(parent.wizardUI.dialog).to.be.undefined;
    return resolve();
});
describe('sub-equipment-editor wizarding editing integration', () => {
    let doc;
    let parent;
    let element;
    beforeEach(async () => {
        doc = await fetch('/test/testfiles/SubEquipment.scd')
            .then(response => response.text())
            .then(str => new DOMParser().parseFromString(str, 'application/xml'));
        parent = (await fixture(html `<mock-wizard-editor
          ><sub-equipment-editor
            .element=${doc.querySelector('SubEquipment[name="subque"]')}
          ></sub-equipment-editor
        ></mock-wizard-editor>`));
        element = parent.querySelector('sub-equipment-editor');
    });
    describe('open edit wizard', () => {
        let nameField;
        let virtualField;
        let primaryAction;
        beforeEach(async () => {
            (element?.shadowRoot?.querySelector('mwc-icon-button[icon="edit"]')).click();
            await parent.updateComplete;
            await parent.wizardUI.updateComplete;
            nameField = (parent.wizardUI.dialog?.querySelector('wizard-textfield[label="name"]'));
            virtualField = (parent.wizardUI.dialog?.querySelector('wizard-checkbox[label="virtual"]'));
            primaryAction = (parent.wizardUI.dialog?.querySelector('mwc-button[slot="primaryAction"]'));
        });
        it('does not update SubEquipment if name attribute is not unique', async () => {
            nameField.value = 'addEqi';
            primaryAction.click();
            await parent.updateComplete;
            expect(doc.querySelectorAll('SubEquipment[name="addEqi"]')).to.lengthOf(1);
        });
        it('does update SubEquipment if name attribute is unique', async () => {
            nameField.value = 'addEqi2';
            await parent.updateComplete;
            primaryAction.click();
            expect(doc.querySelector('SubEquipment[name="addEqi2"]')).to.exist;
            expect(doc.querySelector('SubEquipment[name="subque"]')).to.not.exist;
        });
        it('does update SubEquipment when virtual is checked', async () => {
            expect(virtualField.nullSwitch).to.exist;
            virtualField.nullSwitch?.click();
            virtualField.maybeValue = 'true';
            await parent.updateComplete;
            primaryAction.click();
            expect(doc
                .querySelector('SubEquipment[name="subque"]')
                ?.hasAttribute('virtual'));
            expect(doc
                .querySelector('SubEquipment[name="subque"]')
                ?.getAttribute('virtual')).to.equal('true');
        });
        describe('has a delete icon button that', () => {
            let deleteButton;
            beforeEach(async () => {
                deleteButton = (element?.shadowRoot?.querySelector('mwc-icon-button[icon="delete"]'));
                await parent.updateComplete;
            });
            it('removes the attached SubEquipment element from the document', async () => {
                expect(doc.querySelector('SubEquipment[name="subque"]')).to.exist;
                await deleteButton.click();
                expect(doc.querySelector('SubEquipment[name="subque"]')).to.not.exist;
            });
        });
    });
    describe('Open add wizard', () => {
        let doc;
        let parent;
        let element;
        beforeEach(async () => {
            doc = await fetch('/test/testfiles/SubEquipment.scd')
                .then(response => response.text())
                .then(str => new DOMParser().parseFromString(str, 'application/xml'));
            parent = (await fixture(html `<mock-wizard-editor
            ><sub-equipment-editor
              .element=${doc.querySelector('SubEquipment[name="subque"]')}
              ?showfunctions=${true}
            ></sub-equipment-editor
          ></mock-wizard-editor>`));
            element = parent.querySelector('sub-equipment-editor');
            await parent.updateComplete;
        });
        it('Should open the same wizard for the second time', async () => {
            await openAndCancelMenu(parent, element);
            await openAndCancelMenu(parent, element);
        });
    });
});
//# sourceMappingURL=sub-equipment-wizarding-editing.test.js.map