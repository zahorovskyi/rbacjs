interface IUsers {
    [userId: string]: string[]
}

interface IRoles {
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

export interface IConfig {
    rolesConfig: IRolesConfig[];
    debug?: boolean;
}

class RBAC implements IRBAC {
    private debug: boolean;
    private users: IUsers = {};
    private roles: IRoles = {};

    constructor(config: IConfig) {
        this.debug = (typeof config.debug === 'undefined') ? true : config.debug;

        this.roles = config.rolesConfig.reduce(
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
            return this.users[userId];
        } else {
            return this.generateError(userId + ' userId is nor defined, please add user to the rbac using addUserRoles method');
        }
    }

    public addUserRoles(userId: string, roles: string[]) {
        if (typeof userId === 'undefined' || typeof roles === 'undefined' || roles.length === 0) {
            return this.generateError('userId or roles is not defined, or roles.length === 0, expected 2 arguments');
        }

        for (let i = 0; i < roles.length; i++) {
            if (typeof this.roles[roles[i]] !== 'undefined') {
                if (this.users[userId]) {
                    if (!this.users[userId].includes(roles[i])) {
                        this.users[userId].push(roles[i]);
                    }
                } else {
                    this.users[userId] = [roles[i]];
                }
            } else {
                return this.generateError(roles[i] + ' role is not defined in initial config');
            }
        }
    }


    public removeUserRoles(userId: string, roles?: string[]) {
        if (typeof userId === 'undefined') {
            return this.generateError('userId is not defined, expected 1 arguments');
        }

        if (this.users[userId]) {
            if (typeof roles === 'undefined') {
                delete this.users[userId];
            } else {
                for (let i = 0; i < roles.length; i++) {
                    const roleIndex = this.users[userId].indexOf(roles[i]);
                    if (roleIndex + 1) {
                        this.users[userId].splice(roleIndex, 1);
                    }
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
            return user.some(userRole => this.roles[userRole].includes(permissionId));
        } else {
            return this.generateError(userId + ' userId is nor defined, please add user to the rbac using addUserRoles method');
        }
    }

    public extendRole(role: string, extendingRoles: string[]) {
        if (typeof role === 'undefined' || typeof extendingRoles === 'undefined' || extendingRoles.length === 0) {
            return this.generateError('role or extendingRoles is not defined, expected 2 arguments');
        }

        if (typeof this.roles[role] !== 'undefined') {
            for (let i = 0; i < extendingRoles.length; i++) {
                if (this.roles[extendingRoles[i]]) {
                    this.roles[role] = this.roles[role]
                        .concat(this.roles[extendingRoles[i]]);
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