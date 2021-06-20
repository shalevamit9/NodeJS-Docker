const express = require('express');

const postController = require('../controllers/post');

const router = express.Router();

router.get('/', postController.getAllPosts);

router.get('/:postId', postController.getPost);

router.post('/', postController.createPost);

router.patch('/:postId', postController.updatePost);

router.delete('/:postId', postController.deletePost);

module.exports = router;
