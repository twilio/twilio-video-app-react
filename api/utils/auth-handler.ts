import { RequestHandler } from 'express';

const authMiddleware: RequestHandler = async (req, res, next) => {
  next();
};

export default module.exports = authMiddleware;
