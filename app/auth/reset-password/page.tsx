import PasswordReset from '@/components/auth/PasswordReset';
import { Container } from 'react-bootstrap';

export default function ResetPasswordPage() {
    return (
        <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '80vh' }}>
            <PasswordReset />
        </Container>
    );
}
