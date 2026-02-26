import { Briefcase, GraduationCap, Award, MapPin, Calendar, Wrench } from "lucide-react";

const About = () => {
  return (
    <div className="content-width page-section space-y-12">
      {/* Header Section */}
      <section className="space-y-6 animate-fade-in">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">About</h1>
        <div className="bg-white dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-800 p-8">
          <div className="space-y-4 text-gray-600 dark:text-gray-300 leading-relaxed">
            <p className="text-lg">
              Full-stack Developer with experience building scalable microservices and event-driven systems using Spring Boot, Node.js, 
              and React. Skilled in backend development, API design, database optimization, and multi-tenant SaaS platforms.
            </p>
            <p>
              Proven ability to improve performance, reliability, and application scalability while delivering secure enterprise solutions. 
              Currently working at OSI Digital Pvt Ltd as an Associate Software Engineer, leading backend and frontend development for enterprise applications.
            </p>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section className="animate-fade-in" style={{ animationDelay: "100ms" }}>
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2.5 bg-blue-50 dark:bg-blue-950/50 rounded-lg border border-blue-200 dark:border-blue-800/50">
            <Briefcase className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Experience</h2>
        </div>
        
        <div className="space-y-8">
          {experience.map((item) => (
            <div key={item.role} className="bg-white dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-800 p-8">
              <div className="space-y-6">
                <div className="border-b border-gray-100 dark:border-gray-800 pb-4">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{item.role}</h3>
                  <p className="text-lg text-blue-600 dark:text-blue-400 font-medium mb-3">{item.company}</p>
                  <div className="flex flex-wrap gap-6 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{item.period}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>Hyderabad, India</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  {item.descriptions.map((description, descIndex) => (
                    <div key={descIndex} className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-600 rounded-full mt-2.5 flex-shrink-0"></div>
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Skills Section */}
      <section className="animate-fade-in" style={{ animationDelay: "200ms" }}>
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2.5 bg-green-50 dark:bg-green-950/50 rounded-lg border border-green-200 dark:border-green-800/50">
            <Wrench className="w-5 h-5 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Skills & Technologies</h2>
        </div>
        
        <div className="space-y-6">
          {skillGroups.map((group) => (
            <div key={group.category} className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                {group.category}
              </h3>
              <div className="flex flex-wrap gap-2">
                {group.skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium
                             border border-gray-200 dark:border-gray-700
                             bg-gray-50 text-gray-700 dark:bg-gray-800 dark:text-gray-300
                             transition-colors duration-200"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Education Section */}
      <section className="animate-fade-in" style={{ animationDelay: "300ms" }}>
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2.5 bg-purple-50 dark:bg-purple-950/50 rounded-lg border border-purple-200 dark:border-purple-800/50">
            <GraduationCap className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Education</h2>
        </div>
        
        <div className="space-y-4">
          {education.map((item) => (
            <div key={item.degree} className="bg-white dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex-grow">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{item.degree}</h3>
                  <p className="text-purple-600 dark:text-purple-400 font-medium mb-2">
                    {item.school.split('(')[0].trim()}
                  </p>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{item.year}</span>
                    </div>
                    {item.school.includes('(') && (
                      <span className="px-2 py-1 bg-green-50 dark:bg-green-950/50 text-green-700 dark:text-green-400 rounded-md text-sm font-medium border border-green-200 dark:border-green-800/50">
                        {item.school.split('(')[1].replace(')', '')}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Certifications Section */}
      <section className="animate-fade-in" style={{ animationDelay: "400ms" }}>
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2.5 bg-orange-50 dark:bg-orange-950/50 rounded-lg border border-orange-200 dark:border-orange-800/50">
            <Award className="w-5 h-5 text-orange-600 dark:text-orange-400" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Certifications</h2>
        </div>
        
        <div className="space-y-4">
          {certifications.map((item) => (
            <div key={item.title} className="bg-white dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex-grow">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{item.title}</h3>
                  <p className="text-orange-600 dark:text-orange-400 font-medium mb-2">{item.issuer}</p>
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <Calendar className="w-4 h-4" />
                    <span>{item.year}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

const experience = [
  { 
    period: "June 2024 — Present", 
    role: "Associate Software Engineer", 
    company: "OSI Digital Pvt Ltd",
    descriptions: [
      "Led backend development for the Electronic Employee File Cabinet (EEFC) module in the myBBSI HRIS portal, a secure and centralized digital repository for employee documents integrated with Box.",
      "Designed a microservices architecture using a centralized API Gateway and Apache Kafka for asynchronous communication across authentication and email services, enabling streamlined inter-service coordination and achieving 99.5% uptime through fault-tolerant design.",
      "Performed database optimization through query tuning and indexing strategies, reducing page load times by 45%.",
      "Implemented a multi-tenant SaaS platform (Performance Management) for PEO companies with strict tenant data isolation and role-based access control (RBAC) for enterprise-grade reliability.",
      "Designed reusable React components, standardized API interaction patterns and improved performance by 80%."
    ]
  },
  { 
    period: "Jan 2024 — April 2024", 
    role: "AI ML Intern", 
    company: "OSI Digital Pvt Ltd",
    descriptions: [
      "Built an automated Customer Satisfaction (CSAT) report generation system to streamline data collection, processing, and feedback workflows.",
      "Eliminated manual data entry by automating report creation and scheduled email dispatch, improving accuracy and efficiency.",
      "Developed an interactive dashboard to visualize CSAT metrics and provide actionable insights for customer service improvement.",
      "Implemented reliable data management and processing pipelines for consistent reporting.",
      "Designed and integrated the system using React, FastAPI, Playwright, SMTP, and MySQL.",
      "Designed and implemented machine learning models using Python, focusing on tasks such as classification, regression, and clustering.",
      "Integrated Generative AI applications using frameworks like LangChain, enabling advanced functionalities like Retrieval-Augmented Generation (RAG) and intelligent agents.",
      "Developed and deployed RESTful APIs using FastAPI to integrate AI models into applications.",
      "Utilized Git for version control and collaborated with cross-functional teams to ensure seamless integration and deployment processes."
    ]
  },
];

const skillGroups = [
  { category: "Languages", skills: ["Java", "JavaScript", "TypeScript", "Python", "C"] },
  { category: "Frontend", skills: ["React", "Angular", "TailwindCSS", "HTML", "CSS"] },
  { category: "Backend", skills: ["Spring Boot", "Node.js", "Microservices", "Apache Kafka", "REST APIs"] },
  { category: "Databases", skills: ["MySQL", "PostgreSQL", "MongoDB", "Prisma"] },
  { category: "Cloud & Tools", skills: ["AWS", "Git", "Docker", "Event-Driven Architecture"] },
];

const education = [
  { year: "2020-2024", degree: "B.E Computer Science and Engineering", school: "University College of Engineering, Osmania University (CGPA: 8.8)" },
  { year: "2018-2020", degree: "Intermediate (MPC)", school: "Kakatiya Junior College (Percentage: 97.5%)" },
  { year: "2018", degree: "SSC", school: "Indrani High School (CGPA: 9.8)" },
];

const certifications = [
  { year: "2024", title: "AWS Certified Cloud Practitioner", issuer: "Amazon Web Services" },
];

export default About;
