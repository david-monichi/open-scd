import { expect, fixture, html } from '@open-wc/testing';
import { spy } from 'sinon';
import '../../../src/addons/Wizards.js';
import { isCreate, isReplace, } from '../../../src/foundation.js';
import { createEqSubFunctionWizard, editEqSubFunctionWizard, } from '../../../src/wizards/eqsubfunction.js';
describe('Wizards for SCL EqSubFunction element', () => {
    let doc;
    let element;
    let inputs;
    let primaryAction;
    let actionEvent;
    beforeEach(async () => {
        element = await fixture(html `<oscd-wizards .host=${document}></oscd-wizards>`);
        doc = await fetch('test/testfiles/zeroline/functions.scd')
            .then(response => response.text())
            .then(str => new DOMParser().parseFromString(str, 'application/xml'));
        actionEvent = spy();
        window.addEventListener('editor-action', actionEvent);
    });
    describe('define an create wizard that', () => {
        beforeEach(async () => {
            const wizard = createEqSubFunctionWizard(doc.querySelector('EqFunction'));
            element.workflow.push(() => wizard);
            await element.requestUpdate();
            inputs = Array.from(element.wizardUI.inputs);
            primaryAction = (element.wizardUI.dialog?.querySelector('mwc-button[slot="primaryAction"]'));
            await element.wizardUI.requestUpdate(); // make sure wizard is rendered
        });
        it('looks like the the latest snapshot', async () => await expect(element.wizardUI.dialog).dom.to.equalSnapshot());
        it('does not accept empty name attribute', async () => {
            await primaryAction.click();
            expect(actionEvent).to.not.have.been.called;
        });
        it('triggers simple create action on primary action click', async () => {
            inputs[0].value = 'someNonEmptyName';
            await element.requestUpdate();
            await primaryAction.click();
            expect(actionEvent).to.be.calledOnce;
            const action = actionEvent.args[0][0].detail.action;
            expect(action).to.satisfy(isCreate);
            const createAction = action;
            expect(createAction.new.element).to.have.attribute('name', 'someNonEmptyName');
            expect(createAction.new.element).to.not.have.attribute('desc');
            expect(createAction.new.element).to.not.have.attribute('type');
        });
        it('allows to create non required attributes desc and type', async () => {
            inputs[0].value = 'someNonEmptyName';
            inputs[1].nullSwitch?.click();
            inputs[2].nullSwitch?.click();
            inputs[1].value = 'SomeDesc';
            inputs[2].value = 'SomeType';
            await element.requestUpdate();
            await primaryAction.click();
            expect(actionEvent).to.be.calledOnce;
            const action = actionEvent.args[0][0].detail.action;
            expect(action).to.satisfy(isCreate);
            const createAction = action;
            expect(createAction.new.element).to.have.attribute('name', 'someNonEmptyName');
            expect(createAction.new.element).to.have.attribute('desc', 'SomeDesc');
            expect(createAction.new.element).to.have.attribute('type', 'SomeType');
        });
    });
    describe('define an edit wizard that', () => {
        beforeEach(async () => {
            const wizard = editEqSubFunctionWizard(doc.querySelector('ConductingEquipment[name="QA1"] EqSubFunction[name="myEqSubSubFunction"]'));
            element.workflow.push(() => wizard);
            await element.requestUpdate();
            inputs = Array.from(element.wizardUI.inputs);
            primaryAction = (element.wizardUI.dialog?.querySelector('mwc-button[slot="primaryAction"]'));
            await element.wizardUI.requestUpdate(); // make sure wizard is rendered
        });
        it('looks like the the latest snapshot', async () => await expect(element.wizardUI.dialog).dom.to.equalSnapshot());
        it('does not accept empty name attribute', async () => {
            inputs[0].value = '';
            await element.requestUpdate();
            await primaryAction.click();
            expect(actionEvent).to.not.have.been.called;
        });
        it('does not trigger action without changes', async () => {
            await primaryAction.click();
            expect(actionEvent).to.not.have.been.called;
        });
        it('does not trigger action if name attribute is not unique', async () => {
            inputs[0].value = 'myEqFunc2';
            primaryAction.click();
            await element.updateComplete;
            expect(actionEvent).to.not.have.been.called;
        });
        it('triggers simple replace action updating name attribute', async () => {
            inputs[0].value = 'someNonEmptyName';
            await element.requestUpdate();
            await primaryAction.click();
            expect(actionEvent).to.be.calledOnce;
            const action = actionEvent.args[0][0].detail.action;
            expect(action).to.satisfy(isReplace);
            const createAction = action;
            expect(createAction.new.element).to.have.attribute('name', 'someNonEmptyName');
        });
        it('triggers simple replace action updating desc attribute', async () => {
            inputs[1].value = 'someDesc';
            await element.requestUpdate();
            await primaryAction.click();
            expect(actionEvent).to.be.calledOnce;
            const action = actionEvent.args[0][0].detail.action;
            expect(action).to.satisfy(isReplace);
            const createAction = action;
            expect(createAction.new.element).to.have.attribute('desc', 'someDesc');
        });
        it('triggers simple replace action updating type attribute', async () => {
            inputs[2].value = 'someType';
            await element.requestUpdate();
            await primaryAction.click();
            expect(actionEvent).to.be.calledOnce;
            const action = actionEvent.args[0][0].detail.action;
            expect(action).to.satisfy(isReplace);
            const createAction = action;
            expect(createAction.new.element).to.have.attribute('type', 'someType');
        });
    });
});
//# sourceMappingURL=eqsubfunction.test.js.map