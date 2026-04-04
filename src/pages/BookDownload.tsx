import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Download, BookOpen, FileText, Quote, Star, Users, ChevronDown } from 'lucide-react';

const chapters = [
  { num: '01', title: 'Decision Theory & Probabilistic Thinking' },
  { num: '02', title: 'Incentives & Power Structures' },
  { num: '03', title: 'Money Creation & Financial Systems' },
  { num: '04', title: 'Leverage — The Ultimate Force Multiplier' },
  { num: '05', title: 'Negotiation & Game Theory' },
  { num: '06', title: 'Psychology of Self' },
  { num: '07', title: 'Energy, Health & Cognitive Performance' },
  { num: '08', title: 'Systems Thinking' },
  { num: '09', title: 'Building & Owning Assets' },
  { num: '10', title: 'Time Architecture' },
  { num: '11', title: 'Execution & Bias Toward Action' },
  { num: '14', title: 'Risk Management & Asymmetric Bets' },
  { num: '15', title: 'Communication as a Power Tool' },
  { num: '19', title: 'Failure Engineering' },
  { num: '20', title: 'Tax Strategy & Legal Structures' },
  { num: '21', title: 'The Wealth Path — Skill to Ownership' },
  { num: '22', title: 'Network Architecture & Social Capital' },
  { num: '23', title: 'Technology as a Career Accelerant' },
];

const BookDownload = () => {
  const [downloadCount] = useState(427);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = '/books/what-school-never-taught-you.pdf';
    link.download = 'What-School-Never-Taught-You-Bhramar-Goswami-NSCU.pdf';
    link.click();
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-[hsl(var(--primary))] via-[hsl(var(--primary)/0.9)] to-[hsl(var(--primary)/0.8)] py-20 md:py-28 overflow-hidden">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-10 left-10 text-[20rem] font-serif text-white/10 leading-none select-none">∞</div>
          </div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 mb-6">
                <BookOpen className="w-4 h-4 text-white/80" />
                <span className="text-sm text-white/80 tracking-wide uppercase">Professional Mastery Series · NSCU</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
                What School<br />Never Taught You
              </h1>

              <p className="text-lg md:text-xl text-white/80 mb-2 font-light">
                A Wealth Operating Manual for the Serious Professional
              </p>
              <p className="text-base text-white/60 mb-8">
                by <span className="text-white/90 font-medium">Bhramar Goswami</span> · New States Continental University
              </p>

              <p className="text-base md:text-lg text-white/75 max-w-2xl mx-auto mb-8 leading-relaxed">
                Walk away with 20 mental frameworks for making better decisions about money, leverage, negotiation, and career design — the operating system your formal education never installed.
              </p>

              <div className="flex items-center justify-center gap-4 text-sm text-white/60 mb-10">
                <span className="flex items-center gap-1"><FileText className="w-4 h-4" /> Expanded Edition</span>
                <span className="text-white/30">·</span>
                <span>84+ Pages</span>
                <span className="text-white/30">·</span>
                <span>23 Chapters</span>
              </div>

              {/* Main Download Button */}
              <Button
                onClick={handleDownload}
                size="lg"
                className="bg-white text-[hsl(var(--primary))] hover:bg-white/90 text-lg px-10 py-6 rounded-xl shadow-2xl shadow-black/20 font-semibold gap-3 transition-all hover:scale-105"
              >
                <Download className="w-5 h-5" />
                Download Free PDF
              </Button>

              <div className="mt-4 flex items-center justify-center gap-3 text-sm text-white/50">
                <span>PDF · 1.7 MB</span>
                <span className="text-white/30">·</span>
                <span>No signup required</span>
              </div>

              <ChevronDown className="w-6 h-6 text-white/30 mx-auto mt-10 animate-bounce" />
            </div>
          </div>
        </section>

        {/* Hook Line */}
        <section className="py-12 bg-muted/30 border-y border-border">
          <div className="container mx-auto px-4 text-center">
            <p className="text-2xl md:text-3xl font-serif italic text-foreground/80 max-w-2xl mx-auto">
              "The operating manual your degree never included."
            </p>
          </div>
        </section>

        {/* Chapter Grid */}
        <section className="py-16 md:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-foreground mb-2 text-center">What's Inside</h2>
              <p className="text-muted-foreground text-center mb-10">20 frameworks across four domains — each one a gap in the standard curriculum.</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                {chapters.map((ch) => (
                  <div key={ch.num} className="flex items-start gap-3 py-2.5 border-b border-border/50">
                    <span className="text-xs font-mono text-primary/60 bg-primary/5 rounded px-1.5 py-0.5 mt-0.5 shrink-0">
                      {ch.num}
                    </span>
                    <span className="text-sm text-foreground/80">{ch.title}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Pull Quote */}
        <section className="py-16 bg-muted/20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <Quote className="w-10 h-10 text-primary/20 mx-auto mb-6" />
              <blockquote className="text-xl md:text-2xl text-foreground/80 font-serif italic leading-relaxed mb-6">
                "Formal education transmits accumulated knowledge and produces competent specialists. What is in dispute is this: the curriculum stopped updating. Students learn to find the right answer on a test rather than make good decisions under uncertainty."
              </blockquote>
              <cite className="text-sm text-muted-foreground not-italic">
                — From the Preface, <span className="font-medium text-foreground/70">What School Never Taught You</span>
              </cite>
            </div>
          </div>
        </section>

        {/* Author Block */}
        <section className="py-16 md:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto flex flex-col md:flex-row items-center gap-8">
              <div className="w-28 h-28 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center shrink-0">
                <span className="text-3xl font-bold text-primary/60">BG</span>
              </div>
              <div className="text-center md:text-left">
                <h3 className="text-xl font-bold text-foreground mb-1">Bhramar Goswami</h3>
                <p className="text-sm text-primary font-medium mb-3">Author · New States Continental University (NSCU)</p>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Published under the academic framework of NSCU and disseminated by the Global Council for Higher Education Accreditation (GCHEA) as part of its global professional education initiative. Part of the Professional Mastery Series.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Social Proof */}
        <section className="py-10 bg-muted/30 border-y border-border">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12">
              <div className="flex items-center gap-2 text-foreground/70">
                <Users className="w-5 h-5 text-primary/60" />
                <span className="text-sm font-medium">Downloaded by {downloadCount}+ NSCU students</span>
              </div>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
                <span className="text-sm text-muted-foreground ml-2">"Changed how I think about my career path."</span>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold text-foreground mb-3">Ready to close the curriculum gap?</h2>
            <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
              Every chapter gives you a framework you can apply this week. No theory for theory's sake.
            </p>

            <Button
              onClick={handleDownload}
              size="lg"
              className="text-lg px-10 py-6 rounded-xl shadow-lg font-semibold gap-3 transition-all hover:scale-105"
            >
              <Download className="w-5 h-5" />
              Download Free PDF
            </Button>

            <p className="mt-4 text-sm text-muted-foreground">
              PDF · 1.7 MB · Free for all NSCU students and faculty
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default BookDownload;
