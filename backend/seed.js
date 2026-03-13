const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Blog = require('./models/Blog');
const dotenv = require('dotenv');

dotenv.config();

const users = [
    { username: 'Marcus_Tech', email: 'marcus@example.com', bio: 'Senior Cloud Engineer and Stock Trader' },
    { username: 'Sofia_Writes', email: 'sofia@example.com', bio: 'Emotional storyteller and poet' },
    { username: 'Hiroshi_Dev', email: 'hiroshi@example.com', bio: 'Full-stack Engineer from Tokyo' },
    { username: 'Emma_Journalist', email: 'emma@example.com', bio: 'Independent news reporter' },
    { username: 'Lucas_Finance', email: 'lucas@example.com', bio: 'Wall Street veteran and Market Analyst' },
    { username: 'Zoe_Vibes', email: 'zoe@example.com', bio: 'Web designer and UI/UX expert' },
    { username: 'Liam_Sky', email: 'liam@example.com', bio: 'Nature lover and travel blogger' },
    { username: 'Ava_Code', email: 'ava@example.com', bio: 'Frontend enthusiast and CSS wizard' }
];

const topics = ["broken heart", "news", "technology", "software development", "web development", "trading", "stock market"];

const blogTemplate = [
    {
        title: "The Silent Echoes of a Broken Heart",
        topic: "broken heart",
        img: "https://images.unsplash.com/photo-1516589174184-c68526614ae0?q=80&w=1000",
        content: "Healing from a broken heart is like trying to find your way through a thick fog. Every step forward feels uncertain, and the weight of memories often pulls you back. It's not just about the person you lost, but about the version of yourself that was tied to them. In the silence of the night, those echoes become louder, reminding you of shared dreams and whispered promises that now belong to the past. But within this pain lies a profound opportunity for growth. You learn the depth of your own resilience, the strength of your spirit, and the capacity to love yourself when no one else is there. It takes time—months, maybe years—to truly heal. You have to allow yourself to feel every bit of that agony, to cry until there are no tears left, and then, one morning, you realize that the fog has started to lift. You find beauty in the mundane, joy in the simple things, and a new sense of purpose that belongs solely to you."
    },
    {
        title: "Navigating the Stock Market Volatility in 2026",
        topic: "stock market",
        img: "https://images.unsplash.com/photo-1611974714451-b85675dfb66f?q=80&w=1000",
        content: "The global stock market has entered a phase of unprecedented volatility as we move further into 2026. With geopolitical tensions rising and unexpected technological shifts, investors are finding it harder than ever to predict the next wave. The key to surviving this environment isn't trying to time the market—it's about understanding the underlying fundamentals. Diversification remains the gold standard of risk management. While tech stocks have shown resilience, the traditional sectors are struggling to keep pace with the rapid changes in consumer behavior. Day traders are leveraging AI algorithms to spot micro-trends, but for the long-term investor, patience is the ultimate virtue. We've seen significant swings in the NASDAQ and S&P 500, often driven by a single earnings report or a hint of a policy shift from the central banks. In times like these, keeping a cool head and a well-balanced portfolio is the only way to avoid the emotional pitfalls of panic selling. Remember, wealth isn't built in a day, but it can be lost in an hour of irrational decision-making."
    },
    {
        title: "Why Web Development is Becoming AI-First",
        topic: "web development",
        img: "https://images.unsplash.com/photo-1547658719-da2b51169166?q=80&w=1000",
        content: "We are witnessing a monumental shift in how the web is built. The days of manual boilerplate and repetitive CSS are fading as AI-first frameworks take center stage. Tools like Bolt, v0, and advanced Copilots are not just assisting developers; they are restructuring the entire development lifecycle. From generating complex UI components to optimizing server-side logic in real-time, artificial intelligence has become an indispensable partner. However, this doesn't mean the role of a web developer is diminished. On the contrary, the focus has shifted from syntax to system design. Understanding how to orchestrate these AI tools, ensuring accessibility, and maintaining high performance across diverse devices is now the primary challenge. Modern CSS includes features like Container Queries and Parent Selectors (has:) that work harmoniously with AI-generated layouts. As we look toward the end of the decade, the ability to 'prompt' an entire prototype into existence will be a standard skill. The web is becoming more dynamic, personalized, and intelligent, and the developers who embrace this change will be the ones leading the industry."
    },
    {
        title: "Software Engineering: The Death of the Junior Dev?",
        topic: "software development",
        img: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1000",
        content: "There's a growing fear in the tech community that AI will eliminate the need for junior developers. Is the entry-level path truly dying? The answer is nuanced. While basic coding tasks can now be handled by LLMs, the essence of software engineering remains human-centric. Being a developer was never just about writing code; it was about solving problems, communicating with stakeholders, and understanding the 'why' behind the 'how'. Junior developers in 2026 are expected to bypass the 'grunt work' phase and move straight into architecture and debugging sophisticated systems. The bar for entry has undoubtedly been raised. You now need to understand cloud infrastructure, security best practices, and AI integration from day one. Mentorship is also changing; senior engineers are now teaching juniors how to validate and refine AI-generated code rather than how to write basic loops. The path is harder, but the potential is greater. Those who can bridge the gap between human creativity and machine efficiency will find themselves in high demand."
    },
    {
        title: "News Update: The Global Energy Crisis",
        topic: "news",
        img: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?q=80&w=1000",
        content: "Across the globe, nations are grappling with a renewed energy crisis as legacy systems fail to meet the demands of a hyper-digitalized world. The surge in data center power consumption, driven by the AI boom, has put a significant strain on national grids. From Europe to East Asia, governments are racing to implement sustainable solutions while trying to keep costs down for the average citizen. Renewable energy is expanding at record speeds, but the infrastructure for storage and distribution remains a bottleneck. We're seeing a resurgence in nuclear power as a stable baseline, while offshore wind farms are reaching new heights of efficiency. Economically, this crisis is reshaping trade alliances and driving inflation in manufacturing sectors. Critics argue that the transition is too slow, while proponents point to the massive investments being made in hydrogen technology and fusion research. The coming years will be a test of political will and technological innovation as we attempt to power our future without destroying our planet."
    },
    {
        title: "The Emotional Toll of Modern Trading",
        topic: "trading",
        img: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=1000",
        content: "Trading is often romanticized as a path to quick wealth and freedom, but the reality is much more taxing on the human psyche. The constant exposure to risk, the fluctuating numbers on a screen, and the weight of financial decisions can lead to burnout and high levels of stress. Many traders suffer in silence, fearing that admitting to emotional struggle is a sign of weakness. However, the most successful traders are those who acknowledge were human first. Developing 'Trader EQ'—the ability to identify and regulate emotions in high-stakes situations—is just as important as technical analysis. We explore the psychological cycles of a trader: from the 'euphoria' of a winning streak to the 'despair' of a major drawdown. Building a support system, maintaining a healthy work-life balance, and knowing when to step away from the terminal are essential strategies for longevity in this field. It's not just about the P&L; it's about staying sane in a world of numbers."
    }
];

// Generate 42 blogs (multiples of my template)
const generateLargeDataset = () => {
    const finalBlogs = [];
    for (let i = 0; i < 42; i++) {
        const t = blogTemplate[i % blogTemplate.length];
        finalBlogs.push({
            title: `${t.title} - Part ${Math.floor(i / 6) + 1}`,
            content: t.content + " " + t.content.substring(0, 200) + "... (Extended Coverage)",
            image: t.img,
            topic: t.topic
        });
    }
    return finalBlogs;
};

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/blog_app');
        console.log('MongoDB Connected for INFINITE DATA Seeding...');

        await User.deleteMany({});
        await Blog.deleteMany({});

        const salt = await bcrypt.genSalt(10);
        const demoPassword = await bcrypt.hash('password123', salt);

        const createdUsers = [];
        for (let u of users) {
            const newUser = new User({ ...u, password: demoPassword });
            await newUser.save();
            createdUsers.push(newUser);
        }

        const largeBlogs = generateLargeDataset();
        for (let b of largeBlogs) {
            const randomAuth = createdUsers[Math.floor(Math.random() * createdUsers.length)];
            const blog = new Blog({
                ...b,
                author: randomAuth._id,
                createdAt: new Date(Date.now() - Math.floor(Math.random() * 1000 * 60 * 60 * 24 * 30))
            });
            await blog.save();
        }

        console.log(`--- DATABASE SEEDED WITH ${largeBlogs.length} REALISTIC BLOGS ---`);
        mongoose.connection.close();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedDB();
