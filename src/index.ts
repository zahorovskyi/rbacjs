"use strict";

export interface IOptions {
    rolesConfig: IRolesPermissions[];
}

interface IUsers {
    [userId: string]: {
        roles: string[]
    }
}

interface IPermissions {
    [permissionId: string]: string[];
}

interface IRolesPermissions {
    roles: string[],
    permissions: string[]
}

interface IMiddleware {
    (params: { userId: string; permissionId: string; }, error: () => void, success: () => void): void;
}

interface IRBAC {
    getUserRoles: (userId: string) => void | string[];
    addUserRoles: (userId: string, role: string[]) => void;
    isAllowed: (userId: string, permissionId: string) => boolean | Error;
    extendRole: (role: string, extendingRoles: string[]) => void | Error;
    middleware: IMiddleware;
}

class RBAC implements IRBAC {
    private permissions: IPermissions = {};
    private users: IUsers = {};

    constructor(options: IOptions) {
        this.permissions = options.rolesConfig.reduce(
            (accumulator: any, item: IRolesPermissions) => {
                item.roles.map((role: string) => {
                    accumulator[role] = item.permissions;
                });
                return accumulator;
            },
            {}
        );
    }

    private generateError(msg: any) {
        throw new Error(msg);
    }

    public getUserRoles(userId: string) {
        if (typeof userId === 'undefined') {
            this.generateError('userId is not defined, expected 1 arguments');
        }

        if (typeof this.users[userId] !== 'undefined') {
            return this.users[userId].roles;
        } else {
            this.generateError(userId + ' userId is nor defined, please add user to the rbac using addUserRoles method');
        }
    }

    public addUserRoles(userId: string, roles: string[]) {
        if (typeof userId === 'undefined' || typeof roles === 'undefined' || roles.length === 0) {
            this.generateError('userId or roles is not defined, or roles.length === 0, expected 2 arguments');
        }

        roles.forEach(role => {
            if (typeof this.permissions[role] !== 'undefined') {
                if (this.users[userId]) {
                    this.users[userId].roles.push(role);
                } else {
                    this.users[userId] = {
                        roles: [role]
                    };
                }
            } else {
                this.generateError(role + ' role is not defined in intial config');
            }
        });
    }

    public isAllowed(userId: string, permissionId: string) {
        if (typeof userId === 'undefined' || typeof permissionId === 'undefined') {
            this.generateError('userId or permissionId is not defined, expected 2 arguments');
        }

        const user = this.users[userId];

        if (typeof user !== 'undefined') {
            const userRoles = user.roles;
            let isAllowed = false;

            userRoles.forEach(userRole => {
                if (this.permissions[userRole].includes(permissionId)) {
                    isAllowed = true;
                }
            });

            return isAllowed;
        } else {
            this.generateError(userId + ' userId is nor defined, please add user to the rbac using addUserRoles method');
        }
    }

    public extendRole(role: string, extendingRoles: string[]) {
        if (typeof role === 'undefined' || typeof extendingRoles === 'undefined' || extendingRoles.length === 0) {
            this.generateError('role or extendingRoles is not defined, expected 2 arguments');
        }

        if (typeof this.permissions[role] !== 'undefined') {
            extendingRoles.map(extendingRole => {
                if (this.permissions[extendingRole]) {
                    this.permissions[role] = this.permissions[role]
                        .concat(this.permissions[extendingRole]);
                } else {
                    this.generateError(role + ' role is not defined in initial config');
                }
            });
        } else {
            this.generateError(role + ' role is not defined in initial config');
        }
    }

    public middleware(params: { userId: string; permissionId: string; }, error: () => void, success: () => void) {
        if (typeof params === 'undefined' ||
            typeof error === 'undefined' ||
            typeof success === 'undefined'
        ) {
            this.generateError('one of incoming parameters is not defined, expected 3 arguments')
        }

        if (this.isAllowed(params.userId, params.permissionId)) {
            success();
        } else {
            error();
        }
    }
}

export default RBAC;
