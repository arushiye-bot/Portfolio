// ============================================================
//  YOUR CONTENT. Edit this file only; both games and the
//  classic page are generated from it. Each fact appears once.
// ============================================================
export const SITE = {
  name: 'Arushi',
  title: 'Senior Data Engineer',
  tagline: 'I turn messy enterprise data into trusted, AI-ready lakehouses.',
  email: 'arushiy1610@gmail.com',
  calendly: 'https://calendly.com/your-name',          // TODO: your Calendly link
  links: {
    resume: '/resume.pdf',                              // file lives at public/resume.pdf
    linkedin: 'https://www.linkedin.com/in/arushiy-yy9732',
    github: 'https://github.com/your-handle',          // TODO: your GitHub
  },
};

export const SECTIONS = [
  { id: 'about', short: 'ABOUT', title: 'About me',
    lines: [
      'I love the unglamorous part of data that makes everything else work: knowing where a number came from and whether you can trust it.',
      'My path runs from software engineering in Bangalore to a Master’s in Information Systems at UNT, and now to building governed lakehouses where LLMs and analytics share one source of truth.',
      'Certified: AWS Data Engineer Associate · Azure Databricks Data Engineer Associate.',
    ] },
  { id: 'work', short: 'WORK', title: 'Work experience',
    jobs: [
      { role: 'Senior Software Engineer', company: 'Abbott', when: 'Jun 2025 – Present',
        bullets: ['Run production PySpark and Databricks pipelines handling 8M+ records a day, from raw sources to analytics-ready Gold data.',
                  'Keep the platform fast and lean: heavy history stays in the lakehouse while small, trusted datasets serve Databricks SQL, Snowflake and Power BI.'] },
      { role: 'Specialized Software Engineer', company: 'Charter Communications', when: 'Aug 2024 – Mar 2025',
        bullets: ['Built batch and streaming ingestion that recovers cleanly from late data, replays and failures.',
                  'Shipped governed search and AI-assisted querying on Snowflake Cortex AI with Streamlit.'] },
      { role: 'Software Engineer', company: 'Centene Corporation', when: 'Apr 2020 – Aug 2022',
        bullets: ['Designed a fault-tolerant streaming platform for enterprise telemetry, then scaled AWS pipelines around it with event-driven orchestration.'] },
      { role: 'Software Engineer (intern, then full-time)', company: 'Wells Fargo', when: 'Feb 2018 – Mar 2020',
        bullets: ['Started with Python and BigQuery loads, grew into owning GCP ETL, Airflow scheduling and access controls.'] },
    ] },
  { id: 'skills', short: 'SKILLS', title: 'Skills',
    groups: {
      'Lakehouse & Cloud': ['Databricks', 'Delta Lake', 'Microsoft Fabric', 'Snowflake', 'BigQuery', 'Azure', 'AWS', 'GCP'],
      'AI & Documents': ['LLM extraction', 'RAG', 'Vector Search', 'Mosaic AI', 'Embeddings'],
      'Data Trust': ['Unity Catalog', 'Lineage', 'Data quality gates', 'Entity resolution', 'Data contracts'],
      'Pipelines': ['Airflow', 'Data Factory', 'Kafka', 'Flink', 'NiFi', 'Kinesis', 'dbt'],
      'Languages & Tools': ['Python', 'PySpark', 'SQL', 'Scala', 'Terraform', 'Docker', 'Kubernetes', 'GitHub Actions'],
    } },
  { id: 'contact', short: 'CONTACT', title: 'Contact' },
];

// "Things I'm proud of" shown under Work (kept separate from the job bullets so nothing repeats).
export const PROJECTS = [
  { name: 'Trust layer for Gold data', tags: ['Delta Lake', 'Provenance'], desc: 'Every record carries its source, extraction method, model version and trust tier; anything doubtful goes to an auditable quarantine instead of the dashboard.' },
  { name: 'Identity resolution gates', tags: ['PySpark', 'Entity resolution'], desc: 'Matching with confidence thresholds and survivorship rules that separates verified identities from ambiguous ones before they are promoted.' },
  { name: 'GenAI-ready governed data', tags: ['Mosaic AI', 'Unity Catalog'], desc: 'Lakehouse tables designed so RAG and Vector Search read governed, well-defined data rather than raw text.' },
];

// Used by the ghost game: small ghosts show one when you pop them.
export const FUN_FACTS = [
  'I once studied forklift-operator focus with EEG headsets and smart glasses.',
  'I taught Python to undergrads as a grad TA.',
  'My first degree is in Electronics & Communication.',
  'I have worked on AWS, Azure and Google Cloud.',
  'I finished my Master’s at UNT with a 3.8 GPA.',
  'I started as an intern at Wells Fargo.',
  'Low-confidence data goes to quarantine, not to the dashboard.',
  'Late data is just early data in disguise.',
];

// One thing at each of the 4 checkpoints in the game (points are given once).
export const CHECKPOINTS = [
  { type: 'fact', title: 'Did you know?', emoji: '🧠', text: 'Before lakehouses, I studied how forklift operators focus, using EEG headsets and smart glasses during my time as a research TA at UNT.' },
  { type: 'quiz', title: 'Quick quiz', emoji: '🥇', question: 'In a medallion lakehouse, which layer holds the trusted, analytics-ready data?',
    options: ['Bronze', 'Silver', 'Gold'], answer: 2, explain: 'Gold: raw lands in Bronze, gets cleaned in Silver, and is served from Gold.' },
  { type: 'catch', title: 'Catch the clean records!', emoji: '🧲', text: 'Tap the green records to pass the quality gate. Avoid the red ones: they go to quarantine.' },
  { type: 'fact', title: 'Fun fact', emoji: '🎓', text: 'I taught Python to undergrads as a grad TA. Explaining things simply is a habit I still use with stakeholders.' },
];
