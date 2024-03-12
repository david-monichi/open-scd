import { expect, fixture, html } from '@open-wc/testing';
import { spy } from 'sinon';
import '../../../src/addons/Wizards.js';
import { isReplace, } from '../../../src/foundation.js';
import { editOptFieldsWizard } from '../../../src/wizards/optfields.js';
describe('Wizards for SCL OptFields element', () => {
    let element;
    let optFields;
    let inputs;
    let primaryAction;
    let actionEvent;
    beforeEach(async () => {
        element = await fixture(html `<oscd-wizards .host=${document}></oscd-wizards>`);
        optFields = (new DOMParser().parseFromString(`<OptFields dataSet="true" bufOvfl="true"></OptFields>`, 'application/xml').documentElement);
        actionEvent = spy();
        window.addEventListener('editor-action', actionEvent);
    });
    describe('define an edit wizard that', () => {
        beforeEach(async () => {
            const wizard = editOptFieldsWizard(optFields);
            element.workflow.push(() => wizard);
            await element.requestUpdate();
            inputs = Array.from(element.wizardUI.inputs);
            await element.requestUpdate();
            primaryAction = (element.wizardUI.dialog?.querySelector('mwc-button[slot="primaryAction"]'));
        });
        it('looks like the latest snapshot', async () => {
            await expect(element.wizardUI.dialog).dom.to.equalSnapshot();
        }).timeout(5000);
        it('does not update a OptFields element with no changed attributes', async () => {
            primaryAction.click();
            await element.requestUpdate();
            expect(actionEvent.notCalled).to.be.true;
        });
        it('update the OptFields element with changed dataSet attribute', async () => {
            const input = inputs[2];
            input.maybeValue = 'false';
            await input.requestUpdate();
            primaryAction.click();
            await element.requestUpdate();
            expect(actionEvent).to.be.calledOnce;
            const action = actionEvent.args[0][0].detail.action;
            expect(action).to.satisfy(isReplace);
            const updateAction = action;
            expect(updateAction.old.element).to.have.attribute('dataSet', 'true');
            expect(updateAction.new.element).to.have.attribute('dataSet', 'false');
        });
        it('removes the OptFields attribute dataSet with nulled select', async () => {
            const input = inputs[2];
            input.nullSwitch?.click();
            await input.requestUpdate();
            primaryAction.click();
            await element.requestUpdate();
            expect(actionEvent).to.be.calledOnce;
            const action = actionEvent.args[0][0].detail.action;
            expect(action).to.satisfy(isReplace);
            const updateAction = action;
            expect(updateAction.old.element).to.have.attribute('dataSet', 'true');
            expect(updateAction.new.element).to.not.have.attribute('dataSet');
        });
        it('updates the OptFields element with changed seqNum attribute', async () => {
            const input = inputs[0];
            input.nullSwitch?.click();
            input.maybeValue = 'true';
            await input.requestUpdate();
            primaryAction.click();
            await element.requestUpdate();
            expect(actionEvent).to.be.calledOnce;
            const action = actionEvent.args[0][0].detail.action;
            expect(action).to.satisfy(isReplace);
            const updateAction = action;
            expect(updateAction.old.element).to.not.have.attribute('seqNum');
            expect(updateAction.new.element).to.have.attribute('seqNum', 'true');
        });
        it('updates the OptFields element with changed timeStamp attribute', async () => {
            const input = inputs[1];
            input.nullSwitch?.click();
            input.maybeValue = 'true';
            await input.requestUpdate();
            primaryAction.click();
            await element.requestUpdate();
            expect(actionEvent).to.be.calledOnce;
            const action = actionEvent.args[0][0].detail.action;
            expect(action).to.satisfy(isReplace);
            const updateAction = action;
            expect(updateAction.old.element).to.not.have.attribute('timeStamp');
            expect(updateAction.new.element).to.have.attribute('timeStamp', 'true');
        });
        it('updates the OptFields element with changed reasonCode attribute', async () => {
            const input = inputs[3];
            input.nullSwitch?.click();
            input.maybeValue = 'true';
            await input.requestUpdate();
            primaryAction.click();
            await element.requestUpdate();
            expect(actionEvent).to.be.calledOnce;
            const action = actionEvent.args[0][0].detail.action;
            expect(action).to.satisfy(isReplace);
            const updateAction = action;
            expect(updateAction.old.element).to.not.have.attribute('reasonCode');
            expect(updateAction.new.element).to.have.attribute('reasonCode', 'true');
        });
        it('updates the OptFields element with changed dataRef attribute', async () => {
            const input = inputs[4];
            input.nullSwitch?.click();
            input.maybeValue = 'true';
            await input.requestUpdate();
            primaryAction.click();
            await element.requestUpdate();
            expect(actionEvent).to.be.calledOnce;
            const action = actionEvent.args[0][0].detail.action;
            expect(action).to.satisfy(isReplace);
            const updateAction = action;
            expect(updateAction.old.element).to.not.have.attribute('dataRef');
            expect(updateAction.new.element).to.have.attribute('dataRef', 'true');
        });
        it('updates the OptFields element with changed entryID attribute', async () => {
            const input = inputs[5];
            input.nullSwitch?.click();
            input.maybeValue = 'true';
            await input.requestUpdate();
            primaryAction.click();
            await element.requestUpdate();
            expect(actionEvent).to.be.calledOnce;
            const action = actionEvent.args[0][0].detail.action;
            expect(action).to.satisfy(isReplace);
            const updateAction = action;
            expect(updateAction.old.element).to.not.have.attribute('entryID');
            expect(updateAction.new.element).to.have.attribute('entryID', 'true');
        });
        it('updates the OptFields element with changed configRef attribute', async () => {
            const input = inputs[6];
            input.nullSwitch?.click();
            input.maybeValue = 'true';
            await input.requestUpdate();
            primaryAction.click();
            await element.requestUpdate();
            expect(actionEvent).to.be.calledOnce;
            const action = actionEvent.args[0][0].detail.action;
            expect(action).to.satisfy(isReplace);
            const updateAction = action;
            expect(updateAction.old.element).to.not.have.attribute('configRef');
            expect(updateAction.new.element).to.have.attribute('configRef', 'true');
        });
        it('updates the OptFields element with changed bufOvfl attribute', async () => {
            const input = inputs[7];
            input.maybeValue = 'false';
            await input.requestUpdate();
            primaryAction.click();
            await element.requestUpdate();
            expect(actionEvent).to.be.calledOnce;
            const action = actionEvent.args[0][0].detail.action;
            expect(action).to.satisfy(isReplace);
            const updateAction = action;
            expect(updateAction.old.element).to.have.attribute('bufOvfl', 'true');
            expect(updateAction.new.element).to.have.attribute('bufOvfl', 'false');
        });
    });
});
//# sourceMappingURL=optfields.test.js.map