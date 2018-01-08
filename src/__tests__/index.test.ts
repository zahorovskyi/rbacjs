import RBAC from '../index';

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
    ]
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

        expect(rbac.permissions).toEqual(expectedPermissions);
    });
});

describe('addUserRoles method tests suite', () => {
    test('[addUserRoles] should add user with defined role', () => {
        const rbac = new RBAC(rbacConfig);
        const userId = 'uniqueId';
        const userRoles = ['user'];
        const expected = {
            [userId]: {roles: userRoles}
        };

        rbac.addUserRoles(userId, userRoles);

        expect(rbac.users).toEqual(expected);
    });

    test('[addUserRoles] should return error because of incoming data is incorrect, trying to add user without role', () => {
        const rbac = new RBAC(rbacConfig);
        const userId = 'uniqueId';

        expect(() => {
            rbac.addUserRoles(userId, undefined);
        }).toThrowError();
    });

    test('[addUserRoles] should return error because of incoming data is incorrect, trying to add user with role which was not defined', () => {
        const rbac = new RBAC(rbacConfig);
        const userId = 'uniqueId';
        const userRoles = ['is not defined role'];

        expect(() => {
            rbac.addUserRoles(userId, userRoles);
        }).toThrowError();
    });
});

describe('getUserRoles method tests suite', () => {
    test('[getUserRoles] should get user role', () => {
        const rbac = new RBAC(rbacConfig);
        const userId = 'uniqueId';
        const userRoles = ['user'];

        rbac.addUserRoles(userId, userRoles);

        expect(rbac.getUserRoles(userId)).toEqual(userRoles);
    });

    test('[getUserRoles] should return error because of incoming data is incorrect, trying to get user without passing userId', () => {
        const rbac = new RBAC(rbacConfig);

        expect(() => {
            rbac.getUserRoles(undefined);
        }).toThrowError();
    });

    test('[getUserRoles] should return error because of incoming data is incorrect, trying to get user without adding it before', () => {
        const rbac = new RBAC(rbacConfig);
        const userId = 'uniqueId';

        expect(() => {
            rbac.getUserRoles(userId);
        }).toThrowError();
    });
});

describe('isAllowed method tests suite', () => {
    test('[isAllowed] should return correct isAllowed result, user do not have permission', () => {
        const rbac = new RBAC(rbacConfig);
        const userId = 'uniqueId';
        const userRoles = ['manager'];
        const permissionId = '2';

        rbac.addUserRoles(userId, userRoles);

        expect(rbac.isAllowed(userId, permissionId)).toEqual(false);
    });

    test('[isAllowed] should return correct isAllowed result, user have permission', () => {
        const rbac = new RBAC(rbacConfig);
        const userId = 'uniqueId';
        const userRoles = ['manager', 'user'];
        const permissionId = '2';

        rbac.addUserRoles(userId, userRoles);

        expect(rbac.isAllowed(userId, permissionId)).toEqual(true);
    });

    test('[isAllowed] should return error because of incoming data is incorrect, trying to get permission for user without passing permissionId', () => {
        const rbac = new RBAC(rbacConfig);
        const userId = 'uniqueId';

        expect(() => {
            rbac.isAllowed(userId, undefined);
        }).toThrowError();
    });

    test('[isAllowed] should return error because of incoming data is incorrect, trying to get permission for user which was not defined', () => {
        const rbac = new RBAC(rbacConfig);
        const userId = 'uniqueId';
        const permissionId = '3';

        expect(() => {
            rbac.isAllowed(userId, permissionId);
        }).toThrowError();
    });
});

describe('extendRole method tests suite', () => {
    test('[extendRole] should return error because of incoming data is incorrect, trying to extend role without passing extending roles', () => {
        const rbac = new RBAC(rbacConfig);
        const role = 'user';

        expect(() => {
            rbac.extendRole(role, []);
        }).toThrowError();
    });

    test('[extendRole] should return error because of incoming data is incorrect, trying to extend role which was not defined', () => {
        const rbac = new RBAC(rbacConfig);
        const role = 'is not defined role';
        const extendingRoles = ['user'];

        expect(() => {
            rbac.extendRole(role, extendingRoles);
        }).toThrowError();
    });

    test('[extendRole] should extend role', () => {
        const rbac = new RBAC(rbacConfig);
        const role = 'manager';
        const extendingRoles = ['user'];
        const expected = {
            ...expectedPermissions,
            manager: expectedPermissions.manager.concat(expectedPermissions.user)
        };

        rbac.extendRole(role, extendingRoles);

        expect(rbac.permissions).toEqual(expected);
    });

    test('[extendRole] should return error because of incoming data is incorrect, extending role which was not defined', () => {
        const rbac = new RBAC(rbacConfig);
        const role = 'manager';
        const extendingRoles = ['is not defined role'];

        expect(() => {
            rbac.extendRole(role, extendingRoles);
        }).toThrowError();
    });
});

describe('generateError method tests suite', () => {
    test('[generateError] should generate throw', () => {
        const rbac = new RBAC(rbacConfig);

        expect(() => {
            rbac.generateError('some error');
        }).toThrowError();
    });
});

describe('middleware method tests suite', () => {
    test('[middleware] should return error because of incoming data is incorrect', () => {
        const rbac = new RBAC(rbacConfig);
        const errorCallback = () => {
        };
        const successCallback = () => {
        };

        expect(() => {
            rbac.middleware(
                undefined,
                errorCallback,
                successCallback
            )
        }).toThrowError();
    });

    test('[middleware] should invoke error success callback', () => {
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

    test('[middleware] should invoke error error callback', () => {
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

