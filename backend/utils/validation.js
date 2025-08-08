const { body, validationResult } = require('express-validator');

const validateRegistration = [
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('phone').optional().isMobilePhone('en-IN').withMessage('Valid phone number required')
];

const validateLogin = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').notEmpty().withMessage('Password required')
];

const validateProduct = [
  body('name').trim().isLength({ min: 2 }).withMessage('Product name required'),
  body('price').isNumeric().withMessage('Valid price required'),
  body('category').isIn(['medicines', 'jadi-buti', 'oils', 'powders', 'tablets', 'other']).withMessage('Valid category required'),
  body('stock').isNumeric().withMessage('Valid stock number required')
];

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      message: 'Validation failed', 
      errors: errors.array() 
    });
  }
  next();
};

module.exports = {
  validateRegistration,
  validateLogin,
  validateProduct,
  handleValidationErrors
};