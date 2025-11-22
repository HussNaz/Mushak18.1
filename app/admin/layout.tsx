import AdminSidebar from '@/components/admin/AdminSidebar';
import { Container } from 'react-bootstrap';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="d-flex">
            <AdminSidebar />
            <div className="flex-grow-1 p-4 bg-light">
                <Container fluid>
                    {children}
                </Container>
            </div>
        </div>
    );
}
