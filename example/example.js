import RBAC from 'rbacjs';

/**
 * Initialize, create new instance of rbacjs with your configuration
 */

const VIEWER_ROLE = 'viewer';
const USER_ROLE = 'user';
const USER2_ROLE = 'user2';

const PERMISSION_ID_1 = 'permissionId_1';
const PERMISSION_ID_2 = 'permissionId_2';

const rolesConfig = {
    rolesConfig: [
        {
            roles: [VIEWER_ROLE],
            permissions: [PERMISSION_ID_1]
        },
        {
            roles: [USER_ROLE, USER2_ROLE],
            permissions: [PERMISSION_ID_2]
        }
    ]
};

const rbac = new RBAC(rolesConfig);

const userId = 'userId';

/**
 * Add userId with 'viewer' role
 */
rbac.addUserRoles(userId, [VIEWER_ROLE]);

/**
 * Get roles for userId
 */
rbac.getUserRoles(userId);

/**
 * Check if user with 'userId' have PERMISSION_ID_1
 */
rbac.isAllowed(userId, PERMISSION_ID_1);

/**
 * Expand the role of the viewer with user permission
 */
rbac.extendRole(VIEWER_ROLE, [USER_ROLE]);

/**
 * Using middleware
 */

const rbacMiddleware = (data, error, success) => {
    rbac.middleware(data, error, success);
};

rbacMiddleware(
    {
        userId: userId,
        permissionId: PERMISSION_ID_1
    },
    () => {
        console.log('error callback');
    },
    () => {
        console.log('success callback');
    }
);