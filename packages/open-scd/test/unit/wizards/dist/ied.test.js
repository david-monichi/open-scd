"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var testing_1 = require("@open-wc/testing");
require("../../../src/addons/Wizards.js");
var foundation_js_1 = require("../../../src/foundation.js");
var ied_js_1 = require("../../../src/wizards/ied.js");
var test_support_js_1 = require("./test-support.js");
var actions_js_1 = require("../../../src/wizards/foundation/actions.js");
describe('Wizards for SCL element IED', function () {
    var doc;
    var ied;
    var element;
    var inputs;
    beforeEach(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, test_support_js_1.fetchDoc('/test/testfiles/wizards/ied.scd')];
                case 1:
                    doc = _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    describe('edit IED', function () {
        beforeEach(function () { return __awaiter(void 0, void 0, void 0, function () {
            var wizard;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        ied = doc.querySelector('IED[name="IED3"]');
                        return [4 /*yield*/, testing_1.fixture(testing_1.html(templateObject_1 || (templateObject_1 = __makeTemplateObject(["<oscd-wizards .host=", "></oscd-wizards>"], ["<oscd-wizards .host=", "></oscd-wizards>"])), document))];
                    case 1:
                        element = _a.sent();
                        wizard = ied_js_1.editIEDWizard(ied);
                        element.workflow.push(function () { return wizard; });
                        return [4 /*yield*/, element.requestUpdate()];
                    case 2:
                        _a.sent();
                        inputs = Array.from(element.wizardUI.inputs);
                        return [2 /*return*/];
                }
            });
        }); });
        it('contains a wizard-textfield with a non-empty "type" value', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                testing_1.expect((_a = inputs.find(function (textField) { return textField.label == 'type'; })) === null || _a === void 0 ? void 0 : _a.value).to.be.equal(ied.getAttribute('type') || '-');
                return [2 /*return*/];
            });
        }); });
        it('contains a wizard-textfield with a non-empty "manufacturer" value', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                testing_1.expect((_a = inputs.find(function (textField) { return textField.label == 'manufacturer'; })) === null || _a === void 0 ? void 0 : _a.value).to.be.equal(ied.getAttribute('manufacturer') || '-');
                return [2 /*return*/];
            });
        }); });
        it('contains a wizard-textfield with a non-empty "configVersion" value', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                testing_1.expect((_a = inputs.find(function (textField) { return textField.label == 'configVersion'; })) === null || _a === void 0 ? void 0 : _a.value).to.be.equal(ied.getAttribute('configVersion') || '-');
                return [2 /*return*/];
            });
        }); });
        it('contains a wizard-textfield with a non-empty "originalSclVersion" value', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                testing_1.expect((_a = inputs.find(function (textField) { return textField.label == 'originalSclVersion'; })) === null || _a === void 0 ? void 0 : _a.value).to.contain(ied.getAttribute('originalSclVersion') || '-');
                return [2 /*return*/];
            });
        }); });
        it('contains a wizard-textfield with an empty "engRight" value', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                testing_1.expect((_a = inputs.find(function (textField) { return textField.label == 'engRight'; })) === null || _a === void 0 ? void 0 : _a.value).to.be.equal(ied.getAttribute('engRight') || '-');
                return [2 /*return*/];
            });
        }); });
        it('contains a wizard-textfield with a non-empty "owner" value', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                testing_1.expect((_a = inputs.find(function (textField) { return textField.label == 'owner'; })) === null || _a === void 0 ? void 0 : _a.value).to.be.equal(ied.getAttribute('owner') || '-');
                return [2 /*return*/];
            });
        }); });
        it('update name should be updated in document', function () {
            return __awaiter(this, void 0, void 0, function () {
                var complexAction, simpleActions;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, test_support_js_1.setWizardTextFieldValue(inputs[0], 'OtherIED3')];
                        case 1:
                            _a.sent();
                            complexAction = actions_js_1.updateNamingAttributeWithReferencesAction(ied, 'ied.action.updateied')(inputs, element.wizardUI);
                            testing_1.expect(complexAction.length).to.equal(1);
                            testing_1.expect(complexAction[0]).to.not.satisfy(foundation_js_1.isSimple);
                            simpleActions = complexAction[0].actions;
                            testing_1.expect(simpleActions.length).to.equal(2);
                            test_support_js_1.expectUpdateAction(simpleActions[0], 'IED', 'name', 'IED3', 'OtherIED3');
                            test_support_js_1.expectReplaceAction(simpleActions[1], 'ConnectedAP', 'iedName', 'IED3', 'OtherIED3');
                            return [2 /*return*/];
                    }
                });
            });
        });
        it('update name should be unique in document', function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, test_support_js_1.setWizardTextFieldValue(inputs[0], 'IED2')];
                        case 1:
                            _a.sent();
                            testing_1.expect(inputs[0].checkValidity()).to.be["false"];
                            return [2 /*return*/];
                    }
                });
            });
        });
        it('update description should be updated in document', function () {
            return __awaiter(this, void 0, void 0, function () {
                var complexAction, simpleActions;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, test_support_js_1.setWizardTextFieldValue(inputs[1], 'Some description')];
                        case 1:
                            _a.sent();
                            complexAction = actions_js_1.updateNamingAttributeWithReferencesAction(ied, 'ied.action.updateied')(inputs, element.wizardUI);
                            testing_1.expect(complexAction.length).to.equal(1);
                            testing_1.expect(complexAction[0]).to.not.satisfy(foundation_js_1.isSimple);
                            simpleActions = complexAction[0].actions;
                            testing_1.expect(simpleActions.length).to.equal(1);
                            test_support_js_1.expectUpdateAction(simpleActions[0], 'IED', 'desc', null, 'Some description');
                            return [2 /*return*/];
                    }
                });
            });
        });
        it('when no fields changed there will be no update action', function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    test_support_js_1.expectWizardNoUpdateAction(actions_js_1.updateNamingAttributeWithReferencesAction(ied, 'ied.action.updateied'), element.wizardUI, inputs);
                    return [2 /*return*/];
                });
            });
        });
        it('looks like the latest snapshot', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, testing_1.expect(element.wizardUI.dialog).dom.to.equalSnapshot()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('remove IED', function () {
        beforeEach(function () { return __awaiter(void 0, void 0, void 0, function () {
            var wizard;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        ied = doc.querySelector('IED[name="IED1"]');
                        return [4 /*yield*/, testing_1.fixture(testing_1.html(templateObject_2 || (templateObject_2 = __makeTemplateObject(["<oscd-wizards .host=", "></oscd-wizards>"], ["<oscd-wizards .host=", "></oscd-wizards>"])), document))];
                    case 1:
                        element = _a.sent();
                        wizard = ied_js_1.removeIEDWizard(ied);
                        element.workflow.push(function () { return wizard; });
                        return [4 /*yield*/, element.requestUpdate()];
                    case 2:
                        _a.sent();
                        inputs = Array.from(element.wizardUI.inputs);
                        return [2 /*return*/];
                }
            });
        }); });
        it('remove IED should return expected actions', function () {
            return __awaiter(this, void 0, void 0, function () {
                var complexAction, simpleActions;
                return __generator(this, function (_a) {
                    complexAction = ied_js_1.removeIEDAndReferences(ied)(inputs, element.wizardUI);
                    testing_1.expect(complexAction.length).to.equal(1);
                    testing_1.expect(complexAction[0]).to.not.satisfy(foundation_js_1.isSimple);
                    simpleActions = complexAction[0].actions;
                    testing_1.expect(simpleActions.length).to.equal(12);
                    test_support_js_1.expectDeleteAction(simpleActions[0], 'IED');
                    test_support_js_1.expectDeleteAction(simpleActions[1], 'Association');
                    test_support_js_1.expectDeleteAction(simpleActions[2], 'ClientLN');
                    test_support_js_1.expectDeleteAction(simpleActions[11], 'Inputs');
                    return [2 /*return*/];
                });
            });
        });
        it('looks like the latest snapshot', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, testing_1.expect(element.wizardUI.dialog).dom.to.equalSnapshot()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
var templateObject_1, templateObject_2;
