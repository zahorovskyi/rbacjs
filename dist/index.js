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
            this.generateError(userId + ' userId is nor defined, please add user to the rbac using addUserRoles method');
        }
    };
    RBAC.prototype.addUserRoles = function (userId, role) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCAyMTRkOTdjN2YxNWRlMDAyMmE4MCIsIndlYnBhY2s6Ly8vLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNELE87QUNWQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhEQUFzRCwrREFBK0Q7O0FBRXJIO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7QUM3RGE7O0FBZ0NiO0lBSUksY0FBWSxPQUFpQjtRQUhyQixnQkFBVyxHQUFpQixFQUFFLENBQUM7UUFDL0IsVUFBSyxHQUFXLEVBQUUsQ0FBQztRQUd2QixJQUFJLENBQUMsV0FBVyxHQUFHLE9BQU8sQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUN6QyxVQUFDLFdBQWdCLEVBQUUsSUFBdUI7WUFDdEMsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsVUFBQyxJQUFZO2dCQUN4QixXQUFXLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQztZQUN6QyxDQUFDLENBQUMsQ0FBQztZQUNILE1BQU0sQ0FBQyxXQUFXLENBQUM7UUFDdkIsQ0FBQyxFQUNELEVBQUUsQ0FDTCxDQUFDO0lBQ04sQ0FBQztJQUVPLDRCQUFhLEdBQXJCLFVBQXNCLEdBQVE7UUFDMUIsTUFBTSxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUN6QixDQUFDO0lBRU0sMEJBQVcsR0FBbEIsVUFBbUIsTUFBYztRQUM3QixFQUFFLENBQUMsQ0FBQyxPQUFPLE1BQU0sS0FBSyxXQUFXLENBQUMsQ0FBQyxDQUFDO1lBQ2hDLElBQUksQ0FBQyxhQUFhLENBQUMsNkNBQTZDLENBQUMsQ0FBQztRQUN0RSxDQUFDO1FBRUQsRUFBRSxDQUFDLENBQUMsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLFdBQVcsQ0FBQyxDQUFDLENBQUM7WUFDNUMsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDO1FBQ25DLENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNKLElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxHQUFHLCtFQUErRSxDQUFDLENBQUM7UUFDakgsQ0FBQztJQUNMLENBQUM7SUFFTSwyQkFBWSxHQUFuQixVQUFvQixNQUFjLEVBQUUsSUFBWTtRQUM1QyxFQUFFLENBQUMsQ0FBQyxPQUFPLE1BQU0sS0FBSyxXQUFXLElBQUksT0FBTyxJQUFJLEtBQUssV0FBVyxDQUFDLENBQUMsQ0FBQztZQUMvRCxJQUFJLENBQUMsYUFBYSxDQUFDLHFEQUFxRCxDQUFDLENBQUM7UUFDOUUsQ0FBQztRQUVELEVBQUUsQ0FBQyxDQUFDLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsS0FBSyxXQUFXLENBQUMsQ0FBQyxDQUFDO1lBQ2hELElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLEdBQUc7Z0JBQ2pCLElBQUksRUFBRSxJQUFJO2FBQ2IsQ0FBQztRQUNOLENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNKLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxHQUFHLHVDQUF1QyxDQUFDLENBQUM7UUFDdkUsQ0FBQztJQUNMLENBQUM7SUFFTSx3QkFBUyxHQUFoQixVQUFpQixNQUFjLEVBQUUsWUFBb0I7UUFDakQsRUFBRSxDQUFDLENBQUMsT0FBTyxNQUFNLEtBQUssV0FBVyxJQUFJLE9BQU8sWUFBWSxLQUFLLFdBQVcsQ0FBQyxDQUFDLENBQUM7WUFDdkUsSUFBSSxDQUFDLGFBQWEsQ0FBQyw2REFBNkQsQ0FBQyxDQUFDO1FBQ3RGLENBQUM7UUFFRCxJQUFNLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBRWhDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sSUFBSSxLQUFLLFdBQVcsQ0FBQyxDQUFDLENBQUM7WUFDOUIsSUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQztZQUMzQixJQUFNLGNBQWMsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBRWxELE1BQU0sQ0FBQyxjQUFjLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBQ2pELENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNKLElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxHQUFHLCtFQUErRSxDQUFDLENBQUM7UUFDakgsQ0FBQztJQUNMLENBQUM7SUFFTSx5QkFBVSxHQUFqQixVQUFrQixJQUFZLEVBQUUsY0FBd0I7UUFBeEQsaUJBaUJDO1FBaEJHLEVBQUUsQ0FBQyxDQUFDLE9BQU8sSUFBSSxLQUFLLFdBQVcsSUFBSSxPQUFPLGNBQWMsS0FBSyxXQUFXLElBQUksY0FBYyxDQUFDLE1BQU0sS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3RHLElBQUksQ0FBQyxhQUFhLENBQUMsNkRBQTZELENBQUMsQ0FBQztRQUN0RixDQUFDO1FBRUQsRUFBRSxDQUFDLENBQUMsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxLQUFLLFdBQVcsQ0FBQyxDQUFDLENBQUM7WUFDaEQsY0FBYyxDQUFDLEdBQUcsQ0FBQyx1QkFBYTtnQkFDNUIsRUFBRSxDQUFDLENBQUMsS0FBSSxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ2xDLEtBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLEdBQUcsS0FBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUM7eUJBQzFDLE1BQU0sQ0FBQyxLQUFJLENBQUMsV0FBVyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUM7Z0JBQ2pELENBQUM7Z0JBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ0osTUFBTSxDQUFDLEtBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxHQUFHLHdDQUF3QyxDQUFDLENBQUM7Z0JBQy9FLENBQUM7WUFDTCxDQUFDLENBQUMsQ0FBQztRQUNQLENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNKLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxHQUFHLHdDQUF3QyxDQUFDLENBQUM7UUFDeEUsQ0FBQztJQUNMLENBQUM7SUFFTSx5QkFBVSxHQUFqQixVQUFrQixNQUFpRCxFQUFFLEtBQWlCLEVBQUUsT0FBbUI7UUFDdkcsRUFBRSxDQUFDLENBQUMsT0FBTyxNQUFNLEtBQUssV0FBVztZQUM3QixPQUFPLEtBQUssS0FBSyxXQUFXO1lBQzVCLE9BQU8sT0FBTyxLQUFLLFdBQ3ZCLENBQUMsQ0FBQyxDQUFDO1lBQ0MsSUFBSSxDQUFDLGFBQWEsQ0FBQyxpRUFBaUUsQ0FBQztRQUN6RixDQUFDO1FBRUQsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDckQsT0FBTyxFQUFFLENBQUM7UUFDZCxDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDSixLQUFLLEVBQUUsQ0FBQztRQUNaLENBQUM7SUFDTCxDQUFDO0lBQ0wsV0FBQztBQUFELENBQUM7QUFFRCxxQkFBZSxJQUFJLENBQUMiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gd2VicGFja1VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24ocm9vdCwgZmFjdG9yeSkge1xuXHRpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG5cdGVsc2UgaWYodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKVxuXHRcdGRlZmluZShbXSwgZmFjdG9yeSk7XG5cdGVsc2UgaWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKVxuXHRcdGV4cG9ydHNbXCJyYmFjXCJdID0gZmFjdG9yeSgpO1xuXHRlbHNlXG5cdFx0cm9vdFtcInJiYWNcIl0gPSBmYWN0b3J5KCk7XG59KSh0eXBlb2Ygc2VsZiAhPT0gJ3VuZGVmaW5lZCcgPyBzZWxmIDogdGhpcywgZnVuY3Rpb24oKSB7XG5yZXR1cm4gXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svdW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbiIsIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwge1xuIFx0XHRcdFx0Y29uZmlndXJhYmxlOiBmYWxzZSxcbiBcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXG4gXHRcdFx0XHRnZXQ6IGdldHRlclxuIFx0XHRcdH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IDApO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIDIxNGQ5N2M3ZjE1ZGUwMDIyYTgwIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgSU9wdGlvbnMge1xuICAgIHJvbGVzQ29uZmlnOiBJUm9sZXNQZXJtaXNzaW9uc1tdO1xufVxuXG5pbnRlcmZhY2UgSVVzZXJzIHtcbiAgICBbdXNlcklkOiBzdHJpbmddOiB7XG4gICAgICAgIHJvbGU6IHN0cmluZ1xuICAgIH1cbn1cblxuaW50ZXJmYWNlIElQZXJtaXNzaW9ucyB7XG4gICAgW3Blcm1pc3Npb25JZDogc3RyaW5nXTogc3RyaW5nW107XG59XG5cbmludGVyZmFjZSBJUm9sZXNQZXJtaXNzaW9ucyB7XG4gICAgcm9sZXM6IHN0cmluZ1tdLFxuICAgIHBlcm1pc3Npb25zOiBzdHJpbmdbXVxufVxuXG5pbnRlcmZhY2UgSU1pZGRsZXdhcmUge1xuICAgIChwYXJhbXM6IHsgdXNlcklkOiBzdHJpbmc7IHBlcm1pc3Npb25JZDogc3RyaW5nOyB9LCBlcnJvcjogKCkgPT4gdm9pZCwgc3VjY2VzczogKCkgPT4gdm9pZCk6IHZvaWQ7XG59XG5cbmludGVyZmFjZSBJUkJBQyB7XG4gICAgYWRkVXNlclJvbGVzOiAodXNlcklkOiBzdHJpbmcsIHJvbGU6IHN0cmluZykgPT4gdm9pZDtcbiAgICBpc0FsbG93ZWQ6ICh1c2VySWQ6IHN0cmluZywgcGVybWlzc2lvbklkOiBzdHJpbmcpID0+IGJvb2xlYW4gfCBFcnJvcjtcbiAgICBleHRlbmRSb2xlOiAocm9sZTogc3RyaW5nLCBleHRlbmRpbmdSb2xlczogc3RyaW5nW10pID0+IHZvaWQgfCBFcnJvcjtcbiAgICBtaWRkbGV3YXJlOiBJTWlkZGxld2FyZTtcbn1cblxuY2xhc3MgUkJBQyBpbXBsZW1lbnRzIElSQkFDIHtcbiAgICBwcml2YXRlIHBlcm1pc3Npb25zOiBJUGVybWlzc2lvbnMgPSB7fTtcbiAgICBwcml2YXRlIHVzZXJzOiBJVXNlcnMgPSB7fTtcblxuICAgIGNvbnN0cnVjdG9yKG9wdGlvbnM6IElPcHRpb25zKSB7XG4gICAgICAgIHRoaXMucGVybWlzc2lvbnMgPSBvcHRpb25zLnJvbGVzQ29uZmlnLnJlZHVjZShcbiAgICAgICAgICAgIChhY2N1bXVsYXRvcjogYW55LCBpdGVtOiBJUm9sZXNQZXJtaXNzaW9ucykgPT4ge1xuICAgICAgICAgICAgICAgIGl0ZW0ucm9sZXMubWFwKChyb2xlOiBzdHJpbmcpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgYWNjdW11bGF0b3Jbcm9sZV0gPSBpdGVtLnBlcm1pc3Npb25zO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHJldHVybiBhY2N1bXVsYXRvcjtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7fVxuICAgICAgICApO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2VuZXJhdGVFcnJvcihtc2c6IGFueSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IobXNnKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0VXNlclJvbGUodXNlcklkOiBzdHJpbmcpIHtcbiAgICAgICAgaWYgKHR5cGVvZiB1c2VySWQgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICB0aGlzLmdlbmVyYXRlRXJyb3IoJ3VzZXJJZCBpcyBub3QgZGVmaW5lZCwgZXhwZWN0ZWQgMSBhcmd1bWVudHMnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0eXBlb2YgdGhpcy51c2Vyc1t1c2VySWRdICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudXNlcnNbdXNlcklkXS5yb2xlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5nZW5lcmF0ZUVycm9yKHVzZXJJZCArICcgdXNlcklkIGlzIG5vciBkZWZpbmVkLCBwbGVhc2UgYWRkIHVzZXIgdG8gdGhlIHJiYWMgdXNpbmcgYWRkVXNlclJvbGVzIG1ldGhvZCcpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIGFkZFVzZXJSb2xlcyh1c2VySWQ6IHN0cmluZywgcm9sZTogc3RyaW5nKSB7XG4gICAgICAgIGlmICh0eXBlb2YgdXNlcklkID09PSAndW5kZWZpbmVkJyB8fCB0eXBlb2Ygcm9sZSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIHRoaXMuZ2VuZXJhdGVFcnJvcigndXNlcklkIG9yIHJvbGUgaXMgbm90IGRlZmluZWQsIGV4cGVjdGVkIDIgYXJndW1lbnRzJyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodHlwZW9mIHRoaXMucGVybWlzc2lvbnNbcm9sZV0gIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICB0aGlzLnVzZXJzW3VzZXJJZF0gPSB7XG4gICAgICAgICAgICAgICAgcm9sZTogcm9sZVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuZ2VuZXJhdGVFcnJvcihyb2xlICsgJyByb2xlIGlzIG5vdCBkZWZpbmVkIGluIGludGlhbCBjb25maWcnKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBpc0FsbG93ZWQodXNlcklkOiBzdHJpbmcsIHBlcm1pc3Npb25JZDogc3RyaW5nKSB7XG4gICAgICAgIGlmICh0eXBlb2YgdXNlcklkID09PSAndW5kZWZpbmVkJyB8fCB0eXBlb2YgcGVybWlzc2lvbklkID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgdGhpcy5nZW5lcmF0ZUVycm9yKCd1c2VySWQgb3IgcGVybWlzc2lvbklkIGlzIG5vdCBkZWZpbmVkLCBleHBlY3RlZCAyIGFyZ3VtZW50cycpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgdXNlciA9IHRoaXMudXNlcnNbdXNlcklkXTtcblxuICAgICAgICBpZiAodHlwZW9mIHVzZXIgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICBjb25zdCB1c2VyUm9sZSA9IHVzZXIucm9sZTtcbiAgICAgICAgICAgIGNvbnN0IHJvbGVQZXJtaXNzaW9uID0gdGhpcy5wZXJtaXNzaW9uc1t1c2VyUm9sZV07XG5cbiAgICAgICAgICAgIHJldHVybiByb2xlUGVybWlzc2lvbi5pbmNsdWRlcyhwZXJtaXNzaW9uSWQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5nZW5lcmF0ZUVycm9yKHVzZXJJZCArICcgdXNlcklkIGlzIG5vciBkZWZpbmVkLCBwbGVhc2UgYWRkIHVzZXIgdG8gdGhlIHJiYWMgdXNpbmcgYWRkVXNlclJvbGVzIG1ldGhvZCcpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIGV4dGVuZFJvbGUocm9sZTogc3RyaW5nLCBleHRlbmRpbmdSb2xlczogc3RyaW5nW10pIHtcbiAgICAgICAgaWYgKHR5cGVvZiByb2xlID09PSAndW5kZWZpbmVkJyB8fCB0eXBlb2YgZXh0ZW5kaW5nUm9sZXMgPT09ICd1bmRlZmluZWQnIHx8IGV4dGVuZGluZ1JvbGVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgdGhpcy5nZW5lcmF0ZUVycm9yKCdyb2xlIG9yIGV4dGVuZGluZ1JvbGVzIGlzIG5vdCBkZWZpbmVkLCBleHBlY3RlZCAyIGFyZ3VtZW50cycpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHR5cGVvZiB0aGlzLnBlcm1pc3Npb25zW3JvbGVdICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgZXh0ZW5kaW5nUm9sZXMubWFwKGV4dGVuZGluZ1JvbGUgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLnBlcm1pc3Npb25zW2V4dGVuZGluZ1JvbGVdKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucGVybWlzc2lvbnNbcm9sZV0gPSB0aGlzLnBlcm1pc3Npb25zW3JvbGVdXG4gICAgICAgICAgICAgICAgICAgICAgICAuY29uY2F0KHRoaXMucGVybWlzc2lvbnNbZXh0ZW5kaW5nUm9sZV0pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmdlbmVyYXRlRXJyb3Iocm9sZSArICcgcm9sZSBpcyBub3QgZGVmaW5lZCBpbiBpbml0aWFsIGNvbmZpZycpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5nZW5lcmF0ZUVycm9yKHJvbGUgKyAnIHJvbGUgaXMgbm90IGRlZmluZWQgaW4gaW5pdGlhbCBjb25maWcnKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBtaWRkbGV3YXJlKHBhcmFtczogeyB1c2VySWQ6IHN0cmluZzsgcGVybWlzc2lvbklkOiBzdHJpbmc7IH0sIGVycm9yOiAoKSA9PiB2b2lkLCBzdWNjZXNzOiAoKSA9PiB2b2lkKSB7XG4gICAgICAgIGlmICh0eXBlb2YgcGFyYW1zID09PSAndW5kZWZpbmVkJyB8fFxuICAgICAgICAgICAgdHlwZW9mIGVycm9yID09PSAndW5kZWZpbmVkJyB8fFxuICAgICAgICAgICAgdHlwZW9mIHN1Y2Nlc3MgPT09ICd1bmRlZmluZWQnXG4gICAgICAgICkge1xuICAgICAgICAgICAgdGhpcy5nZW5lcmF0ZUVycm9yKCdvbmUgb2YgaW5jb21pbmcgcGFyYW1ldGVycyBpcyBub3QgZGVmaW5lZCwgZXhwZWN0ZWQgMyBhcmd1bWVudHMnKVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuaXNBbGxvd2VkKHBhcmFtcy51c2VySWQsIHBhcmFtcy5wZXJtaXNzaW9uSWQpKSB7XG4gICAgICAgICAgICBzdWNjZXNzKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBlcnJvcigpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBSQkFDO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2luZGV4LnRzIl0sInNvdXJjZVJvb3QiOiIifQ==