var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Cordova, Plugin } from './plugin';
/**
 * @name SMS
 * @description
 *
 * Requires Cordova plugin: cordova-plugin-sms. For more info, please see the [SMS plugin docs](https://github.com/cordova-sms/cordova-sms-plugin).
 *
 * @usage
 * ```typescript
 * import { SMS } from 'ionic-native';
 *
 *
 * // Send a text message using default options
 * SMS.send('416123456', 'Hello world!');
 * ```
 * @interfaces
 * SmsOptions
 * SmsOptionsAndroid
 */
export var SMS = (function () {
    function SMS() {
    }
    /**
     * Sends sms to a number
     * @param phoneNumber {string|Array<string>} Phone number
     * @param message {string} Message
     * @param options {SmsOptions} Options
     * @returns {Promise<any>} Resolves promise when the SMS has been sent
     */
    SMS.send = function (phoneNumber, message, options) { return; };
    /**
     * This function lets you know if the app has permission to send SMS
     * @return {Promise<boolean>} returns a promise that resolves with a boolean that indicates if we have permission
     */
    SMS.hasPermission = function () { return; };
    __decorate([
        Cordova({
            successIndex: 3,
            errorIndex: 4
        })
    ], SMS, "send", null);
    __decorate([
        Cordova({
            platforms: ['Android']
        })
    ], SMS, "hasPermission", null);
    SMS = __decorate([
        Plugin({
            pluginName: 'SMS',
            plugin: 'cordova-sms-plugin',
            pluginRef: 'sms',
            repo: 'https://github.com/cordova-sms/cordova-sms-plugin',
            platforms: ['Android', 'iOS', 'Windows Phone 8']
        })
    ], SMS);
    return SMS;
}());
//# sourceMappingURL=sms.js.map