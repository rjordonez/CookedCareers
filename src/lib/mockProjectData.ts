export interface Project {
  id: string;
  title: string;
  company: string;
  type: string;
  complexity: string;
  tags: string[];
  imageUrl: string;
  keywords: string;
}

const companies = [
  'Google', 'Meta', 'Amazon', 'Microsoft', 'Apple', 'Netflix', 'Nvidia',
  'Tesla', 'SpaceX', 'Uber', 'Lyft', 'Airbnb', 'Stripe', 'Coinbase',
  'DoorDash', 'Instacart', 'Snapchat', 'Twitter', 'LinkedIn', 'Salesforce',
  'Personal Project', 'Open Source', 'Startup'
];

const projectTypes = [
  'Web Application', 'Mobile App', 'CLI Tool', 'API/Backend',
  'Machine Learning', 'Data Pipeline', 'DevOps Tool', 'Game',
  'Browser Extension', 'Desktop App', 'Library/Framework'
];

const projectTitles = [
  'E-commerce Platform', 'Social Media Dashboard', 'Task Management System',
  'Real-time Chat App', 'Video Streaming Service', 'ML Model Deployment',
  'CI/CD Pipeline', 'Data Visualization Tool', 'Authentication System',
  'Payment Gateway', 'Content Management System', 'API Gateway',
  'Monitoring Dashboard', 'Analytics Platform', 'Recommendation Engine',
  'Search Engine', 'Scheduling System', 'Inventory Management',
  'Customer Portal', 'Admin Dashboard'
];

const tags = [
  'React', 'TypeScript', 'Node.js', 'Python', 'Django', 'Flask',
  'PostgreSQL', 'MongoDB', 'Redis', 'AWS', 'Docker', 'Kubernetes',
  'GraphQL', 'REST API', 'WebSocket', 'Machine Learning', 'TensorFlow',
  'Next.js', 'Vue.js', 'Express', 'FastAPI', 'Microservices',
  'Serverless', 'CI/CD', 'Testing', 'Security'
];

const complexityLevels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

const images = [
  '/src/assets/resume-blur-1.jpg',
  '/src/assets/resume-blur-2.jpg',
  '/src/assets/resume-blur-3.jpg',
  '/src/assets/resume-blur-4.jpg'
];

export const generateMockProjects = (count: number): Project[] => {
  return Array.from({ length: count }, (_, i) => {
    const company = companies[Math.floor(Math.random() * companies.length)];
    const type = projectTypes[Math.floor(Math.random() * projectTypes.length)];
    const title = projectTitles[Math.floor(Math.random() * projectTitles.length)];
    const complexity = complexityLevels[Math.floor(Math.random() * complexityLevels.length)];
    const projectTags = Array.from(
      { length: 3 + Math.floor(Math.random() * 3) },
      () => tags[Math.floor(Math.random() * tags.length)]
    );
    
    return {
      id: `project-${i + 1}`,
      title,
      company,
      type,
      complexity,
      tags: [...new Set(projectTags)],
      imageUrl: images[i % images.length],
      keywords: `${title} ${company} ${type} ${complexity} ${projectTags.join(' ')}`
    };
  });
};

export const mockProjects = generateMockProjects(100);
