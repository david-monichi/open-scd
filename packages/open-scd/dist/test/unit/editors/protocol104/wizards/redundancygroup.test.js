import { expect, fixture, html } from '@open-wc/testing';
import { spy } from 'sinon';
import '../../../../../src/addons/Wizards.js';
import { isCreate, isDelete, isReplace, } from '../../../../../src/foundation.js';
import { createRedundancyGroupWizard, editRedundancyGroupWizard, } from '../../../../../src/editors/protocol104/wizards/redundancygroup.js';
describe('Wizards for the Redundancy Group SCL element group', () => {
    let doc;
    let element;
    let inputs;
    let input;
    let primaryAction;
    let actionEvent;
    beforeEach(async () => {
        doc = await fetch('/test/testfiles/104/valid-subnetwork.scd')
            .then(response => response.text())
            .then(str => new DOMParser().parseFromString(str, 'application/xml'));
        element = await fixture(html `<oscd-wizards .host=${document}></oscd-wizards>`);
        actionEvent = spy();
        window.addEventListener('editor-action', actionEvent);
    });
    describe('include an edit wizard that', () => {
        beforeEach(async () => {
            const wizard = editRedundancyGroupWizard(doc.querySelector('Communication > SubNetwork[name="W1"] > ConnectedAP[iedName="B1"]'), 2);
            element.workflow.push(() => wizard);
            await element.requestUpdate();
            inputs = Array.from(element.wizardUI.inputs);
            primaryAction = (element.wizardUI.dialog?.querySelector('mwc-button[slot="primaryAction"]'));
        });
        it('does not edit any P element with unchanged wizard inputs', async () => {
            primaryAction.click();
            await element.requestUpdate();
            expect(actionEvent).to.not.have.been.called;
        });
        it('does not trigger a editor action to update P elements(s) when not all fields are filled in', async () => {
            input = (inputs.find(input => input.label === 'TIMEOUT-1'));
            input.value = '';
            await input.requestUpdate();
            primaryAction.click();
            await element.requestUpdate();
            expect(actionEvent).to.not.have.been.called;
        });
        it('properly updates a P element of type TIMEOUT-1', async () => {
            input = (inputs.find(input => input.label === 'TIMEOUT-1'));
            input.value = '18';
            await input.requestUpdate();
            primaryAction.click();
            await element.requestUpdate();
            const complexAction = actionEvent.args[0][0].detail.action;
            expect(complexAction.title).to.contain('edit');
            expect(complexAction.actions).to.have.lengthOf(1);
            const action = complexAction.actions[0];
            expect(action).to.satisfy(isReplace);
            expect(action.old.element.textContent).to.eql('3');
            expect(action.new.element.textContent).to.eql('18');
        });
        it('properly creates a P element if not present', async () => {
            doc
                .querySelector('Communication > SubNetwork[name="W1"] > ConnectedAP[iedName="B1"] > Address > P[type="RG2-TIMEOUT-2"]')
                ?.remove();
            input = (inputs.find(input => input.label === 'TIMEOUT-2'));
            input.value = '77';
            await input.requestUpdate();
            primaryAction.click();
            await element.requestUpdate();
            const complexAction = actionEvent.args[0][0].detail.action;
            expect(complexAction.title).to.contain('edit');
            expect(complexAction.actions).to.have.lengthOf(1);
            const action = complexAction.actions[0];
            expect(action).to.satisfy(isCreate);
            expect(action.new.element.textContent).to.eql('77');
        });
        it('properly deletes a full Redundancy Group', async () => {
            const deleteAction = (element.wizardUI.dialog?.querySelectorAll('mwc-menu > mwc-list-item')[1]);
            deleteAction.click();
            await element.requestUpdate();
            const complexAction = actionEvent.args[0][0].detail.action;
            expect(complexAction.title).to.contain('remove');
            expect(complexAction.actions).to.have.lengthOf(8);
            const ip = complexAction.actions[0];
            expect(ip).to.satisfy(isDelete);
            expect(ip.old.element.textContent).to.eql('192.128.0.2');
            const subNet = complexAction.actions[1];
            expect(subNet).to.satisfy(isDelete);
            expect(subNet.old.element.textContent).to.eql('255.255.255.0');
            const wFactor = complexAction.actions[2];
            expect(wFactor).to.satisfy(isDelete);
            expect(wFactor.old.element.textContent).to.eql('8');
            const kFactor = complexAction.actions[3];
            expect(kFactor).to.satisfy(isDelete);
            expect(kFactor.old.element.textContent).to.eql('12');
            const timeout0 = complexAction.actions[4];
            expect(timeout0).to.satisfy(isDelete);
            expect(timeout0.old.element.textContent).to.eql('30');
            const timeout1 = complexAction.actions[5];
            expect(timeout1).to.satisfy(isDelete);
            expect(timeout1.old.element.textContent).to.eql('3');
            const timeout2 = complexAction.actions[6];
            expect(timeout2).to.satisfy(isDelete);
            expect(timeout2.old.element.textContent).to.eql('10');
            const timeout3 = complexAction.actions[7];
            expect(timeout3).to.satisfy(isDelete);
            expect(timeout3.old.element.textContent).to.eql('20');
        });
    });
    describe('include a create wizard that', () => {
        beforeEach(async () => {
            const wizard = createRedundancyGroupWizard(doc.querySelector('SubNetwork[type="104"] > ConnectedAP[iedName="B1"][apName="AP1"]'), [1, 2]);
            element.workflow.push(() => wizard);
            await element.requestUpdate();
            inputs = Array.from(element.wizardUI.inputs);
            primaryAction = (element.wizardUI.dialog?.querySelector('mwc-button[slot="primaryAction"]'));
        });
        it('looks like the latest snapshot', async () => {
            await expect(element.wizardUI.dialog).dom.to.equalSnapshot();
        });
        it("doesn't trigger a create editor action on primary action without all fields being filled in", async () => {
            const ipElement = (inputs.find(input => input.label === 'K-FACTOR'));
            ipElement.value = '8';
            await ipElement.requestUpdate();
            primaryAction.click();
            await element.requestUpdate();
            expect(actionEvent).to.not.have.been.called;
        });
        it('triggers a create editor action on primary action with all fields being filled in', async () => {
            (inputs.find(input => input.label === 'W-FACTOR')).value = '5';
            (inputs.find(input => input.label === 'K-FACTOR')).value = '9';
            (inputs.find(input => input.label === 'TIMEOUT-0')).value = '15';
            (inputs.find(input => input.label === 'TIMEOUT-1')).value = '20';
            (inputs.find(input => input.label === 'TIMEOUT-2')).value = '25';
            (inputs.find(input => input.label === 'TIMEOUT-3')).value = '30';
            await element.requestUpdate();
            primaryAction.click();
            await element.requestUpdate();
            const complexAction = actionEvent.args[0][0].detail.action;
            expect(complexAction.title).to.contain('add');
            expect(complexAction.actions).to.have.lengthOf(6);
            const wFactor = complexAction.actions[0];
            expect(wFactor).to.satisfy(isCreate);
            expect(wFactor.new.element.textContent).to.eql('5');
            const kFactor = complexAction.actions[1];
            expect(kFactor).to.satisfy(isCreate);
            expect(kFactor.new.element.textContent).to.eql('9');
            const timeout0 = complexAction.actions[2];
            expect(timeout0).to.satisfy(isCreate);
            expect(timeout0.new.element.textContent).to.eql('15');
            const timeout1 = complexAction.actions[3];
            expect(timeout1).to.satisfy(isCreate);
            expect(timeout1.new.element.textContent).to.eql('20');
            const timeout2 = complexAction.actions[4];
            expect(timeout2).to.satisfy(isCreate);
            expect(timeout2.new.element.textContent).to.eql('25');
            const timeout3 = complexAction.actions[5];
            expect(timeout3).to.satisfy(isCreate);
            expect(timeout3.new.element.textContent).to.eql('30');
        });
    });
});
//# sourceMappingURL=redundancygroup.test.js.map