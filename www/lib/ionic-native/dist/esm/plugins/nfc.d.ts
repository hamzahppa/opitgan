import { Observable } from 'rxjs/Observable';
/**
 * @name NFC
 * @description
 * The NFC plugin allows you to read and write NFC tags. You can also beam to, and receive from, other NFC enabled devices.
 *
 * Use to
 * - read data from NFC tags
 * - write data to NFC tags
 * - send data to other NFC enabled devices
 * - receive data from NFC devices
 *
 * This plugin uses NDEF (NFC Data Exchange Format) for maximum compatibilty between NFC devices, tag types, and operating systems.
 *
 * @usage
 * ```
 * import {NFC, Ndef} from 'ionic-native';
 *
 * let message = Ndef.textRecord('Hello world');
 * NFC.share([message]).then(onSuccess).catch(onError);
 *
 * ```
 */
export declare class NFC {
    /**
     * Registers an event listener for any NDEF tag.
     * @param onSuccess
     * @param onFailure
     * @returns {Observable<any>}
     */
    static addNdefListener(onSuccess?: Function, onFailure?: Function): Observable<any>;
    /**
     * Registers an event listener for tags matching any tag type.
     * @param onSuccess
     * @param onFailure
     * @returns {Observable<any>}
     */
    static addTagDiscoveredListener(onSuccess?: Function, onFailure?: Function): Observable<any>;
    /**
     * Registers an event listener for NDEF tags matching a specified MIME type.
     * @param mimeType
     * @param onSuccess
     * @param onFailure
     * @returns {Observable<any>}
     */
    static addMimeTypeListener(mimeType: string, onSuccess?: Function, onFailure?: Function): Observable<any>;
    /**
     * Registers an event listener for formatable NDEF tags.
     * @param onSuccess
     * @param onFailure
     * @returns {Observable<any>}
     */
    static addNdefFormatableListener(onSuccess?: Function, onFailure?: Function): Observable<any>;
    /**
     * Qrites an NdefMessage to a NFC tag.
     * @param message {any[]}
     * @returns {Promise<any>}
     */
    static write(message: any[]): Promise<any>;
    /**
     * Makes a NFC tag read only. **Warning** this is permanent.
     * @returns {Promise<any>}
     */
    static makeReadyOnly(): Promise<any>;
    /**
     * Shares an NDEF Message via peer-to-peer.
     * @param message An array of NDEF Records.
     * @returns {Promise<any>}
     */
    static share(message: any[]): Promise<any>;
    /**
     * Stop sharing NDEF data via peer-to-peer.
     * @returns {Promise<any>}
     */
    static unshare(): Promise<any>;
    /**
     * Erase a NDEF tag
     */
    static erase(): Promise<any>;
    /**
     * Send a file to another device via NFC handover.
     * @param uris A URI as a String, or an array of URIs.
     * @returns {Promise<any>}
     */
    static handover(uris: string[]): Promise<any>;
    /**
     * Stop sharing NDEF data via NFC handover.
     * @returns {Promise<any>}
     */
    static stopHandover(): Promise<any>;
    /**
     * Show the NFC settings on the device.
     * @returns {Promise<any>}
     */
    static showSettings(): Promise<any>;
    /**
     * Check if NFC is available and enabled on this device.
     * @returns {Promise<any>}
     */
    static enabled(): Promise<any>;
    /**
     * Convert bytes to string
     * @param bytes {number[]}
     * @returns {string}
     */
    static bytesToString(bytes: number[]): string;
    /**
     * Convert string to bytes
     * @param str {string}
     * @returns {number[]}
     */
    static stringToBytes(str: string): number[];
    /**
     * Convert bytes to hex string
     * @param bytes {number[]}
     * @returns {string}
     */
    static bytesToHexString(bytes: number[]): string;
}
/**
 * @private
 */
export declare class Ndef {
    /**
     * @private
     */
    static pluginName: string;
    /**
     * @private
     */
    static plugin: string;
    /**
     * @private
     */
    static pluginRef: string;
    static uriRecord(uri: string): any;
    static textRecord(text: string): any;
    static mimeMediaRecord(mimeType: string, payload: string): any;
    static androidApplicationRecord(packageName: string): any;
}
