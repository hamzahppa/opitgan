import { get } from '../util';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
/**
 * @private
 * @param pluginRef
 * @returns {null|*}
 */
export var getPlugin = function (pluginRef) {
    return get(window, pluginRef);
};
/**
 * @private
 * @param pluginObj
 * @param method
 */
export var pluginWarn = function (pluginObj, method) {
    var pluginName = pluginObj.pluginName, plugin = pluginObj.plugin;
    if (method) {
        console.warn('Native: tried calling ' + pluginName + '.' + method + ', but the ' + pluginName + ' plugin is not installed.');
    }
    else {
        console.warn('Native: tried accessing the ' + pluginName + ' plugin but it\'s not installed.');
    }
    console.warn('Install the ' + pluginName + ' plugin: \'ionic plugin add ' + plugin + '\'');
};
/**
 * @private
 * @param pluginName
 * @param method
 */
export var cordovaWarn = function (pluginName, method) {
    if (method) {
        console.warn('Native: tried calling ' + pluginName + '.' + method + ', but Cordova is not available. Make sure to include cordova.js or run in a device/simulator');
    }
    else {
        console.warn('Native: tried accessing the ' + pluginName + ' plugin but Cordova is not available. Make sure to include cordova.js or run in a device/simulator');
    }
};
function setIndex(args, opts, resolve, reject) {
    if (opts === void 0) { opts = {}; }
    // ignore resolve and reject in case sync
    if (opts.sync) {
        return args;
    }
    // If the plugin method expects myMethod(success, err, options)
    if (opts.callbackOrder === 'reverse') {
        // Get those arguments in the order [resolve, reject, ...restOfArgs]
        args.unshift(reject);
        args.unshift(resolve);
    }
    else if (opts.callbackStyle === 'node') {
        args.push(function (err, result) {
            if (err) {
                reject(err);
            }
            else {
                resolve(result);
            }
        });
    }
    else if (opts.callbackStyle === 'object' && opts.successName && opts.errorName) {
        var obj = {};
        obj[opts.successName] = resolve;
        obj[opts.errorName] = reject;
        args.push(obj);
    }
    else if (typeof opts.successIndex !== 'undefined' || typeof opts.errorIndex !== 'undefined') {
        var setSuccessIndex = function () {
            // If we've specified a success/error index
            if (opts.successIndex > args.length) {
                args[opts.successIndex] = resolve;
            }
            else {
                args.splice(opts.successIndex, 0, resolve);
            }
        };
        var setErrorIndex = function () {
            // We don't want that the reject cb gets spliced into the position of an optional argument that has not been defined and thus causing non expected behaviour.
            if (opts.errorIndex > args.length) {
                args[opts.errorIndex] = reject; // insert the reject fn at the correct specific index
            }
            else {
                args.splice(opts.errorIndex, 0, reject); // otherwise just splice it into the array
            }
        };
        if (opts.successIndex > opts.errorIndex) {
            setErrorIndex();
            setSuccessIndex();
        }
        else {
            setSuccessIndex();
            setErrorIndex();
        }
    }
    else {
        // Otherwise, let's tack them on to the end of the argument list
        // which is 90% of cases
        args.push(resolve);
        args.push(reject);
    }
    return args;
}
function callCordovaPlugin(pluginObj, methodName, args, opts, resolve, reject) {
    if (opts === void 0) { opts = {}; }
    // Try to figure out where the success/error callbacks need to be bound
    // to our promise resolve/reject handlers.
    args = setIndex(args, opts, resolve, reject);
    var pluginInstance = getPlugin(pluginObj.pluginRef);
    if (!pluginInstance || pluginInstance[methodName] === 'undefined') {
        // Do this check in here in the case that the Web API for this plugin is available (for example, Geolocation).
        if (!window.cordova) {
            cordovaWarn(pluginObj.pluginName, methodName);
            return {
                error: 'cordova_not_available'
            };
        }
        pluginWarn(pluginObj, methodName);
        return {
            error: 'plugin_not_installed'
        };
    }
    return pluginInstance[methodName].apply(pluginInstance, args);
}
/**
 * @private
 */
export function getPromise(cb) {
    var tryNativePromise = function () {
        if (window.Promise) {
            return new Promise(function (resolve, reject) {
                cb(resolve, reject);
            });
        }
        else {
            console.error('No Promise support or polyfill found. To enable Ionic Native support, please add the es6-promise polyfill before this script, or run with a library like Angular 1/2 or on a recent browser.');
        }
    };
    if (window.angular) {
        var injector = window.angular.element(document.querySelector('[ng-app]') || document.body).injector();
        if (injector) {
            var $q = injector.get('$q');
            return $q(function (resolve, reject) {
                cb(resolve, reject);
            });
        }
        else {
            console.warn('Angular 1 was detected but $q couldn\'t be retrieved. This is usually when the app is not bootstrapped on the html or body tag. Falling back to native promises which won\'t trigger an automatic digest when promises resolve.');
            return tryNativePromise();
        }
    }
    else {
        return tryNativePromise();
    }
}
function wrapPromise(pluginObj, methodName, args, opts) {
    if (opts === void 0) { opts = {}; }
    var pluginResult, rej;
    var p = getPromise(function (resolve, reject) {
        pluginResult = callCordovaPlugin(pluginObj, methodName, args, opts, resolve, reject);
        rej = reject;
    });
    // Angular throws an error on unhandled rejection, but in this case we have already printed
    // a warning that Cordova is undefined or the plugin is uninstalled, so there is no reason
    // to error
    if (pluginResult && pluginResult.error) {
        p.catch(function () { });
        rej(pluginResult.error);
    }
    return p;
}
function wrapOtherPromise(pluginObj, methodName, args, opts) {
    if (opts === void 0) { opts = {}; }
    return getPromise(function (resolve, reject) {
        var pluginResult = callCordovaPlugin(pluginObj, methodName, args, opts);
        if (pluginResult && pluginResult.error) {
            reject(pluginResult.error);
        }
        pluginResult.then(resolve).catch(reject);
    });
}
function wrapObservable(pluginObj, methodName, args, opts) {
    if (opts === void 0) { opts = {}; }
    return new Observable(function (observer) {
        var pluginResult = callCordovaPlugin(pluginObj, methodName, args, opts, observer.next.bind(observer), observer.error.bind(observer));
        if (pluginResult && pluginResult.error) {
            observer.error(pluginResult.error);
        }
        return function () {
            try {
                if (opts.clearFunction) {
                    if (opts.clearWithArgs) {
                        return callCordovaPlugin(pluginObj, opts.clearFunction, args, opts, observer.next.bind(observer), observer.error.bind(observer));
                    }
                    return get(window, pluginObj.pluginRef)[opts.clearFunction].call(pluginObj, pluginResult);
                }
            }
            catch (e) {
                console.warn('Unable to clear the previous observable watch for', pluginObj.pluginName, methodName);
                console.error(e);
            }
        };
    });
}
function callInstance(pluginObj, methodName, args, opts, resolve, reject) {
    if (opts === void 0) { opts = {}; }
    args = setIndex(args, opts, resolve, reject);
    return pluginObj._objectInstance[methodName].apply(pluginObj._objectInstance, args);
}
function wrapInstance(pluginObj, methodName, opts) {
    if (opts === void 0) { opts = {}; }
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i - 0] = arguments[_i];
        }
        if (opts.sync) {
            // Sync doesn't wrap the plugin with a promise or observable, it returns the result as-is
            return callInstance(pluginObj, methodName, args, opts);
        }
        else if (opts.observable) {
            return new Observable(function (observer) {
                var pluginResult = callInstance(pluginObj, methodName, args, opts, observer.next.bind(observer), observer.error.bind(observer));
                return function () {
                    try {
                        if (opts.clearWithArgs) {
                            return pluginObj._objectInstance[opts.clearFunction].apply(pluginObj._objectInstance, args);
                        }
                        return pluginObj._objectInstance[opts.clearFunction].call(pluginObj, pluginResult);
                    }
                    catch (e) {
                        console.warn('Unable to clear the previous observable watch for', pluginObj.pluginName, methodName);
                        console.error(e);
                    }
                };
            });
        }
        else if (opts.otherPromise) {
            return getPromise(function (resolve, reject) {
                var result = callInstance(pluginObj, methodName, args, opts, resolve, reject);
                result.then(resolve, reject);
            });
        }
        else {
            return getPromise(function (resolve, reject) {
                callInstance(pluginObj, methodName, args, opts, resolve, reject);
            });
        }
    };
}
/**
 * Wrap the event with an observable
 * @param event even name
 * @param element The element to attach the event listener to
 * @returns {Observable}
 */
function wrapEventObservable(event, element) {
    if (element === void 0) { element = window; }
    return Observable.fromEvent(element, event);
}
/**
 * Certain plugins expect the user to override methods in the plugin. For example,
 * window.cordova.plugins.backgroundMode.onactivate = function() { ... }.
 *
 * Unfortunately, this is brittle and would be better wrapped as an Observable. overrideFunction
 * does just this.
 */
function overrideFunction(pluginObj, methodName, args, opts) {
    if (opts === void 0) { opts = {}; }
    return new Observable(function (observer) {
        var pluginInstance = getPlugin(pluginObj.pluginRef);
        if (!pluginInstance) {
            // Do this check in here in the case that the Web API for this plugin is available (for example, Geolocation).
            if (!window.cordova) {
                cordovaWarn(pluginObj.pluginName, methodName);
                observer.error({
                    error: 'cordova_not_available'
                });
            }
            pluginWarn(pluginObj, methodName);
            observer.error({
                error: 'plugin_not_installed'
            });
            return;
        }
        var method = pluginInstance[methodName];
        if (!method) {
            observer.error({
                error: 'no_such_method'
            });
            observer.complete();
            return;
        }
        pluginInstance[methodName] = observer.next.bind(observer);
    });
}
/**
 * @private
 * @param pluginObj
 * @param methodName
 * @param opts
 * @returns {function(...[any]): (undefined|*|Observable|*|*)}
 */
export var wrap = function (pluginObj, methodName, opts) {
    if (opts === void 0) { opts = {}; }
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i - 0] = arguments[_i];
        }
        if (opts.sync) {
            // Sync doesn't wrap the plugin with a promise or observable, it returns the result as-is
            return callCordovaPlugin(pluginObj, methodName, args, opts);
        }
        else if (opts.observable) {
            return wrapObservable(pluginObj, methodName, args, opts);
        }
        else if (opts.eventObservable && opts.event) {
            return wrapEventObservable(opts.event, opts.element);
        }
        else if (opts.otherPromise) {
            return wrapOtherPromise(pluginObj, methodName, args, opts);
        }
        else {
            return wrapPromise(pluginObj, methodName, args, opts);
        }
    };
};
/**
 * @private
 *
 * Class decorator specifying Plugin metadata. Required for all plugins.
 *
 * @usage
 * ```typescript
 * @Plugin({
 *  pluginName: 'MyPlugin',
 *  plugin: 'cordova-plugin-myplugin',
 *  pluginRef: 'window.myplugin'
 *  })
 *  export class MyPlugin {
 *
 *    // Plugin wrappers, properties, and functions go here ...
 *
 *  }
 * ```
 */
export function Plugin(config) {
    return function (cls) {
        // Add these fields to the class
        for (var k in config) {
            cls[k] = config[k];
        }
        cls['installed'] = function (printWarning) {
            return !!getPlugin(config.pluginRef);
        };
        cls['getPlugin'] = function () {
            return getPlugin(config.pluginRef);
        };
        cls['checkInstall'] = function () {
            var pluginInstance = getPlugin(config.pluginRef);
            if (!pluginInstance) {
                pluginWarn(cls);
                return false;
            }
            return true;
        };
        return cls;
    };
}
/**
 * @private
 *
 * Wrap a stub function in a call to a Cordova plugin, checking if both Cordova
 * and the required plugin are installed.
 */
export function Cordova(opts) {
    if (opts === void 0) { opts = {}; }
    return function (target, methodName, descriptor) {
        return {
            value: function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i - 0] = arguments[_i];
                }
                return wrap(this, methodName, opts).apply(this, args);
            }
        };
    };
}
/**
 * @private
 *
 * Wrap an instance method
 */
export function CordovaInstance(opts) {
    if (opts === void 0) { opts = {}; }
    return function (target, methodName) {
        return {
            value: function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i - 0] = arguments[_i];
                }
                return wrapInstance(this, methodName, opts).apply(this, args);
            }
        };
    };
}
/**
 * @private
 *
 *
 * Before calling the original method, ensure Cordova and the plugin are installed.
 */
export function CordovaProperty(target, key) {
    var exists = function () {
        var pluginInstance = getPlugin(target.pluginRef);
        if (!pluginInstance || typeof pluginInstance[key] === 'undefined') {
            pluginWarn(target, key);
            return false;
        }
        return true;
    };
    Object.defineProperty(target, key, {
        get: function () {
            if (exists()) {
                return getPlugin(target.pluginRef)[key];
            }
            else {
                return null;
            }
        },
        set: function (value) {
            if (exists()) {
                getPlugin(target.pluginRef)[key] = value;
            }
        }
    });
}
/**
 * @private
 * @param target
 * @param key
 * @constructor
 */
export function InstanceProperty(target, key) {
    Object.defineProperty(target, key, {
        get: function () {
            return this._objectInstance[key];
        },
        set: function (value) {
            this._objectInstance[key] = value;
        }
    });
}
/**
 * @private
 *
 * Wrap a stub function in a call to a Cordova plugin, checking if both Cordova
 * and the required plugin are installed.
 */
export function CordovaFunctionOverride(opts) {
    if (opts === void 0) { opts = {}; }
    return function (target, methodName, descriptor) {
        return {
            value: function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i - 0] = arguments[_i];
                }
                return overrideFunction(this, methodName, opts);
            }
        };
    };
}
//# sourceMappingURL=plugin.js.map