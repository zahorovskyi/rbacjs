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
    RBAC.prototype.removeUserRoles = function (userId, roles) {
        if (typeof userId === 'undefined') {
            return this.generateError('userId is not defined, expected 1 arguments');
        }
        if (this.users[userId]) {
            if (typeof roles === 'undefined') {
                this.users[userId] = { roles: [] };
            }
            else {
                for (var i = 0; i < roles.length; i++) {
                    this.users[userId].roles.splice(this.users[userId].roles.indexOf(roles[i]), 1);
                }
            }
        }
        else {
            return this.generateError(userId + ' userId is nor defined, please add user to the rbac using addUserRoles method');
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCA4MTllNzRhNmZmZDAxN2RhN2JhNCIsIndlYnBhY2s6Ly8vLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNELE87QUNWQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhEQUFzRCwrREFBK0Q7O0FBRXJIO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7OztBQzFCQTtJQUtJLGNBQVksT0FBaUI7UUFKckIsVUFBSyxHQUFXLEVBQUUsQ0FBQztRQUVuQixnQkFBVyxHQUFpQixFQUFFLENBQUM7UUFHbkMsSUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLE9BQU8sT0FBTyxDQUFDLEtBQUssS0FBSyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDO1FBRTNFLElBQUksQ0FBQyxXQUFXLEdBQUcsT0FBTyxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQ3pDLFVBQUMsV0FBZ0IsRUFBRSxJQUFrQjtZQUNqQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxL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R0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQzt5QkFDMUMsTUFBTSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDckQsQ0FBQztnQkFBQyxJQUFJLENBQUMsQ0FBQztvQkFDSixNQUFNLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLEdBQUcsd0NBQXdDLENBQUMsQ0FBQztnQkFDL0UsQ0FBQztZQUNMLENBQUM7UUFDTCxDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDSixNQUFNLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLEdBQUcsd0NBQXdDLENBQUMsQ0FBQztRQUMvRSxDQUFDO0lBQ0wsQ0FBQztJQUVNLHlCQUFVLEdBQWpCLFVBQWtCLE1BQWlELEVBQUUsS0FBaUIsRUFBRSxPQUFtQjtRQUN2RyxFQUFFLENBQUMsQ0FBQyxPQUFPLE1BQU0sS0FBSyxXQUFXO1lBQzdCLE9BQU8sS0FBSyxLQUFLLFdBQVc7WUFDNUIsT0FBTyxPQUFPLEtBQUssV0FDdkIsQ0FBQyxDQUFDLENBQUM7WUFDQyxLQUFLLEVBQUUsQ0FBQztZQUNSLE1BQU0sQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLGlFQUFpRSxDQUFDLENBQUM7UUFDakcsQ0FBQztRQUVELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3JELE9BQU8sRUFBRSxDQUFDO1FBQ2QsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ0osS0FBSyxFQUFFLENBQUM7UUFDWixDQUFDO0lBQ0wsQ0FBQztJQUNMLFdBQUM7QUFBRCxDQUFDO0FBRUQscUJBQWUsSUFBSSxDQUFDIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIHdlYnBhY2tVbml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uKHJvb3QsIGZhY3RvcnkpIHtcblx0aWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnKVxuXHRcdG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuXHRlbHNlIGlmKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZClcblx0XHRkZWZpbmUoW10sIGZhY3RvcnkpO1xuXHRlbHNlIGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jylcblx0XHRleHBvcnRzW1wicmJhY1wiXSA9IGZhY3RvcnkoKTtcblx0ZWxzZVxuXHRcdHJvb3RbXCJyYmFjXCJdID0gZmFjdG9yeSgpO1xufSkodHlwZW9mIHNlbGYgIT09ICd1bmRlZmluZWQnID8gc2VsZiA6IHRoaXMsIGZ1bmN0aW9uKCkge1xucmV0dXJuIFxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL3VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24iLCIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSAwKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCA4MTllNzRhNmZmZDAxN2RhN2JhNCIsImltcG9ydCB7IHR5cGUgfSBmcm9tIFwib3NcIjtcblxuaW50ZXJmYWNlIElVc2VycyB7XG4gICAgW3VzZXJJZDogc3RyaW5nXToge1xuICAgICAgICByb2xlczogc3RyaW5nW11cbiAgICB9XG59XG5cbmludGVyZmFjZSBJUGVybWlzc2lvbnMge1xuICAgIFtwZXJtaXNzaW9uSWQ6IHN0cmluZ106IHN0cmluZ1tdO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIElSb2xlc0NvbmZpZyB7XG4gICAgcm9sZXM6IHN0cmluZ1tdLFxuICAgIHBlcm1pc3Npb25zOiBzdHJpbmdbXVxufVxuXG5leHBvcnQgaW50ZXJmYWNlIElNaWRkbGV3YXJlIHtcbiAgICAocGFyYW1zOiB7IHVzZXJJZDogc3RyaW5nOyBwZXJtaXNzaW9uSWQ6IHN0cmluZzsgfSwgZXJyb3I6ICgpID0+IHZvaWQsIHN1Y2Nlc3M6ICgpID0+IHZvaWQpOiB2b2lkIHwgRXJyb3I7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgSVJCQUMge1xuICAgIGdldFVzZXJSb2xlczogKHVzZXJJZDogc3RyaW5nKSA9PiBzdHJpbmdbXSB8IEVycm9yO1xuICAgIHJlbW92ZVVzZXJSb2xlczogKHVzZXJJZDogc3RyaW5nLCByb2xlPzogc3RyaW5nW10pID0+IHZvaWQgfCBFcnJvcjtcbiAgICBhZGRVc2VyUm9sZXM6ICh1c2VySWQ6IHN0cmluZywgcm9sZTogc3RyaW5nW10pID0+IHZvaWQgfCBFcnJvcjtcbiAgICBpc0FsbG93ZWQ6ICh1c2VySWQ6IHN0cmluZywgcGVybWlzc2lvbklkOiBzdHJpbmcpID0+IGJvb2xlYW4gfCBFcnJvcjtcbiAgICBleHRlbmRSb2xlOiAocm9sZTogc3RyaW5nLCBleHRlbmRpbmdSb2xlczogc3RyaW5nW10pID0+IHZvaWQgfCBFcnJvcjtcbiAgICBtaWRkbGV3YXJlOiBJTWlkZGxld2FyZTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBJT3B0aW9ucyB7XG4gICAgcm9sZXNDb25maWc6IElSb2xlc0NvbmZpZ1tdO1xuICAgIGRlYnVnPzogYm9vbGVhbjtcbn1cblxuY2xhc3MgUkJBQyBpbXBsZW1lbnRzIElSQkFDIHtcbiAgICBwcml2YXRlIHVzZXJzOiBJVXNlcnMgPSB7fTtcbiAgICBwcml2YXRlIGRlYnVnOiBib29sZWFuO1xuICAgIHByaXZhdGUgcGVybWlzc2lvbnM6IElQZXJtaXNzaW9ucyA9IHt9O1xuXG4gICAgY29uc3RydWN0b3Iob3B0aW9uczogSU9wdGlvbnMpIHtcbiAgICAgICAgdGhpcy5kZWJ1ZyA9ICh0eXBlb2Ygb3B0aW9ucy5kZWJ1ZyA9PT0gJ3VuZGVmaW5lZCcpID8gdHJ1ZSA6IG9wdGlvbnMuZGVidWc7XG5cbiAgICAgICAgdGhpcy5wZXJtaXNzaW9ucyA9IG9wdGlvbnMucm9sZXNDb25maWcucmVkdWNlKFxuICAgICAgICAgICAgKGFjY3VtdWxhdG9yOiBhbnksIGl0ZW06IElSb2xlc0NvbmZpZykgPT4ge1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaXRlbS5yb2xlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBhY2N1bXVsYXRvcltpdGVtLnJvbGVzW2ldXSA9IGl0ZW0ucGVybWlzc2lvbnM7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBhY2N1bXVsYXRvcjtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7fVxuICAgICAgICApO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2VuZXJhdGVFcnJvcihtc2c6IGFueSkge1xuICAgICAgICBpZiAodGhpcy5kZWJ1Zykge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKG1zZyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ldyBFcnJvcihtc2cpO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXRVc2VyUm9sZXModXNlcklkOiBzdHJpbmcpIHtcbiAgICAgICAgaWYgKHR5cGVvZiB1c2VySWQgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5nZW5lcmF0ZUVycm9yKCd1c2VySWQgaXMgbm90IGRlZmluZWQsIGV4cGVjdGVkIDEgYXJndW1lbnRzJyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodHlwZW9mIHRoaXMudXNlcnNbdXNlcklkXSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnVzZXJzW3VzZXJJZF0ucm9sZXM7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5nZW5lcmF0ZUVycm9yKHVzZXJJZCArICcgdXNlcklkIGlzIG5vciBkZWZpbmVkLCBwbGVhc2UgYWRkIHVzZXIgdG8gdGhlIHJiYWMgdXNpbmcgYWRkVXNlclJvbGVzIG1ldGhvZCcpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIGFkZFVzZXJSb2xlcyh1c2VySWQ6IHN0cmluZywgcm9sZXM6IHN0cmluZ1tdKSB7XG4gICAgICAgIGlmICh0eXBlb2YgdXNlcklkID09PSAndW5kZWZpbmVkJyB8fCB0eXBlb2Ygcm9sZXMgPT09ICd1bmRlZmluZWQnIHx8IHJvbGVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2VuZXJhdGVFcnJvcigndXNlcklkIG9yIHJvbGVzIGlzIG5vdCBkZWZpbmVkLCBvciByb2xlcy5sZW5ndGggPT09IDAsIGV4cGVjdGVkIDIgYXJndW1lbnRzJyk7XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHJvbGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIHRoaXMucGVybWlzc2lvbnNbcm9sZXNbaV1dICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLnVzZXJzW3VzZXJJZF0pIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCF0aGlzLnVzZXJzW3VzZXJJZF0ucm9sZXMuaW5jbHVkZXMocm9sZXNbaV0pKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnVzZXJzW3VzZXJJZF0ucm9sZXMucHVzaChyb2xlc1tpXSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnVzZXJzW3VzZXJJZF0gPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByb2xlczogW3JvbGVzW2ldXVxuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2VuZXJhdGVFcnJvcihyb2xlc1tpXSArICcgcm9sZSBpcyBub3QgZGVmaW5lZCBpbiBpbnRpYWwgY29uZmlnJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cblxuICAgIHB1YmxpYyByZW1vdmVVc2VyUm9sZXModXNlcklkOiBzdHJpbmcsIHJvbGVzPzogc3RyaW5nW10pIHtcbiAgICAgICAgaWYgKHR5cGVvZiB1c2VySWQgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5nZW5lcmF0ZUVycm9yKCd1c2VySWQgaXMgbm90IGRlZmluZWQsIGV4cGVjdGVkIDEgYXJndW1lbnRzJyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy51c2Vyc1t1c2VySWRdKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIHJvbGVzID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICAgIHRoaXMudXNlcnNbdXNlcklkXSA9IHtyb2xlczogW119O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHJvbGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudXNlcnNbdXNlcklkXS5yb2xlcy5zcGxpY2UodGhpcy51c2Vyc1t1c2VySWRdLnJvbGVzLmluZGV4T2Yocm9sZXNbaV0pLCAxKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5nZW5lcmF0ZUVycm9yKHVzZXJJZCArICcgdXNlcklkIGlzIG5vciBkZWZpbmVkLCBwbGVhc2UgYWRkIHVzZXIgdG8gdGhlIHJiYWMgdXNpbmcgYWRkVXNlclJvbGVzIG1ldGhvZCcpO1xuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBwdWJsaWMgaXNBbGxvd2VkKHVzZXJJZDogc3RyaW5nLCBwZXJtaXNzaW9uSWQ6IHN0cmluZykge1xuICAgICAgICBpZiAodHlwZW9mIHVzZXJJZCA9PT0gJ3VuZGVmaW5lZCcgfHwgdHlwZW9mIHBlcm1pc3Npb25JZCA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmdlbmVyYXRlRXJyb3IoJ3VzZXJJZCBvciBwZXJtaXNzaW9uSWQgaXMgbm90IGRlZmluZWQsIGV4cGVjdGVkIDIgYXJndW1lbnRzJyk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCB1c2VyID0gdGhpcy51c2Vyc1t1c2VySWRdO1xuXG4gICAgICAgIGlmICh0eXBlb2YgdXNlciAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIHJldHVybiB1c2VyLnJvbGVzLnNvbWUodXNlclJvbGUgPT4gdGhpcy5wZXJtaXNzaW9uc1t1c2VyUm9sZV0uaW5jbHVkZXMocGVybWlzc2lvbklkKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5nZW5lcmF0ZUVycm9yKHVzZXJJZCArICcgdXNlcklkIGlzIG5vciBkZWZpbmVkLCBwbGVhc2UgYWRkIHVzZXIgdG8gdGhlIHJiYWMgdXNpbmcgYWRkVXNlclJvbGVzIG1ldGhvZCcpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIGV4dGVuZFJvbGUocm9sZTogc3RyaW5nLCBleHRlbmRpbmdSb2xlczogc3RyaW5nW10pIHtcbiAgICAgICAgaWYgKHR5cGVvZiByb2xlID09PSAndW5kZWZpbmVkJyB8fCB0eXBlb2YgZXh0ZW5kaW5nUm9sZXMgPT09ICd1bmRlZmluZWQnIHx8IGV4dGVuZGluZ1JvbGVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2VuZXJhdGVFcnJvcigncm9sZSBvciBleHRlbmRpbmdSb2xlcyBpcyBub3QgZGVmaW5lZCwgZXhwZWN0ZWQgMiBhcmd1bWVudHMnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0eXBlb2YgdGhpcy5wZXJtaXNzaW9uc1tyb2xlXSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZXh0ZW5kaW5nUm9sZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5wZXJtaXNzaW9uc1tleHRlbmRpbmdSb2xlc1tpXV0pIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wZXJtaXNzaW9uc1tyb2xlXSA9IHRoaXMucGVybWlzc2lvbnNbcm9sZV1cbiAgICAgICAgICAgICAgICAgICAgICAgIC5jb25jYXQodGhpcy5wZXJtaXNzaW9uc1tleHRlbmRpbmdSb2xlc1tpXV0pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmdlbmVyYXRlRXJyb3Iocm9sZSArICcgcm9sZSBpcyBub3QgZGVmaW5lZCBpbiBpbml0aWFsIGNvbmZpZycpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmdlbmVyYXRlRXJyb3Iocm9sZSArICcgcm9sZSBpcyBub3QgZGVmaW5lZCBpbiBpbml0aWFsIGNvbmZpZycpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIG1pZGRsZXdhcmUocGFyYW1zOiB7IHVzZXJJZDogc3RyaW5nOyBwZXJtaXNzaW9uSWQ6IHN0cmluZzsgfSwgZXJyb3I6ICgpID0+IHZvaWQsIHN1Y2Nlc3M6ICgpID0+IHZvaWQpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBwYXJhbXMgPT09ICd1bmRlZmluZWQnIHx8XG4gICAgICAgICAgICB0eXBlb2YgZXJyb3IgPT09ICd1bmRlZmluZWQnIHx8XG4gICAgICAgICAgICB0eXBlb2Ygc3VjY2VzcyA9PT0gJ3VuZGVmaW5lZCdcbiAgICAgICAgKSB7XG4gICAgICAgICAgICBlcnJvcigpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2VuZXJhdGVFcnJvcignb25lIG9mIGluY29taW5nIHBhcmFtZXRlcnMgaXMgbm90IGRlZmluZWQsIGV4cGVjdGVkIDMgYXJndW1lbnRzJyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5pc0FsbG93ZWQocGFyYW1zLnVzZXJJZCwgcGFyYW1zLnBlcm1pc3Npb25JZCkpIHtcbiAgICAgICAgICAgIHN1Y2Nlc3MoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGVycm9yKCk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFJCQUM7XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2luZGV4LnRzIl0sInNvdXJjZVJvb3QiOiIifQ==