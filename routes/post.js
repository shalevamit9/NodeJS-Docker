const express = require('express');

const postController = require('../controllers/post');
const isAuth = require('../middlewares/auth');

const router = express.Router();

router.get('/', isAuth, postController.getAllPosts);

router.get('/:postId', isAuth, postController.getPost);

router.post('/', isAuth, postController.createPost);

router.patch('/:postId', isAuth, postController.updatePost);

router.delete('/:postId', isAuth, postController.deletePost);

module.exports = router;
