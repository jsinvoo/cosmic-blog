import { getPayload } from "payload";
import config from "@payload-config";
import sharp from "sharp";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generateGradientImage(
  name: string,
  color1: string,
  color2: string,
): Promise<string> {
  const width = 1920;
  const height = 1080;
  const svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:${color1};stop-opacity:1" />
        <stop offset="100%" style="stop-color:${color2};stop-opacity:1" />
      </linearGradient>
    </defs>
    <rect width="${width}" height="${height}" fill="url(#g)" />
    <circle cx="${width * 0.7}" cy="${height * 0.3}" r="200" fill="${color1}" opacity="0.3" />
    <circle cx="${width * 0.3}" cy="${height * 0.7}" r="300" fill="${color2}" opacity="0.2" />
  </svg>`;

  const outputDir = path.resolve(__dirname, "../../media");
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  const filePath = path.join(outputDir, `${name}.jpg`);
  await sharp(Buffer.from(svg)).jpeg({ quality: 85 }).toFile(filePath);
  return filePath;
}

const richText = (blocks: any[]) => ({
  root: {
    type: "root",
    children: blocks,
    direction: "ltr",
    format: "",
    indent: 0,
    version: 1,
  },
});

const paragraph = (text: string, formats: { bold?: boolean; italic?: boolean; code?: boolean } = {}) => ({
  type: "paragraph",
  children: [
    {
      type: "text",
      text,
      format: (formats.bold ? 1 : 0) | (formats.italic ? 2 : 0) | (formats.code ? 16 : 0),
      detail: 0,
      mode: "normal",
      style: "",
      version: 1,
    },
  ],
  direction: "ltr",
  format: "",
  indent: 0,
  textFormat: 0,
  version: 1,
});

const heading = (text: string, tag: string = "h2") => ({
  type: "heading",
  children: [
    {
      type: "text",
      text,
      format: 0,
      detail: 0,
      mode: "normal",
      style: "",
      version: 1,
    },
  ],
  direction: "ltr",
  format: "",
  indent: 0,
  tag,
  version: 1,
});

async function seed() {
  console.log("🌱 Starting seed...\n");

  const payload = await getPayload({ config });

  // Clean existing data
  console.log("🧹 Cleaning existing data...");
  const existingPosts = await payload.find({ collection: "posts", limit: 100 });
  for (const post of existingPosts.docs) {
    await payload.delete({ collection: "posts", id: post.id });
  }
  const existingAuthors = await payload.find({ collection: "authors", limit: 100 });
  for (const author of existingAuthors.docs) {
    await payload.delete({ collection: "authors", id: author.id });
  }
  const existingCategories = await payload.find({ collection: "categories", limit: 100 });
  for (const cat of existingCategories.docs) {
    await payload.delete({ collection: "categories", id: cat.id });
  }

  const existingMedia = await payload.find({ collection: "media", limit: 100 });
  for (const m of existingMedia.docs) {
    await payload.delete({ collection: "media", id: m.id });
  }

  // --- Hero Images ---
  console.log("🖼️  Generating hero images...");
  const gradients: [string, string, string][] = [
    ["hero-tech", "#3b82f6", "#8b5cf6"],
    ["hero-space", "#7c3aed", "#ec4899"],
    ["hero-design", "#ec4899", "#f97316"],
    ["hero-ai", "#06b6d4", "#8b5cf6"],
    ["hero-sustain", "#10b981", "#3b82f6"],
    ["hero-productivity", "#f97316", "#eab308"],
    ["hero-jwst", "#6366f1", "#06b6d4"],
  ];

  const heroImages: any[] = [];
  for (const [name, c1, c2] of gradients) {
    const filePath = await generateGradientImage(name, c1, c2);
    const media = await payload.create({
      collection: "media",
      data: { alt: name.replace("hero-", "") + " cover image" },
      filePath,
    });
    heroImages.push(media);
  }
  console.log(`   ✅ Created ${heroImages.length} hero images`);

  // --- Categories ---
  console.log("📂 Creating categories...");
  const categories = await Promise.all([
    payload.create({
      collection: "categories",
      data: {
        name: "Technology",
        slug: "technology",
        color: "blue",
        description: "Exploring the cutting edge of software, hardware, and digital innovation.",
      },
    }),
    payload.create({
      collection: "categories",
      data: {
        name: "Space & Science",
        slug: "space-science",
        color: "purple",
        description: "Journeys through the cosmos and breakthroughs in scientific discovery.",
      },
    }),
    payload.create({
      collection: "categories",
      data: {
        name: "Design",
        slug: "design",
        color: "pink",
        description: "The art of creating beautiful, functional, and human-centered experiences.",
      },
    }),
    payload.create({
      collection: "categories",
      data: {
        name: "AI & Machine Learning",
        slug: "ai-ml",
        color: "teal",
        description: "The frontier of artificial intelligence and its impact on society.",
      },
    }),
    payload.create({
      collection: "categories",
      data: {
        name: "Sustainability",
        slug: "sustainability",
        color: "green",
        description: "Building a sustainable future through technology and conscious living.",
      },
    }),
    payload.create({
      collection: "categories",
      data: {
        name: "Productivity",
        slug: "productivity",
        color: "orange",
        description: "Tips, tools, and philosophies for getting more meaningful work done.",
      },
    }),
  ]);

  console.log(`   ✅ Created ${categories.length} categories`);

  // --- Authors ---
  console.log("👤 Creating authors...");
  const authors = await Promise.all([
    payload.create({
      collection: "authors",
      data: {
        name: "Luna Starfield",
        bio: "Astrophysicist turned tech writer. Obsessed with the intersection of space exploration and software engineering. When not writing, she's building telescopes or contributing to open-source projects.",
        role: "Editor in Chief",
      },
    }),
    payload.create({
      collection: "authors",
      data: {
        name: "Kai Nakamura",
        bio: "Full-stack developer and design enthusiast. Believes that great software is invisible — it just works. Former lead engineer at a Series B startup, now writing about the craft of building products.",
        role: "Senior Writer",
      },
    }),
    payload.create({
      collection: "authors",
      data: {
        name: "Aria Chen",
        bio: "AI researcher and ethicist. Passionate about responsible AI development and making machine learning accessible to everyone. PhD from MIT, now consulting and writing full-time.",
        role: "AI Correspondent",
      },
    }),
  ]);

  console.log(`   ✅ Created ${authors.length} authors`);

  // --- Posts ---
  console.log("📝 Creating posts...\n");

  const posts = [
    {
      title: "The Architecture of Modern Web Applications in 2026",
      slug: "architecture-modern-web-apps-2026",
      excerpt: "From server components to edge computing, the web platform has evolved dramatically. Here's a deep dive into the patterns that are shaping how we build for the web today.",
      heroImage: heroImages[0].id,
      category: categories[0].id,
      author: authors[1].id,
      status: "published" as const,
      _status: "published" as const,
      publishedAt: "2026-02-25T10:00:00.000Z",
      readTime: 8,
      featured: true,
      content: richText([
        paragraph("The web development landscape has undergone a seismic shift. What was once a simple request-response cycle has evolved into a sophisticated orchestration of server components, edge functions, and streaming HTML."),
        heading("The Rise of Server Components"),
        paragraph("React Server Components have fundamentally changed how we think about rendering. Instead of shipping JavaScript bundles to the client and hydrating, we can now render components on the server and stream them to the browser as HTML."),
        paragraph("This isn't just a performance optimization — it's a paradigm shift. Database queries happen where the data lives. Heavy computations run on powerful servers. And the client receives exactly what it needs: rendered HTML with surgical hydration."),
        heading("Edge Computing Goes Mainstream"),
        paragraph("Edge functions have moved from novelty to necessity. With runtimes like Cloudflare Workers and Vercel Edge Functions, code runs milliseconds from your users. The latency benefits are undeniable, but the real win is the developer experience."),
        paragraph("Write a function, deploy it, and it runs globally. No infrastructure management. No region selection. Just code that runs close to your users."),
        heading("What This Means for Developers"),
        paragraph("The tools we use shape how we think. These new primitives encourage us to build faster, more resilient applications. The gap between \"full-stack\" and \"frontend\" continues to blur, and that's a good thing."),
        paragraph("The future of web development isn't about choosing between server and client. It's about using each where they shine."),
      ]),
    },
    {
      title: "Why Every Developer Should Stargaze",
      slug: "why-developers-should-stargaze",
      excerpt: "Looking up at the night sky isn't just romantic — it's a powerful tool for developing perspective, patience, and the kind of systems thinking that makes great engineers.",
      heroImage: heroImages[1].id,
      category: categories[1].id,
      author: authors[0].id,
      status: "published" as const,
      _status: "published" as const,
      publishedAt: "2026-02-22T08:00:00.000Z",
      readTime: 5,
      featured: false,
      content: richText([
        paragraph("I've spent fifteen years building software and twenty years staring at stars. These two pursuits have more in common than you'd think."),
        heading("Patience in an Instant World"),
        paragraph("In astronomy, you can't rush a photon. Light from the Andromeda galaxy takes 2.5 million years to reach your telescope. There's something profoundly humbling about that — and something every developer who's frustrated by a slow CI pipeline should consider."),
        paragraph("Stargazing teaches you to sit with complexity. To observe before acting. To let patterns emerge rather than forcing them."),
        heading("Systems Thinking at Cosmic Scale"),
        paragraph("A galaxy isn't a collection of random stars. It's a gravitationally bound system where everything influences everything else. Sound familiar? That's your microservices architecture."),
        paragraph("When you understand how orbital mechanics create stable systems out of chaos, you start seeing software architecture differently. Stability isn't the absence of change — it's the presence of well-designed feedback loops."),
        heading("The Dark Sky Developer"),
        paragraph("Next time you're stuck on a particularly thorny bug, step outside. Look up. The universe has been debugging itself for 13.8 billion years. You can handle a null pointer exception."),
      ]),
    },
    {
      title: "Designing for Emotion: Beyond Usability",
      slug: "designing-for-emotion",
      excerpt: "Usability gets users through the door. Emotion makes them stay. Exploring the principles of emotional design and how they create products people genuinely love.",
      heroImage: heroImages[2].id,
      category: categories[2].id,
      author: authors[1].id,
      status: "published" as const,
      _status: "published" as const,
      publishedAt: "2026-02-20T12:00:00.000Z",
      readTime: 6,
      featured: false,
      content: richText([
        paragraph("We've gotten remarkably good at making things usable. Buttons look clickable. Navigation makes sense. Forms validate input. But usability is table stakes. The products that win hearts go further."),
        heading("The Three Levels of Design"),
        paragraph("Don Norman identified three levels of emotional design: visceral, behavioral, and reflective. The visceral level is immediate — does this look and feel good? The behavioral level is about use — does this work well? The reflective level is about meaning — does this say something about who I am?"),
        paragraph("Most design conversations stop at the behavioral level. We optimize flows, reduce friction, increase conversion. But the reflective level is where loyalty lives."),
        heading("Delight as a Design Principle"),
        paragraph("Delight isn't decoration. It's the thoughtful touch that shows someone cared. It's the loading animation that makes you smile instead of sigh. It's the error message that's helpful instead of accusatory."),
        paragraph("When Stripe's documentation feels like reading a well-crafted tutorial rather than a technical manual, that's emotional design. When Linear's keyboard shortcuts make you feel like a power user within minutes, that's emotional design."),
        heading("Making Emotion Measurable"),
        paragraph("The challenge with emotional design is measurement. You can A/B test button colors, but how do you test feelings? The answer lies in qualitative research — interviews, observation, and the willingness to ask \"how did that make you feel?\" without embarrassment."),
      ]),
    },
    {
      title: "The Quiet Revolution of Small Language Models",
      slug: "quiet-revolution-small-language-models",
      excerpt: "While the world obsesses over ever-larger AI models, a quieter revolution is happening: small, efficient models that run on your phone and respect your privacy.",
      heroImage: heroImages[3].id,
      category: categories[3].id,
      author: authors[2].id,
      status: "published" as const,
      _status: "published" as const,
      publishedAt: "2026-02-18T09:00:00.000Z",
      readTime: 7,
      featured: false,
      content: richText([
        paragraph("The AI headlines are dominated by scale. Bigger models, more parameters, larger training datasets. But the most interesting developments are happening at the opposite end of the spectrum."),
        heading("Small Models, Big Impact"),
        paragraph("Models with 1-7 billion parameters are now capable of tasks that required 175B+ parameters just two years ago. Distillation techniques, better training data curation, and architectural innovations have made this possible."),
        paragraph("These models run on consumer hardware. They don't need a data center. They don't need an internet connection. And critically, your data never leaves your device."),
        heading("Privacy by Architecture"),
        paragraph("When your AI assistant runs locally, privacy isn't a policy — it's physics. Your personal notes, medical questions, and creative writing never touch a server. There's no API call to intercept, no log to subpoena."),
        paragraph("This matters more than most people realize. The most valuable use cases for AI are often the most personal ones."),
        heading("The Edge AI Future"),
        paragraph("We're heading toward a world where every device has meaningful AI capabilities built in. Not as a cloud service, but as a local capability. Your laptop, your phone, even your watch — all capable of understanding context and helping you without phoning home."),
        paragraph("The revolution won't be centralized. It'll be in your pocket."),
      ]),
    },
    {
      title: "Building a Solar-Powered Home Lab",
      slug: "solar-powered-home-lab",
      excerpt: "How I built a completely solar-powered server rack for my home lab, and what I learned about energy efficiency, hardware selection, and sustainable computing.",
      heroImage: heroImages[4].id,
      category: categories[4].id,
      author: authors[0].id,
      status: "published" as const,
      _status: "published" as const,
      publishedAt: "2026-02-15T14:00:00.000Z",
      readTime: 10,
      featured: false,
      content: richText([
        paragraph("Last year, I set myself a challenge: run my entire home lab — NAS, development servers, home automation hub — entirely on solar power. Here's what happened."),
        heading("The Energy Audit"),
        paragraph("Before buying a single solar panel, I spent a month measuring exactly how much power my equipment consumed. The results were eye-opening. My old tower server drew 180W idle. My NAS pulled 65W. The network stack added another 40W. That's 285W just to keep the lights on."),
        paragraph("Step one wasn't solar panels — it was efficiency. I replaced the tower with an Intel NUC cluster drawing 35W total. Swapped the NAS for an ARM-based solution at 15W. New network gear brought that down to 20W. Total: 70W. A 75% reduction before a single panel was installed."),
        heading("The Solar Setup"),
        paragraph("Four 200W panels on the garage roof, a 5kWh LiFePO4 battery bank, and a hybrid inverter. Total cost: about $3,200. The system generates more than enough power for the lab, even on cloudy days."),
        paragraph("The surplus feeds back into the home grid, offsetting other electricity use. On sunny summer days, the lab effectively runs for free with power to spare."),
        heading("Lessons Learned"),
        paragraph("The biggest lesson? Efficiency beats generation. Every watt you don't use is a watt you don't need to generate. Start with the load, then size the source."),
        paragraph("Also: ARM-based servers are incredible for home lab use. The performance-per-watt is unmatched, and the ecosystem has matured enormously."),
      ]),
    },
    {
      title: "The Pomodoro Technique is Dead. Long Live Deep Work Blocks.",
      slug: "pomodoro-dead-deep-work-blocks",
      excerpt: "After years of 25-minute sprints, I switched to 90-minute deep work blocks. The results surprised me — and changed how I think about productive focus.",
      heroImage: heroImages[5].id,
      category: categories[5].id,
      author: authors[1].id,
      status: "published" as const,
      _status: "published" as const,
      publishedAt: "2026-02-12T11:00:00.000Z",
      readTime: 5,
      featured: false,
      content: richText([
        paragraph("I was a Pomodoro devotee for five years. The technique served me well through college and my early career. But as my work became more complex — system design, deep debugging, long-form writing — the 25-minute timer started feeling like an interruption rather than a structure."),
        heading("The Problem with Short Intervals"),
        paragraph("Complex creative and technical work requires what psychologists call \"cognitive loading\" — the process of building a mental model of the problem space. This loading phase can take 15-20 minutes alone."),
        paragraph("With Pomodoro, you'd just finish loading the problem into your mind, get maybe 5 minutes of actual deep work, then the timer rings. Break time. When you return, the loading process starts over."),
        heading("The 90-Minute Alternative"),
        paragraph("Research on ultradian rhythms suggests our bodies naturally cycle through 90-minute periods of high and low alertness. By aligning work sessions with these cycles, you get the full benefit of peak focus."),
        paragraph("My typical day now has three 90-minute deep work blocks with substantial breaks between them. That's 4.5 hours of genuine deep work — more productive output than 8 hours of Pomodoro-interrupted shallow work."),
        heading("Making It Work"),
        paragraph("The key is protecting these blocks ruthlessly. Phone on DND. Slack closed. Email can wait. No meetings during deep blocks, ever. It takes discipline, but the quality of work that emerges is transformative."),
        paragraph("You don't need more hours. You need fewer, better ones."),
      ]),
    },
    {
      title: "What the James Webb Telescope Taught Me About Debugging",
      slug: "jwst-taught-me-debugging",
      excerpt: "The JWST team had to debug a spacecraft 1.5 million km away. Their approach holds lessons for every software engineer dealing with production issues.",
      heroImage: heroImages[6].id,
      category: categories[1].id,
      author: authors[0].id,
      status: "published" as const,
      _status: "published" as const,
      publishedAt: "2026-02-08T16:00:00.000Z",
      readTime: 6,
      featured: false,
      content: richText([
        paragraph("When something goes wrong with the James Webb Space Telescope, you can't exactly SSH into it. The telescope orbits the L2 Lagrange point, 1.5 million kilometers from Earth. Light-speed communication delay is about 5 seconds each way. There are no do-overs."),
        heading("Observability is Everything"),
        paragraph("The JWST has over 50,000 monitoring points. Temperature sensors, position encoders, power measurements, vibration detectors — every conceivable metric is captured and transmitted back to Earth."),
        paragraph("The lesson for software: you cannot debug what you cannot observe. Invest in logging, metrics, and tracing before you need them. When the incident happens at 3 AM, you'll be grateful."),
        heading("Test the Recovery, Not Just the Happy Path"),
        paragraph("The JWST team spent years testing failure scenarios. What if a motor stalls? What if memory corrupts? What if communication drops? Every failure mode had a pre-planned recovery procedure."),
        paragraph("How many of us test our rollback procedures? Our circuit breakers? Our fallback behaviors? We test that things work. We rarely test how they recover when they don't."),
        heading("Slow Down to Speed Up"),
        paragraph("The mirror deployment sequence took two weeks. Two weeks to unfold something that could have been done in hours — because each step was verified, analyzed, and confirmed before proceeding."),
        paragraph("When debugging production, the instinct is to act fast. Push a fix. Restart the service. But the JWST team shows us that methodical, verified steps prevent the cascading failures that turn incidents into outages."),
      ]),
    },
  ];

  for (const postData of posts) {
    const post = await payload.create({
      collection: "posts",
      data: postData,
    });
    console.log(`   ✅ "${post.title}"`);
  }

  console.log(`\n🎉 Seed complete!`);
  console.log(`   📂 ${categories.length} categories`);
  console.log(`   👤 ${authors.length} authors`);
  console.log(`   📝 ${posts.length} posts\n`);

  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
