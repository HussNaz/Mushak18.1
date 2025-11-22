import SignupForm from '@/components/auth/SignupForm';
import { Container } from 'react-bootstrap';

export default function SignupPage() {
    return (
        <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '80vh' }}>
            <SignupForm />
        </Container>
    );
}
