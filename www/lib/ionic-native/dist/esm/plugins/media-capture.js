var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Cordova, CordovaProperty, Plugin } from './plugin';
/**
 * @name Media Capture
 * @description
 * @usage
 * ```typescript
 * import { MediaCapture, MediaFile, CaptureError, CaptureImageOptions } from 'ionic-native';
 *
 *
 * let options: CaptureImageOptions = { limit: 3 };
 * MediaCapture.captureImage(options)
 *   .then(
 *     (data: MediaFile[]) => console.log(data),
 *     (err: CaptureError) => console.error(err)
 *   );
 *
 * ```
 * @interfaces
 * MediaFile
 * MediaFileData
 * CaptureError
 * CaptureAudioOptions
 * CaptureImageOptions
 * CaptureVideoOptions
 * ConfigurationData
 */
export var MediaCapture = (function () {
    function MediaCapture() {
    }
    /**
     * Start the audio recorder application and return information about captured audio clip files.
     * @param options
     * @returns {Promise<MediaFile[]>}
     */
    MediaCapture.captureAudio = function (options) { return; };
    /**
     * Start the camera application and return information about captured image files.
     * @param options
     * @returns {Promise<MediaFile[]>}
     */
    MediaCapture.captureImage = function (options) { return; };
    /**
     * Start the video recorder application and return information about captured video clip files.
     * @param options
     * @returns {Promise<MediaFile[]>}
     */
    MediaCapture.captureVideo = function (options) { return; };
    /**
     * is fired if the capture call is successful
     * @returns {Observable<MediaFile[]>}
     */
    MediaCapture.onPendingCaptureResult = function () { return; };
    /**
     * is fired if the capture call is unsuccessful
     * @returns {Observable<CaptureError>}
     */
    MediaCapture.onPendingCaptureError = function () { return; };
    __decorate([
        CordovaProperty
    ], MediaCapture, "supportedImageModes", void 0);
    __decorate([
        CordovaProperty
    ], MediaCapture, "supportedAudioModes", void 0);
    __decorate([
        CordovaProperty
    ], MediaCapture, "supportedVideoModes", void 0);
    __decorate([
        Cordova({
            callbackOrder: 'reverse'
        })
    ], MediaCapture, "captureAudio", null);
    __decorate([
        Cordova({
            callbackOrder: 'reverse'
        })
    ], MediaCapture, "captureImage", null);
    __decorate([
        Cordova({
            callbackOrder: 'reverse'
        })
    ], MediaCapture, "captureVideo", null);
    __decorate([
        Cordova({
            eventObservable: true,
            event: 'pendingcaptureresult'
        })
    ], MediaCapture, "onPendingCaptureResult", null);
    __decorate([
        Cordova({
            eventObservable: true,
            event: 'pendingcaptureerror'
        })
    ], MediaCapture, "onPendingCaptureError", null);
    MediaCapture = __decorate([
        Plugin({
            pluginName: 'MediaCapture',
            plugin: 'cordova-plugin-media-capture',
            pluginRef: 'navigator.device.capture',
            repo: 'https://github.com/apache/cordova-plugin-media-capture'
        })
    ], MediaCapture);
    return MediaCapture;
}());
//# sourceMappingURL=media-capture.js.map