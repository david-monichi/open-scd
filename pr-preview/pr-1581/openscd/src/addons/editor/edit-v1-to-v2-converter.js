import {
  isCreate,
  isDelete,
  isMove,
  isReplace,
  isSimple,
  isUpdate
} from "../../../../_snowpack/link/packages/core/dist/foundation/deprecated/editor.js";
import {getReference} from "../../foundation.js";
export function convertEditV1toV2(action) {
  if (isSimple(action)) {
    return convertSimpleAction(action);
  } else {
    return action.actions.map(convertSimpleAction);
  }
}
function convertSimpleAction(action) {
  if (isCreate(action)) {
    return convertCreate(action);
  } else if (isDelete(action)) {
    return convertDelete(action);
  } else if (isUpdate(action)) {
    return convertUpdate(action);
  } else if (isMove(action)) {
    return convertMove(action);
  } else if (isReplace(action)) {
    return convertReplace(action);
  }
  throw new Error("Unknown action type");
}
function convertCreate(action) {
  let reference = null;
  if (action.new.reference === void 0 && action.new.element instanceof Element && action.new.parent instanceof Element) {
    reference = getReference(action.new.parent, action.new.element.tagName);
  } else {
    reference = action.new.reference ?? null;
  }
  return {
    parent: action.new.parent,
    node: action.new.element,
    reference
  };
}
function convertDelete(action) {
  return {
    node: action.old.element
  };
}
function convertUpdate(action) {
  return {
    element: action.element,
    attributes: action.newAttributes
  };
}
function convertMove(action) {
  return {
    parent: action.new.parent,
    node: action.old.element,
    reference: action.new.reference ?? null
  };
}
function convertReplace(action) {
  const oldChildren = action.old.element.children;
  const newNode = action.new.element.cloneNode();
  newNode.append(...Array.from(oldChildren));
  const parent = action.old.element.parentElement;
  if (!parent) {
    throw new Error("Replace action called without parent in old element");
  }
  const reference = action.old.element.nextSibling;
  const remove = {node: action.old.element};
  const insert = {
    parent,
    node: newNode,
    reference
  };
  return [
    remove,
    insert
  ];
}
