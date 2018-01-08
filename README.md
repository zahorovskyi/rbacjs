# rbacjs

### Role base access control

[![NPM](https://nodei.co/npm/rbacjs.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/rbacjs/)

Super simple role base access control library.
The easiest API and implementation.
Can be used on the ***client*** and ***server*** side.

### Examples:
##### See basic example in [example.js](https://github.com/zahorovskyi/rbacjs/blob/master/example/example.js)
##### Express example:
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
##### Redux example:
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
rbac.getUserRole(userId: string);
```
Add user to RBAC with role:
```
rbac.addUserRole(userId: string, role: string);
```
Check permission for user:
```
rbac.isAllowed(userId: string, permissionId: string);
```
Extend role :
```
rbac.extendRole(role: string, extendingRoles: string[])
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