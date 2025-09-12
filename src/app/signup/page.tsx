'use client';

import { useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { Loader2, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const signupSchema = z.object({
  firstName: z
    .string()
    .min(1, 'First name is required')
    .max(255, 'First name is too long'),
  lastName: z
    .string()
    .min(1, 'Last name is required')
    .max(255, 'Last name is too long'),
  email: z.string().email('Please enter a valid email address'),
  company: z.string().optional(),
  plan: z.enum(['basic', 'standard', 'professional', 'enterprise']),
});

type SignupFormData = z.infer<typeof signupSchema>;

const Signup = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Get plan from URL parameter or default to 'standard'
  const planParam = searchParams.get('plan');
  const initialPlan =
    planParam &&
      ['basic', 'standard', 'professional', 'enterprise'].includes(planParam)
      ? (planParam as 'basic' | 'standard' | 'professional' | 'enterprise')
      : 'standard';

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      plan: initialPlan,
    },
  });

  const selectedPlan = watch('plan');

  const onSubmit = async (data: SignupFormData) => {
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const response = await axios.post('/api/signup', data);

      if (response.data.success) {
        setSuccessMessage(
          response.data.message || 'Account created successfully!',
        );
      }
    } catch (error: unknown) {
      const axiosError = error as { response?: { data?: { error?: string } } };
      const message =
        axiosError.response?.data?.error ||
        'Failed to create account. Please try again.';
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="bg-sand-100 py-16 md:py-28 lg:py-32">
      <div className="container">
        <div className="flex flex-col gap-4">
          <Card className="mx-auto w-full max-w-lg">
            <CardHeader className="flex flex-col items-center space-y-0">
              <Image
                src="/images/logos/logo.png"
                alt="Siinc logo"
                width={120}
                height={40}
                className="mb-7 object-contain"
              />
            </CardHeader>
            <CardContent>
              {successMessage ? (
                <div className="text-center">
                  <div className="mb-6 flex justify-center">
                    <CheckCircle2 className="h-16 w-16 text-green-500" />
                  </div>
                  <h2 className="mb-2 text-2xl font-semibold">Welcome to Siinc!</h2>
                  <p className="text-muted-foreground mb-6">
                    Your account has been created successfully. You can now log in to start protecting your Autodesk Construction Cloud data.
                  </p>
                  <Button asChild className="w-full">
                    <a href="https://app.siinc.io">
                      Go to Login
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </div>
              ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      type="text"
                      placeholder="First name"
                      {...register('firstName')}
                      disabled={isLoading}
                    />
                    {errors.firstName && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.firstName.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      type="text"
                      placeholder="Last name"
                      {...register('lastName')}
                      disabled={isLoading}
                    />
                    {errors.lastName && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.lastName.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    {...register('email')}
                    disabled={isLoading}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="company">Company (Optional)</Label>
                  <Input
                    id="company"
                    type="text"
                    placeholder="Enter your company name"
                    {...register('company')}
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <Label htmlFor="plan">Select Plan</Label>
                  <Select
                    value={selectedPlan || initialPlan}
                    onValueChange={(value) => {
                      setValue(
                        'plan',
                        value as
                        | 'basic'
                        | 'standard'
                        | 'professional'
                        | 'enterprise',
                        { shouldValidate: true },
                      );
                    }}
                    disabled={isLoading}
                  >
                    <SelectTrigger id="plan">
                      <SelectValue placeholder="Choose a plan" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="basic">
                        Basic - $1.50/GB/Month
                      </SelectItem>
                      <SelectItem value="standard">
                        Standard - $1.35/GB/Month
                      </SelectItem>
                      <SelectItem value="professional">
                        Professional - $1.10/GB/Month
                      </SelectItem>
                      <SelectItem value="enterprise">
                        Enterprise - Custom Pricing
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.plan && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.plan.message}
                    </p>
                  )}
                </div>

                {errorMessage && (
                  <div className="flex items-center gap-2 rounded-md border border-red-200 bg-red-50 p-3">
                    <AlertCircle className="h-4 w-4 text-red-500" />
                    <p className="text-sm text-red-600">{errorMessage}</p>
                  </div>
                )}

                {successMessage && (
                  <div className="flex items-center gap-2 rounded-md border border-green-200 bg-green-50 p-3">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <p className="text-sm text-green-600">{successMessage}</p>
                  </div>
                )}

                <Button
                  type="submit"
                  className="mt-2 w-full"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    'Create an account'
                  )}
                </Button>
              </form>
              )}

              {!successMessage && (
              <div className="text-muted-foreground mx-auto mt-8 flex justify-center gap-1 text-sm">
                <p>Already have an account?</p>
                <Link
                  href="https://app.siinc.io/"
                  className="text-primary font-medium"
                >
                  Log in
                </Link>
              </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Signup;
