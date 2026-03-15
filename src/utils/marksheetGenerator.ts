export interface SubjectWithMarks {
  subject_area: string;
  isced_code: string;
  subject_name: string;
  max_marks: number;
  marks_obtained: number;
  grade_override?: string;
}

interface MarksheetData {
  exam_level: string;
  session_year: string;
  student_name: string;
  roll_number: string;
  date_of_birth: string;
  gender: string;
  nationality: string;
  school_name: string;
  subjects: SubjectWithMarks[];
  issue_date: string;
  validation_code: string;
  photo_url?: string;
  father_name?: string;
  mother_name?: string;
  exam_centre?: string;
  grading_system_name?: string;
}

function getEctsGrade(percentage: number): string {
  if (percentage >= 90) return "A";
  if (percentage >= 85) return "B+";
  if (percentage >= 80) return "B";
  if (percentage >= 75) return "C+";
  if (percentage >= 70) return "C";
  if (percentage >= 65) return "C-";
  if (percentage >= 60) return "D+";
  if (percentage >= 55) return "D";
  if (percentage >= 50) return "D-";
  return "F";
}

function getGradeClass(grade: string): string {
  if (grade === "A" || grade === "B+" || grade === "B") return "c-plus";
  if (grade === "C+" || grade === "C") return "c-base";
  if (grade === "C-") return "c-minus";
  if (grade === "D+") return "d-plus";
  if (grade === "D") return "d-base";
  return "d-minus";
}

function getBarColor(pct: number): string {
  if (pct >= 75) return "#2d6a4f";
  if (pct >= 60) return "#b89a52";
  return "#9b3a22";
}

function formatDateDisplay(dateStr: string): string {
  if (!dateStr) return "—";
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  } catch {
    return dateStr;
  }
}

function calculateAge(dob: string, examDate?: string): string {
  if (!dob) return "—";
  try {
    const birth = new Date(dob);
    const ref = examDate ? new Date(examDate) : new Date();
    let years = ref.getFullYear() - birth.getFullYear();
    let months = ref.getMonth() - birth.getMonth();
    if (months < 0) { years--; months += 12; }
    return `${years} years, ${months} months`;
  } catch {
    return "—";
  }
}

export function generateMarksheetHtml(data: MarksheetData): string {
  const gradingLabel = data.grading_system_name || "ECTS";
  const totalObtained = data.subjects.reduce((s, sub) => s + sub.marks_obtained, 0);
  const totalMax = data.subjects.reduce((s, sub) => s + sub.max_marks, 0);
  const percentage = totalMax > 0 ? ((totalObtained / totalMax) * 100) : 0;
  const percentageStr = percentage.toFixed(1);
  const overallGrade = getEctsGrade(percentage);
  const status = percentage >= 50 ? "Pass" : "Fail";
  const totalSubjects = data.subjects.length;

  const fullWeight = data.subjects.filter(s => s.max_marks === 100);
  const coCurr = data.subjects.filter(s => s.max_marks === 50);
  const fwObt = fullWeight.reduce((s, x) => s + x.marks_obtained, 0);
  const fwMax = fullWeight.reduce((s, x) => s + x.max_marks, 0);
  const ccObt = coCurr.reduce((s, x) => s + x.marks_obtained, 0);
  const ccMax = coCurr.reduce((s, x) => s + x.max_marks, 0);
  const fwPct = fwMax > 0 ? ((fwObt / fwMax) * 100).toFixed(1) + "%" : "—";
  const ccPct = ccMax > 0 ? ((ccObt / ccMax) * 100).toFixed(1) + "%" : "—";

  const subjectPcts = data.subjects.map(s => {
    const pct = s.max_marks > 0 ? (s.marks_obtained / s.max_marks) * 100 : 0;
    return {
      name: s.subject_name,
      pct,
      obtained: s.marks_obtained,
      max: s.max_marks,
      grade: s.grade_override || getEctsGrade(pct),
    };
  });
  const best = subjectPcts.reduce((a, b) => a.pct >= b.pct ? a : b, subjectPcts[0]);
  const lowest = subjectPcts.reduce((a, b) => a.pct <= b.pct ? a : b, subjectPcts[0]);

  const cGrades = data.subjects.filter(s => {
    const pct = s.max_marks > 0 ? (s.marks_obtained / s.max_marks) * 100 : 0;
    const g = s.grade_override || getEctsGrade(pct);
    return g.startsWith("C") || g === "A" || g.startsWith("B");
  });
  const dGrades = data.subjects.filter(s => {
    const pct = s.max_marks > 0 ? (s.marks_obtained / s.max_marks) * 100 : 0;
    const g = s.grade_override || getEctsGrade(pct);
    return g.startsWith("D") || g === "F";
  });
  const circumference = 251.33;
  const donutCDash = totalSubjects > 0 ? (cGrades.length / totalSubjects) * circumference : 0;

  const photoHtml = data.photo_url
    ? `<img src="${data.photo_url}" style="width:90px;height:110px;object-fit:cover;border:1px solid #ccc;" />`
    : `<div style="width:90px;height:110px;border:1px dashed #ccc;display:flex;align-items:center;justify-content:center;font-size:10px;color:#999;">Affix Photo</div>`;

  const barRows = data.subjects.map((sub) => {
    const pct = sub.max_marks > 0 ? (sub.marks_obtained / sub.max_marks) * 100 : 0;
    const grade = sub.grade_override || getEctsGrade(pct);
    const color = getBarColor(pct);
    return `<div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;">
      <span style="width:140px;font-size:11px;text-align:right;">${sub.subject_name}</span>
      <div style="flex:1;background:#eee;height:16px;border-radius:4px;overflow:hidden;">
        <div style="width:${pct}%;background:${color};height:100%;border-radius:4px;"></div>
      </div>
      <span style="font-size:11px;width:60px;">${sub.marks_obtained}/${sub.max_marks}</span>
      <span style="font-size:11px;font-weight:bold;width:30px;">${grade}</span>
    </div>`;
  }).join("\n");

  const tableRows = data.subjects.map((sub, i) => {
    const pct = sub.max_marks > 0 ? (sub.marks_obtained / sub.max_marks) * 100 : 0;
    const grade = sub.grade_override || getEctsGrade(pct);
    return `<tr>
      <td style="padding:6px;border:1px solid #ddd;text-align:center;">${i + 1}</td>
      <td style="padding:6px;border:1px solid #ddd;">${sub.subject_area}</td>
      <td style="padding:6px;border:1px solid #ddd;text-align:center;">${sub.isced_code}</td>
      <td style="padding:6px;border:1px solid #ddd;">${sub.subject_name}</td>
      <td style="padding:6px;border:1px solid #ddd;text-align:center;">${sub.max_marks}</td>
      <td style="padding:6px;border:1px solid #ddd;text-align:center;">${sub.marks_obtained}</td>
      <td style="padding:6px;border:1px solid #ddd;text-align:center;">${pct.toFixed(1)}%</td>
      <td style="padding:6px;border:1px solid #ddd;text-align:center;font-weight:bold;">${grade}</td>
    </tr>`;
  }).join("\n");

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Statement of Results - ${data.student_name}</title>
<style>
  body { font-family: 'Georgia', serif; margin:0; padding:20px; background:#f5f5f0; color:#333; }
  .container { max-width:900px; margin:0 auto; background:white; padding:40px; border:2px solid #2d3748; }
  .header { text-align:center; border-bottom:3px double #2d3748; padding-bottom:20px; margin-bottom:20px; }
  .header h1 { font-size:18px; color:#1a365d; margin:0; letter-spacing:2px; }
  .header h2 { font-size:24px; color:#2d3748; margin:10px 0 5px; }
  .header .doc-no { font-size:11px; color:#666; }
  .section { margin:20px 0; }
  .section-title { font-size:14px; font-weight:bold; color:#1a365d; border-bottom:1px solid #ddd; padding-bottom:4px; margin-bottom:10px; }
  .info-grid { display:grid; grid-template-columns:1fr 1fr; gap:8px; }
  .info-row { display:flex; justify-content:space-between; font-size:12px; padding:4px 0; }
  .info-label { color:#666; }
  .info-value { font-weight:600; }
  .stats-row { display:flex; justify-content:space-around; text-align:center; padding:15px 0; background:#f7fafc; border-radius:8px; }
  .stat-item .stat-value { font-size:24px; font-weight:bold; color:#1a365d; }
  .stat-item .stat-label { font-size:10px; color:#666; text-transform:uppercase; }
  table { width:100%; border-collapse:collapse; font-size:12px; }
  th { background:#1a365d; color:white; padding:8px; text-align:center; }
  .footer { margin-top:30px; text-align:center; font-size:10px; color:#666; border-top:2px solid #2d3748; padding-top:15px; }
  @media print { body { background:white; } .container { border:none; } }
</style>
</head>
<body>
<div class="container">
  <div class="header">
    <h1>NSCU — National Science & Comprehensive University</h1>
    <h2>Statement of Results</h2>
    <p style="font-size:12px;color:#555;">${data.exam_level} · ${data.session_year} · ${gradingLabel} Framework</p>
    <p class="doc-no">Document No. ${data.validation_code}</p>
  </div>

  <div style="display:flex;gap:20px;align-items:flex-start;">
    <div style="flex:1;">
      <div class="section">
        <div class="section-title">Candidate Details</div>
        <div class="info-row"><span class="info-label">Full Name</span><span class="info-value">${data.student_name}</span></div>
        <div class="info-row"><span class="info-label">Date of Birth</span><span class="info-value">${formatDateDisplay(data.date_of_birth)}</span></div>
        <div class="info-row"><span class="info-label">Age at Examination</span><span class="info-value">${calculateAge(data.date_of_birth, data.issue_date)}</span></div>
        <div class="info-row"><span class="info-label">Candidate ID</span><span class="info-value">${data.roll_number}</span></div>
        ${data.father_name ? `<div class="info-row"><span class="info-label">Father's Name</span><span class="info-value">${data.father_name}</span></div>` : ''}
        ${data.mother_name ? `<div class="info-row"><span class="info-label">Mother's Name</span><span class="info-value">${data.mother_name}</span></div>` : ''}
        <div class="info-row"><span class="info-label">Issue Date</span><span class="info-value">${formatDateDisplay(data.issue_date)}</span></div>
        <div class="info-row"><span class="info-label">Examination</span><span class="info-value">${data.exam_level}</span></div>
        <div class="info-row"><span class="info-label">School/Institution</span><span class="info-value">${data.school_name || '—'}</span></div>
      </div>
    </div>
    <div>${photoHtml}</div>
  </div>

  <div class="section">
    <div class="section-title">Performance Overview</div>
    <div class="stats-row">
      <div class="stat-item"><div class="stat-value">${totalMax}</div><div class="stat-label">Total Marks</div></div>
      <div class="stat-item"><div class="stat-value">${totalObtained}</div><div class="stat-label">Obtained</div></div>
      <div class="stat-item"><div class="stat-value">${percentageStr}%</div><div class="stat-label">Percentage</div></div>
      <div class="stat-item"><div class="stat-value">${totalSubjects}</div><div class="stat-label">Subjects</div></div>
      <div class="stat-item"><div class="stat-value">${status}</div><div class="stat-label">Result</div></div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Subject Performance</div>
    ${barRows}
  </div>

  <div class="section">
    <div class="section-title">Detailed Subject Record</div>
    <table>
      <thead><tr>
        <th>S.No</th><th>Subject Area</th><th>ISCED</th><th>Subject Name</th><th>Max</th><th>Obtained</th><th>%</th><th>${gradingLabel}</th>
      </tr></thead>
      <tbody>${tableRows}</tbody>
    </table>
  </div>

  <div class="footer">
    <p><strong>NSCU — National Science & Comprehensive University</strong></p>
    <p>${data.exam_level} · ${data.session_year} · Statement of Results · Strictly Confidential</p>
    <p style="margin-top:20px;">Authorised Signatory — Examinations Registrar</p>
  </div>
</div>
</body>
</html>`;
}

export { getEctsGrade };
