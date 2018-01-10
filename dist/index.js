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
        this.debug = (typeof options.debug === 'undefined') ? true : options.debug;
        this.permissions = options.rolesConfig.reduce(function (accumulator, item) {
            for (var i = 0; i < item.roles.length; i++) {
                accumulator[item.roles[i]] = item.permissions;
            }
            return accumulator;
        }, {});
    }
    RBAC.prototype.generateError = function (msg) {
        if (this.debug) {
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
        if (typeof userId === 'undefined' || typeof roles === 'undefined' || roles.length === 0) {
            return this.generateError('userId or roles is not defined, or roles.length === 0, expected 2 arguments');
        }
        for (var i = 0; i < roles.length; i++) {
            if (typeof this.permissions[roles[i]] !== 'undefined') {
                if (this.users[userId]) {
                    if (!this.users[userId].roles.includes(roles[i])) {
                        this.users[userId].roles.push(roles[i]);
                    }
                }
                else {
                    this.users[userId] = {
                        roles: [roles[i]]
                    };
                }
            }
            else {
                return this.generateError(roles[i] + ' role is not defined in intial config');
            }
        }
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
        if (typeof role === 'undefined' || typeof extendingRoles === 'undefined' || extendingRoles.length === 0) {
            return this.generateError('role or extendingRoles is not defined, expected 2 arguments');
        }
        if (typeof this.permissions[role] !== 'undefined') {
            for (var i = 0; i < extendingRoles.length; i++) {
                if (this.permissions[extendingRoles[i]]) {
                    this.permissions[role] = this.permissions[role]
                        .concat(this.permissions[extendingRoles[i]]);
                }
                else {
                    return this.generateError(role + ' role is not defined in initial config');
                }
            }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCAwMDVmZTBjZjZiNGUwMWE2MjY2YyIsIndlYnBhY2s6Ly8vLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNELE87QUNWQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhEQUFzRCwrREFBK0Q7O0FBRXJIO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7OztBQzNCQTtJQUtJLGNBQVksT0FBaUI7UUFKckIsVUFBSyxHQUFXLEVBQUUsQ0FBQztRQUVuQixnQkFBVyxHQUFpQixFQUFFLENBQUM7UUFHbkMsSUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLE9BQU8sT0FBTyxDQUFDLEtBQUssS0FBSyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQztRQUUxRSxJQUFJLENBQUMsV0FBVyxHQUFHLE9BQU8sQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUN6QyxVQUFDLFdBQWdCLEVBQUUsSUFBa0I7WUFDakMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxD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LENBQUM7QUFFRCxxQkFBZSxJQUFJLENBQUMiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gd2VicGFja1VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24ocm9vdCwgZmFjdG9yeSkge1xuXHRpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG5cdGVsc2UgaWYodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKVxuXHRcdGRlZmluZShbXSwgZmFjdG9yeSk7XG5cdGVsc2UgaWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKVxuXHRcdGV4cG9ydHNbXCJyYmFjXCJdID0gZmFjdG9yeSgpO1xuXHRlbHNlXG5cdFx0cm9vdFtcInJiYWNcIl0gPSBmYWN0b3J5KCk7XG59KSh0eXBlb2Ygc2VsZiAhPT0gJ3VuZGVmaW5lZCcgPyBzZWxmIDogdGhpcywgZnVuY3Rpb24oKSB7XG5yZXR1cm4gXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svdW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbiIsIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwge1xuIFx0XHRcdFx0Y29uZmlndXJhYmxlOiBmYWxzZSxcbiBcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXG4gXHRcdFx0XHRnZXQ6IGdldHRlclxuIFx0XHRcdH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IDApO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIDAwNWZlMGNmNmI0ZTAxYTYyNjZjIiwiaW1wb3J0IHsgdHlwZSB9IGZyb20gXCJvc1wiO1xuXG5pbnRlcmZhY2UgSVVzZXJzIHtcbiAgICBbdXNlcklkOiBzdHJpbmddOiB7XG4gICAgICAgIHJvbGVzOiBzdHJpbmdbXVxuICAgIH1cbn1cblxuaW50ZXJmYWNlIElQZXJtaXNzaW9ucyB7XG4gICAgW3Blcm1pc3Npb25JZDogc3RyaW5nXTogc3RyaW5nW107XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgSVJvbGVzQ29uZmlnIHtcbiAgICByb2xlczogc3RyaW5nW10sXG4gICAgcGVybWlzc2lvbnM6IHN0cmluZ1tdXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgSU1pZGRsZXdhcmUge1xuICAgIChwYXJhbXM6IHsgdXNlcklkOiBzdHJpbmc7IHBlcm1pc3Npb25JZDogc3RyaW5nOyB9LCBlcnJvcjogKCkgPT4gdm9pZCwgc3VjY2VzczogKCkgPT4gdm9pZCk6IHZvaWQgfCBFcnJvcjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBJUkJBQyB7XG4gICAgZ2V0VXNlclJvbGVzOiAodXNlcklkOiBzdHJpbmcpID0+IHN0cmluZ1tdIHwgRXJyb3I7XG4gICAgYWRkVXNlclJvbGVzOiAodXNlcklkOiBzdHJpbmcsIHJvbGU6IHN0cmluZ1tdKSA9PiB2b2lkIHwgRXJyb3I7XG4gICAgaXNBbGxvd2VkOiAodXNlcklkOiBzdHJpbmcsIHBlcm1pc3Npb25JZDogc3RyaW5nKSA9PiBib29sZWFuIHwgRXJyb3I7XG4gICAgZXh0ZW5kUm9sZTogKHJvbGU6IHN0cmluZywgZXh0ZW5kaW5nUm9sZXM6IHN0cmluZ1tdKSA9PiB2b2lkIHwgRXJyb3I7XG4gICAgbWlkZGxld2FyZTogSU1pZGRsZXdhcmU7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgSU9wdGlvbnMge1xuICAgIHJvbGVzQ29uZmlnOiBJUm9sZXNDb25maWdbXTtcbiAgICBkZWJ1Zz86IGJvb2xlYW47XG59XG5cbmNsYXNzIFJCQUMgaW1wbGVtZW50cyBJUkJBQyB7XG4gICAgcHJpdmF0ZSB1c2VyczogSVVzZXJzID0ge307XG4gICAgcHJpdmF0ZSBkZWJ1ZzogYm9vbGVhbjtcbiAgICBwcml2YXRlIHBlcm1pc3Npb25zOiBJUGVybWlzc2lvbnMgPSB7fTtcblxuICAgIGNvbnN0cnVjdG9yKG9wdGlvbnM6IElPcHRpb25zKSB7XG4gICAgICAgIHRoaXMuZGVidWcgPSAodHlwZW9mIG9wdGlvbnMuZGVidWcgPT09ICd1bmRlZmluZWQnKSA/IHRydWU6IG9wdGlvbnMuZGVidWc7XG5cbiAgICAgICAgdGhpcy5wZXJtaXNzaW9ucyA9IG9wdGlvbnMucm9sZXNDb25maWcucmVkdWNlKFxuICAgICAgICAgICAgKGFjY3VtdWxhdG9yOiBhbnksIGl0ZW06IElSb2xlc0NvbmZpZykgPT4ge1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaXRlbS5yb2xlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBhY2N1bXVsYXRvcltpdGVtLnJvbGVzW2ldXSA9IGl0ZW0ucGVybWlzc2lvbnM7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBhY2N1bXVsYXRvcjtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7fVxuICAgICAgICApO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2VuZXJhdGVFcnJvcihtc2c6IGFueSkge1xuICAgICAgICBpZiAodGhpcy5kZWJ1Zykge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKG1zZyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ldyBFcnJvcihtc2cpO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXRVc2VyUm9sZXModXNlcklkOiBzdHJpbmcpIHtcbiAgICAgICAgaWYgKHR5cGVvZiB1c2VySWQgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5nZW5lcmF0ZUVycm9yKCd1c2VySWQgaXMgbm90IGRlZmluZWQsIGV4cGVjdGVkIDEgYXJndW1lbnRzJyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodHlwZW9mIHRoaXMudXNlcnNbdXNlcklkXSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnVzZXJzW3VzZXJJZF0ucm9sZXM7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5nZW5lcmF0ZUVycm9yKHVzZXJJZCArICcgdXNlcklkIGlzIG5vciBkZWZpbmVkLCBwbGVhc2UgYWRkIHVzZXIgdG8gdGhlIHJiYWMgdXNpbmcgYWRkVXNlclJvbGVzIG1ldGhvZCcpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIGFkZFVzZXJSb2xlcyh1c2VySWQ6IHN0cmluZywgcm9sZXM6IHN0cmluZ1tdKSB7XG4gICAgICAgIGlmICh0eXBlb2YgdXNlcklkID09PSAndW5kZWZpbmVkJyB8fCB0eXBlb2Ygcm9sZXMgPT09ICd1bmRlZmluZWQnIHx8IHJvbGVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2VuZXJhdGVFcnJvcigndXNlcklkIG9yIHJvbGVzIGlzIG5vdCBkZWZpbmVkLCBvciByb2xlcy5sZW5ndGggPT09IDAsIGV4cGVjdGVkIDIgYXJndW1lbnRzJyk7XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHJvbGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIHRoaXMucGVybWlzc2lvbnNbcm9sZXNbaV1dICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLnVzZXJzW3VzZXJJZF0pIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCF0aGlzLnVzZXJzW3VzZXJJZF0ucm9sZXMuaW5jbHVkZXMocm9sZXNbaV0pKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnVzZXJzW3VzZXJJZF0ucm9sZXMucHVzaChyb2xlc1tpXSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnVzZXJzW3VzZXJJZF0gPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByb2xlczogW3JvbGVzW2ldXVxuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2VuZXJhdGVFcnJvcihyb2xlc1tpXSArICcgcm9sZSBpcyBub3QgZGVmaW5lZCBpbiBpbnRpYWwgY29uZmlnJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgaXNBbGxvd2VkKHVzZXJJZDogc3RyaW5nLCBwZXJtaXNzaW9uSWQ6IHN0cmluZykge1xuICAgICAgICBpZiAodHlwZW9mIHVzZXJJZCA9PT0gJ3VuZGVmaW5lZCcgfHwgdHlwZW9mIHBlcm1pc3Npb25JZCA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmdlbmVyYXRlRXJyb3IoJ3VzZXJJZCBvciBwZXJtaXNzaW9uSWQgaXMgbm90IGRlZmluZWQsIGV4cGVjdGVkIDIgYXJndW1lbnRzJyk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCB1c2VyID0gdGhpcy51c2Vyc1t1c2VySWRdO1xuXG4gICAgICAgIGlmICh0eXBlb2YgdXNlciAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIHJldHVybiB1c2VyLnJvbGVzLnNvbWUodXNlclJvbGUgPT4gdGhpcy5wZXJtaXNzaW9uc1t1c2VyUm9sZV0uaW5jbHVkZXMocGVybWlzc2lvbklkKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5nZW5lcmF0ZUVycm9yKHVzZXJJZCArICcgdXNlcklkIGlzIG5vciBkZWZpbmVkLCBwbGVhc2UgYWRkIHVzZXIgdG8gdGhlIHJiYWMgdXNpbmcgYWRkVXNlclJvbGVzIG1ldGhvZCcpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIGV4dGVuZFJvbGUocm9sZTogc3RyaW5nLCBleHRlbmRpbmdSb2xlczogc3RyaW5nW10pIHtcbiAgICAgICAgaWYgKHR5cGVvZiByb2xlID09PSAndW5kZWZpbmVkJyB8fCB0eXBlb2YgZXh0ZW5kaW5nUm9sZXMgPT09ICd1bmRlZmluZWQnIHx8IGV4dGVuZGluZ1JvbGVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2VuZXJhdGVFcnJvcigncm9sZSBvciBleHRlbmRpbmdSb2xlcyBpcyBub3QgZGVmaW5lZCwgZXhwZWN0ZWQgMiBhcmd1bWVudHMnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0eXBlb2YgdGhpcy5wZXJtaXNzaW9uc1tyb2xlXSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZXh0ZW5kaW5nUm9sZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5wZXJtaXNzaW9uc1tleHRlbmRpbmdSb2xlc1tpXV0pIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wZXJtaXNzaW9uc1tyb2xlXSA9IHRoaXMucGVybWlzc2lvbnNbcm9sZV1cbiAgICAgICAgICAgICAgICAgICAgICAgIC5jb25jYXQodGhpcy5wZXJtaXNzaW9uc1tleHRlbmRpbmdSb2xlc1tpXV0pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmdlbmVyYXRlRXJyb3Iocm9sZSArICcgcm9sZSBpcyBub3QgZGVmaW5lZCBpbiBpbml0aWFsIGNvbmZpZycpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmdlbmVyYXRlRXJyb3Iocm9sZSArICcgcm9sZSBpcyBub3QgZGVmaW5lZCBpbiBpbml0aWFsIGNvbmZpZycpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIG1pZGRsZXdhcmUocGFyYW1zOiB7IHVzZXJJZDogc3RyaW5nOyBwZXJtaXNzaW9uSWQ6IHN0cmluZzsgfSwgZXJyb3I6ICgpID0+IHZvaWQsIHN1Y2Nlc3M6ICgpID0+IHZvaWQpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBwYXJhbXMgPT09ICd1bmRlZmluZWQnIHx8XG4gICAgICAgICAgICB0eXBlb2YgZXJyb3IgPT09ICd1bmRlZmluZWQnIHx8XG4gICAgICAgICAgICB0eXBlb2Ygc3VjY2VzcyA9PT0gJ3VuZGVmaW5lZCdcbiAgICAgICAgKSB7XG4gICAgICAgICAgICBlcnJvcigpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2VuZXJhdGVFcnJvcignb25lIG9mIGluY29taW5nIHBhcmFtZXRlcnMgaXMgbm90IGRlZmluZWQsIGV4cGVjdGVkIDMgYXJndW1lbnRzJyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5pc0FsbG93ZWQocGFyYW1zLnVzZXJJZCwgcGFyYW1zLnBlcm1pc3Npb25JZCkpIHtcbiAgICAgICAgICAgIHN1Y2Nlc3MoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGVycm9yKCk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFJCQUM7XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2luZGV4LnRzIl0sInNvdXJjZVJvb3QiOiIifQ==