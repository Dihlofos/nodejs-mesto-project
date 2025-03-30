export const DEFAULT_PORT = 3000;
export const DEFAULT_BASE_PATH = 'http://localhost';
export const DEFAULT_MONGO_DB_PATH = 'mongodb://0.0.0.0:27017';
export const DEFAULT_MONGO_DB_NAME = 'mestodb';

export enum STATUS_CODES {
  OK = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  INTERNAL_SERVER_ERROR = 500,
}
