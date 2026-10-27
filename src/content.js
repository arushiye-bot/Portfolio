// ============================================================
//  YOUR CONTENT. Edit this file only. Each fact appears once.
// ============================================================
export const SITE = {
  name: 'Arushi',
  title: 'Gen AI Data Engineer',
  tagline: 'Lakehouses on Databricks and Synapse, streaming on Kafka, and an LLM layer on top.',
  email: 'arushiy1610@gmail.com',
  calendly: 'https://calendly.com/arushiye/30min',
  links: {
    resume: '/resume.pdf',                              // file lives at public/resume.pdf
    linkedin: 'https://www.linkedin.com/in/arushiy-yy9732',
    github: 'https://github.com/arushiye-bot',
  },
};

// Certifications (shown inside Skills, in the game card and on the classic page).
export const CERTS = [
  { name: 'AWS Certified', detail: 'Data Engineer – Associate' },
  { name: 'Azure Databricks', detail: 'Data Engineer – Associate' },
];

// Skill chip colours: az, st, aw, ai, db, dv
export const SECTIONS = [
  { id: 'about', short: 'ABOUT', title: 'About me',
    lines: [
      'I build Azure-first data platforms: medallion lakehouses on Databricks and Synapse, orchestrated with Data Factory and Lakeflow Jobs and shipped through Databricks Asset Bundles.',
      'I also work across AWS (EMR, Glue, Redshift, Athena, Lambda) and add the AI layer: embeddings, vector search, LangChain and LangGraph agents, and Databricks Genie for natural-language data questions.',
      'I have worked in healthcare, telecom and financial services, and I care most about data teams can trust and move fast on.',
    ] },
  { id: 'work', short: 'WORK', title: 'Work experience',
    jobs: [
      { role: 'Senior Software Engineer', company: 'Abbott', industry: 'Healthcare · CGM devices', when: 'Jun 2025 – Present',
        bullets: [
          'Built medallion pipelines on Azure Databricks and Delta Lake that process 8M+ records a day of CGM (continuous glucose monitor) data, covering device events, failures and usage, into trusted Gold tables governed with Unity Catalog and Volumes.',
          'Cut a slow Spark job by 60% with Adaptive Query Execution and data-skew handling, so the analytics team sees device-failure trends sooner.',
          'Ingested with Lakeflow Connect and Declarative Pipelines, run by Lakeflow Jobs with retries and alerting, so failure and usage data stays fresh and issues are caught early.',
          'Used LLMs, NLP, vector embeddings, LangChain and LangGraph to turn documents and text into structured attributes with confidence scores.',
          'Shipped from GitHub with the Databricks CLI and Asset Bundles (DAB), and used Databricks Genie so analysts can ask the Gold data questions in plain English.'],
        tags: [['Databricks', 'az'], ['Unity Catalog', 'az'], ['Lakeflow', 'az'], ['Genie', 'az'], ['DAB', 'az'], ['LangGraph', 'ai'], ['Embeddings', 'ai']] },
      { role: 'Specialized Software Engineer', company: 'Charter Communications', industry: 'Telecommunications', when: 'Aug 2024 – Mar 2025',
        bullets: [
          'Built Spark pipelines on Azure Synapse and Databricks that bring network and service data together so teams can analyse and report on network outages.',
          'Orchestrated the workflows with Azure Data Factory, using dependencies, retries and alerting, so reports arrived on time.',
          'Handled streaming outage and event data with Kafka and Spark Structured Streaming, built to survive late and replayed data.',
          'Cut run time and compute cost by 40% through better clustering and partitioning of large Snowflake tables.',
          'Built dbt layers with consistent data models so every reporting team uses the same definitions, plus semantic search on Snowflake Cortex AI.'],
        tags: [['Synapse', 'az'], ['Data Factory', 'az'], ['Kafka', 'st'], ['Structured Streaming', 'st'], ['Snowflake', 'db'], ['dbt', 'dv']] },
      { role: 'Software Engineer', company: 'Centene Corporation', industry: 'Healthcare insurance', when: 'Apr 2020 – Aug 2022',
        bullets: [
          'Built streaming ingestion on Kafka, NiFi and HBase for patient and member data that analytics and reporting teams depend on, with durable processing and replay.',
          'Built AWS pipelines on S3, EMR, Glue, Lambda and Redshift with incremental loads into analytics.',
          'Improved performance by 70% by filtering and pre-aggregating before joins and fixing skewed keys in the pipelines feeding patient-data analytics.',
          'Orchestrated with Step Functions and EventBridge, with CloudWatch logging and failure alerts.',
          'Queried S3 data with Athena and ran workloads on EC2, with audit-ready metadata and governed access to sensitive healthcare data.'],
        tags: [['S3', 'aw'], ['EMR', 'aw'], ['Glue', 'aw'], ['Athena', 'aw'], ['EC2', 'aw'], ['Redshift', 'aw'], ['Kafka', 'st']] },
      { role: 'Software Engineer (intern, then full-time)', company: 'Wells Fargo', industry: 'Financial services', when: 'Feb 2018 – Mar 2020',
        bullets: [
          'Started as an intern loading data into BigQuery and grew into owning the GCP ETL for enterprise banking data.',
          'Onboarded source systems and mapped schemas so customer and account data was published as curated tables for analytics and reporting.',
          'Scheduled with Airflow (retries, backfills) and secured data with Cloud IAM roles.'],
        tags: [['GCP', 'dv'], ['BigQuery', 'db'], ['Airflow', 'st'], ['PySpark', 'dv']] },
      { role: 'Graduate Teaching Assistant', company: 'University of North Texas', industry: 'Teaching and research', when: 'May 2023 – May 2024',
        bullets: [
          'Taught undergraduate Python as a grad TA.',
          'Collected and prepared EEG and smart-glasses video data for a forklift-operator focus study.',
          'Built the workflows that organised and validated that research data.'],
        tags: [['Python', 'dv'], ['Data processing', 'st']] },
    ] },
  { id: 'skills', short: 'SKILLS', title: 'Skills',
    groups: [
      { name: 'Azure & Databricks', cls: 'az', items: ['Azure Databricks', 'Azure Synapse (Apache Spark)', 'Unity Catalog', 'Delta Lake', 'Volumes', 'Lakeflow Connect', 'Lakeflow Declarative Pipelines', 'Lakeflow Jobs', 'Databricks Genie', 'Databricks Asset Bundles (CLI)', 'Azure Data Factory'] },
      { name: 'Pipelines & Streaming', cls: 'st', items: ['Medallion architecture', 'Data modeling', 'Spark Structured Streaming', 'Apache Kafka', 'Workflow orchestration', 'Alerting & monitoring'] },
      { name: 'AWS', cls: 'aw', items: ['S3', 'EMR', 'Glue', 'Redshift', 'Athena', 'Lambda', 'EC2'] },
      { name: 'LLMs & AI', cls: 'ai', items: ['LLMs', 'NLP', 'Vector embeddings', 'Semantic search', 'LangChain', 'LangGraph', 'RAG'] },
      { name: 'Databases', cls: 'db', items: ['Snowflake', 'PostgreSQL', 'MongoDB', 'MySQL', 'Oracle', 'Teradata', 'Redis'] },
      { name: 'Code & DevOps', cls: 'dv', items: ['Python', 'PySpark', 'SQL', 'GitHub', 'GitHub Actions', 'Terraform', 'Docker'] },
    ] },
  { id: 'contact', short: 'CONTACT', title: 'Let’s connect' },
];

export const PROJECTS = [
  {
    name: 'This portfolio: a playable game',
    desc: 'A pixel-art side-scroller where each block, checkpoint and fun fact reveals a part of my story, with a classic scrolling mode and a 3D moon.',
    link: 'https://github.com/arushiye-bot/Portfolio',   // TODO: your real repo name
    live: '',                                                // optional: your Vercel link
    tools: ['React', 'Vite', 'Framer Motion', 'three.js', 'React Three Fiber', 'HTML Canvas', 'Web Audio', 'GitHub', 'Vercel'],
  },
];

// Fun facts that float in a yellow bar when you bump the single bricks (+20 once each).
export const BRICK_FACTS = [
  'Fun fact: my pipelines at Abbott process 8M+ CGM device records every single day.',
  'Fun fact: before lakehouses, I analysed EEG brainwaves of forklift operators to study focus.',
  'Fun fact: I started at Wells Fargo as an intern and ended up owning the ETL.',
  'Fun fact: my data work spans healthcare, telecom and banking, on three clouds.',
  'Fun fact: I taught Python to undergrads as a grad TA.',
  'Fun fact: a 60% faster Spark job started with finding one skewed key.',
];

// One highlight at each checkpoint. A card with "game" offers an optional 20-second challenge.
// Recruiter mode skips games and only flashes the highlight.
export const CHECKPOINTS = [
  { title: 'The scale', emoji: '📈', highlight: '8M+ records a day: medallion pipelines on Databricks processing CGM device events, failures and usage.', game: null },
  { title: 'Certified', emoji: '🏅', highlight: 'AWS Certified Data Engineer Associate and Azure Databricks Data Engineer Associate.',
    game: { label: 'Quick quiz', type: 'quiz', question: 'In a medallion lakehouse, which layer holds the trusted, analytics-ready data?',
      options: ['Bronze', 'Silver', 'Gold'], answer: 2, explain: 'Gold: raw lands in Bronze, gets cleaned in Silver, and is served from Gold.' } },
  { title: 'Faster and cheaper', emoji: '⚡', highlight: '60% faster Spark job at Abbott, 40% lower run time and cost at Charter, 70% better join performance at Centene.',
    game: { label: 'Match the tool', type: 'match', text: 'Tap the tool that fits each job. No timer, and wrong picks just try again.',
      rounds: [
        { job: 'Stream events in real time', options: ['Apache Kafka', 'Power BI', 'Terraform'], answer: 0 },
        { job: 'Store tables with ACID and time travel', options: ['Delta Lake', 'Redis', 'Tableau'], answer: 0 },
        { job: 'Govern data access and lineage in Databricks', options: ['Unity Catalog', 'EC2', 'Airflow'], answer: 0 },
        { job: 'Chain LLM steps into an agent', options: ['LangGraph', 'Teradata', 'Jenkins'], answer: 0 },
      ] } },
  { title: 'Fun fact', emoji: '🎓', highlight: 'I taught Python to undergrads as a grad TA. Explaining things simply is a habit I still use with stakeholders.', game: null },
];
