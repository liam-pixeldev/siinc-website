'use client';

import { useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle2, Loader2, AlertCircle, Download } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

// Validation schema
const eventRegistrationSchema = z.object({
  event: z.string().min(1, 'Please select an event'),
  name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
  email: z.string().email('Please enter a valid email address'),
  cellPhone: z
    .string()
    .min(1, 'Cell phone is required')
    .regex(
      /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/,
      'Please enter a valid phone number',
    ),
  company: z.string().max(100, 'Company name is too long').optional(),
  jobTitle: z.string().max(100, 'Job title is too long').optional(),
  dietaryRequirements: z
    .string()
    .max(500, 'Dietary requirements are too long')
    .optional(),
});

type EventRegistrationFormData = z.infer<typeof eventRegistrationSchema>;

export default function EventRegistration() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<string>('');
  const [isDownloading, setIsDownloading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    trigger,
  } = useForm<EventRegistrationFormData>({
    resolver: zodResolver(eventRegistrationSchema),
  });

  // Handle manual download
  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      // Fetch the PDF file
      const response = await fetch('/SIINC Datasheet -  ACC.pdf');
      const blob = await response.blob();

      // Create a blob URL
      const blobUrl = window.URL.createObjectURL(blob);

      // Create a temporary link element
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = 'SIINC Datasheet - ACC.pdf';
      link.style.display = 'none';

      // Append to body, click, and remove
      document.body.appendChild(link);
      link.click();

      // Clean up
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
        setIsDownloading(false);
      }, 100);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Download failed:', error);
      setIsDownloading(false);
    }
  };

  const onSubmit = async (data: EventRegistrationFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/event-registration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error || 'Registration failed. Please try again.',
        );
      }

      setIsSuccess(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'An unexpected error occurred. Please try again.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Success screen
  if (isSuccess) {
    return (
      <section className="bg-sand-100 py-16 md:py-28 lg:py-32">
        <div className="container">
          <Card className="mx-auto max-w-lg">
            <CardContent className="pt-12 pb-12">
              <div className="text-center">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                  <CheckCircle2 className="h-10 w-10 text-green-600" />
                </div>
                <h1 className="mb-3 text-3xl font-semibold tracking-tight">
                  Registration Confirmed!
                </h1>
                <p className="text-muted-foreground mb-6">
                  Thank you for registering. The Siinc events team will be in
                  touch.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  // Registration form
  return (
    <section className="bg-sand-100 py-16 md:py-28 lg:py-32">
      <div className="container">
        <Card className="mx-auto max-w-lg">
          <CardHeader>
            <CardTitle className="text-3xl font-semibold tracking-tight">
              Event Registration
            </CardTitle>
            <CardDescription className="space-y-3 pt-2">
              <p>
                Discover how Siinc is transforming the way design professionals
                work while you secure your place at the launch event.
              </p>
              <Button
                type="button"
                onClick={handleDownload}
                disabled={isDownloading}
                className="bg-accent hover:bg-accent/90 w-full"
              >
                {isDownloading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Downloading...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    Download Siinc Data Sheet
                  </>
                )}
              </Button>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Event Selection */}
              <div className="space-y-2">
                <Label htmlFor="event">
                  Event <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={selectedEvent}
                  onValueChange={(value) => {
                    setSelectedEvent(value);
                    setValue('event', value);
                    trigger('event');
                  }}
                >
                  <SelectTrigger
                    id="event"
                    className={errors.event ? 'border-red-500' : ''}
                  >
                    <SelectValue placeholder="Select an event" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="New York January 12th">
                      New York January 12th
                    </SelectItem>
                    <SelectItem value="Los Angeles January 15th">
                      Los Angeles January 15th
                    </SelectItem>
                  </SelectContent>
                </Select>
                {errors.event && (
                  <p className="text-sm text-red-500">{errors.event.message}</p>
                )}
              </div>

              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name">
                  Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  {...register('name')}
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">
                  Email Address <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  {...register('email')}
                  className={errors.email ? 'border-red-500' : ''}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>

              {/* Cell Phone */}
              <div className="space-y-2">
                <Label htmlFor="cellPhone">
                  Cell Phone <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="cellPhone"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  {...register('cellPhone')}
                  className={errors.cellPhone ? 'border-red-500' : ''}
                />
                {errors.cellPhone && (
                  <p className="text-sm text-red-500">
                    {errors.cellPhone.message}
                  </p>
                )}
              </div>

              {/* Company */}
              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  type="text"
                  placeholder="Acme Inc."
                  {...register('company')}
                  className={errors.company ? 'border-red-500' : ''}
                />
                {errors.company && (
                  <p className="text-sm text-red-500">
                    {errors.company.message}
                  </p>
                )}
              </div>

              {/* Job Title */}
              <div className="space-y-2">
                <Label htmlFor="jobTitle">Job Title</Label>
                <Input
                  id="jobTitle"
                  type="text"
                  placeholder="Project Manager"
                  {...register('jobTitle')}
                  className={errors.jobTitle ? 'border-red-500' : ''}
                />
                {errors.jobTitle && (
                  <p className="text-sm text-red-500">
                    {errors.jobTitle.message}
                  </p>
                )}
              </div>

              {/* Dietary Requirements */}
              <div className="space-y-2">
                <Label htmlFor="dietaryRequirements">
                  Please list any special dietary requirements
                </Label>
                <Textarea
                  id="dietaryRequirements"
                  placeholder="e.g., Vegetarian, Gluten-free, Allergies..."
                  rows={3}
                  {...register('dietaryRequirements')}
                  className={errors.dietaryRequirements ? 'border-red-500' : ''}
                />
                {errors.dietaryRequirements && (
                  <p className="text-sm text-red-500">
                    {errors.dietaryRequirements.message}
                  </p>
                )}
              </div>

              {/* Error Message */}
              {error && (
                <div className="flex items-start gap-2 rounded-md border border-red-200 bg-red-50 p-4 text-red-800">
                  <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0" />
                  <p className="text-sm">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Registering...
                  </>
                ) : (
                  'Register for Event'
                )}
              </Button>

              <p className="text-muted-foreground text-center text-xs">
                By registering, you agree to receive event-related
                communications.
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
