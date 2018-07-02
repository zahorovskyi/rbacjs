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
    debug: false
};

const rbac = new RBAC(rbacConfig);

// 2. after login add user to rbac
rbac.addUserRoles('SOME_USER_ID', ['USER']);

// 3. add rbac middleware to app
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