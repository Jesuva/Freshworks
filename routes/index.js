const express = require('express');
const router = express.Router();

const crdController = require('../controllers/crdController');

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });
router.get('/',crdController.index);

router.post('/add',crdController.addData);

router.get('/read/:id',crdController.readData);

router.delete('/delete/:id',crdController.deleteData);

module.exports = router;
