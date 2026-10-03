import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight, Check, ChevronDown, Clock3, MapPin, Menu, Search,
  ShieldCheck, Sparkles, Star, X, Zap
} from "lucide-react";
import "./styles.css";

const seedProviders = [
  { id: 1, name: "Maya Rai", skill: "Electrician", category: "Home & Garden", level: "professional", demand: "high", rating: 4.9, reviews: 48, distance: 1.2, price: "NPR 800", availability: "Available today", avatar: "👩🏽‍🔧", verified: true, bio: "Reliable home electrical repairs, installations and safety checks. I bring my own tools and explain the fix clearly." },
  { id: 2, name: "Aarav Sharma", skill: "Computer Repair", category: "Tech & Design", level: "intermediate", demand: "high", rating: 4.8, reviews: 32, distance: 2.4, price: "NPR 600", availability: "Available tomorrow", avatar: "👨🏻‍💻", verified: true, bio: "Laptop tune-ups, software setup and patient help for people who want to understand their tech." },
  { id: 3, name: "Nisha Karki", skill: "Math Tutoring", category: "Learning", level: "professional", demand: "medium", rating: 5, reviews: 27, distance: .8, price: "NPR 500/hr", availability: "Open this week", avatar: "👩🏻‍🏫", verified: true, bio: "Friendly, practical math tutoring for grades 6–12. We will build confidence one problem at a time." },
  { id: 4, name: "Rohan Thapa", skill: "Home Cleaning", category: "Home & Garden", level: "junior", demand: "medium", rating: 4.7, reviews: 19, distance: 1.8, price: "NPR 900", availability: "Available today", avatar: "🧹", verified: false, bio: "Detailed, dependable home cleaning with flexible bookings for busy households." },
  { id: 5, name: "Saanvi Joshi", skill: "Graphic Design", category: "Tech & Design", level: "professional", demand: "high", rating: 4.9, reviews: 36, distance: 3.1, price: "NPR 1,200", availability: "Open this week", avatar: "👩🏻‍🎨", verified: true, bio: "Branding, social graphics and thoughtful visual identities for small local businesses." },
  { id: 6, name: "Bikash Gurung", skill: "Bike Repair", category: "Transport", level: "intermediate", demand: "low", rating: 4.8, reviews: 41, distance: 2, price: "NPR 400", availability: "Available today", avatar: "🧰", verified: false, bio: "Quick bicycle repairs and honest advice. Workshop pickup available around the neighborhood." }
];

const categories = ["All services", "Home & Garden", "Tech & Design", "Learning", "Transport", "Health & Beauty"];
const rates = { junior: 1, intermediate: 1.5, professional: 2.2 };
const demandRates = { low: .85, medium: 1, high: 1.25 };
const credits = (level, demand) => Math.round(rates[level] * demandRates[demand] * 10) / 10;

function App() {
  const [providers, setProviders] = useState(() => {
    const saved = localStorage.getItem("skillswap-react-provider");
    return saved ? [JSON.parse(saved), ...seedProviders] : seedProviders;
  });
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All services");
  const [sort, setSort] = useState("recommended");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [requesting, setRequesting] = useState(null);
  const [showOffer, setShowOffer] = useState(false);
  const [toast, setToast] = useState("");

  const results = useMemo(() => providers
    .filter((provider) => category === "All services" || provider.category === category)
    .filter((provider) => [provider.name, provider.skill, provider.category, provider.bio].join(" ").toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) => sort === "rating" ? b.rating - a.rating : sort === "distance" ? a.distance - b.distance : sort === "price" ? Number(a.price.replace(/\D/g, "")) - Number(b.price.replace(/\D/g, "")) : a.id - b.id), [providers, category, query, sort]);

  useEffect(() => {
    const onKey = (event) => event.key === "Escape" && (setSelected(null), setRequesting(null));
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const scrollTo = (id) => {
    setMobileOpen(false);
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const publishSkill = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const provider = { id: 0, name: "You", skill: data.get("skill"), category: data.get("category"), level: data.get("level"), demand: data.get("demand"), rating: 0, reviews: 0, distance: 0, price: data.get("price"), availability: data.get("availability"), avatar: "✨", verified: false, bio: data.get("description") };
    localStorage.setItem("skillswap-react-provider", JSON.stringify(provider));
    setProviders([provider, ...providers.filter((item) => item.id !== 0)]);
    setShowOffer(false);
    setToast(`${credits(provider.level, provider.demand)} credits per service — your skill is live.`);
    event.currentTarget.reset();
    setTimeout(() => setToast(""), 4000);
  };

  return <>
    <header className="topbar">
      <div className="wrap nav">
        <button className="logo" onClick={() => scrollTo("#home")}><span>↗</span> skill<span className="accent">swap</span></button>
        <nav className={mobileOpen ? "nav-links open" : "nav-links"}>
          <button onClick={() => scrollTo("#discover")}>Discover</button>
          <button onClick={() => scrollTo("#how")}>How it works</button>
          <button onClick={() => scrollTo("#offer")}>Offer a skill</button>
        </nav>
        <button className="nav-cta" onClick={() => scrollTo("#discover")}>Find a service <ArrowRight size={15} /></button>
        <button className="menu" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">{mobileOpen ? <X /> : <Menu />}</button>
      </div>
    </header>

    <main>
      <section className="hero" id="home"><div className="hero-shape shape-one" /><div className="hero-shape shape-two" /><div className="wrap hero-grid">
        <div className="hero-copy"><p className="eyebrow"><span className="dot" /> Your neighborhood, in motion</p><h1>Good skills are <em>closer</em> than you think.</h1><p className="hero-text">Find trusted people nearby for everyday services — or turn what you know into your next opportunity.</p><div className="hero-actions"><button className="primary" onClick={() => scrollTo("#discover")}>Find a service <ArrowRight size={17} /></button><button className="secondary" onClick={() => { setShowOffer(true); scrollTo("#offer"); }}>Offer your skill</button></div><div className="stats"><div><b>4.9/5</b><small>average rating</small></div><div><b>2,400+</b><small>local helpers</small></div><div><b>18k</b><small>services completed</small></div></div></div>
        <div className="hero-visual"><div className="visual-ring ring-a" /><div className="visual-ring ring-b" /><div className="hero-card hero-person"><span>👩🏽‍🔧</span><div><b>Maya R.</b><small>Electrician · 4.9 ★</small></div></div><div className="hero-card hero-credit"><Sparkles size={15} /><b>2.8 credits</b><small>Professional · high demand</small></div><div className="hero-note"><ShieldCheck size={16} /> Trusted locally</div></div>
      </div></section>

      <section className="discover wrap" id="discover"><div className="section-top"><div><p className="eyebrow">LOCAL DISCOVERY</p><h2>What can we help you with?</h2></div><p>Skilled people within a few kilometers of you.</p></div>
        <div className="search"><Search size={20} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search for a service, like electrician..." /><button onClick={() => setQuery(query.trim())}>Search</button></div>
        <div className="chips">{categories.map((item) => <button className={category === item ? "chip active" : "chip"} key={item} onClick={() => setCategory(item)}>{item}</button>)}</div>
        <div className="results-head"><div><h3>People near you</h3><span>{results.length} trusted provider{results.length === 1 ? "" : "s"} nearby</span></div><label>Sort by <select value={sort} onChange={(event) => setSort(event.target.value)}><option value="recommended">Recommended</option><option value="rating">Top rated</option><option value="distance">Nearest</option><option value="price">Lowest price</option></select></label></div>
        <div className="provider-grid">{results.length ? results.map((provider) => <ProviderCard key={provider.id} provider={provider} onSelect={setSelected} />) : <div className="empty"><Search size={24} /><h3>No matches yet</h3><p>Try “electrician”, “tutoring”, or another category.</p></div>}</div>
      </section>

      <section className="how" id="how"><div className="wrap"><div className="section-top light"><div><p className="eyebrow">SIMPLE BY DESIGN</p><h2>From “I need help”<br />to “All sorted.”</h2></div><p>Good skills should be easy to find, share and trust.</p></div><div className="steps"><article><span>01</span><h3>Search nearby</h3><p>Discover people with the right skills close to home.</p></article><article><span>02</span><h3>Choose with confidence</h3><p>Compare ratings, completed services, price and availability.</p></article><article><span>03</span><h3>Get it done</h3><p>Request a time, meet your local helper and leave a review.</p></article></div></div></section>

      <section className="offer wrap" id="offer"><div className="offer-banner"><div><p className="eyebrow">YOUR SKILL HAS VALUE</p><h2>Know how to do something well?</h2><p>Earn money, credits, and a little more connection along the way.</p><button className="primary" onClick={() => setShowOffer(true)}>Start offering <ArrowRight size={17} /></button></div><div className="offer-stat"><b>68%</b><span>of members earn extra income each month</span><div>👩🏽‍🍳 👨🏽‍🌾 👩🏻‍🎨</div></div></div></section>
    </main>

    <footer><div className="wrap footer-inner"><button className="logo" onClick={() => scrollTo("#home")}><span>↗</span> skill<span className="accent">swap</span></button><p>Find a skill. Offer a skill. Build a stronger local community.</p><small>© 2026 SkillSwap</small></div></footer>

    {showOffer && <Modal title="Offer your skill" onClose={() => setShowOffer(false)}><p className="modal-intro">Set your level and local demand to calculate a fair Skill Credit value.</p><OfferForm onSubmit={publishSkill} /></Modal>}
    {selected && <Modal onClose={() => setSelected(null)}><div className="profile"><span className="profile-avatar">{selected.avatar}</span><div><h2>{selected.name}</h2><p>{selected.skill} · {selected.distance} km away</p><span className="rating"><Star size={14} fill="currentColor" /> {selected.rating || "New"} <small>({selected.reviews} reviews)</small></span></div></div><p>{selected.bio}</p><div className="profile-stats"><div><b>{selected.level}</b><small>level</small></div><div><b>{selected.completed || 0}</b><small>completed</small></div><div><b>{credits(selected.level, selected.demand)} ✦</b><small>credits/service</small></div></div><button className="primary full" onClick={() => { setSelected(null); setRequesting(selected); }}>Request service <ArrowRight size={16} /></button></Modal>}
    {requesting && <Modal title={`Request ${requesting.skill}`} onClose={() => setRequesting(null)}><p>Send a request to <b>{requesting.name}</b>. They usually reply within an hour.</p><form className="request-form" onSubmit={(event) => { event.preventDefault(); setToast("Request sent — your provider has been notified."); setRequesting(null); setTimeout(() => setToast(""), 4000); }}><label>Date<input type="date" required /></label><label>Preferred time<input type="time" required /></label><label>What do you need help with?<textarea rows="3" required placeholder="Give your provider a little context..." /></label><button className="primary full" type="submit">Send request <ArrowRight size={16} /></button></form></Modal>}
    {toast && <div className="toast"><Check size={17} /> {toast}</div>}
  </>;
}

function ProviderCard({ provider, onSelect }) {
  return <article className="provider-card" onClick={() => onSelect(provider)}><div className="provider-top"><span className="avatar">{provider.avatar}</span><div><h3>{provider.name}</h3><p>{provider.skill}</p></div>{provider.verified && <ShieldCheck className="verified" size={16} />}</div><div className="rating"><Star size={14} fill="currentColor" /> {provider.rating || "New"} <small>({provider.reviews} reviews)</small></div><div className="provider-info"><span><MapPin size={13} /> {provider.distance} km</span><b>{provider.price}</b></div><div className="credit-badge"><Zap size={12} /> {credits(provider.level, provider.demand)} credits <small>{provider.level}</small></div><div className="card-footer"><span><Clock3 size={12} /> {provider.availability}</span><button onClick={(event) => { event.stopPropagation(); onSelect(provider); }}>View profile <ArrowRight size={13} /></button></div></article>;
}

function OfferForm({ onSubmit }) {
  const [level, setLevel] = useState("intermediate");
  const [demand, setDemand] = useState("medium");
  return <form className="offer-form" onSubmit={onSubmit}><div className="form-grid"><label>Skill or service<input name="skill" required placeholder="e.g. Home cooking" /></label><label>Category<select name="category"><option>Home & Garden</option><option>Tech & Design</option><option>Learning</option><option>Transport</option></select></label><label>Experience level<select name="level" value={level} onChange={(event) => setLevel(event.target.value)}><option value="junior">Junior · building experience</option><option value="intermediate">Intermediate · proven skills</option><option value="professional">Professional · specialist</option></select></label><label>Local demand<select name="demand" value={demand} onChange={(event) => setDemand(event.target.value)}><option value="low">Growing demand</option><option value="medium">Steady demand</option><option value="high">High demand</option></select></label><label>Price per service<input name="price" required placeholder="NPR 500" /></label><label>Availability<input name="availability" required placeholder="Weekends, 9am–5pm" /></label></div><div className="credit-preview"><span>Estimated earning</span><b>{credits(level, demand)} credits</b><small>{level} level · {demand} demand</small></div><label>Description<textarea name="description" rows="3" required placeholder="What can you help your neighbors with?" /></label><button className="primary full" type="submit">Publish my skill <ArrowRight size={16} /></button></form>;
}

function Modal({ title, onClose, children }) {
  return <div className="modal-layer" onMouseDown={(event) => event.target === event.currentTarget && onClose()}><div className="modal-card"><button className="close" onClick={onClose} aria-label="Close"><X size={18} /></button>{title && <h2>{title}</h2>}{children}</div></div>;
}

import { createRoot } from "react-dom/client";
createRoot(document.getElementById("root")).render(<App />);
