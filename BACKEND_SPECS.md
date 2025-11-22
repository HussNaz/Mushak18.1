# Backend Specifications for VAT Consultant License Application System

## Database Schema (SQL)

-- Users Table (Synced with Supabase Auth)
CREATE TABLE users (
id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
email VARCHAR(255) UNIQUE NOT NULL,
role VARCHAR(20) DEFAULT 'applicant', -- 'applicant' or 'admin'
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Applicants Table
CREATE TABLE applicants (
id SERIAL PRIMARY KEY,
user_id UUID REFERENCES users(id) ON DELETE CASCADE,
bin VARCHAR(13),
tin VARCHAR(12),
full_name VARCHAR(100) NOT NULL,
address TEXT,
date_of_birth DATE NOT NULL,
nationality VARCHAR(50) NOT NULL,
nid VARCHAR(17) NOT NULL,
cell_number VARCHAR(11) NOT NULL,
profile_photo_url TEXT,
designation VARCHAR(100),
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Education Degrees Table
CREATE TABLE education_degrees (
id SERIAL PRIMARY KEY,
applicant_id INTEGER REFERENCES applicants(id) ON DELETE CASCADE,
degree_name VARCHAR(60) NOT NULL,
achievement_year INTEGER NOT NULL,
educational_institute VARCHAR(100) NOT NULL,
grade VARCHAR(50) NOT NULL,
special_achievement TEXT,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Applications Table
CREATE TABLE applications (
id SERIAL PRIMARY KEY,
applicant_id INTEGER REFERENCES applicants(id),
application_number VARCHAR(50) UNIQUE,
status VARCHAR(20) DEFAULT 'draft', -- 'draft', 'submitted', 'under_review', 'approved', 'returned'
pay_order_amount DECIMAL(10,2) DEFAULT 5000.00,
pay_order_number VARCHAR(100),
pay_order_date DATE,
pay_order_bank VARCHAR(30),
pay_order_branch VARCHAR(30),
admin_feedback TEXT,
submitted_at TIMESTAMP,
approved_at TIMESTAMP,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Documents Table
CREATE TABLE documents (
id SERIAL PRIMARY KEY,
application_id INTEGER REFERENCES applications(id) ON DELETE CASCADE,
document_type VARCHAR(50) NOT NULL, -- 'secondary_certificate', 'passport_photo_1', 'passport_photo_2', 'passport_photo_3', 'highest_certificate', 'nid_copy', 'pay_order'
file_url TEXT NOT NULL,
file_size INTEGER,
uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Licenses Table
CREATE TABLE licenses (
id SERIAL PRIMARY KEY,
application_id INTEGER REFERENCES applications(id),
license_number VARCHAR(50) UNIQUE NOT NULL, -- Format: C202560
qr_code_data TEXT NOT NULL,
issue_date DATE NOT NULL,
pdf_url TEXT,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Admin Actions Log
CREATE TABLE admin_actions (
id SERIAL PRIMARY KEY,
admin_id UUID REFERENCES users(id),
application_id INTEGER REFERENCES applications(id),
action_type VARCHAR(50) NOT NULL, -- 'reviewed', 'approved', 'returned', 'edited'
action_details TEXT,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

## API Request/Response Formats (JSON)

### Authentication

#### POST /api/auth/signup

**Request:**

```json
{
  "email": "applicant@example.com",
  "password": "SecurePass123!",
  "confirmPassword": "SecurePass123!"
}
```

**Response:**

```json
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "id": 1,
    "email": "applicant@example.com",
    "role": "applicant"
  }
}
```

#### POST /api/auth/login

**Request:**

```json
{
  "email": "applicant@example.com",
  "password": "SecurePass123!"
}
```

**Response:**

```json
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "id": 1,
    "email": "applicant@example.com",
    "role": "applicant"
  }
}
```

#### POST /api/auth/reset-password

**Request:**

```json
{
  "email": "applicant@example.com"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Password reset link sent to email."
}
```

### Application Submission

#### POST /api/applicant/application

**Request:**

```json
{
  "generalInfo": {
    "bin": "1234567890123",
    "tin": "123456789012",
    "fullName": "John Doe",
    "address": "123 Main St, Dhaka",
    "dateOfBirth": "1990-01-01",
    "nationality": "Bangladesh",
    "nid": "1234567890123",
    "cellNumber": "01712345678",
    "email": "applicant@example.com"
  },
  "education": [
    {
      "degreeName": "Bachelor of Commerce",
      "achievementYear": 2015,
      "educationalInstitute": "Dhaka University",
      "grade": "First Class",
      "specialAchievement": "Dean's List"
    }
  ],
  "documents": {
    "secondaryCertificate": "file_id_or_url",
    "passportPhotos": ["file_id_1", "file_id_2", "file_id_3"],
    "highestCertificate": "file_id",
    "nidCopy": "file_id",
    "payOrder": "file_id"
  },
  "payOrder": {
    "amount": 5000,
    "payOrderNumber": "PO123456",
    "date": "2025-11-15",
    "bankName": "Sonali Bank",
    "branchName": "Motijheel Branch",
    "issuedTo": true
  },
  "declaration": {
    "designation": "Tax Consultant",
    "agreed": true
  },
  "status": "submitted"
}
```

### Admin Search

#### GET /api/admin/search?query=john&type=name

**Response:**

```json
{
  "results": [
    {
      "applicationId": 1,
      "applicantName": "John Doe",
      "email": "applicant@example.com",
      "status": "submitted",
      "submittedAt": "2025-11-15T10:30:00Z"
    }
  ],
  "total": 1
}
```

## Supabase Implementation Details

### Setup Instructions

1.  **Create a Supabase Project**: Go to [database.new](https://database.new) and create a new project.
2.  **Get Credentials**:
    - Go to Project Settings -> API.
    - Copy the `Project URL` and `anon` public key.
3.  **Configure Environment Variables**:
    - Create or update `.env.local` in the root of your Next.js project.
    - Add the following variables:
      ```env
      NEXT_PUBLIC_SUPABASE_URL=your_project_url
      NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
      ```
4.  **Run SQL Schema**:
    - Go to the SQL Editor in your Supabase dashboard.
    - Copy the SQL from the "Database Schema (SQL)" section above.
    - Run the SQL to create the necessary tables.
