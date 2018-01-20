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
export interface IOptions {
    rolesConfig: IRolesConfig[];
    debug?: boolean;
}
declare class RBAC implements IRBAC {
    private users;
    private debug;
    private permissions;
    constructor(options: IOptions);
    private generateError(msg);
    getUserRoles(userId: string): string[] | Error;
    addUserRoles(userId: string, roles: string[]): Error;
    removeUserRoles(userId: string, roles?: string[]): Error;
    isAllowed(userId: string, permissionId: string): boolean | Error;
    extendRole(role: string, extendingRoles: string[]): Error;
    middleware(params: {
        userId: string;
        permissionId: string;
    }, error: () => void, success: () => void): Error;
}
export default RBAC;
