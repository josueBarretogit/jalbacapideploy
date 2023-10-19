
declare global {
  namespace Express {
    interface Request {
      userId?: string,
      correo?: string,

    }
  }
}

export { }
