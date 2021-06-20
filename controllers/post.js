const express = require('express')
const Post = require('../models/post');

/**
 * return all the posts in the database
 * 
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @param {express.NextFunction} next 
 */
exports.getAllPosts = async (req, res, next) => {
  try {
    const posts = await Post.find().exec();

    res.status(200).json({
      status: 'success',
      results: posts.length,
      data: {
        posts
      }
    });
  } catch (error) {
    res.status(400).json({ status: 'failed' });
  }
};

/**
 * returns one Post by its id
 * 
 * @param {express.Request<{postId: string}>} req 
 * @param {express.Response} res 
 * @param {express.NextFunction} next 
 */
exports.getPost = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const post = await Post.findById(postId).exec();

    res.status(200).json({
      status: 'success',
      data: {
        post
      }
    });
  } catch (error) {
    res.status(400).json({ status: 'failed' });
  }
};

/**
 * create a new Post using the data in the body
 * 
 * @param {express.Request<any, any, {title: string, body: string}>} req 
 * @param {express.Response} res 
 * @param {express.NextFunction} next 
 */
exports.createPost = async (req, res, next) => {
  try {
    const post = await Post.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        post
      }
    });
  } catch (error) {
    res.status(400).json({ status: 'failed' });
  }
};

/**
 * update an existing Post by its id using the data in the body
 * 
 * @param {express.Request<{postId: string}, any, {title: string, body: string}>} req 
 * @param {express.Response} res 
 * @param {express.NextFunction} next 
 */
exports.updatePost = async (req, res, next) => {
  try {
    const { postId } = req.params;

    const post = await Post.findByIdAndUpdate(postId, req.body, {
      new: true, // flag to return the modified value
      runValidators: true, // flag to run validators even on update, not only on creation
      useFindAndModify: false
    }).exec();

    res.status(200).json({
      status: 'success',
      data: {
        post
      }
    });
  } catch (error) {
    res.status(400).json({ status: 'failed' });
  }
};

/**
 * delete a Post from the database by its id
 * 
 * @param {express.Request<{postId: string}>} req 
 * @param {express.Response} res 
 * @param {express.NextFunction} next 
 */
exports.deletePost = async (req, res, next) => {
  try {
    const { postId } = req.params;

    await Post.findByIdAndDelete(postId).exec();

    res.status(200).json({ status: 'success' });
  } catch (error) {
    res.status(400).json({ status: 'failed' });
  }
};
