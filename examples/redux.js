// 1. initialize rbac
const rbacConfig = {
    rolesConfig: [
        {
            roles: ['USER'],
            permissions: ['READ']
        },
        {
            roles: ['ADMIN'],
            permissions: ['DELETE']
        }
    ],
    debug: true
};

const rbac = new RBAC(rbacConfig);

// 2. after login add user to rbac
rbac.addUserRoles('SOME_USER_ID', ['USER']);

// 3. pass in payload object userId and permissionId for checking
const action = payload => ({
    type: 'SOME_ACTION',
    payload: {
        userId: 'SOME_USER_ID',
        permissionId: 'READ'
    }
});

// 4. define rbac middleware when creating store
const rbacMiddleware = store => next => action => {
    // you can do "store.getState" here to avoid passing user data in an action
    rbac.middleware(
        {
            userId: action.payload.userId,
            permissionId: action.payload.permissionId
        },
        // pass to rbac.middleware error callback
        () => {
            next({
                type: 'SOME_ACTION_WHEN_ACCESS_DENIED',
                payload: action
            });
        },
        // pass to rbac.middleware success callback
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
