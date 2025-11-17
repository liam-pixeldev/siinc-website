'use client';

import React, { useState } from 'react';

import Link from 'next/link';

import { CheckCircle2, Mail, XCircle } from 'lucide-react';

import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';

const formFields = [
  {
    label: 'Full name',
    name: 'fullName',
    placeholder: 'First and last name',
    type: 'text',
  },
  {
    label: 'Work email address',
    name: 'email',
    placeholder: 'me@company.com',
    type: 'email',
  },
  {
    label: 'Company name',
    name: 'company',
    placeholder: 'Company name',
    type: 'text',
    optional: true,
  },
  {
    label: 'Your message',
    name: 'message',
    placeholder: 'Write your message',
    type: 'textarea',
  },
];

type SubmissionState = 'idle' | 'submitting' | 'success' | 'error';

export default function Contact() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    company: '',
    employees: '',
    message: '',
  });
  const [submissionState, setSubmissionState] =
    useState<SubmissionState>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmissionState('submitting');
    setErrorMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message');
      }

      setSubmissionState('success');
    } catch (error) {
      setSubmissionState('error');
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Something went wrong. Please try again.',
      );
    }
  };

  const resetForm = () => {
    setFormData({
      fullName: '',
      email: '',
      company: '',
      employees: '',
      message: '',
    });
    setSubmissionState('idle');
    setErrorMessage('');
  };

  return (
    <section className="py-16 md:py-28 lg:py-32">
      <div className="container max-w-4xl">
        <h1 className="text-center text-4xl font-semibold tracking-tight sm:text-5xl">
          Contact us
        </h1>
        <p className="text-muted-foreground mt-4 text-center">
          Get in touch with our team to learn how SIINC can protect your ACC
          data.
        </p>

        <div className="mt-8 flex max-md:flex-col md:mt-12 md:divide-x lg:mt-20">
          {/* Contact Information */}
          <div className="space-y-10 md:pe-14">
            <div>
              <h2 className="text-lg font-semibold">Our Offices</h2>
              <div className="mt-3 space-y-6">
                <div>
                  <p className="font-medium">Sydney</p>
                  <p className="text-muted-foreground text-sm">
                    Level 35, Tower One Barangaroo
                    <br />
                    100 Barangaroo Avenue
                    <br />
                    Sydney NSW 2000
                  </p>
                </div>
                <div>
                  <p className="font-medium">New York</p>
                  <p className="text-muted-foreground text-sm">
                    One World Trade Center
                    <br />
                    Lower Manhattan
                    <br />
                    New York 10007
                  </p>
                </div>
                <div>
                  <p className="font-medium">London</p>
                  <p className="text-muted-foreground text-sm">
                    Level 18, 40 Bank Street
                    <br />
                    Canary Wharf
                    <br />
                    London E14 5NR
                  </p>
                </div>
                <div>
                  <p className="font-medium">Singapore</p>
                  <p className="text-muted-foreground text-sm">
                    Level 39, Marina Bay Financial Centre
                    <br />
                    Tower 2, 10 Marina Boulevard
                    <br />
                    Singapore 018983
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold">Email us</h2>
              <Link
                href="mailto:get@siinc.io"
                className="text-muted-foreground hover:text-primary mt-3 inline-flex items-center gap-2 text-lg font-medium tracking-tight transition-colors"
              >
                <Mail className="size-5" />
                get@siinc.io
              </Link>
            </div>
          </div>

          {/* Inquiry Form / Success / Error Message */}
          <div className="flex-1 md:ps-8">
            <h2 className="text-lg font-semibold">Inquiries</h2>
            {submissionState === 'success' ? (
              <div className="mt-5 flex flex-col items-center justify-center py-12 text-center">
                <CheckCircle2 className="mb-4 size-16 text-green-600" />
                <h3 className="mb-2 text-2xl font-semibold">
                  Thank you for contacting us!
                </h3>
                <p className="text-muted-foreground mb-6">
                  We'll get back to you as soon as possible.
                </p>
                <Button onClick={resetForm} size="lg">
                  Submit another inquiry
                </Button>
              </div>
            ) : submissionState === 'error' ? (
              <div className="mt-5 flex flex-col items-center justify-center py-12 text-center">
                <XCircle className="mb-4 size-16 text-red-600" />
                <h3 className="mb-2 text-2xl font-semibold">
                  Something went wrong
                </h3>
                <p className="text-muted-foreground mb-2">
                  {errorMessage || 'Please try again or email us directly.'}
                </p>
                <p className="text-muted-foreground mb-6">
                  You can also reach us directly at{' '}
                  <Link
                    href="mailto:get@siinc.io"
                    className="text-primary underline"
                  >
                    get@siinc.io
                  </Link>
                </p>
                <div className="flex gap-3">
                  <Button onClick={resetForm} variant="outline" size="lg">
                    Try again
                  </Button>
                  <Button asChild size="lg">
                    <Link href="mailto:get@siinc.io">Email directly</Link>
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-5 space-y-5">
                {formFields.map((field) => (
                  <div key={field.name} className="flex flex-col gap-2">
                    <Label>
                      {field.label}
                      {field.optional && (
                        <span className="text-muted-foreground/60">
                          {' '}
                          (optional)
                        </span>
                      )}
                    </Label>
                    {field.type === 'textarea' ? (
                      <Textarea
                        name={field.name}
                        placeholder={field.placeholder}
                        className="min-h-[120px] resize-none"
                        value={formData[field.name as keyof typeof formData]}
                        onChange={handleInputChange}
                        required={!field.optional}
                        disabled={submissionState === 'submitting'}
                      />
                    ) : (
                      <Input
                        type={field.type}
                        name={field.name}
                        placeholder={field.placeholder}
                        value={formData[field.name as keyof typeof formData]}
                        onChange={handleInputChange}
                        required={!field.optional}
                        disabled={submissionState === 'submitting'}
                      />
                    )}
                  </div>
                ))}

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    size="lg"
                    disabled={submissionState === 'submitting'}
                  >
                    {submissionState === 'submitting' ? 'Sending...' : 'Submit'}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
