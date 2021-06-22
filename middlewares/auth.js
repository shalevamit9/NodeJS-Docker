const express = require('express');

/**
 * 
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @param {express.NextFunction} next 
 */
const isAuth = (req, res, next) => {
  const { user } = req.session;

  if (!req.session.user) {
    return res.status(401).json({ status: 'failed', message: 'Unauthorized' });
  }

  req.user = user;

  next();
};

module.exports = isAuth;
