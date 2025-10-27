// React import not required with new JSX transform
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from '../components/common/LoadingSpinner';

// Validation schema for signup
const SignupSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords don\'t match',
  path: ['confirmPassword'],
});

const SignupPage = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(SignupSchema),
    defaultValues: { firstName: '', lastName: '', email: '', password: '', confirmPassword: '' },
  });

  const onSubmit = async (data) => {
    try {
      const result = await registerUser({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
      });

      if (result.success) {
        navigate('/dashboard');
      } else {
        // Use window alert for now; AuthContext also exposes error state
        alert(result.error || 'Registration failed. Please try again.');
      }
    } catch (err) {
      alert(err.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-lg shadow">
          <div className="mb-6">
            <Link to="/" className="text-indigo-600 text-xl font-bold">SkillWise</Link>
            <h2 className="mt-2 text-2xl font-extrabold text-gray-900">Create your account</h2>
            <p className="mt-1 text-sm text-gray-600">Start your personalized learning journey today</p>
          </div>

          {isSubmitting ? (
            <LoadingSpinner message="Creating your account..." />
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">First name</label>
                  <input {...register('firstName')} className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm px-3 py-2 ${errors.firstName ? 'border-red-500' : ''}`} />
                  {errors.firstName && <p className="text-sm text-red-500 mt-1">{errors.firstName.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Last name</label>
                  <input {...register('lastName')} className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm px-3 py-2 ${errors.lastName ? 'border-red-500' : ''}`} />
                  {errors.lastName && <p className="text-sm text-red-500 mt-1">{errors.lastName.message}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Email address</label>
                <input {...register('email')} type="email" className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm px-3 py-2 ${errors.email ? 'border-red-500' : ''}`} />
                {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <input {...register('password')} type="password" className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm px-3 py-2 ${errors.password ? 'border-red-500' : ''}`} />
                {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>}
                <p className="text-xs text-gray-500 mt-1">Must be at least 8 characters</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Confirm password</label>
                <input {...register('confirmPassword')} type="password" className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm px-3 py-2 ${errors.confirmPassword ? 'border-red-500' : ''}`} />
                {errors.confirmPassword && <p className="text-sm text-red-500 mt-1">{errors.confirmPassword.message}</p>}
              </div>

              <button type="submit" className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50">
                {isSubmitting ? 'Creating account...' : 'Create account'}
              </button>
            </form>
          )}

          <div className="mt-4 text-sm text-gray-600">
            Already have an account? <Link to="/login" className="text-indigo-600 font-medium">Sign in</Link>
          </div>
        </div>

        <div className="hidden md:flex flex-col justify-center p-8 bg-indigo-50 rounded-lg">
          <h3 className="text-xl font-semibold mb-4">What you'll get</h3>
          <ul className="space-y-2 text-gray-700">
            <li>✅ Personalized learning paths</li>
            <li>✅ AI-powered feedback</li>
            <li>✅ Progress tracking</li>
            <li>✅ Peer learning community</li>
            <li>✅ Achievement system</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
