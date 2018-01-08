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
    RBAC.prototype.getUserRole = function (userId) {
        if (typeof userId === 'undefined') {
            this.generateError('userId is not defined, expected 1 arguments');
        }
        if (typeof this.users[userId] !== 'undefined') {
            return this.users[userId].role;
        }
        else {
            this.generateError(userId + ' userId is nor defined, please add user to the rbac using addUserRole method');
        }
    };
    RBAC.prototype.addUserRole = function (userId, role) {
        if (typeof userId === 'undefined' || typeof role === 'undefined') {
            this.generateError('userId or role is not defined, expected 2 arguments');
        }
        if (typeof this.permissions[role] !== 'undefined') {
            this.users[userId] = {
                role: role
            };
        }
        else {
            this.generateError(role + ' role is not defined in intial config');
        }
    };
    RBAC.prototype.isAllowed = function (userId, permissionId) {
        if (typeof userId === 'undefined' || typeof permissionId === 'undefined') {
            this.generateError('userId or permissionId is not defined, expected 2 arguments');
        }
        var user = this.users[userId];
        if (typeof user !== 'undefined') {
            var userRole = user.role;
            var rolePermission = this.permissions[userRole];
            return rolePermission.includes(permissionId);
        }
        else {
            this.generateError(userId + ' userId is nor defined, please add user to the rbac using addUserRole method');
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
                    return _this.generateError(role + ' role is not defined in initial config');
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCBkOGQ4ZTA2ZjBhMjQ2NzJlMGM5OSIsIndlYnBhY2s6Ly8vLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNELE87QUNWQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhEQUFzRCwrREFBK0Q7O0FBRXJIO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7QUM3RGE7O0FBZ0NiO0lBSUksY0FBWSxPQUFpQjtRQUhyQixnQkFBVyxHQUFpQixFQUFFLENBQUM7UUFDL0IsVUFBSyxHQUFXLEVBQUUsQ0FBQztRQUd2QixJQUFJLENBQUMsV0FBVyxHQUFHLE9BQU8sQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUN6QyxVQUFDLFdBQWdCLEVBQUUsSUFBdUI7WUFDdEMsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsVUFBQyxJQUFZO2dCQUN4QixXQUFXLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQztZQUN6QyxDQUFDLENBQUMsQ0FBQztZQUNILE1BQU0sQ0FBQyxXQUFXLENBQUM7UUFDdkIsQ0FBQyxFQUNELEVBQUUsQ0FDTCxDQUFDO0lBQ04sQ0FB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QyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ2xDLEtBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLEdBQUcsS0FBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUM7eUJBQzFDLE1BQU0sQ0FBQyxLQUFJLENBQUMsV0FBVyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUM7Z0JBQ2pELENBQUM7Z0JBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ0osTUFBTSxDQUFDLEtBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxHQUFHLHdDQUF3QyxDQUFDLENBQUM7Z0JBQy9FLENBQUM7WUFDTCxDQUFDLENBQUMsQ0FBQztRQUNQLENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNKLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxHQUFHLHdDQUF3QyxDQUFDLENBQUM7UUFDeEUsQ0FBQztJQUNMLENBQUM7SUFFTSx5QkFBVSxHQUFqQixVQUFrQixNQUFpRCxFQUFFLEtBQWlCLEVBQUUsT0FBbUI7UUFDdkcsRUFBRSxDQUFDLENBQUMsT0FBTyxNQUFNLEtBQUssV0FBVztZQUM3QixPQUFPLEtBQUssS0FBSyxXQUFXO1lBQzVCLE9BQU8sT0FBTyxLQUFLLFdBQ3ZCLENBQUMsQ0FBQyxDQUFDO1lBQ0MsSUFBSSxDQUFDLGFBQWEsQ0FBQyxpRUFBaUUsQ0FBQztRQUN6RixDQUFDO1FBRUQsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDckQsT0FBTyxFQUFFLENBQUM7UUFDZCxDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDSixLQUFLLEVBQUUsQ0FBQztRQUNaLENBQUM7SUFDTCxDQUFDO0lBQ0wsV0FBQztBQUFELENBQUM7QUFFRCxxQkFBZSxJQUFJLENBQUMiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gd2VicGFja1VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24ocm9vdCwgZmFjdG9yeSkge1xuXHRpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG5cdGVsc2UgaWYodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKVxuXHRcdGRlZmluZShbXSwgZmFjdG9yeSk7XG5cdGVsc2UgaWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKVxuXHRcdGV4cG9ydHNbXCJyYmFjXCJdID0gZmFjdG9yeSgpO1xuXHRlbHNlXG5cdFx0cm9vdFtcInJiYWNcIl0gPSBmYWN0b3J5KCk7XG59KSh0eXBlb2Ygc2VsZiAhPT0gJ3VuZGVmaW5lZCcgPyBzZWxmIDogdGhpcywgZnVuY3Rpb24oKSB7XG5yZXR1cm4gXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svdW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbiIsIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwge1xuIFx0XHRcdFx0Y29uZmlndXJhYmxlOiBmYWxzZSxcbiBcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXG4gXHRcdFx0XHRnZXQ6IGdldHRlclxuIFx0XHRcdH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IDApO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIGQ4ZDhlMDZmMGEyNDY3MmUwYzk5IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgSU9wdGlvbnMge1xuICAgIHJvbGVzQ29uZmlnOiBJUm9sZXNQZXJtaXNzaW9uc1tdO1xufVxuXG5pbnRlcmZhY2UgSVVzZXJzIHtcbiAgICBbdXNlcklkOiBzdHJpbmddOiB7XG4gICAgICAgIHJvbGU6IHN0cmluZ1xuICAgIH1cbn1cblxuaW50ZXJmYWNlIElQZXJtaXNzaW9ucyB7XG4gICAgW3Blcm1pc3Npb25JZDogc3RyaW5nXTogc3RyaW5nW107XG59XG5cbmludGVyZmFjZSBJUm9sZXNQZXJtaXNzaW9ucyB7XG4gICAgcm9sZXM6IHN0cmluZ1tdLFxuICAgIHBlcm1pc3Npb25zOiBzdHJpbmdbXVxufVxuXG5pbnRlcmZhY2UgSU1pZGRsZXdhcmUge1xuICAgIChwYXJhbXM6IHsgdXNlcklkOiBzdHJpbmc7IHBlcm1pc3Npb25JZDogc3RyaW5nOyB9LCBlcnJvcjogKCkgPT4gdm9pZCwgc3VjY2VzczogKCkgPT4gdm9pZCk6IHZvaWQ7XG59XG5cbmludGVyZmFjZSBJUkJBQyB7XG4gICAgYWRkVXNlclJvbGU6ICh1c2VySWQ6IHN0cmluZywgcm9sZTogc3RyaW5nKSA9PiB2b2lkO1xuICAgIGlzQWxsb3dlZDogKHVzZXJJZDogc3RyaW5nLCBwZXJtaXNzaW9uSWQ6IHN0cmluZykgPT4gYm9vbGVhbiB8IEVycm9yO1xuICAgIGV4dGVuZFJvbGU6IChyb2xlOiBzdHJpbmcsIGV4dGVuZGluZ1JvbGVzOiBzdHJpbmdbXSkgPT4gdm9pZCB8IEVycm9yO1xuICAgIG1pZGRsZXdhcmU6IElNaWRkbGV3YXJlO1xufVxuXG5jbGFzcyBSQkFDIGltcGxlbWVudHMgSVJCQUMge1xuICAgIHByaXZhdGUgcGVybWlzc2lvbnM6IElQZXJtaXNzaW9ucyA9IHt9O1xuICAgIHByaXZhdGUgdXNlcnM6IElVc2VycyA9IHt9O1xuXG4gICAgY29uc3RydWN0b3Iob3B0aW9uczogSU9wdGlvbnMpIHtcbiAgICAgICAgdGhpcy5wZXJtaXNzaW9ucyA9IG9wdGlvbnMucm9sZXNDb25maWcucmVkdWNlKFxuICAgICAgICAgICAgKGFjY3VtdWxhdG9yOiBhbnksIGl0ZW06IElSb2xlc1Blcm1pc3Npb25zKSA9PiB7XG4gICAgICAgICAgICAgICAgaXRlbS5yb2xlcy5tYXAoKHJvbGU6IHN0cmluZykgPT4ge1xuICAgICAgICAgICAgICAgICAgICBhY2N1bXVsYXRvcltyb2xlXSA9IGl0ZW0ucGVybWlzc2lvbnM7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGFjY3VtdWxhdG9yO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHt9XG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZW5lcmF0ZUVycm9yKG1zZzogYW55KSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihtc2cpO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXRVc2VyUm9sZSh1c2VySWQ6IHN0cmluZykge1xuICAgICAgICBpZiAodHlwZW9mIHVzZXJJZCA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIHRoaXMuZ2VuZXJhdGVFcnJvcigndXNlcklkIGlzIG5vdCBkZWZpbmVkLCBleHBlY3RlZCAxIGFyZ3VtZW50cycpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHR5cGVvZiB0aGlzLnVzZXJzW3VzZXJJZF0gIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy51c2Vyc1t1c2VySWRdLnJvbGU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmdlbmVyYXRlRXJyb3IodXNlcklkICsgJyB1c2VySWQgaXMgbm9yIGRlZmluZWQsIHBsZWFzZSBhZGQgdXNlciB0byB0aGUgcmJhYyB1c2luZyBhZGRVc2VyUm9sZSBtZXRob2QnKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBhZGRVc2VyUm9sZSh1c2VySWQ6IHN0cmluZywgcm9sZTogc3RyaW5nKSB7XG4gICAgICAgIGlmICh0eXBlb2YgdXNlcklkID09PSAndW5kZWZpbmVkJyB8fCB0eXBlb2Ygcm9sZSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIHRoaXMuZ2VuZXJhdGVFcnJvcigndXNlcklkIG9yIHJvbGUgaXMgbm90IGRlZmluZWQsIGV4cGVjdGVkIDIgYXJndW1lbnRzJyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodHlwZW9mIHRoaXMucGVybWlzc2lvbnNbcm9sZV0gIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICB0aGlzLnVzZXJzW3VzZXJJZF0gPSB7XG4gICAgICAgICAgICAgICAgcm9sZTogcm9sZVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuZ2VuZXJhdGVFcnJvcihyb2xlICsgJyByb2xlIGlzIG5vdCBkZWZpbmVkIGluIGludGlhbCBjb25maWcnKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBpc0FsbG93ZWQodXNlcklkOiBzdHJpbmcsIHBlcm1pc3Npb25JZDogc3RyaW5nKSB7XG4gICAgICAgIGlmICh0eXBlb2YgdXNlcklkID09PSAndW5kZWZpbmVkJyB8fCB0eXBlb2YgcGVybWlzc2lvbklkID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgdGhpcy5nZW5lcmF0ZUVycm9yKCd1c2VySWQgb3IgcGVybWlzc2lvbklkIGlzIG5vdCBkZWZpbmVkLCBleHBlY3RlZCAyIGFyZ3VtZW50cycpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgdXNlciA9IHRoaXMudXNlcnNbdXNlcklkXTtcblxuICAgICAgICBpZiAodHlwZW9mIHVzZXIgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICBjb25zdCB1c2VyUm9sZSA9IHVzZXIucm9sZTtcbiAgICAgICAgICAgIGNvbnN0IHJvbGVQZXJtaXNzaW9uID0gdGhpcy5wZXJtaXNzaW9uc1t1c2VyUm9sZV07XG5cbiAgICAgICAgICAgIHJldHVybiByb2xlUGVybWlzc2lvbi5pbmNsdWRlcyhwZXJtaXNzaW9uSWQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5nZW5lcmF0ZUVycm9yKHVzZXJJZCArICcgdXNlcklkIGlzIG5vciBkZWZpbmVkLCBwbGVhc2UgYWRkIHVzZXIgdG8gdGhlIHJiYWMgdXNpbmcgYWRkVXNlclJvbGUgbWV0aG9kJyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgZXh0ZW5kUm9sZShyb2xlOiBzdHJpbmcsIGV4dGVuZGluZ1JvbGVzOiBzdHJpbmdbXSkge1xuICAgICAgICBpZiAodHlwZW9mIHJvbGUgPT09ICd1bmRlZmluZWQnIHx8IHR5cGVvZiBleHRlbmRpbmdSb2xlcyA9PT0gJ3VuZGVmaW5lZCcgfHwgZXh0ZW5kaW5nUm9sZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICB0aGlzLmdlbmVyYXRlRXJyb3IoJ3JvbGUgb3IgZXh0ZW5kaW5nUm9sZXMgaXMgbm90IGRlZmluZWQsIGV4cGVjdGVkIDIgYXJndW1lbnRzJyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodHlwZW9mIHRoaXMucGVybWlzc2lvbnNbcm9sZV0gIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICBleHRlbmRpbmdSb2xlcy5tYXAoZXh0ZW5kaW5nUm9sZSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMucGVybWlzc2lvbnNbZXh0ZW5kaW5nUm9sZV0pIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wZXJtaXNzaW9uc1tyb2xlXSA9IHRoaXMucGVybWlzc2lvbnNbcm9sZV1cbiAgICAgICAgICAgICAgICAgICAgICAgIC5jb25jYXQodGhpcy5wZXJtaXNzaW9uc1tleHRlbmRpbmdSb2xlXSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2VuZXJhdGVFcnJvcihyb2xlICsgJyByb2xlIGlzIG5vdCBkZWZpbmVkIGluIGluaXRpYWwgY29uZmlnJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmdlbmVyYXRlRXJyb3Iocm9sZSArICcgcm9sZSBpcyBub3QgZGVmaW5lZCBpbiBpbml0aWFsIGNvbmZpZycpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIG1pZGRsZXdhcmUocGFyYW1zOiB7IHVzZXJJZDogc3RyaW5nOyBwZXJtaXNzaW9uSWQ6IHN0cmluZzsgfSwgZXJyb3I6ICgpID0+IHZvaWQsIHN1Y2Nlc3M6ICgpID0+IHZvaWQpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBwYXJhbXMgPT09ICd1bmRlZmluZWQnIHx8XG4gICAgICAgICAgICB0eXBlb2YgZXJyb3IgPT09ICd1bmRlZmluZWQnIHx8XG4gICAgICAgICAgICB0eXBlb2Ygc3VjY2VzcyA9PT0gJ3VuZGVmaW5lZCdcbiAgICAgICAgKSB7XG4gICAgICAgICAgICB0aGlzLmdlbmVyYXRlRXJyb3IoJ29uZSBvZiBpbmNvbWluZyBwYXJhbWV0ZXJzIGlzIG5vdCBkZWZpbmVkLCBleHBlY3RlZCAzIGFyZ3VtZW50cycpXG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5pc0FsbG93ZWQocGFyYW1zLnVzZXJJZCwgcGFyYW1zLnBlcm1pc3Npb25JZCkpIHtcbiAgICAgICAgICAgIHN1Y2Nlc3MoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGVycm9yKCk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFJCQUM7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvaW5kZXgudHMiXSwic291cmNlUm9vdCI6IiJ9