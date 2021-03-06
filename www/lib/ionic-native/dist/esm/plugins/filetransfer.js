var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { CordovaInstance, Plugin } from './plugin';
/**
 * @name Transfer
 *
 * @description
 * This plugin allows you to upload and download files.
 *
 * @usage
 * ```typescript
 * import { Transfer } from 'ionic-native';
 *
 *
 * // Create instance:
 * const fileTransfer = new Transfer();
 *
 * // Upload a file:
 * fileTransfer.upload(..).then(..).catch(..);
 *
 * // Download a file:
 * fileTransfer.download(..).then(..).catch(..);
 *
 * // Abort active transfer:
 * fileTransfer.abort();
 *
 * E.g
 *
 * upload(){
 *   const fileTransfer = new Transfer();
 *   var options: any;
 *
 *   options = {
 *      fileKey: 'file',
 *      fileName: 'name.jpg',
 *      headers: {}
 *      .....
 *   }
 *   fileTransfer.upload("<file path>", "<api endpoint>", options)
 *    .then((data) => {
 *      // success
 *    }, (err) => {
 *      // error
 *    })
 * }
 *
 * // Cordova
 * declare var cordova: any;
 *
 * download() {
 *   const fileTransfer = new Transfer();
 *   let url = 'http://www.example.com/file.pdf';
 *   fileTransfer.download(url, cordova.file.dataDirectory + 'file.pdf').then((entry) => {
 *     console.log('download complete: ' + entry.toURL());
 *   }, (error) => {
 *     // handle error
 *   });
 * }
 *
 * ```
 *
 * Note: You will not see your documents using a file explorer on your device. Use adb:
 *
 * ```
 * adb shell
 * run-as com.your.app
 * cd files
 * ls
 * ```
 *
 * To store files in a different/publicly accessible directory, please refer to the following link
 * https://github.com/apache/cordova-plugin-file#where-to-store-files
 *
 * @interfaces
 * FileUploadOptions
 * FileUploadResult
 * FileTransferError
 */
export var Transfer = (function () {
    function Transfer() {
        this._objectInstance = new FileTransfer();
    }
    /**
     * Sends a file to a server.
     *
     * @param {string} fileUrl  Filesystem URL representing the file on the device or a data URI. For backwards compatibility, this can also be the full path of the file on the device.
     * @param {string} url  URL of the server to receive the file, as encoded by encodeURI().
     * @param {FileUploadOptions} options  Optional parameters.
     * @param {boolean} trustAllHosts  Optional parameter, defaults to false. If set to true, it accepts all security certificates. This is useful since Android rejects self-signed security certificates. Not recommended for production use. Supported on Android and iOS.
     * @returns {Promise<FileUploadResult>} Returns a Promise that resolves to a FileUploadResult and rejects with FileTransferError.
     */
    Transfer.prototype.upload = function (fileUrl, url, options, trustAllHosts) {
        return;
    };
    /**
     * Downloads a file from server.
     *
     * @param {string} source  URL of the server to download the file, as encoded by encodeURI().
     * @param {stirng} target  Filesystem url representing the file on the device. For backwards compatibility, this can also be the full path of the file on the device.
     * @param {boolean} trustAllHosts  Optional parameter, defaults to false. If set to true, it accepts all security certificates. This is useful because Android rejects self-signed security certificates. Not recommended for production use. Supported on Android and iOS.
     * @param {object} Optional parameters, currently only supports headers (such as Authorization (Basic Authentication), etc).
     * @returns {Promise<any>} Returns a Promise that resolves to a FileEntry object.
     */
    Transfer.prototype.download = function (source, target, trustAllHosts, options) {
        return;
    };
    /**
     * Registers a listener that gets called whenever a new chunk of data is transferred.
     * @param {function} Listener that takes a progress event.
     */
    Transfer.prototype.onProgress = function (listener) {
        this._objectInstance.onprogress = listener;
    };
    /**
     * Aborts an in-progress transfer. The onerror callback is passed a FileTransferError
     * object which has an error code of FileTransferError.ABORT_ERR.
     */
    Transfer.prototype.abort = function () { };
    /**
     * Error code rejected from upload with FileTransferError
     * Defined in FileTransferError.
     *      FILE_NOT_FOUND_ERR: 1   Return when file was not found
     *      INVALID_URL_ERR: 2,     Return when url was invalid
     *      CONNECTION_ERR: 3,      Return on connection error
     *      ABORT_ERR: 4,           Return on aborting
     *      NOT_MODIFIED_ERR: 5     Return on "304 Not Modified" HTTP response
     * @enum {number}
     */
    Transfer.FileTransferErrorCode = {
        FILE_NOT_FOUND_ERR: 1,
        INVALID_URL_ERR: 2,
        CONNECTION_ERR: 3,
        ABORT_ERR: 4,
        NOT_MODIFIED_ERR: 5
    };
    __decorate([
        CordovaInstance({
            successIndex: 2,
            errorIndex: 3
        })
    ], Transfer.prototype, "upload", null);
    __decorate([
        CordovaInstance({
            successIndex: 2,
            errorIndex: 3
        })
    ], Transfer.prototype, "download", null);
    __decorate([
        CordovaInstance({
            sync: true
        })
    ], Transfer.prototype, "abort", null);
    Transfer = __decorate([
        Plugin({
            pluginName: 'FileTransfer',
            plugin: 'cordova-plugin-file-transfer',
            pluginRef: 'FileTransfer',
            repo: 'https://github.com/apache/cordova-plugin-file-transfer'
        })
    ], Transfer);
    return Transfer;
}());
//# sourceMappingURL=filetransfer.js.map