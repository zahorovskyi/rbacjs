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

export class RBAC implements IRBAC {
    private users: IUsers = {};
    private readonly debug: boolean;
    private readonly roles: IRoles = {};

    constructor(config: IConfig) {
        this.debug = (typeof config.debug !== 'undefined') ? config.debug : false;

        this.roles = config.rolesConfig.reduce(
            (accumulator: IRoles, item: IRolesConfig): IRoles => {
                for (let role of item.roles) {
                    accumulator[role] = item.permissions;
                }
                return accumulator;
            },
            {}
        );
    }

    public getUserRoles(userId: string): string[] | Error {
        if (!userId) {
            return this.generateError('userId is not defined, expected 1 arguments');
        }

        if (this.users[userId]) {
            return this.users[userId];
        } else {
            return this.generateError(userId + ' userId is not defined, please add a user to the RBAC using addUserRoles method');
        }
    }

    public addUserRoles(userId: string, roles: string[]): void | Error {
        if (!userId || !roles) {
            return this.generateError('userId or roles is not defined, expected 2 arguments');
        }

        if (roles.length === 0) {
            return this.generateError('roles length is 0, expected at least 1');
        }

        for (let role of roles) {
            if (this.roles[role]) {
                if (this.users[userId]) {
                    if (!this.users[userId].includes(role)) {
                        this.users[userId].push(role);
                    }
                } else {
                    this.users[userId] = [role];
                }
            } else {
                return this.generateError(role + ' role is not defined in initial config');
            }
        }
    }


    public removeUserRoles(userId: string, roles?: string[]): void | Error {
        if (!userId) {
            return this.generateError('userId is not defined, expected 1 arguments');
        }

        if (this.users[userId]) {
            if (!roles) {
                delete this.users[userId];
            } else {
                for (let role of roles) {
                    const roleIndex = this.users[userId].indexOf(role);

                    if (roleIndex + 1) {
                        this.users[userId].splice(roleIndex, 1);
                    }
                }
            }
        } else {
            return this.generateError(userId + ' userId is not defined, please add a user to the RBAC using addUserRoles method');
        }

    }

    public isAllowed(userId: string, permissionId: string): boolean | Error {
        if (!userId || !permissionId) {
            return this.generateError('userId or permissionId is not defined, expected 2 arguments');
        }

        const user = this.users[userId];

        if (user) {
            return user.some(userRole => this.roles[userRole].includes(permissionId));
        } else {
            return this.generateError(userId + ' userId is nor defined, please add user to the RBAC using addUserRoles method');
        }
    }

    public extendRole(role: string, extendingRoles: string[]): void | Error {
        if (!role || !extendingRoles) {
            return this.generateError('role or extendingRoles is not defined, expected 2 arguments');
        }

        if (extendingRoles.length === 0) {
            return this.generateError('extendingRoles length is 0, expected at least 1');
        }

        if (this.roles[role]) {
            for (let extendingRole of extendingRoles) {
                if (this.roles[extendingRole]) {
                    this.roles[role] = this.roles[role].concat(this.roles[extendingRole]);
                } else {
                    return this.generateError(role + ' role is not defined in the initial config');
                }
            }
        } else {
            return this.generateError(role + ' role is not defined in the initial config');
        }
    }

    public middleware(params: { userId: string; permissionId: string; }, error: () => void, success: () => void): void | Error {
        if (!params || !error || !success) {
            error();
            return this.generateError('one of the incoming parameters is not defined, expected 3 arguments');
        }

        if (this.isAllowed(params.userId, params.permissionId)) {
            success();
        } else {
            error();
        }
    }

    private generateError(message: any): Error {
        if (this.debug) {
            console.warn(message);
        }
        return new Error(message);
    }
}

export default RBAC;
