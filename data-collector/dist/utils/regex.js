"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalize = exports.normalizeStr = exports.isQuerySelector = void 0;
const const_1 = require("./const");
const isQuerySelector = (selector) => /(.*?)((document.(querySelector|getElementBy)(.*?))|\$|jQuery)\((.*?)\)(.*?)/g.test(selector);
exports.isQuerySelector = isQuerySelector;
const normalizeStr = (str) => str.replace(/(\r\n|\n|\r)/g, '');
exports.normalizeStr = normalizeStr;
const normalize = (value) => Array.isArray(value)
    ? value.map((v) => (0, exports.normalize)(v))
    : typeof value === 'object'
        ? Object.entries(value).reduce((all, [key, value]) => ({
            ...all,
            [key]: (0, exports.normalize)(value),
        }), {})
        : !isNaN(+(0, exports.normalizeStr)(`${value}`))
            ? +(0, exports.normalizeStr)(`${value}`)
            : const_1.TRUE_VALUES.includes((0, exports.normalizeStr)(`${value}`))
                ? true
                : const_1.FALSE_VALUES.includes((0, exports.normalizeStr)(`${value}`))
                    ? false
                    : const_1.NULL_VALUES.includes((0, exports.normalizeStr)(`${value}`))
                        ? null
                        : (0, exports.normalizeStr)(`${value}`);
exports.normalize = normalize;
//# sourceMappingURL=regex.js.map