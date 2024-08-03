"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _BrowserService_taskId, _BrowserService_url, _BrowserService_browser, _BrowserService_page, _BrowserService_info, _BrowserService_logs, _BrowserService_error, _BrowserService_files;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrowserService = void 0;
const puppeteer_1 = require("puppeteer");
const uuid_1 = require("uuid");
const utils_1 = require("../utils");
const file_service_1 = require("./file.service");
class BrowserService {
    constructor(url) {
        _BrowserService_taskId.set(this, void 0);
        _BrowserService_url.set(this, void 0);
        _BrowserService_browser.set(this, void 0);
        _BrowserService_page.set(this, void 0);
        _BrowserService_info.set(this, {});
        _BrowserService_logs.set(this, []);
        _BrowserService_error.set(this, void 0);
        _BrowserService_files.set(this, []);
        __classPrivateFieldSet(this, _BrowserService_taskId, (0, uuid_1.v4)(), "f");
        __classPrivateFieldSet(this, _BrowserService_url, url, "f");
    }
    get resultPath() {
        return `output/${__classPrivateFieldGet(this, _BrowserService_taskId, "f")}`;
    }
    async getBrowser() {
        if (__classPrivateFieldGet(this, _BrowserService_browser, "f"))
            return __classPrivateFieldGet(this, _BrowserService_browser, "f");
        const browser = await (0, puppeteer_1.launch)({ headless: false });
        __classPrivateFieldSet(this, _BrowserService_browser, browser, "f");
        return browser;
    }
    async close() {
        if (__classPrivateFieldGet(this, _BrowserService_browser, "f"))
            await __classPrivateFieldGet(this, _BrowserService_browser, "f").close();
    }
    async getPage() {
        if (__classPrivateFieldGet(this, _BrowserService_page, "f"))
            return __classPrivateFieldGet(this, _BrowserService_page, "f");
        const browser = await this.getBrowser();
        const page = await browser.newPage();
        __classPrivateFieldSet(this, _BrowserService_page, page, "f");
        return page;
    }
    async exportFile(content, fileName) {
        __classPrivateFieldGet(this, _BrowserService_files, "f").push(`${__classPrivateFieldGet(this, _BrowserService_taskId, "f")}/${fileName}`);
        const buffer = Buffer.isBuffer(content) ? content : Buffer.from(content);
        return file_service_1.FileService.write(this.resultPath, fileName, buffer);
    }
    async log(log) {
        __classPrivateFieldGet(this, _BrowserService_logs, "f").push(log);
    }
    async endNavigation() {
        await this.close();
        const result = {
            taskId: __classPrivateFieldGet(this, _BrowserService_taskId, "f"),
            url: __classPrivateFieldGet(this, _BrowserService_url, "f"),
            complete: !__classPrivateFieldGet(this, _BrowserService_error, "f"),
            ...(__classPrivateFieldGet(this, _BrowserService_error, "f")
                ? { error: __classPrivateFieldGet(this, _BrowserService_error, "f") }
                : {
                    info: __classPrivateFieldGet(this, _BrowserService_info, "f"),
                    files: [...__classPrivateFieldGet(this, _BrowserService_files, "f"), `${__classPrivateFieldGet(this, _BrowserService_taskId, "f")}/result.json`],
                }),
            logs: __classPrivateFieldGet(this, _BrowserService_logs, "f"),
        };
        await this.exportFile(JSON.stringify(result), 'result.json');
        return result;
    }
    async execute(steps = []) {
        this.log(`Starting task '${__classPrivateFieldGet(this, _BrowserService_taskId, "f")}'`);
        const _steps = [
            {
                step: 'navigate',
                url: __classPrivateFieldGet(this, _BrowserService_url, "f"),
                critical: true,
                wait: 1000,
            },
            ...steps,
            { step: 'wait', time: 1000 },
            { step: 'export' },
        ];
        let i = 0;
        for (const step of _steps) {
            try {
                this.log(`Starting step [${i}-${step.step}]`);
                switch (step.step) {
                    case 'click':
                        await this.click(step.selector);
                        break;
                    case 'navigate':
                        await this.navigate(step.url, step.timeout, step.event);
                        break;
                    case 'scroll':
                        await this.scroll(step.distance, step.delay, step.direction, step.selector);
                        break;
                    case 'info':
                        await this.getInfo(step.key, step.script);
                        break;
                    case 'export':
                        await this.export(step.name);
                        break;
                    case 'captcha':
                        await this.captcha(step.type, step.file_selector, step.response_selector);
                        break;
                    case 'select':
                        await this.select(step.selector, step.option);
                        break;
                    case 'input':
                        await this.input(step.selector, step.value);
                        break;
                    case 'wait':
                        await this.wait(step.time);
                        break;
                    default:
                        throw new Error(`Invalid step provided`);
                }
                i++;
                if (step.wait)
                    await this.wait(step.wait);
            }
            catch (error) {
                const err = error;
                if (step.critical) {
                    error = err.message ?? 'Unknown Error';
                    this.log(`Error in step [${i}-${step.step}]: ${error}`);
                    __classPrivateFieldSet(this, _BrowserService_error, error, "f");
                    break;
                }
                this.log(`Warning in step [${i}-${step.step}]: ${err.message}`);
            }
        }
        return this.endNavigation();
    }
    async evaluate(func, ...params) {
        const page = await this.getPage();
        return page.evaluate(func, ...params);
    }
    async evaluateScript(script) {
        const page = await this.getPage();
        return page.evaluate(script);
    }
    async click(selector) {
        if (!selector)
            throw new Error('No selector provided');
        return this.evaluate((selector, useEval) => {
            const element = (useEval ? eval(selector) : document.querySelector(selector));
            if (!element)
                return false;
            element.click();
            return true;
        }, selector, (0, utils_1.isQuerySelector)(selector)).then((result) => {
            if (!result)
                throw new Error(`Element '${selector}' not exists `);
        });
    }
    async scroll(distance = 200, delay = 500, direction, selector) {
        const promise = selector
            ? () => this.evaluate((selector, useEval) => {
                const element = (useEval ? eval(selector) : document.querySelector(selector));
                if (!element)
                    return false;
                element.scrollBy(0, +element.scrollHeight / 3);
                return true;
            }, selector, (0, utils_1.isQuerySelector)(selector)).then((res) => {
                if (!res)
                    throw new Error(`Element '${selector}' not exists`);
                return res;
            })
            : () => this.evaluate((distance, delay, direction) => {
                if (direction === 'infinity')
                    return new Promise((resolve) => {
                        let totalHeight = 0;
                        const timer = setInterval(() => {
                            const { scrollHeight } = document.body;
                            window.scrollBy(0, distance);
                            totalHeight += distance;
                            if (totalHeight >= scrollHeight - window.innerHeight) {
                                clearInterval(timer);
                                resolve(true);
                            }
                        }, delay);
                    });
                if (!direction)
                    return new Promise((resolve) => {
                        let i = 0;
                        const timer = setInterval(() => {
                            window.scrollBy(0, distance);
                            if (++i === 3) {
                                clearInterval(timer);
                                resolve(true);
                            }
                        }, delay);
                    });
                window.scrollBy(0, direction === 'bottom' ? document.body.scrollHeight : 0);
                return true;
            }, distance, delay, direction);
        return promise();
    }
    async navigate(url, timeout = 60000, event = 'networkidle0') {
        if (!url)
            throw new Error('No url provided');
        const page = await this.getPage();
        const response = await page
            .goto(url, { timeout, waitUntil: event })
            .catch((err) => {
            throw new Error(`[${err.message}] while navigating to '${url}'`);
        });
        if (!response)
            throw new Error(`No response for '${url}'`);
        const ok = response.ok();
        const status = response.status();
        if (!ok)
            throw new Error(`URL '${url}' can't be accessed`);
        if (utils_1.ERROR_STATUS.includes(status))
            throw new Error(`Get HttpStatus ${status} while navigating to '${url}'`);
    }
    async getInfo(key, script) {
        if (!script)
            throw new Error('No script Provided');
        if (!key)
            throw new Error('No infoKey Provided');
        const result = await this.evaluateScript(script).catch((err) => {
            throw new Error(`[${err.message}] while getting info '${key}'`);
        });
        if (!result)
            throw new Error(`No info found for '${key}'`);
        if (__classPrivateFieldGet(this, _BrowserService_info, "f")[key])
            throw new Error(`Info '${key}' already setted for previous steps with value '${JSON.stringify({ [key]: __classPrivateFieldGet(this, _BrowserService_info, "f")[key] })}'`);
        __classPrivateFieldGet(this, _BrowserService_info, "f")[key] = (0, utils_1.normalize)(result);
    }
    async export(name = 'index') {
        const page = await this.getPage();
        const screenshot = await page.screenshot({ fullPage: true });
        await this.exportFile(screenshot, 'screenshot.jpeg');
        const index = await page.content();
        await this.exportFile(index, `${name}.html`);
    }
    async select(selector, option) {
        await this.evaluate((selector, useEval, value) => {
            const element = (useEval ? eval(selector) : document.querySelector(selector));
            const option = Array.from(element.options).find((opt) => opt.getAttribute('value').includes(value) ||
                opt.innerText.includes(value));
            option.setAttribute('selected', 'selected');
        }, selector, (0, utils_1.isQuerySelector)(selector), option);
    }
    async input(selector, value) {
        await this.evaluate((selector, useEval, value) => {
            const element = (useEval ? eval(selector) : document.querySelector(selector));
            element.value = value;
        }, selector, (0, utils_1.isQuerySelector)(selector), value);
    }
    async captcha(type, fileSelector, responseSelector) {
        if (!type)
            throw new Error('No captcha type provided');
        if (!fileSelector)
            throw new Error('No fileSelector provided');
        if (!responseSelector)
            throw new Error('No responseSelector provided');
        const page = await this.getPage();
        const client = await page.createCDPSession();
        await client.send('Page.setDownloadBehavior', {
            behavior: 'allow',
            downloadPath: this.resultPath,
        });
        const url = await page.evaluate((selector, useEval) => {
            const element = (useEval ? eval(selector) : document.querySelector(selector));
            if (!element)
                throw new Error(`Element '${selector}' not found`);
            return element.getAttribute('src');
        }, fileSelector, (0, utils_1.isQuerySelector)(fileSelector));
        if (!url)
            throw new Error(`No captcha found in selector '${fileSelector}'`);
        await this.wait(1000);
        await page.evaluate((url, type) => {
            const anchor = document.createElement('a');
            anchor.setAttribute('download', `captcha_${type}`);
            anchor.setAttribute('href', url.startsWith(location.protocol)
                ? url
                : `${location.protocol}//${location.host}/${url}`);
            anchor.click();
        }, url, type);
        await this.wait(2000);
        const { resolution, file, fileName } = await (0, utils_1.resolveCaptcha)(this.resultPath, type);
        await page.focus(responseSelector);
        await page.keyboard.type(resolution.captcha);
        await this.wait(1000);
        await this.exportFile(file, fileName);
    }
    async wait(time) {
        await new Promise((resolve) => setTimeout(() => resolve(null), time));
    }
}
exports.BrowserService = BrowserService;
_BrowserService_taskId = new WeakMap(), _BrowserService_url = new WeakMap(), _BrowserService_browser = new WeakMap(), _BrowserService_page = new WeakMap(), _BrowserService_info = new WeakMap(), _BrowserService_logs = new WeakMap(), _BrowserService_error = new WeakMap(), _BrowserService_files = new WeakMap();
//# sourceMappingURL=browser.service.js.map