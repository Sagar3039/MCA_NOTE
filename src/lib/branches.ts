export const BRANCHES = {
  science_ug: {
    label: '🔬 Science (B.Sc / B.Sc Hons)',
    options: [
      'Physics',
      'Chemistry',
      'Mathematics',
      'Zoology',
      'Botany',
      'Microbiology',
      'Physiology',
      'Nutrition',
      'Statistics',
      'Electronics',
      'Computer Science',
    ],
  },
  arts_ug: {
    label: '📚 Arts (B.A / B.A Hons)',
    options: [
      'Bengali',
      'English',
      'History',
      'Sanskrit',
      'Philosophy',
      'Geography',
      'Sociology',
      'Education',
      'Hindi',
      'Economics',
      'Political Science',
      'Physical Education',
    ],
  },
  professional: {
    label: '💻 Professional Course',
    options: [
      'Bachelor of Computer Application (BCA)',
    ],
  },
  science_pg: {
    label: '🎓 M.Sc (Science)',
    options: [
      'Physics (M.Sc)',
      'Chemistry (M.Sc)',
      'Mathematics (M.Sc)',
      'Zoology (M.Sc)',
      'Botany (M.Sc)',
      'Physiology (M.Sc)',
      'Computer Science (M.Sc)',
    ],
  },
  arts_pg: {
    label: '🎓 M.A (Arts)',
    options: [
      'Bengali (M.A)',
      'English (M.A)',
      'Sanskrit (M.A)',
      'History (M.A)',
      'Political Science (M.A)',
      'Philosophy (M.A)',
      'Geography (M.A)',
    ],
  },
  certificate: {
    label: '📜 Certificate & Extra Courses',
    options: [
      'B.A with Physical Education',
      'Certificate: Journalism & Mass Communication',
      'Certificate: Travel & Tourism',
      'Certificate: Film Study',
      'Certificate: Rural Development',
    ],
  },
};

// Flatten all options for easy access
export const ALL_BRANCHES = Object.values(BRANCHES).flatMap(
  (category) => category.options
);

// Get display name with category
export const getBranchDisplayLabel = (branch: string): string => {
  for (const category of Object.values(BRANCHES)) {
    if (category.options.includes(branch)) {
      return `${category.label} - ${branch}`;
    }
  }
  return branch;
};
