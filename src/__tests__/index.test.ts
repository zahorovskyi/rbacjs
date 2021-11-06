import RBAC from '../index';

// @ts-expect-error
global.console = {
    warn: jest.fn()
};

const rbacConfig = {
    rolesConfig: [
        {
            roles: ['viewer'],
            permissions: ['1']
        },
        {
            roles: ['user', 'user2'],
            permissions: ['2']
        },
        {
            roles: ['manager'],
            permissions: ['3']
        },
        {
            roles: ['admin'],
            permissions: ['4']
        }
    ],
    debug: false
};

const expectedPermissions = {
    viewer: ['1'],
    user: ['2'],
    user2: ['2'],
    manager: ['3'],
    admin: ['4']
};
describe('initializing stage tests suite', () => {
    test('should initialize rbac module and create expected private permissions config from incoming data', () => {
        const rbac = new RBAC(rbacConfig);

        // @ts-expect-error
        expect(rbac.roles).toEqual(expectedPermissions);
    });
});

describe('addUserRoles method tests suite', () => {
    test('should add user with defined role', () => {
        const rbac = new RBAC(rbacConfig);
        const userId = 'uniqueId';
        const userRoles = ['user'];
        const expected = {
            [userId]: userRoles
        };

        rbac.addUserRoles(userId, userRoles);

        // @ts-expect-error
        expect(rbac.users).toEqual(expected);
    });

    test('should return error because of incoming data is incorrect, trying to add user without role', () => {
        const rbac = new RBAC(rbacConfig);
        const userId = 'uniqueId';

        expect(rbac.addUserRoles(userId, undefined)).toBeInstanceOf(Error);
    });

    test('should return error because of incoming data is incorrect, trying to add user with role which was not defined', () => {
        const rbac = new RBAC(rbacConfig);
        const userId = 'uniqueId';
        const userRoles = ['is not defined role'];

        expect(rbac.addUserRoles(userId, userRoles)).toBeInstanceOf(Error);
    });
});

describe('removeUserRoles method tests suite', () => {
    test('should remove all user roles', () => {
        const rbac = new RBAC(rbacConfig);
        const userId = 'uniqueId';
        const userRoles = ['user', 'viewer'];
        const expected = {};

        rbac.addUserRoles(userId, userRoles);
        rbac.removeUserRoles(userId);

        // @ts-expect-error
        expect(rbac.users).toEqual(expected);
    });

    test('should remove passed user roles', () => {

        const rbac = new RBAC(rbacConfig);
        const userId = 'uniqueId';
        const userRoles = ['user', 'viewer'];
        const expected = {
            [userId]: ['viewer']
        };

        rbac.addUserRoles(userId, userRoles);
        rbac.removeUserRoles(userId, ['user']);

        // @ts-expect-error
        expect(rbac.users).toEqual(expected);

    });

    test('should return error, trying to invoke method without parameters', () => {
        const rbac = new RBAC(rbacConfig);
        // @ts-expect-error
        expect(rbac.removeUserRoles()).toBeInstanceOf(Error);
    });

    test('should return error, trying to invoke method for undefined user', () => {
        const rbac = new RBAC(rbacConfig);
        const userId = 'userId';
        expect(rbac.removeUserRoles(userId)).toBeInstanceOf(Error);
    });

    test('should not remove roles', () => {
        const rbac = new RBAC(rbacConfig);
        const userId = 'uniqueId';
        const userRoles = ['user', 'viewer'];
        const expected = {
            [userId]: ['user', 'viewer']
        };

        rbac.addUserRoles(userId, userRoles);
        rbac.removeUserRoles(userId, ['admin']);

        // @ts-expect-error
        expect(rbac.users).toEqual(expected);
    });
});

describe('getUserRoles method tests suite', () => {
    test('should get user role', () => {
        const rbac = new RBAC(rbacConfig);
        const userId = 'uniqueId';
        const userRoles = ['user'];

        rbac.addUserRoles(userId, userRoles);

        expect(rbac.getUserRoles(userId)).toEqual(userRoles);
    });

    test('should return error because of incoming data is incorrect, trying to get user without passing userId', () => {
        const rbac = new RBAC(rbacConfig);

        expect(rbac.getUserRoles(undefined)).toBeInstanceOf(Error);
    });

    test('should return error because of incoming data is incorrect, trying to get user without adding it before', () => {
        const rbac = new RBAC(rbacConfig);
        const userId = 'uniqueId';

        expect(rbac.getUserRoles(userId)).toBeInstanceOf(Error);
    });
});

describe('isAllowed method tests suite', () => {
    test('should return correct isAllowed result, user do not have permission', () => {
        const rbac = new RBAC(rbacConfig);
        const userId = 'uniqueId';
        const userRoles = ['manager'];
        const permissionId = '2';

        rbac.addUserRoles(userId, userRoles);

        expect(rbac.isAllowed(userId, permissionId)).toEqual(false);
    });

    test('should return correct isAllowed result, user have permission', () => {
        const rbac = new RBAC(rbacConfig);
        const userId = 'uniqueId';
        const userRoles = ['manager', 'user'];
        const permissionId = '2';

        rbac.addUserRoles(userId, userRoles);

        expect(rbac.isAllowed(userId, permissionId)).toEqual(true);
    });

    test('should return error because of incoming data is incorrect, trying to get permission for user without passing permissionId', () => {
        const rbac = new RBAC(rbacConfig);
        const userId = 'uniqueId';

        expect(rbac.isAllowed(userId, undefined)).toBeInstanceOf(Error);
    });

    test('should return error because of incoming data is incorrect, trying to get permission for user which was not defined', () => {
        const rbac = new RBAC(rbacConfig);
        const userId = 'uniqueId';
        const permissionId = '3';

        expect(rbac.isAllowed(userId, permissionId)).toBeInstanceOf(Error);
    });
});

describe('extendRole method tests suite', () => {
    test('should return error because of incoming data is incorrect, trying to extend role without passing extending roles', () => {
        const rbac = new RBAC(rbacConfig);
        const role = 'user';

        expect(rbac.extendRole(role, [])).toBeInstanceOf(Error);
    });

    test('should return error because of incoming data is incorrect, trying to extend role which was not defined', () => {
        const rbac = new RBAC(rbacConfig);
        const role = 'is not defined role';
        const extendingRoles = ['user'];

        expect(rbac.extendRole(role, extendingRoles)).toBeInstanceOf(Error);
    });

    test('should extend role', () => {
        const rbac = new RBAC(rbacConfig);
        const role = 'manager';
        const extendingRoles = ['user'];
        const expected = {
            ...expectedPermissions,
            manager: expectedPermissions.manager.concat(expectedPermissions.user)
        };

        rbac.extendRole(role, extendingRoles);

        // @ts-expect-error
        expect(rbac.roles).toEqual(expected);
    });

    test('should return error because of incoming data is incorrect, extending role which was not defined', () => {
        const rbac = new RBAC(rbacConfig);
        const role = 'manager';
        const extendingRoles = ['is not defined role'];

        expect(rbac.extendRole(role, extendingRoles)).toBeInstanceOf(Error);

    });
});

describe('generateError method tests suite', () => {
    test('should generate error', () => {
        const rbac = new RBAC(rbacConfig);

        // @ts-expect-error
        expect(rbac.generateError('some error')).toBeInstanceOf(Error);
    });

    test('should generate quiet error, with warning in console', () => {
        rbacConfig.debug = true;
        const rbac = new RBAC(rbacConfig);

        // @ts-expect-error
        rbac.generateError('some error');

        expect(global.console.warn).toHaveBeenCalled();
    });
});

describe('middleware method tests suite', () => {
    test('should return error and invoke error callback because of incoming data is incorrect', () => {
        const rbac = new RBAC(rbacConfig);
        const errorCallback = jest.fn();
        const successCallback = () => {
        };

        expect(
            rbac.middleware(
                undefined,
                errorCallback,
                successCallback
            )
        ).toBeInstanceOf(Error);

        expect(errorCallback).toHaveBeenCalled();
    });

    test('should invoke error success callback', () => {
        const rbac = new RBAC(rbacConfig);
        const userId = 'uniqueId';
        const permissionId = '3';
        const errorCallback = jest.fn();
        const successCallback = jest.fn();

        rbac.addUserRoles(userId, ['manager']);
        rbac.middleware(
            {
                userId: userId,
                permissionId: permissionId
            },
            errorCallback,
            successCallback
        );

        expect(successCallback).toHaveBeenCalled();
    });

    test('should invoke error callback', () => {
        const rbac = new RBAC(rbacConfig);
        const userId = 'uniqueId';
        const permissionId = '2';
        const errorCallback = jest.fn();
        const successCallback = jest.fn();

        rbac.addUserRoles(userId, ['manager']);
        rbac.middleware(
            {
                userId: userId,
                permissionId: permissionId
            },
            errorCallback,
            successCallback
        );

        expect(errorCallback).toHaveBeenCalled();
    });
});

