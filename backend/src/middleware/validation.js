// Request validation middleware using Zod schemas
const { z } = require('zod');
const { AppError } = require('./errorHandler');

/**
 * Schemas
 */
const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(1, 'Password is required'),
  }),
  query: z.object({}).optional(),
  params: z.object({}).optional(),
});

const registerSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email format'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Password must contain at least one lowercase letter, one uppercase letter, and one number',
      ),
    firstName: z.string().min(1, 'First name is required').max(50, 'First name too long'),
    lastName: z.string().min(1, 'Last name is required').max(50, 'Last name too long'),
    confirmPassword: z.string(),
  }).refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords don\'t match',
    path: ['confirmPassword'],
  }),
  query: z.object({}).optional(),
  params: z.object({}).optional(),
});

const goalSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Goal title is required').max(255, 'Title too long'),
    description: z.string().optional(),
    category: z.string().optional(),
    difficulty: z.enum(['easy', 'medium', 'hard']).default('medium'),
    // Accepts ISO datetime if provided
    targetCompletionDate: z.string().datetime().optional(),
  }),
  query: z.object({}).optional(),
  params: z.object({}).optional(),
});

const challengeSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Challenge title is required').max(255, 'Title too long'),
    description: z.string().min(1, 'Description is required'),
    instructions: z.string().min(1, 'Instructions are required'),
    category: z.string().min(1, 'Category is required'),
    difficulty: z.enum(['easy', 'medium', 'hard']).default('medium'),
    // Coerce numbers so form/query strings like "15" work
    estimatedTimeMinutes: z.coerce.number().int().positive().optional(),
    pointsReward: z.coerce.number().int().positive().default(10),
    maxAttempts: z.coerce.number().int().positive().default(3),
  }),
  query: z.object({}).optional(),
  params: z.object({}).optional(),
});

/**
 * Generic validation middleware factory
 */
const validate = (schema) => {
  return (req, res, next) => {
    try {
      const payload = {
        body: req.body ?? {},
        query: req.query ?? {},
        params: req.params ?? {},
      };

      // (no-op) keep validation silent in normal runs. Use tests/setup or logger for debug when needed.

      const parsed = schema.safeParse(payload);

      if (!parsed.success) {
        const errors = parsed.error.errors.map((e) => ({
          field: e.path.join('.'),
          message: e.message,
        }));

        return next(
          new AppError(
            `Validation error: ${errors.map((e) => e.message).join(', ')}`,
            400,
            'VALIDATION_ERROR',
          ),
        );
      }

      // Attach validated, sanitized data (body/query/params)
      req.validated = parsed.data;
      return next();
    } catch (err) {
      return next(new AppError('Validation error', 400, 'VALIDATION_ERROR'));
    }
  };
};

/**
 * Specific middleware exports
 */
const loginValidation = validate(loginSchema);
const registerValidation = validate(registerSchema);
const goalValidation = validate(goalSchema);
const challengeValidation = validate(challengeSchema);

module.exports = {
  validate,
  loginValidation,
  registerValidation,
  goalValidation,
  challengeValidation,
  schemas: {
    loginSchema,
    registerSchema,
    goalSchema,
    challengeSchema,
  },
};
