// Episode catalogue (real Good Garbage Podcast guests, condensed for the site).
export type Category = "Business" | "Environment" | "Science" | "Activism";

export interface Episode {
  ep: number;
  title: string;
  description: string;
  guest: string;
  role: string;
  location?: string;
  category: Category;
  duration: string;
  date: string;
  thumbnail?: string;
}

export const EPISODES: Episode[] = [
  { ep: 55, title: "From War Zones to Sustainable Solutions", description: "Anita Shah walked away from 20 years of humanitarian work to build Kenya's first biodegradable tableware facility. A conversation about conviction, circularity, and what it means to act on what you believe.", guest: "Anita Shah", role: "Founder, Green Stem Products Ltd.", location: "Nairobi, Kenya", category: "Business", duration: "1h 12m", date: "Jul 2026", thumbnail: "/images/episodes/latest.png" },
  { ep: 54, title: "Revolutionizing Materials", description: "Is plastic the villain — or is the conversation more complicated than that? Efrat Friedland of materialscout argues for nuance: the difference between good and bad materials is design, not chemistry.", guest: "Efrat Friedland", role: "Founder, materialscout", category: "Science", duration: "1h 16m", date: "Jul 2026", thumbnail: "/images/episodes/latest.png" },
  { ep: 53, title: "From Petroleum to Purpose", description: "Nima Vakili grew up in a petrochemical family. Today he builds biomaterials from agricultural waste in the UAE. This is a story about where you come from, and what you choose to build instead.", guest: "Nima Vakili", role: "Founder & CEO, Safa Bioworks", location: "Dubai, UAE", category: "Science", duration: "1h 9m", date: "Jun 2026", thumbnail: "/images/episodes/latest.png" },
  { ep: 52, title: "Influencing Sustainable Practices", description: "Sustainability isn't about perfection — it's about making better choices more often. Aashima Aghi on conscious consumption, the commercialization of childhood, and what it really takes to shift culture.", guest: "Aashima Aghi", role: "Sustainability Content Creator", category: "Activism", duration: "1h 32m", date: "Jun 2026", thumbnail: "/images/episodes/latest.png" },
  { ep: 51, title: "Can Seaweed Replace Plastic?", description: "How ocean-grown feedstocks could reshape everyday packaging.", guest: "Neha Jain", role: "Materials Innovator", category: "Environment", duration: "41 min", date: "Apr 2026", thumbnail: "/images/episodes/latest.png" },
  { ep: 50, title: "Why Composting Is Having a Revolution", description: "The systems shift turning food waste into living soil.", guest: "Frank Franciosi", role: "US Composting Council", category: "Environment", duration: "45 min", date: "Apr 2026", thumbnail: "/images/episodes/latest.png" },
  { ep: 49, title: "This Artist Is Cleaning the Planet", description: "Turning waste into monumental art that moves people to act.", guest: "Benjamin Von Wong", role: "Environmental Artist", category: "Activism", duration: "53 min", date: "Mar 2026", thumbnail: "/images/episodes/latest.png" },
  { ep: 48, title: "The Truth About Sustainable Packaging", description: "Cutting through greenwashing to what actually works.", guest: "Sandeep Kulkarni", role: "Packaging Scientist", category: "Business", duration: "39 min", date: "Mar 2026", thumbnail: "/images/episodes/latest.png" },
  { ep: 47, title: "Packaging You Can Eat", description: "Edible and compostable materials for a plastic-free table.", guest: "Marie Eric", role: "Food-Tech Researcher", category: "Science", duration: "44 min", date: "Feb 2026", thumbnail: "/images/episodes/latest.png" },
  { ep: 46, title: "The Myth of Recycling", description: "Why recycling alone won't fix the plastic crisis.", guest: "Sian Sutherland", role: "Co-Founder, A Plastic Planet", location: "London, UK", category: "Environment", duration: "50 min", date: "Feb 2026", thumbnail: "/images/episodes/latest.png" },
  { ep: 45, title: "Building a Brand With a Purpose", description: "Growing a mission-led business without losing the mission.", guest: "Maddie Hamann", role: "Founder, Pacha", category: "Business", duration: "42 min", date: "Jan 2026", thumbnail: "/images/episodes/latest.png" },
  { ep: 44, title: "From Greenhouse Gas to Green Polymers", description: "Capturing carbon and turning it into useful materials.", guest: "Molly Morse", role: "CEO, Mango Materials", location: "California, USA", category: "Science", duration: "46 min", date: "Jan 2026", thumbnail: "/images/episodes/latest.png" },
  { ep: 43, title: "Tackling Plastic Pollution With Art & Activism", description: "Building a global movement against plastic waste.", guest: "Dianna Cohen", role: "CEO, Plastic Pollution Coalition", category: "Activism", duration: "51 min", date: "Dec 2025", thumbnail: "/images/episodes/latest.png" },
  { ep: 42, title: "Why the Future of Sustainability Is in India", description: "Scaling circular packaging across emerging markets.", guest: "Avantika Saraogi", role: "Executive Director, Pakka", category: "Business", duration: "40 min", date: "Dec 2025", thumbnail: "/images/episodes/latest.png" },
  { ep: 41, title: "Certifiably Compostable", description: "What certification really means for compostable products.", guest: "Susan Thoman", role: "Compost Manufacturing Alliance", category: "Environment", duration: "43 min", date: "Nov 2025", thumbnail: "/images/episodes/latest.png" },
];

export const CATEGORIES: ("All" | Category)[] = ["All", "Business", "Environment", "Science", "Activism"];

