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
        this.permissions = {};
        this.users = {};
        this.permissions = options.rolesConfig.reduce(function (accumulator, item) {
            item.roles.map(function (role) {
                accumulator[role] = item.permissions;
            });
            return accumulator;
        }, {});
    }
    RBAC.prototype.generateError = function (msg) {
        throw new Error(msg);
    };
    RBAC.prototype.getUserRoles = function (userId) {
        if (typeof userId === 'undefined') {
            this.generateError('userId is not defined, expected 1 arguments');
        }
        if (typeof this.users[userId] !== 'undefined') {
            return this.users[userId].roles;
        }
        else {
            this.generateError(userId + ' userId is nor defined, please add user to the rbac using addUserRoles method');
        }
    };
    RBAC.prototype.addUserRoles = function (userId, roles) {
        var _this = this;
        if (typeof userId === 'undefined' || typeof roles === 'undefined' || roles.length === 0) {
            this.generateError('userId or roles is not defined, or roles.length === 0, expected 2 arguments');
        }
        roles.forEach(function (role) {
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
                _this.generateError(role + ' role is not defined in intial config');
            }
        });
    };
    RBAC.prototype.isAllowed = function (userId, permissionId) {
        var _this = this;
        if (typeof userId === 'undefined' || typeof permissionId === 'undefined') {
            this.generateError('userId or permissionId is not defined, expected 2 arguments');
        }
        var user = this.users[userId];
        if (typeof user !== 'undefined') {
            var userRoles = user.roles;
            var isAllowed_1 = false;
            userRoles.forEach(function (userRole) {
                if (_this.permissions[userRole].includes(permissionId)) {
                    isAllowed_1 = true;
                }
            });
            return isAllowed_1;
        }
        else {
            this.generateError(userId + ' userId is nor defined, please add user to the rbac using addUserRoles method');
        }
    };
    RBAC.prototype.extendRole = function (role, extendingRoles) {
        var _this = this;
        if (typeof role === 'undefined' || typeof extendingRoles === 'undefined' || extendingRoles.length === 0) {
            this.generateError('role or extendingRoles is not defined, expected 2 arguments');
        }
        if (typeof this.permissions[role] !== 'undefined') {
            extendingRoles.map(function (extendingRole) {
                if (_this.permissions[extendingRole]) {
                    _this.permissions[role] = _this.permissions[role]
                        .concat(_this.permissions[extendingRole]);
                }
                else {
                    _this.generateError(role + ' role is not defined in initial config');
                }
            });
        }
        else {
            this.generateError(role + ' role is not defined in initial config');
        }
    };
    RBAC.prototype.middleware = function (params, error, success) {
        if (typeof params === 'undefined' ||
            typeof error === 'undefined' ||
            typeof success === 'undefined') {
            this.generateError('one of incoming parameters is not defined, expected 3 arguments');
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCA4MWZmYWIyNTI4NDhmMTI2YWY3NSIsIndlYnBhY2s6Ly8vLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNELE87QUNWQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhEQUFzRCwrREFBK0Q7O0FBRXJIO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7QUM3RGE7O0FBaUNiO0lBSUksY0FBWSxPQUFpQjtRQUhyQixnQkFBVyxHQUFpQixFQUFFLENBQUM7UUFDL0IsVUFBSyxHQUFXLEVBQUUsQ0FBQztRQUd2QixJQUFJLENBQUMsV0FBVyxHQUFHLE9BQU8sQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUN6QyxVQUFDLFdBQWdCLEVBQUUsSUFBdUI7WUFDdEMsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsVUFBQyxJQUFZO2dCQUN4QixXQUFXLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQztZQUN6QyxDQUFDLENBQUMsQ0FBQztZQUNILE1BQU0sQ0FBQyxXQUFXLENBQUM7UUFDdkIsQ0FBQyxFQUNELEVBQUUsQ0FDTCxDQUFDO0lBQ04sQ0FB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QUssV0FBVztZQUM3QixPQUFPLEtBQUssS0FBSyxXQUFXO1lBQzVCLE9BQU8sT0FBTyxLQUFLLFdBQ3ZCLENBQUMsQ0FBQyxDQUFDO1lBQ0MsSUFBSSxDQUFDLGFBQWEsQ0FBQyxpRUFBaUUsQ0FBQztRQUN6RixDQUFDO1FBRUQsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDckQsT0FBTyxFQUFFLENBQUM7UUFDZCxDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDSixLQUFLLEVBQUUsQ0FBQztRQUNaLENBQUM7SUFDTCxDQUFDO0lBQ0wsV0FBQztBQUFELENBQUM7QUFFRCxxQkFBZSxJQUFJLENBQUMiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gd2VicGFja1VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24ocm9vdCwgZmFjdG9yeSkge1xuXHRpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG5cdGVsc2UgaWYodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKVxuXHRcdGRlZmluZShbXSwgZmFjdG9yeSk7XG5cdGVsc2UgaWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKVxuXHRcdGV4cG9ydHNbXCJyYmFjXCJdID0gZmFjdG9yeSgpO1xuXHRlbHNlXG5cdFx0cm9vdFtcInJiYWNcIl0gPSBmYWN0b3J5KCk7XG59KSh0eXBlb2Ygc2VsZiAhPT0gJ3VuZGVmaW5lZCcgPyBzZWxmIDogdGhpcywgZnVuY3Rpb24oKSB7XG5yZXR1cm4gXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svdW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbiIsIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwge1xuIFx0XHRcdFx0Y29uZmlndXJhYmxlOiBmYWxzZSxcbiBcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXG4gXHRcdFx0XHRnZXQ6IGdldHRlclxuIFx0XHRcdH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IDApO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIDgxZmZhYjI1Mjg0OGYxMjZhZjc1IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgSU9wdGlvbnMge1xuICAgIHJvbGVzQ29uZmlnOiBJUm9sZXNQZXJtaXNzaW9uc1tdO1xufVxuXG5pbnRlcmZhY2UgSVVzZXJzIHtcbiAgICBbdXNlcklkOiBzdHJpbmddOiB7XG4gICAgICAgIHJvbGVzOiBzdHJpbmdbXVxuICAgIH1cbn1cblxuaW50ZXJmYWNlIElQZXJtaXNzaW9ucyB7XG4gICAgW3Blcm1pc3Npb25JZDogc3RyaW5nXTogc3RyaW5nW107XG59XG5cbmludGVyZmFjZSBJUm9sZXNQZXJtaXNzaW9ucyB7XG4gICAgcm9sZXM6IHN0cmluZ1tdLFxuICAgIHBlcm1pc3Npb25zOiBzdHJpbmdbXVxufVxuXG5pbnRlcmZhY2UgSU1pZGRsZXdhcmUge1xuICAgIChwYXJhbXM6IHsgdXNlcklkOiBzdHJpbmc7IHBlcm1pc3Npb25JZDogc3RyaW5nOyB9LCBlcnJvcjogKCkgPT4gdm9pZCwgc3VjY2VzczogKCkgPT4gdm9pZCk6IHZvaWQ7XG59XG5cbmludGVyZmFjZSBJUkJBQyB7XG4gICAgZ2V0VXNlclJvbGVzOiAodXNlcklkOiBzdHJpbmcpID0+IHZvaWQgfCBzdHJpbmdbXTtcbiAgICBhZGRVc2VyUm9sZXM6ICh1c2VySWQ6IHN0cmluZywgcm9sZTogc3RyaW5nW10pID0+IHZvaWQ7XG4gICAgaXNBbGxvd2VkOiAodXNlcklkOiBzdHJpbmcsIHBlcm1pc3Npb25JZDogc3RyaW5nKSA9PiBib29sZWFuIHwgRXJyb3I7XG4gICAgZXh0ZW5kUm9sZTogKHJvbGU6IHN0cmluZywgZXh0ZW5kaW5nUm9sZXM6IHN0cmluZ1tdKSA9PiB2b2lkIHwgRXJyb3I7XG4gICAgbWlkZGxld2FyZTogSU1pZGRsZXdhcmU7XG59XG5cbmNsYXNzIFJCQUMgaW1wbGVtZW50cyBJUkJBQyB7XG4gICAgcHJpdmF0ZSBwZXJtaXNzaW9uczogSVBlcm1pc3Npb25zID0ge307XG4gICAgcHJpdmF0ZSB1c2VyczogSVVzZXJzID0ge307XG5cbiAgICBjb25zdHJ1Y3RvcihvcHRpb25zOiBJT3B0aW9ucykge1xuICAgICAgICB0aGlzLnBlcm1pc3Npb25zID0gb3B0aW9ucy5yb2xlc0NvbmZpZy5yZWR1Y2UoXG4gICAgICAgICAgICAoYWNjdW11bGF0b3I6IGFueSwgaXRlbTogSVJvbGVzUGVybWlzc2lvbnMpID0+IHtcbiAgICAgICAgICAgICAgICBpdGVtLnJvbGVzLm1hcCgocm9sZTogc3RyaW5nKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGFjY3VtdWxhdG9yW3JvbGVdID0gaXRlbS5wZXJtaXNzaW9ucztcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gYWNjdW11bGF0b3I7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge31cbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGdlbmVyYXRlRXJyb3IobXNnOiBhbnkpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKG1zZyk7XG4gICAgfVxuXG4gICAgcHVibGljIGdldFVzZXJSb2xlcyh1c2VySWQ6IHN0cmluZykge1xuICAgICAgICBpZiAodHlwZW9mIHVzZXJJZCA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIHRoaXMuZ2VuZXJhdGVFcnJvcigndXNlcklkIGlzIG5vdCBkZWZpbmVkLCBleHBlY3RlZCAxIGFyZ3VtZW50cycpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHR5cGVvZiB0aGlzLnVzZXJzW3VzZXJJZF0gIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy51c2Vyc1t1c2VySWRdLnJvbGVzO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5nZW5lcmF0ZUVycm9yKHVzZXJJZCArICcgdXNlcklkIGlzIG5vciBkZWZpbmVkLCBwbGVhc2UgYWRkIHVzZXIgdG8gdGhlIHJiYWMgdXNpbmcgYWRkVXNlclJvbGVzIG1ldGhvZCcpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIGFkZFVzZXJSb2xlcyh1c2VySWQ6IHN0cmluZywgcm9sZXM6IHN0cmluZ1tdKSB7XG4gICAgICAgIGlmICh0eXBlb2YgdXNlcklkID09PSAndW5kZWZpbmVkJyB8fCB0eXBlb2Ygcm9sZXMgPT09ICd1bmRlZmluZWQnIHx8IHJvbGVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgdGhpcy5nZW5lcmF0ZUVycm9yKCd1c2VySWQgb3Igcm9sZXMgaXMgbm90IGRlZmluZWQsIG9yIHJvbGVzLmxlbmd0aCA9PT0gMCwgZXhwZWN0ZWQgMiBhcmd1bWVudHMnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJvbGVzLmZvckVhY2gocm9sZSA9PiB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIHRoaXMucGVybWlzc2lvbnNbcm9sZV0gIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMudXNlcnNbdXNlcklkXSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnVzZXJzW3VzZXJJZF0ucm9sZXMucHVzaChyb2xlKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnVzZXJzW3VzZXJJZF0gPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByb2xlczogW3JvbGVdXG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLmdlbmVyYXRlRXJyb3Iocm9sZSArICcgcm9sZSBpcyBub3QgZGVmaW5lZCBpbiBpbnRpYWwgY29uZmlnJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHB1YmxpYyBpc0FsbG93ZWQodXNlcklkOiBzdHJpbmcsIHBlcm1pc3Npb25JZDogc3RyaW5nKSB7XG4gICAgICAgIGlmICh0eXBlb2YgdXNlcklkID09PSAndW5kZWZpbmVkJyB8fCB0eXBlb2YgcGVybWlzc2lvbklkID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgdGhpcy5nZW5lcmF0ZUVycm9yKCd1c2VySWQgb3IgcGVybWlzc2lvbklkIGlzIG5vdCBkZWZpbmVkLCBleHBlY3RlZCAyIGFyZ3VtZW50cycpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgdXNlciA9IHRoaXMudXNlcnNbdXNlcklkXTtcblxuICAgICAgICBpZiAodHlwZW9mIHVzZXIgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICBjb25zdCB1c2VyUm9sZXMgPSB1c2VyLnJvbGVzO1xuICAgICAgICAgICAgbGV0IGlzQWxsb3dlZCA9IGZhbHNlO1xuXG4gICAgICAgICAgICB1c2VyUm9sZXMuZm9yRWFjaCh1c2VyUm9sZSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMucGVybWlzc2lvbnNbdXNlclJvbGVdLmluY2x1ZGVzKHBlcm1pc3Npb25JZCkpIHtcbiAgICAgICAgICAgICAgICAgICAgaXNBbGxvd2VkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcmV0dXJuIGlzQWxsb3dlZDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuZ2VuZXJhdGVFcnJvcih1c2VySWQgKyAnIHVzZXJJZCBpcyBub3IgZGVmaW5lZCwgcGxlYXNlIGFkZCB1c2VyIHRvIHRoZSByYmFjIHVzaW5nIGFkZFVzZXJSb2xlcyBtZXRob2QnKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBleHRlbmRSb2xlKHJvbGU6IHN0cmluZywgZXh0ZW5kaW5nUm9sZXM6IHN0cmluZ1tdKSB7XG4gICAgICAgIGlmICh0eXBlb2Ygcm9sZSA9PT0gJ3VuZGVmaW5lZCcgfHwgdHlwZW9mIGV4dGVuZGluZ1JvbGVzID09PSAndW5kZWZpbmVkJyB8fCBleHRlbmRpbmdSb2xlcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIHRoaXMuZ2VuZXJhdGVFcnJvcigncm9sZSBvciBleHRlbmRpbmdSb2xlcyBpcyBub3QgZGVmaW5lZCwgZXhwZWN0ZWQgMiBhcmd1bWVudHMnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0eXBlb2YgdGhpcy5wZXJtaXNzaW9uc1tyb2xlXSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIGV4dGVuZGluZ1JvbGVzLm1hcChleHRlbmRpbmdSb2xlID0+IHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5wZXJtaXNzaW9uc1tleHRlbmRpbmdSb2xlXSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnBlcm1pc3Npb25zW3JvbGVdID0gdGhpcy5wZXJtaXNzaW9uc1tyb2xlXVxuICAgICAgICAgICAgICAgICAgICAgICAgLmNvbmNhdCh0aGlzLnBlcm1pc3Npb25zW2V4dGVuZGluZ1JvbGVdKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmdlbmVyYXRlRXJyb3Iocm9sZSArICcgcm9sZSBpcyBub3QgZGVmaW5lZCBpbiBpbml0aWFsIGNvbmZpZycpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5nZW5lcmF0ZUVycm9yKHJvbGUgKyAnIHJvbGUgaXMgbm90IGRlZmluZWQgaW4gaW5pdGlhbCBjb25maWcnKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBtaWRkbGV3YXJlKHBhcmFtczogeyB1c2VySWQ6IHN0cmluZzsgcGVybWlzc2lvbklkOiBzdHJpbmc7IH0sIGVycm9yOiAoKSA9PiB2b2lkLCBzdWNjZXNzOiAoKSA9PiB2b2lkKSB7XG4gICAgICAgIGlmICh0eXBlb2YgcGFyYW1zID09PSAndW5kZWZpbmVkJyB8fFxuICAgICAgICAgICAgdHlwZW9mIGVycm9yID09PSAndW5kZWZpbmVkJyB8fFxuICAgICAgICAgICAgdHlwZW9mIHN1Y2Nlc3MgPT09ICd1bmRlZmluZWQnXG4gICAgICAgICkge1xuICAgICAgICAgICAgdGhpcy5nZW5lcmF0ZUVycm9yKCdvbmUgb2YgaW5jb21pbmcgcGFyYW1ldGVycyBpcyBub3QgZGVmaW5lZCwgZXhwZWN0ZWQgMyBhcmd1bWVudHMnKVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuaXNBbGxvd2VkKHBhcmFtcy51c2VySWQsIHBhcmFtcy5wZXJtaXNzaW9uSWQpKSB7XG4gICAgICAgICAgICBzdWNjZXNzKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBlcnJvcigpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBSQkFDO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2luZGV4LnRzIl0sInNvdXJjZVJvb3QiOiIifQ==