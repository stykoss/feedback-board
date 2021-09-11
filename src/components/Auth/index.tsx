import * as React from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Link, useHistory, useRouteMatch } from 'react-router-dom';
import supabase from '../../utils/supabase';
import Spinner from '../primitives/Spinner';
import TextInput from '../primitives/TextInput';

type FormValues = { name: string; email: string; password: string };

export default function Auth() {
  const { location, push } = useHistory();
  let { url } = useRouteMatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const [isSubmitting, setSubmitting] = React.useState(false);

  const isLogin = location.pathname !== '/auth/sign-up';

  async function signIn(values: FormValues) {
    try {
      setSubmitting(true);
      const { error } = await supabase.auth.signIn({
        email: values.email,
        password: values.password,
      });
      if (error) throw new Error(error.message);
      push('/');
    } catch (e: any) {
      setSubmitting(false);
      toast.error(e.message);
    }
  }

  async function signUp(values: FormValues) {
    try {
      setSubmitting(true);
      const { user, error: signUpError } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
      });
      if (signUpError) throw new Error(signUpError.message);
      const { error: createProfileError } = await supabase
        .from('profiles')
        .insert([{ id: user?.id, name: values.name }], { returning: 'minimal' });
      if (createProfileError) {
        await supabase.from('profiles').delete();
        throw new Error(createProfileError.message);
      }
      toast.success('Account created successfully');
      push('/');
    } catch (e: any) {
      setSubmitting(false);
      toast.error(e.message);
    }
  }

  return (
    <div className="page-container flex items-start justify-center">
      <div className="bg-white rounded overflow-hidden mx-6 my-8 w-full max-w-md">
        <div className="px-6 py-8 md:px-8 md:py-10 w-full max-w-md">
          <img
            src={`https://avatars.dicebear.com/api/avataaars/${new Date().toDateString()}.svg`}
            height={80}
            width={80}
            className="mx-auto rounded-full mt-8"
            role="presentation"
          />
          <div
            className={`grid grid-cols-2 before:h-1 before:bg-primary before:w-1/2 pb-5 mt-10 ${
              !isLogin ? 'before:translate-x-full' : ''
            } relative before:absolute before:bottom-0 before:transition-transform -scale-x-90 border-b border-light border-opacity-40`}
          >
            <Link
              to={`${url}/login`}
              className={`w-full text-center ${isLogin ? 'font-bold' : ''}`}
            >
              Login
            </Link>
            <Link
              to={`${url}/sign-up`}
              className={`w-full text-center ${!isLogin ? 'font-bold' : ''}`}
            >
              Sign Up
            </Link>
          </div>
          <form onSubmit={handleSubmit(isLogin ? signIn : signUp)}>
            <div className="space-y-4 mt-10">
              {!isLogin && (
                <TextInput
                  label="Full Name"
                  isInvalid={!!errors.name}
                  validationMessage={errors.name?.message}
                  inputProps={{
                    ...register('name', {
                      required: 'Name is required',
                      min: { value: 2, message: 'Enter at least 2 characters' },
                      maxLength: { value: 100, message: 'Nobody has a name that long' },
                    }),
                    placeholder: 'John Doe',
                  }}
                />
              )}
              <TextInput
                label="Email"
                isInvalid={!!errors.email}
                validationMessage={
                  errors.email?.message || "It doesn't have to be your real email address"
                }
                inputProps={{
                  ...register('email', {
                    required: 'Email is required',
                    pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' },
                  }),
                  type: 'email',
                  placeholder: 'person@example.com',
                }}
              />
              <TextInput
                label="Password"
                isInvalid={!!errors.password}
                validationMessage={errors.password?.message}
                inputProps={{
                  ...register('password', {
                    required: 'Password is required',
                    min: { value: 6, message: 'Password is too short' },
                  }),
                  type: 'password',
                }}
              />
            </div>
            <button className="btn primary w-full h-12 mt-8" type="submit" disabled={isSubmitting}>
              {isSubmitting ? <Spinner className="text-2xl" /> : isLogin ? 'Login' : 'Sign Up'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
