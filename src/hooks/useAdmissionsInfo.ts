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
    // Always show Fall 2026 admission information
    return {
      semester: 'Fall',
      year: 2026,
      title: 'Fall 2026 Admissions Open',
      newsText: 'Applications are now open for Fall 2026 Intake. Join NSCU Belize for globally recognized degrees starting January 2026.',
      deadlineText: 'Application deadline: January 5th, 2026. Course starting date: January 15th, 2026.'
    };
  }, []);
};