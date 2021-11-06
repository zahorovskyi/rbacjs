export interface IRolesConfig {
    roles: string[];
    permissions: string[];
}
export interface IMiddleware {
    (params: {
        userId: string;
        permissionId: string;
    }, error: () => void, success: () => void): void | Error;
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
export declare class RBAC implements IRBAC {
    private users;
    private readonly debug;
    private readonly roles;
    constructor(config: IConfig);
    getUserRoles(userId: string): string[] | Error;
    addUserRoles(userId: string, roles: string[]): void | Error;
    removeUserRoles(userId: string, roles?: string[]): void | Error;
    isAllowed(userId: string, permissionId: string): boolean | Error;
    extendRole(role: string, extendingRoles: string[]): void | Error;
    middleware(params: {
        userId: string;
        permissionId: string;
    }, error: () => void, success: () => void): void | Error;
    private generateError;
}
export default RBAC;
