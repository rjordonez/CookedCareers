export interface Resume {
  id: string;
  title: string;
  company: string;
  school: string;
  yearsOfExperience: number;
  tags: string[];
  imageUrl: string;
  keywords: string;
}

const companies = [
  'Google', 'Meta', 'Amazon', 'Microsoft', 'Apple', 'Netflix', 'Nvidia',
  'Tesla', 'SpaceX', 'Uber', 'Lyft', 'Airbnb', 'Stripe', 'Coinbase',
  'DoorDash', 'Instacart', 'Snapchat', 'Twitter', 'LinkedIn', 'Salesforce'
];

const schools = [
  'Stanford', 'MIT', 'UC Berkeley', 'Carnegie Mellon', 'Harvard',
  'Caltech', 'Princeton', 'Yale', 'Cornell', 'Columbia',
  'USC', 'UCLA', 'University of Washington', 'Georgia Tech', 'UIUC'
];

const roles = [
  'Software Engineer', 'Senior Software Engineer', 'Staff Engineer',
  'Product Manager', 'Data Scientist', 'ML Engineer', 'Frontend Engineer',
  'Backend Engineer', 'Full Stack Engineer', 'DevOps Engineer'
];

const tags = [
  'Python', 'JavaScript', 'TypeScript', 'React', 'Node.js', 'AWS',
  'System Design', 'Machine Learning', 'Data Structures', 'Algorithms'
];

const images = [
  '/src/assets/resume-blur-1.jpg',
  '/src/assets/resume-blur-2.jpg',
  '/src/assets/resume-blur-3.jpg',
  '/src/assets/resume-blur-4.jpg'
];

export const generateMockResumes = (count: number): Resume[] => {
  return Array.from({ length: count }, (_, i) => {
    const company = companies[Math.floor(Math.random() * companies.length)];
    const school = schools[Math.floor(Math.random() * schools.length)];
    const role = roles[Math.floor(Math.random() * roles.length)];
    const yearsOfExperience = Math.floor(Math.random() * 15) + 1;
    const resumeTags = Array.from(
      { length: 3 + Math.floor(Math.random() * 3) },
      () => tags[Math.floor(Math.random() * tags.length)]
    );
    
    return {
      id: `resume-${i + 1}`,
      title: role,
      company,
      school,
      yearsOfExperience,
      tags: [...new Set(resumeTags)],
      imageUrl: images[i % images.length],
      keywords: `${role} ${company} ${school} ${resumeTags.join(' ')}`
    };
  });
};

export const mockResumes = generateMockResumes(100);
