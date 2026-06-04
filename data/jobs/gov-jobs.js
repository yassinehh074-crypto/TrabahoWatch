/* ============================================================
   DATA/JOBS/GOV-JOBS.JS — Government job listings
   All salary data: SSL VI Tranche 3 (EO No. 64, 2024)
   All requirements: CSC MC No. 1 s. 2017 + agency standards
   Sources: Official agency websites + CSC job portal
   Last updated: 2026-05-01
   TrabahoWatch v1.0
   ============================================================ */

window.__TrabahoGovJobs = [

  /* ══════════════════════════════════════════════════════════
     1. DEPED TEACHER I — NCR
        Source: deped.gov.ph | CSC Job Portal
     ══════════════════════════════════════════════════════════ */
  {
    id:          'deped-teacher-i-ncr-2026',
    sector:      'government',
    category:    'deped',
    tier:        1,
    status:      'open',

    title:       'Teacher I',
    agency:      'Department of Education (DepEd) — NCR',
    location:    'Metro Manila, NCR',
    region:      'ncr',

    salary:      31705,
    salaryText:  '₱31,705/month (SG 11, Step 1)',
    sg:          11,

    published:   '2026-04-01',
    deadline:    '2026-06-30',

    description: [
      'The Department of Education (DepEd) is hiring qualified ',
      'Teacher I positions in public elementary and secondary ',
      'schools across the National Capital Region. Teachers are ',
      'responsible for delivering quality K-12 education, ',
      'preparing lesson plans aligned with the Most Essential ',
      'Learning Competencies (MELCs), conducting formative and ',
      'summative assessments, and maintaining student records. ',
      'This is a permanent, plantilla position covered by the ',
      'Magna Carta for Public School Teachers (RA 4670).'
    ].join(''),

    requirements: [
      'Bachelor\'s degree in Elementary or Secondary Education (BSEd/BEEd) — or any bachelor\'s degree with 18 professional education units',
      'Valid Professional Teacher license (PRC) — must be a Licensure Examination for Teachers (LET) passer',
      'CSC Professional or Sub-Professional eligibility (Career Service Exam) OR RA 1080 (Licensure exam passer eligibility)',
      'No pending administrative or criminal case',
      'Filipino citizen',
      'Must be physically and mentally fit for the demands of teaching',
      'For specialized subjects (e.g., MAPEH, TLE, Science): relevant licensure or specialization may be required'
    ],

    documents: [
      'Personal Data Sheet (CSC Form 212) — latest revised version, 2 copies',
      'Certified true copy of PRC ID and Professional Teacher Certificate',
      'Certified true copy of Transcript of Records and Diploma',
      'Authenticated copy of LET results from PRC',
      'NBI Clearance (within 6 months)',
      'Medical Certificate from government physician',
      'SALN (Statement of Assets, Liabilities and Net Worth) for current government employees',
      '2x2 ID photos (4 pieces)'
    ],

    howToApply: [
      {
        title: 'Monitor DepEd NCR Job Postings',
        body:  'Check the DepEd NCR website (depedncr.deped.gov.ph) and the CSC Job Portal (csc.gov.ph) for the latest Teacher I vacancy announcements. Announcements are also posted in DepEd Division Offices and school bulletin boards.'
      },
      {
        title: 'Prepare Your Complete Documents',
        body:  'Compile all required documents. Make sure your PRC license is valid and your LET certificate is authenticated. CSC Form 212 must be downloaded from the CSC website and filled out completely.'
      },
      {
        title: 'Submit to the Division Office HRMO',
        body:  'Submit your complete application package to the Human Resource Management Office (HRMO) of the DepEd Schools Division Office covering your preferred school assignment. Each division has its own cut-off date — submit before the posted deadline.'
      },
      {
        title: 'Await the Selection Process',
        body:  'The Selection Board will screen applications, conduct demo teaching, and interview shortlisted applicants. The entire process takes 2–4 months from deadline to appointment.'
      },
      {
        title: 'Receive Notice and Onboarding',
        body:  'Successful applicants receive a Notice of Assignment from the Division Office. An orientation follows before the start of the school year (June).'
      }
    ],

    tags: [
      'teacher', 'deped', 'education', 'LET', 'PRC',
      'ncr', 'metro manila', 'government', 'plantilla',
      'k-12', 'public school', 'teaching'
    ],

    sourceUrl:   'https://depedncr.deped.gov.ph',
    benefits: [
      'GSIS membership (9% employee share, 12% employer share)',
      'PhilHealth coverage',
      'Pag-IBIG membership',
      'Magna Carta Benefits: step increment every 3 years, longevity pay',
      'Mid-year bonus (1 month salary, May)',
      'Year-end bonus + Cash Gift (₱5,000, November)',
      'Performance Enhancement Incentive (PEI)',
      'Personnel Economic Relief Allowance (PERA): ₱2,000/month',
      'Representation and Transportation Allowance (RATA) for designated positions',
      '15 days vacation leave + 15 days sick leave per year (cumulative)',
      'Summer and Christmas vacation with pay (public school teachers)'
    ]
  },

  /* ══════════════════════════════════════════════════════════
     2. DEPED MASTER TEACHER I — NCR
        Source: deped.gov.ph | CSC Job Portal
     ══════════════════════════════════════════════════════════ */
  {
    id:          'deped-master-teacher-i-ncr-2026',
    sector:      'government',
    category:    'deped',
    tier:        1,
    status:      'open',

    title:       'Master Teacher I',
    agency:      'Department of Education (DepEd) — NCR',
    location:    'Metro Manila, NCR',
    region:      'ncr',

    salary:      53818,
    salaryText:  '₱53,818/month (SG 18, Step 1)',
    sg:          18,

    published:   '2026-04-01',
    deadline:    '2026-06-30',

    description: [
      'Master Teacher I is the first promotion track for ',
      'outstanding classroom teachers in the Philippine public ',
      'school system. The position is responsible for serving ',
      'as a resource person in faculty development activities, ',
      'demonstrating exemplary teaching practices, mentoring ',
      'junior teachers, preparing instructional materials, ',
      'conducting action research, and leading learning action ',
      'cells (LACs). This is a highly competitive promotional ',
      'appointment requiring documented outstanding performance ',
      'and significant teaching experience.'
    ].join(''),

    requirements: [
      'Bachelor\'s degree in Education (BSEd/BEEd) or equivalent',
      'Valid PRC Professional Teacher license (LET passer)',
      'Minimum of 3 years teaching experience as Teacher III or equivalent',
      'At least 24 units of graduate study (Master\'s in Education preferred)',
      'Outstanding performance rating for the last 3 rating periods (Outstanding = 4.750–5.000 under RPMS)',
      'Must have served as Demo Teacher, Cooperating Teacher, or Action Researcher',
      'No pending administrative or criminal case',
      'Certificate of Recognition/Awards preferred'
    ],

    documents: [
      'CSC Form 212 (Personal Data Sheet) — latest revised version',
      'Certified true copy of PRC ID and Certificate',
      'Certified true copy of Transcript of Records and Diploma',
      'Official Transcript of graduate studies (if applicable)',
      'Copies of Performance Rating (IPCRF) for last 3 semesters — rated Outstanding',
      'Individual Performance Commitment and Review Form (IPCRF)',
      'Portfolio: lesson plans, action research, sample outputs, commendations',
      'NBI Clearance (within 6 months)',
      'Medical Certificate from government physician'
    ],

    howToApply: [
      {
        title: 'Check DepEd Promotion Announcement',
        body:  'Master Teacher positions are announced through the DepEd NCR Memoranda and posted in Division Offices. Monitor depedncr.deped.gov.ph and CSC job portal for vacancy postings.'
      },
      {
        title: 'Prepare Your Portfolio',
        body:  'Your portfolio is critical. Include your best lesson plans, action research output, training certifications, and documented mentoring activities. Outstanding IPCRF ratings for the last 3 periods are mandatory.'
      },
      {
        title: 'Submit to Division HRMO',
        body:  'Submit a complete application package to the Schools Division Office HRMO within the deadline. Late submissions are automatically disqualified.'
      },
      {
        title: 'Demo Teaching and Interview',
        body:  'Shortlisted applicants undergo a rigorous selection: demo teaching before a panel, portfolio defense, and formal interview with the Schools Division Selection Board.'
      }
    ],

    tags: [
      'master teacher', 'deped', 'education', 'promotion',
      'ncr', 'metro manila', 'government', 'senior teacher',
      'mentoring', 'instructional leadership'
    ],

    sourceUrl: 'https://depedncr.deped.gov.ph',
    benefits: [
      'All standard government benefits (GSIS, PhilHealth, Pag-IBIG)',
      'Magna Carta Benefits for Public School Teachers',
      'Mid-year and Year-end Bonus',
      'PERA ₱2,000/month',
      'Higher RATA as Master Teacher designation',
      'Priority for training and scholarship programs',
      'Step increment every 3 years of satisfactory service'
    ]
  },

  /* ══════════════════════════════════════════════════════════
     3. DOH NURSE I — NCR
        Source: doh.gov.ph | CSC Job Portal
     ══════════════════════════════════════════════════════════ */
  {
    id:          'doh-nurse-i-ncr-2026',
    sector:      'government',
    category:    'doh',
    tier:        1,
    status:      'open',

    title:       'Nurse I',
    agency:      'Department of Health (DOH) — NCR Hospitals',
    location:    'Metro Manila, NCR',
    region:      'ncr',

    salary:      42178,
    salaryText:  '₱42,178/month (SG 15, Step 1)',
    sg:          15,

    published:   '2026-04-15',
    deadline:    '2026-07-15',

    description: [
      'The Department of Health is actively hiring Nurse I for ',
      'its retained hospitals and health facilities in Metro Manila ',
      'including San Lazaro Hospital, Rizal Medical Center, ',
      'Jose N. Rodriguez Memorial Hospital, Tondo Medical Center, ',
      'and other DOH-retained facilities. Nurse I is responsible ',
      'for delivering direct patient care, implementing the nursing ',
      'process, administering medications and treatments, ',
      'documenting patient records, and collaborating with the ',
      'multidisciplinary health team to achieve optimal patient ',
      'outcomes. This is a permanent, plantilla position with ',
      'coverage under the Magna Carta for Public Health Workers (RA 7305).'
    ].join(''),

    requirements: [
      'Bachelor of Science in Nursing (BSN) from a Commission on Higher Education (CHED)-recognized institution',
      'Valid PRC Nursing license — must be a Nurse Licensure Examination (NLE) passer',
      'RA 1080 (Board/Bar Passer eligibility) — serves as CSC eligibility',
      'No pending administrative or criminal case',
      'Filipino citizen',
      'Physically and mentally fit for hospital nursing duties',
      'Willing to render shifting duties (morning, afternoon, night shift)',
      'At least 8 hours/800 hours of clinical experience preferred for hospital positions'
    ],

    documents: [
      'CSC Form 212 (Personal Data Sheet) — 2 copies, with recent ID photo',
      'Certified true copy of PRC Nursing ID and Board Certificate',
      'Certified true copy of BSN Transcript of Records and Diploma',
      'Authenticated NLE results from PRC',
      'NBI Clearance (within 6 months)',
      'Police Clearance (within 3 months)',
      'Medical Certificate from a government physician (including CBC, urinalysis, chest X-ray)',
      'Certificate of Training/Seminars attended (BLS, IV therapy, etc.)',
      '2x2 ID photos (4 pieces)'
    ],

    howToApply: [
      {
        title: 'Find the Specific DOH Hospital Vacancy',
        body:  'DOH-retained hospitals post their own vacancies. Check doh.gov.ph, the CSC Job Portal, and the HR offices of specific hospitals: Rizal Medical Center, San Lazaro Hospital, Tondo Medical Center, Valenzuela Medical Center, and others in NCR.'
      },
      {
        title: 'Prepare Your Documents',
        body:  'Ensure your PRC license is valid and updated. Get an NBI clearance and medical clearance from a government physician. All photocopies must be certified true copies with the certifier\'s signature and date.'
      },
      {
        title: 'Submit to Hospital HRMO',
        body:  'Submit your complete application to the Human Resource Management Division (HRMD) of your target hospital. Walk-in and courier submissions are typically accepted during office hours (8AM–5PM, Monday–Friday).'
      },
      {
        title: 'Written Exam and Panel Interview',
        body:  'Shortlisted applicants are notified for a nursing competency exam, clinical demonstration (for some positions), and panel interview with the Hospital Selection Board. Background verification follows.'
      },
      {
        title: 'Appointment and Pre-Employment Requirements',
        body:  'Once selected, you will receive a job offer and must complete pre-employment medical examination at the hospital\'s occupational health unit before your appointment date.'
      }
    ],

    tags: [
      'nurse', 'nursing', 'doh', 'hospital', 'healthcare',
      'ncr', 'metro manila', 'government', 'plantilla',
      'NLE', 'PRC', 'public health', 'magna carta'
    ],

    sourceUrl: 'https://doh.gov.ph',
    benefits: [
      'GSIS membership',
      'PhilHealth coverage',
      'Pag-IBIG membership',
      'Magna Carta for Public Health Workers (RA 7305): 25% hazard pay, subsistence allowance, laundry allowance, longevity pay',
      'Night shift differential pay',
      'Mid-year bonus and Year-end bonus',
      'PERA ₱2,000/month',
      'Overtime pay for hours rendered beyond 8 hours',
      '15 days vacation leave + 15 days sick leave (cumulative)',
      'Priority for specialty training, scholarships, and foreign conferences'
    ]
  },

  /* ══════════════════════════════════════════════════════════
     4. LGU ADMIN AIDE III — METRO MANILA
        Source: Manila LGU | CSC Job Portal
     ══════════════════════════════════════════════════════════ */
  {
    id:          'lgu-admin-aide-iii-metro-manila-2026',
    sector:      'government',
    category:    'lgu',
    tier:        2,
    status:      'open',

    title:       'Administrative Aide III',
    agency:      'City Government of Manila — Office of the City Administrator',
    location:    'City of Manila, NCR',
    region:      'ncr',

    salary:      15651,
    salaryText:  '₱15,651/month (SG 3, Step 1)',
    sg:          3,

    published:   '2026-04-20',
    deadline:    '2026-06-20',

    description: [
      'The City Government of Manila is hiring Administrative Aide III ',
      'for various city government offices. The position is responsible ',
      'for performing clerical and administrative support functions ',
      'including encoding, filing, receiving and releasing of documents, ',
      'maintaining records, preparing routine correspondence, and ',
      'assisting in the delivery of frontline government services to ',
      'Manila residents. This is an entry-level position ideal for ',
      'fresh graduates seeking to start a career in local government service.'
    ].join(''),

    requirements: [
      'Completion of 2-year college or high school graduate with relevant experience',
      'Career Service (Sub-Professional) Examination passer OR equivalent CSC eligibility',
      'Basic computer literacy (MS Office: Word, Excel)',
      'Good oral and written communication skills in Filipino and English',
      'Willing to work in the City of Manila',
      'Resident of Manila preferred (but not exclusive)',
      'No pending administrative or criminal case',
      'Filipino citizen'
    ],

    documents: [
      'CSC Form 212 (Personal Data Sheet) — 2 copies',
      'Certified true copy of Career Service (Sub-Professional) Examination result or equivalent',
      'Certified true copy of Transcript of Records and Diploma/High School Form 137',
      'NBI Clearance (within 6 months)',
      'Police Clearance from Manila Police District (within 3 months)',
      'Medical Certificate from a government physician',
      'Barangay Clearance from place of residence',
      '2x2 ID photos (4 pieces)',
      'Birth Certificate (PSA-authenticated)'
    ],

    howToApply: [
      {
        title: 'Check Manila LGU Job Postings',
        body:  'Visit the City of Manila website (manila.gov.ph) or the CSC Job Portal (csc.gov.ph) for current vacancy postings. Announcements are also posted at Manila City Hall bulletin boards and through the Manila Public Information Office Facebook page.'
      },
      {
        title: 'Prepare Your Documents',
        body:  'Compile all requirements. Make sure your CSC eligibility certificate is authenticated. All photocopies must be certified true copies. Organize documents in a clear folder with the Personal Data Sheet on top.'
      },
      {
        title: 'Submit to Manila HRMO',
        body:  'Submit your application to the Human Resource Management Office (HRMO) at Manila City Hall, located at Padre Burgos Avenue, Ermita, Manila. Submission hours: 8:00 AM to 4:00 PM, Monday to Friday.'
      },
      {
        title: 'Assessment and Interview',
        body:  'Qualified applicants undergo a written exam on basic clerical skills and a panel interview. The Manila Personnel Selection Board evaluates all applicants based on education, experience, training, and personality (OEPA criteria).'
      }
    ],

    tags: [
      'admin aide', 'clerical', 'lgu', 'local government',
      'manila', 'ncr', 'government', 'entry level',
      'career service', 'sub-professional'
    ],

    sourceUrl: 'https://manila.gov.ph',
    benefits: [
      'GSIS membership',
      'PhilHealth coverage',
      'Pag-IBIG membership',
      'PERA ₱2,000/month',
      'Mid-year bonus and Year-end bonus',
      'Cash Gift ₱5,000 (November)',
      '15 days vacation leave + 15 days sick leave',
      'Step increment every 3 years of satisfactory service',
      'LGU-specific benefits and allowances per Manila City Ordinance'
    ]
  },

  /* ══════════════════════════════════════════════════════════
     5. LGU BHW COORDINATOR — MANILA
        Source: Manila Health Department | CSC Job Portal
     ══════════════════════════════════════════════════════════ */
  {
    id:          'lgu-bhw-coordinator-manila-2026',
    sector:      'government',
    category:    'lgu',
    tier:        2,
    status:      'open',

    title:       'Barangay Health Worker (BHW) Coordinator',
    agency:      'Manila Health Department — City Government of Manila',
    location:    'City of Manila, NCR',
    region:      'ncr',

    salary:      18998,
    salaryText:  '₱18,998/month (SG 6, Step 1)',
    sg:          6,

    published:   '2026-04-20',
    deadline:    '2026-06-20',

    description: [
      'The Manila Health Department is hiring BHW Coordinators to ',
      'supervise and support the network of Barangay Health Workers ',
      'in Manila\'s 897 barangays. The BHW Coordinator is responsible ',
      'for conducting training and capability-building activities for ',
      'BHWs, monitoring community health programs, coordinating with ',
      'district health centers, maintaining health records, ',
      'implementing DOH-mandated health programs (immunization, ',
      'family planning, maternal care, nutrition), and ensuring ',
      'the delivery of primary health care at the community level. ',
      'This position is critical to Manila\'s public health infrastructure.'
    ].join(''),

    requirements: [
      'Bachelor\'s degree in Nursing, Midwifery, Public Health, or any health-related course',
      'PRC license preferred but not required (Registered Nurse or Registered Midwife)',
      'Career Service Professional or Sub-Professional eligibility',
      'At least 1 year of community health or public health experience preferred',
      'Knowledgeable in DOH programs: EPI, Family Planning, MNCHN, STOP TB, PhilHealth',
      'Proficient in community organizing and health education',
      'Familiar with Manila\'s barangay health system preferred',
      'Willing to do fieldwork in assigned districts'
    ],

    documents: [
      'CSC Form 212 (Personal Data Sheet)',
      'Certified true copy of PRC ID and Board Certificate (if applicable)',
      'Certified true copy of Transcript of Records and Diploma',
      'Career Service eligibility certificate',
      'NBI Clearance (within 6 months)',
      'Medical Certificate from a government physician',
      'Certificate of relevant trainings (BLS, community health, nutrition)',
      'Barangay Clearance',
      'Birth Certificate (PSA-authenticated)'
    ],

    howToApply: [
      {
        title: 'Check Manila Health Department Postings',
        body:  'Visit the Manila Health Department at Sta. Ana Hospital complex or the Manila City Hall HRMO. Vacancies are also posted on the CSC Job Portal and Manila LGU social media pages.'
      },
      {
        title: 'Prepare Documents',
        body:  'Focus on documenting your community health experience and any DOH program trainings. If you have previously worked as a BHW or in a health center, include a Certificate of Service.'
      },
      {
        title: 'Submit to Manila Health Dept. HRMO',
        body:  'Submit your complete application to the Manila Health Department HRMO. Specify your preferred district assignment if you have community knowledge in a specific area.'
      },
      {
        title: 'Interview and Field Assessment',
        body:  'Shortlisted applicants undergo a panel interview focusing on community health competencies, knowledge of DOH programs, and ability to communicate health information in Filipino/Tagalog to community members.'
      }
    ],

    tags: [
      'BHW coordinator', 'community health', 'public health',
      'manila', 'lgu', 'ncr', 'government', 'nursing',
      'midwifery', 'barangay health', 'doh programs'
    ],

    sourceUrl: 'https://manila.gov.ph',
    benefits: [
      'GSIS membership',
      'PhilHealth coverage',
      'Pag-IBIG membership',
      'PERA ₱2,000/month',
      'Magna Carta for Public Health Workers (RA 7305) benefits',
      'Mid-year and Year-end bonus',
      '15 days vacation leave + 15 days sick leave',
      'Health hazard allowance under RA 7305'
    ]
  },

  /* ══════════════════════════════════════════════════════════
     6. PNP PATROLMAN/PATROLWOMAN (PO1) — NCR
        Source: pnp.gov.ph/recruitment
     ══════════════════════════════════════════════════════════ */
  {
    id:          'pnp-po1-ncr-2026',
    sector:      'government',
    category:    'pnp',
    tier:        2,
    status:      'open',

    title:       'Patrolman / Patrolwoman (PO1)',
    agency:      'Philippine National Police (PNP) — National Capital Region Police Office (NCRPO)',
    location:    'Metro Manila, NCR',
    region:      'ncr',

    salary:      31705,
    salaryText:  '₱31,705/month base pay (SG 11) + allowances',
    sg:          11,

    published:   '2026-03-01',
    deadline:    '2026-07-31',

    description: [
      'The Philippine National Police (PNP) is recruiting qualified ',
      'individuals for the position of Patrolman/Patrolwoman (PO1) ',
      'for deployment in NCR police stations and units. PO1s are ',
      'responsible for maintaining peace and order, enforcing laws, ',
      'preventing and detecting crimes, protecting lives and property, ',
      'conducting foot and mobile patrols, responding to emergency calls, ',
      'and performing other law enforcement functions. The PNP offers ',
      'a competitive compensation package including base pay, ',
      'additional compensation, and hazard pay totaling approximately ',
      '₱43,000–₱50,000/month for NCR-assigned personnel. PNP recruitment ',
      'is conducted nationally and follows strict physical, medical, ',
      'and psychological standards.'
    ].join(''),

    requirements: [
      'Filipino citizen, of good moral character',
      'Bachelor\'s degree holder (any 4-year course from a CHED-recognized institution)',
      'Age: not less than 21 years and not more than 30 years old at the time of application',
      'Height: at least 5\'4" (163 cm) for males; at least 5\'2" (157 cm) for females',
      'Weight must be proportionate to height (BMI within normal range)',
      'Must be able to read and write Filipino and English',
      'No criminal record or pending criminal case',
      'No dishonorable discharge from the AFP or PNP',
      'Passed the National Police Commission (NAPOLCOM) Entrance Examination OR holder of RA 1080 (Bar/Board passer) eligibility',
      'Must pass the Physical Agility Test (PAT), Medical Examination, Neuro-Psychiatric Test, Drug Test, and Background Investigation'
    ],

    documents: [
      'Duly accomplished PNP Application Form',
      'PSA Birth Certificate (original and photocopy)',
      'Certified true copy of Bachelor\'s Degree and Transcript of Records',
      'NAPOLCOM Entrance Exam result OR equivalent eligibility certificate',
      'NBI Clearance (original, within 6 months)',
      'Police Clearance from local police station',
      'Barangay Clearance',
      'Medical Certificate from a government physician (general physical exam)',
      'Dental Certificate',
      'Drug test result from accredited laboratory (within 3 months)',
      'PSA Marriage Certificate (if married)',
      '6 pieces 2x2 ID photos (white background)',
      'PhilSys National ID or valid government-issued ID'
    ],

    howToApply: [
      {
        title: 'Attend the PNP Open Recruitment',
        body:  'The PNP NCRPO conducts recruitment drives. Visit ncrpo.pnp.gov.ph or the PNP Recruitment website (recruitment.pnp.gov.ph) for the schedule of recruitment activities in your district. Pre-registration online is required.'
      },
      {
        title: 'Complete Pre-Qualification Requirements',
        body:  'Make sure you meet all minimum qualifications before applying: age (21-30), height, educational attainment, and NAPOLCOM eligibility. The NAPOLCOM exam is conducted quarterly — register at napolcom.gov.ph.'
      },
      {
        title: 'Submit Application and Undergo Testing',
        body:  'Appear in person at the scheduled recruitment venue with all original and photocopied documents. You will undergo the Physical Agility Test (PAT) on the same day. Wear comfortable athletic clothes and rubber shoes.'
      },
      {
        title: 'Medical and Psychological Examination',
        body:  'Qualified applicants proceed to comprehensive medical examination (vision, hearing, CBC, urinalysis, X-ray) and neuro-psychiatric testing at the PNP General Hospital or designated medical facility.'
      },
      {
        title: 'Background Investigation and Final Selection',
        body:  'A thorough background investigation (BI) is conducted on all finalists. Upon passing all stages, you will be included in the PNP Selection Board recommendations for appointment and sent to the PNP Training Center for Basic Recruit Training.'
      }
    ],

    tags: [
      'PNP', 'police', 'patrolman', 'law enforcement',
      'ncr', 'metro manila', 'government', 'uniformed',
      'NAPOLCOM', 'public safety', 'security'
    ],

    sourceUrl: 'https://recruitment.pnp.gov.ph',
    benefits: [
      'Base pay: ₱31,705/month (SG 11)',
      'Additional Compensation: ₱3,000/month',
      'Personnel Economic Relief Allowance (PERA): ₱2,000/month',
      'Subsistence Allowance: ₱400/day (approx. ₱12,000/month)',
      'Quarters Allowance (if not provided with quarters)',
      'Hazard Pay: ₱10,000–₱15,000/month (for NCR assignment)',
      'GSIS membership and life insurance',
      'PhilHealth coverage (for uniformed personnel)',
      'Clothing Allowance: ₱6,000/year',
      'Annual Vacation Leave: 15 days; Sick Leave: 15 days',
      'Police retirement benefits (NAPOLCOM)',
      'PNP Mutual Aid and Benefit Association (PMABAI) coverage'
    ]
  },

  /* ══════════════════════════════════════════════════════════
     7. BFP FIRE OFFICER I (FO1) — NCR
        Source: bfp.gov.ph
     ══════════════════════════════════════════════════════════ */
  {
    id:          'bfp-fo1-ncr-2026',
    sector:      'government',
    category:    'bfp',
    tier:        3,
    status:      'open',

    title:       'Fire Officer I (FO1)',
    agency:      'Bureau of Fire Protection (BFP) — NCR Regional Office',
    location:    'Metro Manila, NCR',
    region:      'ncr',

    salary:      31705,
    salaryText:  '₱31,705/month base pay (SG 11) + allowances',
    sg:          11,

    published:   '2026-03-01',
    deadline:    '2026-07-31',

    description: [
      'The Bureau of Fire Protection (BFP) is recruiting Fire Officer I ',
      'for its fire stations across the National Capital Region. ',
      'Fire Officer I is the entry-level uniformed rank in the BFP ',
      'responsible for fire suppression and rescue operations, ',
      'fire prevention inspections, arson investigation support, ',
      'emergency medical response (first responder), ',
      'community fire safety education, and maintaining ',
      'fire station equipment and apparatus. BFP officers ',
      'serve the community 24/7 on rotating shift schedules. ',
      'Total monthly take-home for NCR FO1 with allowances ',
      'typically reaches ₱43,000–₱48,000/month.'
    ].join(''),

    requirements: [
      'Filipino citizen, of good moral character',
      'Bachelor\'s degree holder (any 4-year course from a CHED-recognized institution)',
      'Age: not less than 21 years and not more than 30 years old at application',
      'Height: at least 5\'4" (163 cm) for males; at least 5\'2" (157 cm) for females',
      'Weight proportionate to height (within normal BMI range)',
      'Must be in good physical and mental health',
      'No criminal record',
      'NAPOLCOM Entrance Examination passer OR equivalent RA 1080 eligibility',
      'Must pass BFP Physical Fitness Test, Medical, Dental, Neuro-psychiatric, and Drug tests',
      'No dishonorable discharge from any government service, AFP, or PNP'
    ],

    documents: [
      'Accomplished BFP Application Form (available at BFP regional/provincial offices)',
      'PSA Birth Certificate (original)',
      'Certified true copy of Diploma and Transcript of Records',
      'NAPOLCOM eligibility certificate',
      'NBI Clearance (within 6 months)',
      'Police Clearance (local)',
      'Medical and Dental Certificate from government physician',
      'Drug test result (within 3 months, from DOH-accredited lab)',
      'Barangay Clearance',
      '6 pieces 2x2 ID photos (white background)',
      'Marriage Certificate (PSA, if applicable)'
    ],

    howToApply: [
      {
        title: 'Check BFP Recruitment Schedule',
        body:  'Visit bfp.gov.ph or the BFP NCR Regional Office for recruitment announcements. BFP conducts centralized recruitment with specific application windows. Follow BFP\'s official Facebook page for real-time updates.'
      },
      {
        title: 'Pass the NAPOLCOM Exam First',
        body:  'The NAPOLCOM Entrance Examination is required for BFP entry. Register at napolcom.gov.ph. Exams are held quarterly in Manila and other key cities. The exam covers general knowledge, English, and logical reasoning.'
      },
      {
        title: 'Submit Application to BFP NCR',
        body:  'Bring all original documents and certified photocopies to the BFP NCR Regional Office or designated recruitment venue. Wear proper attire for the physical fitness test on application day.'
      },
      {
        title: 'Physical Fitness Test and Medical Exam',
        body:  'The BFP Physical Fitness Test includes push-ups, sit-ups, 100m sprint, and 3km run. Medical examination follows for those who pass. All tests are conducted within the recruitment period.'
      }
    ],

    tags: [
      'BFP', 'fire officer', 'fire protection', 'firefighter',
      'ncr', 'metro manila', 'government', 'uniformed',
      'emergency response', 'public safety', 'NAPOLCOM'
    ],

    sourceUrl: 'https://bfp.gov.ph',
    benefits: [
      'Base pay: ₱31,705/month (SG 11)',
      'Subsistence Allowance: approx. ₱12,000/month',
      'PERA: ₱2,000/month',
      'Hazard Pay (NCR): up to ₱10,000/month',
      'Clothing Allowance: ₱6,000/year',
      'GSIS membership and life insurance',
      'PhilHealth coverage',
      'BFP Mutual Benefit Association coverage',
      '15 days vacation + 15 days sick leave',
      'Quarters provided in fire stations (on-duty)',
      'BFP retirement benefits'
    ]
  },

  /* ══════════════════════════════════════════════════════════
     8. NBI SPECIAL INVESTIGATOR — NCR
        Source: nbi.gov.ph
     ══════════════════════════════════════════════════════════ */
  {
    id:          'nbi-special-investigator-2026',
    sector:      'government',
    category:    'nbi',
    tier:        3,
    status:      'open',

    title:       'Special Investigator',
    agency:      'National Bureau of Investigation (NBI)',
    location:    'Manila, NCR',
    region:      'ncr',

    salary:      33947,
    salaryText:  '₱33,947/month (SG 12, Step 1)',
    sg:          12,

    published:   '2026-04-10',
    deadline:    '2026-06-30',

    description: [
      'The National Bureau of Investigation (NBI) is recruiting ',
      'Special Investigators for its various divisions in Metro Manila ',
      'including the Anti-Fraud and Action Division, Anti-Organized ',
      'Crime Division, Cybercrime Division, Anti-Human Trafficking ',
      'Division, and regional offices. NBI Special Investigators ',
      'conduct criminal investigations, gather evidence, prepare ',
      'investigative reports, coordinate with prosecutors and courts, ',
      'conduct surveillance operations, execute search warrants, ',
      'and perform other law enforcement duties under the NBI Act ',
      '(RA 10867). This is a technical investigative position ',
      'requiring strong analytical, communication, and legal skills.'
    ].join(''),

    requirements: [
      'Bachelor\'s degree in Criminology (preferred), Law, Forensic Science, or related field',
      'Registered Criminologist (RC) — PRC Criminologist board passer preferred',
      'Career Service Professional examination passer OR RA 1080 (Board/Bar passer) eligibility',
      'Age: 21–35 years old at time of application',
      'Male or Female; height: at least 5\'4" for males, 5\'2" for females',
      'No pending criminal or administrative case',
      'Must pass NBI physical, medical, psychological, and drug tests',
      'Good oral and written communication in Filipino and English',
      'Willing to be assigned to any NBI division/district office in NCR'
    ],

    documents: [
      'Accomplished NBI Application Form (from NBI HR Division)',
      'PSA Birth Certificate (original + photocopy)',
      'Certified true copy of Diploma and Transcript of Records',
      'PRC Criminologist ID and Board Certificate (if applicable)',
      'Career Service eligibility or board passer certificate',
      'NBI Clearance (for external applicants) — current, within 3 months',
      'Police Clearance (within 3 months)',
      'Medical Certificate from government physician',
      'Drug test result from DOH-accredited laboratory',
      'Neuro-psychiatric clearance',
      '4 pieces 2x2 ID photos (white background)',
      'PSA Marriage Certificate (if married)'
    ],

    howToApply: [
      {
        title: 'Monitor NBI Recruitment Announcements',
        body:  'Visit nbi.gov.ph or the NBI official Facebook page for recruitment announcements. NBI also posts vacancies in the CSC Job Portal and the Official Gazette. Walk-in inquiries are accepted at the NBI HR Division, NBI Compound, Taft Avenue, Manila.'
      },
      {
        title: 'Prepare Your Application Package',
        body:  'Organize all documents in a folder. Criminologists should highlight their RC license prominently. If applying for the Cybercrime Division, include certificates in digital forensics, ethical hacking, or related IT courses.'
      },
      {
        title: 'Submit to NBI HR Division',
        body:  'Submit your application in person to the NBI Human Resources Division at the NBI Building, NBI Compound, Taft Avenue, Ermita, Manila. Office hours: 8AM–5PM, Monday to Friday. Bring both original and photocopies of all documents.'
      },
      {
        title: 'Written Exam and Physical Test',
        body:  'Shortlisted applicants undergo a written examination (investigative aptitude test) and physical fitness test. Successful candidates proceed to medical, dental, psychological, and drug tests, followed by background investigation.'
      },
      {
        title: 'Background Investigation and Training',
        body:  'NBI conducts comprehensive background investigation on all finalists including interviews with character references. Appointees attend the NBI In-Service Training Program before being assigned to their division.'
      }
    ],

    tags: [
      'NBI', 'investigator', 'criminology', 'law enforcement',
      'ncr', 'manila', 'government', 'criminal investigation',
      'forensics', 'cybercrime', 'anti-fraud', 'PRC'
    ],

    sourceUrl: 'https://nbi.gov.ph',
    benefits: [
      'GSIS membership and life insurance',
      'PhilHealth coverage',
      'Pag-IBIG membership',
      'PERA ₱2,000/month',
      'Hazard pay for field operations',
      'Mid-year and Year-end bonus',
      'Cash Gift ₱5,000 (November)',
      '15 days vacation leave + 15 days sick leave (cumulative)',
      'Clothing Allowance: ₱6,000/year',
      'NBI employee benefits and cooperative membership',
      'Career advancement through NBI ranks'
    ]
  }

];