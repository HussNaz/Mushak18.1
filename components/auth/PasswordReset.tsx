'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, Button, Alert, Spinner } from 'react-bootstrap';
import Link from 'next/link';

const resetSchema = z.object({
    email: z.string().email('Invalid email address'),
});

type ResetFormData = z.infer<typeof resetSchema>;

export default function PasswordReset() {
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ResetFormData>({
        resolver: zodResolver(resetSchema),
    });

    const onSubmit = async (data: ResetFormData) => {
        setIsLoading(true);
        setError(null);
        setMessage(null);

        try {
            // Mock API call
            await new Promise((resolve) => setTimeout(resolve, 1000));

            setMessage('If an account exists with this email, you will receive a password reset link shortly.');
        } catch (err) {
            setError('An unexpected error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-100" style={{ maxWidth: '400px' }}>
            <h2 className="text-center mb-4">Reset Password</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            {message && <Alert variant="success">{message}</Alert>}
            <Form onSubmit={handleSubmit(onSubmit)}>
                <Form.Group className="mb-3" controlId="email">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
                        type="email"
                        placeholder="Enter email"
                        {...register('email')}
                        isInvalid={!!errors.email}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.email?.message}
                    </Form.Control.Feedback>
                </Form.Group>

                <div className="d-grid gap-2">
                    <Button variant="success" type="submit" disabled={isLoading}>
                        {isLoading ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : 'Send Reset Link'}
                    </Button>
                </div>

                <div className="text-center mt-3">
                    <Link href="/auth/login" className="text-decoration-none">Back to Login</Link>
                </div>
            </Form>
        </div>
    );
}
