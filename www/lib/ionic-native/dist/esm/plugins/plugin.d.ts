import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
/**
 * @private
 */
export interface PluginConfig {
    /**
     * Plugin name, this should match the class name
     */
    pluginName: string;
    /**
     * Plugin NPM package name
     */
    plugin: string;
    /**
     * Plugin object reference
     */
    pluginRef: string;
    /**
     * Github repository URL
     */
    repo: string;
    /**
     * Custom install command
     */
    install?: string;
    /**
     * Supported platforms
     */
    platforms?: string[];
}
/**
 * @private
 */
export interface CordovaOptions {
    /**
     * Set to true if the wrapped method is a sync function
     */
    sync?: boolean;
    /**
     * Callback order. Set to reverse if the success/error callbacks are the first 2 arguments that the wrapped method takes.
     */
    callbackOrder?: 'reverse';
    /**
     * Callback style
     */
    callbackStyle?: 'node' | 'object';
    /**
     * Set a custom index for the success callback function. This doesn't work if callbackOrder or callbackStyle are set.
     */
    successIndex?: number;
    /**
     * Set a custom index for the error callback function. This doesn't work if callbackOrder or callbackStyle are set.
     */
    errorIndex?: number;
    /**
     * Success function property name. This must be set if callbackStyle is set to object.
     */
    successName?: string;
    /**
     * Error function property name. This must be set if callbackStyle is set to object.
     */
    errorName?: string;
    /**
     * Set to true to return an observable
     */
    observable?: boolean;
    /**
     * If observable is set to true, this can be set to a different function name that will cancel the observable.
     */
    clearFunction?: string;
    /**
     * This can be used if clearFunction is set. Set this to true to call the clearFunction with the same arguments used in the initial function.
     */
    clearWithArgs?: boolean;
    /**
     * Creates an observable that wraps a global event. Replaces document.addEventListener
     */
    eventObservable?: boolean;
    /**
     * Event name, this must be set if eventObservable is set to true
     */
    event?: string;
    /**
     * Element to attach the event listener to, this is optional, defaults to `window`
     */
    element?: any;
    /**
     * Set to true if the wrapped method returns a promise
     */
    otherPromise?: boolean;
    /**
     * Supported platforms
     */
    platforms?: string[];
}
/**
 * @private
 * @param pluginRef
 * @returns {null|*}
 */
export declare const getPlugin: (pluginRef: string) => any;
/**
 * @private
 * @param pluginObj
 * @param method
 */
export declare const pluginWarn: (pluginObj: any, method?: string) => void;
/**
 * @private
 * @param pluginName
 * @param method
 */
export declare const cordovaWarn: (pluginName: string, method: string) => void;
/**
 * @private
 */
export declare function getPromise(cb: any): any;
/**
 * @private
 * @param pluginObj
 * @param methodName
 * @param opts
 * @returns {function(...[any]): (undefined|*|Observable|*|*)}
 */
export declare const wrap: (pluginObj: any, methodName: string, opts?: CordovaOptions) => (...args: any[]) => any;
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
export declare function Plugin(config: PluginConfig): (cls: any) => any;
/**
 * @private
 *
 * Wrap a stub function in a call to a Cordova plugin, checking if both Cordova
 * and the required plugin are installed.
 */
export declare function Cordova(opts?: CordovaOptions): (target: Object, methodName: string, descriptor: TypedPropertyDescriptor<any>) => {
    value: (...args: any[]) => any;
};
/**
 * @private
 *
 * Wrap an instance method
 */
export declare function CordovaInstance(opts?: any): (target: Object, methodName: string) => {
    value: (...args: any[]) => any;
};
/**
 * @private
 *
 *
 * Before calling the original method, ensure Cordova and the plugin are installed.
 */
export declare function CordovaProperty(target: any, key: string): void;
/**
 * @private
 * @param target
 * @param key
 * @constructor
 */
export declare function InstanceProperty(target: any, key: string): void;
/**
 * @private
 *
 * Wrap a stub function in a call to a Cordova plugin, checking if both Cordova
 * and the required plugin are installed.
 */
export declare function CordovaFunctionOverride(opts?: any): (target: Object, methodName: string, descriptor: TypedPropertyDescriptor<any>) => {
    value: (...args: any[]) => Observable<any>;
};
