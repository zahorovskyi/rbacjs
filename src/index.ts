import { type } from "os";

interface IUsers {
    [userId: string]: {
        roles: string[]
    }
}

interface IPermissions {
    [permissionId: string]: string[];
}

export interface IRolesConfig {
    roles: string[],
    permissions: string[]
}

export interface IMiddleware {
    (params: { userId: string; permissionId: string; }, error: () => void, success: () => void): void | Error;
}

export interface IRBAC {
    getUserRoles: (userId: string) => string[] | Error;
    removeUserRoles: (userId: string, role?: string[]) => void | Error;
    addUserRoles: (userId: string, role: string[]) => void | Error;
    isAllowed: (userId: string, permissionId: string) => boolean | Error;
    extendRole: (role: string, extendingRoles: string[]) => void | Error;
    middleware: IMiddleware;
}

export interface IOptions {
    rolesConfig: IRolesConfig[];
    debug?: boolean;
}

class RBAC implements IRBAC {
    private users: IUsers = {};
    private debug: boolean;
    private permissions: IPermissions = {};

    constructor(options: IOptions) {
        this.debug = (typeof options.debug === 'undefined') ? true : options.debug;

        this.permissions = options.rolesConfig.reduce(
            (accumulator: any, item: IRolesConfig) => {
                for (let i = 0; i < item.roles.length; i++) {
                    accumulator[item.roles[i]] = item.permissions;
                }
                return accumulator;
            },
            {}
        );
    }

    private generateError(msg: any) {
        if (this.debug) {
            console.warn(msg);
        }
        return new Error(msg);
    }

    public getUserRoles(userId: string) {
        if (typeof userId === 'undefined') {
            return this.generateError('userId is not defined, expected 1 arguments');
        }

        if (typeof this.users[userId] !== 'undefined') {
            return this.users[userId].roles;
        } else {
            return this.generateError(userId + ' userId is nor defined, please add user to the rbac using addUserRoles method');
        }
    }

    public addUserRoles(userId: string, roles: string[]) {
        if (typeof userId === 'undefined' || typeof roles === 'undefined' || roles.length === 0) {
            return this.generateError('userId or roles is not defined, or roles.length === 0, expected 2 arguments');
        }

        for (let i = 0; i < roles.length; i++) {
            if (typeof this.permissions[roles[i]] !== 'undefined') {
                if (this.users[userId]) {
                    if (!this.users[userId].roles.includes(roles[i])) {
                        this.users[userId].roles.push(roles[i]);
                    }
                } else {
                    this.users[userId] = {
                        roles: [roles[i]]
                    };
                }
            } else {
                return this.generateError(roles[i] + ' role is not defined in intial config');
            }
        }
    }


    public removeUserRoles(userId: string, roles?: string[]) {
        if (typeof userId === 'undefined') {
            return this.generateError('userId is not defined, expected 1 arguments');
        }

        if (this.users[userId]) {
            if (typeof roles === 'undefined') {
                this.users[userId] = {roles: []};
            } else {
                for (let i = 0; i < roles.length; i++) {
                    this.users[userId].roles.splice(this.users[userId].roles.indexOf(roles[i]), 1);
                }
            }
        } else {
            return this.generateError(userId + ' userId is nor defined, please add user to the rbac using addUserRoles method');
        }

    }

    public isAllowed(userId: string, permissionId: string) {
        if (typeof userId === 'undefined' || typeof permissionId === 'undefined') {
            return this.generateError('userId or permissionId is not defined, expected 2 arguments');
        }

        const user = this.users[userId];

        if (typeof user !== 'undefined') {
            return user.roles.some(userRole => this.permissions[userRole].includes(permissionId));
        } else {
            return this.generateError(userId + ' userId is nor defined, please add user to the rbac using addUserRoles method');
        }
    }

    public extendRole(role: string, extendingRoles: string[]) {
        if (typeof role === 'undefined' || typeof extendingRoles === 'undefined' || extendingRoles.length === 0) {
            return this.generateError('role or extendingRoles is not defined, expected 2 arguments');
        }

        if (typeof this.permissions[role] !== 'undefined') {
            for (let i = 0; i < extendingRoles.length; i++) {
                if (this.permissions[extendingRoles[i]]) {
                    this.permissions[role] = this.permissions[role]
                        .concat(this.permissions[extendingRoles[i]]);
                } else {
                    return this.generateError(role + ' role is not defined in initial config');
                }
            }
        } else {
            return this.generateError(role + ' role is not defined in initial config');
        }
    }

    public middleware(params: { userId: string; permissionId: string; }, error: () => void, success: () => void) {
        if (typeof params === 'undefined' ||
            typeof error === 'undefined' ||
            typeof success === 'undefined'
        ) {
            error();
            return this.generateError('one of incoming parameters is not defined, expected 3 arguments');
        }

        if (this.isAllowed(params.userId, params.permissionId)) {
            success();
        } else {
            error();
        }
    }
}

export default RBAC;