"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var plugin_1 = require('./plugin');
var Observable_1 = require('rxjs/Observable');
/**
 * @name ThemeableBrowser
 * @description
 * In-app browser that allows styling.
 *
 * @usage
 * ```
 * import { ThemeableBrowser } from 'ionic-native';
 *
 * // can add options from the original InAppBrowser in a JavaScript object form (not string)
 * // This options object also takes additional parameters introduced by the ThemeableBrowser plugin
 * // This example only shows the additional parameters for ThemeableBrowser
 * // Note that that `image` and `imagePressed` values refer to resources that are stored in your app
 * let options = {
 *      statusbar: {
 *          color: '#ffffffff'
 *      },
 *      toolbar: {
 *          height: 44,
 *          color: '#f0f0f0ff'
 *      },
 *      title: {
 *          color: '#003264ff',
 *          showPageTitle: true
 *      },
 *      backButton: {
 *          image: 'back',
 *          imagePressed: 'back_pressed',
 *          align: 'left',
 *          event: 'backPressed'
 *      },
 *      forwardButton: {
 *          image: 'forward',
 *          imagePressed: 'forward_pressed',
 *          align: 'left',
 *          event: 'forwardPressed'
 *      },
 *      closeButton: {
 *          image: 'close',
 *          imagePressed: 'close_pressed',
 *          align: 'left',
 *          event: 'closePressed'
 *      },
 *      customButtons: [
 *          {
 *              image: 'share',
 *              imagePressed: 'share_pressed',
 *              align: 'right',
 *              event: 'sharePressed'
 *          }
 *      ],
 *      menu: {
 *          image: 'menu',
 *          imagePressed: 'menu_pressed',
 *          title: 'Test',
 *          cancel: 'Cancel',
 *          align: 'right',
 *          items: [
 *              {
 *                  event: 'helloPressed',
 *                  label: 'Hello World!'
 *              },
 *              {
 *                  event: 'testPressed',
 *                  label: 'Test!'
 *              }
 *          ]
 *      },
 *      backButtonCanClose: true
 * };
 *
 * let browser = new ThemeableBrowser('https://ionic.io', '_blank', options);
 *
 * ```
 * We suggest that you refer to the plugin's repository for additional information on usage that may not be covered here.
 * @interfaces
 * ThemeableBrowserButton
 * ThemeableBrowserOptions
 */
var ThemeableBrowser = (function () {
    function ThemeableBrowser(url, target, styleOptions) {
        try {
            this._objectInstance = cordova.ThemeableBrowser.open(url, target, styleOptions);
        }
        catch (e) {
            window.open(url);
            console.warn('Native: ThemeableBrowser is not installed or you are running on a browser. Falling back to window.open, all instance methods will NOT work.');
        }
    }
    /**
     * Displays an browser window that was opened hidden. Calling this has no effect
     * if the browser was already visible.
     */
    ThemeableBrowser.prototype.show = function () { };
    /**
     * Closes the browser window.
     */
    ThemeableBrowser.prototype.close = function () { };
    /**
     * Reloads the current page
     */
    ThemeableBrowser.prototype.reload = function () { };
    /**
     * Injects JavaScript code into the browser window.
     * @param script    Details of the script to run, specifying either a file or code key.
     * @returns {Promise<any>}
     */
    ThemeableBrowser.prototype.executeScript = function (script) { return; };
    /**
     * Injects CSS into the browser window.
     * @param css       Details of the script to run, specifying either a file or code key.
     * @returns {Promise<any>}
     */
    ThemeableBrowser.prototype.insertCss = function (css) { return; };
    /**
     * A method that allows you to listen to events happening in the browser.
     * Available events are: `ThemeableBrowserError`, `ThemeableBrowserWarning`, `critical`, `loadfail`, `unexpected`, `undefined`
     * @param event Event name
     * @returns {Observable<InAppBrowserEvent>} Returns back an observable that will listen to the event on subscribe, and will stop listening to the event on unsubscribe.
     */
    ThemeableBrowser.prototype.on = function (event) {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            _this._objectInstance.addEventListener(event, observer.next.bind(observer));
            return function () { return _this._objectInstance.removeEventListener(event, observer.next.bind(observer)); };
        });
    };
    __decorate([
        plugin_1.CordovaInstance({ sync: true })
    ], ThemeableBrowser.prototype, "show", null);
    __decorate([
        plugin_1.CordovaInstance({ sync: true })
    ], ThemeableBrowser.prototype, "close", null);
    __decorate([
        plugin_1.CordovaInstance({ sync: true })
    ], ThemeableBrowser.prototype, "reload", null);
    __decorate([
        plugin_1.CordovaInstance()
    ], ThemeableBrowser.prototype, "executeScript", null);
    __decorate([
        plugin_1.CordovaInstance()
    ], ThemeableBrowser.prototype, "insertCss", null);
    ThemeableBrowser = __decorate([
        plugin_1.Plugin({
            pluginName: 'ThemeableBrowser',
            plugin: 'cordova-plugin-themeablebrowser',
            pluginRef: 'cordova.ThemeableBrowser',
            repo: 'https://github.com/initialxy/cordova-plugin-themeablebrowser'
        })
    ], ThemeableBrowser);
    return ThemeableBrowser;
}());
exports.ThemeableBrowser = ThemeableBrowser;
//# sourceMappingURL=themeable-browser.js.map