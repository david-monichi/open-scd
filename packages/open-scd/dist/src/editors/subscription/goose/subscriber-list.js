import { __decorate } from "tslib";
import { css, html } from 'lit';
import { property, customElement } from 'lit/decorators.js';
import { nothing } from 'lit';
import { get, translate } from 'lit-translate';
import '@material/mwc-icon';
import '@material/mwc-list';
import '@material/mwc-list/mwc-list-item';
import '../../../filtered-list.js';
import { createElement, identity, newActionEvent, } from '../../../foundation.js';
import { newGooseSubscriptionEvent, } from './foundation.js';
import { emptyInputsDeleteActions } from '../../../foundation/ied.js';
import { canCreateValidExtRef, createExtRefElement, existExtRef, getExistingSupervision, getExtRef, getFirstSubscribedExtRef, instantiateSubscriptionSupervision, removeSubscriptionSupervision, styles, SubscriberListContainer, SubscribeStatus, View, } from '../foundation.js';
/** Defining view outside the class, which makes it persistent. */
let view = View.PUBLISHER;
/** An sub element for subscribing and unsubscribing IEDs to GOOSE messages. */
let SubscriberList = class SubscriberList extends SubscriberListContainer {
    constructor() {
        super();
        this.editCount = -1;
        this.onIEDSelectEvent = this.onIEDSelectEvent.bind(this);
        this.onGOOSESelectEvent = this.onGOOSESelectEvent.bind(this);
        this.onGooseSubscriptionEvent = this.onGooseSubscriptionEvent.bind(this);
        this.onViewChange = this.onViewChange.bind(this);
        const parentDiv = this.closest('.container');
        if (parentDiv) {
            parentDiv.addEventListener('ied-select', this.onIEDSelectEvent);
            parentDiv.addEventListener('goose-select', this.onGOOSESelectEvent);
            parentDiv.addEventListener('goose-subscription', this.onGooseSubscriptionEvent);
            parentDiv.addEventListener('view', this.onViewChange);
        }
    }
    async onIEDSelectEvent(event) {
        if (!event.detail.ied)
            return;
        this.currentSelectedIed = event.detail.ied;
        this.resetElements();
        const subscribedInputs = this.currentSelectedIed.querySelectorAll(`LN0 > Inputs, LN > Inputs`);
        Array.from(this.doc.querySelectorAll('GSEControl'))
            .filter(cb => cb.hasAttribute('datSet'))
            .forEach(control => {
            const ied = control.closest('IED');
            if (ied.getAttribute('name') ==
                this.currentSelectedIed?.getAttribute('name'))
                return;
            /** If no Inputs is available, it's automatically available. */
            if (subscribedInputs.length == 0) {
                this.availableElements.push({ element: control });
                return;
            }
            let numberOfLinkedExtRefs = 0;
            const dataSet = ied.querySelector(`DataSet[name="${control.getAttribute('datSet')}"]`);
            if (!dataSet)
                return;
            dataSet.querySelectorAll('FCDA').forEach(fcda => {
                subscribedInputs.forEach(inputs => {
                    if (getExtRef(inputs, fcda, control)) {
                        numberOfLinkedExtRefs++;
                    }
                });
            });
            if (numberOfLinkedExtRefs == 0) {
                this.availableElements.push({ element: control });
                return;
            }
            if (numberOfLinkedExtRefs >= dataSet.querySelectorAll('FCDA').length) {
                this.subscribedElements.push({ element: control });
            }
            else {
                this.availableElements.push({ element: control, partial: true });
            }
        });
        this.requestUpdate();
    }
    async onGOOSESelectEvent(event) {
        if (!event.detail.dataset || !event.detail.gseControl)
            return;
        this.currentSelectedGseControl = event.detail.gseControl;
        this.currentUsedDataset = event.detail.dataset;
        this.currentGooseIedName = this.currentSelectedGseControl
            ?.closest('IED')
            ?.getAttribute('name');
        this.resetElements();
        Array.from(this.doc.querySelectorAll(':root > IED'))
            .filter(ied => ied.getAttribute('name') != this.currentGooseIedName)
            .forEach(ied => {
            const inputElements = ied.querySelectorAll(`LN0 > Inputs, LN > Inputs`);
            let numberOfLinkedExtRefs = 0;
            /**
             * If no Inputs element is found, we can safely say it's not subscribed.
             */
            if (!inputElements) {
                this.availableElements.push({ element: ied });
                return;
            }
            /**
             * Count all the linked ExtRefs.
             */
            this.currentUsedDataset.querySelectorAll('FCDA').forEach(fcda => {
                inputElements.forEach(inputs => {
                    if (getExtRef(inputs, fcda, this.currentSelectedGseControl)) {
                        numberOfLinkedExtRefs++;
                    }
                });
            });
            /**
             * Make a distinction between not subscribed at all,
             * partially subscribed and fully subscribed.
             */
            if (numberOfLinkedExtRefs == 0) {
                this.availableElements.push({ element: ied });
                return;
            }
            if (numberOfLinkedExtRefs >=
                this.currentUsedDataset.querySelectorAll('FCDA').length) {
                this.subscribedElements.push({ element: ied });
            }
            else {
                this.availableElements.push({ element: ied, partial: true });
            }
        });
        this.requestUpdate();
    }
    async onGooseSubscriptionEvent(event) {
        let iedToSubscribe = event.detail.element;
        if (view == View.SUBSCRIBER) {
            const dataSetName = event.detail.element.getAttribute('datSet');
            this.currentUsedDataset =
                event.detail.element.parentElement?.querySelector(`DataSet[name="${dataSetName}"]`);
            this.currentSelectedGseControl = event.detail.element;
            this.currentGooseIedName = event.detail.element
                .closest('IED')
                ?.getAttribute('name');
            iedToSubscribe = this.currentSelectedIed;
        }
        switch (event.detail.subscribeStatus) {
            case SubscribeStatus.Full: {
                this.unsubscribe(iedToSubscribe);
                break;
            }
            case SubscribeStatus.Partial: {
                this.subscribe(iedToSubscribe);
                break;
            }
            case SubscribeStatus.None: {
                this.subscribe(iedToSubscribe);
                break;
            }
        }
    }
    async onViewChange(event) {
        view = event.detail.view;
        this.currentSelectedIed = undefined;
        this.currentSelectedGseControl = undefined;
        this.resetElements();
        this.requestUpdate();
    }
    async subscribe(ied) {
        if (!ied.querySelector('LN0'))
            return;
        let inputsElement = ied.querySelector('LN0 > Inputs');
        if (!inputsElement)
            inputsElement = createElement(ied.ownerDocument, 'Inputs', {});
        const complexAction = {
            actions: [],
            title: get(`subscription.connect`),
        };
        this.currentUsedDataset.querySelectorAll('FCDA').forEach(fcda => {
            if (!existExtRef(inputsElement, fcda, this.currentSelectedGseControl) &&
                canCreateValidExtRef(fcda, this.currentSelectedGseControl)) {
                const extRef = createExtRefElement(this.currentSelectedGseControl, fcda);
                if (inputsElement?.parentElement)
                    complexAction.actions.push({
                        new: { parent: inputsElement, element: extRef },
                    });
                else
                    inputsElement?.appendChild(extRef);
            }
        });
        // we need to extend the actions array with the actions for the instantiation of the LGOS
        const supervisionActions = instantiateSubscriptionSupervision(this.currentSelectedGseControl, ied);
        if (inputsElement.parentElement) {
            complexAction.actions.concat(supervisionActions);
        }
        else {
            /** If the IED doesn't have a Inputs element, just append it to the first LN0 element. */
            const inputAction = [
                {
                    new: { parent: ied.querySelector('LN0'), element: inputsElement },
                },
            ];
            complexAction.actions = inputAction.concat(supervisionActions);
        }
        this.dispatchEvent(newActionEvent(complexAction));
    }
    async unsubscribe(ied) {
        const actions = [];
        ied.querySelectorAll('LN0 > Inputs, LN > Inputs').forEach(inputs => {
            this.currentUsedDataset.querySelectorAll('FCDA').forEach(fcda => {
                const extRef = getExtRef(inputs, fcda, this.currentSelectedGseControl);
                if (extRef)
                    actions.push({ old: { parent: inputs, element: extRef } });
            });
        });
        // Check if empty Input Element should also be removed.
        actions.push(...emptyInputsDeleteActions(actions));
        // we need to extend the actions array with the actions for removing the supervision
        actions.push(...removeSubscriptionSupervision(this.currentSelectedGseControl, ied));
        this.dispatchEvent(newActionEvent({
            title: get('subscription.disconnect'),
            actions: actions,
        }));
    }
    renderSubscriber(status, element) {
        let firstSubscribedExtRef = null;
        let supervisionNode = null;
        if (status !== SubscribeStatus.None) {
            if (view === View.PUBLISHER) {
                firstSubscribedExtRef = getFirstSubscribedExtRef(this.currentSelectedGseControl, element);
                supervisionNode = getExistingSupervision(firstSubscribedExtRef);
            }
            else {
                firstSubscribedExtRef = getFirstSubscribedExtRef(element, this.currentSelectedIed);
                supervisionNode = getExistingSupervision(firstSubscribedExtRef);
            }
        }
        return html ` <mwc-list-item
      @click=${() => {
            this.dispatchEvent(newGooseSubscriptionEvent(element, status ?? SubscribeStatus.None));
        }}
      graphic="avatar"
      ?hasMeta=${supervisionNode !== null}
    >
      <span
        >${view == View.PUBLISHER
            ? element.getAttribute('name')
            : element.getAttribute('name') +
                ` (${element.closest('IED')?.getAttribute('name')})`}</span
      >
      <mwc-icon slot="graphic"
        >${status == SubscribeStatus.Full ? html `clear` : html `add`}</mwc-icon
      >
      ${supervisionNode !== null
            ? html `<mwc-icon title="${identity(supervisionNode)}" slot="meta"
            >monitor_heart</mwc-icon
          >`
            : nothing}
    </mwc-list-item>`;
    }
    renderUnSubscribers(elements) {
        return html `<mwc-list-item
        noninteractive
        value="${elements
            .map(element => {
            const id = identity(element.element);
            return typeof id === 'string' ? id : '';
        })
            .join(' ')}"
      >
        <span
          >${translate('subscription.subscriber.availableToSubscribe')}</span
        >
      </mwc-list-item>
      <li divider role="separator"></li>
      ${elements.length > 0
            ? elements.map(element => this.renderSubscriber(SubscribeStatus.None, element.element))
            : html `<mwc-list-item graphic="avatar" noninteractive>
            <span>${translate('subscription.none')}</span>
          </mwc-list-item>`}`;
    }
    renderPartiallySubscribers(elements) {
        return html `<mwc-list-item
        noninteractive
        value="${elements
            .map(element => {
            const id = identity(element.element);
            return typeof id === 'string' ? id : '';
        })
            .join(' ')}"
      >
        <span>${translate('subscription.subscriber.partiallySubscribed')}</span>
      </mwc-list-item>
      <li divider role="separator"></li>
      ${elements.length > 0
            ? elements.map(element => this.renderSubscriber(SubscribeStatus.Partial, element.element))
            : html `<mwc-list-item graphic="avatar" noninteractive>
            <span>${translate('subscription.none')}</span>
          </mwc-list-item>`}`;
    }
    renderFullSubscribers() {
        return html `<mwc-list-item
        noninteractive
        value="${this.subscribedElements
            .map(element => {
            const id = identity(element.element);
            return typeof id === 'string' ? id : '';
        })
            .join(' ')}"
      >
        <span>${translate('subscription.subscriber.subscribed')}</span>
      </mwc-list-item>
      <li divider role="separator"></li>
      ${this.subscribedElements.length > 0
            ? this.subscribedElements.map(element => this.renderSubscriber(SubscribeStatus.Full, element.element))
            : html `<mwc-list-item graphic="avatar" noninteractive>
            <span>${translate('subscription.none')}</span>
          </mwc-list-item>`}`;
    }
    renderTitle() {
        const gseControlName = this.currentSelectedGseControl?.getAttribute('name') ?? undefined;
        return view == View.PUBLISHER
            ? html `<h1>
          ${translate('subscription.goose.publisher.subscriberTitle', {
                selected: gseControlName
                    ? this.currentGooseIedName + ' > ' + gseControlName
                    : 'GOOSE',
            })}
        </h1>`
            : html `<h1>
          ${translate('subscription.goose.subscriber.publisherTitle', {
                selected: this.currentSelectedIed
                    ? this.currentSelectedIed.getAttribute('name')
                    : 'IED',
            })}
        </h1>`;
    }
    firstUpdated() {
        this.currentSelectedIed = undefined;
    }
    render() {
        return html `
      <section tabindex="0">
        ${this.renderTitle()}
        ${this.availableElements.length != 0 ||
            this.subscribedElements.length != 0
            ? html `<div class="wrapper">
              <filtered-list>
                ${this.renderFullSubscribers()}
                ${this.renderPartiallySubscribers(this.availableElements.filter(element => element.partial))}
                ${this.renderUnSubscribers(this.availableElements.filter(element => !element.partial))}
              </filtered-list>
            </div>`
            : html `<mwc-list>
              <mwc-list-item noninteractive>
                <span>${view == View.PUBLISHER
                ? translate('subscription.subscriber.noControlBlockSelected')
                : translate('subscription.subscriber.noIedSelected')}</span>
              </mwc-list-item>
            </mwc-list>
          </div>`}
      </section>
    `;
    }
};
SubscriberList.styles = css `
    ${styles}

    .wrapper {
      height: 100vh;
      overflow-y: scroll;
    }
  `;
__decorate([
    property({ attribute: false })
], SubscriberList.prototype, "doc", void 0);
__decorate([
    property({ type: Number })
], SubscriberList.prototype, "editCount", void 0);
SubscriberList = __decorate([
    customElement('subscriber-list-goose')
], SubscriberList);
export { SubscriberList };
//# sourceMappingURL=subscriber-list.js.map