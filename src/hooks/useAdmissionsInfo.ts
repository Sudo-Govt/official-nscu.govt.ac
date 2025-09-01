import { useMemo } from 'react';

interface AdmissionsInfo {
  semester: 'Spring' | 'Fall';
  year: number;
  title: string;
  newsText: string;
  deadlineText: string;
}

export const useAdmissionsInfo = (): AdmissionsInfo => {
  return useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth() + 1; // getMonth() returns 0-11
    const currentYear = now.getFullYear();
    
    // September (9) to December (12) = Spring next year
    // January (1) to August (8) = Fall current year
    if (currentMonth >= 9 && currentMonth <= 12) {
      // Show Spring admissions for next year
      const admissionYear = currentYear + 1;
      return {
        semester: 'Spring',
        year: admissionYear,
        title: `Spring ${admissionYear} Admissions Open`,
        newsText: `Applications are now open for Spring ${admissionYear} Intake. Join NSCU Belize for globally recognized degrees.`,
        deadlineText: `Application deadlines close in October ${currentYear}.`
      };
    } else {
      // Show Fall admissions for current year
      return {
        semester: 'Fall',
        year: currentYear,
        title: `Fall ${currentYear} Admissions Open`,
        newsText: `Applications are now open for Fall ${currentYear} Intake. Secure your spot at NSCU Belize.`,
        deadlineText: `Application deadlines close in March ${currentYear}.`
      };
    }
  }, []);
};