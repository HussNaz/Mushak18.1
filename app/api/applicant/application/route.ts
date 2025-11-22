import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    // 1. Verify Authentication
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json({ success: false, message: 'Invalid token' }, { status: 401 });
    }

    const body = await request.json();
    const { generalInfo, education, documents, payOrder, declaration, status } = body;

    // 2. Insert Applicant Data
    // Check if applicant already exists for this user
    const { data: existingApplicant } = await supabase
      .from('applicants')
      .select('id')
      .eq('user_id', user.id)
      .single();

    let applicantId = existingApplicant?.id;

    if (!applicantId) {
      const { data: newApplicant, error: applicantError } = await supabase
        .from('applicants')
        .insert([
          {
            user_id: user.id,
            bin: generalInfo.bin,
            tin: generalInfo.tin,
            full_name: generalInfo.fullName,
            address: generalInfo.address,
            date_of_birth: generalInfo.dateOfBirth,
            nationality: generalInfo.nationality,
            nid: generalInfo.nid,
            cell_number: generalInfo.cellNumber,
            // profile_photo_url: documents.passportPhotos[0], // Assuming first photo is profile
            designation: declaration.designation,
          },
        ])
        .select()
        .single();

      if (applicantError) {
        console.error('Applicant insert error:', applicantError);
        return NextResponse.json({ success: false, message: 'Failed to save applicant info' }, { status: 500 });
      }
      applicantId = newApplicant.id;
    }

    // 3. Insert Education Data
    if (education && education.length > 0) {
      const educationData = education.map((edu: any) => ({
        applicant_id: applicantId,
        degree_name: edu.degreeName,
        achievement_year: edu.achievementYear,
        educational_institute: edu.educationalInstitute,
        grade: edu.grade,
        special_achievement: edu.specialAchievement,
      }));

      const { error: eduError } = await supabase.from('education_degrees').insert(educationData);
      if (eduError) {
        console.error('Education insert error:', eduError);
        // Continue or rollback? For now continue.
      }
    }

    // 4. Create Application
    const { data: application, error: appError } = await supabase
      .from('applications')
      .insert([
        {
          applicant_id: applicantId,
          application_number: `APP-${Date.now()}`, // Simple generation
          status: status || 'submitted',
          pay_order_amount: payOrder.amount,
          pay_order_number: payOrder.payOrderNumber,
          pay_order_date: payOrder.date,
          pay_order_bank: payOrder.bankName,
          pay_order_branch: payOrder.branchName,
          submitted_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (appError) {
      console.error('Application insert error:', appError);
      return NextResponse.json({ success: false, message: 'Failed to create application' }, { status: 500 });
    }

    // 5. Insert Documents
    // Flatten the documents object into an array for insertion
    const docInserts = [];
    if (documents.secondaryCertificate) docInserts.push({ application_id: application.id, document_type: 'secondary_certificate', file_url: documents.secondaryCertificate });
    if (documents.highestCertificate) docInserts.push({ application_id: application.id, document_type: 'highest_certificate', file_url: documents.highestCertificate });
    if (documents.nidCopy) docInserts.push({ application_id: application.id, document_type: 'nid_copy', file_url: documents.nidCopy });
    if (documents.payOrder) docInserts.push({ application_id: application.id, document_type: 'pay_order', file_url: documents.payOrder });
    if (documents.passportPhotos && Array.isArray(documents.passportPhotos)) {
        documents.passportPhotos.forEach((photo: string, index: number) => {
            docInserts.push({ application_id: application.id, document_type: `passport_photo_${index + 1}`, file_url: photo });
        });
    }

    if (docInserts.length > 0) {
      const { error: docError } = await supabase.from('documents').insert(docInserts);
      if (docError) {
        console.error('Document insert error:', docError);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Application submitted successfully',
      applicationId: application.id,
    });

  } catch (error) {
    console.error('Application submission error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
