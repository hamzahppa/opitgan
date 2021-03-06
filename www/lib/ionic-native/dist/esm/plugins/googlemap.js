var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Cordova, CordovaInstance, Plugin, InstanceProperty, getPlugin, pluginWarn } from './plugin';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
/**
 * @private
 * You can listen to these events where appropriate
 */
export var GoogleMapsEvent = {
    MAP_CLICK: 'click',
    MAP_LONG_CLICK: 'long_click',
    MY_LOCATION_CHANGE: 'my_location_change',
    MY_LOCATION_BUTTON_CLICK: 'my_location_button_click',
    INDOOR_BUILDING_FOCUSED: 'indoor_building_focused',
    INDOOR_LEVEL_ACTIVATED: 'indoor_level_activated',
    CAMERA_CHANGE: 'camera_change',
    CAMERA_IDLE: 'camera_idle',
    MAP_READY: 'map_ready',
    MAP_LOADED: 'map_loaded',
    MAP_WILL_MOVE: 'will_move',
    MAP_CLOSE: 'map_close',
    MARKER_CLICK: 'click',
    OVERLAY_CLICK: 'overlay_click',
    INFO_CLICK: 'info_click',
    MARKER_DRAG: 'drag',
    MARKER_DRAG_START: 'drag_start',
    MARKER_DRAG_END: 'drag_end'
};
/**
 * @private
 */
export var GoogleMapsAnimation = {
    BOUNCE: 'BOUNCE',
    DROP: 'DROP'
};
/**
 * @name Google Maps
 * @description This plugin uses the native Google Maps SDK
 * @usage
 * ```
 * import {
 *  GoogleMap,
 *  GoogleMapsEvent,
 *  GoogleMapsLatLng,
 *  CameraPosition,
 *  GoogleMapsMarkerOptions,
 *  GoogleMapsMarker
 * } from 'ionic-native';
 *
 * export class MapPage {
 *  constructor() {}
 *
 * // Load map only after view is initialize
 * ngAfterViewInit() {
 *  this.loadMap();
 * }
 *
 * loadMap() {
 *  // make sure to create following structure in your view.html file
 *  // and add a height (for example 100%) to it, else the map won't be visible
 *  // <ion-content>
 *  //  <div #map id="map" style="height:100%;"></div>
 *  // </ion-content>
 *
 *  // create a new map by passing HTMLElement
 *  let element: HTMLElement = document.getElementById('map');
 *
 *  let map = new GoogleMap(element);
 *
 *  // listen to MAP_READY event
 *  map.one(GoogleMapsEvent.MAP_READY).then(() => console.log('Map is ready!'));
 *
 *  // create LatLng object
 *  let ionic: GoogleMapsLatLng = new GoogleMapsLatLng(43.0741904,-89.3809802);
 *
 *  // create CameraPosition
 *  let position: CameraPosition = {
 *    target: ionic,
 *    zoom: 18,
 *    tilt: 30
 *  };
 *
 *  // move the map's camera to position
 *  map.moveCamera(position);
 *
 *  // create new marker
 *  let markerOptions: GoogleMapsMarkerOptions = {
 *    position: ionic,
 *    title: 'Ionic'
 *  };
 *
 *  map.addMarker(markerOptions)
 *    .then((marker: GoogleMapsMarker) => {
 *       marker.showInfoWindow();
 *     });
 *  }
 *
 * }
 * ```
 */
export var GoogleMap = (function () {
    function GoogleMap(element, options) {
        if (!!getPlugin('plugin.google.maps.Map')) {
            if (typeof element === 'string') {
                element = document.getElementById(element);
            }
            this._objectInstance = plugin.google.maps.Map.getMap(element, options);
        }
        else {
            pluginWarn({
                pluginName: 'GoogleMap',
                plugin: 'plugin.google.maps.Map'
            });
        }
    }
    /**
     * Checks if a map object has been created and is available.
     *
     * @returns {Promise<boolean>}
     */
    GoogleMap.isAvailable = function () { return; };
    /**
     * Adds an event listener.
     *
     * @returns {Observable<any>}
     */
    GoogleMap.prototype.addEventListener = function (eventName) {
        return Observable.fromEvent(this._objectInstance, eventName);
    };
    /**
     * Adds an event listener that works once.
     *
     * @returns {Promise<any>}
     */
    GoogleMap.prototype.addListenerOnce = function (eventName) {
        var _this = this;
        if (!this._objectInstance) {
            return Promise.reject({ error: 'plugin_not_installed' });
        }
        return new Promise(function (resolve) { return _this._objectInstance.addListenerOnce(eventName, resolve); });
    };
    /**
     * Gets a value
     * @param key
     */
    GoogleMap.prototype.get = function (key) { return; };
    /**
     * Sets a value
     * @param key
     * @param value
     */
    GoogleMap.prototype.set = function (key, value) { };
    /**
     * Listen to a map event.
     *
     * @returns {Observable<any>}
     */
    GoogleMap.prototype.on = function (eventName) {
        var _this = this;
        if (!this._objectInstance) {
            return new Observable(function (observer) {
                observer.error({ error: 'plugin_not_installed' });
            });
        }
        return new Observable(function (observer) {
            _this._objectInstance.on(eventName, observer.next.bind(observer));
            return function () { return _this._objectInstance.off(event); };
        });
    };
    /**
     * Listen to a map event only once.
     *
     * @returns {Promise<any>}
     */
    GoogleMap.prototype.one = function (eventName) {
        var _this = this;
        if (!this._objectInstance) {
            return Promise.reject({ error: 'plugin_not_installed' });
        }
        return new Promise(function (resolve) { return _this._objectInstance.one(eventName, resolve); });
    };
    /**
     * Clears all stored values
     */
    GoogleMap.prototype.empty = function () { };
    GoogleMap.prototype.setDebuggable = function (isDebuggable) { };
    GoogleMap.prototype.setClickable = function (isClickable) { };
    /**
     * Get the position of the camera.
     *
     * @returns {Promise<CameraPosition>}
     */
    GoogleMap.prototype.getCameraPosition = function () { return; };
    /**
     * Get the location of the user.
     *
     * @returns {Promise<MyLocation>}
     */
    GoogleMap.prototype.getMyLocation = function (options) { return; };
    /**
     * Get the visible region.
     *
     * @returns {Promise<VisibleRegion>}
     */
    GoogleMap.prototype.getVisibleRegion = function () { return; };
    GoogleMap.prototype.showDialog = function () { };
    GoogleMap.prototype.closeDialog = function () { };
    GoogleMap.prototype.getLicenseInfo = function () { return; };
    GoogleMap.prototype.setCenter = function (latLng) { };
    GoogleMap.prototype.setZoom = function (zoomLevel) { };
    GoogleMap.prototype.setMapTypeId = function (typeId) { };
    GoogleMap.prototype.setTilt = function (tiltLevel) { };
    /**
     * @returns {Promise<any>}
     */
    GoogleMap.prototype.animateCamera = function (animateCameraOptions) { return; };
    /**
     * @returns {Promise<any>}
     */
    GoogleMap.prototype.moveCamera = function (cameraPosition) { return; };
    GoogleMap.prototype.setMyLocationEnabled = function (enabled) { };
    GoogleMap.prototype.setIndoorEnabled = function (enabled) { };
    GoogleMap.prototype.setTrafficEnabled = function (enabled) { };
    GoogleMap.prototype.setCompassEnabled = function (enabled) { };
    GoogleMap.prototype.setAllGesturesEnabled = function (enabled) { };
    /**
     * @returns {Promise<GoogleMapsMarker | any>}
     */
    GoogleMap.prototype.addMarker = function (options) {
        var _this = this;
        if (!this._objectInstance) {
            return Promise.reject({ error: 'plugin_not_installed' });
        }
        return new Promise(function (resolve, reject) {
            _this._objectInstance.addMarker(options, function (marker) {
                if (marker) {
                    resolve(new GoogleMapsMarker(marker));
                }
                else {
                    reject();
                }
            });
        });
    };
    /**
     * @returns {Promise<GoogleMapsCircle | any>}
     */
    GoogleMap.prototype.addCircle = function (options) {
        var _this = this;
        if (!this._objectInstance) {
            return Promise.reject({ error: 'plugin_not_installed' });
        }
        return new Promise(function (resolve, reject) {
            _this._objectInstance.addCircle(options, function (circle) {
                if (circle) {
                    resolve(new GoogleMapsCircle(circle));
                }
                else {
                    reject();
                }
            });
        });
    };
    /**
     * @returns {Promise<GoogleMapsPolygon | any>}
     */
    GoogleMap.prototype.addPolygon = function (options) {
        var _this = this;
        if (!this._objectInstance) {
            return Promise.reject({ error: 'plugin_not_installed' });
        }
        return new Promise(function (resolve, reject) {
            _this._objectInstance.addPolygon(options, function (polygon) {
                if (polygon) {
                    resolve(new GoogleMapsPolygon(polygon));
                }
                else {
                    reject();
                }
            });
        });
    };
    /**
     * @returns {Promise<GoogleMapsPolyline | any>}
     */
    GoogleMap.prototype.addPolyline = function (options) {
        var _this = this;
        if (!this._objectInstance) {
            return Promise.reject({ error: 'plugin_not_installed' });
        }
        return new Promise(function (resolve, reject) {
            _this._objectInstance.addPolyline(options, function (polyline) {
                if (polyline) {
                    resolve(new GoogleMapsPolyline(polyline));
                }
                else {
                    reject();
                }
            });
        });
    };
    /**
     * @returns {Promise<GoogleMapsTileOverlay | any>}
     */
    GoogleMap.prototype.addTileOverlay = function (options) {
        var _this = this;
        if (!this._objectInstance) {
            return Promise.reject({ error: 'plugin_not_installed' });
        }
        return new Promise(function (resolve, reject) {
            _this._objectInstance.addTileOverlay(options, function (tileOverlay) {
                if (tileOverlay) {
                    resolve(new GoogleMapsTileOverlay(tileOverlay));
                }
                else {
                    reject();
                }
            });
        });
    };
    /**
     * @returns {Promise<GoogleMapsGroundOverlay | any>}
     */
    GoogleMap.prototype.addGroundOverlay = function (options) {
        var _this = this;
        if (!this._objectInstance) {
            return Promise.reject({ error: 'plugin_not_installed' });
        }
        return new Promise(function (resolve, reject) {
            _this._objectInstance.addGroundOverlay(options, function (groundOverlay) {
                if (groundOverlay) {
                    resolve(new GoogleMapsGroundOverlay(groundOverlay));
                }
                else {
                    reject();
                }
            });
        });
    };
    /**
     * @returns {Promise<GoogleMapsKmlOverlay | any>}
     */
    GoogleMap.prototype.addKmlOverlay = function (options) {
        var _this = this;
        if (!this._objectInstance) {
            return Promise.reject({ error: 'plugin_not_installed' });
        }
        return new Promise(function (resolve, reject) {
            _this._objectInstance.addKmlOverlay(options, function (kmlOverlay) {
                if (kmlOverlay) {
                    resolve(new GoogleMapsKmlOverlay(kmlOverlay));
                }
                else {
                    reject();
                }
            });
        });
    };
    GoogleMap.prototype.setDiv = function (domNode) { };
    GoogleMap.prototype.setVisible = function (visible) { };
    GoogleMap.prototype.setOptions = function (options) { };
    GoogleMap.prototype.setBackgroundColor = function (backgroundColor) { };
    GoogleMap.prototype.setPadding = function (top, right, bottom, left) { };
    GoogleMap.prototype.clear = function () { };
    GoogleMap.prototype.refreshLayout = function () { };
    /**
     * @returns {Promise<any>}
     */
    GoogleMap.prototype.fromLatLngToPoint = function (latLng, point) { return; };
    /**
     * @returns {Promise<GoogleMapsLatLng>}
     */
    GoogleMap.prototype.fromPointToLatLng = function (point, latLng) { return; };
    /**
     * @returns {Promise<any>}
     */
    GoogleMap.prototype.toDataURL = function () { return; };
    GoogleMap.prototype.remove = function () { };
    GoogleMap.prototype.panBy = function () { };
    __decorate([
        CordovaInstance({ sync: true })
    ], GoogleMap.prototype, "get", null);
    __decorate([
        CordovaInstance({ sync: true })
    ], GoogleMap.prototype, "set", null);
    __decorate([
        CordovaInstance({ sync: true })
    ], GoogleMap.prototype, "empty", null);
    __decorate([
        CordovaInstance({ sync: true })
    ], GoogleMap.prototype, "setDebuggable", null);
    __decorate([
        CordovaInstance({ sync: true })
    ], GoogleMap.prototype, "setClickable", null);
    __decorate([
        CordovaInstance()
    ], GoogleMap.prototype, "getCameraPosition", null);
    __decorate([
        CordovaInstance()
    ], GoogleMap.prototype, "getMyLocation", null);
    __decorate([
        CordovaInstance()
    ], GoogleMap.prototype, "getVisibleRegion", null);
    __decorate([
        CordovaInstance({ sync: true })
    ], GoogleMap.prototype, "showDialog", null);
    __decorate([
        CordovaInstance({ sync: true })
    ], GoogleMap.prototype, "closeDialog", null);
    __decorate([
        CordovaInstance()
    ], GoogleMap.prototype, "getLicenseInfo", null);
    __decorate([
        CordovaInstance({ sync: true })
    ], GoogleMap.prototype, "setCenter", null);
    __decorate([
        CordovaInstance({ sync: true })
    ], GoogleMap.prototype, "setZoom", null);
    __decorate([
        CordovaInstance({ sync: true })
    ], GoogleMap.prototype, "setMapTypeId", null);
    __decorate([
        CordovaInstance({ sync: true })
    ], GoogleMap.prototype, "setTilt", null);
    __decorate([
        CordovaInstance()
    ], GoogleMap.prototype, "animateCamera", null);
    __decorate([
        CordovaInstance()
    ], GoogleMap.prototype, "moveCamera", null);
    __decorate([
        CordovaInstance({ sync: true })
    ], GoogleMap.prototype, "setMyLocationEnabled", null);
    __decorate([
        CordovaInstance({ sync: true })
    ], GoogleMap.prototype, "setIndoorEnabled", null);
    __decorate([
        CordovaInstance({ sync: true })
    ], GoogleMap.prototype, "setTrafficEnabled", null);
    __decorate([
        CordovaInstance({ sync: true })
    ], GoogleMap.prototype, "setCompassEnabled", null);
    __decorate([
        CordovaInstance({ sync: true })
    ], GoogleMap.prototype, "setAllGesturesEnabled", null);
    __decorate([
        CordovaInstance({ sync: true })
    ], GoogleMap.prototype, "setDiv", null);
    __decorate([
        CordovaInstance({ sync: true })
    ], GoogleMap.prototype, "setVisible", null);
    __decorate([
        CordovaInstance({ sync: true })
    ], GoogleMap.prototype, "setOptions", null);
    __decorate([
        CordovaInstance({ sync: true })
    ], GoogleMap.prototype, "setBackgroundColor", null);
    __decorate([
        CordovaInstance({ sync: true })
    ], GoogleMap.prototype, "setPadding", null);
    __decorate([
        CordovaInstance({ sync: true })
    ], GoogleMap.prototype, "clear", null);
    __decorate([
        CordovaInstance({ sync: true })
    ], GoogleMap.prototype, "refreshLayout", null);
    __decorate([
        CordovaInstance()
    ], GoogleMap.prototype, "fromLatLngToPoint", null);
    __decorate([
        CordovaInstance()
    ], GoogleMap.prototype, "fromPointToLatLng", null);
    __decorate([
        CordovaInstance()
    ], GoogleMap.prototype, "toDataURL", null);
    __decorate([
        CordovaInstance({ sync: true })
    ], GoogleMap.prototype, "remove", null);
    __decorate([
        CordovaInstance({ sync: true })
    ], GoogleMap.prototype, "panBy", null);
    __decorate([
        Cordova()
    ], GoogleMap, "isAvailable", null);
    GoogleMap = __decorate([
        Plugin({
            pluginName: 'GoogleMap',
            pluginRef: 'plugin.google.maps.Map',
            plugin: 'cordova-plugin-googlemaps',
            repo: 'https://github.com/mapsplugin/cordova-plugin-googlemaps',
            install: 'ionic plugin add cordova-plugin-googlemaps --variable API_KEY_FOR_ANDROID="YOUR_ANDROID_API_KEY_IS_HERE" --variable API_KEY_FOR_IOS="YOUR_IOS_API_KEY_IS_HERE"'
        })
    ], GoogleMap);
    return GoogleMap;
}());
/**
 * @private
 */
export var GoogleMapsMarker = (function () {
    function GoogleMapsMarker(_objectInstance) {
        this._objectInstance = _objectInstance;
    }
    /**
     * Adds an event listener.
     *
     * @returns {Observable<any>}
     */
    GoogleMapsMarker.prototype.addEventListener = function (eventName) {
        return Observable.fromEvent(this._objectInstance, eventName);
    };
    /**
     * Adds an event listener that works once.
     *
     * @returns {Promise<any>}
     */
    GoogleMapsMarker.prototype.addListenerOnce = function (eventName) {
        var _this = this;
        if (!this._objectInstance) {
            return Promise.reject({ error: 'plugin_not_installed' });
        }
        return new Promise(function (resolve) { return _this._objectInstance.addListenerOnce(eventName, resolve); });
    };
    /**
     * Gets a value
     * @param key
     */
    GoogleMapsMarker.prototype.get = function (key) { return; };
    /**
     * Sets a value
     * @param key
     * @param value
     */
    GoogleMapsMarker.prototype.set = function (key, value) { };
    /**
     * Listen to a map event.
     *
     * @returns {Observable<any>}
     */
    GoogleMapsMarker.prototype.on = function (eventName) {
        var _this = this;
        if (!this._objectInstance) {
            return new Observable(function (observer) {
                observer.error({ error: 'plugin_not_installed' });
            });
        }
        return new Observable(function (observer) {
            _this._objectInstance.on(eventName, observer.next.bind(observer));
            return function () { return _this._objectInstance.off(event); };
        });
    };
    /**
     * Listen to a map event only once.
     *
     * @returns {Promise<any>}
     */
    GoogleMapsMarker.prototype.one = function (eventName) {
        var _this = this;
        if (!this._objectInstance) {
            return Promise.reject({ error: 'plugin_not_installed' });
        }
        return new Promise(function (resolve) { return _this._objectInstance.one(eventName, resolve); });
    };
    /**
     * Clears all stored values
     */
    GoogleMapsMarker.prototype.empty = function () { };
    /**
     * Return true if the marker is visible
     */
    GoogleMapsMarker.prototype.isVisible = function () { return; };
    /**
     * Set false if you want to hide the marker.
     * @param visible
     */
    GoogleMapsMarker.prototype.setVisible = function (visible) { };
    /**
     * Return the marker hash code.
     * @return {string} Marker hash code
     */
    GoogleMapsMarker.prototype.getHashCode = function () { return; };
    /**
     * Remove the marker completely.
     */
    GoogleMapsMarker.prototype.remove = function () { };
    /**
     * Change the marker opacity.
     * @param alpha {number} Opacity
     */
    GoogleMapsMarker.prototype.setOpacity = function (alpha) { };
    /**
     * Return the marker opacity.
     * @return {number} Opacity
     */
    GoogleMapsMarker.prototype.getOpacity = function () { return; };
    /**
     * iOS only, Plugin Version >= 1.3.3 Higher zIndex value overlays will be drawn on top of lower zIndex value tile layers and overlays. (You're able to run this on Android, but it will have no effect)
     * @return {number}
     */
    GoogleMapsMarker.prototype.setZIndex = function () { return; };
    /**
     * Change the info window anchor. This defaults to 50% from the left of the image and at the bottom of the image.
     * @param x {number}
     * @param y {number}
     */
    GoogleMapsMarker.prototype.setIconAnchor = function (x, y) { };
    /**
     * Change the info window anchor. This defaults to 50% from the left of the image and at the top of the image.
     * @param x {number}
     * @param y {number}
     */
    GoogleMapsMarker.prototype.setInfoWindowAnchor = function (x, y) { };
    /**
     * 	Set true if you allows all users to drag the marker.
     * @param draggable {boolean}
     */
    GoogleMapsMarker.prototype.setDraggable = function (draggable) { };
    /**
     * Return true if the marker drag is enabled.
     * @return {boolean}
     */
    GoogleMapsMarker.prototype.isDraggable = function () { return; };
    /**
     * Set true if you want to be flat marker.
     * @param flat {boolean}
     */
    GoogleMapsMarker.prototype.setFlat = function (flat) { return; };
    /**
     * Change icon url and/or size
     * @param icon
     */
    GoogleMapsMarker.prototype.setIcon = function (icon) { return; };
    /**
     * Change title of the infoWindow.
     * @param title {string}
     */
    GoogleMapsMarker.prototype.setTitle = function (title) { };
    /**
     * Return the title strings.
     * @return {string}
     */
    GoogleMapsMarker.prototype.getTitle = function () { return; };
    /**
     * Change snippet of the infoWindow.
     * @param snippet {string}
     */
    GoogleMapsMarker.prototype.setSnippet = function (snippet) { };
    /**
     * Return the snippet strings.
     * @return {string}
     */
    GoogleMapsMarker.prototype.getSnippet = function () { return; };
    /**
     * Set the marker rotation angle.
     * @param rotation {number}
     */
    GoogleMapsMarker.prototype.setRotation = function (rotation) { };
    /**
     * Return the marker rotation angle.
     * @return {number}
     */
    GoogleMapsMarker.prototype.getRotation = function () { return; };
    /**
     * Show the infoWindow of the marker.
     * @return {number}
     */
    GoogleMapsMarker.prototype.showInfoWindow = function () { return; };
    /**
     * Hide the infoWindow of the marker.
     * @return {number}
     */
    GoogleMapsMarker.prototype.hideInfoWindow = function () { return; };
    /**
     * Set the marker position.
     * @param latLng {GoogleMapLatLng}
     */
    GoogleMapsMarker.prototype.setPosition = function (latLng) { return; };
    /**
     * Return the marker position.
     * @return {Promise<GoogleMapLatLng>}
     */
    GoogleMapsMarker.prototype.getPosition = function () { return; };
    /**
     * Return the map instance.
     * @return {GoogleMap}
     */
    GoogleMapsMarker.prototype.getMap = function () { return; };
    /**
     * Specify the animation either `DROP` or `BOUNCE`
     * @param animation {string}
     */
    GoogleMapsMarker.prototype.setAnimation = function (animation) { };
    __decorate([
        CordovaInstance({ sync: true })
    ], GoogleMapsMarker.prototype, "get", null);
    __decorate([
        CordovaInstance({ sync: true })
    ], GoogleMapsMarker.prototype, "set", null);
    __decorate([
        CordovaInstance({ sync: true })
    ], GoogleMapsMarker.prototype, "empty", null);
    __decorate([
        CordovaInstance({ sync: true })
    ], GoogleMapsMarker.prototype, "isVisible", null);
    __decorate([
        CordovaInstance()
    ], GoogleMapsMarker.prototype, "setVisible", null);
    __decorate([
        CordovaInstance({ sync: true })
    ], GoogleMapsMarker.prototype, "getHashCode", null);
    __decorate([
        CordovaInstance({ sync: true })
    ], GoogleMapsMarker.prototype, "remove", null);
    __decorate([
        CordovaInstance({ sync: true })
    ], GoogleMapsMarker.prototype, "setOpacity", null);
    __decorate([
        CordovaInstance({ sync: true })
    ], GoogleMapsMarker.prototype, "getOpacity", null);
    __decorate([
        CordovaInstance({ sync: true })
    ], GoogleMapsMarker.prototype, "setZIndex", null);
    __decorate([
        CordovaInstance({ sync: true })
    ], GoogleMapsMarker.prototype, "setIconAnchor", null);
    __decorate([
        CordovaInstance({ sync: true })
    ], GoogleMapsMarker.prototype, "setInfoWindowAnchor", null);
    __decorate([
        CordovaInstance({ sync: true })
    ], GoogleMapsMarker.prototype, "setDraggable", null);
    __decorate([
        CordovaInstance({ sync: true })
    ], GoogleMapsMarker.prototype, "isDraggable", null);
    __decorate([
        CordovaInstance({ sync: true })
    ], GoogleMapsMarker.prototype, "setFlat", null);
    __decorate([
        CordovaInstance({ sync: true })
    ], GoogleMapsMarker.prototype, "setIcon", null);
    __decorate([
        CordovaInstance({ sync: true })
    ], GoogleMapsMarker.prototype, "setTitle", null);
    __decorate([
        CordovaInstance({ sync: true })
    ], GoogleMapsMarker.prototype, "getTitle", null);
    __decorate([
        CordovaInstance({ sync: true })
    ], GoogleMapsMarker.prototype, "setSnippet", null);
    __decorate([
        CordovaInstance({ sync: true })
    ], GoogleMapsMarker.prototype, "getSnippet", null);
    __decorate([
        CordovaInstance({ sync: true })
    ], GoogleMapsMarker.prototype, "setRotation", null);
    __decorate([
        CordovaInstance({ sync: true })
    ], GoogleMapsMarker.prototype, "getRotation", null);
    __decorate([
        CordovaInstance({ sync: true })
    ], GoogleMapsMarker.prototype, "showInfoWindow", null);
    __decorate([
        CordovaInstance({ sync: true })
    ], GoogleMapsMarker.prototype, "hideInfoWindow", null);
    __decorate([
        CordovaInstance({ sync: true })
    ], GoogleMapsMarker.prototype, "setPosition", null);
    __decorate([
        CordovaInstance()
    ], GoogleMapsMarker.prototype, "getPosition", null);
    __decorate([
        CordovaInstance({ sync: true })
    ], GoogleMapsMarker.prototype, "getMap", null);
    __decorate([
        CordovaInstance({ sync: true })
    ], GoogleMapsMarker.prototype, "setAnimation", null);
    return GoogleMapsMarker;
}());
/**
 * @private
 */
export var GoogleMapsCircle = (function () {
    function GoogleMapsCircle(_objectInstance) {
        this._objectInstance = _objectInstance;
    }
    /**
     * Adds an event listener.
     *
     * @returns {Observable<any>}
     */
    GoogleMapsCircle.prototype.addEventListener = function (eventName) {
        return Observable.fromEvent(this._objectInstance, eventName);
    };
    /**
     * Adds an event listener that works once.
     *
     * @returns {Promise<any>}
     */
    GoogleMapsCircle.prototype.addListenerOnce = function (eventName) {
        var _this = this;
        if (!this._objectInstance) {
            return Promise.reject({ error: 'plugin_not_installed' });
        }
        return new Promise(function (resolve) { return _this._objectInstance.addListenerOnce(eventName, resolve); });
    };
    /**
     * Gets a value
     * @param key
     */
    GoogleMapsCircle.prototype.get = function (key) { return; };
    /**
     * Sets a value
     * @param key
     * @param value
     */
    GoogleMapsCircle.prototype.set = function (key, value) { };
    /**
     * Listen to a map event.
     *
     * @returns {Observable<any>}
     */
    GoogleMapsCircle.prototype.on = function (eventName) {
        var _this = this;
        if (!this._objectInstance) {
            return new Observable(function (observer) {
                observer.error({ error: 'plugin_not_installed' });
            });
        }
        return new Observable(function (observer) {
            _this._objectInstance.on(eventName, observer.next.bind(observer));
            return function () { return _this._objectInstance.off(event); };
        });
    };
    /**
     * Listen to a map event only once.
     *
     * @returns {Promise<any>}
     */
    GoogleMapsCircle.prototype.one = function (eventName) {
        var _this = this;
        if (!this._objectInstance) {
            return Promise.reject({ error: 'plugin_not_installed' });
        }
        return new Promise(function (resolve) { return _this._objectInstance.one(eventName, resolve); });
    };
    /**
     * Clears all stored values
     */
    GoogleMapsCircle.prototype.empty = function () { };
    GoogleMapsCircle.prototype.getCenter = function () { return; };
    GoogleMapsCircle.prototype.getRadius = function () { return; };
    GoogleMapsCircle.prototype.getStrokeColor = function () { return; };
    GoogleMapsCircle.prototype.getVisible = function () { return; };
    GoogleMapsCircle.prototype.getZIndex = function () { return; };
    GoogleMapsCircle.prototype.remove = function () { };
    GoogleMapsCircle.prototype.setCenter = function (latLng) { };
    GoogleMapsCircle.prototype.setFillColor = function (fillColor) { };
    GoogleMapsCircle.prototype.setStrokeColor = function (strokeColor) { };
    GoogleMapsCircle.prototype.setStrokeWidth = function (strokeWidth) { };
    GoogleMapsCircle.prototype.setVisible = function (visible) { };
    GoogleMapsCircle.prototype.setZIndex = function (zIndex) { };
    GoogleMapsCircle.prototype.setRadius = function (radius) { };
    GoogleMapsCircle.prototype.getMap = function () { return; };
    __decorate([
        CordovaInstance({ sync: true })
    ], GoogleMapsCircle.prototype, "get", null);
    __decorate([
        CordovaInstance({ sync: true })
    ], GoogleMapsCircle.prototype, "set", null);
    __decorate([
        CordovaInstance({ sync: true })
    ], GoogleMapsCircle.prototype, "empty", null);
    __decorate([
        CordovaInstance({ sync: true })
    ], GoogleMapsCircle.prototype, "getCenter", null);
    __decorate([
        CordovaInstance({ sync: true })
    ], GoogleMapsCircle.prototype, "getRadius", null);
    __decorate([
        CordovaInstance({ sync: true })
    ], GoogleMapsCircle.prototype, "getStrokeColor", null);
    __decorate([
        CordovaInstance({ sync: true })
    ], GoogleMapsCircle.prototype, "getVisible", null);
    __decorate([
        CordovaInstance({ sync: true })
    ], GoogleMapsCircle.prototype, "getZIndex", null);
    __decorate([
        CordovaInstance({ sync: true })
    ], GoogleMapsCircle.prototype, "remove", null);
    __decorate([
        CordovaInstance({ sync: true })
    ], GoogleMapsCircle.prototype, "setCenter", null);
    __decorate([
        CordovaInstance({ sync: true })
    ], GoogleMapsCircle.prototype, "setFillColor", null);
    __decorate([
        CordovaInstance({ sync: true })
    ], GoogleMapsCircle.prototype, "setStrokeColor", null);
    __decorate([
        CordovaInstance({ sync: true })
    ], GoogleMapsCircle.prototype, "setStrokeWidth", null);
    __decorate([
        CordovaInstance({ sync: true })
    ], GoogleMapsCircle.prototype, "setVisible", null);
    __decorate([
        CordovaInstance({ sync: true })
    ], GoogleMapsCircle.prototype, "setZIndex", null);
    __decorate([
        CordovaInstance({ sync: true })
    ], GoogleMapsCircle.prototype, "setRadius", null);
    __decorate([
        CordovaInstance({ sync: true })
    ], GoogleMapsCircle.prototype, "getMap", null);
    return GoogleMapsCircle;
}());
/**
 * @private
 */
export var GoogleMapsPolyline = (function () {
    function GoogleMapsPolyline(_objectInstance) {
        this._objectInstance = _objectInstance;
    }
    /**
     * Adds an event listener.
     *
     * @returns {Observable<any>}
     */
    GoogleMapsPolyline.prototype.addEventListener = function (eventName) {
        return Observable.fromEvent(this._objectInstance, eventName);
    };
    /**
     * Adds an event listener that works once.
     *
     * @returns {Promise<any>}
     */
    GoogleMapsPolyline.prototype.addListenerOnce = function (eventName) {
        var _this = this;
        if (!this._objectInstance) {
            return Promise.reject({ error: 'plugin_not_installed' });
        }
        return new Promise(function (resolve) { return _this._objectInstance.addListenerOnce(eventName, resolve); });
    };
    /**
     * Gets a value
     * @param key
     */
    GoogleMapsPolyline.prototype.get = function (key) { return; };
    /**
     * Sets a value
     * @param key
     * @param value
     */
    GoogleMapsPolyline.prototype.set = function (key, value) { };
    /**
     * Listen to a map event.
     *
     * @returns {Observable<any>}
     */
    GoogleMapsPolyline.prototype.on = function (eventName) {
        var _this = this;
        if (!this._objectInstance) {
            return new Observable(function (observer) {
                observer.error({ error: 'plugin_not_installed' });
            });
        }
        return new Observable(function (observer) {
            _this._objectInstance.on(eventName, observer.next.bind(observer));
            return function () { return _this._objectInstance.off(event); };
        });
    };
    /**
     * Listen to a map event only once.
     *
     * @returns {Promise<any>}
     */
    GoogleMapsPolyline.prototype.one = function (eventName) {
        var _this = this;
        if (!this._objectInstance) {
            return Promise.reject({ error: 'plugin_not_installed' });
        }
        return new Promise(function (resolve) { return _this._objectInstance.one(eventName, resolve); });
    };
    /**
     * Clears all stored values
     */
    GoogleMapsPolyline.prototype.empty = function () { };
    GoogleMapsPolyline.prototype.getPoints = function () { return; };
    GoogleMapsPolyline.prototype.getCOlor = function () { return; };
    GoogleMapsPolyline.prototype.getWidth = function () { return; };
    GoogleMapsPolyline.prototype.getGeodesic = function () { return; };
    GoogleMapsPolyline.prototype.getZIndex = function () { return; };
    GoogleMapsPolyline.prototype.remove = function () { };
    GoogleMapsPolyline.prototype.setPoints = function (points) { };
    GoogleMapsPolyline.prototype.setColor = function (color) { };
    GoogleMapsPolyline.prototype.setWidth = function (width) { };
    GoogleMapsPolyline.prototype.setVisible = function (visible) { };
    GoogleMapsPolyline.prototype.setZIndex = function (zIndex) { };
    GoogleMapsPolyline.prototype.setGeoDesic = function (geoDesic) { };
    GoogleMapsPolyline.prototype.getMap = function () { return; };
    __decorate([
        CordovaInstance({ sync: true })
    ], GoogleMapsPolyline.prototype, "get", null);
    __decorate([
        CordovaInstance({ sync: true })
    ], GoogleMapsPolyline.prototype, "set", null);
    __decorate([
        CordovaInstance({ sync: true })
    ], GoogleMapsPolyline.prototype, "empty", null);
    __decorate([
        CordovaInstance({ sync: true })
    ], GoogleMapsPolyline.prototype, "getPoints", null);
    __decorate([
        CordovaInstance({ sync: true })
    ], GoogleMapsPolyline.prototype, "getCOlor", null);
    __decorate([
        CordovaInstance({ sync: true })
    ], GoogleMapsPolyline.prototype, "getWidth", null);
    __decorate([
        CordovaInstance({ sync: true })
    ], GoogleMapsPolyline.prototype, "getGeodesic", null);
    __decorate([
        CordovaInstance({ sync: true })
    ], GoogleMapsPolyline.prototype, "getZIndex", null);
    __decorate([
        CordovaInstance({ sync: true })
    ], GoogleMapsPolyline.prototype, "remove", null);
    __decorate([
        CordovaInstance({ sync: true })
    ], GoogleMapsPolyline.prototype, "setPoints", null);
    __decorate([
        CordovaInstance({ sync: true })
    ], GoogleMapsPolyline.prototype, "setColor", null);
    __decorate([
        CordovaInstance({ sync: true })
    ], GoogleMapsPolyline.prototype, "setWidth", null);
    __decorate([
        CordovaInstance({ sync: true })
    ], GoogleMapsPolyline.prototype, "setVisible", null);
    __decorate([
        CordovaInstance({ sync: true })
    ], GoogleMapsPolyline.prototype, "setZIndex", null);
    __decorate([
        CordovaInstance({ sync: true })
    ], GoogleMapsPolyline.prototype, "setGeoDesic", null);
    __decorate([
        CordovaInstance({ sync: true })
    ], GoogleMapsPolyline.prototype, "getMap", null);
    return GoogleMapsPolyline;
}());
/**
 * @private
 */
export var GoogleMapsPolygon = (function () {
    function GoogleMapsPolygon(_objectInstance) {
        this._objectInstance = _objectInstance;
    }
    /**
     * Adds an event listener.
     *
     * @returns {Observable<any>}
     */
    GoogleMapsPolygon.prototype.addEventListener = function (eventName) {
        return Observable.fromEvent(this._objectInstance, eventName);
    };
    /**
     * Adds an event listener that works once.
     *
     * @returns {Promise<any>}
     */
    GoogleMapsPolygon.prototype.addListenerOnce = function (eventName) {
        var _this = this;
        if (!this._objectInstance) {
            return Promise.reject({ error: 'plugin_not_installed' });
        }
        return new Promise(function (resolve) { return _this._objectInstance.addListenerOnce(eventName, resolve); });
    };
    /**
     * Gets a value
     * @param key
     */
    GoogleMapsPolygon.prototype.get = function (key) { return; };
    /**
     * Sets a value
     * @param key
     * @param value
     */
    GoogleMapsPolygon.prototype.set = function (key, value) { };
    /**
     * Listen to a map event.
     *
     * @returns {Observable<any>}
     */
    GoogleMapsPolygon.prototype.on = function (eventName) {
        var _this = this;
        if (!this._objectInstance) {
            return new Observable(function (observer) {
                observer.error({ error: 'plugin_not_installed' });
            });
        }
        return new Observable(function (observer) {
            _this._objectInstance.on(eventName, observer.next.bind(observer));
            return function () { return _this._objectInstance.off(event); };
        });
    };
    /**
     * Listen to a map event only once.
     *
     * @returns {Promise<any>}
     */
    GoogleMapsPolygon.prototype.one = function (eventName) {
        var _this = this;
        if (!this._objectInstance) {
            return Promise.reject({ error: 'plugin_not_installed' });
        }
        return new Promise(function (resolve) { return _this._objectInstance.one(eventName, resolve); });
    };
    /**
     * Clears all stored values
     */
    GoogleMapsPolygon.prototype.empty = function () { };
    GoogleMapsPolygon.prototype.getPoints = function () { return; };
    GoogleMapsPolygon.prototype.getStrokeColor = function () { return; };
    GoogleMapsPolygon.prototype.getFillColor = function () { return; };
    GoogleMapsPolygon.prototype.getStrokeWidth = function () { return; };
    GoogleMapsPolygon.prototype.getGeodesic = function () { return; };
    GoogleMapsPolygon.prototype.getVisible = function () { return; };
    GoogleMapsPolygon.prototype.getZIndex = function () { return; };
    GoogleMapsPolygon.prototype.remove = function () { };
    GoogleMapsPolygon.prototype.setPoints = function (points) { };
    GoogleMapsPolygon.prototype.setStrokeColor = function (strokeColor) { };
    GoogleMapsPolygon.prototype.setFillColor = function (fillColor) { };
    GoogleMapsPolygon.prototype.setStrokeWidth = function (strokeWidth) { };
    GoogleMapsPolygon.prototype.setVisible = function (visible) { };
    GoogleMapsPolygon.prototype.setZIndex = function (zIndex) { };
    GoogleMapsPolygon.prototype.setGeodesic = function (geodesic) { };
    __decorate([
        CordovaInstance({ sync: true })
    ], GoogleMapsPolygon.prototype, "get", null);
    __decorate([
        CordovaInstance({ sync: true })
    ], GoogleMapsPolygon.prototype, "set", null);
    __decorate([
        CordovaInstance({ sync: true })
    ], GoogleMapsPolygon.prototype, "empty", null);
    __decorate([
        CordovaInstance({ sync: true })
    ], GoogleMapsPolygon.prototype, "getPoints", null);
    __decorate([
        CordovaInstance({ sync: true })
    ], GoogleMapsPolygon.prototype, "getStrokeColor", null);
    __decorate([
        CordovaInstance({ sync: true })
    ], GoogleMapsPolygon.prototype, "getFillColor", null);
    __decorate([
        CordovaInstance({ sync: true })
    ], GoogleMapsPolygon.prototype, "getStrokeWidth", null);
    __decorate([
        CordovaInstance({ sync: true })
    ], GoogleMapsPolygon.prototype, "getGeodesic", null);
    __decorate([
        CordovaInstance({ sync: true })
    ], GoogleMapsPolygon.prototype, "getVisible", null);
    __decorate([
        CordovaInstance({ sync: true })
    ], GoogleMapsPolygon.prototype, "getZIndex", null);
    __decorate([
        CordovaInstance({ sync: true })
    ], GoogleMapsPolygon.prototype, "remove", null);
    __decorate([
        CordovaInstance({ sync: true })
    ], GoogleMapsPolygon.prototype, "setPoints", null);
    __decorate([
        CordovaInstance({ sync: true })
    ], GoogleMapsPolygon.prototype, "setStrokeColor", null);
    __decorate([
        CordovaInstance({ sync: true })
    ], GoogleMapsPolygon.prototype, "setFillColor", null);
    __decorate([
        CordovaInstance({ sync: true })
    ], GoogleMapsPolygon.prototype, "setStrokeWidth", null);
    __decorate([
        CordovaInstance({ sync: true })
    ], GoogleMapsPolygon.prototype, "setVisible", null);
    __decorate([
        CordovaInstance({ sync: true })
    ], GoogleMapsPolygon.prototype, "setZIndex", null);
    __decorate([
        CordovaInstance({ sync: true })
    ], GoogleMapsPolygon.prototype, "setGeodesic", null);
    return GoogleMapsPolygon;
}());
/**
 * @private
 */
export var GoogleMapsTileOverlay = (function () {
    function GoogleMapsTileOverlay(_objectInstance) {
        this._objectInstance = _objectInstance;
    }
    /**
     * Adds an event listener.
     *
     * @returns {Observable<any>}
     */
    GoogleMapsTileOverlay.prototype.addEventListener = function (eventName) {
        return Observable.fromEvent(this._objectInstance, eventName);
    };
    /**
     * Adds an event listener that works once.
     *
     * @returns {Promise<any>}
     */
    GoogleMapsTileOverlay.prototype.addListenerOnce = function (eventName) {
        var _this = this;
        if (!this._objectInstance) {
            return Promise.reject({ error: 'plugin_not_installed' });
        }
        return new Promise(function (resolve) { return _this._objectInstance.addListenerOnce(eventName, resolve); });
    };
    /**
     * Gets a value
     * @param key
     */
    GoogleMapsTileOverlay.prototype.get = function (key) { return; };
    /**
     * Sets a value
     * @param key
     * @param value
     */
    GoogleMapsTileOverlay.prototype.set = function (key, value) { };
    /**
     * Listen to a map event.
     *
     * @returns {Observable<any>}
     */
    GoogleMapsTileOverlay.prototype.on = function (eventName) {
        var _this = this;
        if (!this._objectInstance) {
            return new Observable(function (observer) {
                observer.error({ error: 'plugin_not_installed' });
            });
        }
        return new Observable(function (observer) {
            _this._objectInstance.on(eventName, observer.next.bind(observer));
            return function () { return _this._objectInstance.off(event); };
        });
    };
    /**
     * Listen to a map event only once.
     *
     * @returns {Promise<any>}
     */
    GoogleMapsTileOverlay.prototype.one = function (eventName) {
        var _this = this;
        if (!this._objectInstance) {
            return Promise.reject({ error: 'plugin_not_installed' });
        }
        return new Promise(function (resolve) { return _this._objectInstance.one(eventName, resolve); });
    };
    /**
     * Clears all stored values
     */
    GoogleMapsTileOverlay.prototype.empty = function () { };
    GoogleMapsTileOverlay.prototype.getVisible = function () { return; };
    GoogleMapsTileOverlay.prototype.setVisible = function (visible) { };
    GoogleMapsTileOverlay.prototype.getFadeIn = function () { return; };
    GoogleMapsTileOverlay.prototype.setFadeIn = function (fadeIn) { };
    GoogleMapsTileOverlay.prototype.getZIndex = function () { return; };
    GoogleMapsTileOverlay.prototype.setZIndex = function (zIndex) { };
    GoogleMapsTileOverlay.prototype.getOpacity = function () { return; };
    GoogleMapsTileOverlay.prototype.setOpacity = function (opacity) { };
    GoogleMapsTileOverlay.prototype.clearTileCache = function () { };
    GoogleMapsTileOverlay.prototype.remove = function () { };
    __decorate([
        CordovaInstance({ sync: true })
    ], GoogleMapsTileOverlay.prototype, "get", null);
    __decorate([
        CordovaInstance({ sync: true })
    ], GoogleMapsTileOverlay.prototype, "set", null);
    __decorate([
        CordovaInstance({ sync: true })
    ], GoogleMapsTileOverlay.prototype, "empty", null);
    __decorate([
        CordovaInstance({ sync: true })
    ], GoogleMapsTileOverlay.prototype, "getVisible", null);
    __decorate([
        CordovaInstance({ sync: true })
    ], GoogleMapsTileOverlay.prototype, "setVisible", null);
    __decorate([
        CordovaInstance({ sync: true })
    ], GoogleMapsTileOverlay.prototype, "getFadeIn", null);
    __decorate([
        CordovaInstance({ sync: true })
    ], GoogleMapsTileOverlay.prototype, "setFadeIn", null);
    __decorate([
        CordovaInstance({ sync: true })
    ], GoogleMapsTileOverlay.prototype, "getZIndex", null);
    __decorate([
        CordovaInstance({ sync: true })
    ], GoogleMapsTileOverlay.prototype, "setZIndex", null);
    __decorate([
        CordovaInstance({ sync: true })
    ], GoogleMapsTileOverlay.prototype, "getOpacity", null);
    __decorate([
        CordovaInstance({ sync: true })
    ], GoogleMapsTileOverlay.prototype, "setOpacity", null);
    __decorate([
        CordovaInstance({ sync: true })
    ], GoogleMapsTileOverlay.prototype, "clearTileCache", null);
    __decorate([
        CordovaInstance({ sync: true })
    ], GoogleMapsTileOverlay.prototype, "remove", null);
    return GoogleMapsTileOverlay;
}());
/**
 * @private
 */
export var GoogleMapsGroundOverlay = (function () {
    function GoogleMapsGroundOverlay(_objectInstance) {
        this._objectInstance = _objectInstance;
    }
    /**
     * Adds an event listener.
     *
     * @returns {Observable<any>}
     */
    GoogleMapsGroundOverlay.prototype.addEventListener = function (eventName) {
        return Observable.fromEvent(this._objectInstance, eventName);
    };
    /**
     * Adds an event listener that works once.
     *
     * @returns {Promise<any>}
     */
    GoogleMapsGroundOverlay.prototype.addListenerOnce = function (eventName) {
        var _this = this;
        if (!this._objectInstance) {
            return Promise.reject({ error: 'plugin_not_installed' });
        }
        return new Promise(function (resolve) { return _this._objectInstance.addListenerOnce(eventName, resolve); });
    };
    /**
     * Gets a value
     * @param key
     */
    GoogleMapsGroundOverlay.prototype.get = function (key) { return; };
    /**
     * Sets a value
     * @param key
     * @param value
     */
    GoogleMapsGroundOverlay.prototype.set = function (key, value) { };
    /**
     * Listen to a map event.
     *
     * @returns {Observable<any>}
     */
    GoogleMapsGroundOverlay.prototype.on = function (eventName) {
        var _this = this;
        if (!this._objectInstance) {
            return new Observable(function (observer) {
                observer.error({ error: 'plugin_not_installed' });
            });
        }
        return new Observable(function (observer) {
            _this._objectInstance.on(eventName, observer.next.bind(observer));
            return function () { return _this._objectInstance.off(event); };
        });
    };
    /**
     * Listen to a map event only once.
     *
     * @returns {Promise<any>}
     */
    GoogleMapsGroundOverlay.prototype.one = function (eventName) {
        var _this = this;
        if (!this._objectInstance) {
            return Promise.reject({ error: 'plugin_not_installed' });
        }
        return new Promise(function (resolve) { return _this._objectInstance.one(eventName, resolve); });
    };
    /**
     * Clears all stored values
     */
    GoogleMapsGroundOverlay.prototype.empty = function () { };
    GoogleMapsGroundOverlay.prototype.setBearing = function (bearing) { };
    GoogleMapsGroundOverlay.prototype.getBearing = function () { return; };
    GoogleMapsGroundOverlay.prototype.setOpacity = function (opacity) { };
    GoogleMapsGroundOverlay.prototype.getOpacity = function () { return; };
    GoogleMapsGroundOverlay.prototype.setVisible = function (visible) { };
    GoogleMapsGroundOverlay.prototype.getVisible = function () { return; };
    GoogleMapsGroundOverlay.prototype.setImage = function (image) { };
    ;
    GoogleMapsGroundOverlay.prototype.remove = function () { };
    __decorate([
        CordovaInstance({ sync: true })
    ], GoogleMapsGroundOverlay.prototype, "get", null);
    __decorate([
        CordovaInstance({ sync: true })
    ], GoogleMapsGroundOverlay.prototype, "set", null);
    __decorate([
        CordovaInstance({ sync: true })
    ], GoogleMapsGroundOverlay.prototype, "empty", null);
    __decorate([
        CordovaInstance({ sync: true })
    ], GoogleMapsGroundOverlay.prototype, "setBearing", null);
    __decorate([
        CordovaInstance({ sync: true })
    ], GoogleMapsGroundOverlay.prototype, "getBearing", null);
    __decorate([
        CordovaInstance({ sync: true })
    ], GoogleMapsGroundOverlay.prototype, "setOpacity", null);
    __decorate([
        CordovaInstance({ sync: true })
    ], GoogleMapsGroundOverlay.prototype, "getOpacity", null);
    __decorate([
        CordovaInstance({ sync: true })
    ], GoogleMapsGroundOverlay.prototype, "setVisible", null);
    __decorate([
        CordovaInstance({ sync: true })
    ], GoogleMapsGroundOverlay.prototype, "getVisible", null);
    __decorate([
        CordovaInstance({ sync: true })
    ], GoogleMapsGroundOverlay.prototype, "setImage", null);
    __decorate([
        CordovaInstance({ sync: true })
    ], GoogleMapsGroundOverlay.prototype, "remove", null);
    return GoogleMapsGroundOverlay;
}());
/**
 * @private
 */
export var GoogleMapsKmlOverlay = (function () {
    function GoogleMapsKmlOverlay(_objectInstance) {
        this._objectInstance = _objectInstance;
    }
    /**
     * Adds an event listener.
     *
     * @returns {Observable<any>}
     */
    GoogleMapsKmlOverlay.prototype.addEventListener = function (eventName) {
        return Observable.fromEvent(this._objectInstance, eventName);
    };
    /**
     * Adds an event listener that works once.
     *
     * @returns {Promise<any>}
     */
    GoogleMapsKmlOverlay.prototype.addListenerOnce = function (eventName) {
        var _this = this;
        if (!this._objectInstance) {
            return Promise.reject({ error: 'plugin_not_installed' });
        }
        return new Promise(function (resolve) { return _this._objectInstance.addListenerOnce(eventName, resolve); });
    };
    /**
     * Gets a value
     * @param key
     */
    GoogleMapsKmlOverlay.prototype.get = function (key) { return; };
    /**
     * Sets a value
     * @param key
     * @param value
     */
    GoogleMapsKmlOverlay.prototype.set = function (key, value) { };
    /**
     * Listen to a map event.
     *
     * @returns {Observable<any>}
     */
    GoogleMapsKmlOverlay.prototype.on = function (eventName) {
        var _this = this;
        if (!this._objectInstance) {
            return new Observable(function (observer) {
                observer.error({ error: 'plugin_not_installed' });
            });
        }
        return new Observable(function (observer) {
            _this._objectInstance.on(eventName, observer.next.bind(observer));
            return function () { return _this._objectInstance.off(event); };
        });
    };
    /**
     * Listen to a map event only once.
     *
     * @returns {Promise<any>}
     */
    GoogleMapsKmlOverlay.prototype.one = function (eventName) {
        var _this = this;
        if (!this._objectInstance) {
            return Promise.reject({ error: 'plugin_not_installed' });
        }
        return new Promise(function (resolve) { return _this._objectInstance.one(eventName, resolve); });
    };
    /**
     * Clears all stored values
     */
    GoogleMapsKmlOverlay.prototype.empty = function () { };
    GoogleMapsKmlOverlay.prototype.remove = function () { };
    GoogleMapsKmlOverlay.prototype.getOverlays = function () { return; };
    __decorate([
        CordovaInstance({ sync: true })
    ], GoogleMapsKmlOverlay.prototype, "get", null);
    __decorate([
        CordovaInstance({ sync: true })
    ], GoogleMapsKmlOverlay.prototype, "set", null);
    __decorate([
        CordovaInstance({ sync: true })
    ], GoogleMapsKmlOverlay.prototype, "empty", null);
    __decorate([
        CordovaInstance({ sync: true })
    ], GoogleMapsKmlOverlay.prototype, "remove", null);
    __decorate([
        CordovaInstance({ sync: true })
    ], GoogleMapsKmlOverlay.prototype, "getOverlays", null);
    return GoogleMapsKmlOverlay;
}());
/**
 * @private
 */
export var GoogleMapsLatLngBounds = (function () {
    function GoogleMapsLatLngBounds(southwestOrArrayOfLatLng, northeast) {
        var args = !!northeast ? [southwestOrArrayOfLatLng, northeast] : southwestOrArrayOfLatLng;
        this._objectInstance = new plugin.google.maps.LatLngBounds(args);
    }
    GoogleMapsLatLngBounds.prototype.toString = function () { return; };
    GoogleMapsLatLngBounds.prototype.toUrlValue = function (precision) { return; };
    GoogleMapsLatLngBounds.prototype.extend = function (LatLng) { };
    GoogleMapsLatLngBounds.prototype.contains = function (LatLng) { return; };
    GoogleMapsLatLngBounds.prototype.getCenter = function () { return; };
    __decorate([
        InstanceProperty
    ], GoogleMapsLatLngBounds.prototype, "northeast", void 0);
    __decorate([
        InstanceProperty
    ], GoogleMapsLatLngBounds.prototype, "southwest", void 0);
    __decorate([
        InstanceProperty
    ], GoogleMapsLatLngBounds.prototype, "type", void 0);
    __decorate([
        CordovaInstance({ sync: true })
    ], GoogleMapsLatLngBounds.prototype, "toString", null);
    __decorate([
        CordovaInstance({ sync: true })
    ], GoogleMapsLatLngBounds.prototype, "toUrlValue", null);
    __decorate([
        CordovaInstance({ sync: true })
    ], GoogleMapsLatLngBounds.prototype, "extend", null);
    __decorate([
        CordovaInstance({ sync: true })
    ], GoogleMapsLatLngBounds.prototype, "contains", null);
    __decorate([
        CordovaInstance({ sync: true })
    ], GoogleMapsLatLngBounds.prototype, "getCenter", null);
    return GoogleMapsLatLngBounds;
}());
/**
 * @private
 */
export var GoogleMapsLatLng = (function () {
    function GoogleMapsLatLng(lat, lng) {
        this.lat = lat;
        this.lng = lng;
    }
    GoogleMapsLatLng.prototype.equals = function (other) {
        return this.lat === other.lat && this.lng === other.lng;
    };
    GoogleMapsLatLng.prototype.toString = function () {
        return this.lat + ',' + this.lng;
    };
    GoogleMapsLatLng.prototype.toUrlValue = function (precision) {
        precision = precision || 6;
        return this.lat.toFixed(precision) + ',' + this.lng.toFixed(precision);
    };
    return GoogleMapsLatLng;
}());
/**
 * @private
 */
export var Geocoder = (function () {
    function Geocoder() {
    }
    /**
     * Converts position to address and vice versa
     * @param {GeocoderRequest} request Request object with either an address or a position
     * @returns {Promise<GeocoderResult[]>}
     */
    Geocoder.geocode = function (request) {
        return new Promise(function (resolve, reject) {
            if (!plugin || !plugin.google || !plugin.google.maps || !plugin.google.maps.Geocoder) {
                pluginWarn({
                    pluginName: 'GoogleMap',
                    plugin: 'plugin.google.maps.Map'
                });
                reject({ error: 'plugin_not_installed' });
            }
            else {
                plugin.google.maps.Geocoder.geocode(request, resolve);
            }
        });
    };
    return Geocoder;
}());
//# sourceMappingURL=googlemap.js.map