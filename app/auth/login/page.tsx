import LoginForm from '@/components/auth/LoginForm';
import { Container } from 'react-bootstrap';

export default function LoginPage() {
    return (
        <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '80vh' }}>
            <LoginForm />
        </Container>
    );
}
