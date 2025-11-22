'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Nav } from 'react-bootstrap';

export default function AdminSidebar() {
    const pathname = usePathname();

    return (
        <div className="bg-dark text-white border-end" style={{ width: '250px', minHeight: 'calc(100vh - 56px)' }}>
            <div className="p-3">
                <h5 className="text-light mb-4">Admin Panel</h5>
                <Nav className="flex-column">
                    <Nav.Link
                        as={Link as any}
                        href="/admin"
                        active={pathname === '/admin'}
                        className={`mb-2 ${pathname === '/admin' ? 'bg-primary text-white rounded' : 'text-white-50 hover-white'}`}
                    >
                        Dashboard
                    </Nav.Link>
                    <Nav.Link
                        as={Link as any}
                        href="/admin/applications"
                        active={pathname.startsWith('/admin/applications')}
                        className={`mb-2 ${pathname.startsWith('/admin/applications') ? 'bg-primary text-white rounded' : 'text-white-50 hover-white'}`}
                    >
                        Applications
                    </Nav.Link>
                    <Nav.Link
                        as={Link as any}
                        href="/admin/reports"
                        className="text-white-50 hover-white"
                    >
                        Reports
                    </Nav.Link>
                    <Nav.Link
                        as={Link as any}
                        href="/admin/settings"
                        className="text-white-50 hover-white"
                    >
                        Settings
                    </Nav.Link>
                </Nav>
            </div>
        </div>
    );
}
