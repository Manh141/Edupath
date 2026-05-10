
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model Role
 * 
 */
export type Role = $Result.DefaultSelection<Prisma.$RolePayload>
/**
 * Model AuthAccount
 * 
 */
export type AuthAccount = $Result.DefaultSelection<Prisma.$AuthAccountPayload>
/**
 * Model AuthAccountRole
 * 
 */
export type AuthAccountRole = $Result.DefaultSelection<Prisma.$AuthAccountRolePayload>
/**
 * Model OAuthProviderAccount
 * 
 */
export type OAuthProviderAccount = $Result.DefaultSelection<Prisma.$OAuthProviderAccountPayload>
/**
 * Model AuthSession
 * 
 */
export type AuthSession = $Result.DefaultSelection<Prisma.$AuthSessionPayload>
/**
 * Model AuthToken
 * 
 */
export type AuthToken = $Result.DefaultSelection<Prisma.$AuthTokenPayload>
/**
 * Model AuthChallenge
 * 
 */
export type AuthChallenge = $Result.DefaultSelection<Prisma.$AuthChallengePayload>
/**
 * Model AuditLog
 * 
 */
export type AuditLog = $Result.DefaultSelection<Prisma.$AuditLogPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const AuthProvider: {
  local: 'local',
  google: 'google',
  facebook: 'facebook'
};

export type AuthProvider = (typeof AuthProvider)[keyof typeof AuthProvider]


export const AuthStatus: {
  pending_verification: 'pending_verification',
  active: 'active',
  suspended: 'suspended',
  disabled: 'disabled'
};

export type AuthStatus = (typeof AuthStatus)[keyof typeof AuthStatus]


export const SessionStatus: {
  active: 'active',
  revoked: 'revoked',
  expired: 'expired'
};

export type SessionStatus = (typeof SessionStatus)[keyof typeof SessionStatus]


export const TokenPurpose: {
  email_verification: 'email_verification',
  password_reset: 'password_reset'
};

export type TokenPurpose = (typeof TokenPurpose)[keyof typeof TokenPurpose]


export const AuthChallengePurpose: {
  register_email: 'register_email',
  login_email: 'login_email'
};

export type AuthChallengePurpose = (typeof AuthChallengePurpose)[keyof typeof AuthChallengePurpose]


export const AuditAction: {
  ADMIN_BOOTSTRAP: 'ADMIN_BOOTSTRAP',
  ROLE_GRANTED: 'ROLE_GRANTED',
  ROLE_REVOKED: 'ROLE_REVOKED',
  ACCOUNT_SUSPENDED: 'ACCOUNT_SUSPENDED',
  ACCOUNT_ENABLED: 'ACCOUNT_ENABLED',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGOUT: 'LOGOUT',
  REFRESH_TOKEN_ROTATED: 'REFRESH_TOKEN_ROTATED',
  ADMIN_ACCESSED_RESOURCE: 'ADMIN_ACCESSED_RESOURCE'
};

export type AuditAction = (typeof AuditAction)[keyof typeof AuditAction]

}

export type AuthProvider = $Enums.AuthProvider

export const AuthProvider: typeof $Enums.AuthProvider

export type AuthStatus = $Enums.AuthStatus

export const AuthStatus: typeof $Enums.AuthStatus

export type SessionStatus = $Enums.SessionStatus

export const SessionStatus: typeof $Enums.SessionStatus

export type TokenPurpose = $Enums.TokenPurpose

export const TokenPurpose: typeof $Enums.TokenPurpose

export type AuthChallengePurpose = $Enums.AuthChallengePurpose

export const AuthChallengePurpose: typeof $Enums.AuthChallengePurpose

export type AuditAction = $Enums.AuditAction

export const AuditAction: typeof $Enums.AuditAction

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Roles
 * const roles = await prisma.role.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Roles
   * const roles = await prisma.role.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.role`: Exposes CRUD operations for the **Role** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Roles
    * const roles = await prisma.role.findMany()
    * ```
    */
  get role(): Prisma.RoleDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.authAccount`: Exposes CRUD operations for the **AuthAccount** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AuthAccounts
    * const authAccounts = await prisma.authAccount.findMany()
    * ```
    */
  get authAccount(): Prisma.AuthAccountDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.authAccountRole`: Exposes CRUD operations for the **AuthAccountRole** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AuthAccountRoles
    * const authAccountRoles = await prisma.authAccountRole.findMany()
    * ```
    */
  get authAccountRole(): Prisma.AuthAccountRoleDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.oAuthProviderAccount`: Exposes CRUD operations for the **OAuthProviderAccount** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more OAuthProviderAccounts
    * const oAuthProviderAccounts = await prisma.oAuthProviderAccount.findMany()
    * ```
    */
  get oAuthProviderAccount(): Prisma.OAuthProviderAccountDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.authSession`: Exposes CRUD operations for the **AuthSession** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AuthSessions
    * const authSessions = await prisma.authSession.findMany()
    * ```
    */
  get authSession(): Prisma.AuthSessionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.authToken`: Exposes CRUD operations for the **AuthToken** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AuthTokens
    * const authTokens = await prisma.authToken.findMany()
    * ```
    */
  get authToken(): Prisma.AuthTokenDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.authChallenge`: Exposes CRUD operations for the **AuthChallenge** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AuthChallenges
    * const authChallenges = await prisma.authChallenge.findMany()
    * ```
    */
  get authChallenge(): Prisma.AuthChallengeDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.auditLog`: Exposes CRUD operations for the **AuditLog** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AuditLogs
    * const auditLogs = await prisma.auditLog.findMany()
    * ```
    */
  get auditLog(): Prisma.AuditLogDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.19.0
   * Query Engine version: 2ba551f319ab1df4bc874a89965d8b3641056773
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    Role: 'Role',
    AuthAccount: 'AuthAccount',
    AuthAccountRole: 'AuthAccountRole',
    OAuthProviderAccount: 'OAuthProviderAccount',
    AuthSession: 'AuthSession',
    AuthToken: 'AuthToken',
    AuthChallenge: 'AuthChallenge',
    AuditLog: 'AuditLog'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "role" | "authAccount" | "authAccountRole" | "oAuthProviderAccount" | "authSession" | "authToken" | "authChallenge" | "auditLog"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Role: {
        payload: Prisma.$RolePayload<ExtArgs>
        fields: Prisma.RoleFieldRefs
        operations: {
          findUnique: {
            args: Prisma.RoleFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.RoleFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePayload>
          }
          findFirst: {
            args: Prisma.RoleFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.RoleFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePayload>
          }
          findMany: {
            args: Prisma.RoleFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePayload>[]
          }
          create: {
            args: Prisma.RoleCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePayload>
          }
          createMany: {
            args: Prisma.RoleCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.RoleCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePayload>[]
          }
          delete: {
            args: Prisma.RoleDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePayload>
          }
          update: {
            args: Prisma.RoleUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePayload>
          }
          deleteMany: {
            args: Prisma.RoleDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.RoleUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.RoleUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePayload>[]
          }
          upsert: {
            args: Prisma.RoleUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePayload>
          }
          aggregate: {
            args: Prisma.RoleAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateRole>
          }
          groupBy: {
            args: Prisma.RoleGroupByArgs<ExtArgs>
            result: $Utils.Optional<RoleGroupByOutputType>[]
          }
          count: {
            args: Prisma.RoleCountArgs<ExtArgs>
            result: $Utils.Optional<RoleCountAggregateOutputType> | number
          }
        }
      }
      AuthAccount: {
        payload: Prisma.$AuthAccountPayload<ExtArgs>
        fields: Prisma.AuthAccountFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AuthAccountFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthAccountPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AuthAccountFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthAccountPayload>
          }
          findFirst: {
            args: Prisma.AuthAccountFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthAccountPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AuthAccountFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthAccountPayload>
          }
          findMany: {
            args: Prisma.AuthAccountFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthAccountPayload>[]
          }
          create: {
            args: Prisma.AuthAccountCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthAccountPayload>
          }
          createMany: {
            args: Prisma.AuthAccountCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AuthAccountCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthAccountPayload>[]
          }
          delete: {
            args: Prisma.AuthAccountDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthAccountPayload>
          }
          update: {
            args: Prisma.AuthAccountUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthAccountPayload>
          }
          deleteMany: {
            args: Prisma.AuthAccountDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AuthAccountUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AuthAccountUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthAccountPayload>[]
          }
          upsert: {
            args: Prisma.AuthAccountUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthAccountPayload>
          }
          aggregate: {
            args: Prisma.AuthAccountAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAuthAccount>
          }
          groupBy: {
            args: Prisma.AuthAccountGroupByArgs<ExtArgs>
            result: $Utils.Optional<AuthAccountGroupByOutputType>[]
          }
          count: {
            args: Prisma.AuthAccountCountArgs<ExtArgs>
            result: $Utils.Optional<AuthAccountCountAggregateOutputType> | number
          }
        }
      }
      AuthAccountRole: {
        payload: Prisma.$AuthAccountRolePayload<ExtArgs>
        fields: Prisma.AuthAccountRoleFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AuthAccountRoleFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthAccountRolePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AuthAccountRoleFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthAccountRolePayload>
          }
          findFirst: {
            args: Prisma.AuthAccountRoleFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthAccountRolePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AuthAccountRoleFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthAccountRolePayload>
          }
          findMany: {
            args: Prisma.AuthAccountRoleFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthAccountRolePayload>[]
          }
          create: {
            args: Prisma.AuthAccountRoleCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthAccountRolePayload>
          }
          createMany: {
            args: Prisma.AuthAccountRoleCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AuthAccountRoleCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthAccountRolePayload>[]
          }
          delete: {
            args: Prisma.AuthAccountRoleDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthAccountRolePayload>
          }
          update: {
            args: Prisma.AuthAccountRoleUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthAccountRolePayload>
          }
          deleteMany: {
            args: Prisma.AuthAccountRoleDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AuthAccountRoleUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AuthAccountRoleUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthAccountRolePayload>[]
          }
          upsert: {
            args: Prisma.AuthAccountRoleUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthAccountRolePayload>
          }
          aggregate: {
            args: Prisma.AuthAccountRoleAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAuthAccountRole>
          }
          groupBy: {
            args: Prisma.AuthAccountRoleGroupByArgs<ExtArgs>
            result: $Utils.Optional<AuthAccountRoleGroupByOutputType>[]
          }
          count: {
            args: Prisma.AuthAccountRoleCountArgs<ExtArgs>
            result: $Utils.Optional<AuthAccountRoleCountAggregateOutputType> | number
          }
        }
      }
      OAuthProviderAccount: {
        payload: Prisma.$OAuthProviderAccountPayload<ExtArgs>
        fields: Prisma.OAuthProviderAccountFieldRefs
        operations: {
          findUnique: {
            args: Prisma.OAuthProviderAccountFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OAuthProviderAccountPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.OAuthProviderAccountFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OAuthProviderAccountPayload>
          }
          findFirst: {
            args: Prisma.OAuthProviderAccountFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OAuthProviderAccountPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.OAuthProviderAccountFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OAuthProviderAccountPayload>
          }
          findMany: {
            args: Prisma.OAuthProviderAccountFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OAuthProviderAccountPayload>[]
          }
          create: {
            args: Prisma.OAuthProviderAccountCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OAuthProviderAccountPayload>
          }
          createMany: {
            args: Prisma.OAuthProviderAccountCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.OAuthProviderAccountCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OAuthProviderAccountPayload>[]
          }
          delete: {
            args: Prisma.OAuthProviderAccountDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OAuthProviderAccountPayload>
          }
          update: {
            args: Prisma.OAuthProviderAccountUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OAuthProviderAccountPayload>
          }
          deleteMany: {
            args: Prisma.OAuthProviderAccountDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.OAuthProviderAccountUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.OAuthProviderAccountUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OAuthProviderAccountPayload>[]
          }
          upsert: {
            args: Prisma.OAuthProviderAccountUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OAuthProviderAccountPayload>
          }
          aggregate: {
            args: Prisma.OAuthProviderAccountAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateOAuthProviderAccount>
          }
          groupBy: {
            args: Prisma.OAuthProviderAccountGroupByArgs<ExtArgs>
            result: $Utils.Optional<OAuthProviderAccountGroupByOutputType>[]
          }
          count: {
            args: Prisma.OAuthProviderAccountCountArgs<ExtArgs>
            result: $Utils.Optional<OAuthProviderAccountCountAggregateOutputType> | number
          }
        }
      }
      AuthSession: {
        payload: Prisma.$AuthSessionPayload<ExtArgs>
        fields: Prisma.AuthSessionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AuthSessionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthSessionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AuthSessionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthSessionPayload>
          }
          findFirst: {
            args: Prisma.AuthSessionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthSessionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AuthSessionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthSessionPayload>
          }
          findMany: {
            args: Prisma.AuthSessionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthSessionPayload>[]
          }
          create: {
            args: Prisma.AuthSessionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthSessionPayload>
          }
          createMany: {
            args: Prisma.AuthSessionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AuthSessionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthSessionPayload>[]
          }
          delete: {
            args: Prisma.AuthSessionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthSessionPayload>
          }
          update: {
            args: Prisma.AuthSessionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthSessionPayload>
          }
          deleteMany: {
            args: Prisma.AuthSessionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AuthSessionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AuthSessionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthSessionPayload>[]
          }
          upsert: {
            args: Prisma.AuthSessionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthSessionPayload>
          }
          aggregate: {
            args: Prisma.AuthSessionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAuthSession>
          }
          groupBy: {
            args: Prisma.AuthSessionGroupByArgs<ExtArgs>
            result: $Utils.Optional<AuthSessionGroupByOutputType>[]
          }
          count: {
            args: Prisma.AuthSessionCountArgs<ExtArgs>
            result: $Utils.Optional<AuthSessionCountAggregateOutputType> | number
          }
        }
      }
      AuthToken: {
        payload: Prisma.$AuthTokenPayload<ExtArgs>
        fields: Prisma.AuthTokenFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AuthTokenFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthTokenPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AuthTokenFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthTokenPayload>
          }
          findFirst: {
            args: Prisma.AuthTokenFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthTokenPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AuthTokenFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthTokenPayload>
          }
          findMany: {
            args: Prisma.AuthTokenFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthTokenPayload>[]
          }
          create: {
            args: Prisma.AuthTokenCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthTokenPayload>
          }
          createMany: {
            args: Prisma.AuthTokenCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AuthTokenCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthTokenPayload>[]
          }
          delete: {
            args: Prisma.AuthTokenDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthTokenPayload>
          }
          update: {
            args: Prisma.AuthTokenUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthTokenPayload>
          }
          deleteMany: {
            args: Prisma.AuthTokenDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AuthTokenUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AuthTokenUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthTokenPayload>[]
          }
          upsert: {
            args: Prisma.AuthTokenUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthTokenPayload>
          }
          aggregate: {
            args: Prisma.AuthTokenAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAuthToken>
          }
          groupBy: {
            args: Prisma.AuthTokenGroupByArgs<ExtArgs>
            result: $Utils.Optional<AuthTokenGroupByOutputType>[]
          }
          count: {
            args: Prisma.AuthTokenCountArgs<ExtArgs>
            result: $Utils.Optional<AuthTokenCountAggregateOutputType> | number
          }
        }
      }
      AuthChallenge: {
        payload: Prisma.$AuthChallengePayload<ExtArgs>
        fields: Prisma.AuthChallengeFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AuthChallengeFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthChallengePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AuthChallengeFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthChallengePayload>
          }
          findFirst: {
            args: Prisma.AuthChallengeFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthChallengePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AuthChallengeFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthChallengePayload>
          }
          findMany: {
            args: Prisma.AuthChallengeFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthChallengePayload>[]
          }
          create: {
            args: Prisma.AuthChallengeCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthChallengePayload>
          }
          createMany: {
            args: Prisma.AuthChallengeCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AuthChallengeCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthChallengePayload>[]
          }
          delete: {
            args: Prisma.AuthChallengeDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthChallengePayload>
          }
          update: {
            args: Prisma.AuthChallengeUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthChallengePayload>
          }
          deleteMany: {
            args: Prisma.AuthChallengeDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AuthChallengeUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AuthChallengeUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthChallengePayload>[]
          }
          upsert: {
            args: Prisma.AuthChallengeUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthChallengePayload>
          }
          aggregate: {
            args: Prisma.AuthChallengeAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAuthChallenge>
          }
          groupBy: {
            args: Prisma.AuthChallengeGroupByArgs<ExtArgs>
            result: $Utils.Optional<AuthChallengeGroupByOutputType>[]
          }
          count: {
            args: Prisma.AuthChallengeCountArgs<ExtArgs>
            result: $Utils.Optional<AuthChallengeCountAggregateOutputType> | number
          }
        }
      }
      AuditLog: {
        payload: Prisma.$AuditLogPayload<ExtArgs>
        fields: Prisma.AuditLogFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AuditLogFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AuditLogFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          findFirst: {
            args: Prisma.AuditLogFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AuditLogFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          findMany: {
            args: Prisma.AuditLogFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>[]
          }
          create: {
            args: Prisma.AuditLogCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          createMany: {
            args: Prisma.AuditLogCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AuditLogCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>[]
          }
          delete: {
            args: Prisma.AuditLogDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          update: {
            args: Prisma.AuditLogUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          deleteMany: {
            args: Prisma.AuditLogDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AuditLogUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AuditLogUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>[]
          }
          upsert: {
            args: Prisma.AuditLogUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          aggregate: {
            args: Prisma.AuditLogAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAuditLog>
          }
          groupBy: {
            args: Prisma.AuditLogGroupByArgs<ExtArgs>
            result: $Utils.Optional<AuditLogGroupByOutputType>[]
          }
          count: {
            args: Prisma.AuditLogCountArgs<ExtArgs>
            result: $Utils.Optional<AuditLogCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory | null
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    role?: RoleOmit
    authAccount?: AuthAccountOmit
    authAccountRole?: AuthAccountRoleOmit
    oAuthProviderAccount?: OAuthProviderAccountOmit
    authSession?: AuthSessionOmit
    authToken?: AuthTokenOmit
    authChallenge?: AuthChallengeOmit
    auditLog?: AuditLogOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type RoleCountOutputType
   */

  export type RoleCountOutputType = {
    accounts: number
    accountRoles: number
  }

  export type RoleCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    accounts?: boolean | RoleCountOutputTypeCountAccountsArgs
    accountRoles?: boolean | RoleCountOutputTypeCountAccountRolesArgs
  }

  // Custom InputTypes
  /**
   * RoleCountOutputType without action
   */
  export type RoleCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoleCountOutputType
     */
    select?: RoleCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * RoleCountOutputType without action
   */
  export type RoleCountOutputTypeCountAccountsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AuthAccountWhereInput
  }

  /**
   * RoleCountOutputType without action
   */
  export type RoleCountOutputTypeCountAccountRolesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AuthAccountRoleWhereInput
  }


  /**
   * Count Type AuthAccountCountOutputType
   */

  export type AuthAccountCountOutputType = {
    oauthAccounts: number
    sessions: number
    tokens: number
    accountRoles: number
    grantedRoles: number
    challenges: number
  }

  export type AuthAccountCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    oauthAccounts?: boolean | AuthAccountCountOutputTypeCountOauthAccountsArgs
    sessions?: boolean | AuthAccountCountOutputTypeCountSessionsArgs
    tokens?: boolean | AuthAccountCountOutputTypeCountTokensArgs
    accountRoles?: boolean | AuthAccountCountOutputTypeCountAccountRolesArgs
    grantedRoles?: boolean | AuthAccountCountOutputTypeCountGrantedRolesArgs
    challenges?: boolean | AuthAccountCountOutputTypeCountChallengesArgs
  }

  // Custom InputTypes
  /**
   * AuthAccountCountOutputType without action
   */
  export type AuthAccountCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuthAccountCountOutputType
     */
    select?: AuthAccountCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * AuthAccountCountOutputType without action
   */
  export type AuthAccountCountOutputTypeCountOauthAccountsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: OAuthProviderAccountWhereInput
  }

  /**
   * AuthAccountCountOutputType without action
   */
  export type AuthAccountCountOutputTypeCountSessionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AuthSessionWhereInput
  }

  /**
   * AuthAccountCountOutputType without action
   */
  export type AuthAccountCountOutputTypeCountTokensArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AuthTokenWhereInput
  }

  /**
   * AuthAccountCountOutputType without action
   */
  export type AuthAccountCountOutputTypeCountAccountRolesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AuthAccountRoleWhereInput
  }

  /**
   * AuthAccountCountOutputType without action
   */
  export type AuthAccountCountOutputTypeCountGrantedRolesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AuthAccountRoleWhereInput
  }

  /**
   * AuthAccountCountOutputType without action
   */
  export type AuthAccountCountOutputTypeCountChallengesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AuthChallengeWhereInput
  }


  /**
   * Models
   */

  /**
   * Model Role
   */

  export type AggregateRole = {
    _count: RoleCountAggregateOutputType | null
    _avg: RoleAvgAggregateOutputType | null
    _sum: RoleSumAggregateOutputType | null
    _min: RoleMinAggregateOutputType | null
    _max: RoleMaxAggregateOutputType | null
  }

  export type RoleAvgAggregateOutputType = {
    id: number | null
  }

  export type RoleSumAggregateOutputType = {
    id: number | null
  }

  export type RoleMinAggregateOutputType = {
    id: number | null
    name: string | null
    description: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type RoleMaxAggregateOutputType = {
    id: number | null
    name: string | null
    description: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type RoleCountAggregateOutputType = {
    id: number
    name: number
    description: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type RoleAvgAggregateInputType = {
    id?: true
  }

  export type RoleSumAggregateInputType = {
    id?: true
  }

  export type RoleMinAggregateInputType = {
    id?: true
    name?: true
    description?: true
    createdAt?: true
    updatedAt?: true
  }

  export type RoleMaxAggregateInputType = {
    id?: true
    name?: true
    description?: true
    createdAt?: true
    updatedAt?: true
  }

  export type RoleCountAggregateInputType = {
    id?: true
    name?: true
    description?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type RoleAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Role to aggregate.
     */
    where?: RoleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Roles to fetch.
     */
    orderBy?: RoleOrderByWithRelationInput | RoleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: RoleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Roles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Roles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Roles
    **/
    _count?: true | RoleCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: RoleAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: RoleSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: RoleMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: RoleMaxAggregateInputType
  }

  export type GetRoleAggregateType<T extends RoleAggregateArgs> = {
        [P in keyof T & keyof AggregateRole]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateRole[P]>
      : GetScalarType<T[P], AggregateRole[P]>
  }




  export type RoleGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RoleWhereInput
    orderBy?: RoleOrderByWithAggregationInput | RoleOrderByWithAggregationInput[]
    by: RoleScalarFieldEnum[] | RoleScalarFieldEnum
    having?: RoleScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: RoleCountAggregateInputType | true
    _avg?: RoleAvgAggregateInputType
    _sum?: RoleSumAggregateInputType
    _min?: RoleMinAggregateInputType
    _max?: RoleMaxAggregateInputType
  }

  export type RoleGroupByOutputType = {
    id: number
    name: string
    description: string | null
    createdAt: Date
    updatedAt: Date
    _count: RoleCountAggregateOutputType | null
    _avg: RoleAvgAggregateOutputType | null
    _sum: RoleSumAggregateOutputType | null
    _min: RoleMinAggregateOutputType | null
    _max: RoleMaxAggregateOutputType | null
  }

  type GetRoleGroupByPayload<T extends RoleGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<RoleGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof RoleGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], RoleGroupByOutputType[P]>
            : GetScalarType<T[P], RoleGroupByOutputType[P]>
        }
      >
    >


  export type RoleSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    accounts?: boolean | Role$accountsArgs<ExtArgs>
    accountRoles?: boolean | Role$accountRolesArgs<ExtArgs>
    _count?: boolean | RoleCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["role"]>

  export type RoleSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["role"]>

  export type RoleSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["role"]>

  export type RoleSelectScalar = {
    id?: boolean
    name?: boolean
    description?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type RoleOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "description" | "createdAt" | "updatedAt", ExtArgs["result"]["role"]>
  export type RoleInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    accounts?: boolean | Role$accountsArgs<ExtArgs>
    accountRoles?: boolean | Role$accountRolesArgs<ExtArgs>
    _count?: boolean | RoleCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type RoleIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type RoleIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $RolePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Role"
    objects: {
      accounts: Prisma.$AuthAccountPayload<ExtArgs>[]
      accountRoles: Prisma.$AuthAccountRolePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      name: string
      description: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["role"]>
    composites: {}
  }

  type RoleGetPayload<S extends boolean | null | undefined | RoleDefaultArgs> = $Result.GetResult<Prisma.$RolePayload, S>

  type RoleCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<RoleFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: RoleCountAggregateInputType | true
    }

  export interface RoleDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Role'], meta: { name: 'Role' } }
    /**
     * Find zero or one Role that matches the filter.
     * @param {RoleFindUniqueArgs} args - Arguments to find a Role
     * @example
     * // Get one Role
     * const role = await prisma.role.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends RoleFindUniqueArgs>(args: SelectSubset<T, RoleFindUniqueArgs<ExtArgs>>): Prisma__RoleClient<$Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Role that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {RoleFindUniqueOrThrowArgs} args - Arguments to find a Role
     * @example
     * // Get one Role
     * const role = await prisma.role.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends RoleFindUniqueOrThrowArgs>(args: SelectSubset<T, RoleFindUniqueOrThrowArgs<ExtArgs>>): Prisma__RoleClient<$Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Role that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoleFindFirstArgs} args - Arguments to find a Role
     * @example
     * // Get one Role
     * const role = await prisma.role.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends RoleFindFirstArgs>(args?: SelectSubset<T, RoleFindFirstArgs<ExtArgs>>): Prisma__RoleClient<$Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Role that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoleFindFirstOrThrowArgs} args - Arguments to find a Role
     * @example
     * // Get one Role
     * const role = await prisma.role.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends RoleFindFirstOrThrowArgs>(args?: SelectSubset<T, RoleFindFirstOrThrowArgs<ExtArgs>>): Prisma__RoleClient<$Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Roles that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoleFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Roles
     * const roles = await prisma.role.findMany()
     * 
     * // Get first 10 Roles
     * const roles = await prisma.role.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const roleWithIdOnly = await prisma.role.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends RoleFindManyArgs>(args?: SelectSubset<T, RoleFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Role.
     * @param {RoleCreateArgs} args - Arguments to create a Role.
     * @example
     * // Create one Role
     * const Role = await prisma.role.create({
     *   data: {
     *     // ... data to create a Role
     *   }
     * })
     * 
     */
    create<T extends RoleCreateArgs>(args: SelectSubset<T, RoleCreateArgs<ExtArgs>>): Prisma__RoleClient<$Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Roles.
     * @param {RoleCreateManyArgs} args - Arguments to create many Roles.
     * @example
     * // Create many Roles
     * const role = await prisma.role.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends RoleCreateManyArgs>(args?: SelectSubset<T, RoleCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Roles and returns the data saved in the database.
     * @param {RoleCreateManyAndReturnArgs} args - Arguments to create many Roles.
     * @example
     * // Create many Roles
     * const role = await prisma.role.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Roles and only return the `id`
     * const roleWithIdOnly = await prisma.role.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends RoleCreateManyAndReturnArgs>(args?: SelectSubset<T, RoleCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Role.
     * @param {RoleDeleteArgs} args - Arguments to delete one Role.
     * @example
     * // Delete one Role
     * const Role = await prisma.role.delete({
     *   where: {
     *     // ... filter to delete one Role
     *   }
     * })
     * 
     */
    delete<T extends RoleDeleteArgs>(args: SelectSubset<T, RoleDeleteArgs<ExtArgs>>): Prisma__RoleClient<$Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Role.
     * @param {RoleUpdateArgs} args - Arguments to update one Role.
     * @example
     * // Update one Role
     * const role = await prisma.role.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends RoleUpdateArgs>(args: SelectSubset<T, RoleUpdateArgs<ExtArgs>>): Prisma__RoleClient<$Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Roles.
     * @param {RoleDeleteManyArgs} args - Arguments to filter Roles to delete.
     * @example
     * // Delete a few Roles
     * const { count } = await prisma.role.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends RoleDeleteManyArgs>(args?: SelectSubset<T, RoleDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Roles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoleUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Roles
     * const role = await prisma.role.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends RoleUpdateManyArgs>(args: SelectSubset<T, RoleUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Roles and returns the data updated in the database.
     * @param {RoleUpdateManyAndReturnArgs} args - Arguments to update many Roles.
     * @example
     * // Update many Roles
     * const role = await prisma.role.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Roles and only return the `id`
     * const roleWithIdOnly = await prisma.role.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends RoleUpdateManyAndReturnArgs>(args: SelectSubset<T, RoleUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Role.
     * @param {RoleUpsertArgs} args - Arguments to update or create a Role.
     * @example
     * // Update or create a Role
     * const role = await prisma.role.upsert({
     *   create: {
     *     // ... data to create a Role
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Role we want to update
     *   }
     * })
     */
    upsert<T extends RoleUpsertArgs>(args: SelectSubset<T, RoleUpsertArgs<ExtArgs>>): Prisma__RoleClient<$Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Roles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoleCountArgs} args - Arguments to filter Roles to count.
     * @example
     * // Count the number of Roles
     * const count = await prisma.role.count({
     *   where: {
     *     // ... the filter for the Roles we want to count
     *   }
     * })
    **/
    count<T extends RoleCountArgs>(
      args?: Subset<T, RoleCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], RoleCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Role.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoleAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends RoleAggregateArgs>(args: Subset<T, RoleAggregateArgs>): Prisma.PrismaPromise<GetRoleAggregateType<T>>

    /**
     * Group by Role.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoleGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends RoleGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: RoleGroupByArgs['orderBy'] }
        : { orderBy?: RoleGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, RoleGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRoleGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Role model
   */
  readonly fields: RoleFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Role.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__RoleClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    accounts<T extends Role$accountsArgs<ExtArgs> = {}>(args?: Subset<T, Role$accountsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuthAccountPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    accountRoles<T extends Role$accountRolesArgs<ExtArgs> = {}>(args?: Subset<T, Role$accountRolesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuthAccountRolePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Role model
   */
  interface RoleFieldRefs {
    readonly id: FieldRef<"Role", 'Int'>
    readonly name: FieldRef<"Role", 'String'>
    readonly description: FieldRef<"Role", 'String'>
    readonly createdAt: FieldRef<"Role", 'DateTime'>
    readonly updatedAt: FieldRef<"Role", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Role findUnique
   */
  export type RoleFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Role
     */
    select?: RoleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Role
     */
    omit?: RoleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleInclude<ExtArgs> | null
    /**
     * Filter, which Role to fetch.
     */
    where: RoleWhereUniqueInput
  }

  /**
   * Role findUniqueOrThrow
   */
  export type RoleFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Role
     */
    select?: RoleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Role
     */
    omit?: RoleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleInclude<ExtArgs> | null
    /**
     * Filter, which Role to fetch.
     */
    where: RoleWhereUniqueInput
  }

  /**
   * Role findFirst
   */
  export type RoleFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Role
     */
    select?: RoleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Role
     */
    omit?: RoleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleInclude<ExtArgs> | null
    /**
     * Filter, which Role to fetch.
     */
    where?: RoleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Roles to fetch.
     */
    orderBy?: RoleOrderByWithRelationInput | RoleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Roles.
     */
    cursor?: RoleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Roles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Roles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Roles.
     */
    distinct?: RoleScalarFieldEnum | RoleScalarFieldEnum[]
  }

  /**
   * Role findFirstOrThrow
   */
  export type RoleFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Role
     */
    select?: RoleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Role
     */
    omit?: RoleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleInclude<ExtArgs> | null
    /**
     * Filter, which Role to fetch.
     */
    where?: RoleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Roles to fetch.
     */
    orderBy?: RoleOrderByWithRelationInput | RoleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Roles.
     */
    cursor?: RoleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Roles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Roles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Roles.
     */
    distinct?: RoleScalarFieldEnum | RoleScalarFieldEnum[]
  }

  /**
   * Role findMany
   */
  export type RoleFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Role
     */
    select?: RoleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Role
     */
    omit?: RoleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleInclude<ExtArgs> | null
    /**
     * Filter, which Roles to fetch.
     */
    where?: RoleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Roles to fetch.
     */
    orderBy?: RoleOrderByWithRelationInput | RoleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Roles.
     */
    cursor?: RoleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Roles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Roles.
     */
    skip?: number
    distinct?: RoleScalarFieldEnum | RoleScalarFieldEnum[]
  }

  /**
   * Role create
   */
  export type RoleCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Role
     */
    select?: RoleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Role
     */
    omit?: RoleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleInclude<ExtArgs> | null
    /**
     * The data needed to create a Role.
     */
    data: XOR<RoleCreateInput, RoleUncheckedCreateInput>
  }

  /**
   * Role createMany
   */
  export type RoleCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Roles.
     */
    data: RoleCreateManyInput | RoleCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Role createManyAndReturn
   */
  export type RoleCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Role
     */
    select?: RoleSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Role
     */
    omit?: RoleOmit<ExtArgs> | null
    /**
     * The data used to create many Roles.
     */
    data: RoleCreateManyInput | RoleCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Role update
   */
  export type RoleUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Role
     */
    select?: RoleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Role
     */
    omit?: RoleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleInclude<ExtArgs> | null
    /**
     * The data needed to update a Role.
     */
    data: XOR<RoleUpdateInput, RoleUncheckedUpdateInput>
    /**
     * Choose, which Role to update.
     */
    where: RoleWhereUniqueInput
  }

  /**
   * Role updateMany
   */
  export type RoleUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Roles.
     */
    data: XOR<RoleUpdateManyMutationInput, RoleUncheckedUpdateManyInput>
    /**
     * Filter which Roles to update
     */
    where?: RoleWhereInput
    /**
     * Limit how many Roles to update.
     */
    limit?: number
  }

  /**
   * Role updateManyAndReturn
   */
  export type RoleUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Role
     */
    select?: RoleSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Role
     */
    omit?: RoleOmit<ExtArgs> | null
    /**
     * The data used to update Roles.
     */
    data: XOR<RoleUpdateManyMutationInput, RoleUncheckedUpdateManyInput>
    /**
     * Filter which Roles to update
     */
    where?: RoleWhereInput
    /**
     * Limit how many Roles to update.
     */
    limit?: number
  }

  /**
   * Role upsert
   */
  export type RoleUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Role
     */
    select?: RoleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Role
     */
    omit?: RoleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleInclude<ExtArgs> | null
    /**
     * The filter to search for the Role to update in case it exists.
     */
    where: RoleWhereUniqueInput
    /**
     * In case the Role found by the `where` argument doesn't exist, create a new Role with this data.
     */
    create: XOR<RoleCreateInput, RoleUncheckedCreateInput>
    /**
     * In case the Role was found with the provided `where` argument, update it with this data.
     */
    update: XOR<RoleUpdateInput, RoleUncheckedUpdateInput>
  }

  /**
   * Role delete
   */
  export type RoleDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Role
     */
    select?: RoleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Role
     */
    omit?: RoleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleInclude<ExtArgs> | null
    /**
     * Filter which Role to delete.
     */
    where: RoleWhereUniqueInput
  }

  /**
   * Role deleteMany
   */
  export type RoleDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Roles to delete
     */
    where?: RoleWhereInput
    /**
     * Limit how many Roles to delete.
     */
    limit?: number
  }

  /**
   * Role.accounts
   */
  export type Role$accountsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuthAccount
     */
    select?: AuthAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuthAccount
     */
    omit?: AuthAccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthAccountInclude<ExtArgs> | null
    where?: AuthAccountWhereInput
    orderBy?: AuthAccountOrderByWithRelationInput | AuthAccountOrderByWithRelationInput[]
    cursor?: AuthAccountWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AuthAccountScalarFieldEnum | AuthAccountScalarFieldEnum[]
  }

  /**
   * Role.accountRoles
   */
  export type Role$accountRolesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuthAccountRole
     */
    select?: AuthAccountRoleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuthAccountRole
     */
    omit?: AuthAccountRoleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthAccountRoleInclude<ExtArgs> | null
    where?: AuthAccountRoleWhereInput
    orderBy?: AuthAccountRoleOrderByWithRelationInput | AuthAccountRoleOrderByWithRelationInput[]
    cursor?: AuthAccountRoleWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AuthAccountRoleScalarFieldEnum | AuthAccountRoleScalarFieldEnum[]
  }

  /**
   * Role without action
   */
  export type RoleDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Role
     */
    select?: RoleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Role
     */
    omit?: RoleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleInclude<ExtArgs> | null
  }


  /**
   * Model AuthAccount
   */

  export type AggregateAuthAccount = {
    _count: AuthAccountCountAggregateOutputType | null
    _avg: AuthAccountAvgAggregateOutputType | null
    _sum: AuthAccountSumAggregateOutputType | null
    _min: AuthAccountMinAggregateOutputType | null
    _max: AuthAccountMaxAggregateOutputType | null
  }

  export type AuthAccountAvgAggregateOutputType = {
    roleId: number | null
  }

  export type AuthAccountSumAggregateOutputType = {
    roleId: number | null
  }

  export type AuthAccountMinAggregateOutputType = {
    id: string | null
    email: string | null
    normalizedEmail: string | null
    passwordHash: string | null
    forcePasswordChange: boolean | null
    roleId: number | null
    provider: $Enums.AuthProvider | null
    status: $Enums.AuthStatus | null
    isEmailVerified: boolean | null
    lastLoginAt: Date | null
    passwordChangedAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AuthAccountMaxAggregateOutputType = {
    id: string | null
    email: string | null
    normalizedEmail: string | null
    passwordHash: string | null
    forcePasswordChange: boolean | null
    roleId: number | null
    provider: $Enums.AuthProvider | null
    status: $Enums.AuthStatus | null
    isEmailVerified: boolean | null
    lastLoginAt: Date | null
    passwordChangedAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AuthAccountCountAggregateOutputType = {
    id: number
    email: number
    normalizedEmail: number
    passwordHash: number
    forcePasswordChange: number
    roleId: number
    provider: number
    status: number
    isEmailVerified: number
    lastLoginAt: number
    passwordChangedAt: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type AuthAccountAvgAggregateInputType = {
    roleId?: true
  }

  export type AuthAccountSumAggregateInputType = {
    roleId?: true
  }

  export type AuthAccountMinAggregateInputType = {
    id?: true
    email?: true
    normalizedEmail?: true
    passwordHash?: true
    forcePasswordChange?: true
    roleId?: true
    provider?: true
    status?: true
    isEmailVerified?: true
    lastLoginAt?: true
    passwordChangedAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AuthAccountMaxAggregateInputType = {
    id?: true
    email?: true
    normalizedEmail?: true
    passwordHash?: true
    forcePasswordChange?: true
    roleId?: true
    provider?: true
    status?: true
    isEmailVerified?: true
    lastLoginAt?: true
    passwordChangedAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AuthAccountCountAggregateInputType = {
    id?: true
    email?: true
    normalizedEmail?: true
    passwordHash?: true
    forcePasswordChange?: true
    roleId?: true
    provider?: true
    status?: true
    isEmailVerified?: true
    lastLoginAt?: true
    passwordChangedAt?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type AuthAccountAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AuthAccount to aggregate.
     */
    where?: AuthAccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuthAccounts to fetch.
     */
    orderBy?: AuthAccountOrderByWithRelationInput | AuthAccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AuthAccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuthAccounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuthAccounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AuthAccounts
    **/
    _count?: true | AuthAccountCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: AuthAccountAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: AuthAccountSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AuthAccountMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AuthAccountMaxAggregateInputType
  }

  export type GetAuthAccountAggregateType<T extends AuthAccountAggregateArgs> = {
        [P in keyof T & keyof AggregateAuthAccount]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAuthAccount[P]>
      : GetScalarType<T[P], AggregateAuthAccount[P]>
  }




  export type AuthAccountGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AuthAccountWhereInput
    orderBy?: AuthAccountOrderByWithAggregationInput | AuthAccountOrderByWithAggregationInput[]
    by: AuthAccountScalarFieldEnum[] | AuthAccountScalarFieldEnum
    having?: AuthAccountScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AuthAccountCountAggregateInputType | true
    _avg?: AuthAccountAvgAggregateInputType
    _sum?: AuthAccountSumAggregateInputType
    _min?: AuthAccountMinAggregateInputType
    _max?: AuthAccountMaxAggregateInputType
  }

  export type AuthAccountGroupByOutputType = {
    id: string
    email: string
    normalizedEmail: string
    passwordHash: string | null
    forcePasswordChange: boolean
    roleId: number
    provider: $Enums.AuthProvider
    status: $Enums.AuthStatus
    isEmailVerified: boolean
    lastLoginAt: Date | null
    passwordChangedAt: Date | null
    createdAt: Date
    updatedAt: Date
    _count: AuthAccountCountAggregateOutputType | null
    _avg: AuthAccountAvgAggregateOutputType | null
    _sum: AuthAccountSumAggregateOutputType | null
    _min: AuthAccountMinAggregateOutputType | null
    _max: AuthAccountMaxAggregateOutputType | null
  }

  type GetAuthAccountGroupByPayload<T extends AuthAccountGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AuthAccountGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AuthAccountGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AuthAccountGroupByOutputType[P]>
            : GetScalarType<T[P], AuthAccountGroupByOutputType[P]>
        }
      >
    >


  export type AuthAccountSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    normalizedEmail?: boolean
    passwordHash?: boolean
    forcePasswordChange?: boolean
    roleId?: boolean
    provider?: boolean
    status?: boolean
    isEmailVerified?: boolean
    lastLoginAt?: boolean
    passwordChangedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    role?: boolean | RoleDefaultArgs<ExtArgs>
    oauthAccounts?: boolean | AuthAccount$oauthAccountsArgs<ExtArgs>
    sessions?: boolean | AuthAccount$sessionsArgs<ExtArgs>
    tokens?: boolean | AuthAccount$tokensArgs<ExtArgs>
    accountRoles?: boolean | AuthAccount$accountRolesArgs<ExtArgs>
    grantedRoles?: boolean | AuthAccount$grantedRolesArgs<ExtArgs>
    challenges?: boolean | AuthAccount$challengesArgs<ExtArgs>
    _count?: boolean | AuthAccountCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["authAccount"]>

  export type AuthAccountSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    normalizedEmail?: boolean
    passwordHash?: boolean
    forcePasswordChange?: boolean
    roleId?: boolean
    provider?: boolean
    status?: boolean
    isEmailVerified?: boolean
    lastLoginAt?: boolean
    passwordChangedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    role?: boolean | RoleDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["authAccount"]>

  export type AuthAccountSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    normalizedEmail?: boolean
    passwordHash?: boolean
    forcePasswordChange?: boolean
    roleId?: boolean
    provider?: boolean
    status?: boolean
    isEmailVerified?: boolean
    lastLoginAt?: boolean
    passwordChangedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    role?: boolean | RoleDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["authAccount"]>

  export type AuthAccountSelectScalar = {
    id?: boolean
    email?: boolean
    normalizedEmail?: boolean
    passwordHash?: boolean
    forcePasswordChange?: boolean
    roleId?: boolean
    provider?: boolean
    status?: boolean
    isEmailVerified?: boolean
    lastLoginAt?: boolean
    passwordChangedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type AuthAccountOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "email" | "normalizedEmail" | "passwordHash" | "forcePasswordChange" | "roleId" | "provider" | "status" | "isEmailVerified" | "lastLoginAt" | "passwordChangedAt" | "createdAt" | "updatedAt", ExtArgs["result"]["authAccount"]>
  export type AuthAccountInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    role?: boolean | RoleDefaultArgs<ExtArgs>
    oauthAccounts?: boolean | AuthAccount$oauthAccountsArgs<ExtArgs>
    sessions?: boolean | AuthAccount$sessionsArgs<ExtArgs>
    tokens?: boolean | AuthAccount$tokensArgs<ExtArgs>
    accountRoles?: boolean | AuthAccount$accountRolesArgs<ExtArgs>
    grantedRoles?: boolean | AuthAccount$grantedRolesArgs<ExtArgs>
    challenges?: boolean | AuthAccount$challengesArgs<ExtArgs>
    _count?: boolean | AuthAccountCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type AuthAccountIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    role?: boolean | RoleDefaultArgs<ExtArgs>
  }
  export type AuthAccountIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    role?: boolean | RoleDefaultArgs<ExtArgs>
  }

  export type $AuthAccountPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AuthAccount"
    objects: {
      role: Prisma.$RolePayload<ExtArgs>
      oauthAccounts: Prisma.$OAuthProviderAccountPayload<ExtArgs>[]
      sessions: Prisma.$AuthSessionPayload<ExtArgs>[]
      tokens: Prisma.$AuthTokenPayload<ExtArgs>[]
      accountRoles: Prisma.$AuthAccountRolePayload<ExtArgs>[]
      grantedRoles: Prisma.$AuthAccountRolePayload<ExtArgs>[]
      challenges: Prisma.$AuthChallengePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      email: string
      normalizedEmail: string
      passwordHash: string | null
      forcePasswordChange: boolean
      roleId: number
      provider: $Enums.AuthProvider
      status: $Enums.AuthStatus
      isEmailVerified: boolean
      lastLoginAt: Date | null
      passwordChangedAt: Date | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["authAccount"]>
    composites: {}
  }

  type AuthAccountGetPayload<S extends boolean | null | undefined | AuthAccountDefaultArgs> = $Result.GetResult<Prisma.$AuthAccountPayload, S>

  type AuthAccountCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AuthAccountFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AuthAccountCountAggregateInputType | true
    }

  export interface AuthAccountDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AuthAccount'], meta: { name: 'AuthAccount' } }
    /**
     * Find zero or one AuthAccount that matches the filter.
     * @param {AuthAccountFindUniqueArgs} args - Arguments to find a AuthAccount
     * @example
     * // Get one AuthAccount
     * const authAccount = await prisma.authAccount.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AuthAccountFindUniqueArgs>(args: SelectSubset<T, AuthAccountFindUniqueArgs<ExtArgs>>): Prisma__AuthAccountClient<$Result.GetResult<Prisma.$AuthAccountPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one AuthAccount that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AuthAccountFindUniqueOrThrowArgs} args - Arguments to find a AuthAccount
     * @example
     * // Get one AuthAccount
     * const authAccount = await prisma.authAccount.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AuthAccountFindUniqueOrThrowArgs>(args: SelectSubset<T, AuthAccountFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AuthAccountClient<$Result.GetResult<Prisma.$AuthAccountPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AuthAccount that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuthAccountFindFirstArgs} args - Arguments to find a AuthAccount
     * @example
     * // Get one AuthAccount
     * const authAccount = await prisma.authAccount.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AuthAccountFindFirstArgs>(args?: SelectSubset<T, AuthAccountFindFirstArgs<ExtArgs>>): Prisma__AuthAccountClient<$Result.GetResult<Prisma.$AuthAccountPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AuthAccount that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuthAccountFindFirstOrThrowArgs} args - Arguments to find a AuthAccount
     * @example
     * // Get one AuthAccount
     * const authAccount = await prisma.authAccount.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AuthAccountFindFirstOrThrowArgs>(args?: SelectSubset<T, AuthAccountFindFirstOrThrowArgs<ExtArgs>>): Prisma__AuthAccountClient<$Result.GetResult<Prisma.$AuthAccountPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more AuthAccounts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuthAccountFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AuthAccounts
     * const authAccounts = await prisma.authAccount.findMany()
     * 
     * // Get first 10 AuthAccounts
     * const authAccounts = await prisma.authAccount.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const authAccountWithIdOnly = await prisma.authAccount.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AuthAccountFindManyArgs>(args?: SelectSubset<T, AuthAccountFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuthAccountPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a AuthAccount.
     * @param {AuthAccountCreateArgs} args - Arguments to create a AuthAccount.
     * @example
     * // Create one AuthAccount
     * const AuthAccount = await prisma.authAccount.create({
     *   data: {
     *     // ... data to create a AuthAccount
     *   }
     * })
     * 
     */
    create<T extends AuthAccountCreateArgs>(args: SelectSubset<T, AuthAccountCreateArgs<ExtArgs>>): Prisma__AuthAccountClient<$Result.GetResult<Prisma.$AuthAccountPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many AuthAccounts.
     * @param {AuthAccountCreateManyArgs} args - Arguments to create many AuthAccounts.
     * @example
     * // Create many AuthAccounts
     * const authAccount = await prisma.authAccount.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AuthAccountCreateManyArgs>(args?: SelectSubset<T, AuthAccountCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AuthAccounts and returns the data saved in the database.
     * @param {AuthAccountCreateManyAndReturnArgs} args - Arguments to create many AuthAccounts.
     * @example
     * // Create many AuthAccounts
     * const authAccount = await prisma.authAccount.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AuthAccounts and only return the `id`
     * const authAccountWithIdOnly = await prisma.authAccount.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AuthAccountCreateManyAndReturnArgs>(args?: SelectSubset<T, AuthAccountCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuthAccountPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a AuthAccount.
     * @param {AuthAccountDeleteArgs} args - Arguments to delete one AuthAccount.
     * @example
     * // Delete one AuthAccount
     * const AuthAccount = await prisma.authAccount.delete({
     *   where: {
     *     // ... filter to delete one AuthAccount
     *   }
     * })
     * 
     */
    delete<T extends AuthAccountDeleteArgs>(args: SelectSubset<T, AuthAccountDeleteArgs<ExtArgs>>): Prisma__AuthAccountClient<$Result.GetResult<Prisma.$AuthAccountPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one AuthAccount.
     * @param {AuthAccountUpdateArgs} args - Arguments to update one AuthAccount.
     * @example
     * // Update one AuthAccount
     * const authAccount = await prisma.authAccount.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AuthAccountUpdateArgs>(args: SelectSubset<T, AuthAccountUpdateArgs<ExtArgs>>): Prisma__AuthAccountClient<$Result.GetResult<Prisma.$AuthAccountPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more AuthAccounts.
     * @param {AuthAccountDeleteManyArgs} args - Arguments to filter AuthAccounts to delete.
     * @example
     * // Delete a few AuthAccounts
     * const { count } = await prisma.authAccount.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AuthAccountDeleteManyArgs>(args?: SelectSubset<T, AuthAccountDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AuthAccounts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuthAccountUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AuthAccounts
     * const authAccount = await prisma.authAccount.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AuthAccountUpdateManyArgs>(args: SelectSubset<T, AuthAccountUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AuthAccounts and returns the data updated in the database.
     * @param {AuthAccountUpdateManyAndReturnArgs} args - Arguments to update many AuthAccounts.
     * @example
     * // Update many AuthAccounts
     * const authAccount = await prisma.authAccount.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more AuthAccounts and only return the `id`
     * const authAccountWithIdOnly = await prisma.authAccount.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AuthAccountUpdateManyAndReturnArgs>(args: SelectSubset<T, AuthAccountUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuthAccountPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one AuthAccount.
     * @param {AuthAccountUpsertArgs} args - Arguments to update or create a AuthAccount.
     * @example
     * // Update or create a AuthAccount
     * const authAccount = await prisma.authAccount.upsert({
     *   create: {
     *     // ... data to create a AuthAccount
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AuthAccount we want to update
     *   }
     * })
     */
    upsert<T extends AuthAccountUpsertArgs>(args: SelectSubset<T, AuthAccountUpsertArgs<ExtArgs>>): Prisma__AuthAccountClient<$Result.GetResult<Prisma.$AuthAccountPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of AuthAccounts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuthAccountCountArgs} args - Arguments to filter AuthAccounts to count.
     * @example
     * // Count the number of AuthAccounts
     * const count = await prisma.authAccount.count({
     *   where: {
     *     // ... the filter for the AuthAccounts we want to count
     *   }
     * })
    **/
    count<T extends AuthAccountCountArgs>(
      args?: Subset<T, AuthAccountCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AuthAccountCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AuthAccount.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuthAccountAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AuthAccountAggregateArgs>(args: Subset<T, AuthAccountAggregateArgs>): Prisma.PrismaPromise<GetAuthAccountAggregateType<T>>

    /**
     * Group by AuthAccount.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuthAccountGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AuthAccountGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AuthAccountGroupByArgs['orderBy'] }
        : { orderBy?: AuthAccountGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AuthAccountGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAuthAccountGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AuthAccount model
   */
  readonly fields: AuthAccountFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AuthAccount.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AuthAccountClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    role<T extends RoleDefaultArgs<ExtArgs> = {}>(args?: Subset<T, RoleDefaultArgs<ExtArgs>>): Prisma__RoleClient<$Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    oauthAccounts<T extends AuthAccount$oauthAccountsArgs<ExtArgs> = {}>(args?: Subset<T, AuthAccount$oauthAccountsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OAuthProviderAccountPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    sessions<T extends AuthAccount$sessionsArgs<ExtArgs> = {}>(args?: Subset<T, AuthAccount$sessionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuthSessionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    tokens<T extends AuthAccount$tokensArgs<ExtArgs> = {}>(args?: Subset<T, AuthAccount$tokensArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuthTokenPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    accountRoles<T extends AuthAccount$accountRolesArgs<ExtArgs> = {}>(args?: Subset<T, AuthAccount$accountRolesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuthAccountRolePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    grantedRoles<T extends AuthAccount$grantedRolesArgs<ExtArgs> = {}>(args?: Subset<T, AuthAccount$grantedRolesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuthAccountRolePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    challenges<T extends AuthAccount$challengesArgs<ExtArgs> = {}>(args?: Subset<T, AuthAccount$challengesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuthChallengePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the AuthAccount model
   */
  interface AuthAccountFieldRefs {
    readonly id: FieldRef<"AuthAccount", 'String'>
    readonly email: FieldRef<"AuthAccount", 'String'>
    readonly normalizedEmail: FieldRef<"AuthAccount", 'String'>
    readonly passwordHash: FieldRef<"AuthAccount", 'String'>
    readonly forcePasswordChange: FieldRef<"AuthAccount", 'Boolean'>
    readonly roleId: FieldRef<"AuthAccount", 'Int'>
    readonly provider: FieldRef<"AuthAccount", 'AuthProvider'>
    readonly status: FieldRef<"AuthAccount", 'AuthStatus'>
    readonly isEmailVerified: FieldRef<"AuthAccount", 'Boolean'>
    readonly lastLoginAt: FieldRef<"AuthAccount", 'DateTime'>
    readonly passwordChangedAt: FieldRef<"AuthAccount", 'DateTime'>
    readonly createdAt: FieldRef<"AuthAccount", 'DateTime'>
    readonly updatedAt: FieldRef<"AuthAccount", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * AuthAccount findUnique
   */
  export type AuthAccountFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuthAccount
     */
    select?: AuthAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuthAccount
     */
    omit?: AuthAccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthAccountInclude<ExtArgs> | null
    /**
     * Filter, which AuthAccount to fetch.
     */
    where: AuthAccountWhereUniqueInput
  }

  /**
   * AuthAccount findUniqueOrThrow
   */
  export type AuthAccountFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuthAccount
     */
    select?: AuthAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuthAccount
     */
    omit?: AuthAccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthAccountInclude<ExtArgs> | null
    /**
     * Filter, which AuthAccount to fetch.
     */
    where: AuthAccountWhereUniqueInput
  }

  /**
   * AuthAccount findFirst
   */
  export type AuthAccountFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuthAccount
     */
    select?: AuthAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuthAccount
     */
    omit?: AuthAccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthAccountInclude<ExtArgs> | null
    /**
     * Filter, which AuthAccount to fetch.
     */
    where?: AuthAccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuthAccounts to fetch.
     */
    orderBy?: AuthAccountOrderByWithRelationInput | AuthAccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AuthAccounts.
     */
    cursor?: AuthAccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuthAccounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuthAccounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AuthAccounts.
     */
    distinct?: AuthAccountScalarFieldEnum | AuthAccountScalarFieldEnum[]
  }

  /**
   * AuthAccount findFirstOrThrow
   */
  export type AuthAccountFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuthAccount
     */
    select?: AuthAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuthAccount
     */
    omit?: AuthAccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthAccountInclude<ExtArgs> | null
    /**
     * Filter, which AuthAccount to fetch.
     */
    where?: AuthAccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuthAccounts to fetch.
     */
    orderBy?: AuthAccountOrderByWithRelationInput | AuthAccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AuthAccounts.
     */
    cursor?: AuthAccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuthAccounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuthAccounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AuthAccounts.
     */
    distinct?: AuthAccountScalarFieldEnum | AuthAccountScalarFieldEnum[]
  }

  /**
   * AuthAccount findMany
   */
  export type AuthAccountFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuthAccount
     */
    select?: AuthAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuthAccount
     */
    omit?: AuthAccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthAccountInclude<ExtArgs> | null
    /**
     * Filter, which AuthAccounts to fetch.
     */
    where?: AuthAccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuthAccounts to fetch.
     */
    orderBy?: AuthAccountOrderByWithRelationInput | AuthAccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AuthAccounts.
     */
    cursor?: AuthAccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuthAccounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuthAccounts.
     */
    skip?: number
    distinct?: AuthAccountScalarFieldEnum | AuthAccountScalarFieldEnum[]
  }

  /**
   * AuthAccount create
   */
  export type AuthAccountCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuthAccount
     */
    select?: AuthAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuthAccount
     */
    omit?: AuthAccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthAccountInclude<ExtArgs> | null
    /**
     * The data needed to create a AuthAccount.
     */
    data: XOR<AuthAccountCreateInput, AuthAccountUncheckedCreateInput>
  }

  /**
   * AuthAccount createMany
   */
  export type AuthAccountCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AuthAccounts.
     */
    data: AuthAccountCreateManyInput | AuthAccountCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AuthAccount createManyAndReturn
   */
  export type AuthAccountCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuthAccount
     */
    select?: AuthAccountSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AuthAccount
     */
    omit?: AuthAccountOmit<ExtArgs> | null
    /**
     * The data used to create many AuthAccounts.
     */
    data: AuthAccountCreateManyInput | AuthAccountCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthAccountIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * AuthAccount update
   */
  export type AuthAccountUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuthAccount
     */
    select?: AuthAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuthAccount
     */
    omit?: AuthAccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthAccountInclude<ExtArgs> | null
    /**
     * The data needed to update a AuthAccount.
     */
    data: XOR<AuthAccountUpdateInput, AuthAccountUncheckedUpdateInput>
    /**
     * Choose, which AuthAccount to update.
     */
    where: AuthAccountWhereUniqueInput
  }

  /**
   * AuthAccount updateMany
   */
  export type AuthAccountUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AuthAccounts.
     */
    data: XOR<AuthAccountUpdateManyMutationInput, AuthAccountUncheckedUpdateManyInput>
    /**
     * Filter which AuthAccounts to update
     */
    where?: AuthAccountWhereInput
    /**
     * Limit how many AuthAccounts to update.
     */
    limit?: number
  }

  /**
   * AuthAccount updateManyAndReturn
   */
  export type AuthAccountUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuthAccount
     */
    select?: AuthAccountSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AuthAccount
     */
    omit?: AuthAccountOmit<ExtArgs> | null
    /**
     * The data used to update AuthAccounts.
     */
    data: XOR<AuthAccountUpdateManyMutationInput, AuthAccountUncheckedUpdateManyInput>
    /**
     * Filter which AuthAccounts to update
     */
    where?: AuthAccountWhereInput
    /**
     * Limit how many AuthAccounts to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthAccountIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * AuthAccount upsert
   */
  export type AuthAccountUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuthAccount
     */
    select?: AuthAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuthAccount
     */
    omit?: AuthAccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthAccountInclude<ExtArgs> | null
    /**
     * The filter to search for the AuthAccount to update in case it exists.
     */
    where: AuthAccountWhereUniqueInput
    /**
     * In case the AuthAccount found by the `where` argument doesn't exist, create a new AuthAccount with this data.
     */
    create: XOR<AuthAccountCreateInput, AuthAccountUncheckedCreateInput>
    /**
     * In case the AuthAccount was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AuthAccountUpdateInput, AuthAccountUncheckedUpdateInput>
  }

  /**
   * AuthAccount delete
   */
  export type AuthAccountDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuthAccount
     */
    select?: AuthAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuthAccount
     */
    omit?: AuthAccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthAccountInclude<ExtArgs> | null
    /**
     * Filter which AuthAccount to delete.
     */
    where: AuthAccountWhereUniqueInput
  }

  /**
   * AuthAccount deleteMany
   */
  export type AuthAccountDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AuthAccounts to delete
     */
    where?: AuthAccountWhereInput
    /**
     * Limit how many AuthAccounts to delete.
     */
    limit?: number
  }

  /**
   * AuthAccount.oauthAccounts
   */
  export type AuthAccount$oauthAccountsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OAuthProviderAccount
     */
    select?: OAuthProviderAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OAuthProviderAccount
     */
    omit?: OAuthProviderAccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OAuthProviderAccountInclude<ExtArgs> | null
    where?: OAuthProviderAccountWhereInput
    orderBy?: OAuthProviderAccountOrderByWithRelationInput | OAuthProviderAccountOrderByWithRelationInput[]
    cursor?: OAuthProviderAccountWhereUniqueInput
    take?: number
    skip?: number
    distinct?: OAuthProviderAccountScalarFieldEnum | OAuthProviderAccountScalarFieldEnum[]
  }

  /**
   * AuthAccount.sessions
   */
  export type AuthAccount$sessionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuthSession
     */
    select?: AuthSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuthSession
     */
    omit?: AuthSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthSessionInclude<ExtArgs> | null
    where?: AuthSessionWhereInput
    orderBy?: AuthSessionOrderByWithRelationInput | AuthSessionOrderByWithRelationInput[]
    cursor?: AuthSessionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AuthSessionScalarFieldEnum | AuthSessionScalarFieldEnum[]
  }

  /**
   * AuthAccount.tokens
   */
  export type AuthAccount$tokensArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuthToken
     */
    select?: AuthTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuthToken
     */
    omit?: AuthTokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthTokenInclude<ExtArgs> | null
    where?: AuthTokenWhereInput
    orderBy?: AuthTokenOrderByWithRelationInput | AuthTokenOrderByWithRelationInput[]
    cursor?: AuthTokenWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AuthTokenScalarFieldEnum | AuthTokenScalarFieldEnum[]
  }

  /**
   * AuthAccount.accountRoles
   */
  export type AuthAccount$accountRolesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuthAccountRole
     */
    select?: AuthAccountRoleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuthAccountRole
     */
    omit?: AuthAccountRoleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthAccountRoleInclude<ExtArgs> | null
    where?: AuthAccountRoleWhereInput
    orderBy?: AuthAccountRoleOrderByWithRelationInput | AuthAccountRoleOrderByWithRelationInput[]
    cursor?: AuthAccountRoleWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AuthAccountRoleScalarFieldEnum | AuthAccountRoleScalarFieldEnum[]
  }

  /**
   * AuthAccount.grantedRoles
   */
  export type AuthAccount$grantedRolesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuthAccountRole
     */
    select?: AuthAccountRoleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuthAccountRole
     */
    omit?: AuthAccountRoleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthAccountRoleInclude<ExtArgs> | null
    where?: AuthAccountRoleWhereInput
    orderBy?: AuthAccountRoleOrderByWithRelationInput | AuthAccountRoleOrderByWithRelationInput[]
    cursor?: AuthAccountRoleWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AuthAccountRoleScalarFieldEnum | AuthAccountRoleScalarFieldEnum[]
  }

  /**
   * AuthAccount.challenges
   */
  export type AuthAccount$challengesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuthChallenge
     */
    select?: AuthChallengeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuthChallenge
     */
    omit?: AuthChallengeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthChallengeInclude<ExtArgs> | null
    where?: AuthChallengeWhereInput
    orderBy?: AuthChallengeOrderByWithRelationInput | AuthChallengeOrderByWithRelationInput[]
    cursor?: AuthChallengeWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AuthChallengeScalarFieldEnum | AuthChallengeScalarFieldEnum[]
  }

  /**
   * AuthAccount without action
   */
  export type AuthAccountDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuthAccount
     */
    select?: AuthAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuthAccount
     */
    omit?: AuthAccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthAccountInclude<ExtArgs> | null
  }


  /**
   * Model AuthAccountRole
   */

  export type AggregateAuthAccountRole = {
    _count: AuthAccountRoleCountAggregateOutputType | null
    _avg: AuthAccountRoleAvgAggregateOutputType | null
    _sum: AuthAccountRoleSumAggregateOutputType | null
    _min: AuthAccountRoleMinAggregateOutputType | null
    _max: AuthAccountRoleMaxAggregateOutputType | null
  }

  export type AuthAccountRoleAvgAggregateOutputType = {
    roleId: number | null
  }

  export type AuthAccountRoleSumAggregateOutputType = {
    roleId: number | null
  }

  export type AuthAccountRoleMinAggregateOutputType = {
    id: string | null
    authAccountId: string | null
    roleId: number | null
    assignedByAuthAccountId: string | null
    assignedAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AuthAccountRoleMaxAggregateOutputType = {
    id: string | null
    authAccountId: string | null
    roleId: number | null
    assignedByAuthAccountId: string | null
    assignedAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AuthAccountRoleCountAggregateOutputType = {
    id: number
    authAccountId: number
    roleId: number
    assignedByAuthAccountId: number
    assignedAt: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type AuthAccountRoleAvgAggregateInputType = {
    roleId?: true
  }

  export type AuthAccountRoleSumAggregateInputType = {
    roleId?: true
  }

  export type AuthAccountRoleMinAggregateInputType = {
    id?: true
    authAccountId?: true
    roleId?: true
    assignedByAuthAccountId?: true
    assignedAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AuthAccountRoleMaxAggregateInputType = {
    id?: true
    authAccountId?: true
    roleId?: true
    assignedByAuthAccountId?: true
    assignedAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AuthAccountRoleCountAggregateInputType = {
    id?: true
    authAccountId?: true
    roleId?: true
    assignedByAuthAccountId?: true
    assignedAt?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type AuthAccountRoleAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AuthAccountRole to aggregate.
     */
    where?: AuthAccountRoleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuthAccountRoles to fetch.
     */
    orderBy?: AuthAccountRoleOrderByWithRelationInput | AuthAccountRoleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AuthAccountRoleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuthAccountRoles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuthAccountRoles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AuthAccountRoles
    **/
    _count?: true | AuthAccountRoleCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: AuthAccountRoleAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: AuthAccountRoleSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AuthAccountRoleMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AuthAccountRoleMaxAggregateInputType
  }

  export type GetAuthAccountRoleAggregateType<T extends AuthAccountRoleAggregateArgs> = {
        [P in keyof T & keyof AggregateAuthAccountRole]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAuthAccountRole[P]>
      : GetScalarType<T[P], AggregateAuthAccountRole[P]>
  }




  export type AuthAccountRoleGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AuthAccountRoleWhereInput
    orderBy?: AuthAccountRoleOrderByWithAggregationInput | AuthAccountRoleOrderByWithAggregationInput[]
    by: AuthAccountRoleScalarFieldEnum[] | AuthAccountRoleScalarFieldEnum
    having?: AuthAccountRoleScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AuthAccountRoleCountAggregateInputType | true
    _avg?: AuthAccountRoleAvgAggregateInputType
    _sum?: AuthAccountRoleSumAggregateInputType
    _min?: AuthAccountRoleMinAggregateInputType
    _max?: AuthAccountRoleMaxAggregateInputType
  }

  export type AuthAccountRoleGroupByOutputType = {
    id: string
    authAccountId: string
    roleId: number
    assignedByAuthAccountId: string | null
    assignedAt: Date
    createdAt: Date
    updatedAt: Date
    _count: AuthAccountRoleCountAggregateOutputType | null
    _avg: AuthAccountRoleAvgAggregateOutputType | null
    _sum: AuthAccountRoleSumAggregateOutputType | null
    _min: AuthAccountRoleMinAggregateOutputType | null
    _max: AuthAccountRoleMaxAggregateOutputType | null
  }

  type GetAuthAccountRoleGroupByPayload<T extends AuthAccountRoleGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AuthAccountRoleGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AuthAccountRoleGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AuthAccountRoleGroupByOutputType[P]>
            : GetScalarType<T[P], AuthAccountRoleGroupByOutputType[P]>
        }
      >
    >


  export type AuthAccountRoleSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    authAccountId?: boolean
    roleId?: boolean
    assignedByAuthAccountId?: boolean
    assignedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    authAccount?: boolean | AuthAccountDefaultArgs<ExtArgs>
    role?: boolean | RoleDefaultArgs<ExtArgs>
    assignedByAuthAccount?: boolean | AuthAccountRole$assignedByAuthAccountArgs<ExtArgs>
  }, ExtArgs["result"]["authAccountRole"]>

  export type AuthAccountRoleSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    authAccountId?: boolean
    roleId?: boolean
    assignedByAuthAccountId?: boolean
    assignedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    authAccount?: boolean | AuthAccountDefaultArgs<ExtArgs>
    role?: boolean | RoleDefaultArgs<ExtArgs>
    assignedByAuthAccount?: boolean | AuthAccountRole$assignedByAuthAccountArgs<ExtArgs>
  }, ExtArgs["result"]["authAccountRole"]>

  export type AuthAccountRoleSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    authAccountId?: boolean
    roleId?: boolean
    assignedByAuthAccountId?: boolean
    assignedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    authAccount?: boolean | AuthAccountDefaultArgs<ExtArgs>
    role?: boolean | RoleDefaultArgs<ExtArgs>
    assignedByAuthAccount?: boolean | AuthAccountRole$assignedByAuthAccountArgs<ExtArgs>
  }, ExtArgs["result"]["authAccountRole"]>

  export type AuthAccountRoleSelectScalar = {
    id?: boolean
    authAccountId?: boolean
    roleId?: boolean
    assignedByAuthAccountId?: boolean
    assignedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type AuthAccountRoleOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "authAccountId" | "roleId" | "assignedByAuthAccountId" | "assignedAt" | "createdAt" | "updatedAt", ExtArgs["result"]["authAccountRole"]>
  export type AuthAccountRoleInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    authAccount?: boolean | AuthAccountDefaultArgs<ExtArgs>
    role?: boolean | RoleDefaultArgs<ExtArgs>
    assignedByAuthAccount?: boolean | AuthAccountRole$assignedByAuthAccountArgs<ExtArgs>
  }
  export type AuthAccountRoleIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    authAccount?: boolean | AuthAccountDefaultArgs<ExtArgs>
    role?: boolean | RoleDefaultArgs<ExtArgs>
    assignedByAuthAccount?: boolean | AuthAccountRole$assignedByAuthAccountArgs<ExtArgs>
  }
  export type AuthAccountRoleIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    authAccount?: boolean | AuthAccountDefaultArgs<ExtArgs>
    role?: boolean | RoleDefaultArgs<ExtArgs>
    assignedByAuthAccount?: boolean | AuthAccountRole$assignedByAuthAccountArgs<ExtArgs>
  }

  export type $AuthAccountRolePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AuthAccountRole"
    objects: {
      authAccount: Prisma.$AuthAccountPayload<ExtArgs>
      role: Prisma.$RolePayload<ExtArgs>
      assignedByAuthAccount: Prisma.$AuthAccountPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      authAccountId: string
      roleId: number
      assignedByAuthAccountId: string | null
      assignedAt: Date
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["authAccountRole"]>
    composites: {}
  }

  type AuthAccountRoleGetPayload<S extends boolean | null | undefined | AuthAccountRoleDefaultArgs> = $Result.GetResult<Prisma.$AuthAccountRolePayload, S>

  type AuthAccountRoleCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AuthAccountRoleFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AuthAccountRoleCountAggregateInputType | true
    }

  export interface AuthAccountRoleDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AuthAccountRole'], meta: { name: 'AuthAccountRole' } }
    /**
     * Find zero or one AuthAccountRole that matches the filter.
     * @param {AuthAccountRoleFindUniqueArgs} args - Arguments to find a AuthAccountRole
     * @example
     * // Get one AuthAccountRole
     * const authAccountRole = await prisma.authAccountRole.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AuthAccountRoleFindUniqueArgs>(args: SelectSubset<T, AuthAccountRoleFindUniqueArgs<ExtArgs>>): Prisma__AuthAccountRoleClient<$Result.GetResult<Prisma.$AuthAccountRolePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one AuthAccountRole that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AuthAccountRoleFindUniqueOrThrowArgs} args - Arguments to find a AuthAccountRole
     * @example
     * // Get one AuthAccountRole
     * const authAccountRole = await prisma.authAccountRole.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AuthAccountRoleFindUniqueOrThrowArgs>(args: SelectSubset<T, AuthAccountRoleFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AuthAccountRoleClient<$Result.GetResult<Prisma.$AuthAccountRolePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AuthAccountRole that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuthAccountRoleFindFirstArgs} args - Arguments to find a AuthAccountRole
     * @example
     * // Get one AuthAccountRole
     * const authAccountRole = await prisma.authAccountRole.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AuthAccountRoleFindFirstArgs>(args?: SelectSubset<T, AuthAccountRoleFindFirstArgs<ExtArgs>>): Prisma__AuthAccountRoleClient<$Result.GetResult<Prisma.$AuthAccountRolePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AuthAccountRole that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuthAccountRoleFindFirstOrThrowArgs} args - Arguments to find a AuthAccountRole
     * @example
     * // Get one AuthAccountRole
     * const authAccountRole = await prisma.authAccountRole.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AuthAccountRoleFindFirstOrThrowArgs>(args?: SelectSubset<T, AuthAccountRoleFindFirstOrThrowArgs<ExtArgs>>): Prisma__AuthAccountRoleClient<$Result.GetResult<Prisma.$AuthAccountRolePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more AuthAccountRoles that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuthAccountRoleFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AuthAccountRoles
     * const authAccountRoles = await prisma.authAccountRole.findMany()
     * 
     * // Get first 10 AuthAccountRoles
     * const authAccountRoles = await prisma.authAccountRole.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const authAccountRoleWithIdOnly = await prisma.authAccountRole.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AuthAccountRoleFindManyArgs>(args?: SelectSubset<T, AuthAccountRoleFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuthAccountRolePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a AuthAccountRole.
     * @param {AuthAccountRoleCreateArgs} args - Arguments to create a AuthAccountRole.
     * @example
     * // Create one AuthAccountRole
     * const AuthAccountRole = await prisma.authAccountRole.create({
     *   data: {
     *     // ... data to create a AuthAccountRole
     *   }
     * })
     * 
     */
    create<T extends AuthAccountRoleCreateArgs>(args: SelectSubset<T, AuthAccountRoleCreateArgs<ExtArgs>>): Prisma__AuthAccountRoleClient<$Result.GetResult<Prisma.$AuthAccountRolePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many AuthAccountRoles.
     * @param {AuthAccountRoleCreateManyArgs} args - Arguments to create many AuthAccountRoles.
     * @example
     * // Create many AuthAccountRoles
     * const authAccountRole = await prisma.authAccountRole.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AuthAccountRoleCreateManyArgs>(args?: SelectSubset<T, AuthAccountRoleCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AuthAccountRoles and returns the data saved in the database.
     * @param {AuthAccountRoleCreateManyAndReturnArgs} args - Arguments to create many AuthAccountRoles.
     * @example
     * // Create many AuthAccountRoles
     * const authAccountRole = await prisma.authAccountRole.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AuthAccountRoles and only return the `id`
     * const authAccountRoleWithIdOnly = await prisma.authAccountRole.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AuthAccountRoleCreateManyAndReturnArgs>(args?: SelectSubset<T, AuthAccountRoleCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuthAccountRolePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a AuthAccountRole.
     * @param {AuthAccountRoleDeleteArgs} args - Arguments to delete one AuthAccountRole.
     * @example
     * // Delete one AuthAccountRole
     * const AuthAccountRole = await prisma.authAccountRole.delete({
     *   where: {
     *     // ... filter to delete one AuthAccountRole
     *   }
     * })
     * 
     */
    delete<T extends AuthAccountRoleDeleteArgs>(args: SelectSubset<T, AuthAccountRoleDeleteArgs<ExtArgs>>): Prisma__AuthAccountRoleClient<$Result.GetResult<Prisma.$AuthAccountRolePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one AuthAccountRole.
     * @param {AuthAccountRoleUpdateArgs} args - Arguments to update one AuthAccountRole.
     * @example
     * // Update one AuthAccountRole
     * const authAccountRole = await prisma.authAccountRole.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AuthAccountRoleUpdateArgs>(args: SelectSubset<T, AuthAccountRoleUpdateArgs<ExtArgs>>): Prisma__AuthAccountRoleClient<$Result.GetResult<Prisma.$AuthAccountRolePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more AuthAccountRoles.
     * @param {AuthAccountRoleDeleteManyArgs} args - Arguments to filter AuthAccountRoles to delete.
     * @example
     * // Delete a few AuthAccountRoles
     * const { count } = await prisma.authAccountRole.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AuthAccountRoleDeleteManyArgs>(args?: SelectSubset<T, AuthAccountRoleDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AuthAccountRoles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuthAccountRoleUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AuthAccountRoles
     * const authAccountRole = await prisma.authAccountRole.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AuthAccountRoleUpdateManyArgs>(args: SelectSubset<T, AuthAccountRoleUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AuthAccountRoles and returns the data updated in the database.
     * @param {AuthAccountRoleUpdateManyAndReturnArgs} args - Arguments to update many AuthAccountRoles.
     * @example
     * // Update many AuthAccountRoles
     * const authAccountRole = await prisma.authAccountRole.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more AuthAccountRoles and only return the `id`
     * const authAccountRoleWithIdOnly = await prisma.authAccountRole.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AuthAccountRoleUpdateManyAndReturnArgs>(args: SelectSubset<T, AuthAccountRoleUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuthAccountRolePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one AuthAccountRole.
     * @param {AuthAccountRoleUpsertArgs} args - Arguments to update or create a AuthAccountRole.
     * @example
     * // Update or create a AuthAccountRole
     * const authAccountRole = await prisma.authAccountRole.upsert({
     *   create: {
     *     // ... data to create a AuthAccountRole
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AuthAccountRole we want to update
     *   }
     * })
     */
    upsert<T extends AuthAccountRoleUpsertArgs>(args: SelectSubset<T, AuthAccountRoleUpsertArgs<ExtArgs>>): Prisma__AuthAccountRoleClient<$Result.GetResult<Prisma.$AuthAccountRolePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of AuthAccountRoles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuthAccountRoleCountArgs} args - Arguments to filter AuthAccountRoles to count.
     * @example
     * // Count the number of AuthAccountRoles
     * const count = await prisma.authAccountRole.count({
     *   where: {
     *     // ... the filter for the AuthAccountRoles we want to count
     *   }
     * })
    **/
    count<T extends AuthAccountRoleCountArgs>(
      args?: Subset<T, AuthAccountRoleCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AuthAccountRoleCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AuthAccountRole.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuthAccountRoleAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AuthAccountRoleAggregateArgs>(args: Subset<T, AuthAccountRoleAggregateArgs>): Prisma.PrismaPromise<GetAuthAccountRoleAggregateType<T>>

    /**
     * Group by AuthAccountRole.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuthAccountRoleGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AuthAccountRoleGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AuthAccountRoleGroupByArgs['orderBy'] }
        : { orderBy?: AuthAccountRoleGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AuthAccountRoleGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAuthAccountRoleGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AuthAccountRole model
   */
  readonly fields: AuthAccountRoleFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AuthAccountRole.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AuthAccountRoleClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    authAccount<T extends AuthAccountDefaultArgs<ExtArgs> = {}>(args?: Subset<T, AuthAccountDefaultArgs<ExtArgs>>): Prisma__AuthAccountClient<$Result.GetResult<Prisma.$AuthAccountPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    role<T extends RoleDefaultArgs<ExtArgs> = {}>(args?: Subset<T, RoleDefaultArgs<ExtArgs>>): Prisma__RoleClient<$Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    assignedByAuthAccount<T extends AuthAccountRole$assignedByAuthAccountArgs<ExtArgs> = {}>(args?: Subset<T, AuthAccountRole$assignedByAuthAccountArgs<ExtArgs>>): Prisma__AuthAccountClient<$Result.GetResult<Prisma.$AuthAccountPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the AuthAccountRole model
   */
  interface AuthAccountRoleFieldRefs {
    readonly id: FieldRef<"AuthAccountRole", 'String'>
    readonly authAccountId: FieldRef<"AuthAccountRole", 'String'>
    readonly roleId: FieldRef<"AuthAccountRole", 'Int'>
    readonly assignedByAuthAccountId: FieldRef<"AuthAccountRole", 'String'>
    readonly assignedAt: FieldRef<"AuthAccountRole", 'DateTime'>
    readonly createdAt: FieldRef<"AuthAccountRole", 'DateTime'>
    readonly updatedAt: FieldRef<"AuthAccountRole", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * AuthAccountRole findUnique
   */
  export type AuthAccountRoleFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuthAccountRole
     */
    select?: AuthAccountRoleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuthAccountRole
     */
    omit?: AuthAccountRoleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthAccountRoleInclude<ExtArgs> | null
    /**
     * Filter, which AuthAccountRole to fetch.
     */
    where: AuthAccountRoleWhereUniqueInput
  }

  /**
   * AuthAccountRole findUniqueOrThrow
   */
  export type AuthAccountRoleFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuthAccountRole
     */
    select?: AuthAccountRoleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuthAccountRole
     */
    omit?: AuthAccountRoleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthAccountRoleInclude<ExtArgs> | null
    /**
     * Filter, which AuthAccountRole to fetch.
     */
    where: AuthAccountRoleWhereUniqueInput
  }

  /**
   * AuthAccountRole findFirst
   */
  export type AuthAccountRoleFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuthAccountRole
     */
    select?: AuthAccountRoleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuthAccountRole
     */
    omit?: AuthAccountRoleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthAccountRoleInclude<ExtArgs> | null
    /**
     * Filter, which AuthAccountRole to fetch.
     */
    where?: AuthAccountRoleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuthAccountRoles to fetch.
     */
    orderBy?: AuthAccountRoleOrderByWithRelationInput | AuthAccountRoleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AuthAccountRoles.
     */
    cursor?: AuthAccountRoleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuthAccountRoles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuthAccountRoles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AuthAccountRoles.
     */
    distinct?: AuthAccountRoleScalarFieldEnum | AuthAccountRoleScalarFieldEnum[]
  }

  /**
   * AuthAccountRole findFirstOrThrow
   */
  export type AuthAccountRoleFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuthAccountRole
     */
    select?: AuthAccountRoleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuthAccountRole
     */
    omit?: AuthAccountRoleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthAccountRoleInclude<ExtArgs> | null
    /**
     * Filter, which AuthAccountRole to fetch.
     */
    where?: AuthAccountRoleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuthAccountRoles to fetch.
     */
    orderBy?: AuthAccountRoleOrderByWithRelationInput | AuthAccountRoleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AuthAccountRoles.
     */
    cursor?: AuthAccountRoleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuthAccountRoles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuthAccountRoles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AuthAccountRoles.
     */
    distinct?: AuthAccountRoleScalarFieldEnum | AuthAccountRoleScalarFieldEnum[]
  }

  /**
   * AuthAccountRole findMany
   */
  export type AuthAccountRoleFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuthAccountRole
     */
    select?: AuthAccountRoleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuthAccountRole
     */
    omit?: AuthAccountRoleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthAccountRoleInclude<ExtArgs> | null
    /**
     * Filter, which AuthAccountRoles to fetch.
     */
    where?: AuthAccountRoleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuthAccountRoles to fetch.
     */
    orderBy?: AuthAccountRoleOrderByWithRelationInput | AuthAccountRoleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AuthAccountRoles.
     */
    cursor?: AuthAccountRoleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuthAccountRoles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuthAccountRoles.
     */
    skip?: number
    distinct?: AuthAccountRoleScalarFieldEnum | AuthAccountRoleScalarFieldEnum[]
  }

  /**
   * AuthAccountRole create
   */
  export type AuthAccountRoleCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuthAccountRole
     */
    select?: AuthAccountRoleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuthAccountRole
     */
    omit?: AuthAccountRoleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthAccountRoleInclude<ExtArgs> | null
    /**
     * The data needed to create a AuthAccountRole.
     */
    data: XOR<AuthAccountRoleCreateInput, AuthAccountRoleUncheckedCreateInput>
  }

  /**
   * AuthAccountRole createMany
   */
  export type AuthAccountRoleCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AuthAccountRoles.
     */
    data: AuthAccountRoleCreateManyInput | AuthAccountRoleCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AuthAccountRole createManyAndReturn
   */
  export type AuthAccountRoleCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuthAccountRole
     */
    select?: AuthAccountRoleSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AuthAccountRole
     */
    omit?: AuthAccountRoleOmit<ExtArgs> | null
    /**
     * The data used to create many AuthAccountRoles.
     */
    data: AuthAccountRoleCreateManyInput | AuthAccountRoleCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthAccountRoleIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * AuthAccountRole update
   */
  export type AuthAccountRoleUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuthAccountRole
     */
    select?: AuthAccountRoleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuthAccountRole
     */
    omit?: AuthAccountRoleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthAccountRoleInclude<ExtArgs> | null
    /**
     * The data needed to update a AuthAccountRole.
     */
    data: XOR<AuthAccountRoleUpdateInput, AuthAccountRoleUncheckedUpdateInput>
    /**
     * Choose, which AuthAccountRole to update.
     */
    where: AuthAccountRoleWhereUniqueInput
  }

  /**
   * AuthAccountRole updateMany
   */
  export type AuthAccountRoleUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AuthAccountRoles.
     */
    data: XOR<AuthAccountRoleUpdateManyMutationInput, AuthAccountRoleUncheckedUpdateManyInput>
    /**
     * Filter which AuthAccountRoles to update
     */
    where?: AuthAccountRoleWhereInput
    /**
     * Limit how many AuthAccountRoles to update.
     */
    limit?: number
  }

  /**
   * AuthAccountRole updateManyAndReturn
   */
  export type AuthAccountRoleUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuthAccountRole
     */
    select?: AuthAccountRoleSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AuthAccountRole
     */
    omit?: AuthAccountRoleOmit<ExtArgs> | null
    /**
     * The data used to update AuthAccountRoles.
     */
    data: XOR<AuthAccountRoleUpdateManyMutationInput, AuthAccountRoleUncheckedUpdateManyInput>
    /**
     * Filter which AuthAccountRoles to update
     */
    where?: AuthAccountRoleWhereInput
    /**
     * Limit how many AuthAccountRoles to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthAccountRoleIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * AuthAccountRole upsert
   */
  export type AuthAccountRoleUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuthAccountRole
     */
    select?: AuthAccountRoleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuthAccountRole
     */
    omit?: AuthAccountRoleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthAccountRoleInclude<ExtArgs> | null
    /**
     * The filter to search for the AuthAccountRole to update in case it exists.
     */
    where: AuthAccountRoleWhereUniqueInput
    /**
     * In case the AuthAccountRole found by the `where` argument doesn't exist, create a new AuthAccountRole with this data.
     */
    create: XOR<AuthAccountRoleCreateInput, AuthAccountRoleUncheckedCreateInput>
    /**
     * In case the AuthAccountRole was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AuthAccountRoleUpdateInput, AuthAccountRoleUncheckedUpdateInput>
  }

  /**
   * AuthAccountRole delete
   */
  export type AuthAccountRoleDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuthAccountRole
     */
    select?: AuthAccountRoleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuthAccountRole
     */
    omit?: AuthAccountRoleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthAccountRoleInclude<ExtArgs> | null
    /**
     * Filter which AuthAccountRole to delete.
     */
    where: AuthAccountRoleWhereUniqueInput
  }

  /**
   * AuthAccountRole deleteMany
   */
  export type AuthAccountRoleDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AuthAccountRoles to delete
     */
    where?: AuthAccountRoleWhereInput
    /**
     * Limit how many AuthAccountRoles to delete.
     */
    limit?: number
  }

  /**
   * AuthAccountRole.assignedByAuthAccount
   */
  export type AuthAccountRole$assignedByAuthAccountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuthAccount
     */
    select?: AuthAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuthAccount
     */
    omit?: AuthAccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthAccountInclude<ExtArgs> | null
    where?: AuthAccountWhereInput
  }

  /**
   * AuthAccountRole without action
   */
  export type AuthAccountRoleDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuthAccountRole
     */
    select?: AuthAccountRoleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuthAccountRole
     */
    omit?: AuthAccountRoleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthAccountRoleInclude<ExtArgs> | null
  }


  /**
   * Model OAuthProviderAccount
   */

  export type AggregateOAuthProviderAccount = {
    _count: OAuthProviderAccountCountAggregateOutputType | null
    _min: OAuthProviderAccountMinAggregateOutputType | null
    _max: OAuthProviderAccountMaxAggregateOutputType | null
  }

  export type OAuthProviderAccountMinAggregateOutputType = {
    id: string | null
    authAccountId: string | null
    provider: $Enums.AuthProvider | null
    providerUserId: string | null
    providerEmail: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type OAuthProviderAccountMaxAggregateOutputType = {
    id: string | null
    authAccountId: string | null
    provider: $Enums.AuthProvider | null
    providerUserId: string | null
    providerEmail: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type OAuthProviderAccountCountAggregateOutputType = {
    id: number
    authAccountId: number
    provider: number
    providerUserId: number
    providerEmail: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type OAuthProviderAccountMinAggregateInputType = {
    id?: true
    authAccountId?: true
    provider?: true
    providerUserId?: true
    providerEmail?: true
    createdAt?: true
    updatedAt?: true
  }

  export type OAuthProviderAccountMaxAggregateInputType = {
    id?: true
    authAccountId?: true
    provider?: true
    providerUserId?: true
    providerEmail?: true
    createdAt?: true
    updatedAt?: true
  }

  export type OAuthProviderAccountCountAggregateInputType = {
    id?: true
    authAccountId?: true
    provider?: true
    providerUserId?: true
    providerEmail?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type OAuthProviderAccountAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which OAuthProviderAccount to aggregate.
     */
    where?: OAuthProviderAccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OAuthProviderAccounts to fetch.
     */
    orderBy?: OAuthProviderAccountOrderByWithRelationInput | OAuthProviderAccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: OAuthProviderAccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OAuthProviderAccounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OAuthProviderAccounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned OAuthProviderAccounts
    **/
    _count?: true | OAuthProviderAccountCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: OAuthProviderAccountMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: OAuthProviderAccountMaxAggregateInputType
  }

  export type GetOAuthProviderAccountAggregateType<T extends OAuthProviderAccountAggregateArgs> = {
        [P in keyof T & keyof AggregateOAuthProviderAccount]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateOAuthProviderAccount[P]>
      : GetScalarType<T[P], AggregateOAuthProviderAccount[P]>
  }




  export type OAuthProviderAccountGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: OAuthProviderAccountWhereInput
    orderBy?: OAuthProviderAccountOrderByWithAggregationInput | OAuthProviderAccountOrderByWithAggregationInput[]
    by: OAuthProviderAccountScalarFieldEnum[] | OAuthProviderAccountScalarFieldEnum
    having?: OAuthProviderAccountScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: OAuthProviderAccountCountAggregateInputType | true
    _min?: OAuthProviderAccountMinAggregateInputType
    _max?: OAuthProviderAccountMaxAggregateInputType
  }

  export type OAuthProviderAccountGroupByOutputType = {
    id: string
    authAccountId: string
    provider: $Enums.AuthProvider
    providerUserId: string
    providerEmail: string | null
    createdAt: Date
    updatedAt: Date
    _count: OAuthProviderAccountCountAggregateOutputType | null
    _min: OAuthProviderAccountMinAggregateOutputType | null
    _max: OAuthProviderAccountMaxAggregateOutputType | null
  }

  type GetOAuthProviderAccountGroupByPayload<T extends OAuthProviderAccountGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<OAuthProviderAccountGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof OAuthProviderAccountGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], OAuthProviderAccountGroupByOutputType[P]>
            : GetScalarType<T[P], OAuthProviderAccountGroupByOutputType[P]>
        }
      >
    >


  export type OAuthProviderAccountSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    authAccountId?: boolean
    provider?: boolean
    providerUserId?: boolean
    providerEmail?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    authAccount?: boolean | AuthAccountDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["oAuthProviderAccount"]>

  export type OAuthProviderAccountSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    authAccountId?: boolean
    provider?: boolean
    providerUserId?: boolean
    providerEmail?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    authAccount?: boolean | AuthAccountDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["oAuthProviderAccount"]>

  export type OAuthProviderAccountSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    authAccountId?: boolean
    provider?: boolean
    providerUserId?: boolean
    providerEmail?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    authAccount?: boolean | AuthAccountDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["oAuthProviderAccount"]>

  export type OAuthProviderAccountSelectScalar = {
    id?: boolean
    authAccountId?: boolean
    provider?: boolean
    providerUserId?: boolean
    providerEmail?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type OAuthProviderAccountOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "authAccountId" | "provider" | "providerUserId" | "providerEmail" | "createdAt" | "updatedAt", ExtArgs["result"]["oAuthProviderAccount"]>
  export type OAuthProviderAccountInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    authAccount?: boolean | AuthAccountDefaultArgs<ExtArgs>
  }
  export type OAuthProviderAccountIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    authAccount?: boolean | AuthAccountDefaultArgs<ExtArgs>
  }
  export type OAuthProviderAccountIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    authAccount?: boolean | AuthAccountDefaultArgs<ExtArgs>
  }

  export type $OAuthProviderAccountPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "OAuthProviderAccount"
    objects: {
      authAccount: Prisma.$AuthAccountPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      authAccountId: string
      provider: $Enums.AuthProvider
      providerUserId: string
      providerEmail: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["oAuthProviderAccount"]>
    composites: {}
  }

  type OAuthProviderAccountGetPayload<S extends boolean | null | undefined | OAuthProviderAccountDefaultArgs> = $Result.GetResult<Prisma.$OAuthProviderAccountPayload, S>

  type OAuthProviderAccountCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<OAuthProviderAccountFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: OAuthProviderAccountCountAggregateInputType | true
    }

  export interface OAuthProviderAccountDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['OAuthProviderAccount'], meta: { name: 'OAuthProviderAccount' } }
    /**
     * Find zero or one OAuthProviderAccount that matches the filter.
     * @param {OAuthProviderAccountFindUniqueArgs} args - Arguments to find a OAuthProviderAccount
     * @example
     * // Get one OAuthProviderAccount
     * const oAuthProviderAccount = await prisma.oAuthProviderAccount.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends OAuthProviderAccountFindUniqueArgs>(args: SelectSubset<T, OAuthProviderAccountFindUniqueArgs<ExtArgs>>): Prisma__OAuthProviderAccountClient<$Result.GetResult<Prisma.$OAuthProviderAccountPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one OAuthProviderAccount that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {OAuthProviderAccountFindUniqueOrThrowArgs} args - Arguments to find a OAuthProviderAccount
     * @example
     * // Get one OAuthProviderAccount
     * const oAuthProviderAccount = await prisma.oAuthProviderAccount.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends OAuthProviderAccountFindUniqueOrThrowArgs>(args: SelectSubset<T, OAuthProviderAccountFindUniqueOrThrowArgs<ExtArgs>>): Prisma__OAuthProviderAccountClient<$Result.GetResult<Prisma.$OAuthProviderAccountPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first OAuthProviderAccount that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OAuthProviderAccountFindFirstArgs} args - Arguments to find a OAuthProviderAccount
     * @example
     * // Get one OAuthProviderAccount
     * const oAuthProviderAccount = await prisma.oAuthProviderAccount.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends OAuthProviderAccountFindFirstArgs>(args?: SelectSubset<T, OAuthProviderAccountFindFirstArgs<ExtArgs>>): Prisma__OAuthProviderAccountClient<$Result.GetResult<Prisma.$OAuthProviderAccountPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first OAuthProviderAccount that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OAuthProviderAccountFindFirstOrThrowArgs} args - Arguments to find a OAuthProviderAccount
     * @example
     * // Get one OAuthProviderAccount
     * const oAuthProviderAccount = await prisma.oAuthProviderAccount.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends OAuthProviderAccountFindFirstOrThrowArgs>(args?: SelectSubset<T, OAuthProviderAccountFindFirstOrThrowArgs<ExtArgs>>): Prisma__OAuthProviderAccountClient<$Result.GetResult<Prisma.$OAuthProviderAccountPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more OAuthProviderAccounts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OAuthProviderAccountFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all OAuthProviderAccounts
     * const oAuthProviderAccounts = await prisma.oAuthProviderAccount.findMany()
     * 
     * // Get first 10 OAuthProviderAccounts
     * const oAuthProviderAccounts = await prisma.oAuthProviderAccount.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const oAuthProviderAccountWithIdOnly = await prisma.oAuthProviderAccount.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends OAuthProviderAccountFindManyArgs>(args?: SelectSubset<T, OAuthProviderAccountFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OAuthProviderAccountPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a OAuthProviderAccount.
     * @param {OAuthProviderAccountCreateArgs} args - Arguments to create a OAuthProviderAccount.
     * @example
     * // Create one OAuthProviderAccount
     * const OAuthProviderAccount = await prisma.oAuthProviderAccount.create({
     *   data: {
     *     // ... data to create a OAuthProviderAccount
     *   }
     * })
     * 
     */
    create<T extends OAuthProviderAccountCreateArgs>(args: SelectSubset<T, OAuthProviderAccountCreateArgs<ExtArgs>>): Prisma__OAuthProviderAccountClient<$Result.GetResult<Prisma.$OAuthProviderAccountPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many OAuthProviderAccounts.
     * @param {OAuthProviderAccountCreateManyArgs} args - Arguments to create many OAuthProviderAccounts.
     * @example
     * // Create many OAuthProviderAccounts
     * const oAuthProviderAccount = await prisma.oAuthProviderAccount.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends OAuthProviderAccountCreateManyArgs>(args?: SelectSubset<T, OAuthProviderAccountCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many OAuthProviderAccounts and returns the data saved in the database.
     * @param {OAuthProviderAccountCreateManyAndReturnArgs} args - Arguments to create many OAuthProviderAccounts.
     * @example
     * // Create many OAuthProviderAccounts
     * const oAuthProviderAccount = await prisma.oAuthProviderAccount.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many OAuthProviderAccounts and only return the `id`
     * const oAuthProviderAccountWithIdOnly = await prisma.oAuthProviderAccount.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends OAuthProviderAccountCreateManyAndReturnArgs>(args?: SelectSubset<T, OAuthProviderAccountCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OAuthProviderAccountPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a OAuthProviderAccount.
     * @param {OAuthProviderAccountDeleteArgs} args - Arguments to delete one OAuthProviderAccount.
     * @example
     * // Delete one OAuthProviderAccount
     * const OAuthProviderAccount = await prisma.oAuthProviderAccount.delete({
     *   where: {
     *     // ... filter to delete one OAuthProviderAccount
     *   }
     * })
     * 
     */
    delete<T extends OAuthProviderAccountDeleteArgs>(args: SelectSubset<T, OAuthProviderAccountDeleteArgs<ExtArgs>>): Prisma__OAuthProviderAccountClient<$Result.GetResult<Prisma.$OAuthProviderAccountPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one OAuthProviderAccount.
     * @param {OAuthProviderAccountUpdateArgs} args - Arguments to update one OAuthProviderAccount.
     * @example
     * // Update one OAuthProviderAccount
     * const oAuthProviderAccount = await prisma.oAuthProviderAccount.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends OAuthProviderAccountUpdateArgs>(args: SelectSubset<T, OAuthProviderAccountUpdateArgs<ExtArgs>>): Prisma__OAuthProviderAccountClient<$Result.GetResult<Prisma.$OAuthProviderAccountPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more OAuthProviderAccounts.
     * @param {OAuthProviderAccountDeleteManyArgs} args - Arguments to filter OAuthProviderAccounts to delete.
     * @example
     * // Delete a few OAuthProviderAccounts
     * const { count } = await prisma.oAuthProviderAccount.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends OAuthProviderAccountDeleteManyArgs>(args?: SelectSubset<T, OAuthProviderAccountDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more OAuthProviderAccounts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OAuthProviderAccountUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many OAuthProviderAccounts
     * const oAuthProviderAccount = await prisma.oAuthProviderAccount.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends OAuthProviderAccountUpdateManyArgs>(args: SelectSubset<T, OAuthProviderAccountUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more OAuthProviderAccounts and returns the data updated in the database.
     * @param {OAuthProviderAccountUpdateManyAndReturnArgs} args - Arguments to update many OAuthProviderAccounts.
     * @example
     * // Update many OAuthProviderAccounts
     * const oAuthProviderAccount = await prisma.oAuthProviderAccount.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more OAuthProviderAccounts and only return the `id`
     * const oAuthProviderAccountWithIdOnly = await prisma.oAuthProviderAccount.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends OAuthProviderAccountUpdateManyAndReturnArgs>(args: SelectSubset<T, OAuthProviderAccountUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OAuthProviderAccountPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one OAuthProviderAccount.
     * @param {OAuthProviderAccountUpsertArgs} args - Arguments to update or create a OAuthProviderAccount.
     * @example
     * // Update or create a OAuthProviderAccount
     * const oAuthProviderAccount = await prisma.oAuthProviderAccount.upsert({
     *   create: {
     *     // ... data to create a OAuthProviderAccount
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the OAuthProviderAccount we want to update
     *   }
     * })
     */
    upsert<T extends OAuthProviderAccountUpsertArgs>(args: SelectSubset<T, OAuthProviderAccountUpsertArgs<ExtArgs>>): Prisma__OAuthProviderAccountClient<$Result.GetResult<Prisma.$OAuthProviderAccountPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of OAuthProviderAccounts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OAuthProviderAccountCountArgs} args - Arguments to filter OAuthProviderAccounts to count.
     * @example
     * // Count the number of OAuthProviderAccounts
     * const count = await prisma.oAuthProviderAccount.count({
     *   where: {
     *     // ... the filter for the OAuthProviderAccounts we want to count
     *   }
     * })
    **/
    count<T extends OAuthProviderAccountCountArgs>(
      args?: Subset<T, OAuthProviderAccountCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], OAuthProviderAccountCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a OAuthProviderAccount.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OAuthProviderAccountAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends OAuthProviderAccountAggregateArgs>(args: Subset<T, OAuthProviderAccountAggregateArgs>): Prisma.PrismaPromise<GetOAuthProviderAccountAggregateType<T>>

    /**
     * Group by OAuthProviderAccount.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OAuthProviderAccountGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends OAuthProviderAccountGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: OAuthProviderAccountGroupByArgs['orderBy'] }
        : { orderBy?: OAuthProviderAccountGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, OAuthProviderAccountGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetOAuthProviderAccountGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the OAuthProviderAccount model
   */
  readonly fields: OAuthProviderAccountFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for OAuthProviderAccount.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__OAuthProviderAccountClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    authAccount<T extends AuthAccountDefaultArgs<ExtArgs> = {}>(args?: Subset<T, AuthAccountDefaultArgs<ExtArgs>>): Prisma__AuthAccountClient<$Result.GetResult<Prisma.$AuthAccountPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the OAuthProviderAccount model
   */
  interface OAuthProviderAccountFieldRefs {
    readonly id: FieldRef<"OAuthProviderAccount", 'String'>
    readonly authAccountId: FieldRef<"OAuthProviderAccount", 'String'>
    readonly provider: FieldRef<"OAuthProviderAccount", 'AuthProvider'>
    readonly providerUserId: FieldRef<"OAuthProviderAccount", 'String'>
    readonly providerEmail: FieldRef<"OAuthProviderAccount", 'String'>
    readonly createdAt: FieldRef<"OAuthProviderAccount", 'DateTime'>
    readonly updatedAt: FieldRef<"OAuthProviderAccount", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * OAuthProviderAccount findUnique
   */
  export type OAuthProviderAccountFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OAuthProviderAccount
     */
    select?: OAuthProviderAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OAuthProviderAccount
     */
    omit?: OAuthProviderAccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OAuthProviderAccountInclude<ExtArgs> | null
    /**
     * Filter, which OAuthProviderAccount to fetch.
     */
    where: OAuthProviderAccountWhereUniqueInput
  }

  /**
   * OAuthProviderAccount findUniqueOrThrow
   */
  export type OAuthProviderAccountFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OAuthProviderAccount
     */
    select?: OAuthProviderAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OAuthProviderAccount
     */
    omit?: OAuthProviderAccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OAuthProviderAccountInclude<ExtArgs> | null
    /**
     * Filter, which OAuthProviderAccount to fetch.
     */
    where: OAuthProviderAccountWhereUniqueInput
  }

  /**
   * OAuthProviderAccount findFirst
   */
  export type OAuthProviderAccountFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OAuthProviderAccount
     */
    select?: OAuthProviderAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OAuthProviderAccount
     */
    omit?: OAuthProviderAccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OAuthProviderAccountInclude<ExtArgs> | null
    /**
     * Filter, which OAuthProviderAccount to fetch.
     */
    where?: OAuthProviderAccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OAuthProviderAccounts to fetch.
     */
    orderBy?: OAuthProviderAccountOrderByWithRelationInput | OAuthProviderAccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for OAuthProviderAccounts.
     */
    cursor?: OAuthProviderAccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OAuthProviderAccounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OAuthProviderAccounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of OAuthProviderAccounts.
     */
    distinct?: OAuthProviderAccountScalarFieldEnum | OAuthProviderAccountScalarFieldEnum[]
  }

  /**
   * OAuthProviderAccount findFirstOrThrow
   */
  export type OAuthProviderAccountFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OAuthProviderAccount
     */
    select?: OAuthProviderAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OAuthProviderAccount
     */
    omit?: OAuthProviderAccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OAuthProviderAccountInclude<ExtArgs> | null
    /**
     * Filter, which OAuthProviderAccount to fetch.
     */
    where?: OAuthProviderAccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OAuthProviderAccounts to fetch.
     */
    orderBy?: OAuthProviderAccountOrderByWithRelationInput | OAuthProviderAccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for OAuthProviderAccounts.
     */
    cursor?: OAuthProviderAccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OAuthProviderAccounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OAuthProviderAccounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of OAuthProviderAccounts.
     */
    distinct?: OAuthProviderAccountScalarFieldEnum | OAuthProviderAccountScalarFieldEnum[]
  }

  /**
   * OAuthProviderAccount findMany
   */
  export type OAuthProviderAccountFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OAuthProviderAccount
     */
    select?: OAuthProviderAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OAuthProviderAccount
     */
    omit?: OAuthProviderAccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OAuthProviderAccountInclude<ExtArgs> | null
    /**
     * Filter, which OAuthProviderAccounts to fetch.
     */
    where?: OAuthProviderAccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OAuthProviderAccounts to fetch.
     */
    orderBy?: OAuthProviderAccountOrderByWithRelationInput | OAuthProviderAccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing OAuthProviderAccounts.
     */
    cursor?: OAuthProviderAccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OAuthProviderAccounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OAuthProviderAccounts.
     */
    skip?: number
    distinct?: OAuthProviderAccountScalarFieldEnum | OAuthProviderAccountScalarFieldEnum[]
  }

  /**
   * OAuthProviderAccount create
   */
  export type OAuthProviderAccountCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OAuthProviderAccount
     */
    select?: OAuthProviderAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OAuthProviderAccount
     */
    omit?: OAuthProviderAccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OAuthProviderAccountInclude<ExtArgs> | null
    /**
     * The data needed to create a OAuthProviderAccount.
     */
    data: XOR<OAuthProviderAccountCreateInput, OAuthProviderAccountUncheckedCreateInput>
  }

  /**
   * OAuthProviderAccount createMany
   */
  export type OAuthProviderAccountCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many OAuthProviderAccounts.
     */
    data: OAuthProviderAccountCreateManyInput | OAuthProviderAccountCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * OAuthProviderAccount createManyAndReturn
   */
  export type OAuthProviderAccountCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OAuthProviderAccount
     */
    select?: OAuthProviderAccountSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the OAuthProviderAccount
     */
    omit?: OAuthProviderAccountOmit<ExtArgs> | null
    /**
     * The data used to create many OAuthProviderAccounts.
     */
    data: OAuthProviderAccountCreateManyInput | OAuthProviderAccountCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OAuthProviderAccountIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * OAuthProviderAccount update
   */
  export type OAuthProviderAccountUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OAuthProviderAccount
     */
    select?: OAuthProviderAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OAuthProviderAccount
     */
    omit?: OAuthProviderAccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OAuthProviderAccountInclude<ExtArgs> | null
    /**
     * The data needed to update a OAuthProviderAccount.
     */
    data: XOR<OAuthProviderAccountUpdateInput, OAuthProviderAccountUncheckedUpdateInput>
    /**
     * Choose, which OAuthProviderAccount to update.
     */
    where: OAuthProviderAccountWhereUniqueInput
  }

  /**
   * OAuthProviderAccount updateMany
   */
  export type OAuthProviderAccountUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update OAuthProviderAccounts.
     */
    data: XOR<OAuthProviderAccountUpdateManyMutationInput, OAuthProviderAccountUncheckedUpdateManyInput>
    /**
     * Filter which OAuthProviderAccounts to update
     */
    where?: OAuthProviderAccountWhereInput
    /**
     * Limit how many OAuthProviderAccounts to update.
     */
    limit?: number
  }

  /**
   * OAuthProviderAccount updateManyAndReturn
   */
  export type OAuthProviderAccountUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OAuthProviderAccount
     */
    select?: OAuthProviderAccountSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the OAuthProviderAccount
     */
    omit?: OAuthProviderAccountOmit<ExtArgs> | null
    /**
     * The data used to update OAuthProviderAccounts.
     */
    data: XOR<OAuthProviderAccountUpdateManyMutationInput, OAuthProviderAccountUncheckedUpdateManyInput>
    /**
     * Filter which OAuthProviderAccounts to update
     */
    where?: OAuthProviderAccountWhereInput
    /**
     * Limit how many OAuthProviderAccounts to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OAuthProviderAccountIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * OAuthProviderAccount upsert
   */
  export type OAuthProviderAccountUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OAuthProviderAccount
     */
    select?: OAuthProviderAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OAuthProviderAccount
     */
    omit?: OAuthProviderAccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OAuthProviderAccountInclude<ExtArgs> | null
    /**
     * The filter to search for the OAuthProviderAccount to update in case it exists.
     */
    where: OAuthProviderAccountWhereUniqueInput
    /**
     * In case the OAuthProviderAccount found by the `where` argument doesn't exist, create a new OAuthProviderAccount with this data.
     */
    create: XOR<OAuthProviderAccountCreateInput, OAuthProviderAccountUncheckedCreateInput>
    /**
     * In case the OAuthProviderAccount was found with the provided `where` argument, update it with this data.
     */
    update: XOR<OAuthProviderAccountUpdateInput, OAuthProviderAccountUncheckedUpdateInput>
  }

  /**
   * OAuthProviderAccount delete
   */
  export type OAuthProviderAccountDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OAuthProviderAccount
     */
    select?: OAuthProviderAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OAuthProviderAccount
     */
    omit?: OAuthProviderAccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OAuthProviderAccountInclude<ExtArgs> | null
    /**
     * Filter which OAuthProviderAccount to delete.
     */
    where: OAuthProviderAccountWhereUniqueInput
  }

  /**
   * OAuthProviderAccount deleteMany
   */
  export type OAuthProviderAccountDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which OAuthProviderAccounts to delete
     */
    where?: OAuthProviderAccountWhereInput
    /**
     * Limit how many OAuthProviderAccounts to delete.
     */
    limit?: number
  }

  /**
   * OAuthProviderAccount without action
   */
  export type OAuthProviderAccountDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OAuthProviderAccount
     */
    select?: OAuthProviderAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OAuthProviderAccount
     */
    omit?: OAuthProviderAccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OAuthProviderAccountInclude<ExtArgs> | null
  }


  /**
   * Model AuthSession
   */

  export type AggregateAuthSession = {
    _count: AuthSessionCountAggregateOutputType | null
    _min: AuthSessionMinAggregateOutputType | null
    _max: AuthSessionMaxAggregateOutputType | null
  }

  export type AuthSessionMinAggregateOutputType = {
    id: string | null
    authAccountId: string | null
    refreshTokenHash: string | null
    userAgent: string | null
    ipAddress: string | null
    expiresAt: Date | null
    status: $Enums.SessionStatus | null
    revokedAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AuthSessionMaxAggregateOutputType = {
    id: string | null
    authAccountId: string | null
    refreshTokenHash: string | null
    userAgent: string | null
    ipAddress: string | null
    expiresAt: Date | null
    status: $Enums.SessionStatus | null
    revokedAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AuthSessionCountAggregateOutputType = {
    id: number
    authAccountId: number
    refreshTokenHash: number
    userAgent: number
    ipAddress: number
    expiresAt: number
    status: number
    revokedAt: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type AuthSessionMinAggregateInputType = {
    id?: true
    authAccountId?: true
    refreshTokenHash?: true
    userAgent?: true
    ipAddress?: true
    expiresAt?: true
    status?: true
    revokedAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AuthSessionMaxAggregateInputType = {
    id?: true
    authAccountId?: true
    refreshTokenHash?: true
    userAgent?: true
    ipAddress?: true
    expiresAt?: true
    status?: true
    revokedAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AuthSessionCountAggregateInputType = {
    id?: true
    authAccountId?: true
    refreshTokenHash?: true
    userAgent?: true
    ipAddress?: true
    expiresAt?: true
    status?: true
    revokedAt?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type AuthSessionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AuthSession to aggregate.
     */
    where?: AuthSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuthSessions to fetch.
     */
    orderBy?: AuthSessionOrderByWithRelationInput | AuthSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AuthSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuthSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuthSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AuthSessions
    **/
    _count?: true | AuthSessionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AuthSessionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AuthSessionMaxAggregateInputType
  }

  export type GetAuthSessionAggregateType<T extends AuthSessionAggregateArgs> = {
        [P in keyof T & keyof AggregateAuthSession]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAuthSession[P]>
      : GetScalarType<T[P], AggregateAuthSession[P]>
  }




  export type AuthSessionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AuthSessionWhereInput
    orderBy?: AuthSessionOrderByWithAggregationInput | AuthSessionOrderByWithAggregationInput[]
    by: AuthSessionScalarFieldEnum[] | AuthSessionScalarFieldEnum
    having?: AuthSessionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AuthSessionCountAggregateInputType | true
    _min?: AuthSessionMinAggregateInputType
    _max?: AuthSessionMaxAggregateInputType
  }

  export type AuthSessionGroupByOutputType = {
    id: string
    authAccountId: string
    refreshTokenHash: string
    userAgent: string | null
    ipAddress: string | null
    expiresAt: Date
    status: $Enums.SessionStatus
    revokedAt: Date | null
    createdAt: Date
    updatedAt: Date
    _count: AuthSessionCountAggregateOutputType | null
    _min: AuthSessionMinAggregateOutputType | null
    _max: AuthSessionMaxAggregateOutputType | null
  }

  type GetAuthSessionGroupByPayload<T extends AuthSessionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AuthSessionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AuthSessionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AuthSessionGroupByOutputType[P]>
            : GetScalarType<T[P], AuthSessionGroupByOutputType[P]>
        }
      >
    >


  export type AuthSessionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    authAccountId?: boolean
    refreshTokenHash?: boolean
    userAgent?: boolean
    ipAddress?: boolean
    expiresAt?: boolean
    status?: boolean
    revokedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    authAccount?: boolean | AuthAccountDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["authSession"]>

  export type AuthSessionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    authAccountId?: boolean
    refreshTokenHash?: boolean
    userAgent?: boolean
    ipAddress?: boolean
    expiresAt?: boolean
    status?: boolean
    revokedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    authAccount?: boolean | AuthAccountDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["authSession"]>

  export type AuthSessionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    authAccountId?: boolean
    refreshTokenHash?: boolean
    userAgent?: boolean
    ipAddress?: boolean
    expiresAt?: boolean
    status?: boolean
    revokedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    authAccount?: boolean | AuthAccountDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["authSession"]>

  export type AuthSessionSelectScalar = {
    id?: boolean
    authAccountId?: boolean
    refreshTokenHash?: boolean
    userAgent?: boolean
    ipAddress?: boolean
    expiresAt?: boolean
    status?: boolean
    revokedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type AuthSessionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "authAccountId" | "refreshTokenHash" | "userAgent" | "ipAddress" | "expiresAt" | "status" | "revokedAt" | "createdAt" | "updatedAt", ExtArgs["result"]["authSession"]>
  export type AuthSessionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    authAccount?: boolean | AuthAccountDefaultArgs<ExtArgs>
  }
  export type AuthSessionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    authAccount?: boolean | AuthAccountDefaultArgs<ExtArgs>
  }
  export type AuthSessionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    authAccount?: boolean | AuthAccountDefaultArgs<ExtArgs>
  }

  export type $AuthSessionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AuthSession"
    objects: {
      authAccount: Prisma.$AuthAccountPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      authAccountId: string
      refreshTokenHash: string
      userAgent: string | null
      ipAddress: string | null
      expiresAt: Date
      status: $Enums.SessionStatus
      revokedAt: Date | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["authSession"]>
    composites: {}
  }

  type AuthSessionGetPayload<S extends boolean | null | undefined | AuthSessionDefaultArgs> = $Result.GetResult<Prisma.$AuthSessionPayload, S>

  type AuthSessionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AuthSessionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AuthSessionCountAggregateInputType | true
    }

  export interface AuthSessionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AuthSession'], meta: { name: 'AuthSession' } }
    /**
     * Find zero or one AuthSession that matches the filter.
     * @param {AuthSessionFindUniqueArgs} args - Arguments to find a AuthSession
     * @example
     * // Get one AuthSession
     * const authSession = await prisma.authSession.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AuthSessionFindUniqueArgs>(args: SelectSubset<T, AuthSessionFindUniqueArgs<ExtArgs>>): Prisma__AuthSessionClient<$Result.GetResult<Prisma.$AuthSessionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one AuthSession that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AuthSessionFindUniqueOrThrowArgs} args - Arguments to find a AuthSession
     * @example
     * // Get one AuthSession
     * const authSession = await prisma.authSession.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AuthSessionFindUniqueOrThrowArgs>(args: SelectSubset<T, AuthSessionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AuthSessionClient<$Result.GetResult<Prisma.$AuthSessionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AuthSession that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuthSessionFindFirstArgs} args - Arguments to find a AuthSession
     * @example
     * // Get one AuthSession
     * const authSession = await prisma.authSession.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AuthSessionFindFirstArgs>(args?: SelectSubset<T, AuthSessionFindFirstArgs<ExtArgs>>): Prisma__AuthSessionClient<$Result.GetResult<Prisma.$AuthSessionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AuthSession that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuthSessionFindFirstOrThrowArgs} args - Arguments to find a AuthSession
     * @example
     * // Get one AuthSession
     * const authSession = await prisma.authSession.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AuthSessionFindFirstOrThrowArgs>(args?: SelectSubset<T, AuthSessionFindFirstOrThrowArgs<ExtArgs>>): Prisma__AuthSessionClient<$Result.GetResult<Prisma.$AuthSessionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more AuthSessions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuthSessionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AuthSessions
     * const authSessions = await prisma.authSession.findMany()
     * 
     * // Get first 10 AuthSessions
     * const authSessions = await prisma.authSession.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const authSessionWithIdOnly = await prisma.authSession.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AuthSessionFindManyArgs>(args?: SelectSubset<T, AuthSessionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuthSessionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a AuthSession.
     * @param {AuthSessionCreateArgs} args - Arguments to create a AuthSession.
     * @example
     * // Create one AuthSession
     * const AuthSession = await prisma.authSession.create({
     *   data: {
     *     // ... data to create a AuthSession
     *   }
     * })
     * 
     */
    create<T extends AuthSessionCreateArgs>(args: SelectSubset<T, AuthSessionCreateArgs<ExtArgs>>): Prisma__AuthSessionClient<$Result.GetResult<Prisma.$AuthSessionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many AuthSessions.
     * @param {AuthSessionCreateManyArgs} args - Arguments to create many AuthSessions.
     * @example
     * // Create many AuthSessions
     * const authSession = await prisma.authSession.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AuthSessionCreateManyArgs>(args?: SelectSubset<T, AuthSessionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AuthSessions and returns the data saved in the database.
     * @param {AuthSessionCreateManyAndReturnArgs} args - Arguments to create many AuthSessions.
     * @example
     * // Create many AuthSessions
     * const authSession = await prisma.authSession.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AuthSessions and only return the `id`
     * const authSessionWithIdOnly = await prisma.authSession.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AuthSessionCreateManyAndReturnArgs>(args?: SelectSubset<T, AuthSessionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuthSessionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a AuthSession.
     * @param {AuthSessionDeleteArgs} args - Arguments to delete one AuthSession.
     * @example
     * // Delete one AuthSession
     * const AuthSession = await prisma.authSession.delete({
     *   where: {
     *     // ... filter to delete one AuthSession
     *   }
     * })
     * 
     */
    delete<T extends AuthSessionDeleteArgs>(args: SelectSubset<T, AuthSessionDeleteArgs<ExtArgs>>): Prisma__AuthSessionClient<$Result.GetResult<Prisma.$AuthSessionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one AuthSession.
     * @param {AuthSessionUpdateArgs} args - Arguments to update one AuthSession.
     * @example
     * // Update one AuthSession
     * const authSession = await prisma.authSession.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AuthSessionUpdateArgs>(args: SelectSubset<T, AuthSessionUpdateArgs<ExtArgs>>): Prisma__AuthSessionClient<$Result.GetResult<Prisma.$AuthSessionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more AuthSessions.
     * @param {AuthSessionDeleteManyArgs} args - Arguments to filter AuthSessions to delete.
     * @example
     * // Delete a few AuthSessions
     * const { count } = await prisma.authSession.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AuthSessionDeleteManyArgs>(args?: SelectSubset<T, AuthSessionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AuthSessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuthSessionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AuthSessions
     * const authSession = await prisma.authSession.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AuthSessionUpdateManyArgs>(args: SelectSubset<T, AuthSessionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AuthSessions and returns the data updated in the database.
     * @param {AuthSessionUpdateManyAndReturnArgs} args - Arguments to update many AuthSessions.
     * @example
     * // Update many AuthSessions
     * const authSession = await prisma.authSession.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more AuthSessions and only return the `id`
     * const authSessionWithIdOnly = await prisma.authSession.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AuthSessionUpdateManyAndReturnArgs>(args: SelectSubset<T, AuthSessionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuthSessionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one AuthSession.
     * @param {AuthSessionUpsertArgs} args - Arguments to update or create a AuthSession.
     * @example
     * // Update or create a AuthSession
     * const authSession = await prisma.authSession.upsert({
     *   create: {
     *     // ... data to create a AuthSession
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AuthSession we want to update
     *   }
     * })
     */
    upsert<T extends AuthSessionUpsertArgs>(args: SelectSubset<T, AuthSessionUpsertArgs<ExtArgs>>): Prisma__AuthSessionClient<$Result.GetResult<Prisma.$AuthSessionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of AuthSessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuthSessionCountArgs} args - Arguments to filter AuthSessions to count.
     * @example
     * // Count the number of AuthSessions
     * const count = await prisma.authSession.count({
     *   where: {
     *     // ... the filter for the AuthSessions we want to count
     *   }
     * })
    **/
    count<T extends AuthSessionCountArgs>(
      args?: Subset<T, AuthSessionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AuthSessionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AuthSession.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuthSessionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AuthSessionAggregateArgs>(args: Subset<T, AuthSessionAggregateArgs>): Prisma.PrismaPromise<GetAuthSessionAggregateType<T>>

    /**
     * Group by AuthSession.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuthSessionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AuthSessionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AuthSessionGroupByArgs['orderBy'] }
        : { orderBy?: AuthSessionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AuthSessionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAuthSessionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AuthSession model
   */
  readonly fields: AuthSessionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AuthSession.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AuthSessionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    authAccount<T extends AuthAccountDefaultArgs<ExtArgs> = {}>(args?: Subset<T, AuthAccountDefaultArgs<ExtArgs>>): Prisma__AuthAccountClient<$Result.GetResult<Prisma.$AuthAccountPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the AuthSession model
   */
  interface AuthSessionFieldRefs {
    readonly id: FieldRef<"AuthSession", 'String'>
    readonly authAccountId: FieldRef<"AuthSession", 'String'>
    readonly refreshTokenHash: FieldRef<"AuthSession", 'String'>
    readonly userAgent: FieldRef<"AuthSession", 'String'>
    readonly ipAddress: FieldRef<"AuthSession", 'String'>
    readonly expiresAt: FieldRef<"AuthSession", 'DateTime'>
    readonly status: FieldRef<"AuthSession", 'SessionStatus'>
    readonly revokedAt: FieldRef<"AuthSession", 'DateTime'>
    readonly createdAt: FieldRef<"AuthSession", 'DateTime'>
    readonly updatedAt: FieldRef<"AuthSession", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * AuthSession findUnique
   */
  export type AuthSessionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuthSession
     */
    select?: AuthSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuthSession
     */
    omit?: AuthSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthSessionInclude<ExtArgs> | null
    /**
     * Filter, which AuthSession to fetch.
     */
    where: AuthSessionWhereUniqueInput
  }

  /**
   * AuthSession findUniqueOrThrow
   */
  export type AuthSessionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuthSession
     */
    select?: AuthSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuthSession
     */
    omit?: AuthSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthSessionInclude<ExtArgs> | null
    /**
     * Filter, which AuthSession to fetch.
     */
    where: AuthSessionWhereUniqueInput
  }

  /**
   * AuthSession findFirst
   */
  export type AuthSessionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuthSession
     */
    select?: AuthSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuthSession
     */
    omit?: AuthSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthSessionInclude<ExtArgs> | null
    /**
     * Filter, which AuthSession to fetch.
     */
    where?: AuthSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuthSessions to fetch.
     */
    orderBy?: AuthSessionOrderByWithRelationInput | AuthSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AuthSessions.
     */
    cursor?: AuthSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuthSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuthSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AuthSessions.
     */
    distinct?: AuthSessionScalarFieldEnum | AuthSessionScalarFieldEnum[]
  }

  /**
   * AuthSession findFirstOrThrow
   */
  export type AuthSessionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuthSession
     */
    select?: AuthSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuthSession
     */
    omit?: AuthSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthSessionInclude<ExtArgs> | null
    /**
     * Filter, which AuthSession to fetch.
     */
    where?: AuthSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuthSessions to fetch.
     */
    orderBy?: AuthSessionOrderByWithRelationInput | AuthSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AuthSessions.
     */
    cursor?: AuthSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuthSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuthSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AuthSessions.
     */
    distinct?: AuthSessionScalarFieldEnum | AuthSessionScalarFieldEnum[]
  }

  /**
   * AuthSession findMany
   */
  export type AuthSessionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuthSession
     */
    select?: AuthSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuthSession
     */
    omit?: AuthSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthSessionInclude<ExtArgs> | null
    /**
     * Filter, which AuthSessions to fetch.
     */
    where?: AuthSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuthSessions to fetch.
     */
    orderBy?: AuthSessionOrderByWithRelationInput | AuthSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AuthSessions.
     */
    cursor?: AuthSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuthSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuthSessions.
     */
    skip?: number
    distinct?: AuthSessionScalarFieldEnum | AuthSessionScalarFieldEnum[]
  }

  /**
   * AuthSession create
   */
  export type AuthSessionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuthSession
     */
    select?: AuthSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuthSession
     */
    omit?: AuthSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthSessionInclude<ExtArgs> | null
    /**
     * The data needed to create a AuthSession.
     */
    data: XOR<AuthSessionCreateInput, AuthSessionUncheckedCreateInput>
  }

  /**
   * AuthSession createMany
   */
  export type AuthSessionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AuthSessions.
     */
    data: AuthSessionCreateManyInput | AuthSessionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AuthSession createManyAndReturn
   */
  export type AuthSessionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuthSession
     */
    select?: AuthSessionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AuthSession
     */
    omit?: AuthSessionOmit<ExtArgs> | null
    /**
     * The data used to create many AuthSessions.
     */
    data: AuthSessionCreateManyInput | AuthSessionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthSessionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * AuthSession update
   */
  export type AuthSessionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuthSession
     */
    select?: AuthSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuthSession
     */
    omit?: AuthSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthSessionInclude<ExtArgs> | null
    /**
     * The data needed to update a AuthSession.
     */
    data: XOR<AuthSessionUpdateInput, AuthSessionUncheckedUpdateInput>
    /**
     * Choose, which AuthSession to update.
     */
    where: AuthSessionWhereUniqueInput
  }

  /**
   * AuthSession updateMany
   */
  export type AuthSessionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AuthSessions.
     */
    data: XOR<AuthSessionUpdateManyMutationInput, AuthSessionUncheckedUpdateManyInput>
    /**
     * Filter which AuthSessions to update
     */
    where?: AuthSessionWhereInput
    /**
     * Limit how many AuthSessions to update.
     */
    limit?: number
  }

  /**
   * AuthSession updateManyAndReturn
   */
  export type AuthSessionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuthSession
     */
    select?: AuthSessionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AuthSession
     */
    omit?: AuthSessionOmit<ExtArgs> | null
    /**
     * The data used to update AuthSessions.
     */
    data: XOR<AuthSessionUpdateManyMutationInput, AuthSessionUncheckedUpdateManyInput>
    /**
     * Filter which AuthSessions to update
     */
    where?: AuthSessionWhereInput
    /**
     * Limit how many AuthSessions to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthSessionIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * AuthSession upsert
   */
  export type AuthSessionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuthSession
     */
    select?: AuthSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuthSession
     */
    omit?: AuthSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthSessionInclude<ExtArgs> | null
    /**
     * The filter to search for the AuthSession to update in case it exists.
     */
    where: AuthSessionWhereUniqueInput
    /**
     * In case the AuthSession found by the `where` argument doesn't exist, create a new AuthSession with this data.
     */
    create: XOR<AuthSessionCreateInput, AuthSessionUncheckedCreateInput>
    /**
     * In case the AuthSession was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AuthSessionUpdateInput, AuthSessionUncheckedUpdateInput>
  }

  /**
   * AuthSession delete
   */
  export type AuthSessionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuthSession
     */
    select?: AuthSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuthSession
     */
    omit?: AuthSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthSessionInclude<ExtArgs> | null
    /**
     * Filter which AuthSession to delete.
     */
    where: AuthSessionWhereUniqueInput
  }

  /**
   * AuthSession deleteMany
   */
  export type AuthSessionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AuthSessions to delete
     */
    where?: AuthSessionWhereInput
    /**
     * Limit how many AuthSessions to delete.
     */
    limit?: number
  }

  /**
   * AuthSession without action
   */
  export type AuthSessionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuthSession
     */
    select?: AuthSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuthSession
     */
    omit?: AuthSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthSessionInclude<ExtArgs> | null
  }


  /**
   * Model AuthToken
   */

  export type AggregateAuthToken = {
    _count: AuthTokenCountAggregateOutputType | null
    _min: AuthTokenMinAggregateOutputType | null
    _max: AuthTokenMaxAggregateOutputType | null
  }

  export type AuthTokenMinAggregateOutputType = {
    id: string | null
    authAccountId: string | null
    purpose: $Enums.TokenPurpose | null
    tokenHash: string | null
    expiresAt: Date | null
    consumedAt: Date | null
    createdAt: Date | null
  }

  export type AuthTokenMaxAggregateOutputType = {
    id: string | null
    authAccountId: string | null
    purpose: $Enums.TokenPurpose | null
    tokenHash: string | null
    expiresAt: Date | null
    consumedAt: Date | null
    createdAt: Date | null
  }

  export type AuthTokenCountAggregateOutputType = {
    id: number
    authAccountId: number
    purpose: number
    tokenHash: number
    expiresAt: number
    consumedAt: number
    createdAt: number
    _all: number
  }


  export type AuthTokenMinAggregateInputType = {
    id?: true
    authAccountId?: true
    purpose?: true
    tokenHash?: true
    expiresAt?: true
    consumedAt?: true
    createdAt?: true
  }

  export type AuthTokenMaxAggregateInputType = {
    id?: true
    authAccountId?: true
    purpose?: true
    tokenHash?: true
    expiresAt?: true
    consumedAt?: true
    createdAt?: true
  }

  export type AuthTokenCountAggregateInputType = {
    id?: true
    authAccountId?: true
    purpose?: true
    tokenHash?: true
    expiresAt?: true
    consumedAt?: true
    createdAt?: true
    _all?: true
  }

  export type AuthTokenAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AuthToken to aggregate.
     */
    where?: AuthTokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuthTokens to fetch.
     */
    orderBy?: AuthTokenOrderByWithRelationInput | AuthTokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AuthTokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuthTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuthTokens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AuthTokens
    **/
    _count?: true | AuthTokenCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AuthTokenMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AuthTokenMaxAggregateInputType
  }

  export type GetAuthTokenAggregateType<T extends AuthTokenAggregateArgs> = {
        [P in keyof T & keyof AggregateAuthToken]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAuthToken[P]>
      : GetScalarType<T[P], AggregateAuthToken[P]>
  }




  export type AuthTokenGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AuthTokenWhereInput
    orderBy?: AuthTokenOrderByWithAggregationInput | AuthTokenOrderByWithAggregationInput[]
    by: AuthTokenScalarFieldEnum[] | AuthTokenScalarFieldEnum
    having?: AuthTokenScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AuthTokenCountAggregateInputType | true
    _min?: AuthTokenMinAggregateInputType
    _max?: AuthTokenMaxAggregateInputType
  }

  export type AuthTokenGroupByOutputType = {
    id: string
    authAccountId: string
    purpose: $Enums.TokenPurpose
    tokenHash: string
    expiresAt: Date
    consumedAt: Date | null
    createdAt: Date
    _count: AuthTokenCountAggregateOutputType | null
    _min: AuthTokenMinAggregateOutputType | null
    _max: AuthTokenMaxAggregateOutputType | null
  }

  type GetAuthTokenGroupByPayload<T extends AuthTokenGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AuthTokenGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AuthTokenGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AuthTokenGroupByOutputType[P]>
            : GetScalarType<T[P], AuthTokenGroupByOutputType[P]>
        }
      >
    >


  export type AuthTokenSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    authAccountId?: boolean
    purpose?: boolean
    tokenHash?: boolean
    expiresAt?: boolean
    consumedAt?: boolean
    createdAt?: boolean
    authAccount?: boolean | AuthAccountDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["authToken"]>

  export type AuthTokenSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    authAccountId?: boolean
    purpose?: boolean
    tokenHash?: boolean
    expiresAt?: boolean
    consumedAt?: boolean
    createdAt?: boolean
    authAccount?: boolean | AuthAccountDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["authToken"]>

  export type AuthTokenSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    authAccountId?: boolean
    purpose?: boolean
    tokenHash?: boolean
    expiresAt?: boolean
    consumedAt?: boolean
    createdAt?: boolean
    authAccount?: boolean | AuthAccountDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["authToken"]>

  export type AuthTokenSelectScalar = {
    id?: boolean
    authAccountId?: boolean
    purpose?: boolean
    tokenHash?: boolean
    expiresAt?: boolean
    consumedAt?: boolean
    createdAt?: boolean
  }

  export type AuthTokenOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "authAccountId" | "purpose" | "tokenHash" | "expiresAt" | "consumedAt" | "createdAt", ExtArgs["result"]["authToken"]>
  export type AuthTokenInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    authAccount?: boolean | AuthAccountDefaultArgs<ExtArgs>
  }
  export type AuthTokenIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    authAccount?: boolean | AuthAccountDefaultArgs<ExtArgs>
  }
  export type AuthTokenIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    authAccount?: boolean | AuthAccountDefaultArgs<ExtArgs>
  }

  export type $AuthTokenPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AuthToken"
    objects: {
      authAccount: Prisma.$AuthAccountPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      authAccountId: string
      purpose: $Enums.TokenPurpose
      tokenHash: string
      expiresAt: Date
      consumedAt: Date | null
      createdAt: Date
    }, ExtArgs["result"]["authToken"]>
    composites: {}
  }

  type AuthTokenGetPayload<S extends boolean | null | undefined | AuthTokenDefaultArgs> = $Result.GetResult<Prisma.$AuthTokenPayload, S>

  type AuthTokenCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AuthTokenFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AuthTokenCountAggregateInputType | true
    }

  export interface AuthTokenDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AuthToken'], meta: { name: 'AuthToken' } }
    /**
     * Find zero or one AuthToken that matches the filter.
     * @param {AuthTokenFindUniqueArgs} args - Arguments to find a AuthToken
     * @example
     * // Get one AuthToken
     * const authToken = await prisma.authToken.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AuthTokenFindUniqueArgs>(args: SelectSubset<T, AuthTokenFindUniqueArgs<ExtArgs>>): Prisma__AuthTokenClient<$Result.GetResult<Prisma.$AuthTokenPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one AuthToken that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AuthTokenFindUniqueOrThrowArgs} args - Arguments to find a AuthToken
     * @example
     * // Get one AuthToken
     * const authToken = await prisma.authToken.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AuthTokenFindUniqueOrThrowArgs>(args: SelectSubset<T, AuthTokenFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AuthTokenClient<$Result.GetResult<Prisma.$AuthTokenPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AuthToken that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuthTokenFindFirstArgs} args - Arguments to find a AuthToken
     * @example
     * // Get one AuthToken
     * const authToken = await prisma.authToken.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AuthTokenFindFirstArgs>(args?: SelectSubset<T, AuthTokenFindFirstArgs<ExtArgs>>): Prisma__AuthTokenClient<$Result.GetResult<Prisma.$AuthTokenPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AuthToken that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuthTokenFindFirstOrThrowArgs} args - Arguments to find a AuthToken
     * @example
     * // Get one AuthToken
     * const authToken = await prisma.authToken.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AuthTokenFindFirstOrThrowArgs>(args?: SelectSubset<T, AuthTokenFindFirstOrThrowArgs<ExtArgs>>): Prisma__AuthTokenClient<$Result.GetResult<Prisma.$AuthTokenPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more AuthTokens that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuthTokenFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AuthTokens
     * const authTokens = await prisma.authToken.findMany()
     * 
     * // Get first 10 AuthTokens
     * const authTokens = await prisma.authToken.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const authTokenWithIdOnly = await prisma.authToken.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AuthTokenFindManyArgs>(args?: SelectSubset<T, AuthTokenFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuthTokenPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a AuthToken.
     * @param {AuthTokenCreateArgs} args - Arguments to create a AuthToken.
     * @example
     * // Create one AuthToken
     * const AuthToken = await prisma.authToken.create({
     *   data: {
     *     // ... data to create a AuthToken
     *   }
     * })
     * 
     */
    create<T extends AuthTokenCreateArgs>(args: SelectSubset<T, AuthTokenCreateArgs<ExtArgs>>): Prisma__AuthTokenClient<$Result.GetResult<Prisma.$AuthTokenPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many AuthTokens.
     * @param {AuthTokenCreateManyArgs} args - Arguments to create many AuthTokens.
     * @example
     * // Create many AuthTokens
     * const authToken = await prisma.authToken.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AuthTokenCreateManyArgs>(args?: SelectSubset<T, AuthTokenCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AuthTokens and returns the data saved in the database.
     * @param {AuthTokenCreateManyAndReturnArgs} args - Arguments to create many AuthTokens.
     * @example
     * // Create many AuthTokens
     * const authToken = await prisma.authToken.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AuthTokens and only return the `id`
     * const authTokenWithIdOnly = await prisma.authToken.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AuthTokenCreateManyAndReturnArgs>(args?: SelectSubset<T, AuthTokenCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuthTokenPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a AuthToken.
     * @param {AuthTokenDeleteArgs} args - Arguments to delete one AuthToken.
     * @example
     * // Delete one AuthToken
     * const AuthToken = await prisma.authToken.delete({
     *   where: {
     *     // ... filter to delete one AuthToken
     *   }
     * })
     * 
     */
    delete<T extends AuthTokenDeleteArgs>(args: SelectSubset<T, AuthTokenDeleteArgs<ExtArgs>>): Prisma__AuthTokenClient<$Result.GetResult<Prisma.$AuthTokenPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one AuthToken.
     * @param {AuthTokenUpdateArgs} args - Arguments to update one AuthToken.
     * @example
     * // Update one AuthToken
     * const authToken = await prisma.authToken.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AuthTokenUpdateArgs>(args: SelectSubset<T, AuthTokenUpdateArgs<ExtArgs>>): Prisma__AuthTokenClient<$Result.GetResult<Prisma.$AuthTokenPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more AuthTokens.
     * @param {AuthTokenDeleteManyArgs} args - Arguments to filter AuthTokens to delete.
     * @example
     * // Delete a few AuthTokens
     * const { count } = await prisma.authToken.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AuthTokenDeleteManyArgs>(args?: SelectSubset<T, AuthTokenDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AuthTokens.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuthTokenUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AuthTokens
     * const authToken = await prisma.authToken.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AuthTokenUpdateManyArgs>(args: SelectSubset<T, AuthTokenUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AuthTokens and returns the data updated in the database.
     * @param {AuthTokenUpdateManyAndReturnArgs} args - Arguments to update many AuthTokens.
     * @example
     * // Update many AuthTokens
     * const authToken = await prisma.authToken.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more AuthTokens and only return the `id`
     * const authTokenWithIdOnly = await prisma.authToken.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AuthTokenUpdateManyAndReturnArgs>(args: SelectSubset<T, AuthTokenUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuthTokenPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one AuthToken.
     * @param {AuthTokenUpsertArgs} args - Arguments to update or create a AuthToken.
     * @example
     * // Update or create a AuthToken
     * const authToken = await prisma.authToken.upsert({
     *   create: {
     *     // ... data to create a AuthToken
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AuthToken we want to update
     *   }
     * })
     */
    upsert<T extends AuthTokenUpsertArgs>(args: SelectSubset<T, AuthTokenUpsertArgs<ExtArgs>>): Prisma__AuthTokenClient<$Result.GetResult<Prisma.$AuthTokenPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of AuthTokens.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuthTokenCountArgs} args - Arguments to filter AuthTokens to count.
     * @example
     * // Count the number of AuthTokens
     * const count = await prisma.authToken.count({
     *   where: {
     *     // ... the filter for the AuthTokens we want to count
     *   }
     * })
    **/
    count<T extends AuthTokenCountArgs>(
      args?: Subset<T, AuthTokenCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AuthTokenCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AuthToken.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuthTokenAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AuthTokenAggregateArgs>(args: Subset<T, AuthTokenAggregateArgs>): Prisma.PrismaPromise<GetAuthTokenAggregateType<T>>

    /**
     * Group by AuthToken.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuthTokenGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AuthTokenGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AuthTokenGroupByArgs['orderBy'] }
        : { orderBy?: AuthTokenGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AuthTokenGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAuthTokenGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AuthToken model
   */
  readonly fields: AuthTokenFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AuthToken.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AuthTokenClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    authAccount<T extends AuthAccountDefaultArgs<ExtArgs> = {}>(args?: Subset<T, AuthAccountDefaultArgs<ExtArgs>>): Prisma__AuthAccountClient<$Result.GetResult<Prisma.$AuthAccountPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the AuthToken model
   */
  interface AuthTokenFieldRefs {
    readonly id: FieldRef<"AuthToken", 'String'>
    readonly authAccountId: FieldRef<"AuthToken", 'String'>
    readonly purpose: FieldRef<"AuthToken", 'TokenPurpose'>
    readonly tokenHash: FieldRef<"AuthToken", 'String'>
    readonly expiresAt: FieldRef<"AuthToken", 'DateTime'>
    readonly consumedAt: FieldRef<"AuthToken", 'DateTime'>
    readonly createdAt: FieldRef<"AuthToken", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * AuthToken findUnique
   */
  export type AuthTokenFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuthToken
     */
    select?: AuthTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuthToken
     */
    omit?: AuthTokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthTokenInclude<ExtArgs> | null
    /**
     * Filter, which AuthToken to fetch.
     */
    where: AuthTokenWhereUniqueInput
  }

  /**
   * AuthToken findUniqueOrThrow
   */
  export type AuthTokenFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuthToken
     */
    select?: AuthTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuthToken
     */
    omit?: AuthTokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthTokenInclude<ExtArgs> | null
    /**
     * Filter, which AuthToken to fetch.
     */
    where: AuthTokenWhereUniqueInput
  }

  /**
   * AuthToken findFirst
   */
  export type AuthTokenFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuthToken
     */
    select?: AuthTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuthToken
     */
    omit?: AuthTokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthTokenInclude<ExtArgs> | null
    /**
     * Filter, which AuthToken to fetch.
     */
    where?: AuthTokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuthTokens to fetch.
     */
    orderBy?: AuthTokenOrderByWithRelationInput | AuthTokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AuthTokens.
     */
    cursor?: AuthTokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuthTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuthTokens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AuthTokens.
     */
    distinct?: AuthTokenScalarFieldEnum | AuthTokenScalarFieldEnum[]
  }

  /**
   * AuthToken findFirstOrThrow
   */
  export type AuthTokenFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuthToken
     */
    select?: AuthTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuthToken
     */
    omit?: AuthTokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthTokenInclude<ExtArgs> | null
    /**
     * Filter, which AuthToken to fetch.
     */
    where?: AuthTokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuthTokens to fetch.
     */
    orderBy?: AuthTokenOrderByWithRelationInput | AuthTokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AuthTokens.
     */
    cursor?: AuthTokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuthTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuthTokens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AuthTokens.
     */
    distinct?: AuthTokenScalarFieldEnum | AuthTokenScalarFieldEnum[]
  }

  /**
   * AuthToken findMany
   */
  export type AuthTokenFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuthToken
     */
    select?: AuthTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuthToken
     */
    omit?: AuthTokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthTokenInclude<ExtArgs> | null
    /**
     * Filter, which AuthTokens to fetch.
     */
    where?: AuthTokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuthTokens to fetch.
     */
    orderBy?: AuthTokenOrderByWithRelationInput | AuthTokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AuthTokens.
     */
    cursor?: AuthTokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuthTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuthTokens.
     */
    skip?: number
    distinct?: AuthTokenScalarFieldEnum | AuthTokenScalarFieldEnum[]
  }

  /**
   * AuthToken create
   */
  export type AuthTokenCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuthToken
     */
    select?: AuthTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuthToken
     */
    omit?: AuthTokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthTokenInclude<ExtArgs> | null
    /**
     * The data needed to create a AuthToken.
     */
    data: XOR<AuthTokenCreateInput, AuthTokenUncheckedCreateInput>
  }

  /**
   * AuthToken createMany
   */
  export type AuthTokenCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AuthTokens.
     */
    data: AuthTokenCreateManyInput | AuthTokenCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AuthToken createManyAndReturn
   */
  export type AuthTokenCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuthToken
     */
    select?: AuthTokenSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AuthToken
     */
    omit?: AuthTokenOmit<ExtArgs> | null
    /**
     * The data used to create many AuthTokens.
     */
    data: AuthTokenCreateManyInput | AuthTokenCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthTokenIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * AuthToken update
   */
  export type AuthTokenUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuthToken
     */
    select?: AuthTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuthToken
     */
    omit?: AuthTokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthTokenInclude<ExtArgs> | null
    /**
     * The data needed to update a AuthToken.
     */
    data: XOR<AuthTokenUpdateInput, AuthTokenUncheckedUpdateInput>
    /**
     * Choose, which AuthToken to update.
     */
    where: AuthTokenWhereUniqueInput
  }

  /**
   * AuthToken updateMany
   */
  export type AuthTokenUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AuthTokens.
     */
    data: XOR<AuthTokenUpdateManyMutationInput, AuthTokenUncheckedUpdateManyInput>
    /**
     * Filter which AuthTokens to update
     */
    where?: AuthTokenWhereInput
    /**
     * Limit how many AuthTokens to update.
     */
    limit?: number
  }

  /**
   * AuthToken updateManyAndReturn
   */
  export type AuthTokenUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuthToken
     */
    select?: AuthTokenSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AuthToken
     */
    omit?: AuthTokenOmit<ExtArgs> | null
    /**
     * The data used to update AuthTokens.
     */
    data: XOR<AuthTokenUpdateManyMutationInput, AuthTokenUncheckedUpdateManyInput>
    /**
     * Filter which AuthTokens to update
     */
    where?: AuthTokenWhereInput
    /**
     * Limit how many AuthTokens to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthTokenIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * AuthToken upsert
   */
  export type AuthTokenUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuthToken
     */
    select?: AuthTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuthToken
     */
    omit?: AuthTokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthTokenInclude<ExtArgs> | null
    /**
     * The filter to search for the AuthToken to update in case it exists.
     */
    where: AuthTokenWhereUniqueInput
    /**
     * In case the AuthToken found by the `where` argument doesn't exist, create a new AuthToken with this data.
     */
    create: XOR<AuthTokenCreateInput, AuthTokenUncheckedCreateInput>
    /**
     * In case the AuthToken was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AuthTokenUpdateInput, AuthTokenUncheckedUpdateInput>
  }

  /**
   * AuthToken delete
   */
  export type AuthTokenDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuthToken
     */
    select?: AuthTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuthToken
     */
    omit?: AuthTokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthTokenInclude<ExtArgs> | null
    /**
     * Filter which AuthToken to delete.
     */
    where: AuthTokenWhereUniqueInput
  }

  /**
   * AuthToken deleteMany
   */
  export type AuthTokenDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AuthTokens to delete
     */
    where?: AuthTokenWhereInput
    /**
     * Limit how many AuthTokens to delete.
     */
    limit?: number
  }

  /**
   * AuthToken without action
   */
  export type AuthTokenDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuthToken
     */
    select?: AuthTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuthToken
     */
    omit?: AuthTokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthTokenInclude<ExtArgs> | null
  }


  /**
   * Model AuthChallenge
   */

  export type AggregateAuthChallenge = {
    _count: AuthChallengeCountAggregateOutputType | null
    _avg: AuthChallengeAvgAggregateOutputType | null
    _sum: AuthChallengeSumAggregateOutputType | null
    _min: AuthChallengeMinAggregateOutputType | null
    _max: AuthChallengeMaxAggregateOutputType | null
  }

  export type AuthChallengeAvgAggregateOutputType = {
    attemptCount: number | null
    resendCount: number | null
  }

  export type AuthChallengeSumAggregateOutputType = {
    attemptCount: number | null
    resendCount: number | null
  }

  export type AuthChallengeMinAggregateOutputType = {
    id: string | null
    authAccountId: string | null
    email: string | null
    normalizedEmail: string | null
    purpose: $Enums.AuthChallengePurpose | null
    requestedRole: string | null
    fullName: string | null
    passwordHash: string | null
    codeHash: string | null
    expiresAt: Date | null
    consumedAt: Date | null
    attemptCount: number | null
    resendCount: number | null
    lastSentAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AuthChallengeMaxAggregateOutputType = {
    id: string | null
    authAccountId: string | null
    email: string | null
    normalizedEmail: string | null
    purpose: $Enums.AuthChallengePurpose | null
    requestedRole: string | null
    fullName: string | null
    passwordHash: string | null
    codeHash: string | null
    expiresAt: Date | null
    consumedAt: Date | null
    attemptCount: number | null
    resendCount: number | null
    lastSentAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AuthChallengeCountAggregateOutputType = {
    id: number
    authAccountId: number
    email: number
    normalizedEmail: number
    purpose: number
    requestedRole: number
    fullName: number
    passwordHash: number
    codeHash: number
    expiresAt: number
    consumedAt: number
    attemptCount: number
    resendCount: number
    lastSentAt: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type AuthChallengeAvgAggregateInputType = {
    attemptCount?: true
    resendCount?: true
  }

  export type AuthChallengeSumAggregateInputType = {
    attemptCount?: true
    resendCount?: true
  }

  export type AuthChallengeMinAggregateInputType = {
    id?: true
    authAccountId?: true
    email?: true
    normalizedEmail?: true
    purpose?: true
    requestedRole?: true
    fullName?: true
    passwordHash?: true
    codeHash?: true
    expiresAt?: true
    consumedAt?: true
    attemptCount?: true
    resendCount?: true
    lastSentAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AuthChallengeMaxAggregateInputType = {
    id?: true
    authAccountId?: true
    email?: true
    normalizedEmail?: true
    purpose?: true
    requestedRole?: true
    fullName?: true
    passwordHash?: true
    codeHash?: true
    expiresAt?: true
    consumedAt?: true
    attemptCount?: true
    resendCount?: true
    lastSentAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AuthChallengeCountAggregateInputType = {
    id?: true
    authAccountId?: true
    email?: true
    normalizedEmail?: true
    purpose?: true
    requestedRole?: true
    fullName?: true
    passwordHash?: true
    codeHash?: true
    expiresAt?: true
    consumedAt?: true
    attemptCount?: true
    resendCount?: true
    lastSentAt?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type AuthChallengeAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AuthChallenge to aggregate.
     */
    where?: AuthChallengeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuthChallenges to fetch.
     */
    orderBy?: AuthChallengeOrderByWithRelationInput | AuthChallengeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AuthChallengeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuthChallenges from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuthChallenges.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AuthChallenges
    **/
    _count?: true | AuthChallengeCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: AuthChallengeAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: AuthChallengeSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AuthChallengeMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AuthChallengeMaxAggregateInputType
  }

  export type GetAuthChallengeAggregateType<T extends AuthChallengeAggregateArgs> = {
        [P in keyof T & keyof AggregateAuthChallenge]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAuthChallenge[P]>
      : GetScalarType<T[P], AggregateAuthChallenge[P]>
  }




  export type AuthChallengeGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AuthChallengeWhereInput
    orderBy?: AuthChallengeOrderByWithAggregationInput | AuthChallengeOrderByWithAggregationInput[]
    by: AuthChallengeScalarFieldEnum[] | AuthChallengeScalarFieldEnum
    having?: AuthChallengeScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AuthChallengeCountAggregateInputType | true
    _avg?: AuthChallengeAvgAggregateInputType
    _sum?: AuthChallengeSumAggregateInputType
    _min?: AuthChallengeMinAggregateInputType
    _max?: AuthChallengeMaxAggregateInputType
  }

  export type AuthChallengeGroupByOutputType = {
    id: string
    authAccountId: string | null
    email: string
    normalizedEmail: string
    purpose: $Enums.AuthChallengePurpose
    requestedRole: string | null
    fullName: string | null
    passwordHash: string | null
    codeHash: string
    expiresAt: Date
    consumedAt: Date | null
    attemptCount: number
    resendCount: number
    lastSentAt: Date
    createdAt: Date
    updatedAt: Date
    _count: AuthChallengeCountAggregateOutputType | null
    _avg: AuthChallengeAvgAggregateOutputType | null
    _sum: AuthChallengeSumAggregateOutputType | null
    _min: AuthChallengeMinAggregateOutputType | null
    _max: AuthChallengeMaxAggregateOutputType | null
  }

  type GetAuthChallengeGroupByPayload<T extends AuthChallengeGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AuthChallengeGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AuthChallengeGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AuthChallengeGroupByOutputType[P]>
            : GetScalarType<T[P], AuthChallengeGroupByOutputType[P]>
        }
      >
    >


  export type AuthChallengeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    authAccountId?: boolean
    email?: boolean
    normalizedEmail?: boolean
    purpose?: boolean
    requestedRole?: boolean
    fullName?: boolean
    passwordHash?: boolean
    codeHash?: boolean
    expiresAt?: boolean
    consumedAt?: boolean
    attemptCount?: boolean
    resendCount?: boolean
    lastSentAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    authAccount?: boolean | AuthChallenge$authAccountArgs<ExtArgs>
  }, ExtArgs["result"]["authChallenge"]>

  export type AuthChallengeSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    authAccountId?: boolean
    email?: boolean
    normalizedEmail?: boolean
    purpose?: boolean
    requestedRole?: boolean
    fullName?: boolean
    passwordHash?: boolean
    codeHash?: boolean
    expiresAt?: boolean
    consumedAt?: boolean
    attemptCount?: boolean
    resendCount?: boolean
    lastSentAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    authAccount?: boolean | AuthChallenge$authAccountArgs<ExtArgs>
  }, ExtArgs["result"]["authChallenge"]>

  export type AuthChallengeSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    authAccountId?: boolean
    email?: boolean
    normalizedEmail?: boolean
    purpose?: boolean
    requestedRole?: boolean
    fullName?: boolean
    passwordHash?: boolean
    codeHash?: boolean
    expiresAt?: boolean
    consumedAt?: boolean
    attemptCount?: boolean
    resendCount?: boolean
    lastSentAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    authAccount?: boolean | AuthChallenge$authAccountArgs<ExtArgs>
  }, ExtArgs["result"]["authChallenge"]>

  export type AuthChallengeSelectScalar = {
    id?: boolean
    authAccountId?: boolean
    email?: boolean
    normalizedEmail?: boolean
    purpose?: boolean
    requestedRole?: boolean
    fullName?: boolean
    passwordHash?: boolean
    codeHash?: boolean
    expiresAt?: boolean
    consumedAt?: boolean
    attemptCount?: boolean
    resendCount?: boolean
    lastSentAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type AuthChallengeOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "authAccountId" | "email" | "normalizedEmail" | "purpose" | "requestedRole" | "fullName" | "passwordHash" | "codeHash" | "expiresAt" | "consumedAt" | "attemptCount" | "resendCount" | "lastSentAt" | "createdAt" | "updatedAt", ExtArgs["result"]["authChallenge"]>
  export type AuthChallengeInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    authAccount?: boolean | AuthChallenge$authAccountArgs<ExtArgs>
  }
  export type AuthChallengeIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    authAccount?: boolean | AuthChallenge$authAccountArgs<ExtArgs>
  }
  export type AuthChallengeIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    authAccount?: boolean | AuthChallenge$authAccountArgs<ExtArgs>
  }

  export type $AuthChallengePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AuthChallenge"
    objects: {
      authAccount: Prisma.$AuthAccountPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      authAccountId: string | null
      email: string
      normalizedEmail: string
      purpose: $Enums.AuthChallengePurpose
      requestedRole: string | null
      fullName: string | null
      passwordHash: string | null
      codeHash: string
      expiresAt: Date
      consumedAt: Date | null
      attemptCount: number
      resendCount: number
      lastSentAt: Date
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["authChallenge"]>
    composites: {}
  }

  type AuthChallengeGetPayload<S extends boolean | null | undefined | AuthChallengeDefaultArgs> = $Result.GetResult<Prisma.$AuthChallengePayload, S>

  type AuthChallengeCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AuthChallengeFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AuthChallengeCountAggregateInputType | true
    }

  export interface AuthChallengeDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AuthChallenge'], meta: { name: 'AuthChallenge' } }
    /**
     * Find zero or one AuthChallenge that matches the filter.
     * @param {AuthChallengeFindUniqueArgs} args - Arguments to find a AuthChallenge
     * @example
     * // Get one AuthChallenge
     * const authChallenge = await prisma.authChallenge.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AuthChallengeFindUniqueArgs>(args: SelectSubset<T, AuthChallengeFindUniqueArgs<ExtArgs>>): Prisma__AuthChallengeClient<$Result.GetResult<Prisma.$AuthChallengePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one AuthChallenge that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AuthChallengeFindUniqueOrThrowArgs} args - Arguments to find a AuthChallenge
     * @example
     * // Get one AuthChallenge
     * const authChallenge = await prisma.authChallenge.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AuthChallengeFindUniqueOrThrowArgs>(args: SelectSubset<T, AuthChallengeFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AuthChallengeClient<$Result.GetResult<Prisma.$AuthChallengePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AuthChallenge that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuthChallengeFindFirstArgs} args - Arguments to find a AuthChallenge
     * @example
     * // Get one AuthChallenge
     * const authChallenge = await prisma.authChallenge.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AuthChallengeFindFirstArgs>(args?: SelectSubset<T, AuthChallengeFindFirstArgs<ExtArgs>>): Prisma__AuthChallengeClient<$Result.GetResult<Prisma.$AuthChallengePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AuthChallenge that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuthChallengeFindFirstOrThrowArgs} args - Arguments to find a AuthChallenge
     * @example
     * // Get one AuthChallenge
     * const authChallenge = await prisma.authChallenge.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AuthChallengeFindFirstOrThrowArgs>(args?: SelectSubset<T, AuthChallengeFindFirstOrThrowArgs<ExtArgs>>): Prisma__AuthChallengeClient<$Result.GetResult<Prisma.$AuthChallengePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more AuthChallenges that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuthChallengeFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AuthChallenges
     * const authChallenges = await prisma.authChallenge.findMany()
     * 
     * // Get first 10 AuthChallenges
     * const authChallenges = await prisma.authChallenge.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const authChallengeWithIdOnly = await prisma.authChallenge.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AuthChallengeFindManyArgs>(args?: SelectSubset<T, AuthChallengeFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuthChallengePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a AuthChallenge.
     * @param {AuthChallengeCreateArgs} args - Arguments to create a AuthChallenge.
     * @example
     * // Create one AuthChallenge
     * const AuthChallenge = await prisma.authChallenge.create({
     *   data: {
     *     // ... data to create a AuthChallenge
     *   }
     * })
     * 
     */
    create<T extends AuthChallengeCreateArgs>(args: SelectSubset<T, AuthChallengeCreateArgs<ExtArgs>>): Prisma__AuthChallengeClient<$Result.GetResult<Prisma.$AuthChallengePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many AuthChallenges.
     * @param {AuthChallengeCreateManyArgs} args - Arguments to create many AuthChallenges.
     * @example
     * // Create many AuthChallenges
     * const authChallenge = await prisma.authChallenge.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AuthChallengeCreateManyArgs>(args?: SelectSubset<T, AuthChallengeCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AuthChallenges and returns the data saved in the database.
     * @param {AuthChallengeCreateManyAndReturnArgs} args - Arguments to create many AuthChallenges.
     * @example
     * // Create many AuthChallenges
     * const authChallenge = await prisma.authChallenge.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AuthChallenges and only return the `id`
     * const authChallengeWithIdOnly = await prisma.authChallenge.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AuthChallengeCreateManyAndReturnArgs>(args?: SelectSubset<T, AuthChallengeCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuthChallengePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a AuthChallenge.
     * @param {AuthChallengeDeleteArgs} args - Arguments to delete one AuthChallenge.
     * @example
     * // Delete one AuthChallenge
     * const AuthChallenge = await prisma.authChallenge.delete({
     *   where: {
     *     // ... filter to delete one AuthChallenge
     *   }
     * })
     * 
     */
    delete<T extends AuthChallengeDeleteArgs>(args: SelectSubset<T, AuthChallengeDeleteArgs<ExtArgs>>): Prisma__AuthChallengeClient<$Result.GetResult<Prisma.$AuthChallengePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one AuthChallenge.
     * @param {AuthChallengeUpdateArgs} args - Arguments to update one AuthChallenge.
     * @example
     * // Update one AuthChallenge
     * const authChallenge = await prisma.authChallenge.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AuthChallengeUpdateArgs>(args: SelectSubset<T, AuthChallengeUpdateArgs<ExtArgs>>): Prisma__AuthChallengeClient<$Result.GetResult<Prisma.$AuthChallengePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more AuthChallenges.
     * @param {AuthChallengeDeleteManyArgs} args - Arguments to filter AuthChallenges to delete.
     * @example
     * // Delete a few AuthChallenges
     * const { count } = await prisma.authChallenge.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AuthChallengeDeleteManyArgs>(args?: SelectSubset<T, AuthChallengeDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AuthChallenges.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuthChallengeUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AuthChallenges
     * const authChallenge = await prisma.authChallenge.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AuthChallengeUpdateManyArgs>(args: SelectSubset<T, AuthChallengeUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AuthChallenges and returns the data updated in the database.
     * @param {AuthChallengeUpdateManyAndReturnArgs} args - Arguments to update many AuthChallenges.
     * @example
     * // Update many AuthChallenges
     * const authChallenge = await prisma.authChallenge.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more AuthChallenges and only return the `id`
     * const authChallengeWithIdOnly = await prisma.authChallenge.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AuthChallengeUpdateManyAndReturnArgs>(args: SelectSubset<T, AuthChallengeUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuthChallengePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one AuthChallenge.
     * @param {AuthChallengeUpsertArgs} args - Arguments to update or create a AuthChallenge.
     * @example
     * // Update or create a AuthChallenge
     * const authChallenge = await prisma.authChallenge.upsert({
     *   create: {
     *     // ... data to create a AuthChallenge
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AuthChallenge we want to update
     *   }
     * })
     */
    upsert<T extends AuthChallengeUpsertArgs>(args: SelectSubset<T, AuthChallengeUpsertArgs<ExtArgs>>): Prisma__AuthChallengeClient<$Result.GetResult<Prisma.$AuthChallengePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of AuthChallenges.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuthChallengeCountArgs} args - Arguments to filter AuthChallenges to count.
     * @example
     * // Count the number of AuthChallenges
     * const count = await prisma.authChallenge.count({
     *   where: {
     *     // ... the filter for the AuthChallenges we want to count
     *   }
     * })
    **/
    count<T extends AuthChallengeCountArgs>(
      args?: Subset<T, AuthChallengeCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AuthChallengeCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AuthChallenge.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuthChallengeAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AuthChallengeAggregateArgs>(args: Subset<T, AuthChallengeAggregateArgs>): Prisma.PrismaPromise<GetAuthChallengeAggregateType<T>>

    /**
     * Group by AuthChallenge.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuthChallengeGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AuthChallengeGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AuthChallengeGroupByArgs['orderBy'] }
        : { orderBy?: AuthChallengeGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AuthChallengeGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAuthChallengeGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AuthChallenge model
   */
  readonly fields: AuthChallengeFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AuthChallenge.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AuthChallengeClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    authAccount<T extends AuthChallenge$authAccountArgs<ExtArgs> = {}>(args?: Subset<T, AuthChallenge$authAccountArgs<ExtArgs>>): Prisma__AuthAccountClient<$Result.GetResult<Prisma.$AuthAccountPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the AuthChallenge model
   */
  interface AuthChallengeFieldRefs {
    readonly id: FieldRef<"AuthChallenge", 'String'>
    readonly authAccountId: FieldRef<"AuthChallenge", 'String'>
    readonly email: FieldRef<"AuthChallenge", 'String'>
    readonly normalizedEmail: FieldRef<"AuthChallenge", 'String'>
    readonly purpose: FieldRef<"AuthChallenge", 'AuthChallengePurpose'>
    readonly requestedRole: FieldRef<"AuthChallenge", 'String'>
    readonly fullName: FieldRef<"AuthChallenge", 'String'>
    readonly passwordHash: FieldRef<"AuthChallenge", 'String'>
    readonly codeHash: FieldRef<"AuthChallenge", 'String'>
    readonly expiresAt: FieldRef<"AuthChallenge", 'DateTime'>
    readonly consumedAt: FieldRef<"AuthChallenge", 'DateTime'>
    readonly attemptCount: FieldRef<"AuthChallenge", 'Int'>
    readonly resendCount: FieldRef<"AuthChallenge", 'Int'>
    readonly lastSentAt: FieldRef<"AuthChallenge", 'DateTime'>
    readonly createdAt: FieldRef<"AuthChallenge", 'DateTime'>
    readonly updatedAt: FieldRef<"AuthChallenge", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * AuthChallenge findUnique
   */
  export type AuthChallengeFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuthChallenge
     */
    select?: AuthChallengeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuthChallenge
     */
    omit?: AuthChallengeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthChallengeInclude<ExtArgs> | null
    /**
     * Filter, which AuthChallenge to fetch.
     */
    where: AuthChallengeWhereUniqueInput
  }

  /**
   * AuthChallenge findUniqueOrThrow
   */
  export type AuthChallengeFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuthChallenge
     */
    select?: AuthChallengeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuthChallenge
     */
    omit?: AuthChallengeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthChallengeInclude<ExtArgs> | null
    /**
     * Filter, which AuthChallenge to fetch.
     */
    where: AuthChallengeWhereUniqueInput
  }

  /**
   * AuthChallenge findFirst
   */
  export type AuthChallengeFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuthChallenge
     */
    select?: AuthChallengeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuthChallenge
     */
    omit?: AuthChallengeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthChallengeInclude<ExtArgs> | null
    /**
     * Filter, which AuthChallenge to fetch.
     */
    where?: AuthChallengeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuthChallenges to fetch.
     */
    orderBy?: AuthChallengeOrderByWithRelationInput | AuthChallengeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AuthChallenges.
     */
    cursor?: AuthChallengeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuthChallenges from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuthChallenges.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AuthChallenges.
     */
    distinct?: AuthChallengeScalarFieldEnum | AuthChallengeScalarFieldEnum[]
  }

  /**
   * AuthChallenge findFirstOrThrow
   */
  export type AuthChallengeFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuthChallenge
     */
    select?: AuthChallengeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuthChallenge
     */
    omit?: AuthChallengeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthChallengeInclude<ExtArgs> | null
    /**
     * Filter, which AuthChallenge to fetch.
     */
    where?: AuthChallengeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuthChallenges to fetch.
     */
    orderBy?: AuthChallengeOrderByWithRelationInput | AuthChallengeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AuthChallenges.
     */
    cursor?: AuthChallengeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuthChallenges from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuthChallenges.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AuthChallenges.
     */
    distinct?: AuthChallengeScalarFieldEnum | AuthChallengeScalarFieldEnum[]
  }

  /**
   * AuthChallenge findMany
   */
  export type AuthChallengeFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuthChallenge
     */
    select?: AuthChallengeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuthChallenge
     */
    omit?: AuthChallengeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthChallengeInclude<ExtArgs> | null
    /**
     * Filter, which AuthChallenges to fetch.
     */
    where?: AuthChallengeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuthChallenges to fetch.
     */
    orderBy?: AuthChallengeOrderByWithRelationInput | AuthChallengeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AuthChallenges.
     */
    cursor?: AuthChallengeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuthChallenges from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuthChallenges.
     */
    skip?: number
    distinct?: AuthChallengeScalarFieldEnum | AuthChallengeScalarFieldEnum[]
  }

  /**
   * AuthChallenge create
   */
  export type AuthChallengeCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuthChallenge
     */
    select?: AuthChallengeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuthChallenge
     */
    omit?: AuthChallengeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthChallengeInclude<ExtArgs> | null
    /**
     * The data needed to create a AuthChallenge.
     */
    data: XOR<AuthChallengeCreateInput, AuthChallengeUncheckedCreateInput>
  }

  /**
   * AuthChallenge createMany
   */
  export type AuthChallengeCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AuthChallenges.
     */
    data: AuthChallengeCreateManyInput | AuthChallengeCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AuthChallenge createManyAndReturn
   */
  export type AuthChallengeCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuthChallenge
     */
    select?: AuthChallengeSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AuthChallenge
     */
    omit?: AuthChallengeOmit<ExtArgs> | null
    /**
     * The data used to create many AuthChallenges.
     */
    data: AuthChallengeCreateManyInput | AuthChallengeCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthChallengeIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * AuthChallenge update
   */
  export type AuthChallengeUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuthChallenge
     */
    select?: AuthChallengeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuthChallenge
     */
    omit?: AuthChallengeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthChallengeInclude<ExtArgs> | null
    /**
     * The data needed to update a AuthChallenge.
     */
    data: XOR<AuthChallengeUpdateInput, AuthChallengeUncheckedUpdateInput>
    /**
     * Choose, which AuthChallenge to update.
     */
    where: AuthChallengeWhereUniqueInput
  }

  /**
   * AuthChallenge updateMany
   */
  export type AuthChallengeUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AuthChallenges.
     */
    data: XOR<AuthChallengeUpdateManyMutationInput, AuthChallengeUncheckedUpdateManyInput>
    /**
     * Filter which AuthChallenges to update
     */
    where?: AuthChallengeWhereInput
    /**
     * Limit how many AuthChallenges to update.
     */
    limit?: number
  }

  /**
   * AuthChallenge updateManyAndReturn
   */
  export type AuthChallengeUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuthChallenge
     */
    select?: AuthChallengeSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AuthChallenge
     */
    omit?: AuthChallengeOmit<ExtArgs> | null
    /**
     * The data used to update AuthChallenges.
     */
    data: XOR<AuthChallengeUpdateManyMutationInput, AuthChallengeUncheckedUpdateManyInput>
    /**
     * Filter which AuthChallenges to update
     */
    where?: AuthChallengeWhereInput
    /**
     * Limit how many AuthChallenges to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthChallengeIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * AuthChallenge upsert
   */
  export type AuthChallengeUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuthChallenge
     */
    select?: AuthChallengeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuthChallenge
     */
    omit?: AuthChallengeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthChallengeInclude<ExtArgs> | null
    /**
     * The filter to search for the AuthChallenge to update in case it exists.
     */
    where: AuthChallengeWhereUniqueInput
    /**
     * In case the AuthChallenge found by the `where` argument doesn't exist, create a new AuthChallenge with this data.
     */
    create: XOR<AuthChallengeCreateInput, AuthChallengeUncheckedCreateInput>
    /**
     * In case the AuthChallenge was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AuthChallengeUpdateInput, AuthChallengeUncheckedUpdateInput>
  }

  /**
   * AuthChallenge delete
   */
  export type AuthChallengeDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuthChallenge
     */
    select?: AuthChallengeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuthChallenge
     */
    omit?: AuthChallengeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthChallengeInclude<ExtArgs> | null
    /**
     * Filter which AuthChallenge to delete.
     */
    where: AuthChallengeWhereUniqueInput
  }

  /**
   * AuthChallenge deleteMany
   */
  export type AuthChallengeDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AuthChallenges to delete
     */
    where?: AuthChallengeWhereInput
    /**
     * Limit how many AuthChallenges to delete.
     */
    limit?: number
  }

  /**
   * AuthChallenge.authAccount
   */
  export type AuthChallenge$authAccountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuthAccount
     */
    select?: AuthAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuthAccount
     */
    omit?: AuthAccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthAccountInclude<ExtArgs> | null
    where?: AuthAccountWhereInput
  }

  /**
   * AuthChallenge without action
   */
  export type AuthChallengeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuthChallenge
     */
    select?: AuthChallengeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuthChallenge
     */
    omit?: AuthChallengeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthChallengeInclude<ExtArgs> | null
  }


  /**
   * Model AuditLog
   */

  export type AggregateAuditLog = {
    _count: AuditLogCountAggregateOutputType | null
    _min: AuditLogMinAggregateOutputType | null
    _max: AuditLogMaxAggregateOutputType | null
  }

  export type AuditLogMinAggregateOutputType = {
    id: string | null
    action: $Enums.AuditAction | null
    actorId: string | null
    actorEmail: string | null
    targetId: string | null
    targetEmail: string | null
    ipAddress: string | null
    userAgent: string | null
    createdAt: Date | null
  }

  export type AuditLogMaxAggregateOutputType = {
    id: string | null
    action: $Enums.AuditAction | null
    actorId: string | null
    actorEmail: string | null
    targetId: string | null
    targetEmail: string | null
    ipAddress: string | null
    userAgent: string | null
    createdAt: Date | null
  }

  export type AuditLogCountAggregateOutputType = {
    id: number
    action: number
    actorId: number
    actorEmail: number
    targetId: number
    targetEmail: number
    metadata: number
    ipAddress: number
    userAgent: number
    createdAt: number
    _all: number
  }


  export type AuditLogMinAggregateInputType = {
    id?: true
    action?: true
    actorId?: true
    actorEmail?: true
    targetId?: true
    targetEmail?: true
    ipAddress?: true
    userAgent?: true
    createdAt?: true
  }

  export type AuditLogMaxAggregateInputType = {
    id?: true
    action?: true
    actorId?: true
    actorEmail?: true
    targetId?: true
    targetEmail?: true
    ipAddress?: true
    userAgent?: true
    createdAt?: true
  }

  export type AuditLogCountAggregateInputType = {
    id?: true
    action?: true
    actorId?: true
    actorEmail?: true
    targetId?: true
    targetEmail?: true
    metadata?: true
    ipAddress?: true
    userAgent?: true
    createdAt?: true
    _all?: true
  }

  export type AuditLogAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AuditLog to aggregate.
     */
    where?: AuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuditLogs to fetch.
     */
    orderBy?: AuditLogOrderByWithRelationInput | AuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuditLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AuditLogs
    **/
    _count?: true | AuditLogCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AuditLogMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AuditLogMaxAggregateInputType
  }

  export type GetAuditLogAggregateType<T extends AuditLogAggregateArgs> = {
        [P in keyof T & keyof AggregateAuditLog]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAuditLog[P]>
      : GetScalarType<T[P], AggregateAuditLog[P]>
  }




  export type AuditLogGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AuditLogWhereInput
    orderBy?: AuditLogOrderByWithAggregationInput | AuditLogOrderByWithAggregationInput[]
    by: AuditLogScalarFieldEnum[] | AuditLogScalarFieldEnum
    having?: AuditLogScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AuditLogCountAggregateInputType | true
    _min?: AuditLogMinAggregateInputType
    _max?: AuditLogMaxAggregateInputType
  }

  export type AuditLogGroupByOutputType = {
    id: string
    action: $Enums.AuditAction
    actorId: string | null
    actorEmail: string | null
    targetId: string | null
    targetEmail: string | null
    metadata: JsonValue | null
    ipAddress: string | null
    userAgent: string | null
    createdAt: Date
    _count: AuditLogCountAggregateOutputType | null
    _min: AuditLogMinAggregateOutputType | null
    _max: AuditLogMaxAggregateOutputType | null
  }

  type GetAuditLogGroupByPayload<T extends AuditLogGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AuditLogGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AuditLogGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AuditLogGroupByOutputType[P]>
            : GetScalarType<T[P], AuditLogGroupByOutputType[P]>
        }
      >
    >


  export type AuditLogSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    action?: boolean
    actorId?: boolean
    actorEmail?: boolean
    targetId?: boolean
    targetEmail?: boolean
    metadata?: boolean
    ipAddress?: boolean
    userAgent?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["auditLog"]>

  export type AuditLogSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    action?: boolean
    actorId?: boolean
    actorEmail?: boolean
    targetId?: boolean
    targetEmail?: boolean
    metadata?: boolean
    ipAddress?: boolean
    userAgent?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["auditLog"]>

  export type AuditLogSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    action?: boolean
    actorId?: boolean
    actorEmail?: boolean
    targetId?: boolean
    targetEmail?: boolean
    metadata?: boolean
    ipAddress?: boolean
    userAgent?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["auditLog"]>

  export type AuditLogSelectScalar = {
    id?: boolean
    action?: boolean
    actorId?: boolean
    actorEmail?: boolean
    targetId?: boolean
    targetEmail?: boolean
    metadata?: boolean
    ipAddress?: boolean
    userAgent?: boolean
    createdAt?: boolean
  }

  export type AuditLogOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "action" | "actorId" | "actorEmail" | "targetId" | "targetEmail" | "metadata" | "ipAddress" | "userAgent" | "createdAt", ExtArgs["result"]["auditLog"]>

  export type $AuditLogPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AuditLog"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      action: $Enums.AuditAction
      actorId: string | null
      actorEmail: string | null
      targetId: string | null
      targetEmail: string | null
      metadata: Prisma.JsonValue | null
      ipAddress: string | null
      userAgent: string | null
      createdAt: Date
    }, ExtArgs["result"]["auditLog"]>
    composites: {}
  }

  type AuditLogGetPayload<S extends boolean | null | undefined | AuditLogDefaultArgs> = $Result.GetResult<Prisma.$AuditLogPayload, S>

  type AuditLogCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AuditLogFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AuditLogCountAggregateInputType | true
    }

  export interface AuditLogDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AuditLog'], meta: { name: 'AuditLog' } }
    /**
     * Find zero or one AuditLog that matches the filter.
     * @param {AuditLogFindUniqueArgs} args - Arguments to find a AuditLog
     * @example
     * // Get one AuditLog
     * const auditLog = await prisma.auditLog.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AuditLogFindUniqueArgs>(args: SelectSubset<T, AuditLogFindUniqueArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one AuditLog that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AuditLogFindUniqueOrThrowArgs} args - Arguments to find a AuditLog
     * @example
     * // Get one AuditLog
     * const auditLog = await prisma.auditLog.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AuditLogFindUniqueOrThrowArgs>(args: SelectSubset<T, AuditLogFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AuditLog that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogFindFirstArgs} args - Arguments to find a AuditLog
     * @example
     * // Get one AuditLog
     * const auditLog = await prisma.auditLog.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AuditLogFindFirstArgs>(args?: SelectSubset<T, AuditLogFindFirstArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AuditLog that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogFindFirstOrThrowArgs} args - Arguments to find a AuditLog
     * @example
     * // Get one AuditLog
     * const auditLog = await prisma.auditLog.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AuditLogFindFirstOrThrowArgs>(args?: SelectSubset<T, AuditLogFindFirstOrThrowArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more AuditLogs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AuditLogs
     * const auditLogs = await prisma.auditLog.findMany()
     * 
     * // Get first 10 AuditLogs
     * const auditLogs = await prisma.auditLog.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const auditLogWithIdOnly = await prisma.auditLog.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AuditLogFindManyArgs>(args?: SelectSubset<T, AuditLogFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a AuditLog.
     * @param {AuditLogCreateArgs} args - Arguments to create a AuditLog.
     * @example
     * // Create one AuditLog
     * const AuditLog = await prisma.auditLog.create({
     *   data: {
     *     // ... data to create a AuditLog
     *   }
     * })
     * 
     */
    create<T extends AuditLogCreateArgs>(args: SelectSubset<T, AuditLogCreateArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many AuditLogs.
     * @param {AuditLogCreateManyArgs} args - Arguments to create many AuditLogs.
     * @example
     * // Create many AuditLogs
     * const auditLog = await prisma.auditLog.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AuditLogCreateManyArgs>(args?: SelectSubset<T, AuditLogCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AuditLogs and returns the data saved in the database.
     * @param {AuditLogCreateManyAndReturnArgs} args - Arguments to create many AuditLogs.
     * @example
     * // Create many AuditLogs
     * const auditLog = await prisma.auditLog.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AuditLogs and only return the `id`
     * const auditLogWithIdOnly = await prisma.auditLog.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AuditLogCreateManyAndReturnArgs>(args?: SelectSubset<T, AuditLogCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a AuditLog.
     * @param {AuditLogDeleteArgs} args - Arguments to delete one AuditLog.
     * @example
     * // Delete one AuditLog
     * const AuditLog = await prisma.auditLog.delete({
     *   where: {
     *     // ... filter to delete one AuditLog
     *   }
     * })
     * 
     */
    delete<T extends AuditLogDeleteArgs>(args: SelectSubset<T, AuditLogDeleteArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one AuditLog.
     * @param {AuditLogUpdateArgs} args - Arguments to update one AuditLog.
     * @example
     * // Update one AuditLog
     * const auditLog = await prisma.auditLog.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AuditLogUpdateArgs>(args: SelectSubset<T, AuditLogUpdateArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more AuditLogs.
     * @param {AuditLogDeleteManyArgs} args - Arguments to filter AuditLogs to delete.
     * @example
     * // Delete a few AuditLogs
     * const { count } = await prisma.auditLog.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AuditLogDeleteManyArgs>(args?: SelectSubset<T, AuditLogDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AuditLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AuditLogs
     * const auditLog = await prisma.auditLog.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AuditLogUpdateManyArgs>(args: SelectSubset<T, AuditLogUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AuditLogs and returns the data updated in the database.
     * @param {AuditLogUpdateManyAndReturnArgs} args - Arguments to update many AuditLogs.
     * @example
     * // Update many AuditLogs
     * const auditLog = await prisma.auditLog.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more AuditLogs and only return the `id`
     * const auditLogWithIdOnly = await prisma.auditLog.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AuditLogUpdateManyAndReturnArgs>(args: SelectSubset<T, AuditLogUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one AuditLog.
     * @param {AuditLogUpsertArgs} args - Arguments to update or create a AuditLog.
     * @example
     * // Update or create a AuditLog
     * const auditLog = await prisma.auditLog.upsert({
     *   create: {
     *     // ... data to create a AuditLog
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AuditLog we want to update
     *   }
     * })
     */
    upsert<T extends AuditLogUpsertArgs>(args: SelectSubset<T, AuditLogUpsertArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of AuditLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogCountArgs} args - Arguments to filter AuditLogs to count.
     * @example
     * // Count the number of AuditLogs
     * const count = await prisma.auditLog.count({
     *   where: {
     *     // ... the filter for the AuditLogs we want to count
     *   }
     * })
    **/
    count<T extends AuditLogCountArgs>(
      args?: Subset<T, AuditLogCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AuditLogCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AuditLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AuditLogAggregateArgs>(args: Subset<T, AuditLogAggregateArgs>): Prisma.PrismaPromise<GetAuditLogAggregateType<T>>

    /**
     * Group by AuditLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AuditLogGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AuditLogGroupByArgs['orderBy'] }
        : { orderBy?: AuditLogGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AuditLogGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAuditLogGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AuditLog model
   */
  readonly fields: AuditLogFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AuditLog.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AuditLogClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the AuditLog model
   */
  interface AuditLogFieldRefs {
    readonly id: FieldRef<"AuditLog", 'String'>
    readonly action: FieldRef<"AuditLog", 'AuditAction'>
    readonly actorId: FieldRef<"AuditLog", 'String'>
    readonly actorEmail: FieldRef<"AuditLog", 'String'>
    readonly targetId: FieldRef<"AuditLog", 'String'>
    readonly targetEmail: FieldRef<"AuditLog", 'String'>
    readonly metadata: FieldRef<"AuditLog", 'Json'>
    readonly ipAddress: FieldRef<"AuditLog", 'String'>
    readonly userAgent: FieldRef<"AuditLog", 'String'>
    readonly createdAt: FieldRef<"AuditLog", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * AuditLog findUnique
   */
  export type AuditLogFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Filter, which AuditLog to fetch.
     */
    where: AuditLogWhereUniqueInput
  }

  /**
   * AuditLog findUniqueOrThrow
   */
  export type AuditLogFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Filter, which AuditLog to fetch.
     */
    where: AuditLogWhereUniqueInput
  }

  /**
   * AuditLog findFirst
   */
  export type AuditLogFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Filter, which AuditLog to fetch.
     */
    where?: AuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuditLogs to fetch.
     */
    orderBy?: AuditLogOrderByWithRelationInput | AuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AuditLogs.
     */
    cursor?: AuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuditLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AuditLogs.
     */
    distinct?: AuditLogScalarFieldEnum | AuditLogScalarFieldEnum[]
  }

  /**
   * AuditLog findFirstOrThrow
   */
  export type AuditLogFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Filter, which AuditLog to fetch.
     */
    where?: AuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuditLogs to fetch.
     */
    orderBy?: AuditLogOrderByWithRelationInput | AuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AuditLogs.
     */
    cursor?: AuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuditLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AuditLogs.
     */
    distinct?: AuditLogScalarFieldEnum | AuditLogScalarFieldEnum[]
  }

  /**
   * AuditLog findMany
   */
  export type AuditLogFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Filter, which AuditLogs to fetch.
     */
    where?: AuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuditLogs to fetch.
     */
    orderBy?: AuditLogOrderByWithRelationInput | AuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AuditLogs.
     */
    cursor?: AuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuditLogs.
     */
    skip?: number
    distinct?: AuditLogScalarFieldEnum | AuditLogScalarFieldEnum[]
  }

  /**
   * AuditLog create
   */
  export type AuditLogCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * The data needed to create a AuditLog.
     */
    data: XOR<AuditLogCreateInput, AuditLogUncheckedCreateInput>
  }

  /**
   * AuditLog createMany
   */
  export type AuditLogCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AuditLogs.
     */
    data: AuditLogCreateManyInput | AuditLogCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AuditLog createManyAndReturn
   */
  export type AuditLogCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * The data used to create many AuditLogs.
     */
    data: AuditLogCreateManyInput | AuditLogCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AuditLog update
   */
  export type AuditLogUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * The data needed to update a AuditLog.
     */
    data: XOR<AuditLogUpdateInput, AuditLogUncheckedUpdateInput>
    /**
     * Choose, which AuditLog to update.
     */
    where: AuditLogWhereUniqueInput
  }

  /**
   * AuditLog updateMany
   */
  export type AuditLogUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AuditLogs.
     */
    data: XOR<AuditLogUpdateManyMutationInput, AuditLogUncheckedUpdateManyInput>
    /**
     * Filter which AuditLogs to update
     */
    where?: AuditLogWhereInput
    /**
     * Limit how many AuditLogs to update.
     */
    limit?: number
  }

  /**
   * AuditLog updateManyAndReturn
   */
  export type AuditLogUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * The data used to update AuditLogs.
     */
    data: XOR<AuditLogUpdateManyMutationInput, AuditLogUncheckedUpdateManyInput>
    /**
     * Filter which AuditLogs to update
     */
    where?: AuditLogWhereInput
    /**
     * Limit how many AuditLogs to update.
     */
    limit?: number
  }

  /**
   * AuditLog upsert
   */
  export type AuditLogUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * The filter to search for the AuditLog to update in case it exists.
     */
    where: AuditLogWhereUniqueInput
    /**
     * In case the AuditLog found by the `where` argument doesn't exist, create a new AuditLog with this data.
     */
    create: XOR<AuditLogCreateInput, AuditLogUncheckedCreateInput>
    /**
     * In case the AuditLog was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AuditLogUpdateInput, AuditLogUncheckedUpdateInput>
  }

  /**
   * AuditLog delete
   */
  export type AuditLogDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Filter which AuditLog to delete.
     */
    where: AuditLogWhereUniqueInput
  }

  /**
   * AuditLog deleteMany
   */
  export type AuditLogDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AuditLogs to delete
     */
    where?: AuditLogWhereInput
    /**
     * Limit how many AuditLogs to delete.
     */
    limit?: number
  }

  /**
   * AuditLog without action
   */
  export type AuditLogDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const RoleScalarFieldEnum: {
    id: 'id',
    name: 'name',
    description: 'description',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type RoleScalarFieldEnum = (typeof RoleScalarFieldEnum)[keyof typeof RoleScalarFieldEnum]


  export const AuthAccountScalarFieldEnum: {
    id: 'id',
    email: 'email',
    normalizedEmail: 'normalizedEmail',
    passwordHash: 'passwordHash',
    forcePasswordChange: 'forcePasswordChange',
    roleId: 'roleId',
    provider: 'provider',
    status: 'status',
    isEmailVerified: 'isEmailVerified',
    lastLoginAt: 'lastLoginAt',
    passwordChangedAt: 'passwordChangedAt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type AuthAccountScalarFieldEnum = (typeof AuthAccountScalarFieldEnum)[keyof typeof AuthAccountScalarFieldEnum]


  export const AuthAccountRoleScalarFieldEnum: {
    id: 'id',
    authAccountId: 'authAccountId',
    roleId: 'roleId',
    assignedByAuthAccountId: 'assignedByAuthAccountId',
    assignedAt: 'assignedAt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type AuthAccountRoleScalarFieldEnum = (typeof AuthAccountRoleScalarFieldEnum)[keyof typeof AuthAccountRoleScalarFieldEnum]


  export const OAuthProviderAccountScalarFieldEnum: {
    id: 'id',
    authAccountId: 'authAccountId',
    provider: 'provider',
    providerUserId: 'providerUserId',
    providerEmail: 'providerEmail',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type OAuthProviderAccountScalarFieldEnum = (typeof OAuthProviderAccountScalarFieldEnum)[keyof typeof OAuthProviderAccountScalarFieldEnum]


  export const AuthSessionScalarFieldEnum: {
    id: 'id',
    authAccountId: 'authAccountId',
    refreshTokenHash: 'refreshTokenHash',
    userAgent: 'userAgent',
    ipAddress: 'ipAddress',
    expiresAt: 'expiresAt',
    status: 'status',
    revokedAt: 'revokedAt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type AuthSessionScalarFieldEnum = (typeof AuthSessionScalarFieldEnum)[keyof typeof AuthSessionScalarFieldEnum]


  export const AuthTokenScalarFieldEnum: {
    id: 'id',
    authAccountId: 'authAccountId',
    purpose: 'purpose',
    tokenHash: 'tokenHash',
    expiresAt: 'expiresAt',
    consumedAt: 'consumedAt',
    createdAt: 'createdAt'
  };

  export type AuthTokenScalarFieldEnum = (typeof AuthTokenScalarFieldEnum)[keyof typeof AuthTokenScalarFieldEnum]


  export const AuthChallengeScalarFieldEnum: {
    id: 'id',
    authAccountId: 'authAccountId',
    email: 'email',
    normalizedEmail: 'normalizedEmail',
    purpose: 'purpose',
    requestedRole: 'requestedRole',
    fullName: 'fullName',
    passwordHash: 'passwordHash',
    codeHash: 'codeHash',
    expiresAt: 'expiresAt',
    consumedAt: 'consumedAt',
    attemptCount: 'attemptCount',
    resendCount: 'resendCount',
    lastSentAt: 'lastSentAt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type AuthChallengeScalarFieldEnum = (typeof AuthChallengeScalarFieldEnum)[keyof typeof AuthChallengeScalarFieldEnum]


  export const AuditLogScalarFieldEnum: {
    id: 'id',
    action: 'action',
    actorId: 'actorId',
    actorEmail: 'actorEmail',
    targetId: 'targetId',
    targetEmail: 'targetEmail',
    metadata: 'metadata',
    ipAddress: 'ipAddress',
    userAgent: 'userAgent',
    createdAt: 'createdAt'
  };

  export type AuditLogScalarFieldEnum = (typeof AuditLogScalarFieldEnum)[keyof typeof AuditLogScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullableJsonNullValueInput: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull
  };

  export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'AuthProvider'
   */
  export type EnumAuthProviderFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'AuthProvider'>
    


  /**
   * Reference to a field of type 'AuthProvider[]'
   */
  export type ListEnumAuthProviderFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'AuthProvider[]'>
    


  /**
   * Reference to a field of type 'AuthStatus'
   */
  export type EnumAuthStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'AuthStatus'>
    


  /**
   * Reference to a field of type 'AuthStatus[]'
   */
  export type ListEnumAuthStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'AuthStatus[]'>
    


  /**
   * Reference to a field of type 'SessionStatus'
   */
  export type EnumSessionStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'SessionStatus'>
    


  /**
   * Reference to a field of type 'SessionStatus[]'
   */
  export type ListEnumSessionStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'SessionStatus[]'>
    


  /**
   * Reference to a field of type 'TokenPurpose'
   */
  export type EnumTokenPurposeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TokenPurpose'>
    


  /**
   * Reference to a field of type 'TokenPurpose[]'
   */
  export type ListEnumTokenPurposeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TokenPurpose[]'>
    


  /**
   * Reference to a field of type 'AuthChallengePurpose'
   */
  export type EnumAuthChallengePurposeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'AuthChallengePurpose'>
    


  /**
   * Reference to a field of type 'AuthChallengePurpose[]'
   */
  export type ListEnumAuthChallengePurposeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'AuthChallengePurpose[]'>
    


  /**
   * Reference to a field of type 'AuditAction'
   */
  export type EnumAuditActionFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'AuditAction'>
    


  /**
   * Reference to a field of type 'AuditAction[]'
   */
  export type ListEnumAuditActionFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'AuditAction[]'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'QueryMode'
   */
  export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type RoleWhereInput = {
    AND?: RoleWhereInput | RoleWhereInput[]
    OR?: RoleWhereInput[]
    NOT?: RoleWhereInput | RoleWhereInput[]
    id?: IntFilter<"Role"> | number
    name?: StringFilter<"Role"> | string
    description?: StringNullableFilter<"Role"> | string | null
    createdAt?: DateTimeFilter<"Role"> | Date | string
    updatedAt?: DateTimeFilter<"Role"> | Date | string
    accounts?: AuthAccountListRelationFilter
    accountRoles?: AuthAccountRoleListRelationFilter
  }

  export type RoleOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    accounts?: AuthAccountOrderByRelationAggregateInput
    accountRoles?: AuthAccountRoleOrderByRelationAggregateInput
  }

  export type RoleWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    name?: string
    AND?: RoleWhereInput | RoleWhereInput[]
    OR?: RoleWhereInput[]
    NOT?: RoleWhereInput | RoleWhereInput[]
    description?: StringNullableFilter<"Role"> | string | null
    createdAt?: DateTimeFilter<"Role"> | Date | string
    updatedAt?: DateTimeFilter<"Role"> | Date | string
    accounts?: AuthAccountListRelationFilter
    accountRoles?: AuthAccountRoleListRelationFilter
  }, "id" | "name">

  export type RoleOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: RoleCountOrderByAggregateInput
    _avg?: RoleAvgOrderByAggregateInput
    _max?: RoleMaxOrderByAggregateInput
    _min?: RoleMinOrderByAggregateInput
    _sum?: RoleSumOrderByAggregateInput
  }

  export type RoleScalarWhereWithAggregatesInput = {
    AND?: RoleScalarWhereWithAggregatesInput | RoleScalarWhereWithAggregatesInput[]
    OR?: RoleScalarWhereWithAggregatesInput[]
    NOT?: RoleScalarWhereWithAggregatesInput | RoleScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Role"> | number
    name?: StringWithAggregatesFilter<"Role"> | string
    description?: StringNullableWithAggregatesFilter<"Role"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Role"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Role"> | Date | string
  }

  export type AuthAccountWhereInput = {
    AND?: AuthAccountWhereInput | AuthAccountWhereInput[]
    OR?: AuthAccountWhereInput[]
    NOT?: AuthAccountWhereInput | AuthAccountWhereInput[]
    id?: StringFilter<"AuthAccount"> | string
    email?: StringFilter<"AuthAccount"> | string
    normalizedEmail?: StringFilter<"AuthAccount"> | string
    passwordHash?: StringNullableFilter<"AuthAccount"> | string | null
    forcePasswordChange?: BoolFilter<"AuthAccount"> | boolean
    roleId?: IntFilter<"AuthAccount"> | number
    provider?: EnumAuthProviderFilter<"AuthAccount"> | $Enums.AuthProvider
    status?: EnumAuthStatusFilter<"AuthAccount"> | $Enums.AuthStatus
    isEmailVerified?: BoolFilter<"AuthAccount"> | boolean
    lastLoginAt?: DateTimeNullableFilter<"AuthAccount"> | Date | string | null
    passwordChangedAt?: DateTimeNullableFilter<"AuthAccount"> | Date | string | null
    createdAt?: DateTimeFilter<"AuthAccount"> | Date | string
    updatedAt?: DateTimeFilter<"AuthAccount"> | Date | string
    role?: XOR<RoleScalarRelationFilter, RoleWhereInput>
    oauthAccounts?: OAuthProviderAccountListRelationFilter
    sessions?: AuthSessionListRelationFilter
    tokens?: AuthTokenListRelationFilter
    accountRoles?: AuthAccountRoleListRelationFilter
    grantedRoles?: AuthAccountRoleListRelationFilter
    challenges?: AuthChallengeListRelationFilter
  }

  export type AuthAccountOrderByWithRelationInput = {
    id?: SortOrder
    email?: SortOrder
    normalizedEmail?: SortOrder
    passwordHash?: SortOrderInput | SortOrder
    forcePasswordChange?: SortOrder
    roleId?: SortOrder
    provider?: SortOrder
    status?: SortOrder
    isEmailVerified?: SortOrder
    lastLoginAt?: SortOrderInput | SortOrder
    passwordChangedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    role?: RoleOrderByWithRelationInput
    oauthAccounts?: OAuthProviderAccountOrderByRelationAggregateInput
    sessions?: AuthSessionOrderByRelationAggregateInput
    tokens?: AuthTokenOrderByRelationAggregateInput
    accountRoles?: AuthAccountRoleOrderByRelationAggregateInput
    grantedRoles?: AuthAccountRoleOrderByRelationAggregateInput
    challenges?: AuthChallengeOrderByRelationAggregateInput
  }

  export type AuthAccountWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    normalizedEmail?: string
    AND?: AuthAccountWhereInput | AuthAccountWhereInput[]
    OR?: AuthAccountWhereInput[]
    NOT?: AuthAccountWhereInput | AuthAccountWhereInput[]
    passwordHash?: StringNullableFilter<"AuthAccount"> | string | null
    forcePasswordChange?: BoolFilter<"AuthAccount"> | boolean
    roleId?: IntFilter<"AuthAccount"> | number
    provider?: EnumAuthProviderFilter<"AuthAccount"> | $Enums.AuthProvider
    status?: EnumAuthStatusFilter<"AuthAccount"> | $Enums.AuthStatus
    isEmailVerified?: BoolFilter<"AuthAccount"> | boolean
    lastLoginAt?: DateTimeNullableFilter<"AuthAccount"> | Date | string | null
    passwordChangedAt?: DateTimeNullableFilter<"AuthAccount"> | Date | string | null
    createdAt?: DateTimeFilter<"AuthAccount"> | Date | string
    updatedAt?: DateTimeFilter<"AuthAccount"> | Date | string
    role?: XOR<RoleScalarRelationFilter, RoleWhereInput>
    oauthAccounts?: OAuthProviderAccountListRelationFilter
    sessions?: AuthSessionListRelationFilter
    tokens?: AuthTokenListRelationFilter
    accountRoles?: AuthAccountRoleListRelationFilter
    grantedRoles?: AuthAccountRoleListRelationFilter
    challenges?: AuthChallengeListRelationFilter
  }, "id" | "email" | "normalizedEmail">

  export type AuthAccountOrderByWithAggregationInput = {
    id?: SortOrder
    email?: SortOrder
    normalizedEmail?: SortOrder
    passwordHash?: SortOrderInput | SortOrder
    forcePasswordChange?: SortOrder
    roleId?: SortOrder
    provider?: SortOrder
    status?: SortOrder
    isEmailVerified?: SortOrder
    lastLoginAt?: SortOrderInput | SortOrder
    passwordChangedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: AuthAccountCountOrderByAggregateInput
    _avg?: AuthAccountAvgOrderByAggregateInput
    _max?: AuthAccountMaxOrderByAggregateInput
    _min?: AuthAccountMinOrderByAggregateInput
    _sum?: AuthAccountSumOrderByAggregateInput
  }

  export type AuthAccountScalarWhereWithAggregatesInput = {
    AND?: AuthAccountScalarWhereWithAggregatesInput | AuthAccountScalarWhereWithAggregatesInput[]
    OR?: AuthAccountScalarWhereWithAggregatesInput[]
    NOT?: AuthAccountScalarWhereWithAggregatesInput | AuthAccountScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"AuthAccount"> | string
    email?: StringWithAggregatesFilter<"AuthAccount"> | string
    normalizedEmail?: StringWithAggregatesFilter<"AuthAccount"> | string
    passwordHash?: StringNullableWithAggregatesFilter<"AuthAccount"> | string | null
    forcePasswordChange?: BoolWithAggregatesFilter<"AuthAccount"> | boolean
    roleId?: IntWithAggregatesFilter<"AuthAccount"> | number
    provider?: EnumAuthProviderWithAggregatesFilter<"AuthAccount"> | $Enums.AuthProvider
    status?: EnumAuthStatusWithAggregatesFilter<"AuthAccount"> | $Enums.AuthStatus
    isEmailVerified?: BoolWithAggregatesFilter<"AuthAccount"> | boolean
    lastLoginAt?: DateTimeNullableWithAggregatesFilter<"AuthAccount"> | Date | string | null
    passwordChangedAt?: DateTimeNullableWithAggregatesFilter<"AuthAccount"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"AuthAccount"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"AuthAccount"> | Date | string
  }

  export type AuthAccountRoleWhereInput = {
    AND?: AuthAccountRoleWhereInput | AuthAccountRoleWhereInput[]
    OR?: AuthAccountRoleWhereInput[]
    NOT?: AuthAccountRoleWhereInput | AuthAccountRoleWhereInput[]
    id?: StringFilter<"AuthAccountRole"> | string
    authAccountId?: StringFilter<"AuthAccountRole"> | string
    roleId?: IntFilter<"AuthAccountRole"> | number
    assignedByAuthAccountId?: StringNullableFilter<"AuthAccountRole"> | string | null
    assignedAt?: DateTimeFilter<"AuthAccountRole"> | Date | string
    createdAt?: DateTimeFilter<"AuthAccountRole"> | Date | string
    updatedAt?: DateTimeFilter<"AuthAccountRole"> | Date | string
    authAccount?: XOR<AuthAccountScalarRelationFilter, AuthAccountWhereInput>
    role?: XOR<RoleScalarRelationFilter, RoleWhereInput>
    assignedByAuthAccount?: XOR<AuthAccountNullableScalarRelationFilter, AuthAccountWhereInput> | null
  }

  export type AuthAccountRoleOrderByWithRelationInput = {
    id?: SortOrder
    authAccountId?: SortOrder
    roleId?: SortOrder
    assignedByAuthAccountId?: SortOrderInput | SortOrder
    assignedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    authAccount?: AuthAccountOrderByWithRelationInput
    role?: RoleOrderByWithRelationInput
    assignedByAuthAccount?: AuthAccountOrderByWithRelationInput
  }

  export type AuthAccountRoleWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    authAccountId_roleId?: AuthAccountRoleAuthAccountIdRoleIdCompoundUniqueInput
    AND?: AuthAccountRoleWhereInput | AuthAccountRoleWhereInput[]
    OR?: AuthAccountRoleWhereInput[]
    NOT?: AuthAccountRoleWhereInput | AuthAccountRoleWhereInput[]
    authAccountId?: StringFilter<"AuthAccountRole"> | string
    roleId?: IntFilter<"AuthAccountRole"> | number
    assignedByAuthAccountId?: StringNullableFilter<"AuthAccountRole"> | string | null
    assignedAt?: DateTimeFilter<"AuthAccountRole"> | Date | string
    createdAt?: DateTimeFilter<"AuthAccountRole"> | Date | string
    updatedAt?: DateTimeFilter<"AuthAccountRole"> | Date | string
    authAccount?: XOR<AuthAccountScalarRelationFilter, AuthAccountWhereInput>
    role?: XOR<RoleScalarRelationFilter, RoleWhereInput>
    assignedByAuthAccount?: XOR<AuthAccountNullableScalarRelationFilter, AuthAccountWhereInput> | null
  }, "id" | "authAccountId_roleId">

  export type AuthAccountRoleOrderByWithAggregationInput = {
    id?: SortOrder
    authAccountId?: SortOrder
    roleId?: SortOrder
    assignedByAuthAccountId?: SortOrderInput | SortOrder
    assignedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: AuthAccountRoleCountOrderByAggregateInput
    _avg?: AuthAccountRoleAvgOrderByAggregateInput
    _max?: AuthAccountRoleMaxOrderByAggregateInput
    _min?: AuthAccountRoleMinOrderByAggregateInput
    _sum?: AuthAccountRoleSumOrderByAggregateInput
  }

  export type AuthAccountRoleScalarWhereWithAggregatesInput = {
    AND?: AuthAccountRoleScalarWhereWithAggregatesInput | AuthAccountRoleScalarWhereWithAggregatesInput[]
    OR?: AuthAccountRoleScalarWhereWithAggregatesInput[]
    NOT?: AuthAccountRoleScalarWhereWithAggregatesInput | AuthAccountRoleScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"AuthAccountRole"> | string
    authAccountId?: StringWithAggregatesFilter<"AuthAccountRole"> | string
    roleId?: IntWithAggregatesFilter<"AuthAccountRole"> | number
    assignedByAuthAccountId?: StringNullableWithAggregatesFilter<"AuthAccountRole"> | string | null
    assignedAt?: DateTimeWithAggregatesFilter<"AuthAccountRole"> | Date | string
    createdAt?: DateTimeWithAggregatesFilter<"AuthAccountRole"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"AuthAccountRole"> | Date | string
  }

  export type OAuthProviderAccountWhereInput = {
    AND?: OAuthProviderAccountWhereInput | OAuthProviderAccountWhereInput[]
    OR?: OAuthProviderAccountWhereInput[]
    NOT?: OAuthProviderAccountWhereInput | OAuthProviderAccountWhereInput[]
    id?: StringFilter<"OAuthProviderAccount"> | string
    authAccountId?: StringFilter<"OAuthProviderAccount"> | string
    provider?: EnumAuthProviderFilter<"OAuthProviderAccount"> | $Enums.AuthProvider
    providerUserId?: StringFilter<"OAuthProviderAccount"> | string
    providerEmail?: StringNullableFilter<"OAuthProviderAccount"> | string | null
    createdAt?: DateTimeFilter<"OAuthProviderAccount"> | Date | string
    updatedAt?: DateTimeFilter<"OAuthProviderAccount"> | Date | string
    authAccount?: XOR<AuthAccountScalarRelationFilter, AuthAccountWhereInput>
  }

  export type OAuthProviderAccountOrderByWithRelationInput = {
    id?: SortOrder
    authAccountId?: SortOrder
    provider?: SortOrder
    providerUserId?: SortOrder
    providerEmail?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    authAccount?: AuthAccountOrderByWithRelationInput
  }

  export type OAuthProviderAccountWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    provider_providerUserId?: OAuthProviderAccountProviderProviderUserIdCompoundUniqueInput
    AND?: OAuthProviderAccountWhereInput | OAuthProviderAccountWhereInput[]
    OR?: OAuthProviderAccountWhereInput[]
    NOT?: OAuthProviderAccountWhereInput | OAuthProviderAccountWhereInput[]
    authAccountId?: StringFilter<"OAuthProviderAccount"> | string
    provider?: EnumAuthProviderFilter<"OAuthProviderAccount"> | $Enums.AuthProvider
    providerUserId?: StringFilter<"OAuthProviderAccount"> | string
    providerEmail?: StringNullableFilter<"OAuthProviderAccount"> | string | null
    createdAt?: DateTimeFilter<"OAuthProviderAccount"> | Date | string
    updatedAt?: DateTimeFilter<"OAuthProviderAccount"> | Date | string
    authAccount?: XOR<AuthAccountScalarRelationFilter, AuthAccountWhereInput>
  }, "id" | "provider_providerUserId">

  export type OAuthProviderAccountOrderByWithAggregationInput = {
    id?: SortOrder
    authAccountId?: SortOrder
    provider?: SortOrder
    providerUserId?: SortOrder
    providerEmail?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: OAuthProviderAccountCountOrderByAggregateInput
    _max?: OAuthProviderAccountMaxOrderByAggregateInput
    _min?: OAuthProviderAccountMinOrderByAggregateInput
  }

  export type OAuthProviderAccountScalarWhereWithAggregatesInput = {
    AND?: OAuthProviderAccountScalarWhereWithAggregatesInput | OAuthProviderAccountScalarWhereWithAggregatesInput[]
    OR?: OAuthProviderAccountScalarWhereWithAggregatesInput[]
    NOT?: OAuthProviderAccountScalarWhereWithAggregatesInput | OAuthProviderAccountScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"OAuthProviderAccount"> | string
    authAccountId?: StringWithAggregatesFilter<"OAuthProviderAccount"> | string
    provider?: EnumAuthProviderWithAggregatesFilter<"OAuthProviderAccount"> | $Enums.AuthProvider
    providerUserId?: StringWithAggregatesFilter<"OAuthProviderAccount"> | string
    providerEmail?: StringNullableWithAggregatesFilter<"OAuthProviderAccount"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"OAuthProviderAccount"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"OAuthProviderAccount"> | Date | string
  }

  export type AuthSessionWhereInput = {
    AND?: AuthSessionWhereInput | AuthSessionWhereInput[]
    OR?: AuthSessionWhereInput[]
    NOT?: AuthSessionWhereInput | AuthSessionWhereInput[]
    id?: StringFilter<"AuthSession"> | string
    authAccountId?: StringFilter<"AuthSession"> | string
    refreshTokenHash?: StringFilter<"AuthSession"> | string
    userAgent?: StringNullableFilter<"AuthSession"> | string | null
    ipAddress?: StringNullableFilter<"AuthSession"> | string | null
    expiresAt?: DateTimeFilter<"AuthSession"> | Date | string
    status?: EnumSessionStatusFilter<"AuthSession"> | $Enums.SessionStatus
    revokedAt?: DateTimeNullableFilter<"AuthSession"> | Date | string | null
    createdAt?: DateTimeFilter<"AuthSession"> | Date | string
    updatedAt?: DateTimeFilter<"AuthSession"> | Date | string
    authAccount?: XOR<AuthAccountScalarRelationFilter, AuthAccountWhereInput>
  }

  export type AuthSessionOrderByWithRelationInput = {
    id?: SortOrder
    authAccountId?: SortOrder
    refreshTokenHash?: SortOrder
    userAgent?: SortOrderInput | SortOrder
    ipAddress?: SortOrderInput | SortOrder
    expiresAt?: SortOrder
    status?: SortOrder
    revokedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    authAccount?: AuthAccountOrderByWithRelationInput
  }

  export type AuthSessionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    refreshTokenHash?: string
    AND?: AuthSessionWhereInput | AuthSessionWhereInput[]
    OR?: AuthSessionWhereInput[]
    NOT?: AuthSessionWhereInput | AuthSessionWhereInput[]
    authAccountId?: StringFilter<"AuthSession"> | string
    userAgent?: StringNullableFilter<"AuthSession"> | string | null
    ipAddress?: StringNullableFilter<"AuthSession"> | string | null
    expiresAt?: DateTimeFilter<"AuthSession"> | Date | string
    status?: EnumSessionStatusFilter<"AuthSession"> | $Enums.SessionStatus
    revokedAt?: DateTimeNullableFilter<"AuthSession"> | Date | string | null
    createdAt?: DateTimeFilter<"AuthSession"> | Date | string
    updatedAt?: DateTimeFilter<"AuthSession"> | Date | string
    authAccount?: XOR<AuthAccountScalarRelationFilter, AuthAccountWhereInput>
  }, "id" | "refreshTokenHash">

  export type AuthSessionOrderByWithAggregationInput = {
    id?: SortOrder
    authAccountId?: SortOrder
    refreshTokenHash?: SortOrder
    userAgent?: SortOrderInput | SortOrder
    ipAddress?: SortOrderInput | SortOrder
    expiresAt?: SortOrder
    status?: SortOrder
    revokedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: AuthSessionCountOrderByAggregateInput
    _max?: AuthSessionMaxOrderByAggregateInput
    _min?: AuthSessionMinOrderByAggregateInput
  }

  export type AuthSessionScalarWhereWithAggregatesInput = {
    AND?: AuthSessionScalarWhereWithAggregatesInput | AuthSessionScalarWhereWithAggregatesInput[]
    OR?: AuthSessionScalarWhereWithAggregatesInput[]
    NOT?: AuthSessionScalarWhereWithAggregatesInput | AuthSessionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"AuthSession"> | string
    authAccountId?: StringWithAggregatesFilter<"AuthSession"> | string
    refreshTokenHash?: StringWithAggregatesFilter<"AuthSession"> | string
    userAgent?: StringNullableWithAggregatesFilter<"AuthSession"> | string | null
    ipAddress?: StringNullableWithAggregatesFilter<"AuthSession"> | string | null
    expiresAt?: DateTimeWithAggregatesFilter<"AuthSession"> | Date | string
    status?: EnumSessionStatusWithAggregatesFilter<"AuthSession"> | $Enums.SessionStatus
    revokedAt?: DateTimeNullableWithAggregatesFilter<"AuthSession"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"AuthSession"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"AuthSession"> | Date | string
  }

  export type AuthTokenWhereInput = {
    AND?: AuthTokenWhereInput | AuthTokenWhereInput[]
    OR?: AuthTokenWhereInput[]
    NOT?: AuthTokenWhereInput | AuthTokenWhereInput[]
    id?: StringFilter<"AuthToken"> | string
    authAccountId?: StringFilter<"AuthToken"> | string
    purpose?: EnumTokenPurposeFilter<"AuthToken"> | $Enums.TokenPurpose
    tokenHash?: StringFilter<"AuthToken"> | string
    expiresAt?: DateTimeFilter<"AuthToken"> | Date | string
    consumedAt?: DateTimeNullableFilter<"AuthToken"> | Date | string | null
    createdAt?: DateTimeFilter<"AuthToken"> | Date | string
    authAccount?: XOR<AuthAccountScalarRelationFilter, AuthAccountWhereInput>
  }

  export type AuthTokenOrderByWithRelationInput = {
    id?: SortOrder
    authAccountId?: SortOrder
    purpose?: SortOrder
    tokenHash?: SortOrder
    expiresAt?: SortOrder
    consumedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    authAccount?: AuthAccountOrderByWithRelationInput
  }

  export type AuthTokenWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    tokenHash?: string
    AND?: AuthTokenWhereInput | AuthTokenWhereInput[]
    OR?: AuthTokenWhereInput[]
    NOT?: AuthTokenWhereInput | AuthTokenWhereInput[]
    authAccountId?: StringFilter<"AuthToken"> | string
    purpose?: EnumTokenPurposeFilter<"AuthToken"> | $Enums.TokenPurpose
    expiresAt?: DateTimeFilter<"AuthToken"> | Date | string
    consumedAt?: DateTimeNullableFilter<"AuthToken"> | Date | string | null
    createdAt?: DateTimeFilter<"AuthToken"> | Date | string
    authAccount?: XOR<AuthAccountScalarRelationFilter, AuthAccountWhereInput>
  }, "id" | "tokenHash">

  export type AuthTokenOrderByWithAggregationInput = {
    id?: SortOrder
    authAccountId?: SortOrder
    purpose?: SortOrder
    tokenHash?: SortOrder
    expiresAt?: SortOrder
    consumedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: AuthTokenCountOrderByAggregateInput
    _max?: AuthTokenMaxOrderByAggregateInput
    _min?: AuthTokenMinOrderByAggregateInput
  }

  export type AuthTokenScalarWhereWithAggregatesInput = {
    AND?: AuthTokenScalarWhereWithAggregatesInput | AuthTokenScalarWhereWithAggregatesInput[]
    OR?: AuthTokenScalarWhereWithAggregatesInput[]
    NOT?: AuthTokenScalarWhereWithAggregatesInput | AuthTokenScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"AuthToken"> | string
    authAccountId?: StringWithAggregatesFilter<"AuthToken"> | string
    purpose?: EnumTokenPurposeWithAggregatesFilter<"AuthToken"> | $Enums.TokenPurpose
    tokenHash?: StringWithAggregatesFilter<"AuthToken"> | string
    expiresAt?: DateTimeWithAggregatesFilter<"AuthToken"> | Date | string
    consumedAt?: DateTimeNullableWithAggregatesFilter<"AuthToken"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"AuthToken"> | Date | string
  }

  export type AuthChallengeWhereInput = {
    AND?: AuthChallengeWhereInput | AuthChallengeWhereInput[]
    OR?: AuthChallengeWhereInput[]
    NOT?: AuthChallengeWhereInput | AuthChallengeWhereInput[]
    id?: StringFilter<"AuthChallenge"> | string
    authAccountId?: StringNullableFilter<"AuthChallenge"> | string | null
    email?: StringFilter<"AuthChallenge"> | string
    normalizedEmail?: StringFilter<"AuthChallenge"> | string
    purpose?: EnumAuthChallengePurposeFilter<"AuthChallenge"> | $Enums.AuthChallengePurpose
    requestedRole?: StringNullableFilter<"AuthChallenge"> | string | null
    fullName?: StringNullableFilter<"AuthChallenge"> | string | null
    passwordHash?: StringNullableFilter<"AuthChallenge"> | string | null
    codeHash?: StringFilter<"AuthChallenge"> | string
    expiresAt?: DateTimeFilter<"AuthChallenge"> | Date | string
    consumedAt?: DateTimeNullableFilter<"AuthChallenge"> | Date | string | null
    attemptCount?: IntFilter<"AuthChallenge"> | number
    resendCount?: IntFilter<"AuthChallenge"> | number
    lastSentAt?: DateTimeFilter<"AuthChallenge"> | Date | string
    createdAt?: DateTimeFilter<"AuthChallenge"> | Date | string
    updatedAt?: DateTimeFilter<"AuthChallenge"> | Date | string
    authAccount?: XOR<AuthAccountNullableScalarRelationFilter, AuthAccountWhereInput> | null
  }

  export type AuthChallengeOrderByWithRelationInput = {
    id?: SortOrder
    authAccountId?: SortOrderInput | SortOrder
    email?: SortOrder
    normalizedEmail?: SortOrder
    purpose?: SortOrder
    requestedRole?: SortOrderInput | SortOrder
    fullName?: SortOrderInput | SortOrder
    passwordHash?: SortOrderInput | SortOrder
    codeHash?: SortOrder
    expiresAt?: SortOrder
    consumedAt?: SortOrderInput | SortOrder
    attemptCount?: SortOrder
    resendCount?: SortOrder
    lastSentAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    authAccount?: AuthAccountOrderByWithRelationInput
  }

  export type AuthChallengeWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: AuthChallengeWhereInput | AuthChallengeWhereInput[]
    OR?: AuthChallengeWhereInput[]
    NOT?: AuthChallengeWhereInput | AuthChallengeWhereInput[]
    authAccountId?: StringNullableFilter<"AuthChallenge"> | string | null
    email?: StringFilter<"AuthChallenge"> | string
    normalizedEmail?: StringFilter<"AuthChallenge"> | string
    purpose?: EnumAuthChallengePurposeFilter<"AuthChallenge"> | $Enums.AuthChallengePurpose
    requestedRole?: StringNullableFilter<"AuthChallenge"> | string | null
    fullName?: StringNullableFilter<"AuthChallenge"> | string | null
    passwordHash?: StringNullableFilter<"AuthChallenge"> | string | null
    codeHash?: StringFilter<"AuthChallenge"> | string
    expiresAt?: DateTimeFilter<"AuthChallenge"> | Date | string
    consumedAt?: DateTimeNullableFilter<"AuthChallenge"> | Date | string | null
    attemptCount?: IntFilter<"AuthChallenge"> | number
    resendCount?: IntFilter<"AuthChallenge"> | number
    lastSentAt?: DateTimeFilter<"AuthChallenge"> | Date | string
    createdAt?: DateTimeFilter<"AuthChallenge"> | Date | string
    updatedAt?: DateTimeFilter<"AuthChallenge"> | Date | string
    authAccount?: XOR<AuthAccountNullableScalarRelationFilter, AuthAccountWhereInput> | null
  }, "id">

  export type AuthChallengeOrderByWithAggregationInput = {
    id?: SortOrder
    authAccountId?: SortOrderInput | SortOrder
    email?: SortOrder
    normalizedEmail?: SortOrder
    purpose?: SortOrder
    requestedRole?: SortOrderInput | SortOrder
    fullName?: SortOrderInput | SortOrder
    passwordHash?: SortOrderInput | SortOrder
    codeHash?: SortOrder
    expiresAt?: SortOrder
    consumedAt?: SortOrderInput | SortOrder
    attemptCount?: SortOrder
    resendCount?: SortOrder
    lastSentAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: AuthChallengeCountOrderByAggregateInput
    _avg?: AuthChallengeAvgOrderByAggregateInput
    _max?: AuthChallengeMaxOrderByAggregateInput
    _min?: AuthChallengeMinOrderByAggregateInput
    _sum?: AuthChallengeSumOrderByAggregateInput
  }

  export type AuthChallengeScalarWhereWithAggregatesInput = {
    AND?: AuthChallengeScalarWhereWithAggregatesInput | AuthChallengeScalarWhereWithAggregatesInput[]
    OR?: AuthChallengeScalarWhereWithAggregatesInput[]
    NOT?: AuthChallengeScalarWhereWithAggregatesInput | AuthChallengeScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"AuthChallenge"> | string
    authAccountId?: StringNullableWithAggregatesFilter<"AuthChallenge"> | string | null
    email?: StringWithAggregatesFilter<"AuthChallenge"> | string
    normalizedEmail?: StringWithAggregatesFilter<"AuthChallenge"> | string
    purpose?: EnumAuthChallengePurposeWithAggregatesFilter<"AuthChallenge"> | $Enums.AuthChallengePurpose
    requestedRole?: StringNullableWithAggregatesFilter<"AuthChallenge"> | string | null
    fullName?: StringNullableWithAggregatesFilter<"AuthChallenge"> | string | null
    passwordHash?: StringNullableWithAggregatesFilter<"AuthChallenge"> | string | null
    codeHash?: StringWithAggregatesFilter<"AuthChallenge"> | string
    expiresAt?: DateTimeWithAggregatesFilter<"AuthChallenge"> | Date | string
    consumedAt?: DateTimeNullableWithAggregatesFilter<"AuthChallenge"> | Date | string | null
    attemptCount?: IntWithAggregatesFilter<"AuthChallenge"> | number
    resendCount?: IntWithAggregatesFilter<"AuthChallenge"> | number
    lastSentAt?: DateTimeWithAggregatesFilter<"AuthChallenge"> | Date | string
    createdAt?: DateTimeWithAggregatesFilter<"AuthChallenge"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"AuthChallenge"> | Date | string
  }

  export type AuditLogWhereInput = {
    AND?: AuditLogWhereInput | AuditLogWhereInput[]
    OR?: AuditLogWhereInput[]
    NOT?: AuditLogWhereInput | AuditLogWhereInput[]
    id?: StringFilter<"AuditLog"> | string
    action?: EnumAuditActionFilter<"AuditLog"> | $Enums.AuditAction
    actorId?: StringNullableFilter<"AuditLog"> | string | null
    actorEmail?: StringNullableFilter<"AuditLog"> | string | null
    targetId?: StringNullableFilter<"AuditLog"> | string | null
    targetEmail?: StringNullableFilter<"AuditLog"> | string | null
    metadata?: JsonNullableFilter<"AuditLog">
    ipAddress?: StringNullableFilter<"AuditLog"> | string | null
    userAgent?: StringNullableFilter<"AuditLog"> | string | null
    createdAt?: DateTimeFilter<"AuditLog"> | Date | string
  }

  export type AuditLogOrderByWithRelationInput = {
    id?: SortOrder
    action?: SortOrder
    actorId?: SortOrderInput | SortOrder
    actorEmail?: SortOrderInput | SortOrder
    targetId?: SortOrderInput | SortOrder
    targetEmail?: SortOrderInput | SortOrder
    metadata?: SortOrderInput | SortOrder
    ipAddress?: SortOrderInput | SortOrder
    userAgent?: SortOrderInput | SortOrder
    createdAt?: SortOrder
  }

  export type AuditLogWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: AuditLogWhereInput | AuditLogWhereInput[]
    OR?: AuditLogWhereInput[]
    NOT?: AuditLogWhereInput | AuditLogWhereInput[]
    action?: EnumAuditActionFilter<"AuditLog"> | $Enums.AuditAction
    actorId?: StringNullableFilter<"AuditLog"> | string | null
    actorEmail?: StringNullableFilter<"AuditLog"> | string | null
    targetId?: StringNullableFilter<"AuditLog"> | string | null
    targetEmail?: StringNullableFilter<"AuditLog"> | string | null
    metadata?: JsonNullableFilter<"AuditLog">
    ipAddress?: StringNullableFilter<"AuditLog"> | string | null
    userAgent?: StringNullableFilter<"AuditLog"> | string | null
    createdAt?: DateTimeFilter<"AuditLog"> | Date | string
  }, "id">

  export type AuditLogOrderByWithAggregationInput = {
    id?: SortOrder
    action?: SortOrder
    actorId?: SortOrderInput | SortOrder
    actorEmail?: SortOrderInput | SortOrder
    targetId?: SortOrderInput | SortOrder
    targetEmail?: SortOrderInput | SortOrder
    metadata?: SortOrderInput | SortOrder
    ipAddress?: SortOrderInput | SortOrder
    userAgent?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: AuditLogCountOrderByAggregateInput
    _max?: AuditLogMaxOrderByAggregateInput
    _min?: AuditLogMinOrderByAggregateInput
  }

  export type AuditLogScalarWhereWithAggregatesInput = {
    AND?: AuditLogScalarWhereWithAggregatesInput | AuditLogScalarWhereWithAggregatesInput[]
    OR?: AuditLogScalarWhereWithAggregatesInput[]
    NOT?: AuditLogScalarWhereWithAggregatesInput | AuditLogScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"AuditLog"> | string
    action?: EnumAuditActionWithAggregatesFilter<"AuditLog"> | $Enums.AuditAction
    actorId?: StringNullableWithAggregatesFilter<"AuditLog"> | string | null
    actorEmail?: StringNullableWithAggregatesFilter<"AuditLog"> | string | null
    targetId?: StringNullableWithAggregatesFilter<"AuditLog"> | string | null
    targetEmail?: StringNullableWithAggregatesFilter<"AuditLog"> | string | null
    metadata?: JsonNullableWithAggregatesFilter<"AuditLog">
    ipAddress?: StringNullableWithAggregatesFilter<"AuditLog"> | string | null
    userAgent?: StringNullableWithAggregatesFilter<"AuditLog"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"AuditLog"> | Date | string
  }

  export type RoleCreateInput = {
    name: string
    description?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    accounts?: AuthAccountCreateNestedManyWithoutRoleInput
    accountRoles?: AuthAccountRoleCreateNestedManyWithoutRoleInput
  }

  export type RoleUncheckedCreateInput = {
    id?: number
    name: string
    description?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    accounts?: AuthAccountUncheckedCreateNestedManyWithoutRoleInput
    accountRoles?: AuthAccountRoleUncheckedCreateNestedManyWithoutRoleInput
  }

  export type RoleUpdateInput = {
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    accounts?: AuthAccountUpdateManyWithoutRoleNestedInput
    accountRoles?: AuthAccountRoleUpdateManyWithoutRoleNestedInput
  }

  export type RoleUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    accounts?: AuthAccountUncheckedUpdateManyWithoutRoleNestedInput
    accountRoles?: AuthAccountRoleUncheckedUpdateManyWithoutRoleNestedInput
  }

  export type RoleCreateManyInput = {
    id?: number
    name: string
    description?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type RoleUpdateManyMutationInput = {
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RoleUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuthAccountCreateInput = {
    id?: string
    email: string
    normalizedEmail: string
    passwordHash?: string | null
    forcePasswordChange?: boolean
    provider?: $Enums.AuthProvider
    status?: $Enums.AuthStatus
    isEmailVerified?: boolean
    lastLoginAt?: Date | string | null
    passwordChangedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    role: RoleCreateNestedOneWithoutAccountsInput
    oauthAccounts?: OAuthProviderAccountCreateNestedManyWithoutAuthAccountInput
    sessions?: AuthSessionCreateNestedManyWithoutAuthAccountInput
    tokens?: AuthTokenCreateNestedManyWithoutAuthAccountInput
    accountRoles?: AuthAccountRoleCreateNestedManyWithoutAuthAccountInput
    grantedRoles?: AuthAccountRoleCreateNestedManyWithoutAssignedByAuthAccountInput
    challenges?: AuthChallengeCreateNestedManyWithoutAuthAccountInput
  }

  export type AuthAccountUncheckedCreateInput = {
    id?: string
    email: string
    normalizedEmail: string
    passwordHash?: string | null
    forcePasswordChange?: boolean
    roleId: number
    provider?: $Enums.AuthProvider
    status?: $Enums.AuthStatus
    isEmailVerified?: boolean
    lastLoginAt?: Date | string | null
    passwordChangedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    oauthAccounts?: OAuthProviderAccountUncheckedCreateNestedManyWithoutAuthAccountInput
    sessions?: AuthSessionUncheckedCreateNestedManyWithoutAuthAccountInput
    tokens?: AuthTokenUncheckedCreateNestedManyWithoutAuthAccountInput
    accountRoles?: AuthAccountRoleUncheckedCreateNestedManyWithoutAuthAccountInput
    grantedRoles?: AuthAccountRoleUncheckedCreateNestedManyWithoutAssignedByAuthAccountInput
    challenges?: AuthChallengeUncheckedCreateNestedManyWithoutAuthAccountInput
  }

  export type AuthAccountUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    normalizedEmail?: StringFieldUpdateOperationsInput | string
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    forcePasswordChange?: BoolFieldUpdateOperationsInput | boolean
    provider?: EnumAuthProviderFieldUpdateOperationsInput | $Enums.AuthProvider
    status?: EnumAuthStatusFieldUpdateOperationsInput | $Enums.AuthStatus
    isEmailVerified?: BoolFieldUpdateOperationsInput | boolean
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    passwordChangedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    role?: RoleUpdateOneRequiredWithoutAccountsNestedInput
    oauthAccounts?: OAuthProviderAccountUpdateManyWithoutAuthAccountNestedInput
    sessions?: AuthSessionUpdateManyWithoutAuthAccountNestedInput
    tokens?: AuthTokenUpdateManyWithoutAuthAccountNestedInput
    accountRoles?: AuthAccountRoleUpdateManyWithoutAuthAccountNestedInput
    grantedRoles?: AuthAccountRoleUpdateManyWithoutAssignedByAuthAccountNestedInput
    challenges?: AuthChallengeUpdateManyWithoutAuthAccountNestedInput
  }

  export type AuthAccountUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    normalizedEmail?: StringFieldUpdateOperationsInput | string
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    forcePasswordChange?: BoolFieldUpdateOperationsInput | boolean
    roleId?: IntFieldUpdateOperationsInput | number
    provider?: EnumAuthProviderFieldUpdateOperationsInput | $Enums.AuthProvider
    status?: EnumAuthStatusFieldUpdateOperationsInput | $Enums.AuthStatus
    isEmailVerified?: BoolFieldUpdateOperationsInput | boolean
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    passwordChangedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    oauthAccounts?: OAuthProviderAccountUncheckedUpdateManyWithoutAuthAccountNestedInput
    sessions?: AuthSessionUncheckedUpdateManyWithoutAuthAccountNestedInput
    tokens?: AuthTokenUncheckedUpdateManyWithoutAuthAccountNestedInput
    accountRoles?: AuthAccountRoleUncheckedUpdateManyWithoutAuthAccountNestedInput
    grantedRoles?: AuthAccountRoleUncheckedUpdateManyWithoutAssignedByAuthAccountNestedInput
    challenges?: AuthChallengeUncheckedUpdateManyWithoutAuthAccountNestedInput
  }

  export type AuthAccountCreateManyInput = {
    id?: string
    email: string
    normalizedEmail: string
    passwordHash?: string | null
    forcePasswordChange?: boolean
    roleId: number
    provider?: $Enums.AuthProvider
    status?: $Enums.AuthStatus
    isEmailVerified?: boolean
    lastLoginAt?: Date | string | null
    passwordChangedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AuthAccountUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    normalizedEmail?: StringFieldUpdateOperationsInput | string
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    forcePasswordChange?: BoolFieldUpdateOperationsInput | boolean
    provider?: EnumAuthProviderFieldUpdateOperationsInput | $Enums.AuthProvider
    status?: EnumAuthStatusFieldUpdateOperationsInput | $Enums.AuthStatus
    isEmailVerified?: BoolFieldUpdateOperationsInput | boolean
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    passwordChangedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuthAccountUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    normalizedEmail?: StringFieldUpdateOperationsInput | string
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    forcePasswordChange?: BoolFieldUpdateOperationsInput | boolean
    roleId?: IntFieldUpdateOperationsInput | number
    provider?: EnumAuthProviderFieldUpdateOperationsInput | $Enums.AuthProvider
    status?: EnumAuthStatusFieldUpdateOperationsInput | $Enums.AuthStatus
    isEmailVerified?: BoolFieldUpdateOperationsInput | boolean
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    passwordChangedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuthAccountRoleCreateInput = {
    id?: string
    assignedAt?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
    authAccount: AuthAccountCreateNestedOneWithoutAccountRolesInput
    role: RoleCreateNestedOneWithoutAccountRolesInput
    assignedByAuthAccount?: AuthAccountCreateNestedOneWithoutGrantedRolesInput
  }

  export type AuthAccountRoleUncheckedCreateInput = {
    id?: string
    authAccountId: string
    roleId: number
    assignedByAuthAccountId?: string | null
    assignedAt?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AuthAccountRoleUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    assignedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    authAccount?: AuthAccountUpdateOneRequiredWithoutAccountRolesNestedInput
    role?: RoleUpdateOneRequiredWithoutAccountRolesNestedInput
    assignedByAuthAccount?: AuthAccountUpdateOneWithoutGrantedRolesNestedInput
  }

  export type AuthAccountRoleUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    authAccountId?: StringFieldUpdateOperationsInput | string
    roleId?: IntFieldUpdateOperationsInput | number
    assignedByAuthAccountId?: NullableStringFieldUpdateOperationsInput | string | null
    assignedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuthAccountRoleCreateManyInput = {
    id?: string
    authAccountId: string
    roleId: number
    assignedByAuthAccountId?: string | null
    assignedAt?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AuthAccountRoleUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    assignedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuthAccountRoleUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    authAccountId?: StringFieldUpdateOperationsInput | string
    roleId?: IntFieldUpdateOperationsInput | number
    assignedByAuthAccountId?: NullableStringFieldUpdateOperationsInput | string | null
    assignedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OAuthProviderAccountCreateInput = {
    id?: string
    provider: $Enums.AuthProvider
    providerUserId: string
    providerEmail?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    authAccount: AuthAccountCreateNestedOneWithoutOauthAccountsInput
  }

  export type OAuthProviderAccountUncheckedCreateInput = {
    id?: string
    authAccountId: string
    provider: $Enums.AuthProvider
    providerUserId: string
    providerEmail?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type OAuthProviderAccountUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    provider?: EnumAuthProviderFieldUpdateOperationsInput | $Enums.AuthProvider
    providerUserId?: StringFieldUpdateOperationsInput | string
    providerEmail?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    authAccount?: AuthAccountUpdateOneRequiredWithoutOauthAccountsNestedInput
  }

  export type OAuthProviderAccountUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    authAccountId?: StringFieldUpdateOperationsInput | string
    provider?: EnumAuthProviderFieldUpdateOperationsInput | $Enums.AuthProvider
    providerUserId?: StringFieldUpdateOperationsInput | string
    providerEmail?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OAuthProviderAccountCreateManyInput = {
    id?: string
    authAccountId: string
    provider: $Enums.AuthProvider
    providerUserId: string
    providerEmail?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type OAuthProviderAccountUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    provider?: EnumAuthProviderFieldUpdateOperationsInput | $Enums.AuthProvider
    providerUserId?: StringFieldUpdateOperationsInput | string
    providerEmail?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OAuthProviderAccountUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    authAccountId?: StringFieldUpdateOperationsInput | string
    provider?: EnumAuthProviderFieldUpdateOperationsInput | $Enums.AuthProvider
    providerUserId?: StringFieldUpdateOperationsInput | string
    providerEmail?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuthSessionCreateInput = {
    id?: string
    refreshTokenHash: string
    userAgent?: string | null
    ipAddress?: string | null
    expiresAt: Date | string
    status?: $Enums.SessionStatus
    revokedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    authAccount: AuthAccountCreateNestedOneWithoutSessionsInput
  }

  export type AuthSessionUncheckedCreateInput = {
    id?: string
    authAccountId: string
    refreshTokenHash: string
    userAgent?: string | null
    ipAddress?: string | null
    expiresAt: Date | string
    status?: $Enums.SessionStatus
    revokedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AuthSessionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    refreshTokenHash?: StringFieldUpdateOperationsInput | string
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumSessionStatusFieldUpdateOperationsInput | $Enums.SessionStatus
    revokedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    authAccount?: AuthAccountUpdateOneRequiredWithoutSessionsNestedInput
  }

  export type AuthSessionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    authAccountId?: StringFieldUpdateOperationsInput | string
    refreshTokenHash?: StringFieldUpdateOperationsInput | string
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumSessionStatusFieldUpdateOperationsInput | $Enums.SessionStatus
    revokedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuthSessionCreateManyInput = {
    id?: string
    authAccountId: string
    refreshTokenHash: string
    userAgent?: string | null
    ipAddress?: string | null
    expiresAt: Date | string
    status?: $Enums.SessionStatus
    revokedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AuthSessionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    refreshTokenHash?: StringFieldUpdateOperationsInput | string
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumSessionStatusFieldUpdateOperationsInput | $Enums.SessionStatus
    revokedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuthSessionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    authAccountId?: StringFieldUpdateOperationsInput | string
    refreshTokenHash?: StringFieldUpdateOperationsInput | string
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumSessionStatusFieldUpdateOperationsInput | $Enums.SessionStatus
    revokedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuthTokenCreateInput = {
    id?: string
    purpose: $Enums.TokenPurpose
    tokenHash: string
    expiresAt: Date | string
    consumedAt?: Date | string | null
    createdAt?: Date | string
    authAccount: AuthAccountCreateNestedOneWithoutTokensInput
  }

  export type AuthTokenUncheckedCreateInput = {
    id?: string
    authAccountId: string
    purpose: $Enums.TokenPurpose
    tokenHash: string
    expiresAt: Date | string
    consumedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type AuthTokenUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    purpose?: EnumTokenPurposeFieldUpdateOperationsInput | $Enums.TokenPurpose
    tokenHash?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    consumedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    authAccount?: AuthAccountUpdateOneRequiredWithoutTokensNestedInput
  }

  export type AuthTokenUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    authAccountId?: StringFieldUpdateOperationsInput | string
    purpose?: EnumTokenPurposeFieldUpdateOperationsInput | $Enums.TokenPurpose
    tokenHash?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    consumedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuthTokenCreateManyInput = {
    id?: string
    authAccountId: string
    purpose: $Enums.TokenPurpose
    tokenHash: string
    expiresAt: Date | string
    consumedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type AuthTokenUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    purpose?: EnumTokenPurposeFieldUpdateOperationsInput | $Enums.TokenPurpose
    tokenHash?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    consumedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuthTokenUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    authAccountId?: StringFieldUpdateOperationsInput | string
    purpose?: EnumTokenPurposeFieldUpdateOperationsInput | $Enums.TokenPurpose
    tokenHash?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    consumedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuthChallengeCreateInput = {
    id?: string
    email: string
    normalizedEmail: string
    purpose: $Enums.AuthChallengePurpose
    requestedRole?: string | null
    fullName?: string | null
    passwordHash?: string | null
    codeHash: string
    expiresAt: Date | string
    consumedAt?: Date | string | null
    attemptCount?: number
    resendCount?: number
    lastSentAt?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
    authAccount?: AuthAccountCreateNestedOneWithoutChallengesInput
  }

  export type AuthChallengeUncheckedCreateInput = {
    id?: string
    authAccountId?: string | null
    email: string
    normalizedEmail: string
    purpose: $Enums.AuthChallengePurpose
    requestedRole?: string | null
    fullName?: string | null
    passwordHash?: string | null
    codeHash: string
    expiresAt: Date | string
    consumedAt?: Date | string | null
    attemptCount?: number
    resendCount?: number
    lastSentAt?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AuthChallengeUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    normalizedEmail?: StringFieldUpdateOperationsInput | string
    purpose?: EnumAuthChallengePurposeFieldUpdateOperationsInput | $Enums.AuthChallengePurpose
    requestedRole?: NullableStringFieldUpdateOperationsInput | string | null
    fullName?: NullableStringFieldUpdateOperationsInput | string | null
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    codeHash?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    consumedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    attemptCount?: IntFieldUpdateOperationsInput | number
    resendCount?: IntFieldUpdateOperationsInput | number
    lastSentAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    authAccount?: AuthAccountUpdateOneWithoutChallengesNestedInput
  }

  export type AuthChallengeUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    authAccountId?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    normalizedEmail?: StringFieldUpdateOperationsInput | string
    purpose?: EnumAuthChallengePurposeFieldUpdateOperationsInput | $Enums.AuthChallengePurpose
    requestedRole?: NullableStringFieldUpdateOperationsInput | string | null
    fullName?: NullableStringFieldUpdateOperationsInput | string | null
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    codeHash?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    consumedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    attemptCount?: IntFieldUpdateOperationsInput | number
    resendCount?: IntFieldUpdateOperationsInput | number
    lastSentAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuthChallengeCreateManyInput = {
    id?: string
    authAccountId?: string | null
    email: string
    normalizedEmail: string
    purpose: $Enums.AuthChallengePurpose
    requestedRole?: string | null
    fullName?: string | null
    passwordHash?: string | null
    codeHash: string
    expiresAt: Date | string
    consumedAt?: Date | string | null
    attemptCount?: number
    resendCount?: number
    lastSentAt?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AuthChallengeUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    normalizedEmail?: StringFieldUpdateOperationsInput | string
    purpose?: EnumAuthChallengePurposeFieldUpdateOperationsInput | $Enums.AuthChallengePurpose
    requestedRole?: NullableStringFieldUpdateOperationsInput | string | null
    fullName?: NullableStringFieldUpdateOperationsInput | string | null
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    codeHash?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    consumedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    attemptCount?: IntFieldUpdateOperationsInput | number
    resendCount?: IntFieldUpdateOperationsInput | number
    lastSentAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuthChallengeUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    authAccountId?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    normalizedEmail?: StringFieldUpdateOperationsInput | string
    purpose?: EnumAuthChallengePurposeFieldUpdateOperationsInput | $Enums.AuthChallengePurpose
    requestedRole?: NullableStringFieldUpdateOperationsInput | string | null
    fullName?: NullableStringFieldUpdateOperationsInput | string | null
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    codeHash?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    consumedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    attemptCount?: IntFieldUpdateOperationsInput | number
    resendCount?: IntFieldUpdateOperationsInput | number
    lastSentAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuditLogCreateInput = {
    id?: string
    action: $Enums.AuditAction
    actorId?: string | null
    actorEmail?: string | null
    targetId?: string | null
    targetEmail?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    ipAddress?: string | null
    userAgent?: string | null
    createdAt?: Date | string
  }

  export type AuditLogUncheckedCreateInput = {
    id?: string
    action: $Enums.AuditAction
    actorId?: string | null
    actorEmail?: string | null
    targetId?: string | null
    targetEmail?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    ipAddress?: string | null
    userAgent?: string | null
    createdAt?: Date | string
  }

  export type AuditLogUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: EnumAuditActionFieldUpdateOperationsInput | $Enums.AuditAction
    actorId?: NullableStringFieldUpdateOperationsInput | string | null
    actorEmail?: NullableStringFieldUpdateOperationsInput | string | null
    targetId?: NullableStringFieldUpdateOperationsInput | string | null
    targetEmail?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuditLogUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: EnumAuditActionFieldUpdateOperationsInput | $Enums.AuditAction
    actorId?: NullableStringFieldUpdateOperationsInput | string | null
    actorEmail?: NullableStringFieldUpdateOperationsInput | string | null
    targetId?: NullableStringFieldUpdateOperationsInput | string | null
    targetEmail?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuditLogCreateManyInput = {
    id?: string
    action: $Enums.AuditAction
    actorId?: string | null
    actorEmail?: string | null
    targetId?: string | null
    targetEmail?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    ipAddress?: string | null
    userAgent?: string | null
    createdAt?: Date | string
  }

  export type AuditLogUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: EnumAuditActionFieldUpdateOperationsInput | $Enums.AuditAction
    actorId?: NullableStringFieldUpdateOperationsInput | string | null
    actorEmail?: NullableStringFieldUpdateOperationsInput | string | null
    targetId?: NullableStringFieldUpdateOperationsInput | string | null
    targetEmail?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuditLogUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: EnumAuditActionFieldUpdateOperationsInput | $Enums.AuditAction
    actorId?: NullableStringFieldUpdateOperationsInput | string | null
    actorEmail?: NullableStringFieldUpdateOperationsInput | string | null
    targetId?: NullableStringFieldUpdateOperationsInput | string | null
    targetEmail?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type AuthAccountListRelationFilter = {
    every?: AuthAccountWhereInput
    some?: AuthAccountWhereInput
    none?: AuthAccountWhereInput
  }

  export type AuthAccountRoleListRelationFilter = {
    every?: AuthAccountRoleWhereInput
    some?: AuthAccountRoleWhereInput
    none?: AuthAccountRoleWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type AuthAccountOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type AuthAccountRoleOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type RoleCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type RoleAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type RoleMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type RoleMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type RoleSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type EnumAuthProviderFilter<$PrismaModel = never> = {
    equals?: $Enums.AuthProvider | EnumAuthProviderFieldRefInput<$PrismaModel>
    in?: $Enums.AuthProvider[] | ListEnumAuthProviderFieldRefInput<$PrismaModel>
    notIn?: $Enums.AuthProvider[] | ListEnumAuthProviderFieldRefInput<$PrismaModel>
    not?: NestedEnumAuthProviderFilter<$PrismaModel> | $Enums.AuthProvider
  }

  export type EnumAuthStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.AuthStatus | EnumAuthStatusFieldRefInput<$PrismaModel>
    in?: $Enums.AuthStatus[] | ListEnumAuthStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.AuthStatus[] | ListEnumAuthStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumAuthStatusFilter<$PrismaModel> | $Enums.AuthStatus
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type RoleScalarRelationFilter = {
    is?: RoleWhereInput
    isNot?: RoleWhereInput
  }

  export type OAuthProviderAccountListRelationFilter = {
    every?: OAuthProviderAccountWhereInput
    some?: OAuthProviderAccountWhereInput
    none?: OAuthProviderAccountWhereInput
  }

  export type AuthSessionListRelationFilter = {
    every?: AuthSessionWhereInput
    some?: AuthSessionWhereInput
    none?: AuthSessionWhereInput
  }

  export type AuthTokenListRelationFilter = {
    every?: AuthTokenWhereInput
    some?: AuthTokenWhereInput
    none?: AuthTokenWhereInput
  }

  export type AuthChallengeListRelationFilter = {
    every?: AuthChallengeWhereInput
    some?: AuthChallengeWhereInput
    none?: AuthChallengeWhereInput
  }

  export type OAuthProviderAccountOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type AuthSessionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type AuthTokenOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type AuthChallengeOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type AuthAccountCountOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    normalizedEmail?: SortOrder
    passwordHash?: SortOrder
    forcePasswordChange?: SortOrder
    roleId?: SortOrder
    provider?: SortOrder
    status?: SortOrder
    isEmailVerified?: SortOrder
    lastLoginAt?: SortOrder
    passwordChangedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AuthAccountAvgOrderByAggregateInput = {
    roleId?: SortOrder
  }

  export type AuthAccountMaxOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    normalizedEmail?: SortOrder
    passwordHash?: SortOrder
    forcePasswordChange?: SortOrder
    roleId?: SortOrder
    provider?: SortOrder
    status?: SortOrder
    isEmailVerified?: SortOrder
    lastLoginAt?: SortOrder
    passwordChangedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AuthAccountMinOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    normalizedEmail?: SortOrder
    passwordHash?: SortOrder
    forcePasswordChange?: SortOrder
    roleId?: SortOrder
    provider?: SortOrder
    status?: SortOrder
    isEmailVerified?: SortOrder
    lastLoginAt?: SortOrder
    passwordChangedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AuthAccountSumOrderByAggregateInput = {
    roleId?: SortOrder
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type EnumAuthProviderWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AuthProvider | EnumAuthProviderFieldRefInput<$PrismaModel>
    in?: $Enums.AuthProvider[] | ListEnumAuthProviderFieldRefInput<$PrismaModel>
    notIn?: $Enums.AuthProvider[] | ListEnumAuthProviderFieldRefInput<$PrismaModel>
    not?: NestedEnumAuthProviderWithAggregatesFilter<$PrismaModel> | $Enums.AuthProvider
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumAuthProviderFilter<$PrismaModel>
    _max?: NestedEnumAuthProviderFilter<$PrismaModel>
  }

  export type EnumAuthStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AuthStatus | EnumAuthStatusFieldRefInput<$PrismaModel>
    in?: $Enums.AuthStatus[] | ListEnumAuthStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.AuthStatus[] | ListEnumAuthStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumAuthStatusWithAggregatesFilter<$PrismaModel> | $Enums.AuthStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumAuthStatusFilter<$PrismaModel>
    _max?: NestedEnumAuthStatusFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type AuthAccountScalarRelationFilter = {
    is?: AuthAccountWhereInput
    isNot?: AuthAccountWhereInput
  }

  export type AuthAccountNullableScalarRelationFilter = {
    is?: AuthAccountWhereInput | null
    isNot?: AuthAccountWhereInput | null
  }

  export type AuthAccountRoleAuthAccountIdRoleIdCompoundUniqueInput = {
    authAccountId: string
    roleId: number
  }

  export type AuthAccountRoleCountOrderByAggregateInput = {
    id?: SortOrder
    authAccountId?: SortOrder
    roleId?: SortOrder
    assignedByAuthAccountId?: SortOrder
    assignedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AuthAccountRoleAvgOrderByAggregateInput = {
    roleId?: SortOrder
  }

  export type AuthAccountRoleMaxOrderByAggregateInput = {
    id?: SortOrder
    authAccountId?: SortOrder
    roleId?: SortOrder
    assignedByAuthAccountId?: SortOrder
    assignedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AuthAccountRoleMinOrderByAggregateInput = {
    id?: SortOrder
    authAccountId?: SortOrder
    roleId?: SortOrder
    assignedByAuthAccountId?: SortOrder
    assignedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AuthAccountRoleSumOrderByAggregateInput = {
    roleId?: SortOrder
  }

  export type OAuthProviderAccountProviderProviderUserIdCompoundUniqueInput = {
    provider: $Enums.AuthProvider
    providerUserId: string
  }

  export type OAuthProviderAccountCountOrderByAggregateInput = {
    id?: SortOrder
    authAccountId?: SortOrder
    provider?: SortOrder
    providerUserId?: SortOrder
    providerEmail?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type OAuthProviderAccountMaxOrderByAggregateInput = {
    id?: SortOrder
    authAccountId?: SortOrder
    provider?: SortOrder
    providerUserId?: SortOrder
    providerEmail?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type OAuthProviderAccountMinOrderByAggregateInput = {
    id?: SortOrder
    authAccountId?: SortOrder
    provider?: SortOrder
    providerUserId?: SortOrder
    providerEmail?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EnumSessionStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.SessionStatus | EnumSessionStatusFieldRefInput<$PrismaModel>
    in?: $Enums.SessionStatus[] | ListEnumSessionStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.SessionStatus[] | ListEnumSessionStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumSessionStatusFilter<$PrismaModel> | $Enums.SessionStatus
  }

  export type AuthSessionCountOrderByAggregateInput = {
    id?: SortOrder
    authAccountId?: SortOrder
    refreshTokenHash?: SortOrder
    userAgent?: SortOrder
    ipAddress?: SortOrder
    expiresAt?: SortOrder
    status?: SortOrder
    revokedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AuthSessionMaxOrderByAggregateInput = {
    id?: SortOrder
    authAccountId?: SortOrder
    refreshTokenHash?: SortOrder
    userAgent?: SortOrder
    ipAddress?: SortOrder
    expiresAt?: SortOrder
    status?: SortOrder
    revokedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AuthSessionMinOrderByAggregateInput = {
    id?: SortOrder
    authAccountId?: SortOrder
    refreshTokenHash?: SortOrder
    userAgent?: SortOrder
    ipAddress?: SortOrder
    expiresAt?: SortOrder
    status?: SortOrder
    revokedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EnumSessionStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.SessionStatus | EnumSessionStatusFieldRefInput<$PrismaModel>
    in?: $Enums.SessionStatus[] | ListEnumSessionStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.SessionStatus[] | ListEnumSessionStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumSessionStatusWithAggregatesFilter<$PrismaModel> | $Enums.SessionStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumSessionStatusFilter<$PrismaModel>
    _max?: NestedEnumSessionStatusFilter<$PrismaModel>
  }

  export type EnumTokenPurposeFilter<$PrismaModel = never> = {
    equals?: $Enums.TokenPurpose | EnumTokenPurposeFieldRefInput<$PrismaModel>
    in?: $Enums.TokenPurpose[] | ListEnumTokenPurposeFieldRefInput<$PrismaModel>
    notIn?: $Enums.TokenPurpose[] | ListEnumTokenPurposeFieldRefInput<$PrismaModel>
    not?: NestedEnumTokenPurposeFilter<$PrismaModel> | $Enums.TokenPurpose
  }

  export type AuthTokenCountOrderByAggregateInput = {
    id?: SortOrder
    authAccountId?: SortOrder
    purpose?: SortOrder
    tokenHash?: SortOrder
    expiresAt?: SortOrder
    consumedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type AuthTokenMaxOrderByAggregateInput = {
    id?: SortOrder
    authAccountId?: SortOrder
    purpose?: SortOrder
    tokenHash?: SortOrder
    expiresAt?: SortOrder
    consumedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type AuthTokenMinOrderByAggregateInput = {
    id?: SortOrder
    authAccountId?: SortOrder
    purpose?: SortOrder
    tokenHash?: SortOrder
    expiresAt?: SortOrder
    consumedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type EnumTokenPurposeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TokenPurpose | EnumTokenPurposeFieldRefInput<$PrismaModel>
    in?: $Enums.TokenPurpose[] | ListEnumTokenPurposeFieldRefInput<$PrismaModel>
    notIn?: $Enums.TokenPurpose[] | ListEnumTokenPurposeFieldRefInput<$PrismaModel>
    not?: NestedEnumTokenPurposeWithAggregatesFilter<$PrismaModel> | $Enums.TokenPurpose
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTokenPurposeFilter<$PrismaModel>
    _max?: NestedEnumTokenPurposeFilter<$PrismaModel>
  }

  export type EnumAuthChallengePurposeFilter<$PrismaModel = never> = {
    equals?: $Enums.AuthChallengePurpose | EnumAuthChallengePurposeFieldRefInput<$PrismaModel>
    in?: $Enums.AuthChallengePurpose[] | ListEnumAuthChallengePurposeFieldRefInput<$PrismaModel>
    notIn?: $Enums.AuthChallengePurpose[] | ListEnumAuthChallengePurposeFieldRefInput<$PrismaModel>
    not?: NestedEnumAuthChallengePurposeFilter<$PrismaModel> | $Enums.AuthChallengePurpose
  }

  export type AuthChallengeCountOrderByAggregateInput = {
    id?: SortOrder
    authAccountId?: SortOrder
    email?: SortOrder
    normalizedEmail?: SortOrder
    purpose?: SortOrder
    requestedRole?: SortOrder
    fullName?: SortOrder
    passwordHash?: SortOrder
    codeHash?: SortOrder
    expiresAt?: SortOrder
    consumedAt?: SortOrder
    attemptCount?: SortOrder
    resendCount?: SortOrder
    lastSentAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AuthChallengeAvgOrderByAggregateInput = {
    attemptCount?: SortOrder
    resendCount?: SortOrder
  }

  export type AuthChallengeMaxOrderByAggregateInput = {
    id?: SortOrder
    authAccountId?: SortOrder
    email?: SortOrder
    normalizedEmail?: SortOrder
    purpose?: SortOrder
    requestedRole?: SortOrder
    fullName?: SortOrder
    passwordHash?: SortOrder
    codeHash?: SortOrder
    expiresAt?: SortOrder
    consumedAt?: SortOrder
    attemptCount?: SortOrder
    resendCount?: SortOrder
    lastSentAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AuthChallengeMinOrderByAggregateInput = {
    id?: SortOrder
    authAccountId?: SortOrder
    email?: SortOrder
    normalizedEmail?: SortOrder
    purpose?: SortOrder
    requestedRole?: SortOrder
    fullName?: SortOrder
    passwordHash?: SortOrder
    codeHash?: SortOrder
    expiresAt?: SortOrder
    consumedAt?: SortOrder
    attemptCount?: SortOrder
    resendCount?: SortOrder
    lastSentAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AuthChallengeSumOrderByAggregateInput = {
    attemptCount?: SortOrder
    resendCount?: SortOrder
  }

  export type EnumAuthChallengePurposeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AuthChallengePurpose | EnumAuthChallengePurposeFieldRefInput<$PrismaModel>
    in?: $Enums.AuthChallengePurpose[] | ListEnumAuthChallengePurposeFieldRefInput<$PrismaModel>
    notIn?: $Enums.AuthChallengePurpose[] | ListEnumAuthChallengePurposeFieldRefInput<$PrismaModel>
    not?: NestedEnumAuthChallengePurposeWithAggregatesFilter<$PrismaModel> | $Enums.AuthChallengePurpose
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumAuthChallengePurposeFilter<$PrismaModel>
    _max?: NestedEnumAuthChallengePurposeFilter<$PrismaModel>
  }

  export type EnumAuditActionFilter<$PrismaModel = never> = {
    equals?: $Enums.AuditAction | EnumAuditActionFieldRefInput<$PrismaModel>
    in?: $Enums.AuditAction[] | ListEnumAuditActionFieldRefInput<$PrismaModel>
    notIn?: $Enums.AuditAction[] | ListEnumAuditActionFieldRefInput<$PrismaModel>
    not?: NestedEnumAuditActionFilter<$PrismaModel> | $Enums.AuditAction
  }
  export type JsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type AuditLogCountOrderByAggregateInput = {
    id?: SortOrder
    action?: SortOrder
    actorId?: SortOrder
    actorEmail?: SortOrder
    targetId?: SortOrder
    targetEmail?: SortOrder
    metadata?: SortOrder
    ipAddress?: SortOrder
    userAgent?: SortOrder
    createdAt?: SortOrder
  }

  export type AuditLogMaxOrderByAggregateInput = {
    id?: SortOrder
    action?: SortOrder
    actorId?: SortOrder
    actorEmail?: SortOrder
    targetId?: SortOrder
    targetEmail?: SortOrder
    ipAddress?: SortOrder
    userAgent?: SortOrder
    createdAt?: SortOrder
  }

  export type AuditLogMinOrderByAggregateInput = {
    id?: SortOrder
    action?: SortOrder
    actorId?: SortOrder
    actorEmail?: SortOrder
    targetId?: SortOrder
    targetEmail?: SortOrder
    ipAddress?: SortOrder
    userAgent?: SortOrder
    createdAt?: SortOrder
  }

  export type EnumAuditActionWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AuditAction | EnumAuditActionFieldRefInput<$PrismaModel>
    in?: $Enums.AuditAction[] | ListEnumAuditActionFieldRefInput<$PrismaModel>
    notIn?: $Enums.AuditAction[] | ListEnumAuditActionFieldRefInput<$PrismaModel>
    not?: NestedEnumAuditActionWithAggregatesFilter<$PrismaModel> | $Enums.AuditAction
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumAuditActionFilter<$PrismaModel>
    _max?: NestedEnumAuditActionFilter<$PrismaModel>
  }
  export type JsonNullableWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedJsonNullableFilter<$PrismaModel>
    _max?: NestedJsonNullableFilter<$PrismaModel>
  }

  export type AuthAccountCreateNestedManyWithoutRoleInput = {
    create?: XOR<AuthAccountCreateWithoutRoleInput, AuthAccountUncheckedCreateWithoutRoleInput> | AuthAccountCreateWithoutRoleInput[] | AuthAccountUncheckedCreateWithoutRoleInput[]
    connectOrCreate?: AuthAccountCreateOrConnectWithoutRoleInput | AuthAccountCreateOrConnectWithoutRoleInput[]
    createMany?: AuthAccountCreateManyRoleInputEnvelope
    connect?: AuthAccountWhereUniqueInput | AuthAccountWhereUniqueInput[]
  }

  export type AuthAccountRoleCreateNestedManyWithoutRoleInput = {
    create?: XOR<AuthAccountRoleCreateWithoutRoleInput, AuthAccountRoleUncheckedCreateWithoutRoleInput> | AuthAccountRoleCreateWithoutRoleInput[] | AuthAccountRoleUncheckedCreateWithoutRoleInput[]
    connectOrCreate?: AuthAccountRoleCreateOrConnectWithoutRoleInput | AuthAccountRoleCreateOrConnectWithoutRoleInput[]
    createMany?: AuthAccountRoleCreateManyRoleInputEnvelope
    connect?: AuthAccountRoleWhereUniqueInput | AuthAccountRoleWhereUniqueInput[]
  }

  export type AuthAccountUncheckedCreateNestedManyWithoutRoleInput = {
    create?: XOR<AuthAccountCreateWithoutRoleInput, AuthAccountUncheckedCreateWithoutRoleInput> | AuthAccountCreateWithoutRoleInput[] | AuthAccountUncheckedCreateWithoutRoleInput[]
    connectOrCreate?: AuthAccountCreateOrConnectWithoutRoleInput | AuthAccountCreateOrConnectWithoutRoleInput[]
    createMany?: AuthAccountCreateManyRoleInputEnvelope
    connect?: AuthAccountWhereUniqueInput | AuthAccountWhereUniqueInput[]
  }

  export type AuthAccountRoleUncheckedCreateNestedManyWithoutRoleInput = {
    create?: XOR<AuthAccountRoleCreateWithoutRoleInput, AuthAccountRoleUncheckedCreateWithoutRoleInput> | AuthAccountRoleCreateWithoutRoleInput[] | AuthAccountRoleUncheckedCreateWithoutRoleInput[]
    connectOrCreate?: AuthAccountRoleCreateOrConnectWithoutRoleInput | AuthAccountRoleCreateOrConnectWithoutRoleInput[]
    createMany?: AuthAccountRoleCreateManyRoleInputEnvelope
    connect?: AuthAccountRoleWhereUniqueInput | AuthAccountRoleWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type AuthAccountUpdateManyWithoutRoleNestedInput = {
    create?: XOR<AuthAccountCreateWithoutRoleInput, AuthAccountUncheckedCreateWithoutRoleInput> | AuthAccountCreateWithoutRoleInput[] | AuthAccountUncheckedCreateWithoutRoleInput[]
    connectOrCreate?: AuthAccountCreateOrConnectWithoutRoleInput | AuthAccountCreateOrConnectWithoutRoleInput[]
    upsert?: AuthAccountUpsertWithWhereUniqueWithoutRoleInput | AuthAccountUpsertWithWhereUniqueWithoutRoleInput[]
    createMany?: AuthAccountCreateManyRoleInputEnvelope
    set?: AuthAccountWhereUniqueInput | AuthAccountWhereUniqueInput[]
    disconnect?: AuthAccountWhereUniqueInput | AuthAccountWhereUniqueInput[]
    delete?: AuthAccountWhereUniqueInput | AuthAccountWhereUniqueInput[]
    connect?: AuthAccountWhereUniqueInput | AuthAccountWhereUniqueInput[]
    update?: AuthAccountUpdateWithWhereUniqueWithoutRoleInput | AuthAccountUpdateWithWhereUniqueWithoutRoleInput[]
    updateMany?: AuthAccountUpdateManyWithWhereWithoutRoleInput | AuthAccountUpdateManyWithWhereWithoutRoleInput[]
    deleteMany?: AuthAccountScalarWhereInput | AuthAccountScalarWhereInput[]
  }

  export type AuthAccountRoleUpdateManyWithoutRoleNestedInput = {
    create?: XOR<AuthAccountRoleCreateWithoutRoleInput, AuthAccountRoleUncheckedCreateWithoutRoleInput> | AuthAccountRoleCreateWithoutRoleInput[] | AuthAccountRoleUncheckedCreateWithoutRoleInput[]
    connectOrCreate?: AuthAccountRoleCreateOrConnectWithoutRoleInput | AuthAccountRoleCreateOrConnectWithoutRoleInput[]
    upsert?: AuthAccountRoleUpsertWithWhereUniqueWithoutRoleInput | AuthAccountRoleUpsertWithWhereUniqueWithoutRoleInput[]
    createMany?: AuthAccountRoleCreateManyRoleInputEnvelope
    set?: AuthAccountRoleWhereUniqueInput | AuthAccountRoleWhereUniqueInput[]
    disconnect?: AuthAccountRoleWhereUniqueInput | AuthAccountRoleWhereUniqueInput[]
    delete?: AuthAccountRoleWhereUniqueInput | AuthAccountRoleWhereUniqueInput[]
    connect?: AuthAccountRoleWhereUniqueInput | AuthAccountRoleWhereUniqueInput[]
    update?: AuthAccountRoleUpdateWithWhereUniqueWithoutRoleInput | AuthAccountRoleUpdateWithWhereUniqueWithoutRoleInput[]
    updateMany?: AuthAccountRoleUpdateManyWithWhereWithoutRoleInput | AuthAccountRoleUpdateManyWithWhereWithoutRoleInput[]
    deleteMany?: AuthAccountRoleScalarWhereInput | AuthAccountRoleScalarWhereInput[]
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type AuthAccountUncheckedUpdateManyWithoutRoleNestedInput = {
    create?: XOR<AuthAccountCreateWithoutRoleInput, AuthAccountUncheckedCreateWithoutRoleInput> | AuthAccountCreateWithoutRoleInput[] | AuthAccountUncheckedCreateWithoutRoleInput[]
    connectOrCreate?: AuthAccountCreateOrConnectWithoutRoleInput | AuthAccountCreateOrConnectWithoutRoleInput[]
    upsert?: AuthAccountUpsertWithWhereUniqueWithoutRoleInput | AuthAccountUpsertWithWhereUniqueWithoutRoleInput[]
    createMany?: AuthAccountCreateManyRoleInputEnvelope
    set?: AuthAccountWhereUniqueInput | AuthAccountWhereUniqueInput[]
    disconnect?: AuthAccountWhereUniqueInput | AuthAccountWhereUniqueInput[]
    delete?: AuthAccountWhereUniqueInput | AuthAccountWhereUniqueInput[]
    connect?: AuthAccountWhereUniqueInput | AuthAccountWhereUniqueInput[]
    update?: AuthAccountUpdateWithWhereUniqueWithoutRoleInput | AuthAccountUpdateWithWhereUniqueWithoutRoleInput[]
    updateMany?: AuthAccountUpdateManyWithWhereWithoutRoleInput | AuthAccountUpdateManyWithWhereWithoutRoleInput[]
    deleteMany?: AuthAccountScalarWhereInput | AuthAccountScalarWhereInput[]
  }

  export type AuthAccountRoleUncheckedUpdateManyWithoutRoleNestedInput = {
    create?: XOR<AuthAccountRoleCreateWithoutRoleInput, AuthAccountRoleUncheckedCreateWithoutRoleInput> | AuthAccountRoleCreateWithoutRoleInput[] | AuthAccountRoleUncheckedCreateWithoutRoleInput[]
    connectOrCreate?: AuthAccountRoleCreateOrConnectWithoutRoleInput | AuthAccountRoleCreateOrConnectWithoutRoleInput[]
    upsert?: AuthAccountRoleUpsertWithWhereUniqueWithoutRoleInput | AuthAccountRoleUpsertWithWhereUniqueWithoutRoleInput[]
    createMany?: AuthAccountRoleCreateManyRoleInputEnvelope
    set?: AuthAccountRoleWhereUniqueInput | AuthAccountRoleWhereUniqueInput[]
    disconnect?: AuthAccountRoleWhereUniqueInput | AuthAccountRoleWhereUniqueInput[]
    delete?: AuthAccountRoleWhereUniqueInput | AuthAccountRoleWhereUniqueInput[]
    connect?: AuthAccountRoleWhereUniqueInput | AuthAccountRoleWhereUniqueInput[]
    update?: AuthAccountRoleUpdateWithWhereUniqueWithoutRoleInput | AuthAccountRoleUpdateWithWhereUniqueWithoutRoleInput[]
    updateMany?: AuthAccountRoleUpdateManyWithWhereWithoutRoleInput | AuthAccountRoleUpdateManyWithWhereWithoutRoleInput[]
    deleteMany?: AuthAccountRoleScalarWhereInput | AuthAccountRoleScalarWhereInput[]
  }

  export type RoleCreateNestedOneWithoutAccountsInput = {
    create?: XOR<RoleCreateWithoutAccountsInput, RoleUncheckedCreateWithoutAccountsInput>
    connectOrCreate?: RoleCreateOrConnectWithoutAccountsInput
    connect?: RoleWhereUniqueInput
  }

  export type OAuthProviderAccountCreateNestedManyWithoutAuthAccountInput = {
    create?: XOR<OAuthProviderAccountCreateWithoutAuthAccountInput, OAuthProviderAccountUncheckedCreateWithoutAuthAccountInput> | OAuthProviderAccountCreateWithoutAuthAccountInput[] | OAuthProviderAccountUncheckedCreateWithoutAuthAccountInput[]
    connectOrCreate?: OAuthProviderAccountCreateOrConnectWithoutAuthAccountInput | OAuthProviderAccountCreateOrConnectWithoutAuthAccountInput[]
    createMany?: OAuthProviderAccountCreateManyAuthAccountInputEnvelope
    connect?: OAuthProviderAccountWhereUniqueInput | OAuthProviderAccountWhereUniqueInput[]
  }

  export type AuthSessionCreateNestedManyWithoutAuthAccountInput = {
    create?: XOR<AuthSessionCreateWithoutAuthAccountInput, AuthSessionUncheckedCreateWithoutAuthAccountInput> | AuthSessionCreateWithoutAuthAccountInput[] | AuthSessionUncheckedCreateWithoutAuthAccountInput[]
    connectOrCreate?: AuthSessionCreateOrConnectWithoutAuthAccountInput | AuthSessionCreateOrConnectWithoutAuthAccountInput[]
    createMany?: AuthSessionCreateManyAuthAccountInputEnvelope
    connect?: AuthSessionWhereUniqueInput | AuthSessionWhereUniqueInput[]
  }

  export type AuthTokenCreateNestedManyWithoutAuthAccountInput = {
    create?: XOR<AuthTokenCreateWithoutAuthAccountInput, AuthTokenUncheckedCreateWithoutAuthAccountInput> | AuthTokenCreateWithoutAuthAccountInput[] | AuthTokenUncheckedCreateWithoutAuthAccountInput[]
    connectOrCreate?: AuthTokenCreateOrConnectWithoutAuthAccountInput | AuthTokenCreateOrConnectWithoutAuthAccountInput[]
    createMany?: AuthTokenCreateManyAuthAccountInputEnvelope
    connect?: AuthTokenWhereUniqueInput | AuthTokenWhereUniqueInput[]
  }

  export type AuthAccountRoleCreateNestedManyWithoutAuthAccountInput = {
    create?: XOR<AuthAccountRoleCreateWithoutAuthAccountInput, AuthAccountRoleUncheckedCreateWithoutAuthAccountInput> | AuthAccountRoleCreateWithoutAuthAccountInput[] | AuthAccountRoleUncheckedCreateWithoutAuthAccountInput[]
    connectOrCreate?: AuthAccountRoleCreateOrConnectWithoutAuthAccountInput | AuthAccountRoleCreateOrConnectWithoutAuthAccountInput[]
    createMany?: AuthAccountRoleCreateManyAuthAccountInputEnvelope
    connect?: AuthAccountRoleWhereUniqueInput | AuthAccountRoleWhereUniqueInput[]
  }

  export type AuthAccountRoleCreateNestedManyWithoutAssignedByAuthAccountInput = {
    create?: XOR<AuthAccountRoleCreateWithoutAssignedByAuthAccountInput, AuthAccountRoleUncheckedCreateWithoutAssignedByAuthAccountInput> | AuthAccountRoleCreateWithoutAssignedByAuthAccountInput[] | AuthAccountRoleUncheckedCreateWithoutAssignedByAuthAccountInput[]
    connectOrCreate?: AuthAccountRoleCreateOrConnectWithoutAssignedByAuthAccountInput | AuthAccountRoleCreateOrConnectWithoutAssignedByAuthAccountInput[]
    createMany?: AuthAccountRoleCreateManyAssignedByAuthAccountInputEnvelope
    connect?: AuthAccountRoleWhereUniqueInput | AuthAccountRoleWhereUniqueInput[]
  }

  export type AuthChallengeCreateNestedManyWithoutAuthAccountInput = {
    create?: XOR<AuthChallengeCreateWithoutAuthAccountInput, AuthChallengeUncheckedCreateWithoutAuthAccountInput> | AuthChallengeCreateWithoutAuthAccountInput[] | AuthChallengeUncheckedCreateWithoutAuthAccountInput[]
    connectOrCreate?: AuthChallengeCreateOrConnectWithoutAuthAccountInput | AuthChallengeCreateOrConnectWithoutAuthAccountInput[]
    createMany?: AuthChallengeCreateManyAuthAccountInputEnvelope
    connect?: AuthChallengeWhereUniqueInput | AuthChallengeWhereUniqueInput[]
  }

  export type OAuthProviderAccountUncheckedCreateNestedManyWithoutAuthAccountInput = {
    create?: XOR<OAuthProviderAccountCreateWithoutAuthAccountInput, OAuthProviderAccountUncheckedCreateWithoutAuthAccountInput> | OAuthProviderAccountCreateWithoutAuthAccountInput[] | OAuthProviderAccountUncheckedCreateWithoutAuthAccountInput[]
    connectOrCreate?: OAuthProviderAccountCreateOrConnectWithoutAuthAccountInput | OAuthProviderAccountCreateOrConnectWithoutAuthAccountInput[]
    createMany?: OAuthProviderAccountCreateManyAuthAccountInputEnvelope
    connect?: OAuthProviderAccountWhereUniqueInput | OAuthProviderAccountWhereUniqueInput[]
  }

  export type AuthSessionUncheckedCreateNestedManyWithoutAuthAccountInput = {
    create?: XOR<AuthSessionCreateWithoutAuthAccountInput, AuthSessionUncheckedCreateWithoutAuthAccountInput> | AuthSessionCreateWithoutAuthAccountInput[] | AuthSessionUncheckedCreateWithoutAuthAccountInput[]
    connectOrCreate?: AuthSessionCreateOrConnectWithoutAuthAccountInput | AuthSessionCreateOrConnectWithoutAuthAccountInput[]
    createMany?: AuthSessionCreateManyAuthAccountInputEnvelope
    connect?: AuthSessionWhereUniqueInput | AuthSessionWhereUniqueInput[]
  }

  export type AuthTokenUncheckedCreateNestedManyWithoutAuthAccountInput = {
    create?: XOR<AuthTokenCreateWithoutAuthAccountInput, AuthTokenUncheckedCreateWithoutAuthAccountInput> | AuthTokenCreateWithoutAuthAccountInput[] | AuthTokenUncheckedCreateWithoutAuthAccountInput[]
    connectOrCreate?: AuthTokenCreateOrConnectWithoutAuthAccountInput | AuthTokenCreateOrConnectWithoutAuthAccountInput[]
    createMany?: AuthTokenCreateManyAuthAccountInputEnvelope
    connect?: AuthTokenWhereUniqueInput | AuthTokenWhereUniqueInput[]
  }

  export type AuthAccountRoleUncheckedCreateNestedManyWithoutAuthAccountInput = {
    create?: XOR<AuthAccountRoleCreateWithoutAuthAccountInput, AuthAccountRoleUncheckedCreateWithoutAuthAccountInput> | AuthAccountRoleCreateWithoutAuthAccountInput[] | AuthAccountRoleUncheckedCreateWithoutAuthAccountInput[]
    connectOrCreate?: AuthAccountRoleCreateOrConnectWithoutAuthAccountInput | AuthAccountRoleCreateOrConnectWithoutAuthAccountInput[]
    createMany?: AuthAccountRoleCreateManyAuthAccountInputEnvelope
    connect?: AuthAccountRoleWhereUniqueInput | AuthAccountRoleWhereUniqueInput[]
  }

  export type AuthAccountRoleUncheckedCreateNestedManyWithoutAssignedByAuthAccountInput = {
    create?: XOR<AuthAccountRoleCreateWithoutAssignedByAuthAccountInput, AuthAccountRoleUncheckedCreateWithoutAssignedByAuthAccountInput> | AuthAccountRoleCreateWithoutAssignedByAuthAccountInput[] | AuthAccountRoleUncheckedCreateWithoutAssignedByAuthAccountInput[]
    connectOrCreate?: AuthAccountRoleCreateOrConnectWithoutAssignedByAuthAccountInput | AuthAccountRoleCreateOrConnectWithoutAssignedByAuthAccountInput[]
    createMany?: AuthAccountRoleCreateManyAssignedByAuthAccountInputEnvelope
    connect?: AuthAccountRoleWhereUniqueInput | AuthAccountRoleWhereUniqueInput[]
  }

  export type AuthChallengeUncheckedCreateNestedManyWithoutAuthAccountInput = {
    create?: XOR<AuthChallengeCreateWithoutAuthAccountInput, AuthChallengeUncheckedCreateWithoutAuthAccountInput> | AuthChallengeCreateWithoutAuthAccountInput[] | AuthChallengeUncheckedCreateWithoutAuthAccountInput[]
    connectOrCreate?: AuthChallengeCreateOrConnectWithoutAuthAccountInput | AuthChallengeCreateOrConnectWithoutAuthAccountInput[]
    createMany?: AuthChallengeCreateManyAuthAccountInputEnvelope
    connect?: AuthChallengeWhereUniqueInput | AuthChallengeWhereUniqueInput[]
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type EnumAuthProviderFieldUpdateOperationsInput = {
    set?: $Enums.AuthProvider
  }

  export type EnumAuthStatusFieldUpdateOperationsInput = {
    set?: $Enums.AuthStatus
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type RoleUpdateOneRequiredWithoutAccountsNestedInput = {
    create?: XOR<RoleCreateWithoutAccountsInput, RoleUncheckedCreateWithoutAccountsInput>
    connectOrCreate?: RoleCreateOrConnectWithoutAccountsInput
    upsert?: RoleUpsertWithoutAccountsInput
    connect?: RoleWhereUniqueInput
    update?: XOR<XOR<RoleUpdateToOneWithWhereWithoutAccountsInput, RoleUpdateWithoutAccountsInput>, RoleUncheckedUpdateWithoutAccountsInput>
  }

  export type OAuthProviderAccountUpdateManyWithoutAuthAccountNestedInput = {
    create?: XOR<OAuthProviderAccountCreateWithoutAuthAccountInput, OAuthProviderAccountUncheckedCreateWithoutAuthAccountInput> | OAuthProviderAccountCreateWithoutAuthAccountInput[] | OAuthProviderAccountUncheckedCreateWithoutAuthAccountInput[]
    connectOrCreate?: OAuthProviderAccountCreateOrConnectWithoutAuthAccountInput | OAuthProviderAccountCreateOrConnectWithoutAuthAccountInput[]
    upsert?: OAuthProviderAccountUpsertWithWhereUniqueWithoutAuthAccountInput | OAuthProviderAccountUpsertWithWhereUniqueWithoutAuthAccountInput[]
    createMany?: OAuthProviderAccountCreateManyAuthAccountInputEnvelope
    set?: OAuthProviderAccountWhereUniqueInput | OAuthProviderAccountWhereUniqueInput[]
    disconnect?: OAuthProviderAccountWhereUniqueInput | OAuthProviderAccountWhereUniqueInput[]
    delete?: OAuthProviderAccountWhereUniqueInput | OAuthProviderAccountWhereUniqueInput[]
    connect?: OAuthProviderAccountWhereUniqueInput | OAuthProviderAccountWhereUniqueInput[]
    update?: OAuthProviderAccountUpdateWithWhereUniqueWithoutAuthAccountInput | OAuthProviderAccountUpdateWithWhereUniqueWithoutAuthAccountInput[]
    updateMany?: OAuthProviderAccountUpdateManyWithWhereWithoutAuthAccountInput | OAuthProviderAccountUpdateManyWithWhereWithoutAuthAccountInput[]
    deleteMany?: OAuthProviderAccountScalarWhereInput | OAuthProviderAccountScalarWhereInput[]
  }

  export type AuthSessionUpdateManyWithoutAuthAccountNestedInput = {
    create?: XOR<AuthSessionCreateWithoutAuthAccountInput, AuthSessionUncheckedCreateWithoutAuthAccountInput> | AuthSessionCreateWithoutAuthAccountInput[] | AuthSessionUncheckedCreateWithoutAuthAccountInput[]
    connectOrCreate?: AuthSessionCreateOrConnectWithoutAuthAccountInput | AuthSessionCreateOrConnectWithoutAuthAccountInput[]
    upsert?: AuthSessionUpsertWithWhereUniqueWithoutAuthAccountInput | AuthSessionUpsertWithWhereUniqueWithoutAuthAccountInput[]
    createMany?: AuthSessionCreateManyAuthAccountInputEnvelope
    set?: AuthSessionWhereUniqueInput | AuthSessionWhereUniqueInput[]
    disconnect?: AuthSessionWhereUniqueInput | AuthSessionWhereUniqueInput[]
    delete?: AuthSessionWhereUniqueInput | AuthSessionWhereUniqueInput[]
    connect?: AuthSessionWhereUniqueInput | AuthSessionWhereUniqueInput[]
    update?: AuthSessionUpdateWithWhereUniqueWithoutAuthAccountInput | AuthSessionUpdateWithWhereUniqueWithoutAuthAccountInput[]
    updateMany?: AuthSessionUpdateManyWithWhereWithoutAuthAccountInput | AuthSessionUpdateManyWithWhereWithoutAuthAccountInput[]
    deleteMany?: AuthSessionScalarWhereInput | AuthSessionScalarWhereInput[]
  }

  export type AuthTokenUpdateManyWithoutAuthAccountNestedInput = {
    create?: XOR<AuthTokenCreateWithoutAuthAccountInput, AuthTokenUncheckedCreateWithoutAuthAccountInput> | AuthTokenCreateWithoutAuthAccountInput[] | AuthTokenUncheckedCreateWithoutAuthAccountInput[]
    connectOrCreate?: AuthTokenCreateOrConnectWithoutAuthAccountInput | AuthTokenCreateOrConnectWithoutAuthAccountInput[]
    upsert?: AuthTokenUpsertWithWhereUniqueWithoutAuthAccountInput | AuthTokenUpsertWithWhereUniqueWithoutAuthAccountInput[]
    createMany?: AuthTokenCreateManyAuthAccountInputEnvelope
    set?: AuthTokenWhereUniqueInput | AuthTokenWhereUniqueInput[]
    disconnect?: AuthTokenWhereUniqueInput | AuthTokenWhereUniqueInput[]
    delete?: AuthTokenWhereUniqueInput | AuthTokenWhereUniqueInput[]
    connect?: AuthTokenWhereUniqueInput | AuthTokenWhereUniqueInput[]
    update?: AuthTokenUpdateWithWhereUniqueWithoutAuthAccountInput | AuthTokenUpdateWithWhereUniqueWithoutAuthAccountInput[]
    updateMany?: AuthTokenUpdateManyWithWhereWithoutAuthAccountInput | AuthTokenUpdateManyWithWhereWithoutAuthAccountInput[]
    deleteMany?: AuthTokenScalarWhereInput | AuthTokenScalarWhereInput[]
  }

  export type AuthAccountRoleUpdateManyWithoutAuthAccountNestedInput = {
    create?: XOR<AuthAccountRoleCreateWithoutAuthAccountInput, AuthAccountRoleUncheckedCreateWithoutAuthAccountInput> | AuthAccountRoleCreateWithoutAuthAccountInput[] | AuthAccountRoleUncheckedCreateWithoutAuthAccountInput[]
    connectOrCreate?: AuthAccountRoleCreateOrConnectWithoutAuthAccountInput | AuthAccountRoleCreateOrConnectWithoutAuthAccountInput[]
    upsert?: AuthAccountRoleUpsertWithWhereUniqueWithoutAuthAccountInput | AuthAccountRoleUpsertWithWhereUniqueWithoutAuthAccountInput[]
    createMany?: AuthAccountRoleCreateManyAuthAccountInputEnvelope
    set?: AuthAccountRoleWhereUniqueInput | AuthAccountRoleWhereUniqueInput[]
    disconnect?: AuthAccountRoleWhereUniqueInput | AuthAccountRoleWhereUniqueInput[]
    delete?: AuthAccountRoleWhereUniqueInput | AuthAccountRoleWhereUniqueInput[]
    connect?: AuthAccountRoleWhereUniqueInput | AuthAccountRoleWhereUniqueInput[]
    update?: AuthAccountRoleUpdateWithWhereUniqueWithoutAuthAccountInput | AuthAccountRoleUpdateWithWhereUniqueWithoutAuthAccountInput[]
    updateMany?: AuthAccountRoleUpdateManyWithWhereWithoutAuthAccountInput | AuthAccountRoleUpdateManyWithWhereWithoutAuthAccountInput[]
    deleteMany?: AuthAccountRoleScalarWhereInput | AuthAccountRoleScalarWhereInput[]
  }

  export type AuthAccountRoleUpdateManyWithoutAssignedByAuthAccountNestedInput = {
    create?: XOR<AuthAccountRoleCreateWithoutAssignedByAuthAccountInput, AuthAccountRoleUncheckedCreateWithoutAssignedByAuthAccountInput> | AuthAccountRoleCreateWithoutAssignedByAuthAccountInput[] | AuthAccountRoleUncheckedCreateWithoutAssignedByAuthAccountInput[]
    connectOrCreate?: AuthAccountRoleCreateOrConnectWithoutAssignedByAuthAccountInput | AuthAccountRoleCreateOrConnectWithoutAssignedByAuthAccountInput[]
    upsert?: AuthAccountRoleUpsertWithWhereUniqueWithoutAssignedByAuthAccountInput | AuthAccountRoleUpsertWithWhereUniqueWithoutAssignedByAuthAccountInput[]
    createMany?: AuthAccountRoleCreateManyAssignedByAuthAccountInputEnvelope
    set?: AuthAccountRoleWhereUniqueInput | AuthAccountRoleWhereUniqueInput[]
    disconnect?: AuthAccountRoleWhereUniqueInput | AuthAccountRoleWhereUniqueInput[]
    delete?: AuthAccountRoleWhereUniqueInput | AuthAccountRoleWhereUniqueInput[]
    connect?: AuthAccountRoleWhereUniqueInput | AuthAccountRoleWhereUniqueInput[]
    update?: AuthAccountRoleUpdateWithWhereUniqueWithoutAssignedByAuthAccountInput | AuthAccountRoleUpdateWithWhereUniqueWithoutAssignedByAuthAccountInput[]
    updateMany?: AuthAccountRoleUpdateManyWithWhereWithoutAssignedByAuthAccountInput | AuthAccountRoleUpdateManyWithWhereWithoutAssignedByAuthAccountInput[]
    deleteMany?: AuthAccountRoleScalarWhereInput | AuthAccountRoleScalarWhereInput[]
  }

  export type AuthChallengeUpdateManyWithoutAuthAccountNestedInput = {
    create?: XOR<AuthChallengeCreateWithoutAuthAccountInput, AuthChallengeUncheckedCreateWithoutAuthAccountInput> | AuthChallengeCreateWithoutAuthAccountInput[] | AuthChallengeUncheckedCreateWithoutAuthAccountInput[]
    connectOrCreate?: AuthChallengeCreateOrConnectWithoutAuthAccountInput | AuthChallengeCreateOrConnectWithoutAuthAccountInput[]
    upsert?: AuthChallengeUpsertWithWhereUniqueWithoutAuthAccountInput | AuthChallengeUpsertWithWhereUniqueWithoutAuthAccountInput[]
    createMany?: AuthChallengeCreateManyAuthAccountInputEnvelope
    set?: AuthChallengeWhereUniqueInput | AuthChallengeWhereUniqueInput[]
    disconnect?: AuthChallengeWhereUniqueInput | AuthChallengeWhereUniqueInput[]
    delete?: AuthChallengeWhereUniqueInput | AuthChallengeWhereUniqueInput[]
    connect?: AuthChallengeWhereUniqueInput | AuthChallengeWhereUniqueInput[]
    update?: AuthChallengeUpdateWithWhereUniqueWithoutAuthAccountInput | AuthChallengeUpdateWithWhereUniqueWithoutAuthAccountInput[]
    updateMany?: AuthChallengeUpdateManyWithWhereWithoutAuthAccountInput | AuthChallengeUpdateManyWithWhereWithoutAuthAccountInput[]
    deleteMany?: AuthChallengeScalarWhereInput | AuthChallengeScalarWhereInput[]
  }

  export type OAuthProviderAccountUncheckedUpdateManyWithoutAuthAccountNestedInput = {
    create?: XOR<OAuthProviderAccountCreateWithoutAuthAccountInput, OAuthProviderAccountUncheckedCreateWithoutAuthAccountInput> | OAuthProviderAccountCreateWithoutAuthAccountInput[] | OAuthProviderAccountUncheckedCreateWithoutAuthAccountInput[]
    connectOrCreate?: OAuthProviderAccountCreateOrConnectWithoutAuthAccountInput | OAuthProviderAccountCreateOrConnectWithoutAuthAccountInput[]
    upsert?: OAuthProviderAccountUpsertWithWhereUniqueWithoutAuthAccountInput | OAuthProviderAccountUpsertWithWhereUniqueWithoutAuthAccountInput[]
    createMany?: OAuthProviderAccountCreateManyAuthAccountInputEnvelope
    set?: OAuthProviderAccountWhereUniqueInput | OAuthProviderAccountWhereUniqueInput[]
    disconnect?: OAuthProviderAccountWhereUniqueInput | OAuthProviderAccountWhereUniqueInput[]
    delete?: OAuthProviderAccountWhereUniqueInput | OAuthProviderAccountWhereUniqueInput[]
    connect?: OAuthProviderAccountWhereUniqueInput | OAuthProviderAccountWhereUniqueInput[]
    update?: OAuthProviderAccountUpdateWithWhereUniqueWithoutAuthAccountInput | OAuthProviderAccountUpdateWithWhereUniqueWithoutAuthAccountInput[]
    updateMany?: OAuthProviderAccountUpdateManyWithWhereWithoutAuthAccountInput | OAuthProviderAccountUpdateManyWithWhereWithoutAuthAccountInput[]
    deleteMany?: OAuthProviderAccountScalarWhereInput | OAuthProviderAccountScalarWhereInput[]
  }

  export type AuthSessionUncheckedUpdateManyWithoutAuthAccountNestedInput = {
    create?: XOR<AuthSessionCreateWithoutAuthAccountInput, AuthSessionUncheckedCreateWithoutAuthAccountInput> | AuthSessionCreateWithoutAuthAccountInput[] | AuthSessionUncheckedCreateWithoutAuthAccountInput[]
    connectOrCreate?: AuthSessionCreateOrConnectWithoutAuthAccountInput | AuthSessionCreateOrConnectWithoutAuthAccountInput[]
    upsert?: AuthSessionUpsertWithWhereUniqueWithoutAuthAccountInput | AuthSessionUpsertWithWhereUniqueWithoutAuthAccountInput[]
    createMany?: AuthSessionCreateManyAuthAccountInputEnvelope
    set?: AuthSessionWhereUniqueInput | AuthSessionWhereUniqueInput[]
    disconnect?: AuthSessionWhereUniqueInput | AuthSessionWhereUniqueInput[]
    delete?: AuthSessionWhereUniqueInput | AuthSessionWhereUniqueInput[]
    connect?: AuthSessionWhereUniqueInput | AuthSessionWhereUniqueInput[]
    update?: AuthSessionUpdateWithWhereUniqueWithoutAuthAccountInput | AuthSessionUpdateWithWhereUniqueWithoutAuthAccountInput[]
    updateMany?: AuthSessionUpdateManyWithWhereWithoutAuthAccountInput | AuthSessionUpdateManyWithWhereWithoutAuthAccountInput[]
    deleteMany?: AuthSessionScalarWhereInput | AuthSessionScalarWhereInput[]
  }

  export type AuthTokenUncheckedUpdateManyWithoutAuthAccountNestedInput = {
    create?: XOR<AuthTokenCreateWithoutAuthAccountInput, AuthTokenUncheckedCreateWithoutAuthAccountInput> | AuthTokenCreateWithoutAuthAccountInput[] | AuthTokenUncheckedCreateWithoutAuthAccountInput[]
    connectOrCreate?: AuthTokenCreateOrConnectWithoutAuthAccountInput | AuthTokenCreateOrConnectWithoutAuthAccountInput[]
    upsert?: AuthTokenUpsertWithWhereUniqueWithoutAuthAccountInput | AuthTokenUpsertWithWhereUniqueWithoutAuthAccountInput[]
    createMany?: AuthTokenCreateManyAuthAccountInputEnvelope
    set?: AuthTokenWhereUniqueInput | AuthTokenWhereUniqueInput[]
    disconnect?: AuthTokenWhereUniqueInput | AuthTokenWhereUniqueInput[]
    delete?: AuthTokenWhereUniqueInput | AuthTokenWhereUniqueInput[]
    connect?: AuthTokenWhereUniqueInput | AuthTokenWhereUniqueInput[]
    update?: AuthTokenUpdateWithWhereUniqueWithoutAuthAccountInput | AuthTokenUpdateWithWhereUniqueWithoutAuthAccountInput[]
    updateMany?: AuthTokenUpdateManyWithWhereWithoutAuthAccountInput | AuthTokenUpdateManyWithWhereWithoutAuthAccountInput[]
    deleteMany?: AuthTokenScalarWhereInput | AuthTokenScalarWhereInput[]
  }

  export type AuthAccountRoleUncheckedUpdateManyWithoutAuthAccountNestedInput = {
    create?: XOR<AuthAccountRoleCreateWithoutAuthAccountInput, AuthAccountRoleUncheckedCreateWithoutAuthAccountInput> | AuthAccountRoleCreateWithoutAuthAccountInput[] | AuthAccountRoleUncheckedCreateWithoutAuthAccountInput[]
    connectOrCreate?: AuthAccountRoleCreateOrConnectWithoutAuthAccountInput | AuthAccountRoleCreateOrConnectWithoutAuthAccountInput[]
    upsert?: AuthAccountRoleUpsertWithWhereUniqueWithoutAuthAccountInput | AuthAccountRoleUpsertWithWhereUniqueWithoutAuthAccountInput[]
    createMany?: AuthAccountRoleCreateManyAuthAccountInputEnvelope
    set?: AuthAccountRoleWhereUniqueInput | AuthAccountRoleWhereUniqueInput[]
    disconnect?: AuthAccountRoleWhereUniqueInput | AuthAccountRoleWhereUniqueInput[]
    delete?: AuthAccountRoleWhereUniqueInput | AuthAccountRoleWhereUniqueInput[]
    connect?: AuthAccountRoleWhereUniqueInput | AuthAccountRoleWhereUniqueInput[]
    update?: AuthAccountRoleUpdateWithWhereUniqueWithoutAuthAccountInput | AuthAccountRoleUpdateWithWhereUniqueWithoutAuthAccountInput[]
    updateMany?: AuthAccountRoleUpdateManyWithWhereWithoutAuthAccountInput | AuthAccountRoleUpdateManyWithWhereWithoutAuthAccountInput[]
    deleteMany?: AuthAccountRoleScalarWhereInput | AuthAccountRoleScalarWhereInput[]
  }

  export type AuthAccountRoleUncheckedUpdateManyWithoutAssignedByAuthAccountNestedInput = {
    create?: XOR<AuthAccountRoleCreateWithoutAssignedByAuthAccountInput, AuthAccountRoleUncheckedCreateWithoutAssignedByAuthAccountInput> | AuthAccountRoleCreateWithoutAssignedByAuthAccountInput[] | AuthAccountRoleUncheckedCreateWithoutAssignedByAuthAccountInput[]
    connectOrCreate?: AuthAccountRoleCreateOrConnectWithoutAssignedByAuthAccountInput | AuthAccountRoleCreateOrConnectWithoutAssignedByAuthAccountInput[]
    upsert?: AuthAccountRoleUpsertWithWhereUniqueWithoutAssignedByAuthAccountInput | AuthAccountRoleUpsertWithWhereUniqueWithoutAssignedByAuthAccountInput[]
    createMany?: AuthAccountRoleCreateManyAssignedByAuthAccountInputEnvelope
    set?: AuthAccountRoleWhereUniqueInput | AuthAccountRoleWhereUniqueInput[]
    disconnect?: AuthAccountRoleWhereUniqueInput | AuthAccountRoleWhereUniqueInput[]
    delete?: AuthAccountRoleWhereUniqueInput | AuthAccountRoleWhereUniqueInput[]
    connect?: AuthAccountRoleWhereUniqueInput | AuthAccountRoleWhereUniqueInput[]
    update?: AuthAccountRoleUpdateWithWhereUniqueWithoutAssignedByAuthAccountInput | AuthAccountRoleUpdateWithWhereUniqueWithoutAssignedByAuthAccountInput[]
    updateMany?: AuthAccountRoleUpdateManyWithWhereWithoutAssignedByAuthAccountInput | AuthAccountRoleUpdateManyWithWhereWithoutAssignedByAuthAccountInput[]
    deleteMany?: AuthAccountRoleScalarWhereInput | AuthAccountRoleScalarWhereInput[]
  }

  export type AuthChallengeUncheckedUpdateManyWithoutAuthAccountNestedInput = {
    create?: XOR<AuthChallengeCreateWithoutAuthAccountInput, AuthChallengeUncheckedCreateWithoutAuthAccountInput> | AuthChallengeCreateWithoutAuthAccountInput[] | AuthChallengeUncheckedCreateWithoutAuthAccountInput[]
    connectOrCreate?: AuthChallengeCreateOrConnectWithoutAuthAccountInput | AuthChallengeCreateOrConnectWithoutAuthAccountInput[]
    upsert?: AuthChallengeUpsertWithWhereUniqueWithoutAuthAccountInput | AuthChallengeUpsertWithWhereUniqueWithoutAuthAccountInput[]
    createMany?: AuthChallengeCreateManyAuthAccountInputEnvelope
    set?: AuthChallengeWhereUniqueInput | AuthChallengeWhereUniqueInput[]
    disconnect?: AuthChallengeWhereUniqueInput | AuthChallengeWhereUniqueInput[]
    delete?: AuthChallengeWhereUniqueInput | AuthChallengeWhereUniqueInput[]
    connect?: AuthChallengeWhereUniqueInput | AuthChallengeWhereUniqueInput[]
    update?: AuthChallengeUpdateWithWhereUniqueWithoutAuthAccountInput | AuthChallengeUpdateWithWhereUniqueWithoutAuthAccountInput[]
    updateMany?: AuthChallengeUpdateManyWithWhereWithoutAuthAccountInput | AuthChallengeUpdateManyWithWhereWithoutAuthAccountInput[]
    deleteMany?: AuthChallengeScalarWhereInput | AuthChallengeScalarWhereInput[]
  }

  export type AuthAccountCreateNestedOneWithoutAccountRolesInput = {
    create?: XOR<AuthAccountCreateWithoutAccountRolesInput, AuthAccountUncheckedCreateWithoutAccountRolesInput>
    connectOrCreate?: AuthAccountCreateOrConnectWithoutAccountRolesInput
    connect?: AuthAccountWhereUniqueInput
  }

  export type RoleCreateNestedOneWithoutAccountRolesInput = {
    create?: XOR<RoleCreateWithoutAccountRolesInput, RoleUncheckedCreateWithoutAccountRolesInput>
    connectOrCreate?: RoleCreateOrConnectWithoutAccountRolesInput
    connect?: RoleWhereUniqueInput
  }

  export type AuthAccountCreateNestedOneWithoutGrantedRolesInput = {
    create?: XOR<AuthAccountCreateWithoutGrantedRolesInput, AuthAccountUncheckedCreateWithoutGrantedRolesInput>
    connectOrCreate?: AuthAccountCreateOrConnectWithoutGrantedRolesInput
    connect?: AuthAccountWhereUniqueInput
  }

  export type AuthAccountUpdateOneRequiredWithoutAccountRolesNestedInput = {
    create?: XOR<AuthAccountCreateWithoutAccountRolesInput, AuthAccountUncheckedCreateWithoutAccountRolesInput>
    connectOrCreate?: AuthAccountCreateOrConnectWithoutAccountRolesInput
    upsert?: AuthAccountUpsertWithoutAccountRolesInput
    connect?: AuthAccountWhereUniqueInput
    update?: XOR<XOR<AuthAccountUpdateToOneWithWhereWithoutAccountRolesInput, AuthAccountUpdateWithoutAccountRolesInput>, AuthAccountUncheckedUpdateWithoutAccountRolesInput>
  }

  export type RoleUpdateOneRequiredWithoutAccountRolesNestedInput = {
    create?: XOR<RoleCreateWithoutAccountRolesInput, RoleUncheckedCreateWithoutAccountRolesInput>
    connectOrCreate?: RoleCreateOrConnectWithoutAccountRolesInput
    upsert?: RoleUpsertWithoutAccountRolesInput
    connect?: RoleWhereUniqueInput
    update?: XOR<XOR<RoleUpdateToOneWithWhereWithoutAccountRolesInput, RoleUpdateWithoutAccountRolesInput>, RoleUncheckedUpdateWithoutAccountRolesInput>
  }

  export type AuthAccountUpdateOneWithoutGrantedRolesNestedInput = {
    create?: XOR<AuthAccountCreateWithoutGrantedRolesInput, AuthAccountUncheckedCreateWithoutGrantedRolesInput>
    connectOrCreate?: AuthAccountCreateOrConnectWithoutGrantedRolesInput
    upsert?: AuthAccountUpsertWithoutGrantedRolesInput
    disconnect?: AuthAccountWhereInput | boolean
    delete?: AuthAccountWhereInput | boolean
    connect?: AuthAccountWhereUniqueInput
    update?: XOR<XOR<AuthAccountUpdateToOneWithWhereWithoutGrantedRolesInput, AuthAccountUpdateWithoutGrantedRolesInput>, AuthAccountUncheckedUpdateWithoutGrantedRolesInput>
  }

  export type AuthAccountCreateNestedOneWithoutOauthAccountsInput = {
    create?: XOR<AuthAccountCreateWithoutOauthAccountsInput, AuthAccountUncheckedCreateWithoutOauthAccountsInput>
    connectOrCreate?: AuthAccountCreateOrConnectWithoutOauthAccountsInput
    connect?: AuthAccountWhereUniqueInput
  }

  export type AuthAccountUpdateOneRequiredWithoutOauthAccountsNestedInput = {
    create?: XOR<AuthAccountCreateWithoutOauthAccountsInput, AuthAccountUncheckedCreateWithoutOauthAccountsInput>
    connectOrCreate?: AuthAccountCreateOrConnectWithoutOauthAccountsInput
    upsert?: AuthAccountUpsertWithoutOauthAccountsInput
    connect?: AuthAccountWhereUniqueInput
    update?: XOR<XOR<AuthAccountUpdateToOneWithWhereWithoutOauthAccountsInput, AuthAccountUpdateWithoutOauthAccountsInput>, AuthAccountUncheckedUpdateWithoutOauthAccountsInput>
  }

  export type AuthAccountCreateNestedOneWithoutSessionsInput = {
    create?: XOR<AuthAccountCreateWithoutSessionsInput, AuthAccountUncheckedCreateWithoutSessionsInput>
    connectOrCreate?: AuthAccountCreateOrConnectWithoutSessionsInput
    connect?: AuthAccountWhereUniqueInput
  }

  export type EnumSessionStatusFieldUpdateOperationsInput = {
    set?: $Enums.SessionStatus
  }

  export type AuthAccountUpdateOneRequiredWithoutSessionsNestedInput = {
    create?: XOR<AuthAccountCreateWithoutSessionsInput, AuthAccountUncheckedCreateWithoutSessionsInput>
    connectOrCreate?: AuthAccountCreateOrConnectWithoutSessionsInput
    upsert?: AuthAccountUpsertWithoutSessionsInput
    connect?: AuthAccountWhereUniqueInput
    update?: XOR<XOR<AuthAccountUpdateToOneWithWhereWithoutSessionsInput, AuthAccountUpdateWithoutSessionsInput>, AuthAccountUncheckedUpdateWithoutSessionsInput>
  }

  export type AuthAccountCreateNestedOneWithoutTokensInput = {
    create?: XOR<AuthAccountCreateWithoutTokensInput, AuthAccountUncheckedCreateWithoutTokensInput>
    connectOrCreate?: AuthAccountCreateOrConnectWithoutTokensInput
    connect?: AuthAccountWhereUniqueInput
  }

  export type EnumTokenPurposeFieldUpdateOperationsInput = {
    set?: $Enums.TokenPurpose
  }

  export type AuthAccountUpdateOneRequiredWithoutTokensNestedInput = {
    create?: XOR<AuthAccountCreateWithoutTokensInput, AuthAccountUncheckedCreateWithoutTokensInput>
    connectOrCreate?: AuthAccountCreateOrConnectWithoutTokensInput
    upsert?: AuthAccountUpsertWithoutTokensInput
    connect?: AuthAccountWhereUniqueInput
    update?: XOR<XOR<AuthAccountUpdateToOneWithWhereWithoutTokensInput, AuthAccountUpdateWithoutTokensInput>, AuthAccountUncheckedUpdateWithoutTokensInput>
  }

  export type AuthAccountCreateNestedOneWithoutChallengesInput = {
    create?: XOR<AuthAccountCreateWithoutChallengesInput, AuthAccountUncheckedCreateWithoutChallengesInput>
    connectOrCreate?: AuthAccountCreateOrConnectWithoutChallengesInput
    connect?: AuthAccountWhereUniqueInput
  }

  export type EnumAuthChallengePurposeFieldUpdateOperationsInput = {
    set?: $Enums.AuthChallengePurpose
  }

  export type AuthAccountUpdateOneWithoutChallengesNestedInput = {
    create?: XOR<AuthAccountCreateWithoutChallengesInput, AuthAccountUncheckedCreateWithoutChallengesInput>
    connectOrCreate?: AuthAccountCreateOrConnectWithoutChallengesInput
    upsert?: AuthAccountUpsertWithoutChallengesInput
    disconnect?: AuthAccountWhereInput | boolean
    delete?: AuthAccountWhereInput | boolean
    connect?: AuthAccountWhereUniqueInput
    update?: XOR<XOR<AuthAccountUpdateToOneWithWhereWithoutChallengesInput, AuthAccountUpdateWithoutChallengesInput>, AuthAccountUncheckedUpdateWithoutChallengesInput>
  }

  export type EnumAuditActionFieldUpdateOperationsInput = {
    set?: $Enums.AuditAction
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedEnumAuthProviderFilter<$PrismaModel = never> = {
    equals?: $Enums.AuthProvider | EnumAuthProviderFieldRefInput<$PrismaModel>
    in?: $Enums.AuthProvider[] | ListEnumAuthProviderFieldRefInput<$PrismaModel>
    notIn?: $Enums.AuthProvider[] | ListEnumAuthProviderFieldRefInput<$PrismaModel>
    not?: NestedEnumAuthProviderFilter<$PrismaModel> | $Enums.AuthProvider
  }

  export type NestedEnumAuthStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.AuthStatus | EnumAuthStatusFieldRefInput<$PrismaModel>
    in?: $Enums.AuthStatus[] | ListEnumAuthStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.AuthStatus[] | ListEnumAuthStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumAuthStatusFilter<$PrismaModel> | $Enums.AuthStatus
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedEnumAuthProviderWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AuthProvider | EnumAuthProviderFieldRefInput<$PrismaModel>
    in?: $Enums.AuthProvider[] | ListEnumAuthProviderFieldRefInput<$PrismaModel>
    notIn?: $Enums.AuthProvider[] | ListEnumAuthProviderFieldRefInput<$PrismaModel>
    not?: NestedEnumAuthProviderWithAggregatesFilter<$PrismaModel> | $Enums.AuthProvider
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumAuthProviderFilter<$PrismaModel>
    _max?: NestedEnumAuthProviderFilter<$PrismaModel>
  }

  export type NestedEnumAuthStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AuthStatus | EnumAuthStatusFieldRefInput<$PrismaModel>
    in?: $Enums.AuthStatus[] | ListEnumAuthStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.AuthStatus[] | ListEnumAuthStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumAuthStatusWithAggregatesFilter<$PrismaModel> | $Enums.AuthStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumAuthStatusFilter<$PrismaModel>
    _max?: NestedEnumAuthStatusFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedEnumSessionStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.SessionStatus | EnumSessionStatusFieldRefInput<$PrismaModel>
    in?: $Enums.SessionStatus[] | ListEnumSessionStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.SessionStatus[] | ListEnumSessionStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumSessionStatusFilter<$PrismaModel> | $Enums.SessionStatus
  }

  export type NestedEnumSessionStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.SessionStatus | EnumSessionStatusFieldRefInput<$PrismaModel>
    in?: $Enums.SessionStatus[] | ListEnumSessionStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.SessionStatus[] | ListEnumSessionStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumSessionStatusWithAggregatesFilter<$PrismaModel> | $Enums.SessionStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumSessionStatusFilter<$PrismaModel>
    _max?: NestedEnumSessionStatusFilter<$PrismaModel>
  }

  export type NestedEnumTokenPurposeFilter<$PrismaModel = never> = {
    equals?: $Enums.TokenPurpose | EnumTokenPurposeFieldRefInput<$PrismaModel>
    in?: $Enums.TokenPurpose[] | ListEnumTokenPurposeFieldRefInput<$PrismaModel>
    notIn?: $Enums.TokenPurpose[] | ListEnumTokenPurposeFieldRefInput<$PrismaModel>
    not?: NestedEnumTokenPurposeFilter<$PrismaModel> | $Enums.TokenPurpose
  }

  export type NestedEnumTokenPurposeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TokenPurpose | EnumTokenPurposeFieldRefInput<$PrismaModel>
    in?: $Enums.TokenPurpose[] | ListEnumTokenPurposeFieldRefInput<$PrismaModel>
    notIn?: $Enums.TokenPurpose[] | ListEnumTokenPurposeFieldRefInput<$PrismaModel>
    not?: NestedEnumTokenPurposeWithAggregatesFilter<$PrismaModel> | $Enums.TokenPurpose
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTokenPurposeFilter<$PrismaModel>
    _max?: NestedEnumTokenPurposeFilter<$PrismaModel>
  }

  export type NestedEnumAuthChallengePurposeFilter<$PrismaModel = never> = {
    equals?: $Enums.AuthChallengePurpose | EnumAuthChallengePurposeFieldRefInput<$PrismaModel>
    in?: $Enums.AuthChallengePurpose[] | ListEnumAuthChallengePurposeFieldRefInput<$PrismaModel>
    notIn?: $Enums.AuthChallengePurpose[] | ListEnumAuthChallengePurposeFieldRefInput<$PrismaModel>
    not?: NestedEnumAuthChallengePurposeFilter<$PrismaModel> | $Enums.AuthChallengePurpose
  }

  export type NestedEnumAuthChallengePurposeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AuthChallengePurpose | EnumAuthChallengePurposeFieldRefInput<$PrismaModel>
    in?: $Enums.AuthChallengePurpose[] | ListEnumAuthChallengePurposeFieldRefInput<$PrismaModel>
    notIn?: $Enums.AuthChallengePurpose[] | ListEnumAuthChallengePurposeFieldRefInput<$PrismaModel>
    not?: NestedEnumAuthChallengePurposeWithAggregatesFilter<$PrismaModel> | $Enums.AuthChallengePurpose
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumAuthChallengePurposeFilter<$PrismaModel>
    _max?: NestedEnumAuthChallengePurposeFilter<$PrismaModel>
  }

  export type NestedEnumAuditActionFilter<$PrismaModel = never> = {
    equals?: $Enums.AuditAction | EnumAuditActionFieldRefInput<$PrismaModel>
    in?: $Enums.AuditAction[] | ListEnumAuditActionFieldRefInput<$PrismaModel>
    notIn?: $Enums.AuditAction[] | ListEnumAuditActionFieldRefInput<$PrismaModel>
    not?: NestedEnumAuditActionFilter<$PrismaModel> | $Enums.AuditAction
  }

  export type NestedEnumAuditActionWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AuditAction | EnumAuditActionFieldRefInput<$PrismaModel>
    in?: $Enums.AuditAction[] | ListEnumAuditActionFieldRefInput<$PrismaModel>
    notIn?: $Enums.AuditAction[] | ListEnumAuditActionFieldRefInput<$PrismaModel>
    not?: NestedEnumAuditActionWithAggregatesFilter<$PrismaModel> | $Enums.AuditAction
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumAuditActionFilter<$PrismaModel>
    _max?: NestedEnumAuditActionFilter<$PrismaModel>
  }
  export type NestedJsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type AuthAccountCreateWithoutRoleInput = {
    id?: string
    email: string
    normalizedEmail: string
    passwordHash?: string | null
    forcePasswordChange?: boolean
    provider?: $Enums.AuthProvider
    status?: $Enums.AuthStatus
    isEmailVerified?: boolean
    lastLoginAt?: Date | string | null
    passwordChangedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    oauthAccounts?: OAuthProviderAccountCreateNestedManyWithoutAuthAccountInput
    sessions?: AuthSessionCreateNestedManyWithoutAuthAccountInput
    tokens?: AuthTokenCreateNestedManyWithoutAuthAccountInput
    accountRoles?: AuthAccountRoleCreateNestedManyWithoutAuthAccountInput
    grantedRoles?: AuthAccountRoleCreateNestedManyWithoutAssignedByAuthAccountInput
    challenges?: AuthChallengeCreateNestedManyWithoutAuthAccountInput
  }

  export type AuthAccountUncheckedCreateWithoutRoleInput = {
    id?: string
    email: string
    normalizedEmail: string
    passwordHash?: string | null
    forcePasswordChange?: boolean
    provider?: $Enums.AuthProvider
    status?: $Enums.AuthStatus
    isEmailVerified?: boolean
    lastLoginAt?: Date | string | null
    passwordChangedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    oauthAccounts?: OAuthProviderAccountUncheckedCreateNestedManyWithoutAuthAccountInput
    sessions?: AuthSessionUncheckedCreateNestedManyWithoutAuthAccountInput
    tokens?: AuthTokenUncheckedCreateNestedManyWithoutAuthAccountInput
    accountRoles?: AuthAccountRoleUncheckedCreateNestedManyWithoutAuthAccountInput
    grantedRoles?: AuthAccountRoleUncheckedCreateNestedManyWithoutAssignedByAuthAccountInput
    challenges?: AuthChallengeUncheckedCreateNestedManyWithoutAuthAccountInput
  }

  export type AuthAccountCreateOrConnectWithoutRoleInput = {
    where: AuthAccountWhereUniqueInput
    create: XOR<AuthAccountCreateWithoutRoleInput, AuthAccountUncheckedCreateWithoutRoleInput>
  }

  export type AuthAccountCreateManyRoleInputEnvelope = {
    data: AuthAccountCreateManyRoleInput | AuthAccountCreateManyRoleInput[]
    skipDuplicates?: boolean
  }

  export type AuthAccountRoleCreateWithoutRoleInput = {
    id?: string
    assignedAt?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
    authAccount: AuthAccountCreateNestedOneWithoutAccountRolesInput
    assignedByAuthAccount?: AuthAccountCreateNestedOneWithoutGrantedRolesInput
  }

  export type AuthAccountRoleUncheckedCreateWithoutRoleInput = {
    id?: string
    authAccountId: string
    assignedByAuthAccountId?: string | null
    assignedAt?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AuthAccountRoleCreateOrConnectWithoutRoleInput = {
    where: AuthAccountRoleWhereUniqueInput
    create: XOR<AuthAccountRoleCreateWithoutRoleInput, AuthAccountRoleUncheckedCreateWithoutRoleInput>
  }

  export type AuthAccountRoleCreateManyRoleInputEnvelope = {
    data: AuthAccountRoleCreateManyRoleInput | AuthAccountRoleCreateManyRoleInput[]
    skipDuplicates?: boolean
  }

  export type AuthAccountUpsertWithWhereUniqueWithoutRoleInput = {
    where: AuthAccountWhereUniqueInput
    update: XOR<AuthAccountUpdateWithoutRoleInput, AuthAccountUncheckedUpdateWithoutRoleInput>
    create: XOR<AuthAccountCreateWithoutRoleInput, AuthAccountUncheckedCreateWithoutRoleInput>
  }

  export type AuthAccountUpdateWithWhereUniqueWithoutRoleInput = {
    where: AuthAccountWhereUniqueInput
    data: XOR<AuthAccountUpdateWithoutRoleInput, AuthAccountUncheckedUpdateWithoutRoleInput>
  }

  export type AuthAccountUpdateManyWithWhereWithoutRoleInput = {
    where: AuthAccountScalarWhereInput
    data: XOR<AuthAccountUpdateManyMutationInput, AuthAccountUncheckedUpdateManyWithoutRoleInput>
  }

  export type AuthAccountScalarWhereInput = {
    AND?: AuthAccountScalarWhereInput | AuthAccountScalarWhereInput[]
    OR?: AuthAccountScalarWhereInput[]
    NOT?: AuthAccountScalarWhereInput | AuthAccountScalarWhereInput[]
    id?: StringFilter<"AuthAccount"> | string
    email?: StringFilter<"AuthAccount"> | string
    normalizedEmail?: StringFilter<"AuthAccount"> | string
    passwordHash?: StringNullableFilter<"AuthAccount"> | string | null
    forcePasswordChange?: BoolFilter<"AuthAccount"> | boolean
    roleId?: IntFilter<"AuthAccount"> | number
    provider?: EnumAuthProviderFilter<"AuthAccount"> | $Enums.AuthProvider
    status?: EnumAuthStatusFilter<"AuthAccount"> | $Enums.AuthStatus
    isEmailVerified?: BoolFilter<"AuthAccount"> | boolean
    lastLoginAt?: DateTimeNullableFilter<"AuthAccount"> | Date | string | null
    passwordChangedAt?: DateTimeNullableFilter<"AuthAccount"> | Date | string | null
    createdAt?: DateTimeFilter<"AuthAccount"> | Date | string
    updatedAt?: DateTimeFilter<"AuthAccount"> | Date | string
  }

  export type AuthAccountRoleUpsertWithWhereUniqueWithoutRoleInput = {
    where: AuthAccountRoleWhereUniqueInput
    update: XOR<AuthAccountRoleUpdateWithoutRoleInput, AuthAccountRoleUncheckedUpdateWithoutRoleInput>
    create: XOR<AuthAccountRoleCreateWithoutRoleInput, AuthAccountRoleUncheckedCreateWithoutRoleInput>
  }

  export type AuthAccountRoleUpdateWithWhereUniqueWithoutRoleInput = {
    where: AuthAccountRoleWhereUniqueInput
    data: XOR<AuthAccountRoleUpdateWithoutRoleInput, AuthAccountRoleUncheckedUpdateWithoutRoleInput>
  }

  export type AuthAccountRoleUpdateManyWithWhereWithoutRoleInput = {
    where: AuthAccountRoleScalarWhereInput
    data: XOR<AuthAccountRoleUpdateManyMutationInput, AuthAccountRoleUncheckedUpdateManyWithoutRoleInput>
  }

  export type AuthAccountRoleScalarWhereInput = {
    AND?: AuthAccountRoleScalarWhereInput | AuthAccountRoleScalarWhereInput[]
    OR?: AuthAccountRoleScalarWhereInput[]
    NOT?: AuthAccountRoleScalarWhereInput | AuthAccountRoleScalarWhereInput[]
    id?: StringFilter<"AuthAccountRole"> | string
    authAccountId?: StringFilter<"AuthAccountRole"> | string
    roleId?: IntFilter<"AuthAccountRole"> | number
    assignedByAuthAccountId?: StringNullableFilter<"AuthAccountRole"> | string | null
    assignedAt?: DateTimeFilter<"AuthAccountRole"> | Date | string
    createdAt?: DateTimeFilter<"AuthAccountRole"> | Date | string
    updatedAt?: DateTimeFilter<"AuthAccountRole"> | Date | string
  }

  export type RoleCreateWithoutAccountsInput = {
    name: string
    description?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    accountRoles?: AuthAccountRoleCreateNestedManyWithoutRoleInput
  }

  export type RoleUncheckedCreateWithoutAccountsInput = {
    id?: number
    name: string
    description?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    accountRoles?: AuthAccountRoleUncheckedCreateNestedManyWithoutRoleInput
  }

  export type RoleCreateOrConnectWithoutAccountsInput = {
    where: RoleWhereUniqueInput
    create: XOR<RoleCreateWithoutAccountsInput, RoleUncheckedCreateWithoutAccountsInput>
  }

  export type OAuthProviderAccountCreateWithoutAuthAccountInput = {
    id?: string
    provider: $Enums.AuthProvider
    providerUserId: string
    providerEmail?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type OAuthProviderAccountUncheckedCreateWithoutAuthAccountInput = {
    id?: string
    provider: $Enums.AuthProvider
    providerUserId: string
    providerEmail?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type OAuthProviderAccountCreateOrConnectWithoutAuthAccountInput = {
    where: OAuthProviderAccountWhereUniqueInput
    create: XOR<OAuthProviderAccountCreateWithoutAuthAccountInput, OAuthProviderAccountUncheckedCreateWithoutAuthAccountInput>
  }

  export type OAuthProviderAccountCreateManyAuthAccountInputEnvelope = {
    data: OAuthProviderAccountCreateManyAuthAccountInput | OAuthProviderAccountCreateManyAuthAccountInput[]
    skipDuplicates?: boolean
  }

  export type AuthSessionCreateWithoutAuthAccountInput = {
    id?: string
    refreshTokenHash: string
    userAgent?: string | null
    ipAddress?: string | null
    expiresAt: Date | string
    status?: $Enums.SessionStatus
    revokedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AuthSessionUncheckedCreateWithoutAuthAccountInput = {
    id?: string
    refreshTokenHash: string
    userAgent?: string | null
    ipAddress?: string | null
    expiresAt: Date | string
    status?: $Enums.SessionStatus
    revokedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AuthSessionCreateOrConnectWithoutAuthAccountInput = {
    where: AuthSessionWhereUniqueInput
    create: XOR<AuthSessionCreateWithoutAuthAccountInput, AuthSessionUncheckedCreateWithoutAuthAccountInput>
  }

  export type AuthSessionCreateManyAuthAccountInputEnvelope = {
    data: AuthSessionCreateManyAuthAccountInput | AuthSessionCreateManyAuthAccountInput[]
    skipDuplicates?: boolean
  }

  export type AuthTokenCreateWithoutAuthAccountInput = {
    id?: string
    purpose: $Enums.TokenPurpose
    tokenHash: string
    expiresAt: Date | string
    consumedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type AuthTokenUncheckedCreateWithoutAuthAccountInput = {
    id?: string
    purpose: $Enums.TokenPurpose
    tokenHash: string
    expiresAt: Date | string
    consumedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type AuthTokenCreateOrConnectWithoutAuthAccountInput = {
    where: AuthTokenWhereUniqueInput
    create: XOR<AuthTokenCreateWithoutAuthAccountInput, AuthTokenUncheckedCreateWithoutAuthAccountInput>
  }

  export type AuthTokenCreateManyAuthAccountInputEnvelope = {
    data: AuthTokenCreateManyAuthAccountInput | AuthTokenCreateManyAuthAccountInput[]
    skipDuplicates?: boolean
  }

  export type AuthAccountRoleCreateWithoutAuthAccountInput = {
    id?: string
    assignedAt?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
    role: RoleCreateNestedOneWithoutAccountRolesInput
    assignedByAuthAccount?: AuthAccountCreateNestedOneWithoutGrantedRolesInput
  }

  export type AuthAccountRoleUncheckedCreateWithoutAuthAccountInput = {
    id?: string
    roleId: number
    assignedByAuthAccountId?: string | null
    assignedAt?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AuthAccountRoleCreateOrConnectWithoutAuthAccountInput = {
    where: AuthAccountRoleWhereUniqueInput
    create: XOR<AuthAccountRoleCreateWithoutAuthAccountInput, AuthAccountRoleUncheckedCreateWithoutAuthAccountInput>
  }

  export type AuthAccountRoleCreateManyAuthAccountInputEnvelope = {
    data: AuthAccountRoleCreateManyAuthAccountInput | AuthAccountRoleCreateManyAuthAccountInput[]
    skipDuplicates?: boolean
  }

  export type AuthAccountRoleCreateWithoutAssignedByAuthAccountInput = {
    id?: string
    assignedAt?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
    authAccount: AuthAccountCreateNestedOneWithoutAccountRolesInput
    role: RoleCreateNestedOneWithoutAccountRolesInput
  }

  export type AuthAccountRoleUncheckedCreateWithoutAssignedByAuthAccountInput = {
    id?: string
    authAccountId: string
    roleId: number
    assignedAt?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AuthAccountRoleCreateOrConnectWithoutAssignedByAuthAccountInput = {
    where: AuthAccountRoleWhereUniqueInput
    create: XOR<AuthAccountRoleCreateWithoutAssignedByAuthAccountInput, AuthAccountRoleUncheckedCreateWithoutAssignedByAuthAccountInput>
  }

  export type AuthAccountRoleCreateManyAssignedByAuthAccountInputEnvelope = {
    data: AuthAccountRoleCreateManyAssignedByAuthAccountInput | AuthAccountRoleCreateManyAssignedByAuthAccountInput[]
    skipDuplicates?: boolean
  }

  export type AuthChallengeCreateWithoutAuthAccountInput = {
    id?: string
    email: string
    normalizedEmail: string
    purpose: $Enums.AuthChallengePurpose
    requestedRole?: string | null
    fullName?: string | null
    passwordHash?: string | null
    codeHash: string
    expiresAt: Date | string
    consumedAt?: Date | string | null
    attemptCount?: number
    resendCount?: number
    lastSentAt?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AuthChallengeUncheckedCreateWithoutAuthAccountInput = {
    id?: string
    email: string
    normalizedEmail: string
    purpose: $Enums.AuthChallengePurpose
    requestedRole?: string | null
    fullName?: string | null
    passwordHash?: string | null
    codeHash: string
    expiresAt: Date | string
    consumedAt?: Date | string | null
    attemptCount?: number
    resendCount?: number
    lastSentAt?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AuthChallengeCreateOrConnectWithoutAuthAccountInput = {
    where: AuthChallengeWhereUniqueInput
    create: XOR<AuthChallengeCreateWithoutAuthAccountInput, AuthChallengeUncheckedCreateWithoutAuthAccountInput>
  }

  export type AuthChallengeCreateManyAuthAccountInputEnvelope = {
    data: AuthChallengeCreateManyAuthAccountInput | AuthChallengeCreateManyAuthAccountInput[]
    skipDuplicates?: boolean
  }

  export type RoleUpsertWithoutAccountsInput = {
    update: XOR<RoleUpdateWithoutAccountsInput, RoleUncheckedUpdateWithoutAccountsInput>
    create: XOR<RoleCreateWithoutAccountsInput, RoleUncheckedCreateWithoutAccountsInput>
    where?: RoleWhereInput
  }

  export type RoleUpdateToOneWithWhereWithoutAccountsInput = {
    where?: RoleWhereInput
    data: XOR<RoleUpdateWithoutAccountsInput, RoleUncheckedUpdateWithoutAccountsInput>
  }

  export type RoleUpdateWithoutAccountsInput = {
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    accountRoles?: AuthAccountRoleUpdateManyWithoutRoleNestedInput
  }

  export type RoleUncheckedUpdateWithoutAccountsInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    accountRoles?: AuthAccountRoleUncheckedUpdateManyWithoutRoleNestedInput
  }

  export type OAuthProviderAccountUpsertWithWhereUniqueWithoutAuthAccountInput = {
    where: OAuthProviderAccountWhereUniqueInput
    update: XOR<OAuthProviderAccountUpdateWithoutAuthAccountInput, OAuthProviderAccountUncheckedUpdateWithoutAuthAccountInput>
    create: XOR<OAuthProviderAccountCreateWithoutAuthAccountInput, OAuthProviderAccountUncheckedCreateWithoutAuthAccountInput>
  }

  export type OAuthProviderAccountUpdateWithWhereUniqueWithoutAuthAccountInput = {
    where: OAuthProviderAccountWhereUniqueInput
    data: XOR<OAuthProviderAccountUpdateWithoutAuthAccountInput, OAuthProviderAccountUncheckedUpdateWithoutAuthAccountInput>
  }

  export type OAuthProviderAccountUpdateManyWithWhereWithoutAuthAccountInput = {
    where: OAuthProviderAccountScalarWhereInput
    data: XOR<OAuthProviderAccountUpdateManyMutationInput, OAuthProviderAccountUncheckedUpdateManyWithoutAuthAccountInput>
  }

  export type OAuthProviderAccountScalarWhereInput = {
    AND?: OAuthProviderAccountScalarWhereInput | OAuthProviderAccountScalarWhereInput[]
    OR?: OAuthProviderAccountScalarWhereInput[]
    NOT?: OAuthProviderAccountScalarWhereInput | OAuthProviderAccountScalarWhereInput[]
    id?: StringFilter<"OAuthProviderAccount"> | string
    authAccountId?: StringFilter<"OAuthProviderAccount"> | string
    provider?: EnumAuthProviderFilter<"OAuthProviderAccount"> | $Enums.AuthProvider
    providerUserId?: StringFilter<"OAuthProviderAccount"> | string
    providerEmail?: StringNullableFilter<"OAuthProviderAccount"> | string | null
    createdAt?: DateTimeFilter<"OAuthProviderAccount"> | Date | string
    updatedAt?: DateTimeFilter<"OAuthProviderAccount"> | Date | string
  }

  export type AuthSessionUpsertWithWhereUniqueWithoutAuthAccountInput = {
    where: AuthSessionWhereUniqueInput
    update: XOR<AuthSessionUpdateWithoutAuthAccountInput, AuthSessionUncheckedUpdateWithoutAuthAccountInput>
    create: XOR<AuthSessionCreateWithoutAuthAccountInput, AuthSessionUncheckedCreateWithoutAuthAccountInput>
  }

  export type AuthSessionUpdateWithWhereUniqueWithoutAuthAccountInput = {
    where: AuthSessionWhereUniqueInput
    data: XOR<AuthSessionUpdateWithoutAuthAccountInput, AuthSessionUncheckedUpdateWithoutAuthAccountInput>
  }

  export type AuthSessionUpdateManyWithWhereWithoutAuthAccountInput = {
    where: AuthSessionScalarWhereInput
    data: XOR<AuthSessionUpdateManyMutationInput, AuthSessionUncheckedUpdateManyWithoutAuthAccountInput>
  }

  export type AuthSessionScalarWhereInput = {
    AND?: AuthSessionScalarWhereInput | AuthSessionScalarWhereInput[]
    OR?: AuthSessionScalarWhereInput[]
    NOT?: AuthSessionScalarWhereInput | AuthSessionScalarWhereInput[]
    id?: StringFilter<"AuthSession"> | string
    authAccountId?: StringFilter<"AuthSession"> | string
    refreshTokenHash?: StringFilter<"AuthSession"> | string
    userAgent?: StringNullableFilter<"AuthSession"> | string | null
    ipAddress?: StringNullableFilter<"AuthSession"> | string | null
    expiresAt?: DateTimeFilter<"AuthSession"> | Date | string
    status?: EnumSessionStatusFilter<"AuthSession"> | $Enums.SessionStatus
    revokedAt?: DateTimeNullableFilter<"AuthSession"> | Date | string | null
    createdAt?: DateTimeFilter<"AuthSession"> | Date | string
    updatedAt?: DateTimeFilter<"AuthSession"> | Date | string
  }

  export type AuthTokenUpsertWithWhereUniqueWithoutAuthAccountInput = {
    where: AuthTokenWhereUniqueInput
    update: XOR<AuthTokenUpdateWithoutAuthAccountInput, AuthTokenUncheckedUpdateWithoutAuthAccountInput>
    create: XOR<AuthTokenCreateWithoutAuthAccountInput, AuthTokenUncheckedCreateWithoutAuthAccountInput>
  }

  export type AuthTokenUpdateWithWhereUniqueWithoutAuthAccountInput = {
    where: AuthTokenWhereUniqueInput
    data: XOR<AuthTokenUpdateWithoutAuthAccountInput, AuthTokenUncheckedUpdateWithoutAuthAccountInput>
  }

  export type AuthTokenUpdateManyWithWhereWithoutAuthAccountInput = {
    where: AuthTokenScalarWhereInput
    data: XOR<AuthTokenUpdateManyMutationInput, AuthTokenUncheckedUpdateManyWithoutAuthAccountInput>
  }

  export type AuthTokenScalarWhereInput = {
    AND?: AuthTokenScalarWhereInput | AuthTokenScalarWhereInput[]
    OR?: AuthTokenScalarWhereInput[]
    NOT?: AuthTokenScalarWhereInput | AuthTokenScalarWhereInput[]
    id?: StringFilter<"AuthToken"> | string
    authAccountId?: StringFilter<"AuthToken"> | string
    purpose?: EnumTokenPurposeFilter<"AuthToken"> | $Enums.TokenPurpose
    tokenHash?: StringFilter<"AuthToken"> | string
    expiresAt?: DateTimeFilter<"AuthToken"> | Date | string
    consumedAt?: DateTimeNullableFilter<"AuthToken"> | Date | string | null
    createdAt?: DateTimeFilter<"AuthToken"> | Date | string
  }

  export type AuthAccountRoleUpsertWithWhereUniqueWithoutAuthAccountInput = {
    where: AuthAccountRoleWhereUniqueInput
    update: XOR<AuthAccountRoleUpdateWithoutAuthAccountInput, AuthAccountRoleUncheckedUpdateWithoutAuthAccountInput>
    create: XOR<AuthAccountRoleCreateWithoutAuthAccountInput, AuthAccountRoleUncheckedCreateWithoutAuthAccountInput>
  }

  export type AuthAccountRoleUpdateWithWhereUniqueWithoutAuthAccountInput = {
    where: AuthAccountRoleWhereUniqueInput
    data: XOR<AuthAccountRoleUpdateWithoutAuthAccountInput, AuthAccountRoleUncheckedUpdateWithoutAuthAccountInput>
  }

  export type AuthAccountRoleUpdateManyWithWhereWithoutAuthAccountInput = {
    where: AuthAccountRoleScalarWhereInput
    data: XOR<AuthAccountRoleUpdateManyMutationInput, AuthAccountRoleUncheckedUpdateManyWithoutAuthAccountInput>
  }

  export type AuthAccountRoleUpsertWithWhereUniqueWithoutAssignedByAuthAccountInput = {
    where: AuthAccountRoleWhereUniqueInput
    update: XOR<AuthAccountRoleUpdateWithoutAssignedByAuthAccountInput, AuthAccountRoleUncheckedUpdateWithoutAssignedByAuthAccountInput>
    create: XOR<AuthAccountRoleCreateWithoutAssignedByAuthAccountInput, AuthAccountRoleUncheckedCreateWithoutAssignedByAuthAccountInput>
  }

  export type AuthAccountRoleUpdateWithWhereUniqueWithoutAssignedByAuthAccountInput = {
    where: AuthAccountRoleWhereUniqueInput
    data: XOR<AuthAccountRoleUpdateWithoutAssignedByAuthAccountInput, AuthAccountRoleUncheckedUpdateWithoutAssignedByAuthAccountInput>
  }

  export type AuthAccountRoleUpdateManyWithWhereWithoutAssignedByAuthAccountInput = {
    where: AuthAccountRoleScalarWhereInput
    data: XOR<AuthAccountRoleUpdateManyMutationInput, AuthAccountRoleUncheckedUpdateManyWithoutAssignedByAuthAccountInput>
  }

  export type AuthChallengeUpsertWithWhereUniqueWithoutAuthAccountInput = {
    where: AuthChallengeWhereUniqueInput
    update: XOR<AuthChallengeUpdateWithoutAuthAccountInput, AuthChallengeUncheckedUpdateWithoutAuthAccountInput>
    create: XOR<AuthChallengeCreateWithoutAuthAccountInput, AuthChallengeUncheckedCreateWithoutAuthAccountInput>
  }

  export type AuthChallengeUpdateWithWhereUniqueWithoutAuthAccountInput = {
    where: AuthChallengeWhereUniqueInput
    data: XOR<AuthChallengeUpdateWithoutAuthAccountInput, AuthChallengeUncheckedUpdateWithoutAuthAccountInput>
  }

  export type AuthChallengeUpdateManyWithWhereWithoutAuthAccountInput = {
    where: AuthChallengeScalarWhereInput
    data: XOR<AuthChallengeUpdateManyMutationInput, AuthChallengeUncheckedUpdateManyWithoutAuthAccountInput>
  }

  export type AuthChallengeScalarWhereInput = {
    AND?: AuthChallengeScalarWhereInput | AuthChallengeScalarWhereInput[]
    OR?: AuthChallengeScalarWhereInput[]
    NOT?: AuthChallengeScalarWhereInput | AuthChallengeScalarWhereInput[]
    id?: StringFilter<"AuthChallenge"> | string
    authAccountId?: StringNullableFilter<"AuthChallenge"> | string | null
    email?: StringFilter<"AuthChallenge"> | string
    normalizedEmail?: StringFilter<"AuthChallenge"> | string
    purpose?: EnumAuthChallengePurposeFilter<"AuthChallenge"> | $Enums.AuthChallengePurpose
    requestedRole?: StringNullableFilter<"AuthChallenge"> | string | null
    fullName?: StringNullableFilter<"AuthChallenge"> | string | null
    passwordHash?: StringNullableFilter<"AuthChallenge"> | string | null
    codeHash?: StringFilter<"AuthChallenge"> | string
    expiresAt?: DateTimeFilter<"AuthChallenge"> | Date | string
    consumedAt?: DateTimeNullableFilter<"AuthChallenge"> | Date | string | null
    attemptCount?: IntFilter<"AuthChallenge"> | number
    resendCount?: IntFilter<"AuthChallenge"> | number
    lastSentAt?: DateTimeFilter<"AuthChallenge"> | Date | string
    createdAt?: DateTimeFilter<"AuthChallenge"> | Date | string
    updatedAt?: DateTimeFilter<"AuthChallenge"> | Date | string
  }

  export type AuthAccountCreateWithoutAccountRolesInput = {
    id?: string
    email: string
    normalizedEmail: string
    passwordHash?: string | null
    forcePasswordChange?: boolean
    provider?: $Enums.AuthProvider
    status?: $Enums.AuthStatus
    isEmailVerified?: boolean
    lastLoginAt?: Date | string | null
    passwordChangedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    role: RoleCreateNestedOneWithoutAccountsInput
    oauthAccounts?: OAuthProviderAccountCreateNestedManyWithoutAuthAccountInput
    sessions?: AuthSessionCreateNestedManyWithoutAuthAccountInput
    tokens?: AuthTokenCreateNestedManyWithoutAuthAccountInput
    grantedRoles?: AuthAccountRoleCreateNestedManyWithoutAssignedByAuthAccountInput
    challenges?: AuthChallengeCreateNestedManyWithoutAuthAccountInput
  }

  export type AuthAccountUncheckedCreateWithoutAccountRolesInput = {
    id?: string
    email: string
    normalizedEmail: string
    passwordHash?: string | null
    forcePasswordChange?: boolean
    roleId: number
    provider?: $Enums.AuthProvider
    status?: $Enums.AuthStatus
    isEmailVerified?: boolean
    lastLoginAt?: Date | string | null
    passwordChangedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    oauthAccounts?: OAuthProviderAccountUncheckedCreateNestedManyWithoutAuthAccountInput
    sessions?: AuthSessionUncheckedCreateNestedManyWithoutAuthAccountInput
    tokens?: AuthTokenUncheckedCreateNestedManyWithoutAuthAccountInput
    grantedRoles?: AuthAccountRoleUncheckedCreateNestedManyWithoutAssignedByAuthAccountInput
    challenges?: AuthChallengeUncheckedCreateNestedManyWithoutAuthAccountInput
  }

  export type AuthAccountCreateOrConnectWithoutAccountRolesInput = {
    where: AuthAccountWhereUniqueInput
    create: XOR<AuthAccountCreateWithoutAccountRolesInput, AuthAccountUncheckedCreateWithoutAccountRolesInput>
  }

  export type RoleCreateWithoutAccountRolesInput = {
    name: string
    description?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    accounts?: AuthAccountCreateNestedManyWithoutRoleInput
  }

  export type RoleUncheckedCreateWithoutAccountRolesInput = {
    id?: number
    name: string
    description?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    accounts?: AuthAccountUncheckedCreateNestedManyWithoutRoleInput
  }

  export type RoleCreateOrConnectWithoutAccountRolesInput = {
    where: RoleWhereUniqueInput
    create: XOR<RoleCreateWithoutAccountRolesInput, RoleUncheckedCreateWithoutAccountRolesInput>
  }

  export type AuthAccountCreateWithoutGrantedRolesInput = {
    id?: string
    email: string
    normalizedEmail: string
    passwordHash?: string | null
    forcePasswordChange?: boolean
    provider?: $Enums.AuthProvider
    status?: $Enums.AuthStatus
    isEmailVerified?: boolean
    lastLoginAt?: Date | string | null
    passwordChangedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    role: RoleCreateNestedOneWithoutAccountsInput
    oauthAccounts?: OAuthProviderAccountCreateNestedManyWithoutAuthAccountInput
    sessions?: AuthSessionCreateNestedManyWithoutAuthAccountInput
    tokens?: AuthTokenCreateNestedManyWithoutAuthAccountInput
    accountRoles?: AuthAccountRoleCreateNestedManyWithoutAuthAccountInput
    challenges?: AuthChallengeCreateNestedManyWithoutAuthAccountInput
  }

  export type AuthAccountUncheckedCreateWithoutGrantedRolesInput = {
    id?: string
    email: string
    normalizedEmail: string
    passwordHash?: string | null
    forcePasswordChange?: boolean
    roleId: number
    provider?: $Enums.AuthProvider
    status?: $Enums.AuthStatus
    isEmailVerified?: boolean
    lastLoginAt?: Date | string | null
    passwordChangedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    oauthAccounts?: OAuthProviderAccountUncheckedCreateNestedManyWithoutAuthAccountInput
    sessions?: AuthSessionUncheckedCreateNestedManyWithoutAuthAccountInput
    tokens?: AuthTokenUncheckedCreateNestedManyWithoutAuthAccountInput
    accountRoles?: AuthAccountRoleUncheckedCreateNestedManyWithoutAuthAccountInput
    challenges?: AuthChallengeUncheckedCreateNestedManyWithoutAuthAccountInput
  }

  export type AuthAccountCreateOrConnectWithoutGrantedRolesInput = {
    where: AuthAccountWhereUniqueInput
    create: XOR<AuthAccountCreateWithoutGrantedRolesInput, AuthAccountUncheckedCreateWithoutGrantedRolesInput>
  }

  export type AuthAccountUpsertWithoutAccountRolesInput = {
    update: XOR<AuthAccountUpdateWithoutAccountRolesInput, AuthAccountUncheckedUpdateWithoutAccountRolesInput>
    create: XOR<AuthAccountCreateWithoutAccountRolesInput, AuthAccountUncheckedCreateWithoutAccountRolesInput>
    where?: AuthAccountWhereInput
  }

  export type AuthAccountUpdateToOneWithWhereWithoutAccountRolesInput = {
    where?: AuthAccountWhereInput
    data: XOR<AuthAccountUpdateWithoutAccountRolesInput, AuthAccountUncheckedUpdateWithoutAccountRolesInput>
  }

  export type AuthAccountUpdateWithoutAccountRolesInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    normalizedEmail?: StringFieldUpdateOperationsInput | string
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    forcePasswordChange?: BoolFieldUpdateOperationsInput | boolean
    provider?: EnumAuthProviderFieldUpdateOperationsInput | $Enums.AuthProvider
    status?: EnumAuthStatusFieldUpdateOperationsInput | $Enums.AuthStatus
    isEmailVerified?: BoolFieldUpdateOperationsInput | boolean
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    passwordChangedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    role?: RoleUpdateOneRequiredWithoutAccountsNestedInput
    oauthAccounts?: OAuthProviderAccountUpdateManyWithoutAuthAccountNestedInput
    sessions?: AuthSessionUpdateManyWithoutAuthAccountNestedInput
    tokens?: AuthTokenUpdateManyWithoutAuthAccountNestedInput
    grantedRoles?: AuthAccountRoleUpdateManyWithoutAssignedByAuthAccountNestedInput
    challenges?: AuthChallengeUpdateManyWithoutAuthAccountNestedInput
  }

  export type AuthAccountUncheckedUpdateWithoutAccountRolesInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    normalizedEmail?: StringFieldUpdateOperationsInput | string
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    forcePasswordChange?: BoolFieldUpdateOperationsInput | boolean
    roleId?: IntFieldUpdateOperationsInput | number
    provider?: EnumAuthProviderFieldUpdateOperationsInput | $Enums.AuthProvider
    status?: EnumAuthStatusFieldUpdateOperationsInput | $Enums.AuthStatus
    isEmailVerified?: BoolFieldUpdateOperationsInput | boolean
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    passwordChangedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    oauthAccounts?: OAuthProviderAccountUncheckedUpdateManyWithoutAuthAccountNestedInput
    sessions?: AuthSessionUncheckedUpdateManyWithoutAuthAccountNestedInput
    tokens?: AuthTokenUncheckedUpdateManyWithoutAuthAccountNestedInput
    grantedRoles?: AuthAccountRoleUncheckedUpdateManyWithoutAssignedByAuthAccountNestedInput
    challenges?: AuthChallengeUncheckedUpdateManyWithoutAuthAccountNestedInput
  }

  export type RoleUpsertWithoutAccountRolesInput = {
    update: XOR<RoleUpdateWithoutAccountRolesInput, RoleUncheckedUpdateWithoutAccountRolesInput>
    create: XOR<RoleCreateWithoutAccountRolesInput, RoleUncheckedCreateWithoutAccountRolesInput>
    where?: RoleWhereInput
  }

  export type RoleUpdateToOneWithWhereWithoutAccountRolesInput = {
    where?: RoleWhereInput
    data: XOR<RoleUpdateWithoutAccountRolesInput, RoleUncheckedUpdateWithoutAccountRolesInput>
  }

  export type RoleUpdateWithoutAccountRolesInput = {
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    accounts?: AuthAccountUpdateManyWithoutRoleNestedInput
  }

  export type RoleUncheckedUpdateWithoutAccountRolesInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    accounts?: AuthAccountUncheckedUpdateManyWithoutRoleNestedInput
  }

  export type AuthAccountUpsertWithoutGrantedRolesInput = {
    update: XOR<AuthAccountUpdateWithoutGrantedRolesInput, AuthAccountUncheckedUpdateWithoutGrantedRolesInput>
    create: XOR<AuthAccountCreateWithoutGrantedRolesInput, AuthAccountUncheckedCreateWithoutGrantedRolesInput>
    where?: AuthAccountWhereInput
  }

  export type AuthAccountUpdateToOneWithWhereWithoutGrantedRolesInput = {
    where?: AuthAccountWhereInput
    data: XOR<AuthAccountUpdateWithoutGrantedRolesInput, AuthAccountUncheckedUpdateWithoutGrantedRolesInput>
  }

  export type AuthAccountUpdateWithoutGrantedRolesInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    normalizedEmail?: StringFieldUpdateOperationsInput | string
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    forcePasswordChange?: BoolFieldUpdateOperationsInput | boolean
    provider?: EnumAuthProviderFieldUpdateOperationsInput | $Enums.AuthProvider
    status?: EnumAuthStatusFieldUpdateOperationsInput | $Enums.AuthStatus
    isEmailVerified?: BoolFieldUpdateOperationsInput | boolean
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    passwordChangedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    role?: RoleUpdateOneRequiredWithoutAccountsNestedInput
    oauthAccounts?: OAuthProviderAccountUpdateManyWithoutAuthAccountNestedInput
    sessions?: AuthSessionUpdateManyWithoutAuthAccountNestedInput
    tokens?: AuthTokenUpdateManyWithoutAuthAccountNestedInput
    accountRoles?: AuthAccountRoleUpdateManyWithoutAuthAccountNestedInput
    challenges?: AuthChallengeUpdateManyWithoutAuthAccountNestedInput
  }

  export type AuthAccountUncheckedUpdateWithoutGrantedRolesInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    normalizedEmail?: StringFieldUpdateOperationsInput | string
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    forcePasswordChange?: BoolFieldUpdateOperationsInput | boolean
    roleId?: IntFieldUpdateOperationsInput | number
    provider?: EnumAuthProviderFieldUpdateOperationsInput | $Enums.AuthProvider
    status?: EnumAuthStatusFieldUpdateOperationsInput | $Enums.AuthStatus
    isEmailVerified?: BoolFieldUpdateOperationsInput | boolean
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    passwordChangedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    oauthAccounts?: OAuthProviderAccountUncheckedUpdateManyWithoutAuthAccountNestedInput
    sessions?: AuthSessionUncheckedUpdateManyWithoutAuthAccountNestedInput
    tokens?: AuthTokenUncheckedUpdateManyWithoutAuthAccountNestedInput
    accountRoles?: AuthAccountRoleUncheckedUpdateManyWithoutAuthAccountNestedInput
    challenges?: AuthChallengeUncheckedUpdateManyWithoutAuthAccountNestedInput
  }

  export type AuthAccountCreateWithoutOauthAccountsInput = {
    id?: string
    email: string
    normalizedEmail: string
    passwordHash?: string | null
    forcePasswordChange?: boolean
    provider?: $Enums.AuthProvider
    status?: $Enums.AuthStatus
    isEmailVerified?: boolean
    lastLoginAt?: Date | string | null
    passwordChangedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    role: RoleCreateNestedOneWithoutAccountsInput
    sessions?: AuthSessionCreateNestedManyWithoutAuthAccountInput
    tokens?: AuthTokenCreateNestedManyWithoutAuthAccountInput
    accountRoles?: AuthAccountRoleCreateNestedManyWithoutAuthAccountInput
    grantedRoles?: AuthAccountRoleCreateNestedManyWithoutAssignedByAuthAccountInput
    challenges?: AuthChallengeCreateNestedManyWithoutAuthAccountInput
  }

  export type AuthAccountUncheckedCreateWithoutOauthAccountsInput = {
    id?: string
    email: string
    normalizedEmail: string
    passwordHash?: string | null
    forcePasswordChange?: boolean
    roleId: number
    provider?: $Enums.AuthProvider
    status?: $Enums.AuthStatus
    isEmailVerified?: boolean
    lastLoginAt?: Date | string | null
    passwordChangedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    sessions?: AuthSessionUncheckedCreateNestedManyWithoutAuthAccountInput
    tokens?: AuthTokenUncheckedCreateNestedManyWithoutAuthAccountInput
    accountRoles?: AuthAccountRoleUncheckedCreateNestedManyWithoutAuthAccountInput
    grantedRoles?: AuthAccountRoleUncheckedCreateNestedManyWithoutAssignedByAuthAccountInput
    challenges?: AuthChallengeUncheckedCreateNestedManyWithoutAuthAccountInput
  }

  export type AuthAccountCreateOrConnectWithoutOauthAccountsInput = {
    where: AuthAccountWhereUniqueInput
    create: XOR<AuthAccountCreateWithoutOauthAccountsInput, AuthAccountUncheckedCreateWithoutOauthAccountsInput>
  }

  export type AuthAccountUpsertWithoutOauthAccountsInput = {
    update: XOR<AuthAccountUpdateWithoutOauthAccountsInput, AuthAccountUncheckedUpdateWithoutOauthAccountsInput>
    create: XOR<AuthAccountCreateWithoutOauthAccountsInput, AuthAccountUncheckedCreateWithoutOauthAccountsInput>
    where?: AuthAccountWhereInput
  }

  export type AuthAccountUpdateToOneWithWhereWithoutOauthAccountsInput = {
    where?: AuthAccountWhereInput
    data: XOR<AuthAccountUpdateWithoutOauthAccountsInput, AuthAccountUncheckedUpdateWithoutOauthAccountsInput>
  }

  export type AuthAccountUpdateWithoutOauthAccountsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    normalizedEmail?: StringFieldUpdateOperationsInput | string
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    forcePasswordChange?: BoolFieldUpdateOperationsInput | boolean
    provider?: EnumAuthProviderFieldUpdateOperationsInput | $Enums.AuthProvider
    status?: EnumAuthStatusFieldUpdateOperationsInput | $Enums.AuthStatus
    isEmailVerified?: BoolFieldUpdateOperationsInput | boolean
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    passwordChangedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    role?: RoleUpdateOneRequiredWithoutAccountsNestedInput
    sessions?: AuthSessionUpdateManyWithoutAuthAccountNestedInput
    tokens?: AuthTokenUpdateManyWithoutAuthAccountNestedInput
    accountRoles?: AuthAccountRoleUpdateManyWithoutAuthAccountNestedInput
    grantedRoles?: AuthAccountRoleUpdateManyWithoutAssignedByAuthAccountNestedInput
    challenges?: AuthChallengeUpdateManyWithoutAuthAccountNestedInput
  }

  export type AuthAccountUncheckedUpdateWithoutOauthAccountsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    normalizedEmail?: StringFieldUpdateOperationsInput | string
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    forcePasswordChange?: BoolFieldUpdateOperationsInput | boolean
    roleId?: IntFieldUpdateOperationsInput | number
    provider?: EnumAuthProviderFieldUpdateOperationsInput | $Enums.AuthProvider
    status?: EnumAuthStatusFieldUpdateOperationsInput | $Enums.AuthStatus
    isEmailVerified?: BoolFieldUpdateOperationsInput | boolean
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    passwordChangedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessions?: AuthSessionUncheckedUpdateManyWithoutAuthAccountNestedInput
    tokens?: AuthTokenUncheckedUpdateManyWithoutAuthAccountNestedInput
    accountRoles?: AuthAccountRoleUncheckedUpdateManyWithoutAuthAccountNestedInput
    grantedRoles?: AuthAccountRoleUncheckedUpdateManyWithoutAssignedByAuthAccountNestedInput
    challenges?: AuthChallengeUncheckedUpdateManyWithoutAuthAccountNestedInput
  }

  export type AuthAccountCreateWithoutSessionsInput = {
    id?: string
    email: string
    normalizedEmail: string
    passwordHash?: string | null
    forcePasswordChange?: boolean
    provider?: $Enums.AuthProvider
    status?: $Enums.AuthStatus
    isEmailVerified?: boolean
    lastLoginAt?: Date | string | null
    passwordChangedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    role: RoleCreateNestedOneWithoutAccountsInput
    oauthAccounts?: OAuthProviderAccountCreateNestedManyWithoutAuthAccountInput
    tokens?: AuthTokenCreateNestedManyWithoutAuthAccountInput
    accountRoles?: AuthAccountRoleCreateNestedManyWithoutAuthAccountInput
    grantedRoles?: AuthAccountRoleCreateNestedManyWithoutAssignedByAuthAccountInput
    challenges?: AuthChallengeCreateNestedManyWithoutAuthAccountInput
  }

  export type AuthAccountUncheckedCreateWithoutSessionsInput = {
    id?: string
    email: string
    normalizedEmail: string
    passwordHash?: string | null
    forcePasswordChange?: boolean
    roleId: number
    provider?: $Enums.AuthProvider
    status?: $Enums.AuthStatus
    isEmailVerified?: boolean
    lastLoginAt?: Date | string | null
    passwordChangedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    oauthAccounts?: OAuthProviderAccountUncheckedCreateNestedManyWithoutAuthAccountInput
    tokens?: AuthTokenUncheckedCreateNestedManyWithoutAuthAccountInput
    accountRoles?: AuthAccountRoleUncheckedCreateNestedManyWithoutAuthAccountInput
    grantedRoles?: AuthAccountRoleUncheckedCreateNestedManyWithoutAssignedByAuthAccountInput
    challenges?: AuthChallengeUncheckedCreateNestedManyWithoutAuthAccountInput
  }

  export type AuthAccountCreateOrConnectWithoutSessionsInput = {
    where: AuthAccountWhereUniqueInput
    create: XOR<AuthAccountCreateWithoutSessionsInput, AuthAccountUncheckedCreateWithoutSessionsInput>
  }

  export type AuthAccountUpsertWithoutSessionsInput = {
    update: XOR<AuthAccountUpdateWithoutSessionsInput, AuthAccountUncheckedUpdateWithoutSessionsInput>
    create: XOR<AuthAccountCreateWithoutSessionsInput, AuthAccountUncheckedCreateWithoutSessionsInput>
    where?: AuthAccountWhereInput
  }

  export type AuthAccountUpdateToOneWithWhereWithoutSessionsInput = {
    where?: AuthAccountWhereInput
    data: XOR<AuthAccountUpdateWithoutSessionsInput, AuthAccountUncheckedUpdateWithoutSessionsInput>
  }

  export type AuthAccountUpdateWithoutSessionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    normalizedEmail?: StringFieldUpdateOperationsInput | string
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    forcePasswordChange?: BoolFieldUpdateOperationsInput | boolean
    provider?: EnumAuthProviderFieldUpdateOperationsInput | $Enums.AuthProvider
    status?: EnumAuthStatusFieldUpdateOperationsInput | $Enums.AuthStatus
    isEmailVerified?: BoolFieldUpdateOperationsInput | boolean
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    passwordChangedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    role?: RoleUpdateOneRequiredWithoutAccountsNestedInput
    oauthAccounts?: OAuthProviderAccountUpdateManyWithoutAuthAccountNestedInput
    tokens?: AuthTokenUpdateManyWithoutAuthAccountNestedInput
    accountRoles?: AuthAccountRoleUpdateManyWithoutAuthAccountNestedInput
    grantedRoles?: AuthAccountRoleUpdateManyWithoutAssignedByAuthAccountNestedInput
    challenges?: AuthChallengeUpdateManyWithoutAuthAccountNestedInput
  }

  export type AuthAccountUncheckedUpdateWithoutSessionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    normalizedEmail?: StringFieldUpdateOperationsInput | string
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    forcePasswordChange?: BoolFieldUpdateOperationsInput | boolean
    roleId?: IntFieldUpdateOperationsInput | number
    provider?: EnumAuthProviderFieldUpdateOperationsInput | $Enums.AuthProvider
    status?: EnumAuthStatusFieldUpdateOperationsInput | $Enums.AuthStatus
    isEmailVerified?: BoolFieldUpdateOperationsInput | boolean
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    passwordChangedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    oauthAccounts?: OAuthProviderAccountUncheckedUpdateManyWithoutAuthAccountNestedInput
    tokens?: AuthTokenUncheckedUpdateManyWithoutAuthAccountNestedInput
    accountRoles?: AuthAccountRoleUncheckedUpdateManyWithoutAuthAccountNestedInput
    grantedRoles?: AuthAccountRoleUncheckedUpdateManyWithoutAssignedByAuthAccountNestedInput
    challenges?: AuthChallengeUncheckedUpdateManyWithoutAuthAccountNestedInput
  }

  export type AuthAccountCreateWithoutTokensInput = {
    id?: string
    email: string
    normalizedEmail: string
    passwordHash?: string | null
    forcePasswordChange?: boolean
    provider?: $Enums.AuthProvider
    status?: $Enums.AuthStatus
    isEmailVerified?: boolean
    lastLoginAt?: Date | string | null
    passwordChangedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    role: RoleCreateNestedOneWithoutAccountsInput
    oauthAccounts?: OAuthProviderAccountCreateNestedManyWithoutAuthAccountInput
    sessions?: AuthSessionCreateNestedManyWithoutAuthAccountInput
    accountRoles?: AuthAccountRoleCreateNestedManyWithoutAuthAccountInput
    grantedRoles?: AuthAccountRoleCreateNestedManyWithoutAssignedByAuthAccountInput
    challenges?: AuthChallengeCreateNestedManyWithoutAuthAccountInput
  }

  export type AuthAccountUncheckedCreateWithoutTokensInput = {
    id?: string
    email: string
    normalizedEmail: string
    passwordHash?: string | null
    forcePasswordChange?: boolean
    roleId: number
    provider?: $Enums.AuthProvider
    status?: $Enums.AuthStatus
    isEmailVerified?: boolean
    lastLoginAt?: Date | string | null
    passwordChangedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    oauthAccounts?: OAuthProviderAccountUncheckedCreateNestedManyWithoutAuthAccountInput
    sessions?: AuthSessionUncheckedCreateNestedManyWithoutAuthAccountInput
    accountRoles?: AuthAccountRoleUncheckedCreateNestedManyWithoutAuthAccountInput
    grantedRoles?: AuthAccountRoleUncheckedCreateNestedManyWithoutAssignedByAuthAccountInput
    challenges?: AuthChallengeUncheckedCreateNestedManyWithoutAuthAccountInput
  }

  export type AuthAccountCreateOrConnectWithoutTokensInput = {
    where: AuthAccountWhereUniqueInput
    create: XOR<AuthAccountCreateWithoutTokensInput, AuthAccountUncheckedCreateWithoutTokensInput>
  }

  export type AuthAccountUpsertWithoutTokensInput = {
    update: XOR<AuthAccountUpdateWithoutTokensInput, AuthAccountUncheckedUpdateWithoutTokensInput>
    create: XOR<AuthAccountCreateWithoutTokensInput, AuthAccountUncheckedCreateWithoutTokensInput>
    where?: AuthAccountWhereInput
  }

  export type AuthAccountUpdateToOneWithWhereWithoutTokensInput = {
    where?: AuthAccountWhereInput
    data: XOR<AuthAccountUpdateWithoutTokensInput, AuthAccountUncheckedUpdateWithoutTokensInput>
  }

  export type AuthAccountUpdateWithoutTokensInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    normalizedEmail?: StringFieldUpdateOperationsInput | string
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    forcePasswordChange?: BoolFieldUpdateOperationsInput | boolean
    provider?: EnumAuthProviderFieldUpdateOperationsInput | $Enums.AuthProvider
    status?: EnumAuthStatusFieldUpdateOperationsInput | $Enums.AuthStatus
    isEmailVerified?: BoolFieldUpdateOperationsInput | boolean
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    passwordChangedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    role?: RoleUpdateOneRequiredWithoutAccountsNestedInput
    oauthAccounts?: OAuthProviderAccountUpdateManyWithoutAuthAccountNestedInput
    sessions?: AuthSessionUpdateManyWithoutAuthAccountNestedInput
    accountRoles?: AuthAccountRoleUpdateManyWithoutAuthAccountNestedInput
    grantedRoles?: AuthAccountRoleUpdateManyWithoutAssignedByAuthAccountNestedInput
    challenges?: AuthChallengeUpdateManyWithoutAuthAccountNestedInput
  }

  export type AuthAccountUncheckedUpdateWithoutTokensInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    normalizedEmail?: StringFieldUpdateOperationsInput | string
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    forcePasswordChange?: BoolFieldUpdateOperationsInput | boolean
    roleId?: IntFieldUpdateOperationsInput | number
    provider?: EnumAuthProviderFieldUpdateOperationsInput | $Enums.AuthProvider
    status?: EnumAuthStatusFieldUpdateOperationsInput | $Enums.AuthStatus
    isEmailVerified?: BoolFieldUpdateOperationsInput | boolean
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    passwordChangedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    oauthAccounts?: OAuthProviderAccountUncheckedUpdateManyWithoutAuthAccountNestedInput
    sessions?: AuthSessionUncheckedUpdateManyWithoutAuthAccountNestedInput
    accountRoles?: AuthAccountRoleUncheckedUpdateManyWithoutAuthAccountNestedInput
    grantedRoles?: AuthAccountRoleUncheckedUpdateManyWithoutAssignedByAuthAccountNestedInput
    challenges?: AuthChallengeUncheckedUpdateManyWithoutAuthAccountNestedInput
  }

  export type AuthAccountCreateWithoutChallengesInput = {
    id?: string
    email: string
    normalizedEmail: string
    passwordHash?: string | null
    forcePasswordChange?: boolean
    provider?: $Enums.AuthProvider
    status?: $Enums.AuthStatus
    isEmailVerified?: boolean
    lastLoginAt?: Date | string | null
    passwordChangedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    role: RoleCreateNestedOneWithoutAccountsInput
    oauthAccounts?: OAuthProviderAccountCreateNestedManyWithoutAuthAccountInput
    sessions?: AuthSessionCreateNestedManyWithoutAuthAccountInput
    tokens?: AuthTokenCreateNestedManyWithoutAuthAccountInput
    accountRoles?: AuthAccountRoleCreateNestedManyWithoutAuthAccountInput
    grantedRoles?: AuthAccountRoleCreateNestedManyWithoutAssignedByAuthAccountInput
  }

  export type AuthAccountUncheckedCreateWithoutChallengesInput = {
    id?: string
    email: string
    normalizedEmail: string
    passwordHash?: string | null
    forcePasswordChange?: boolean
    roleId: number
    provider?: $Enums.AuthProvider
    status?: $Enums.AuthStatus
    isEmailVerified?: boolean
    lastLoginAt?: Date | string | null
    passwordChangedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    oauthAccounts?: OAuthProviderAccountUncheckedCreateNestedManyWithoutAuthAccountInput
    sessions?: AuthSessionUncheckedCreateNestedManyWithoutAuthAccountInput
    tokens?: AuthTokenUncheckedCreateNestedManyWithoutAuthAccountInput
    accountRoles?: AuthAccountRoleUncheckedCreateNestedManyWithoutAuthAccountInput
    grantedRoles?: AuthAccountRoleUncheckedCreateNestedManyWithoutAssignedByAuthAccountInput
  }

  export type AuthAccountCreateOrConnectWithoutChallengesInput = {
    where: AuthAccountWhereUniqueInput
    create: XOR<AuthAccountCreateWithoutChallengesInput, AuthAccountUncheckedCreateWithoutChallengesInput>
  }

  export type AuthAccountUpsertWithoutChallengesInput = {
    update: XOR<AuthAccountUpdateWithoutChallengesInput, AuthAccountUncheckedUpdateWithoutChallengesInput>
    create: XOR<AuthAccountCreateWithoutChallengesInput, AuthAccountUncheckedCreateWithoutChallengesInput>
    where?: AuthAccountWhereInput
  }

  export type AuthAccountUpdateToOneWithWhereWithoutChallengesInput = {
    where?: AuthAccountWhereInput
    data: XOR<AuthAccountUpdateWithoutChallengesInput, AuthAccountUncheckedUpdateWithoutChallengesInput>
  }

  export type AuthAccountUpdateWithoutChallengesInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    normalizedEmail?: StringFieldUpdateOperationsInput | string
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    forcePasswordChange?: BoolFieldUpdateOperationsInput | boolean
    provider?: EnumAuthProviderFieldUpdateOperationsInput | $Enums.AuthProvider
    status?: EnumAuthStatusFieldUpdateOperationsInput | $Enums.AuthStatus
    isEmailVerified?: BoolFieldUpdateOperationsInput | boolean
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    passwordChangedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    role?: RoleUpdateOneRequiredWithoutAccountsNestedInput
    oauthAccounts?: OAuthProviderAccountUpdateManyWithoutAuthAccountNestedInput
    sessions?: AuthSessionUpdateManyWithoutAuthAccountNestedInput
    tokens?: AuthTokenUpdateManyWithoutAuthAccountNestedInput
    accountRoles?: AuthAccountRoleUpdateManyWithoutAuthAccountNestedInput
    grantedRoles?: AuthAccountRoleUpdateManyWithoutAssignedByAuthAccountNestedInput
  }

  export type AuthAccountUncheckedUpdateWithoutChallengesInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    normalizedEmail?: StringFieldUpdateOperationsInput | string
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    forcePasswordChange?: BoolFieldUpdateOperationsInput | boolean
    roleId?: IntFieldUpdateOperationsInput | number
    provider?: EnumAuthProviderFieldUpdateOperationsInput | $Enums.AuthProvider
    status?: EnumAuthStatusFieldUpdateOperationsInput | $Enums.AuthStatus
    isEmailVerified?: BoolFieldUpdateOperationsInput | boolean
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    passwordChangedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    oauthAccounts?: OAuthProviderAccountUncheckedUpdateManyWithoutAuthAccountNestedInput
    sessions?: AuthSessionUncheckedUpdateManyWithoutAuthAccountNestedInput
    tokens?: AuthTokenUncheckedUpdateManyWithoutAuthAccountNestedInput
    accountRoles?: AuthAccountRoleUncheckedUpdateManyWithoutAuthAccountNestedInput
    grantedRoles?: AuthAccountRoleUncheckedUpdateManyWithoutAssignedByAuthAccountNestedInput
  }

  export type AuthAccountCreateManyRoleInput = {
    id?: string
    email: string
    normalizedEmail: string
    passwordHash?: string | null
    forcePasswordChange?: boolean
    provider?: $Enums.AuthProvider
    status?: $Enums.AuthStatus
    isEmailVerified?: boolean
    lastLoginAt?: Date | string | null
    passwordChangedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AuthAccountRoleCreateManyRoleInput = {
    id?: string
    authAccountId: string
    assignedByAuthAccountId?: string | null
    assignedAt?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AuthAccountUpdateWithoutRoleInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    normalizedEmail?: StringFieldUpdateOperationsInput | string
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    forcePasswordChange?: BoolFieldUpdateOperationsInput | boolean
    provider?: EnumAuthProviderFieldUpdateOperationsInput | $Enums.AuthProvider
    status?: EnumAuthStatusFieldUpdateOperationsInput | $Enums.AuthStatus
    isEmailVerified?: BoolFieldUpdateOperationsInput | boolean
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    passwordChangedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    oauthAccounts?: OAuthProviderAccountUpdateManyWithoutAuthAccountNestedInput
    sessions?: AuthSessionUpdateManyWithoutAuthAccountNestedInput
    tokens?: AuthTokenUpdateManyWithoutAuthAccountNestedInput
    accountRoles?: AuthAccountRoleUpdateManyWithoutAuthAccountNestedInput
    grantedRoles?: AuthAccountRoleUpdateManyWithoutAssignedByAuthAccountNestedInput
    challenges?: AuthChallengeUpdateManyWithoutAuthAccountNestedInput
  }

  export type AuthAccountUncheckedUpdateWithoutRoleInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    normalizedEmail?: StringFieldUpdateOperationsInput | string
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    forcePasswordChange?: BoolFieldUpdateOperationsInput | boolean
    provider?: EnumAuthProviderFieldUpdateOperationsInput | $Enums.AuthProvider
    status?: EnumAuthStatusFieldUpdateOperationsInput | $Enums.AuthStatus
    isEmailVerified?: BoolFieldUpdateOperationsInput | boolean
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    passwordChangedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    oauthAccounts?: OAuthProviderAccountUncheckedUpdateManyWithoutAuthAccountNestedInput
    sessions?: AuthSessionUncheckedUpdateManyWithoutAuthAccountNestedInput
    tokens?: AuthTokenUncheckedUpdateManyWithoutAuthAccountNestedInput
    accountRoles?: AuthAccountRoleUncheckedUpdateManyWithoutAuthAccountNestedInput
    grantedRoles?: AuthAccountRoleUncheckedUpdateManyWithoutAssignedByAuthAccountNestedInput
    challenges?: AuthChallengeUncheckedUpdateManyWithoutAuthAccountNestedInput
  }

  export type AuthAccountUncheckedUpdateManyWithoutRoleInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    normalizedEmail?: StringFieldUpdateOperationsInput | string
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    forcePasswordChange?: BoolFieldUpdateOperationsInput | boolean
    provider?: EnumAuthProviderFieldUpdateOperationsInput | $Enums.AuthProvider
    status?: EnumAuthStatusFieldUpdateOperationsInput | $Enums.AuthStatus
    isEmailVerified?: BoolFieldUpdateOperationsInput | boolean
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    passwordChangedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuthAccountRoleUpdateWithoutRoleInput = {
    id?: StringFieldUpdateOperationsInput | string
    assignedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    authAccount?: AuthAccountUpdateOneRequiredWithoutAccountRolesNestedInput
    assignedByAuthAccount?: AuthAccountUpdateOneWithoutGrantedRolesNestedInput
  }

  export type AuthAccountRoleUncheckedUpdateWithoutRoleInput = {
    id?: StringFieldUpdateOperationsInput | string
    authAccountId?: StringFieldUpdateOperationsInput | string
    assignedByAuthAccountId?: NullableStringFieldUpdateOperationsInput | string | null
    assignedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuthAccountRoleUncheckedUpdateManyWithoutRoleInput = {
    id?: StringFieldUpdateOperationsInput | string
    authAccountId?: StringFieldUpdateOperationsInput | string
    assignedByAuthAccountId?: NullableStringFieldUpdateOperationsInput | string | null
    assignedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OAuthProviderAccountCreateManyAuthAccountInput = {
    id?: string
    provider: $Enums.AuthProvider
    providerUserId: string
    providerEmail?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AuthSessionCreateManyAuthAccountInput = {
    id?: string
    refreshTokenHash: string
    userAgent?: string | null
    ipAddress?: string | null
    expiresAt: Date | string
    status?: $Enums.SessionStatus
    revokedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AuthTokenCreateManyAuthAccountInput = {
    id?: string
    purpose: $Enums.TokenPurpose
    tokenHash: string
    expiresAt: Date | string
    consumedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type AuthAccountRoleCreateManyAuthAccountInput = {
    id?: string
    roleId: number
    assignedByAuthAccountId?: string | null
    assignedAt?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AuthAccountRoleCreateManyAssignedByAuthAccountInput = {
    id?: string
    authAccountId: string
    roleId: number
    assignedAt?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AuthChallengeCreateManyAuthAccountInput = {
    id?: string
    email: string
    normalizedEmail: string
    purpose: $Enums.AuthChallengePurpose
    requestedRole?: string | null
    fullName?: string | null
    passwordHash?: string | null
    codeHash: string
    expiresAt: Date | string
    consumedAt?: Date | string | null
    attemptCount?: number
    resendCount?: number
    lastSentAt?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type OAuthProviderAccountUpdateWithoutAuthAccountInput = {
    id?: StringFieldUpdateOperationsInput | string
    provider?: EnumAuthProviderFieldUpdateOperationsInput | $Enums.AuthProvider
    providerUserId?: StringFieldUpdateOperationsInput | string
    providerEmail?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OAuthProviderAccountUncheckedUpdateWithoutAuthAccountInput = {
    id?: StringFieldUpdateOperationsInput | string
    provider?: EnumAuthProviderFieldUpdateOperationsInput | $Enums.AuthProvider
    providerUserId?: StringFieldUpdateOperationsInput | string
    providerEmail?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OAuthProviderAccountUncheckedUpdateManyWithoutAuthAccountInput = {
    id?: StringFieldUpdateOperationsInput | string
    provider?: EnumAuthProviderFieldUpdateOperationsInput | $Enums.AuthProvider
    providerUserId?: StringFieldUpdateOperationsInput | string
    providerEmail?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuthSessionUpdateWithoutAuthAccountInput = {
    id?: StringFieldUpdateOperationsInput | string
    refreshTokenHash?: StringFieldUpdateOperationsInput | string
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumSessionStatusFieldUpdateOperationsInput | $Enums.SessionStatus
    revokedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuthSessionUncheckedUpdateWithoutAuthAccountInput = {
    id?: StringFieldUpdateOperationsInput | string
    refreshTokenHash?: StringFieldUpdateOperationsInput | string
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumSessionStatusFieldUpdateOperationsInput | $Enums.SessionStatus
    revokedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuthSessionUncheckedUpdateManyWithoutAuthAccountInput = {
    id?: StringFieldUpdateOperationsInput | string
    refreshTokenHash?: StringFieldUpdateOperationsInput | string
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumSessionStatusFieldUpdateOperationsInput | $Enums.SessionStatus
    revokedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuthTokenUpdateWithoutAuthAccountInput = {
    id?: StringFieldUpdateOperationsInput | string
    purpose?: EnumTokenPurposeFieldUpdateOperationsInput | $Enums.TokenPurpose
    tokenHash?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    consumedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuthTokenUncheckedUpdateWithoutAuthAccountInput = {
    id?: StringFieldUpdateOperationsInput | string
    purpose?: EnumTokenPurposeFieldUpdateOperationsInput | $Enums.TokenPurpose
    tokenHash?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    consumedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuthTokenUncheckedUpdateManyWithoutAuthAccountInput = {
    id?: StringFieldUpdateOperationsInput | string
    purpose?: EnumTokenPurposeFieldUpdateOperationsInput | $Enums.TokenPurpose
    tokenHash?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    consumedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuthAccountRoleUpdateWithoutAuthAccountInput = {
    id?: StringFieldUpdateOperationsInput | string
    assignedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    role?: RoleUpdateOneRequiredWithoutAccountRolesNestedInput
    assignedByAuthAccount?: AuthAccountUpdateOneWithoutGrantedRolesNestedInput
  }

  export type AuthAccountRoleUncheckedUpdateWithoutAuthAccountInput = {
    id?: StringFieldUpdateOperationsInput | string
    roleId?: IntFieldUpdateOperationsInput | number
    assignedByAuthAccountId?: NullableStringFieldUpdateOperationsInput | string | null
    assignedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuthAccountRoleUncheckedUpdateManyWithoutAuthAccountInput = {
    id?: StringFieldUpdateOperationsInput | string
    roleId?: IntFieldUpdateOperationsInput | number
    assignedByAuthAccountId?: NullableStringFieldUpdateOperationsInput | string | null
    assignedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuthAccountRoleUpdateWithoutAssignedByAuthAccountInput = {
    id?: StringFieldUpdateOperationsInput | string
    assignedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    authAccount?: AuthAccountUpdateOneRequiredWithoutAccountRolesNestedInput
    role?: RoleUpdateOneRequiredWithoutAccountRolesNestedInput
  }

  export type AuthAccountRoleUncheckedUpdateWithoutAssignedByAuthAccountInput = {
    id?: StringFieldUpdateOperationsInput | string
    authAccountId?: StringFieldUpdateOperationsInput | string
    roleId?: IntFieldUpdateOperationsInput | number
    assignedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuthAccountRoleUncheckedUpdateManyWithoutAssignedByAuthAccountInput = {
    id?: StringFieldUpdateOperationsInput | string
    authAccountId?: StringFieldUpdateOperationsInput | string
    roleId?: IntFieldUpdateOperationsInput | number
    assignedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuthChallengeUpdateWithoutAuthAccountInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    normalizedEmail?: StringFieldUpdateOperationsInput | string
    purpose?: EnumAuthChallengePurposeFieldUpdateOperationsInput | $Enums.AuthChallengePurpose
    requestedRole?: NullableStringFieldUpdateOperationsInput | string | null
    fullName?: NullableStringFieldUpdateOperationsInput | string | null
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    codeHash?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    consumedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    attemptCount?: IntFieldUpdateOperationsInput | number
    resendCount?: IntFieldUpdateOperationsInput | number
    lastSentAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuthChallengeUncheckedUpdateWithoutAuthAccountInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    normalizedEmail?: StringFieldUpdateOperationsInput | string
    purpose?: EnumAuthChallengePurposeFieldUpdateOperationsInput | $Enums.AuthChallengePurpose
    requestedRole?: NullableStringFieldUpdateOperationsInput | string | null
    fullName?: NullableStringFieldUpdateOperationsInput | string | null
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    codeHash?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    consumedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    attemptCount?: IntFieldUpdateOperationsInput | number
    resendCount?: IntFieldUpdateOperationsInput | number
    lastSentAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuthChallengeUncheckedUpdateManyWithoutAuthAccountInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    normalizedEmail?: StringFieldUpdateOperationsInput | string
    purpose?: EnumAuthChallengePurposeFieldUpdateOperationsInput | $Enums.AuthChallengePurpose
    requestedRole?: NullableStringFieldUpdateOperationsInput | string | null
    fullName?: NullableStringFieldUpdateOperationsInput | string | null
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    codeHash?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    consumedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    attemptCount?: IntFieldUpdateOperationsInput | number
    resendCount?: IntFieldUpdateOperationsInput | number
    lastSentAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}