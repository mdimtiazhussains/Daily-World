import { type CSSProperties, type FormEvent, type ReactNode, useMemo, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Bookmark, BookmarkCheck, Check, ChevronRight, Clock3, Mail, Menu, Quote, Search, Send, Sparkles, X } from 'lucide-react';
import { Route, Switch, useLocation, Router as WouterRouter } from 'wouter';

const queryClient = new QueryClient();

const topics = ['All', 'World', 'Business', 'Innovation', 'AI & Tech', 'Ideas', 'Education', 'Policy'] as const;
type Topic = typeof topics[number];

type Article = {
  id: string;
  category: Exclude<Topic, 'All'>;
  title: string;
  dek: string;
  source: string;
  read: string;
  time: string;
  accent: string;
  art: string;
};

const articles: Article[] = [
  {
    id: 'grid',
    category: 'World',
    title: 'The quiet redesign of the global power grid',
    dek: 'A new generation of interconnectors is turning electricity into the world’s most collaborative infrastructure.',
    source: 'The Economist',
    read: '8 min read',
    time: '42 min ago',
    accent: '#e36b43',
    art: 'grid',
  },
  {
    id: 'smes',
    category: 'Business',
    title: 'Why small companies are building the next great supply chains',
    dek: 'The advantage is no longer scale. It is the ability to notice what large systems miss.',
    source: 'Financial Times',
    read: '6 min read',
    time: '1 hr ago',
    accent: '#236d68',
    art: 'lines',
  },
  {
    id: 'tutor',
    category: 'AI & Tech',
    title: 'AI tutors are getting better at asking, not answering',
    dek: 'The most useful classroom tools may be the ones that make a student pause before they make a prompt.',
    source: 'MIT Technology Review',
    read: '5 min read',
    time: '2 hrs ago',
    accent: '#e3b557',
    art: 'orb',
  },
  {
    id: 'cities',
    category: 'Policy',
    title: 'The cities betting on a four-day school week',
    dek: 'From Reykjavik to Melbourne, local experiments are rewriting the calendar around how children actually learn.',
    source: 'The Guardian',
    read: '7 min read',
    time: '3 hrs ago',
    accent: '#9a4962',
    art: 'blocks',
  },
  {
    id: 'repair',
    category: 'Innovation',
    title: 'The repair economy is finally getting a seat at the table',
    dek: 'A handful of stubborn founders are making longevity feel more convenient than replacement.',
    source: 'Rest of World',
    read: '4 min read',
    time: '4 hrs ago',
    accent: '#447b59',
    art: 'rings',
  },
  {
    id: 'apprentice',
    category: 'Education',
    title: 'The return of the serious apprenticeship',
    dek: 'Universities and employers are rediscovering the value of learning beside someone who knows the work.',
    source: 'New York Times',
    read: '9 min read',
    time: '5 hrs ago',
    accent: '#4c6090',
    art: 'paper',
  },
];

const ideas = [
  { number: '01', title: 'A library card for the internet', detail: 'One thoughtful membership across independent publications.', tag: 'Media' },
  { number: '02', title: 'The neighborhood lab', detail: 'Shared tools, patient mentors, useful work — one block at a time.', tag: 'Community' },
  { number: '03', title: 'Personal climate accounting', detail: 'Make the invisible choices around a life easier to see.', tag: 'Climate' },
];

function Art({ kind, color }: { kind: string; color: string }) {
  return (
    <div className={`article-art art-${kind}`} style={{ '--art-color': color } as CSSProperties} aria-hidden="true">
      <span className="art-sun" />
      <span className="art-line line-a" />
      <span className="art-line line-b" />
      <span className="art-line line-c" />
      <span className="art-block block-a" />
      <span className="art-block block-b" />
    </div>
  );
}

function Wordmark() {
  return (
    <a href="#top" className="flex items-center gap-3" data-testid="link-wordmark">
      <span className="flex h-9 w-9 items-center justify-center bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))] font-bold text-lg leading-none">dw</span>
      <span className="serif text-xl font-semibold tracking-[-0.03em]">Daily World <span className="text-[hsl(var(--accent))]">Briefing</span></span>
    </a>
  );
}

function BookmarkButton({ saved, onClick, id }: { saved: boolean; onClick: () => void; id: string }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex h-9 w-9 items-center justify-center border transition-all duration-200 ${saved ? 'border-[hsl(var(--primary))] bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]' : 'border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))] hover:border-[hsl(var(--primary))] hover:text-[hsl(var(--primary))]'}`}
      aria-label={saved ? 'Remove bookmark' : 'Bookmark article'}
      data-testid={`button-bookmark-${id}`}
    >
      {saved ? <BookmarkCheck size={16} strokeWidth={1.8} /> : <Bookmark size={16} strokeWidth={1.8} />}
    </button>
  );
}

function ArticleCard({ article, saved, onBookmark }: { article: Article; saved: boolean; onBookmark: () => void }) {
  return (
    <article className="group flex min-w-0 flex-col border-t border-[hsl(var(--border))] pt-4" data-testid={`card-article-${article.id}`}>
      <div className="relative mb-5 overflow-hidden">
        <Art kind={article.art} color={article.accent} />
        <div className="absolute right-3 top-3"><BookmarkButton saved={saved} onClick={onBookmark} id={article.id} /></div>
      </div>
      <div className="mb-2 flex items-center gap-2 text-[10px] uppercase tracking-[0.16em] text-[hsl(var(--primary))]">
        <span className="font-semibold">{article.category}</span><span className="h-px w-4 bg-[hsl(var(--accent))]" /><span className="text-[hsl(var(--muted-foreground))]">{article.time}</span>
      </div>
      <h3 className="serif text-[23px] font-semibold leading-[1.08] tracking-[-0.025em] transition-colors group-hover:text-[hsl(var(--primary))]" data-testid={`text-article-title-${article.id}`}>{article.title}</h3>
      <p className="mt-3 text-sm leading-6 text-[hsl(var(--muted-foreground))]" data-testid={`text-article-dek-${article.id}`}>{article.dek}</p>
      <div className="mt-5 flex items-center justify-between text-[11px] text-[hsl(var(--muted-foreground))]"><span>{article.source}</span><span>{article.read}</span></div>
    </article>
  );
}

function Home() {
  const [activeTopic, setActiveTopic] = useState<Topic>('All');
  const [query, setQuery] = useState('');
  const [saved, setSaved] = useState<string[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [signupMessage, setSignupMessage] = useState('');

  const filteredArticles = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return articles.filter((article) => {
      const matchesTopic = activeTopic === 'All' || article.category === activeTopic;
      const matchesSearch = !normalized || `${article.title} ${article.dek} ${article.category}`.toLowerCase().includes(normalized);
      return matchesTopic && matchesSearch;
    });
  }, [activeTopic, query]);

  const toggleBookmark = (id: string) => setSaved((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  const submitSignup = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.includes('@')) {
      setSignupMessage('Enter a real email so we know where to send tomorrow’s edition.');
      return;
    }
    setSubscribed(true);
    setSignupMessage('You’re on the list. Tomorrow’s world, edited down to what matters.');
  };

  return (
    <div id="top" className="noise min-h-screen bg-[hsl(var(--background))]">
      <div className="bg-[hsl(var(--primary))] px-4 py-2 text-center text-[10px] font-semibold uppercase tracking-[0.18em] text-[hsl(var(--primary-foreground))]">
        <span data-testid="text-daily-date">Tuesday, 18 June 2024</span><span className="mx-3 opacity-40">/</span><span>Edition 142</span>
      </div>
      <header className="sticky top-0 z-40 border-b border-[hsl(var(--border))] bg-[hsl(var(--background)/.94)] backdrop-blur-md">
        <div className="mx-auto flex max-w-[1280px] items-center justify-between px-5 py-4 lg:px-8">
          <Wordmark />
          <nav className="hidden items-center gap-7 md:flex" aria-label="Primary navigation">
            <a href="#briefing" className="text-xs font-medium transition-colors hover:text-[hsl(var(--accent))]" data-testid="link-briefing">The briefing</a>
            <a href="#ideas" className="text-xs font-medium transition-colors hover:text-[hsl(var(--accent))]" data-testid="link-ideas">Ideas worth spreading</a>
            <a href="#quote" className="text-xs font-medium transition-colors hover:text-[hsl(var(--accent))]" data-testid="link-history">Quote + history</a>
          </nav>
          <div className="flex items-center gap-2">
            <a href="#newsletter" className="hidden border border-[hsl(var(--primary))] px-4 py-2 text-[11px] font-bold uppercase tracking-[0.12em] text-[hsl(var(--primary))] transition-colors hover:bg-[hsl(var(--primary))] hover:text-[hsl(var(--primary-foreground))] sm:block" data-testid="link-subscribe">Get the brief</a>
            <button className="p-2 md:hidden" onClick={() => setMenuOpen((open) => !open)} aria-label="Toggle menu" data-testid="button-mobile-menu">{menuOpen ? <X size={20} /> : <Menu size={20} />}</button>
          </div>
        </div>
        {menuOpen && <nav className="border-t border-[hsl(var(--border))] px-5 py-4 md:hidden"><div className="flex flex-col gap-4 text-sm"><a href="#briefing" onClick={() => setMenuOpen(false)} data-testid="link-mobile-briefing">The briefing</a><a href="#ideas" onClick={() => setMenuOpen(false)} data-testid="link-mobile-ideas">Ideas worth spreading</a><a href="#quote" onClick={() => setMenuOpen(false)} data-testid="link-mobile-history">Quote + history</a><a href="#newsletter" onClick={() => setMenuOpen(false)} className="font-semibold text-[hsl(var(--primary))]" data-testid="link-mobile-subscribe">Get the brief</a></div></nav>}
      </header>

      <main>
        <section className="mx-auto max-w-[1280px] px-5 pb-10 pt-14 lg:px-8 lg:pb-16 lg:pt-24">
          <div className="grid items-end gap-10 lg:grid-cols-[1.15fr_.85fr]">
            <div className="rise-in">
              <p className="mono mb-5 text-[10px] uppercase tracking-[0.2em] text-[hsl(var(--accent))]">A five-minute advantage</p>
              <h1 className="serif max-w-[760px] text-[clamp(3.3rem,7.4vw,7.5rem)] font-semibold leading-[.88] tracking-[-0.06em]">The world is<br /><em className="font-normal text-[hsl(var(--primary))]">moving.</em><br />Stay oriented.</h1>
            </div>
            <div className="rise-in delay-1 pb-1 lg:max-w-[370px] lg:justify-self-end">
              <p className="text-lg leading-7 text-[hsl(var(--muted-foreground))]">Daily World Briefing is a calm, high-signal read for people who want to understand what is changing — and what to do with that understanding.</p>
              <a href="#briefing" className="mt-7 inline-flex items-center gap-2 border-b-2 border-[hsl(var(--accent))] pb-1 text-sm font-bold text-[hsl(var(--foreground))] transition-colors hover:text-[hsl(var(--primary))]" data-testid="link-start-reading">Start reading <ChevronRight size={15} /></a>
            </div>
          </div>
          <div className="mt-14 grid border-y border-[hsl(var(--border))] py-4 sm:grid-cols-3">
            <div className="flex items-center gap-3 border-b border-[hsl(var(--border))] pb-4 sm:border-b-0 sm:border-r sm:pb-0 sm:pl-0"><span className="serif text-3xl font-semibold text-[hsl(var(--accent))]">07:12</span><span className="text-xs text-[hsl(var(--muted-foreground))]">average<br />morning read</span></div>
            <div className="flex items-center gap-3 border-b border-[hsl(var(--border))] py-4 sm:border-b-0 sm:border-r sm:py-0 sm:pl-8"><span className="serif text-3xl font-semibold text-[hsl(var(--accent))]">142</span><span className="text-xs text-[hsl(var(--muted-foreground))]">editions<br />and counting</span></div>
            <div className="flex items-center gap-3 pt-4 sm:pt-0 sm:pl-8"><span className="serif text-3xl font-semibold text-[hsl(var(--accent))]">31k</span><span className="text-xs text-[hsl(var(--muted-foreground))]">curious people<br />reading with us</span></div>
          </div>
        </section>

        <div className="overflow-hidden border-y border-[hsl(var(--border))] bg-[hsl(var(--secondary)/.45)]">
          <div className="marquee-track flex min-w-max items-center gap-8 py-3 text-[10px] uppercase tracking-[0.17em] text-[hsl(var(--muted-foreground))]">
            <span>Today’s signal</span><span className="text-[hsl(var(--accent))]">•</span><span>Europe’s new grid bargain</span><span className="text-[hsl(var(--accent))]">•</span><span>The productive AI question</span><span className="text-[hsl(var(--accent))]">•</span><span>Small businesses, big leverage</span><span className="text-[hsl(var(--accent))]">•</span><span>Today’s signal</span><span className="text-[hsl(var(--accent))]">•</span><span>Europe’s new grid bargain</span><span className="text-[hsl(var(--accent))]">•</span><span>The productive AI question</span><span className="text-[hsl(var(--accent))]">•</span><span>Small businesses, big leverage</span>
          </div>
        </div>

        <section id="briefing" className="mx-auto max-w-[1280px] scroll-mt-20 px-5 py-14 lg:px-8 lg:py-20">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div><p className="mono mb-2 text-[10px] uppercase tracking-[0.2em] text-[hsl(var(--accent))]">The morning briefing</p><h2 className="serif text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">What matters today.</h2></div>
            <p className="max-w-[260px] text-right text-xs leading-5 text-[hsl(var(--muted-foreground))]">A considered mix of context, signal and useful surprise.</p>
          </div>
          <div className="grid gap-6 border-y border-[hsl(var(--border))] py-6 lg:grid-cols-[1.18fr_.82fr]">
            <article className="group grid gap-7 md:grid-cols-[1fr_1.05fr]">
              <div className="relative min-h-[260px] overflow-hidden md:min-h-[360px]"><Art kind="hero" color="#e36b43" /><span className="absolute left-4 top-4 bg-[hsl(var(--accent))] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[hsl(var(--accent-foreground))]">Lead story</span></div>
              <div className="flex flex-col justify-center">
                <div className="mb-4 flex items-center gap-2 text-[10px] uppercase tracking-[0.16em] text-[hsl(var(--primary))]"><span>World</span><span className="h-px w-4 bg-[hsl(var(--accent))]" /><span>8 min read</span></div>
                <h3 className="serif text-[clamp(2rem,3.5vw,3.5rem)] font-semibold leading-[.98] tracking-[-0.045em] transition-colors group-hover:text-[hsl(var(--primary))]">The quiet redesign of the global power grid</h3>
                <p className="mt-5 text-base leading-7 text-[hsl(var(--muted-foreground))]">For decades, energy security meant keeping the lights on at home. The next chapter is more ambitious: sharing power across borders, time zones and weather patterns.</p>
                <div className="mt-7 flex items-center justify-between border-t border-[hsl(var(--border))] pt-4 text-[11px] text-[hsl(var(--muted-foreground))]"><span>By Mara Osei · The Economist</span><BookmarkButton saved={saved.includes('grid')} onClick={() => toggleBookmark('grid')} id="lead-grid" /></div>
              </div>
            </article>
            <aside className="border-t border-[hsl(var(--border))] pt-5 lg:border-l lg:border-t-0 lg:pl-7 lg:pt-0">
              <p className="mono mb-5 text-[10px] uppercase tracking-[0.18em] text-[hsl(var(--muted-foreground))]">The short version</p>
              <div className="space-y-6">
                <div className="flex gap-4"><span className="serif text-2xl text-[hsl(var(--accent))]">01</span><div><h4 className="serif text-xl font-semibold leading-tight">A new industrial policy is arriving through the back door</h4><p className="mt-2 text-xs leading-5 text-[hsl(var(--muted-foreground))]">What the semiconductor race tells us about a less ideological decade.</p></div></div>
                <div className="flex gap-4 border-t border-[hsl(var(--border))] pt-5"><span className="serif text-2xl text-[hsl(var(--accent))]">02</span><div><h4 className="serif text-xl font-semibold leading-tight">The best AI product this week asks less of you</h4><p className="mt-2 text-xs leading-5 text-[hsl(var(--muted-foreground))]">Notes from the small, humane end of the automation spectrum.</p></div></div>
                <div className="flex gap-4 border-t border-[hsl(var(--border))] pt-5"><span className="serif text-2xl text-[hsl(var(--accent))]">03</span><div><h4 className="serif text-xl font-semibold leading-tight">A school day is an idea, not a law of nature</h4><p className="mt-2 text-xs leading-5 text-[hsl(var(--muted-foreground))]">The quiet global experiment changing when children learn.</p></div></div>
              </div>
            </aside>
          </div>
        </section>

        <section className="mx-auto max-w-[1280px] px-5 pb-16 lg:px-8 lg:pb-24">
          <div className="mb-8 flex flex-col gap-5 border-b border-[hsl(var(--border))] pb-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex gap-2 overflow-x-auto pb-1">{topics.map((topic) => <button key={topic} onClick={() => setActiveTopic(topic)} className={`whitespace-nowrap px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.1em] transition-colors ${activeTopic === topic ? 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]' : 'text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--primary))]'}`} data-testid={`button-filter-${topic.toLowerCase().replaceAll(' ', '-')}`}>{topic}</button>)}</div>
            <label className="flex items-center gap-2 border-b border-[hsl(var(--border))] px-1 pb-2 text-[12px] text-[hsl(var(--muted-foreground))] lg:w-60"><Search size={15} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search the briefing" className="w-full bg-transparent outline-none placeholder:text-[hsl(var(--muted-foreground))]" data-testid="input-search-briefing" /></label>
          </div>
          {filteredArticles.length > 0 ? <div className="grid gap-x-7 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">{filteredArticles.map((article) => <ArticleCard key={article.id} article={article} saved={saved.includes(article.id)} onBookmark={() => toggleBookmark(article.id)} />)}</div> : <div className="border border-dashed border-[hsl(var(--border))] py-16 text-center"><p className="serif text-2xl">Nothing by that name, yet.</p><p className="mt-2 text-sm text-[hsl(var(--muted-foreground))]">Try another phrase or return to the full briefing.</p><button onClick={() => { setQuery(''); setActiveTopic('All'); }} className="mt-5 text-xs font-bold uppercase tracking-[0.12em] text-[hsl(var(--primary))]" data-testid="button-reset-search">Reset search</button></div>}
        </section>

        <section id="ideas" className="scroll-mt-20 bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]">
          <div className="mx-auto max-w-[1280px] px-5 py-14 lg:px-8 lg:py-20">
            <div className="grid gap-10 lg:grid-cols-[.55fr_1.45fr]">
              <div><p className="mono mb-3 text-[10px] uppercase tracking-[0.2em] text-[hsl(var(--accent))]">Ideas worth spreading</p><h2 className="serif max-w-[330px] text-4xl font-semibold leading-[.98] tracking-[-0.04em] sm:text-5xl">A little ahead of the obvious.</h2><p className="mt-6 max-w-[280px] text-sm leading-6 opacity-70">Three promising premises to carry into a conversation, a notebook or your next venture.</p></div>
              <div className="grid divide-y divide-[hsl(var(--sidebar-border))] border-y border-[hsl(var(--sidebar-border))]">{ideas.map((idea) => <article key={idea.number} className="group grid gap-5 py-6 sm:grid-cols-[70px_1fr_120px] sm:items-center"><span className="serif text-3xl text-[hsl(var(--accent))]">{idea.number}</span><div><h3 className="serif text-2xl font-semibold transition-colors group-hover:text-[hsl(var(--accent))]">{idea.title}</h3><p className="mt-2 text-sm opacity-65">{idea.detail}</p></div><span className="text-[10px] uppercase tracking-[0.16em] opacity-60 sm:text-right">{idea.tag}</span></article>)}</div>
            </div>
          </div>
        </section>

        <section id="quote" className="mx-auto max-w-[1280px] scroll-mt-20 px-5 py-16 lg:px-8 lg:py-24">
          <div className="grid gap-10 lg:grid-cols-[1fr_1fr]">
            <div className="border-t-4 border-[hsl(var(--accent))] pt-6"><div className="flex items-center gap-3 text-[hsl(var(--accent))]"><Quote size={22} /><span className="mono text-[10px] uppercase tracking-[0.18em]">The thought for today</span></div><blockquote className="serif mt-7 max-w-[570px] text-[clamp(2rem,4vw,3.6rem)] font-medium leading-[1.02] tracking-[-0.045em]">“The future is already here — it’s just not evenly distributed.”</blockquote><p className="mt-6 text-sm text-[hsl(var(--muted-foreground))]">— William Gibson, science fiction writer</p></div>
            <div className="border-t border-[hsl(var(--border))] pt-6 lg:border-l lg:pl-10"><p className="mono text-[10px] uppercase tracking-[0.18em] text-[hsl(var(--muted-foreground))]">On this day · 1963</p><h3 className="serif mt-5 text-3xl font-semibold leading-tight">Valentina Tereshkova became the first woman in space.</h3><p className="mt-5 max-w-[430px] text-sm leading-6 text-[hsl(var(--muted-foreground))]">Her three-day solo flight aboard Vostok 6 was not simply a record. It was a message about who gets to imagine themselves inside the future.</p><div className="mt-7 flex items-center gap-2 text-xs font-semibold text-[hsl(var(--primary))]"><Sparkles size={15} /> A useful reminder: progress is also a story about permission.</div></div>
          </div>
        </section>

        <section id="newsletter" className="scroll-mt-20 border-y border-[hsl(var(--border))] bg-[hsl(var(--accent)/.15)]">
          <div className="mx-auto grid max-w-[1280px] gap-8 px-5 py-14 lg:grid-cols-[1fr_.8fr] lg:items-center lg:px-8 lg:py-20">
            <div><p className="mono mb-3 text-[10px] uppercase tracking-[0.2em] text-[hsl(var(--accent))]">Tomorrow, at 7:00</p><h2 className="serif max-w-[680px] text-4xl font-semibold leading-[.98] tracking-[-0.04em] sm:text-5xl">Put something good in your inbox.</h2><p className="mt-5 max-w-[560px] text-base leading-7 text-[hsl(var(--muted-foreground))]">No breaking-news panic. Just the context, questions and ideas that make the day feel a little more legible.</p></div>
            <form onSubmit={submitSignup} className="flex flex-col gap-3 sm:flex-row lg:flex-col" data-testid="form-newsletter"><label className="sr-only" htmlFor="briefing-email">Email address</label><div className="flex flex-1 items-center border-b-2 border-[hsl(var(--primary))] bg-[hsl(var(--card))] px-4 py-3"><Mail size={16} className="mr-3 text-[hsl(var(--muted-foreground))]" /><input id="briefing-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="your@email.com" className="w-full bg-transparent text-sm outline-none placeholder:text-[hsl(var(--muted-foreground))]" data-testid="input-newsletter-email" /></div><button type="submit" className="inline-flex items-center justify-center gap-2 bg-[hsl(var(--primary))] px-6 py-3 text-xs font-bold uppercase tracking-[0.13em] text-[hsl(var(--primary-foreground))] transition-transform hover:-translate-y-0.5" data-testid="button-newsletter-submit">{subscribed ? <><Check size={15} /> Subscribed</> : <><Send size={15} /> Send me the brief</>}</button>{signupMessage && <p className="text-xs text-[hsl(var(--primary))]" data-testid="status-newsletter">{signupMessage}</p>}</form>
          </div>
        </section>
      </main>

      <footer className="bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]">
        <div className="mx-auto flex max-w-[1280px] flex-col gap-8 px-5 py-10 lg:flex-row lg:items-end lg:justify-between lg:px-8">
          <div><Wordmark /><p className="mt-4 max-w-[270px] text-xs leading-5 opacity-60">A daily editorial briefing for a world worth paying attention to.</p></div>
          <div className="flex flex-wrap items-center gap-5 text-[11px] opacity-70"><a href="#top" className="hover:text-[hsl(var(--accent))]" data-testid="link-footer-top">Back to top</a><a href="#briefing" className="hover:text-[hsl(var(--accent))]" data-testid="link-footer-briefing">The briefing</a><span className="inline-flex items-center gap-1"><Clock3 size={13} /> Published each morning</span></div>
        </div>
        <div className="border-t border-[hsl(var(--sidebar-border))]"><div className="mx-auto max-w-[1280px] px-5 py-4 text-[10px] uppercase tracking-[0.14em] opacity-45 lg:px-8">Made for the curious · © 2024 Daily World Briefing</div></div>
      </footer>
    </div>
  );
}

function Router() {
  return (
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={Home} />
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;