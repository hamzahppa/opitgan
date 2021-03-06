import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
/**
 * @private
 * You can listen to these events where appropriate
 */
export declare const GoogleMapsEvent: {
    MAP_CLICK: string;
    MAP_LONG_CLICK: string;
    MY_LOCATION_CHANGE: string;
    MY_LOCATION_BUTTON_CLICK: string;
    INDOOR_BUILDING_FOCUSED: string;
    INDOOR_LEVEL_ACTIVATED: string;
    CAMERA_CHANGE: string;
    CAMERA_IDLE: string;
    MAP_READY: string;
    MAP_LOADED: string;
    MAP_WILL_MOVE: string;
    MAP_CLOSE: string;
    MARKER_CLICK: string;
    OVERLAY_CLICK: string;
    INFO_CLICK: string;
    MARKER_DRAG: string;
    MARKER_DRAG_START: string;
    MARKER_DRAG_END: string;
};
/**
 * @private
 */
export declare const GoogleMapsAnimation: {
    BOUNCE: string;
    DROP: string;
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
export declare class GoogleMap {
    _objectInstance: any;
    /**
     * Checks if a map object has been created and is available.
     *
     * @returns {Promise<boolean>}
     */
    static isAvailable(): Promise<boolean>;
    constructor(element: string | HTMLElement, options?: any);
    /**
     * Adds an event listener.
     *
     * @returns {Observable<any>}
     */
    addEventListener(eventName: string): Observable<any>;
    /**
     * Adds an event listener that works once.
     *
     * @returns {Promise<any>}
     */
    addListenerOnce(eventName: string): Promise<any>;
    /**
     * Gets a value
     * @param key
     */
    get(key: string): any;
    /**
     * Sets a value
     * @param key
     * @param value
     */
    set(key: string, value: any): void;
    /**
     * Listen to a map event.
     *
     * @returns {Observable<any>}
     */
    on(eventName: string): Observable<any>;
    /**
     * Listen to a map event only once.
     *
     * @returns {Promise<any>}
     */
    one(eventName: string): Promise<any>;
    /**
     * Clears all stored values
     */
    empty(): void;
    setDebuggable(isDebuggable: boolean): void;
    setClickable(isClickable: boolean): void;
    /**
     * Get the position of the camera.
     *
     * @returns {Promise<CameraPosition>}
     */
    getCameraPosition(): Promise<CameraPosition>;
    /**
     * Get the location of the user.
     *
     * @returns {Promise<MyLocation>}
     */
    getMyLocation(options?: MyLocationOptions): Promise<MyLocation>;
    /**
     * Get the visible region.
     *
     * @returns {Promise<VisibleRegion>}
     */
    getVisibleRegion(): Promise<VisibleRegion>;
    showDialog(): void;
    closeDialog(): void;
    getLicenseInfo(): Promise<string>;
    setCenter(latLng: GoogleMapsLatLng): void;
    setZoom(zoomLevel: number): void;
    setMapTypeId(typeId: string): void;
    setTilt(tiltLevel: number): void;
    /**
     * @returns {Promise<any>}
     */
    animateCamera(animateCameraOptions: AnimateCameraOptions): Promise<any>;
    /**
     * @returns {Promise<any>}
     */
    moveCamera(cameraPosition: CameraPosition): Promise<any>;
    setMyLocationEnabled(enabled: boolean): void;
    setIndoorEnabled(enabled: boolean): void;
    setTrafficEnabled(enabled: boolean): void;
    setCompassEnabled(enabled: boolean): void;
    setAllGesturesEnabled(enabled: boolean): void;
    /**
     * @returns {Promise<GoogleMapsMarker | any>}
     */
    addMarker(options: GoogleMapsMarkerOptions): Promise<GoogleMapsMarker | any>;
    /**
     * @returns {Promise<GoogleMapsCircle | any>}
     */
    addCircle(options: GoogleMapsCircleOptions): Promise<GoogleMapsCircle | any>;
    /**
     * @returns {Promise<GoogleMapsPolygon | any>}
     */
    addPolygon(options: GoogleMapsPolygonOptions): Promise<GoogleMapsPolygon | any>;
    /**
     * @returns {Promise<GoogleMapsPolyline | any>}
     */
    addPolyline(options: GoogleMapsPolylineOptions): Promise<GoogleMapsPolyline | any>;
    /**
     * @returns {Promise<GoogleMapsTileOverlay | any>}
     */
    addTileOverlay(options: GoogleMapsTileOverlayOptions): Promise<GoogleMapsTileOverlay | any>;
    /**
     * @returns {Promise<GoogleMapsGroundOverlay | any>}
     */
    addGroundOverlay(options: GoogleMapsGroundOverlayOptions): Promise<GoogleMapsGroundOverlay | any>;
    /**
     * @returns {Promise<GoogleMapsKmlOverlay | any>}
     */
    addKmlOverlay(options: GoogleMapsKmlOverlayOptions): Promise<GoogleMapsKmlOverlay | any>;
    setDiv(domNode: HTMLElement): void;
    setVisible(visible: boolean): void;
    setOptions(options: any): void;
    setBackgroundColor(backgroundColor: string): void;
    setPadding(top?: number, right?: number, bottom?: number, left?: number): void;
    clear(): void;
    refreshLayout(): void;
    /**
     * @returns {Promise<any>}
     */
    fromLatLngToPoint(latLng: GoogleMapsLatLng, point: any): Promise<any>;
    /**
     * @returns {Promise<GoogleMapsLatLng>}
     */
    fromPointToLatLng(point: any, latLng: GoogleMapsLatLng): Promise<GoogleMapsLatLng>;
    /**
     * @returns {Promise<any>}
     */
    toDataURL(): Promise<any>;
    remove(): void;
    panBy(): void;
}
/**
 * @private
 */
export interface AnimateCameraOptions {
    target?: GoogleMapsLatLng | Array<GoogleMapsMarker> | GoogleMapsLatLngBounds;
    tilt?: number;
    zoom?: number;
    bearing?: number;
    duration?: number;
}
/**
 * @private
 */
export interface CameraPosition {
    target?: GoogleMapsLatLng | GoogleMapsLatLngBounds | GoogleMapsLatLng[];
    zoom?: number;
    tilt?: number;
    bearing?: number;
}
/**
 * @private
 */
export interface MyLocation {
    latLng?: GoogleMapsLatLng;
    speed?: number;
    time?: string;
    bearing?: number;
}
/**
 * @private
 */
export interface MyLocationOptions {
    enableHighAccuracy?: boolean;
}
/**
 * @private
 */
export interface VisibleRegion {
    northeast?: any;
    southwest?: any;
}
/**
 * @private
 */
export interface GoogleMapsMarkerOptions {
    /**
     * The icon image url or properties. Also you can specify HTML Color values. Alternatively you can specify the image as Base64
     */
    icon?: any;
    /**
     * The content of the infoWindow.
     */
    title?: string;
    /**
     * The snippet of the infoWindow.
     */
    snippet?: string;
    /**
     * The position of the marker.
     */
    position?: GoogleMapsLatLng;
    /**
     * 	Specify the anchor of the InfoWindow
     */
    infoWindowAnchor?: number[];
    /**
     * Set true if you want to enable to drag the marker. (Default: false) Important! Drag starts after long pressed on the marker.
     */
    draggable?: boolean;
    /**
     * 	Set true if you want to use a flat marker. (Default: false)
     */
    flat?: boolean;
    /**
     * 	Set rotation angle. (Default: 0)
     */
    rotation?: number;
    /**
     * Set false if you want to hide. (Default: true)
     */
    visible?: boolean;
    /**
     * Specify the options for title.
     */
    styles?: any;
    /**
     * Which animation to play when marker is added to a map.
     */
    animation?: string;
    /**
     * 	iOS only, Plugin Version >= 1.3.3 Higher zIndex value overlays will be drawn on top of lower zIndex value tile layers and overlays. (You're able to run this on Android, but it will have no effect)
     */
    zIndex?: number;
    /**
     * Set to true to disable auto panning when the marker is clicked.
     */
    disableAutoPan?: boolean;
    /**
     * Function to be invoked when the user clicks on the marker
     */
    markerClick?: Function;
    /**
     * Function to be invoked when the user clicks on the info box
     */
    infoClick?: Function;
}
/**
 * @private
 */
export interface GoogleMapsMarkerIcon {
    url?: string;
    size?: {
        width?: number;
        height?: number;
    };
}
/**
 * @private
 */
export declare class GoogleMapsMarker {
    private _objectInstance;
    constructor(_objectInstance: any);
    /**
     * Adds an event listener.
     *
     * @returns {Observable<any>}
     */
    addEventListener(eventName: string): Observable<any>;
    /**
     * Adds an event listener that works once.
     *
     * @returns {Promise<any>}
     */
    addListenerOnce(eventName: string): Promise<any>;
    /**
     * Gets a value
     * @param key
     */
    get(key: string): any;
    /**
     * Sets a value
     * @param key
     * @param value
     */
    set(key: string, value: any): void;
    /**
     * Listen to a map event.
     *
     * @returns {Observable<any>}
     */
    on(eventName: string): Observable<any>;
    /**
     * Listen to a map event only once.
     *
     * @returns {Promise<any>}
     */
    one(eventName: string): Promise<any>;
    /**
     * Clears all stored values
     */
    empty(): void;
    /**
     * Return true if the marker is visible
     */
    isVisible(): boolean;
    /**
     * Set false if you want to hide the marker.
     * @param visible
     */
    setVisible(visible: boolean): void;
    /**
     * Return the marker hash code.
     * @return {string} Marker hash code
     */
    getHashCode(): string;
    /**
     * Remove the marker completely.
     */
    remove(): void;
    /**
     * Change the marker opacity.
     * @param alpha {number} Opacity
     */
    setOpacity(alpha: number): void;
    /**
     * Return the marker opacity.
     * @return {number} Opacity
     */
    getOpacity(): number;
    /**
     * iOS only, Plugin Version >= 1.3.3 Higher zIndex value overlays will be drawn on top of lower zIndex value tile layers and overlays. (You're able to run this on Android, but it will have no effect)
     * @return {number}
     */
    setZIndex(): number;
    /**
     * Change the info window anchor. This defaults to 50% from the left of the image and at the bottom of the image.
     * @param x {number}
     * @param y {number}
     */
    setIconAnchor(x: number, y: number): void;
    /**
     * Change the info window anchor. This defaults to 50% from the left of the image and at the top of the image.
     * @param x {number}
     * @param y {number}
     */
    setInfoWindowAnchor(x: number, y: number): void;
    /**
     * 	Set true if you allows all users to drag the marker.
     * @param draggable {boolean}
     */
    setDraggable(draggable: boolean): void;
    /**
     * Return true if the marker drag is enabled.
     * @return {boolean}
     */
    isDraggable(): boolean;
    /**
     * Set true if you want to be flat marker.
     * @param flat {boolean}
     */
    setFlat(flat: boolean): void;
    /**
     * Change icon url and/or size
     * @param icon
     */
    setIcon(icon: GoogleMapsMarkerIcon): void;
    /**
     * Change title of the infoWindow.
     * @param title {string}
     */
    setTitle(title: string): void;
    /**
     * Return the title strings.
     * @return {string}
     */
    getTitle(): string;
    /**
     * Change snippet of the infoWindow.
     * @param snippet {string}
     */
    setSnippet(snippet: string): void;
    /**
     * Return the snippet strings.
     * @return {string}
     */
    getSnippet(): string;
    /**
     * Set the marker rotation angle.
     * @param rotation {number}
     */
    setRotation(rotation: number): void;
    /**
     * Return the marker rotation angle.
     * @return {number}
     */
    getRotation(): number;
    /**
     * Show the infoWindow of the marker.
     * @return {number}
     */
    showInfoWindow(): number;
    /**
     * Hide the infoWindow of the marker.
     * @return {number}
     */
    hideInfoWindow(): number;
    /**
     * Set the marker position.
     * @param latLng {GoogleMapLatLng}
     */
    setPosition(latLng: GoogleMapsLatLng): void;
    /**
     * Return the marker position.
     * @return {Promise<GoogleMapLatLng>}
     */
    getPosition(): Promise<GoogleMapsLatLng>;
    /**
     * Return the map instance.
     * @return {GoogleMap}
     */
    getMap(): GoogleMap;
    /**
     * Specify the animation either `DROP` or `BOUNCE`
     * @param animation {string}
     */
    setAnimation(animation: string): void;
}
/**
 * @private
 */
export interface GoogleMapsCircleOptions {
    center?: GoogleMapsLatLng;
    radius?: number;
    strokeColor?: string;
    strokeWidth?: number;
    fillColor?: string;
    visible?: boolean;
    zIndex?: number;
}
/**
 * @private
 */
export declare class GoogleMapsCircle {
    private _objectInstance;
    constructor(_objectInstance: any);
    /**
     * Adds an event listener.
     *
     * @returns {Observable<any>}
     */
    addEventListener(eventName: string): Observable<any>;
    /**
     * Adds an event listener that works once.
     *
     * @returns {Promise<any>}
     */
    addListenerOnce(eventName: string): Promise<any>;
    /**
     * Gets a value
     * @param key
     */
    get(key: string): any;
    /**
     * Sets a value
     * @param key
     * @param value
     */
    set(key: string, value: any): void;
    /**
     * Listen to a map event.
     *
     * @returns {Observable<any>}
     */
    on(eventName: string): Observable<any>;
    /**
     * Listen to a map event only once.
     *
     * @returns {Promise<any>}
     */
    one(eventName: string): Promise<any>;
    /**
     * Clears all stored values
     */
    empty(): void;
    getCenter(): GoogleMapsLatLng;
    getRadius(): number;
    getStrokeColor(): string;
    getVisible(): boolean;
    getZIndex(): number;
    remove(): void;
    setCenter(latLng: GoogleMapsLatLng): void;
    setFillColor(fillColor: string): void;
    setStrokeColor(strokeColor: string): void;
    setStrokeWidth(strokeWidth: number): void;
    setVisible(visible: boolean): void;
    setZIndex(zIndex: number): void;
    setRadius(radius: number): void;
    getMap(): GoogleMap;
}
/**
 * @private
 */
export interface GoogleMapsPolylineOptions {
    points?: Array<GoogleMapsLatLng>;
    visible?: boolean;
    geodesic?: boolean;
    color?: string;
    width?: number;
    zIndex?: number;
}
/**
 * @private
 */
export declare class GoogleMapsPolyline {
    private _objectInstance;
    constructor(_objectInstance: any);
    /**
     * Adds an event listener.
     *
     * @returns {Observable<any>}
     */
    addEventListener(eventName: string): Observable<any>;
    /**
     * Adds an event listener that works once.
     *
     * @returns {Promise<any>}
     */
    addListenerOnce(eventName: string): Promise<any>;
    /**
     * Gets a value
     * @param key
     */
    get(key: string): any;
    /**
     * Sets a value
     * @param key
     * @param value
     */
    set(key: string, value: any): void;
    /**
     * Listen to a map event.
     *
     * @returns {Observable<any>}
     */
    on(eventName: string): Observable<any>;
    /**
     * Listen to a map event only once.
     *
     * @returns {Promise<any>}
     */
    one(eventName: string): Promise<any>;
    /**
     * Clears all stored values
     */
    empty(): void;
    getPoints(): Array<GoogleMapsLatLng>;
    getCOlor(): string;
    getWidth(): number;
    getGeodesic(): boolean;
    getZIndex(): number;
    remove(): void;
    setPoints(points: Array<GoogleMapsLatLng>): void;
    setColor(color: string): void;
    setWidth(width: number): void;
    setVisible(visible: boolean): void;
    setZIndex(zIndex: number): void;
    setGeoDesic(geoDesic: boolean): void;
    getMap(): GoogleMap;
}
/**
 * @private
 */
export interface GoogleMapsPolygonOptions {
    points?: Array<GoogleMapsLatLng>;
    geodesic?: boolean;
    strokeColor?: string;
    strokeWidth?: number;
    fillColor?: string;
    visible?: boolean;
    zIndex?: number;
    addHole?: Array<GoogleMapsLatLng>;
}
/**
 * @private
 */
export declare class GoogleMapsPolygon {
    private _objectInstance;
    constructor(_objectInstance: any);
    /**
     * Adds an event listener.
     *
     * @returns {Observable<any>}
     */
    addEventListener(eventName: string): Observable<any>;
    /**
     * Adds an event listener that works once.
     *
     * @returns {Promise<any>}
     */
    addListenerOnce(eventName: string): Promise<any>;
    /**
     * Gets a value
     * @param key
     */
    get(key: string): any;
    /**
     * Sets a value
     * @param key
     * @param value
     */
    set(key: string, value: any): void;
    /**
     * Listen to a map event.
     *
     * @returns {Observable<any>}
     */
    on(eventName: string): Observable<any>;
    /**
     * Listen to a map event only once.
     *
     * @returns {Promise<any>}
     */
    one(eventName: string): Promise<any>;
    /**
     * Clears all stored values
     */
    empty(): void;
    getPoints(): Array<GoogleMapsLatLng>;
    getStrokeColor(): string;
    getFillColor(): string;
    getStrokeWidth(): number;
    getGeodesic(): boolean;
    getVisible(): boolean;
    getZIndex(): boolean;
    remove(): void;
    setPoints(points: Array<GoogleMapsLatLng>): void;
    setStrokeColor(strokeColor: string): void;
    setFillColor(fillColor: string): void;
    setStrokeWidth(strokeWidth: number): void;
    setVisible(visible: boolean): void;
    setZIndex(zIndex: number): void;
    setGeodesic(geodesic: boolean): void;
}
/**
 * @private
 */
export interface GoogleMapsTileOverlayOptions {
    tileUrlFormat?: string;
    visible?: boolean;
    zIndex?: number;
    tileSize?: number;
    opacity?: number;
}
/**
 * @private
 */
export declare class GoogleMapsTileOverlay {
    private _objectInstance;
    constructor(_objectInstance: any);
    /**
     * Adds an event listener.
     *
     * @returns {Observable<any>}
     */
    addEventListener(eventName: string): Observable<any>;
    /**
     * Adds an event listener that works once.
     *
     * @returns {Promise<any>}
     */
    addListenerOnce(eventName: string): Promise<any>;
    /**
     * Gets a value
     * @param key
     */
    get(key: string): any;
    /**
     * Sets a value
     * @param key
     * @param value
     */
    set(key: string, value: any): void;
    /**
     * Listen to a map event.
     *
     * @returns {Observable<any>}
     */
    on(eventName: string): Observable<any>;
    /**
     * Listen to a map event only once.
     *
     * @returns {Promise<any>}
     */
    one(eventName: string): Promise<any>;
    /**
     * Clears all stored values
     */
    empty(): void;
    getVisible(): boolean;
    setVisible(visible: boolean): void;
    getFadeIn(): boolean;
    setFadeIn(fadeIn: boolean): void;
    getZIndex(): number;
    setZIndex(zIndex: number): void;
    getOpacity(): number;
    setOpacity(opacity: number): void;
    clearTileCache(): void;
    remove(): void;
}
/**
 * @private
 */
export interface GoogleMapsGroundOverlayOptions {
    url?: string;
    bounds?: Array<GoogleMapsLatLng>;
    visible?: boolean;
    opacity?: number;
    bearing?: number;
    zIndex?: number;
}
/**
 * @private
 */
export declare class GoogleMapsGroundOverlay {
    private _objectInstance;
    constructor(_objectInstance: any);
    /**
     * Adds an event listener.
     *
     * @returns {Observable<any>}
     */
    addEventListener(eventName: string): Observable<any>;
    /**
     * Adds an event listener that works once.
     *
     * @returns {Promise<any>}
     */
    addListenerOnce(eventName: string): Promise<any>;
    /**
     * Gets a value
     * @param key
     */
    get(key: string): any;
    /**
     * Sets a value
     * @param key
     * @param value
     */
    set(key: string, value: any): void;
    /**
     * Listen to a map event.
     *
     * @returns {Observable<any>}
     */
    on(eventName: string): Observable<any>;
    /**
     * Listen to a map event only once.
     *
     * @returns {Promise<any>}
     */
    one(eventName: string): Promise<any>;
    /**
     * Clears all stored values
     */
    empty(): void;
    setBearing(bearing: number): void;
    getBearing(): number;
    setOpacity(opacity: number): void;
    getOpacity(): number;
    setVisible(visible: boolean): void;
    getVisible(): boolean;
    setImage(image: string): void;
    remove(): void;
}
/**
 * @private
 */
export interface GoogleMapsKmlOverlayOptions {
    url?: string;
    preserveViewport?: boolean;
    animation?: boolean;
}
/**
 * @private
 */
export declare class GoogleMapsKmlOverlay {
    private _objectInstance;
    constructor(_objectInstance: any);
    /**
     * Adds an event listener.
     *
     * @returns {Observable<any>}
     */
    addEventListener(eventName: string): Observable<any>;
    /**
     * Adds an event listener that works once.
     *
     * @returns {Promise<any>}
     */
    addListenerOnce(eventName: string): Promise<any>;
    /**
     * Gets a value
     * @param key
     */
    get(key: string): any;
    /**
     * Sets a value
     * @param key
     * @param value
     */
    set(key: string, value: any): void;
    /**
     * Listen to a map event.
     *
     * @returns {Observable<any>}
     */
    on(eventName: string): Observable<any>;
    /**
     * Listen to a map event only once.
     *
     * @returns {Promise<any>}
     */
    one(eventName: string): Promise<any>;
    /**
     * Clears all stored values
     */
    empty(): void;
    remove(): void;
    getOverlays(): Array<GoogleMapsPolyline | GoogleMapsPolygon | GoogleMapsMarker>;
}
/**
 * @private
 */
export declare class GoogleMapsLatLngBounds {
    private _objectInstance;
    northeast: GoogleMapsLatLng;
    southwest: GoogleMapsLatLng;
    type: string;
    constructor(southwestOrArrayOfLatLng: GoogleMapsLatLng | GoogleMapsLatLng[], northeast?: GoogleMapsLatLng);
    toString(): string;
    toUrlValue(precision?: number): string;
    extend(LatLng: GoogleMapsLatLng): void;
    contains(LatLng: GoogleMapsLatLng): boolean;
    getCenter(): GoogleMapsLatLng;
}
/**
 * @private
 */
export declare class GoogleMapsLatLng {
    lat: number;
    lng: number;
    constructor(lat: number, lng: number);
    equals(other: GoogleMapsLatLng): boolean;
    toString(): string;
    toUrlValue(precision?: number): string;
}
/**
 * @private
 */
export interface GeocoderRequest {
    address?: string;
    bounds?: GoogleMapsLatLng[];
    position?: {
        lat: number;
        lng: number;
    };
}
/**
 * @private
 */
export interface GeocoderResult {
    adminArea?: string;
    country?: string;
    countryCode?: string;
    extra?: {
        featureName?: string;
        lines?: Array<string>;
        permises?: string;
        phone?: string;
        url?: string;
    };
    locale?: string;
    locality?: string;
    position?: {
        lat: number;
        lng: number;
    };
    postalCode?: string;
    subAdminArea?: string;
    subLocality?: string;
    subThoroughfare?: string;
    thoroughfare?: string;
}
/**
 * @private
 */
export declare class Geocoder {
    /**
     * Converts position to address and vice versa
     * @param {GeocoderRequest} request Request object with either an address or a position
     * @returns {Promise<GeocoderResult[]>}
     */
    static geocode(request: GeocoderRequest): Promise<GeocoderResult[] | any>;
}
