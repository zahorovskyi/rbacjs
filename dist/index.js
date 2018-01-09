(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["rbac"] = factory();
	else
		root["rbac"] = factory();
})(typeof self !== 'undefined' ? self : this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
var RBAC = (function () {
    function RBAC(options) {
        this.users = {};
        this.permissions = {};
        this.quietError = options.quietError || false;
        this.permissions = options.rolesConfig.reduce(function (accumulator, item) {
            for (var i = 0; i < item.roles.length; i++) {
                accumulator[item.roles[i]] = item.permissions;
            }
            return accumulator;
        }, {});
    }
    RBAC.prototype.generateError = function (msg) {
        if (!this.quietError) {
            console.warn(msg);
        }
        return new Error(msg);
    };
    RBAC.prototype.getUserRoles = function (userId) {
        if (typeof userId === 'undefined') {
            return this.generateError('userId is not defined, expected 1 arguments');
        }
        if (typeof this.users[userId] !== 'undefined') {
            return this.users[userId].roles;
        }
        else {
            return this.generateError(userId + ' userId is nor defined, please add user to the rbac using addUserRoles method');
        }
    };
    RBAC.prototype.addUserRoles = function (userId, roles) {
        var _this = this;
        if (typeof userId === 'undefined' || typeof roles === 'undefined' || roles.length === 0) {
            return this.generateError('userId or roles is not defined, or roles.length === 0, expected 2 arguments');
        }
        return roles.map(function (role) {
            if (typeof _this.permissions[role] !== 'undefined') {
                if (_this.users[userId]) {
                    _this.users[userId].roles.push(role);
                }
                else {
                    _this.users[userId] = {
                        roles: [role]
                    };
                }
            }
            else {
                return _this.generateError(role + ' role is not defined in intial config');
            }
        });
    };
    RBAC.prototype.isAllowed = function (userId, permissionId) {
        var _this = this;
        if (typeof userId === 'undefined' || typeof permissionId === 'undefined') {
            return this.generateError('userId or permissionId is not defined, expected 2 arguments');
        }
        var user = this.users[userId];
        if (typeof user !== 'undefined') {
            return user.roles.some(function (userRole) { return _this.permissions[userRole].includes(permissionId); });
        }
        else {
            return this.generateError(userId + ' userId is nor defined, please add user to the rbac using addUserRoles method');
        }
    };
    RBAC.prototype.extendRole = function (role, extendingRoles) {
        var _this = this;
        if (typeof role === 'undefined' || typeof extendingRoles === 'undefined' || extendingRoles.length === 0) {
            return this.generateError('role or extendingRoles is not defined, expected 2 arguments');
        }
        if (typeof this.permissions[role] !== 'undefined') {
            return extendingRoles.map(function (extendingRole) {
                if (_this.permissions[extendingRole]) {
                    _this.permissions[role] = _this.permissions[role]
                        .concat(_this.permissions[extendingRole]);
                }
                else {
                    return _this.generateError(role + ' role is not defined in initial config');
                }
            });
        }
        else {
            return this.generateError(role + ' role is not defined in initial config');
        }
    };
    RBAC.prototype.middleware = function (params, error, success) {
        if (typeof params === 'undefined' ||
            typeof error === 'undefined' ||
            typeof success === 'undefined') {
            error();
            return this.generateError('one of incoming parameters is not defined, expected 3 arguments');
        }
        if (this.isAllowed(params.userId, params.permissionId)) {
            success();
        }
        else {
            error();
        }
    };
    return RBAC;
}());
exports["default"] = RBAC;


/***/ })
/******/ ]);
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCBhMDk4ZDJjYzk0MmQwYjI3OTVkMiIsIndlYnBhY2s6Ly8vLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNELE87QUNWQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhEQUFzRCwrREFBK0Q7O0FBRXJIO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7OztBQzdCQTtJQUtJLGNBQVksT0FBaUI7UUFKckIsVUFBSyxHQUFXLEVBQUUsQ0FBQztRQUVuQixnQkFBVyxHQUFpQixFQUFFLENBQUM7UUFHbkMsSUFBSSxDQUFDLFVBQVUsR0FBRyxPQUFPLENBQUMsVUFBVSxJQUFJLEtBQUssQ0FBQztRQUU5QyxJQUFJLENBQUMsV0FBVyxHQUFHLE9BQU8sQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUN6QyxVQUFDLFdBQWdCLEVBQUUsSUFBa0I7WUFDakMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO2dCQUN6QyxXQUFXLENBQUMsSUFBSSxDQUFD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QUFDO1FBQ1AsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ0osTUFBTSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxHQUFHLHdDQUF3QyxDQUFDLENBQUM7UUFDL0UsQ0FBQztJQUNMLENBQUM7SUFFTSx5QkFBVSxHQUFqQixVQUFrQixNQUFpRCxFQUFFLEtBQWlCLEVBQUUsT0FBbUI7UUFDdkcsRUFBRSxDQUFDLENBQUMsT0FBTyxNQUFNLEtBQUssV0FBVztZQUM3QixPQUFPLEtBQUssS0FBSyxXQUFXO1lBQzVCLE9BQU8sT0FBTyxLQUFLLFdBQ3ZCLENBQUMsQ0FBQyxDQUFDO1lBQ0MsS0FBSyxFQUFFLENBQUM7WUFDUixNQUFNLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxpRUFBaUUsQ0FBQyxDQUFDO1FBQ2pHLENBQUM7UUFFRCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNyRCxPQUFPLEVBQUUsQ0FBQztRQUNkLENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNKLEtBQUssRUFBRSxDQUFDO1FBQ1osQ0FBQztJQUNMLENBQUM7SUFDTCxXQUFDO0FBQUQsQ0FBQztBQUVELHFCQUFlLElBQUksQ0FBQyIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiB3ZWJwYWNrVW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbihyb290LCBmYWN0b3J5KSB7XG5cdGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0Jylcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcblx0ZWxzZSBpZih0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpXG5cdFx0ZGVmaW5lKFtdLCBmYWN0b3J5KTtcblx0ZWxzZSBpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpXG5cdFx0ZXhwb3J0c1tcInJiYWNcIl0gPSBmYWN0b3J5KCk7XG5cdGVsc2Vcblx0XHRyb290W1wicmJhY1wiXSA9IGZhY3RvcnkoKTtcbn0pKHR5cGVvZiBzZWxmICE9PSAndW5kZWZpbmVkJyA/IHNlbGYgOiB0aGlzLCBmdW5jdGlvbigpIHtcbnJldHVybiBcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gMCk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgYTA5OGQyY2M5NDJkMGIyNzk1ZDIiLCJpbnRlcmZhY2UgSVVzZXJzIHtcbiAgICBbdXNlcklkOiBzdHJpbmddOiB7XG4gICAgICAgIHJvbGVzOiBzdHJpbmdbXVxuICAgIH1cbn1cblxuaW50ZXJmYWNlIElQZXJtaXNzaW9ucyB7XG4gICAgW3Blcm1pc3Npb25JZDogc3RyaW5nXTogc3RyaW5nW107XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgSVJvbGVzQ29uZmlnIHtcbiAgICByb2xlczogc3RyaW5nW10sXG4gICAgcGVybWlzc2lvbnM6IHN0cmluZ1tdXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgSU1pZGRsZXdhcmUge1xuICAgIChwYXJhbXM6IHsgdXNlcklkOiBzdHJpbmc7IHBlcm1pc3Npb25JZDogc3RyaW5nOyB9LCBlcnJvcjogKCkgPT4gdm9pZCwgc3VjY2VzczogKCkgPT4gdm9pZCk6IHZvaWQgfCBFcnJvcjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBJUkJBQyB7XG4gICAgZ2V0VXNlclJvbGVzOiAodXNlcklkOiBzdHJpbmcpID0+IHN0cmluZ1tdIHwgRXJyb3I7XG4gICAgYWRkVXNlclJvbGVzOiAodXNlcklkOiBzdHJpbmcsIHJvbGU6IHN0cmluZ1tdKSA9PiB2b2lkIHwgRXJyb3IgfCBFcnJvcltdO1xuICAgIGlzQWxsb3dlZDogKHVzZXJJZDogc3RyaW5nLCBwZXJtaXNzaW9uSWQ6IHN0cmluZykgPT4gYm9vbGVhbiB8IEVycm9yO1xuICAgIGV4dGVuZFJvbGU6IChyb2xlOiBzdHJpbmcsIGV4dGVuZGluZ1JvbGVzOiBzdHJpbmdbXSkgPT4gdm9pZCB8IEVycm9yIHwgRXJyb3JbXTtcbiAgICBtaWRkbGV3YXJlOiBJTWlkZGxld2FyZTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBJT3B0aW9ucyB7XG4gICAgcm9sZXNDb25maWc6IElSb2xlc0NvbmZpZ1tdO1xuICAgIHF1aWV0RXJyb3I/OiBib29sZWFuO1xufVxuXG5jbGFzcyBSQkFDIGltcGxlbWVudHMgSVJCQUMge1xuICAgIHByaXZhdGUgdXNlcnM6IElVc2VycyA9IHt9O1xuICAgIHByaXZhdGUgcXVpZXRFcnJvcjogYm9vbGVhbjtcbiAgICBwcml2YXRlIHBlcm1pc3Npb25zOiBJUGVybWlzc2lvbnMgPSB7fTtcblxuICAgIGNvbnN0cnVjdG9yKG9wdGlvbnM6IElPcHRpb25zKSB7XG4gICAgICAgIHRoaXMucXVpZXRFcnJvciA9IG9wdGlvbnMucXVpZXRFcnJvciB8fCBmYWxzZTtcblxuICAgICAgICB0aGlzLnBlcm1pc3Npb25zID0gb3B0aW9ucy5yb2xlc0NvbmZpZy5yZWR1Y2UoXG4gICAgICAgICAgICAoYWNjdW11bGF0b3I6IGFueSwgaXRlbTogSVJvbGVzQ29uZmlnKSA9PiB7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBpdGVtLnJvbGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGFjY3VtdWxhdG9yW2l0ZW0ucm9sZXNbaV1dID0gaXRlbS5wZXJtaXNzaW9ucztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIGFjY3VtdWxhdG9yO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHt9XG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZW5lcmF0ZUVycm9yKG1zZzogYW55KSB7XG4gICAgICAgIGlmICghdGhpcy5xdWlldEVycm9yKSB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4obXNnKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3IEVycm9yKG1zZyk7XG4gICAgfVxuXG4gICAgcHVibGljIGdldFVzZXJSb2xlcyh1c2VySWQ6IHN0cmluZykge1xuICAgICAgICBpZiAodHlwZW9mIHVzZXJJZCA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmdlbmVyYXRlRXJyb3IoJ3VzZXJJZCBpcyBub3QgZGVmaW5lZCwgZXhwZWN0ZWQgMSBhcmd1bWVudHMnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0eXBlb2YgdGhpcy51c2Vyc1t1c2VySWRdICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudXNlcnNbdXNlcklkXS5yb2xlcztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmdlbmVyYXRlRXJyb3IodXNlcklkICsgJyB1c2VySWQgaXMgbm9yIGRlZmluZWQsIHBsZWFzZSBhZGQgdXNlciB0byB0aGUgcmJhYyB1c2luZyBhZGRVc2VyUm9sZXMgbWV0aG9kJyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgYWRkVXNlclJvbGVzKHVzZXJJZDogc3RyaW5nLCByb2xlczogc3RyaW5nW10pIHtcbiAgICAgICAgaWYgKHR5cGVvZiB1c2VySWQgPT09ICd1bmRlZmluZWQnIHx8IHR5cGVvZiByb2xlcyA9PT0gJ3VuZGVmaW5lZCcgfHwgcm9sZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5nZW5lcmF0ZUVycm9yKCd1c2VySWQgb3Igcm9sZXMgaXMgbm90IGRlZmluZWQsIG9yIHJvbGVzLmxlbmd0aCA9PT0gMCwgZXhwZWN0ZWQgMiBhcmd1bWVudHMnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByb2xlcy5tYXAocm9sZSA9PiB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIHRoaXMucGVybWlzc2lvbnNbcm9sZV0gIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMudXNlcnNbdXNlcklkXSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnVzZXJzW3VzZXJJZF0ucm9sZXMucHVzaChyb2xlKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnVzZXJzW3VzZXJJZF0gPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByb2xlczogW3JvbGVdXG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5nZW5lcmF0ZUVycm9yKHJvbGUgKyAnIHJvbGUgaXMgbm90IGRlZmluZWQgaW4gaW50aWFsIGNvbmZpZycpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgaXNBbGxvd2VkKHVzZXJJZDogc3RyaW5nLCBwZXJtaXNzaW9uSWQ6IHN0cmluZykge1xuICAgICAgICBpZiAodHlwZW9mIHVzZXJJZCA9PT0gJ3VuZGVmaW5lZCcgfHwgdHlwZW9mIHBlcm1pc3Npb25JZCA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmdlbmVyYXRlRXJyb3IoJ3VzZXJJZCBvciBwZXJtaXNzaW9uSWQgaXMgbm90IGRlZmluZWQsIGV4cGVjdGVkIDIgYXJndW1lbnRzJyk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCB1c2VyID0gdGhpcy51c2Vyc1t1c2VySWRdO1xuXG4gICAgICAgIGlmICh0eXBlb2YgdXNlciAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIHJldHVybiB1c2VyLnJvbGVzLnNvbWUodXNlclJvbGUgPT4gdGhpcy5wZXJtaXNzaW9uc1t1c2VyUm9sZV0uaW5jbHVkZXMocGVybWlzc2lvbklkKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5nZW5lcmF0ZUVycm9yKHVzZXJJZCArICcgdXNlcklkIGlzIG5vciBkZWZpbmVkLCBwbGVhc2UgYWRkIHVzZXIgdG8gdGhlIHJiYWMgdXNpbmcgYWRkVXNlclJvbGVzIG1ldGhvZCcpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIGV4dGVuZFJvbGUocm9sZTogc3RyaW5nLCBleHRlbmRpbmdSb2xlczogc3RyaW5nW10pIHtcbiAgICAgICAgaWYgKHR5cGVvZiByb2xlID09PSAndW5kZWZpbmVkJyB8fCB0eXBlb2YgZXh0ZW5kaW5nUm9sZXMgPT09ICd1bmRlZmluZWQnIHx8IGV4dGVuZGluZ1JvbGVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2VuZXJhdGVFcnJvcigncm9sZSBvciBleHRlbmRpbmdSb2xlcyBpcyBub3QgZGVmaW5lZCwgZXhwZWN0ZWQgMiBhcmd1bWVudHMnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0eXBlb2YgdGhpcy5wZXJtaXNzaW9uc1tyb2xlXSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIHJldHVybiBleHRlbmRpbmdSb2xlcy5tYXAoZXh0ZW5kaW5nUm9sZSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMucGVybWlzc2lvbnNbZXh0ZW5kaW5nUm9sZV0pIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wZXJtaXNzaW9uc1tyb2xlXSA9IHRoaXMucGVybWlzc2lvbnNbcm9sZV1cbiAgICAgICAgICAgICAgICAgICAgICAgIC5jb25jYXQodGhpcy5wZXJtaXNzaW9uc1tleHRlbmRpbmdSb2xlXSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2VuZXJhdGVFcnJvcihyb2xlICsgJyByb2xlIGlzIG5vdCBkZWZpbmVkIGluIGluaXRpYWwgY29uZmlnJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5nZW5lcmF0ZUVycm9yKHJvbGUgKyAnIHJvbGUgaXMgbm90IGRlZmluZWQgaW4gaW5pdGlhbCBjb25maWcnKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBtaWRkbGV3YXJlKHBhcmFtczogeyB1c2VySWQ6IHN0cmluZzsgcGVybWlzc2lvbklkOiBzdHJpbmc7IH0sIGVycm9yOiAoKSA9PiB2b2lkLCBzdWNjZXNzOiAoKSA9PiB2b2lkKSB7XG4gICAgICAgIGlmICh0eXBlb2YgcGFyYW1zID09PSAndW5kZWZpbmVkJyB8fFxuICAgICAgICAgICAgdHlwZW9mIGVycm9yID09PSAndW5kZWZpbmVkJyB8fFxuICAgICAgICAgICAgdHlwZW9mIHN1Y2Nlc3MgPT09ICd1bmRlZmluZWQnXG4gICAgICAgICkge1xuICAgICAgICAgICAgZXJyb3IoKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmdlbmVyYXRlRXJyb3IoJ29uZSBvZiBpbmNvbWluZyBwYXJhbWV0ZXJzIGlzIG5vdCBkZWZpbmVkLCBleHBlY3RlZCAzIGFyZ3VtZW50cycpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuaXNBbGxvd2VkKHBhcmFtcy51c2VySWQsIHBhcmFtcy5wZXJtaXNzaW9uSWQpKSB7XG4gICAgICAgICAgICBzdWNjZXNzKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBlcnJvcigpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBSQkFDO1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9pbmRleC50cyJdLCJzb3VyY2VSb290IjoiIn0=