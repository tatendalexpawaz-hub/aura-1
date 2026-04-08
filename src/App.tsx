import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { ShoppingBag, Search, Menu, X, ArrowRight, Instagram, Twitter, Disc, ChevronLeft, ChevronRight } from 'lucide-react';

// --- Types ---
interface Product {
  id: number;
  name: string;
  category: string;
  price: string;
  image: string;
  description: string;
}

// --- Mock Data ---
const PRODUCTS: Product[] = [
  // DRIP (10 Items)
  { id: 1, name: "HEAVYWEIGHT OVERSIZED HOODIE", category: "DRIP", price: "$450", image: "https://picsum.photos/seed/drip1/800/1000", description: "Premium 500gsm cotton fleece. Dropped shoulders. Boxy fit." },
  { id: 2, name: "TACTICAL CARGO PANTS", category: "DRIP", price: "$680", image: "https://picsum.photos/seed/drip2/800/1000", description: "Water-repellent nylon. Multi-pocket utilitarian design. Adjustable cuffs." },
  { id: 3, name: "DISTRESSED PUFFER JACKET", category: "DRIP", price: "$1,450", image: "https://picsum.photos/seed/drip3/800/1000", description: "Goose down fill. Hand-distressed finish. Oversized silhouette." },
  { id: 4, name: "WASHED GRAPHIC TEE", category: "DRIP", price: "$220", image: "https://picsum.photos/seed/drip4/800/1000", description: "Vintage wash. Heavyweight cotton. Screen-printed front graphic." },
  { id: 5, name: "NYLON TRACK JACKET", category: "DRIP", price: "$550", image: "https://picsum.photos/seed/drip5/800/1000", description: "Lightweight shell. Mesh lining. Reflective piping details." },
  { id: 6, name: "WIDE LEG DENIM", category: "DRIP", price: "$420", image: "https://picsum.photos/seed/drip6/800/1000", description: "14oz Japanese denim. Baggy fit. Custom hardware." },
  { id: 7, name: "CROPPED KNIT SWEATER", category: "DRIP", price: "$380", image: "https://picsum.photos/seed/drip7/800/1000", description: "Chunky wool blend. Distressed hem. Cropped body, elongated sleeves." },
  { id: 8, name: "UTILITY VEST", category: "DRIP", price: "$480", image: "https://picsum.photos/seed/drip8/800/1000", description: "Multiple 3D pockets. Adjustable webbing straps. Matte black hardware." },
  { id: 9, name: "MOCK NECK LONG SLEEVE", category: "DRIP", price: "$190", image: "https://picsum.photos/seed/drip9/800/1000", description: "Form-fitting ribbed cotton. Embroidered logo on collar." },
  { id: 10, name: "PANELLED TRACK PANTS", category: "DRIP", price: "$350", image: "https://picsum.photos/seed/drip10/800/1000", description: "Contrast side panels. Elasticated waist. Relaxed fit." },

  // FOOTWEAR (7 Items)
  { id: 11, name: "CHUNKY PLATFORM SNEAKERS", category: "FOOTWEAR", price: "$950", image: "https://picsum.photos/seed/footwear1/800/1000", description: "Exaggerated rubber sole. Premium leather upper. Tonal stitching." },
  { id: 12, name: "LEATHER COMBAT BOOTS", category: "FOOTWEAR", price: "$1,100", image: "https://picsum.photos/seed/footwear2/800/1000", description: "Calfskin leather. Lug sole. Side zip closure." },
  { id: 13, name: "SLIP-ON MULES", category: "FOOTWEAR", price: "$520", image: "https://picsum.photos/seed/footwear3/800/1000", description: "Suede upper. Cork footbed. Minimalist slip-on design." },
  { id: 14, name: "TECHNICAL RUNNERS", category: "FOOTWEAR", price: "$680", image: "https://picsum.photos/seed/footwear4/800/1000", description: "Breathable mesh. Vibram outsole. Speed lacing system." },
  { id: 15, name: "HIGH-TOP COURT SNEAKERS", category: "FOOTWEAR", price: "$750", image: "https://picsum.photos/seed/footwear5/800/1000", description: "Vintage basketball silhouette. Distressed leather finish." },
  { id: 16, name: "ZIP-UP ANKLE BOOTS", category: "FOOTWEAR", price: "$980", image: "https://picsum.photos/seed/footwear6/800/1000", description: "Square toe. Stacked heel. Premium Italian leather." },
  { id: 17, name: "PUFFER SNOW BOOTS", category: "FOOTWEAR", price: "$850", image: "https://picsum.photos/seed/footwear7/800/1000", description: "Insulated nylon upper. Drawstring toggle. Heavy-duty tread." },

  // ACCESSORIES (5 Items)
  { id: 18, name: "CHROME CUBAN LINK", category: "ACCESSORIES", price: "$1,200", image: "https://picsum.photos/seed/acc1/800/1000", description: "Solid 925 sterling silver. Heavyweight links. Custom clasp." },
  { id: 19, name: "FRAMELESS SHIELD SUNGLASSES", category: "ACCESSORIES", price: "$450", image: "https://picsum.photos/seed/acc2/800/1000", description: "Wraparound design. UV400 protection. Engraved logo." },
  { id: 20, name: "KNIT BALACLAVA", category: "ACCESSORIES", price: "$180", image: "https://picsum.photos/seed/acc3/800/1000", description: "100% Merino wool. Ribbed face opening. Extended neck." },
  { id: 21, name: "TACTICAL CROSSBODY BAG", category: "ACCESSORIES", price: "$320", image: "https://picsum.photos/seed/acc4/800/1000", description: "Cordura nylon. Fidlock magnetic buckle. Multiple compartments." },
  { id: 22, name: "LEATHER CARDHOLDER", category: "ACCESSORIES", price: "$150", image: "https://picsum.photos/seed/acc5/800/1000", description: "Full-grain leather. 4 card slots. Central cash pocket." }
];

const CATEGORIES = [
  { name: "DRIP", image: "https://images.unsplash.com/photo-1523398002811-999aa8d9512e?auto=format&fit=crop&q=80&w=1200", offset: "md:mt-0" },
  { name: "FOOTWEAR", image: "https://images.unsplash.com/photo-1552346154-21d32810baa3?auto=format&fit=crop&q=80&w=1200", offset: "md:mt-32" },
  { name: "ACCESSORIES", image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=1200", offset: "md:mt-16" }
];

// --- Utility Components ---
const FadeIn = ({ children, delay = 0, className = "" }: { children: React.ReactNode, delay?: number, className?: string, key?: React.Key }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.8, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
    className={className}
  >
    {children}
  </motion.div>
);

// --- Sections ---

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full z-50">
      <nav className={`transition-all duration-500 ${isScrolled ? 'bg-drip-cream/95 backdrop-blur-md py-4 shadow-sm' : 'bg-transparent py-8'}`}>
        <div className="max-w-[90rem] mx-auto px-6 md:px-12 flex items-center justify-between">
          {/* Left Links */}
          <div className="hidden md:flex items-center space-x-10 text-[11px] font-mono uppercase tracking-[0.2em] font-bold">
            <Link to="/shop" className="hover:text-drip-darkgray transition-colors relative group">
              SHOP
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-drip-black transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link to="/drops" className="hover:text-drip-darkgray transition-colors relative group">
              DROPS
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-drip-black transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link to="/archive" className="hover:text-drip-darkgray transition-colors relative group">
              ARCHIVE
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-drip-black transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </div>

          {/* Logo */}
          <div className="absolute left-1/2 -translate-x-1/2">
            <Link to="/" className="text-4xl font-display font-bold tracking-tighter">AURA</Link>
          </div>

          {/* Right Icons */}
          <div className="flex items-center space-x-8">
            <button className="hover:text-drip-darkgray transition-colors">
              <Search size={20} strokeWidth={1.5} />
            </button>
            <button className="hover:text-drip-darkgray transition-colors flex items-center space-x-2">
              <ShoppingBag size={20} strokeWidth={1.5} />
              <span className="font-mono text-[10px] font-bold">(0)</span>
            </button>
            <button className="md:hidden hover:text-drip-darkgray transition-colors" onClick={() => setIsMobileMenuOpen(true)}>
              <Menu size={24} strokeWidth={1.5} />
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, y: '-100%' }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: '-100%' }}
              transition={{ type: "tween", duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
              className="fixed inset-0 bg-drip-cream z-[60] flex flex-col items-center justify-center space-y-8"
            >
              <button className="absolute top-8 right-8 text-drip-black hover:text-drip-darkgray" onClick={() => setIsMobileMenuOpen(false)}>
                <X size={32} strokeWidth={1.5} />
              </button>
              <Link to="/shop" className="text-6xl font-display font-bold tracking-tighter hover:text-stroke transition-all" onClick={() => setIsMobileMenuOpen(false)}>SHOP</Link>
              <Link to="/drops" className="text-6xl font-display font-bold tracking-tighter hover:text-stroke transition-all" onClick={() => setIsMobileMenuOpen(false)}>DROPS</Link>
              <Link to="/archive" className="text-6xl font-display font-bold tracking-tighter hover:text-stroke transition-all" onClick={() => setIsMobileMenuOpen(false)}>ARCHIVE</Link>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </div>
  );
};

const Hero = () => {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, 250]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const [mediaUrl, setMediaUrl] = useState<string>("https://images.unsplash.com/photo-1618331835717-801e976710b2?auto=format&fit=crop&q=80&w=1200");
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setMediaUrl(url);
      setMediaType(file.type.startsWith('video/') ? 'video' : 'image');
    }
  };

  return (
    <section className="relative min-h-screen pt-32 pb-16 px-6 md:px-12 max-w-[90rem] mx-auto flex flex-col md:flex-row items-center justify-between">
      <div className="w-full md:w-5/12 z-10 flex flex-col justify-center mt-12 md:mt-0 order-2 md:order-1">
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="text-7xl md:text-8xl lg:text-[8rem] font-display font-bold leading-[0.85] tracking-tighter mb-10"
        >
          NEW <br />
          <span className="text-stroke">STANDARD</span>
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="text-drip-darkgray font-sans text-lg max-w-sm mb-12 leading-relaxed"
        >
          Elevating the everyday. Brutalist silhouettes engineered for the modern landscape.
        </motion.p>

        <motion.button 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="self-start group flex items-center space-x-4 bg-drip-black text-drip-cream px-8 py-4 font-mono text-xs font-bold tracking-widest hover:bg-drip-darkgray transition-colors"
        >
          <span>EXPLORE COLLECTION</span>
          <ArrowRight size={16} className="transition-transform group-hover:translate-x-2" />
        </motion.button>
      </div>

      <div className="w-full md:w-6/12 h-[60vh] md:h-[85vh] relative overflow-hidden order-1 md:order-2 group">
        <motion.div 
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="w-full h-full"
        >
          <motion.div style={{ y, opacity }} className="w-full h-[120%] -mt-[10%]">
            {mediaType === 'video' ? (
              <video 
                src={mediaUrl} 
                autoPlay 
                loop 
                muted 
                playsInline
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000"
              />
            ) : (
              <img 
                src={mediaUrl} 
                alt="Editorial Fashion" 
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000"
                referrerPolicy="no-referrer"
              />
            )}
          </motion.div>
        </motion.div>

        {/* Upload Button */}
        <button 
          onClick={() => fileInputRef.current?.click()}
          className="absolute bottom-6 right-6 z-20 bg-drip-black/80 hover:bg-drip-black text-drip-cream px-4 py-2 text-[10px] font-mono font-bold tracking-widest backdrop-blur-sm transition-colors opacity-0 group-hover:opacity-100"
        >
          CHANGE MEDIA
        </button>
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept="image/*,video/*" 
          className="hidden" 
        />
      </div>
    </section>
  );
};

const MassiveTicker = () => {
  return (
    <div className="py-24 md:py-32 overflow-hidden flex whitespace-nowrap opacity-10 pointer-events-none select-none">
      <motion.h2 
        animate={{ x: [0, -2000] }} 
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }} 
        className="text-[8rem] md:text-[12rem] font-display font-bold text-stroke-massive leading-none tracking-tighter"
      >
        AURA WORLDWIDE /// AURA WORLDWIDE /// AURA WORLDWIDE /// AURA WORLDWIDE ///
      </motion.h2>
    </div>
  );
};

const Categories = () => {
  return (
    <section className="py-12 md:py-24 px-6 md:px-12 max-w-[90rem] mx-auto">
      <FadeIn>
        <div className="flex items-center justify-between mb-16 md:mb-24">
          <h2 className="text-4xl md:text-6xl font-display font-bold tracking-tighter">THE ARCHIVE</h2>
          <a href="#" className="hidden md:flex items-center space-x-2 font-mono text-xs font-bold tracking-widest hover:text-drip-darkgray transition-colors">
            <span>VIEW ALL</span>
            <ArrowRight size={14} />
          </a>
        </div>
      </FadeIn>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
        {CATEGORIES.map((cat, idx) => (
          <FadeIn key={cat.name} delay={idx * 0.2} className={cat.offset}>
            <div className="group cursor-pointer">
              <div className="relative aspect-[3/4] overflow-hidden bg-drip-bone mb-6">
                <img 
                  src={cat.image} 
                  alt={cat.name} 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500" />
              </div>
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-display font-bold tracking-tighter">{cat.name}</h3>
                <span className="font-mono text-[10px] font-bold tracking-widest opacity-0 group-hover:opacity-100 transition-opacity transform -translate-x-4 group-hover:translate-x-0 duration-300">
                  EXPLORE
                </span>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
};

const ProductCarousel = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth / 1.5 : scrollLeft + clientWidth / 1.5;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-32 bg-drip-bone mt-24">
      <div className="max-w-[90rem] mx-auto px-6 md:px-12">
        <FadeIn>
          <div className="flex items-end justify-between mb-16">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-2 h-2 bg-drip-black animate-pulse" />
                <span className="font-mono text-xs uppercase font-bold tracking-widest text-drip-darkgray">
                  LATEST ARRIVALS
                </span>
              </div>
              <h2 className="text-5xl md:text-7xl font-display font-bold tracking-tighter text-drip-black">
                THE ESSENTIALS
              </h2>
            </div>
            <div className="hidden md:flex space-x-4">
              <button onClick={() => scroll('left')} className="p-4 rounded-full border border-drip-black/20 hover:bg-drip-black hover:text-drip-cream transition-all">
                <ChevronLeft size={24} strokeWidth={1.5} />
              </button>
              <button onClick={() => scroll('right')} className="p-4 rounded-full border border-drip-black/20 hover:bg-drip-black hover:text-drip-cream transition-all">
                <ChevronRight size={24} strokeWidth={1.5} />
              </button>
            </div>
          </div>
        </FadeIn>

        <div 
          ref={scrollRef}
          className="flex overflow-x-auto no-scrollbar space-x-8 pb-12 -mx-6 px-6 md:mx-0 md:px-0"
        >
          {PRODUCTS.map((product, idx) => (
            <FadeIn key={product.id} delay={idx * 0.1} className="min-w-[85vw] md:min-w-[450px] group cursor-pointer shrink-0">
              <div className="aspect-[4/5] overflow-hidden bg-drip-cream mb-8 relative">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 mix-blend-multiply group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-6 left-6 bg-drip-black text-drip-cream font-mono text-[10px] font-bold px-3 py-1.5">
                  {product.category}
                </div>
              </div>
              <div className="flex justify-between items-start">
                <h4 className="text-xl font-display font-bold tracking-tight max-w-[70%] text-drip-black group-hover:text-drip-darkgray transition-colors leading-tight">{product.name}</h4>
                <p className="font-mono font-bold text-drip-black">{product.price}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};

const Manifesto = () => {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0.5, 1], [0, 150]);

  return (
    <section className="py-32 md:py-48 bg-drip-black text-drip-cream overflow-hidden">
      <div className="max-w-[90rem] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 items-center">
          
          <div className="md:col-span-5 order-2 md:order-1 z-10">
            <FadeIn>
              <div className="font-mono text-xs uppercase font-bold tracking-[0.3em] text-drip-gray mb-8">/// THE MANIFESTO</div>
              <h2 className="text-5xl md:text-7xl font-display font-bold mb-10 leading-[0.9] tracking-tighter">
                FORM <br /> FOLLOWS <br /> <span className="text-stroke-light">FUNCTION</span>
              </h2>
              <p className="text-drip-gray font-sans text-lg leading-relaxed mb-8 max-w-md">
                At Aura, our vision is to dissolve borders and redefine the local fashion landscape. We believe that elite, global style shouldn't be out of reach. We are dedicated to bringing the world's most sought-after international drip directly to your South African doorstep.
              </p>
              <p className="text-drip-gray font-sans text-lg leading-relaxed mb-12 max-w-md">
                From the iconic legacy of high-end titans like Louis Vuitton to the raw, exclusive streetwear culture of brands like Corteiz, we scour the USA, the UK, and beyond to curate a collection that speaks to those who demand the best. Aura isn't just about clothing; it's about giving you the global access to elevate your presence and own your aesthetic, without the flight.
              </p>
              <Link to="/vision" className="inline-flex items-center space-x-4 group border-b border-drip-cream pb-2 hover:text-drip-gray hover:border-drip-gray transition-colors">
                <span className="font-mono text-xs font-bold tracking-widest">READ THE VISION</span>
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-2" />
              </Link>
            </FadeIn>
          </div>
          
          <div className="md:col-span-7 order-1 md:order-2 relative h-[60vh] md:h-[90vh]">
            <motion.div style={{ y }} className="absolute inset-0 w-full h-[120%] -top-[10%]">
              <img 
                src="https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&q=80&w=1600" 
                alt="The Vision" 
                className="w-full h-full object-cover grayscale opacity-80"
                referrerPolicy="no-referrer"
              />
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="bg-drip-cream pt-32 pb-12 px-6 md:px-12 overflow-hidden">
      <div className="max-w-[90rem] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 mb-32">
          
          <div className="md:col-span-6">
            <h3 className="text-4xl md:text-5xl font-display font-bold tracking-tighter mb-6 text-drip-black">JOIN THE SYNDICATE</h3>
            <p className="text-drip-darkgray font-sans mb-10 max-w-md text-lg">Gain classified access to limited drops, archive sales, and private events.</p>
            <form className="flex max-w-md border-b-2 border-drip-black focus-within:border-drip-darkgray transition-colors pb-3">
              <input 
                type="email" 
                placeholder="ENTER EMAIL ADDRESS" 
                className="bg-transparent border-none outline-none flex-grow font-mono text-sm py-2 placeholder:text-drip-black/40 text-drip-black"
              />
              <button type="submit" className="font-mono font-bold text-sm uppercase tracking-widest text-drip-black hover:text-drip-darkgray transition-colors">SUBMIT</button>
            </form>
          </div>
          
          <div className="md:col-span-3">
            <h4 className="font-mono text-xs font-bold uppercase tracking-[0.2em] mb-8 text-drip-black/50">SUPPORT</h4>
            <ul className="space-y-5 font-sans text-sm font-medium text-drip-black">
              <li><a href="#" className="hover:text-drip-darkgray transition-colors">CONTACT</a></li>
              <li><a href="#" className="hover:text-drip-darkgray transition-colors">SHIPPING & RETURNS</a></li>
              <li><a href="#" className="hover:text-drip-darkgray transition-colors">SIZE GUIDE</a></li>
              <li><a href="#" className="hover:text-drip-darkgray transition-colors">FAQ</a></li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <h4 className="font-mono text-xs font-bold uppercase tracking-[0.2em] mb-8 text-drip-black/50">NETWORK</h4>
            <div className="flex space-x-6 text-drip-black">
              <a href="#" className="hover:text-drip-darkgray transition-colors"><Instagram size={24} strokeWidth={1.5} /></a>
              <a href="#" className="hover:text-drip-darkgray transition-colors"><Twitter size={24} strokeWidth={1.5} /></a>
              <a href="#" className="hover:text-drip-darkgray transition-colors"><Disc size={24} strokeWidth={1.5} /></a>
            </div>
          </div>
        </div>

        {/* Massive Footer Text */}
        <div className="w-full border-t border-drip-black/10 pt-12 flex flex-col items-center">
          <h1 className="text-[15vw] font-display font-bold tracking-tighter leading-none text-drip-black select-none">
            AURA
          </h1>
          <div className="w-full flex flex-col md:flex-row justify-between items-center mt-8 font-mono text-xs font-bold uppercase tracking-widest text-drip-black/40">
            <p>&copy; 2026 AURA WORLDWIDE.</p>
            <div className="flex space-x-8 mt-6 md:mt-0">
              <a href="#" className="hover:text-drip-black transition-colors">PRIVACY</a>
              <a href="#" className="hover:text-drip-black transition-colors">TERMS</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const Home = () => (
  <>
    <Hero />
    <MassiveTicker />
    <Categories />
    <ProductCarousel />
    <Manifesto />
  </>
);

const VisionPage = () => {
  const { scrollYProgress } = useScroll();
  const y1 = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -150]);

  return (
    <div className="pt-40 pb-24 bg-drip-cream min-h-screen">
      <div className="max-w-[90rem] mx-auto px-6 md:px-12">
        <FadeIn>
          <div className="font-mono text-xs uppercase font-bold tracking-[0.3em] text-drip-darkgray mb-8">/// OUR MISSION</div>
          <h1 className="text-6xl md:text-8xl lg:text-[10rem] font-display font-bold leading-[0.85] tracking-tighter mb-24 text-drip-black">
            NO <span className="text-stroke">BORDERS.</span> <br />
            JUST <span className="text-stroke">AURA.</span>
          </h1>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center mb-32">
          <FadeIn className="order-2 md:order-1">
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-8 tracking-tighter text-drip-black">REDEFINING THE LOCAL LANDSCAPE</h2>
            <p className="text-drip-darkgray font-sans text-xl leading-relaxed mb-6">
              At Aura, our vision is to dissolve borders and redefine the local fashion landscape. We believe that elite, global style shouldn't be out of reach.
            </p>
            <p className="text-drip-darkgray font-sans text-xl leading-relaxed">
              We are dedicated to bringing the world's most sought-after international drip directly to your South African doorstep.
            </p>
          </FadeIn>
          <div className="order-1 md:order-2 h-[50vh] md:h-[70vh] overflow-hidden relative bg-drip-bone">
            <motion.img 
              style={{ y: y1 }}
              src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&q=80&w=1200" 
              alt="Global Fashion" 
              className="w-full h-[130%] -top-[15%] absolute object-cover grayscale"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center mb-32">
          <div className="h-[50vh] md:h-[70vh] overflow-hidden relative bg-drip-bone">
            <motion.img 
              style={{ y: y2 }}
              src="https://images.unsplash.com/photo-1617391654484-2894196c2341?auto=format&fit=crop&q=80&w=1200" 
              alt="Streetwear Culture" 
              className="w-full h-[130%] -top-[15%] absolute object-cover grayscale"
              referrerPolicy="no-referrer"
            />
          </div>
          <FadeIn>
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-8 tracking-tighter text-drip-black">WITHOUT THE FLIGHT</h2>
            <p className="text-drip-darkgray font-sans text-xl leading-relaxed mb-6">
              From the iconic legacy of high-end titans like Louis Vuitton to the raw, exclusive streetwear culture of brands like Corteiz, we scour the USA, the UK, and beyond to curate a collection that speaks to those who demand the best.
            </p>
            <p className="text-drip-darkgray font-sans text-xl leading-relaxed">
              Aura isn't just about clothing; it's about giving you the global access to elevate your presence and own your aesthetic, without the flight.
            </p>
          </FadeIn>
        </div>
        
        <FadeIn className="flex justify-center mt-24">
          <Link to="/" className="group flex items-center space-x-4 bg-drip-black text-drip-cream px-8 py-4 font-mono text-xs font-bold tracking-widest hover:bg-drip-darkgray transition-colors">
            <ChevronLeft size={16} className="transition-transform group-hover:-translate-x-2" />
            <span>BACK TO HOME</span>
          </Link>
        </FadeIn>
      </div>
    </div>
  );
};

const ShopPage = () => {
  return (
    <div className="pt-40 pb-24 bg-drip-cream min-h-screen">
      <div className="max-w-[90rem] mx-auto px-6 md:px-12">
        <FadeIn>
          <div className="font-mono text-xs uppercase font-bold tracking-[0.3em] text-drip-darkgray mb-8">/// FULL INVENTORY</div>
          <h1 className="text-6xl md:text-8xl font-display font-bold tracking-tighter mb-24 text-drip-black">
            THE <span className="text-stroke">COLLECTION</span>
          </h1>
        </FadeIn>

        {['DRIP', 'FOOTWEAR', 'ACCESSORIES'].map((cat) => (
          <div key={cat} className="mb-32">
            <FadeIn>
              <div className="flex items-center space-x-4 mb-12 border-b border-drip-black/10 pb-4">
                <h2 className="text-4xl md:text-5xl font-display font-bold tracking-tighter text-drip-black">{cat}</h2>
                <span className="font-mono text-sm font-bold text-drip-darkgray">
                  [{PRODUCTS.filter(p => p.category === cat).length}]
                </span>
              </div>
            </FadeIn>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
              {PRODUCTS.filter(p => p.category === cat).map((product, idx) => (
                <FadeIn key={product.id} delay={idx * 0.1}>
                  <div className="group cursor-pointer">
                    <div className="aspect-[4/5] overflow-hidden bg-drip-bone mb-6 relative border border-drip-black/10 group-hover:border-drip-black transition-colors">
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 mix-blend-multiply group-hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-xl font-display font-bold tracking-tight max-w-[70%] text-drip-black group-hover:text-drip-darkgray transition-colors leading-tight">{product.name}</h4>
                      <p className="font-mono font-bold text-drip-black">{product.price}</p>
                    </div>
                    <p className="font-sans text-sm text-drip-darkgray leading-relaxed">{product.description}</p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ComingSoonPage = ({ title }: { title: string }) => (
  <div className="pt-40 pb-24 bg-drip-cream min-h-screen flex flex-col items-center justify-center text-center px-6">
    <FadeIn>
      <div className="font-mono text-xs uppercase font-bold tracking-[0.3em] text-drip-darkgray mb-8">/// CLASSIFIED</div>
      <h1 className="text-6xl md:text-8xl font-display font-bold tracking-tighter mb-12 text-drip-black uppercase">
        {title} <br /> <span className="text-stroke">COMING SOON</span>
      </h1>
      <Link to="/" className="inline-flex items-center space-x-4 group border-b border-drip-black pb-2 hover:text-drip-darkgray hover:border-drip-darkgray transition-colors">
        <ChevronLeft size={16} className="transition-transform group-hover:-translate-x-2" />
        <span className="font-mono text-xs font-bold tracking-widest">RETURN TO BASE</span>
      </Link>
    </FadeIn>
  </div>
);

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen selection:bg-drip-black selection:text-drip-cream">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/vision" element={<VisionPage />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/drops" element={<ComingSoonPage title="Drops" />} />
            <Route path="/archive" element={<ComingSoonPage title="Archive" />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
