cordova.define("uk.co.workingedge.phonegap.plugin.launchnavigator.LaunchNavigator", function(require, exports, module) {
/*
 * Copyright (c) 2014 Dave Alden  (http://github.com/dpa99c)
 * Copyright (c) 2014 Working Edge Ltd. (http://www.workingedge.co.uk)
 *  
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 *  
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *  
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 *  
 */

var ln = {},
    common = launchnavigator;


/**
 * Determines if the given app is installed and available on the current device.
 * @param {string} appName - name of the app to check availability for. Define as a constant using ln.APP
 * @param {function} success - callback to invoke on successful determination of availability. Will be passed a single boolean argument indicating the availability of the app.
 * @param {function} error - callback to invoke on error while determining availability. Will be passed a single string argument containing the error message.
 */
ln.isAppAvailable = function(appName, success, error){
    common.util.validateApp(appName);
    cordova.exec(success, error, 'LaunchNavigator', 'isAppAvailable', [appName]);
};

/**
 * Returns a list indicating which apps are installed and available on the current device.
 * @param {function} success - callback to invoke on successful determination of availability. Will be passed a key/value object where the key is the app name and the value is a boolean indicating whether the app is available.
 * @param {function} error - callback to invoke on error while determining availability. Will be passed a single string argument containing the error message.
 */
ln.availableApps = function(success, error){
    cordova.exec(success, error, 'LaunchNavigator', 'availableApps', []);
};

/*********
 * v3 API
 *********/
ln.v3 = {};

/**
 * Opens navigator app to navigate to given destination, specified by either place name or lat/lon.
 * If a start location is not also specified, current location will be used for the start.
 *
 * @param {mixed} destination (required) - destination location to use for navigation.
 * Either:
 * - a {string} containing the address. e.g. "Buckingham Palace, London"
 * - an {array}, where the first element is the latitude and the second element is a longitude, as decimal numbers. e.g. [50.1, -4.0]
 *
 * @param {object} options (optional) - optional parameters:
 *
 * - {function} successCallback - A callback to invoke when the navigation app is successfully launched.
 *
 * - {function} errorCallback - A callback to invoke if an error is encountered while launching the app.
 * A single string argument containing the error message will be passed in.
 *
 * - {string} app - name of the navigation app to use for directions.
 * If not specified, defaults to User Selection.
 *
 * - {string} destinationName - nickname to display in app for destination. e.g. "Bob's House".
 *
 * - {mixed} start - start location to use for navigation. If not specified, the current location of the device will be used.
 * Either:
 *      - a {string} containing the address. e.g. "Buckingham Palace, London"
 *      - an {array}, where the first element is the latitude and the second element is a longitude, as decimal numbers. e.g. [50.1, -4.0]
 *
 * - {string} startName - nickname to display in app for start. e.g. "My Place".
 *
 * - {string} transportMode - transportation mode for navigation.
 * Defaults to "driving" if not specified.
 *
 * - {boolean} enableDebug - if true, debug log output will be generated by the plugin. Defaults to false.
 */
ln.v3.navigate = function(destination, options) {
    options = options ? options : {};

    options.app = options.app || common.APP.USER_SELECT;

    // If app is user-selection
    if(options.app == common.APP.USER_SELECT){
        // Invoke user-selection UI and return (as it will re-invoke this method)
        return common.userSelect(destination, options);
    }

    // Set defaults
    options.transportMode = options.transportMode ? options.transportMode : common.TRANSPORT_MODE.DRIVING;
    options.enableDebug = options.enableDebug ? !!options.enableDebug : false;

    // Input validation
    if(!destination){
        var errMsg = "No destination was specified";
        if(options.errorCallback){
            options.errorCallback(errMsg);
        }
        throw new Error(errMsg);
    }
    common.util.validateApp(options.app);
    common.util.validateTransportMode(options.transportMode);

    // Process options
    destination = common.util.extractCoordsFromLocationString(destination);
    if(typeof(destination) == "object"){
        destination = destination.join(",");
        options.destType = "coords";
    }else{
        options.destType = "name";
    }

    options.start = common.util.extractCoordsFromLocationString(options.start);
    if(!options.start){
        options.startType = "none";
    }else if(typeof(options.start) == "object"){
        options.start = options.start.join(",");
        options.startType = "coords";
    }else{
        options.startType = "name";
    }

    cordova.exec(options.successCallback, options.errorCallback, 'LaunchNavigator', 'navigate', [
        destination,
        options.destType,
        options.destinationName,
        options.start,
        options.startType,
        options.startName,
        options.app,
        options.transportMode,
        options.enableDebug
    ]);

};

/*********************************
 * v2 legacy API to map to v3 API
 *********************************/
ln.v2 = {};


/**
 * Opens navigator app to navigate to given destination, specified by either place name or lat/lon.
 * If a start location is not also specified, current location will be used for the start.
 *
 * @param {mixed} destination (required) - destination location to use for navigation.
 * Either:
 * - a {string} containing the place name. e.g. "London"
 * - an {array}, where the first element is the latitude and the second element is a longitude, as decimal numbers. e.g. [50.1, -4.0]
 * @param {mixed} start (optional) - start location to use for navigation. If not specified, the current location of the device will be used.
 * Either:
 * - a {string} containing the place name. e.g. "London"
 * - an {array}, where the first element is the latitude and the second element is a longitude, as decimal numbers. e.g. [50.1, -4.0]
 * @param {function} successCallback (optional) - A callback which will be called when plugin call is successful.
 * @param {function} errorCallback (optional) - A callback which will be called when plugin encounters an error.
 * This callback function have a string param with the error.
 * @param {object} options (optional) - platform-specific options:
 * {boolean} preferGoogleMaps - if true, plugin will attempt to launch Google Maps instead of Apple Maps. If Google Maps is not available, it will fall back to Apple Maps.
 * {boolean} disableAutoGeolocation - if TRUE, the plugin will NOT attempt to use the geolocation plugin to determine the current device position when the start location parameter is omitted. Defaults to FALSE.
 * {string} transportMode - transportation mode for navigation.
 * For Apple Maps, valid options are "driving" or "walking".
 * For Google Maps, valid options are "driving", "walking", "bicycling" or "transit".
 * Defaults to "driving" if not specified.
 * {string} urlScheme - if using Google Maps and the app has a URL scheme, passing this to Google Maps will display a button which returns to the app
 * {string} backButtonText - if using Google Maps with a URL scheme, this specifies the text of the button in Google Maps which returns to the app. Defaults to "Back" if not specified.
 * {boolean} enableDebug - if true, debug log output will be generated by the plugin. Defaults to false.
 */
ln.v2.navigate = function(destination, start, successCallback, errorCallback, options) {

    // Set defaults
    options = options ? options : {};
    options.preferGoogleMaps = options.preferGoogleMaps ? options.preferGoogleMaps : false;
    options.enableDebug = options.enableDebug ? options.enableDebug : false;

    console.warn("launchnavigator.navigate() called using deprecated v2 API signature. Please update to use v3 API signature as deprecated API support will be removed in a future version");

    // Map to and call v3 API
    ln.v3.navigate(destination, {
        successCallback: successCallback,
        errorCallback: errorCallback,
        app: options.preferGoogleMaps ? common.APP.GOOGLE_MAPS : common.APP.APPLE_MAPS,
        start: start,
        transportMode: options.transportMode,
        enableDebug: options.enableDebug
    });
};



/**
 * Checks if the Google Maps app is installed and available on an iOS device.
 *
 * @return {boolean} true if Google Maps is installed on the current device
 */
ln.v2.isGoogleMapsAvailable = function(successCallback) {
    console.warn("launchnavigator.isGoogleMapsAvailable() is a deprecated API method. Please update to use launchnavigator.isAppAvailable() as deprecated API support will be removed in a future version");
    ln.isAppAvailable(common.APP.GOOGLE_MAPS, successCallback);
};


/******************
 * Plugin interface
 ******************/

/**
 * Map directly to v2 API
 */
ln.isGoogleMapsAvailable = ln.v2.isGoogleMapsAvailable;


module.exports = ln;
});
