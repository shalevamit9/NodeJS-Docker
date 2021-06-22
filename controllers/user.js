const express = require('express');
const bcrypt = require('bcrypt');

const User = require('../models/user');

/**
 * 
 * @param {express.Request<any, any, {username: string, password: string}} req 
 * @param {express.Response} res 
 * @param {express.NextFunction} next 
 */
exports.signup = async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = await User.create({ username, password: hashedPassword });
    req.session.user = newUser;

    res.status(201).json({
      status: 'success',
      data: {
        newUser
      }
    });
  } catch (error) {
    res.status(400).json({ status: 'failed' });
  }
};

/**
 * 
 * @param {express.Request<any, any, {username: string, password: string}} req 
 * @param {express.Response} res 
 * @param {express.NextFunction} next 
 */
exports.login = async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username }).exec();
    if (!user) throw new Error('No User with such username');

    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) throw new Error('Wrong Credentials');

    req.session.user = user;

    res.status(200).json({ status: 'success' });
  } catch (error) {
    console.error(error);
    res.status(400).json({ status: 'failed' });
  }
};
