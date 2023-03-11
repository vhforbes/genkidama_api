declare namespace Express {
  export interface Request {
    user: {
      id: string;
      name: string;
    };
  }
  export interface Response {
    paginatedResults: {};
  }
}
