import LicenseView from '@/components/LicenseView';

export default function LicensePage({ params }: { params: { id: string } }) {
    // Mock Data
    const licenseData = {
        licenseNumber: 'C202560',
        fullName: 'John Doe',
        nid: '1234567890123',
        bin: '1234567890123',
        address: '123 Main St, Dhaka',
        issueDate: '2025-11-20',
        expiryDate: '2030-11-19',
    };

    return (
        <div className="py-5 bg-light">
            <LicenseView licenseData={licenseData} />
        </div>
    );
}
