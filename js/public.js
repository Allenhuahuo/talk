function $(selector) {
    return document.querySelector(selector);
}

function $$(selector) {
    return document.querySelectorAll(selector);
}

/**
 * 构建元素
 * @param {*} selector
 */
function $$$(selector) {
    return document.createElement(selector);
}