# rbacjs

### Role base access control
[![Build Status](https://travis-ci.org/zahorovskyi/rbacjs.svg?branch=master)](https://travis-ci.org/zahorovskyi/rbacjs)
[![NPM version](https://badge.fury.io/js/rbacjs.svg)](https://nodei.co/npm/rbacjs/)
[![dependencies Status](https://david-dm.org/zahorovskyi/rbacjs/status.svg)](https://david-dm.org/zahorovskyi/rbacjs)
[![devDependencies Status](https://david-dm.org/zahorovskyi/rbacjs/dev-status.svg)](https://david-dm.org/zahorovskyi/rbacjs?type=dev)
[![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/zahorovskyi/rbacjs/issues)
[![codecov.io Code Coverage](https://img.shields.io/codecov/c/github/zahorovskyi/rbacjs.svg)](https://codecov.io/github/zahorovskyi/rbacjs?branch=master)

[![NPM](https://nodei.co/npm/rbacjs.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/rbacjs/)

Super simple role base access control library.
The easiest API and implementation.
Can be used on the ***client*** and ***server*** side.

##### See basic example in [example.js](https://github.com/zahorovskyi/rbacjs/blob/master/example/example.js)

#### API:

Initialize RBAC with config:
```
const rbacConfig = {
    rolesConfig: [
        {
            roles: ['VIEWER_ROLE'], // role name
            permissions: ['PERMISSION_ID_1', 'PERMISSION_ID_3'] // permission name
        },
        {
            roles: ['USER_ROLE', 'USER2_ROLE'], // role name
            permissions: ['PERMISSION_ID_2'] // permission name
        }
    ]
};
const rbac = new RBAC(rolesConfig);
```
Get role for user:
```
rbac.getUserRoles(userId: string) => string[] | throw Error;
```
Add user to RBAC with role:
```
rbac.addUserRoles(userId: string, roles: string[]) => undefined | throw Error;
```
Check permission for user:
```
rbac.isAllowed(userId: string, permissionId: string) => boolead | throw Error;
```
Extend role:
```
rbac.extendRole(role: string, extendingRoles: string[]) => undefined | throw Error;

// example, expand manager role with viewers and users rights:
rbac.extendRole('manager', extendingRoles: ['viewer', 'user']);
```
Middleware method:
```
rbac.middleware(
    params: {
        userId: string;
        permissionId: string;
    },
    error: () => void,
    success: () => void
)
```

##### Express middleware example:
```
app.use((req, res, next) => {
    rbac.middleware(
        {
            userId: req.body.userId,
            permissionId: req.body.permissionId
        },
        () => {
            res.status(403).send('access denied');
        },
        next
    );
});
```
##### Redux middleware example:
```
const rbacMiddleware = store => next => action => {
    rbac.middleware(
        {
            userId: action.payload.userId,
            permissionId: action.payload.permissionId
        },
        () => {
            next({
               type: ACTION_ACCESS_DENIED,
               payload: action
            });
        },
        () => {
            next(action);
        }
    );
};

const store = createStore(
    // ...
    applyMiddleware(
        // ...
        rbacMiddleware
    )
);
```