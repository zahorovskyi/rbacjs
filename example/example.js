import RBAC from 'rbacjs';

/**
 * Initialize, create new instance of rbacjs with your configuration
 */

const VIEWER_ROLE = 'viewer';
const USER_ROLE = 'user';
const USER2_ROLE = 'user2';

const PERMISSION_ID_1 = 'permissionId_1';
const PERMISSION_ID_2 = 'permissionId_2';

const rbacConfig = {
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

const rbac = new RBAC(rbacConfig);

/**
 * Add userId with 'viewer' role
 */
rbac.addUserRole('userId', VIEWER_ROLE);

/**
 * Check if user with 'userId' have PERMISSION_ID_1
 */
rbac.isAllowed('userId', PERMISSION_ID_1);

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
        userId: 'userId',
        permissionId: 'permissionId'
    },
    () => {
        console.log('error callback');
    },
    () => {
        console.log('success callback');
    }
);