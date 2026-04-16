import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "@/components/ui/icon";

const IMG_HERO     = "https://cdn.poehali.dev/projects/2f8a7944-da00-40da-8e28-49f3040aec02/files/3873c292-a11a-49c6-be5f-9f1ee61c1a90.jpg";
const IMG_KITCHEN  = "https://cdn.poehali.dev/projects/2f8a7944-da00-40da-8e28-49f3040aec02/files/c154e98a-2c0d-4730-85b3-3f8e7898ade3.jpg";
const IMG_BEDROOM  = "https://cdn.poehali.dev/projects/2f8a7944-da00-40da-8e28-49f3040aec02/files/d424443e-77ce-40af-a0bb-ffad46889afe.jpg";
const IMG_WARDROBE = "https://cdn.poehali.dev/projects/2f8a7944-da00-40da-8e28-49f3040aec02/files/53c3c80c-a6c9-481b-877b-c64cf62e9866.jpg";

const products = [
  { id: 1,  name: "Диван «Норд»",      category: "Диваны",  material: "Ткань",  price: 89900,  image: IMG_HERO,     tag: "Хит" },
  { id: 2,  name: "Кухня «Альта»",     category: "Кухни",   material: "МДФ",    price: 145000, image: IMG_KITCHEN,  tag: "Новинка" },
  { id: 3,  name: "Кровать «Тихая»",   category: "Спальни", material: "Дерево", price: 68000,  image: IMG_BEDROOM,  tag: "" },
  { id: 4,  name: "Шкаф «Линия»",      category: "Шкафы",   material: "ЛДСП",  price: 54000,  image: IMG_WARDROBE, tag: "" },
  { id: 5,  name: "Диван «Фьорд»",     category: "Диваны",  material: "Кожа",   price: 112000, image: IMG_HERO,     tag: "" },
  { id: 6,  name: "Кухня «Модерн»",    category: "Кухни",   material: "Эмаль",  price: 198000, image: IMG_KITCHEN,  tag: "Хит" },
  { id: 7,  name: "Спальный гарнитур", category: "Спальни", material: "Дерево", price: 210000, image: IMG_BEDROOM,  tag: "Новинка" },
  { id: 8,  name: "Шкаф-купе «Арко»",  category: "Шкафы",   material: "Стекло", price: 87000,  image: IMG_WARDROBE, tag: "" },
  { id: 9,  name: "Диван «Уют»",       category: "Диваны",  material: "Велюр",  price: 74000,  image: IMG_HERO,     tag: "" },
  { id: 10, name: "Кухня «Классик»",   category: "Кухни",   material: "Дерево", price: 175000, image: IMG_KITCHEN,  tag: "" },
  { id: 11, name: "Кровать «Берег»",   category: "Спальни", material: "МДФ",    price: 45000,  image: IMG_BEDROOM,  tag: "Хит" },
  { id: 12, name: "Шкаф «Минима»",     category: "Шкафы",   material: "ЛДСП",  price: 38000,  image: IMG_WARDROBE, tag: "" },
];

const CATEGORIES = ["Все", "Диваны", "Кухни", "Спальни", "Шкафы"];
const MATERIALS  = ["Все", "Ткань", "Кожа", "Велюр", "МДФ", "ЛДСП", "Дерево", "Эмаль", "Стекло"];
const MAX_PRICE  = 250000;
const fmt = (n: number) => n.toLocaleString("ru-RU") + " ₽";



type CartItem = { id: number; name: string; price: number; image: string; qty: number };

export default function Index() {
  const navigate = useNavigate();
  const [scrolled, setScrolled]     = useState(0);
  const [activeSection, setActive]  = useState("home");
  const [menuOpen, setMenuOpen]     = useState(false);
  const [cartOpen, setCartOpen]     = useState(false);
  const [cart, setCart]             = useState<CartItem[]>([]);
  const [filterCat, setFilterCat]   = useState("Все");
  const [filterMat, setFilterMat]   = useState("Все");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, MAX_PRICE]);
  const [filterOpen, setFilterOpen] = useState(false);
  const cartRef = useRef<HTMLDivElement>(null);
  const cartDrawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(Math.min(window.scrollY / 120, 1));
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (cartRef.current && !cartRef.current.contains(e.target as Node)) setCartOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  /* Блокировка прокрутки при открытой корзине на мобильном */
  useEffect(() => {
    document.body.style.overflow = (cartOpen && window.innerWidth < 768) ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [cartOpen]);

  const scrollTo = (id: string) => {
    setActive(id);
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const cartTotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const filtered  = products.filter(p =>
    (filterCat === "Все" || p.category === filterCat) &&
    (filterMat === "Все" || p.material === filterMat) &&
    p.price >= priceRange[0] && p.price <= priceRange[1]
  );

  const addToCart = (p: typeof products[0]) =>
    setCart(prev => {
      const ex = prev.find(i => i.id === p.id);
      if (ex) return prev.map(i => i.id === p.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { id: p.id, name: p.name, price: p.price, image: p.image, qty: 1 }];
    });

  const removeFromCart = (id: number) => setCart(p => p.filter(i => i.id !== id));
  const changeQty = (id: number, d: number) =>
    setCart(p => p.map(i => i.id === id ? { ...i, qty: Math.max(1, i.qty + d) } : i));

  const navLinks = [
    { id: "home",        label: "Главная" },
    { id: "catalog",     label: "Каталог" },
    { id: "recommended", label: "Рекомендации" },
    { id: "about",       label: "О нас" },
    { id: "contacts",    label: "Контакты" },
  ];

  const navBg     = `rgba(248,248,246,${scrolled * 0.97})`;
  const navBorder = `rgba(218,218,214,${scrolled})`;
  const navText   = scrolled > 0.4 ? "#2a2a2a" : "#ffffff";
  const navSub    = scrolled > 0.4 ? "#999" : "rgba(255,255,255,0.72)";

  return (
    <div className="min-h-screen bg-[#f9f9f8] text-[#1a1a1a]" style={{ fontFamily: "'Golos Text', sans-serif" }}>

      {/* ── NAV ─────────────────────────────────────────────────── */}
      <header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{ background: navBg, borderBottom: `1px solid ${navBorder}`, backdropFilter: scrolled > 0.1 ? "blur(12px)" : "none" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
          <button
            onClick={() => scrollTo("home")}
            className="text-xl sm:text-2xl font-light tracking-[0.2em] transition-colors duration-300"
            style={{ color: navText, fontFamily: "'Cormorant', serif" }}
          >
            MERTA
          </button>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
            {navLinks.map(l => (
              <button
                key={l.id}
                onClick={() => scrollTo(l.id)}
                className="text-sm tracking-wide transition-colors duration-300 pb-0.5 whitespace-nowrap"
                style={{
                  color: activeSection === l.id ? navText : navSub,
                  borderBottom: activeSection === l.id ? `1px solid ${navText}` : "1px solid transparent",
                }}
              >
                {l.label}
              </button>
            ))}
            <button
              onClick={() => navigate("/calculator")}
              className="hidden lg:flex items-center gap-1.5 text-xs tracking-widest uppercase px-3 py-1.5 border transition-all duration-300 whitespace-nowrap"
              style={{ color: navText, borderColor: scrolled > 0.4 ? "#e0e0e0" : "rgba(255,255,255,0.35)" }}
            >
              <Icon name="Calculator" size={13} />
              Калькулятор
            </button>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Instagram — только на десктопе */}
            <a
              href="https://www.instagram.com/kuhni_merta"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden xl:flex items-center gap-1.5 text-xs tracking-wide transition-colors duration-300 hover:opacity-70"
              style={{ color: navText }}
            >
              <Icon name="Instagram" size={15} />
              <span>kuhni_merta</span>
            </a>

            {/* Cart */}
            <div ref={cartRef} className="relative">
              <button
                onClick={() => setCartOpen(!cartOpen)}
                className="relative flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm tracking-wide transition-all duration-300 border"
                style={{
                  background: scrolled > 0.4 ? "#1a1a1a" : "rgba(255,255,255,0.15)",
                  color: "#ffffff",
                  borderColor: scrolled > 0.4 ? "#1a1a1a" : "rgba(255,255,255,0.4)",
                  backdropFilter: "blur(4px)",
                }}
              >
                <Icon name="ShoppingBag" size={14} />
                <span className="hidden sm:inline">Корзина</span>
                {cartCount > 0 && (
                  <span className="bg-white text-[#1a1a1a] text-[10px] w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center font-semibold">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Desktop cart dropdown */}
              {cartOpen && (
                <div className="hidden md:block absolute right-0 top-full mt-2 w-80 lg:w-96 bg-white border border-[#e8e8e8] shadow-2xl z-50 animate-fade-in">
                  <CartContent
                    cart={cart}
                    cartTotal={cartTotal}
                    onClose={() => setCartOpen(false)}
                    onRemove={removeFromCart}
                    onChangeQty={changeQty}
                    fmt={fmt}
                  />
                </div>
              )}
            </div>

            {/* Burger */}
            <button
              className="lg:hidden transition-colors duration-300 p-1"
              style={{ color: navText }}
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <Icon name={menuOpen ? "X" : "Menu"} size={22} />
            </button>
          </div>
        </div>

        {/* Mobile/Tablet menu */}
        {menuOpen && (
          <div className="lg:hidden bg-white border-t border-[#e8e8e8] shadow-lg">
            {navLinks.map(l => (
              <button
                key={l.id}
                onClick={() => scrollTo(l.id)}
                className="block w-full text-left px-5 py-3.5 text-sm text-[#555] hover:text-[#1a1a1a] hover:bg-[#f9f9f8] transition-colors border-b border-[#f0f0f0]"
              >
                {l.label}
              </button>
            ))}
            <button
              onClick={() => navigate("/calculator")}
              className="flex items-center gap-2 px-5 py-3.5 text-sm text-[#555] hover:text-[#1a1a1a] hover:bg-[#f9f9f8] transition-colors border-b border-[#f0f0f0] w-full text-left"
            >
              <Icon name="Calculator" size={15} />
              Калькулятор цены
            </button>
            <a
              href="https://www.instagram.com/kuhni_merta"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-3.5 text-sm text-[#555]"
            >
              <Icon name="Instagram" size={15} />
              kuhni_merta
            </a>
          </div>
        )}
      </header>

      {/* Mobile cart drawer */}
      {cartOpen && (
        <div className="md:hidden fixed inset-0 z-[60]">
          <div className="absolute inset-0 bg-black/40" onClick={() => setCartOpen(false)} />
          <div ref={cartDrawerRef} className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl max-h-[85vh] overflow-y-auto animate-slide-up">
            <div className="w-10 h-1 bg-[#e0e0e0] rounded-full mx-auto mt-3 mb-1" />
            <CartContent
              cart={cart}
              cartTotal={cartTotal}
              onClose={() => setCartOpen(false)}
              onRemove={removeFromCart}
              onChangeQty={changeQty}
              fmt={fmt}
            />
          </div>
        </div>
      )}

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section id="home" className="relative h-screen min-h-[520px] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={IMG_HERO} alt="MERTA" className="w-full h-full object-cover scale-105 animate-hero-zoom" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/35 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 w-full">
          <div className="max-w-lg sm:max-w-xl">
            <p className="text-white/60 text-[10px] sm:text-xs tracking-[0.3em] sm:tracking-[0.4em] uppercase mb-4 sm:mb-5 animate-fade-up" style={{ animationDelay: "0.2s" }}>
              Мебель ручной работы
            </p>
            <h1
              className="text-white font-light leading-none mb-4 sm:mb-6 animate-fade-up"
              style={{ fontSize: "clamp(2.8rem, 10vw, 7rem)", fontFamily: "'Cormorant', serif", animationDelay: "0.35s" }}
            >
              MERTA
            </h1>
            <p className="text-white/75 text-sm sm:text-base leading-relaxed mb-7 sm:mb-10 animate-fade-up" style={{ animationDelay: "0.5s" }}>
              Создаём интерьеры, в которых хочется жить.<br className="hidden sm:block" />
              Кухни, диваны, спальни, шкафы — всё на заказ.
            </p>
            <div className="flex flex-col xs:flex-row flex-wrap gap-3 animate-fade-up" style={{ animationDelay: "0.65s" }}>
              <button
                onClick={() => scrollTo("catalog")}
                className="bg-white text-[#1a1a1a] px-6 sm:px-8 py-3 sm:py-3.5 text-xs sm:text-sm tracking-widest uppercase hover:bg-[#f0f0f0] transition-colors w-full xs:w-auto"
              >
                Каталог
              </button>
              <button
                onClick={() => scrollTo("contacts")}
                className="border border-white text-white px-6 sm:px-8 py-3 sm:py-3.5 text-xs sm:text-sm tracking-widest uppercase hover:bg-white/10 transition-colors w-full xs:w-auto"
              >
                Связаться
              </button>
            </div>
          </div>
        </div>

        {/* Instagram badge */}
        <a
          href="https://www.instagram.com/kuhni_merta"
          target="_blank"
          rel="noopener noreferrer"
          className="absolute bottom-6 sm:bottom-8 right-4 sm:right-8 flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-white px-3 sm:px-4 py-2 sm:py-2.5 text-[10px] sm:text-xs tracking-wide hover:bg-white/20 transition-all z-10"
        >
          <Icon name="Instagram" size={13} />
          @kuhni_merta
        </a>

        {/* Scroll hint — скрываем на маленьких экранах */}
        <div className="hidden sm:flex absolute bottom-8 left-1/2 -translate-x-1/2 flex-col items-center gap-2 text-white/40 z-10">
          <span className="text-[10px] tracking-[0.3em] uppercase">Прокрутите</span>
          <div className="w-px h-10 bg-white/20 animate-scroll-line" />
        </div>
      </section>

      {/* ── CATALOG ──────────────────────────────────────────────── */}
      <section id="catalog" className="py-16 sm:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">

          {/* Header */}
          <div className="flex items-end justify-between mb-8 sm:mb-12 gap-4">
            <div>
              <p className="text-[10px] sm:text-xs tracking-[0.35em] uppercase text-[#aaa] mb-1 sm:mb-2">Ассортимент</p>
              <h2 style={{ fontFamily: "'Cormorant', serif" }} className="text-3xl sm:text-4xl lg:text-5xl font-light">Каталог</h2>
            </div>
            <button
              onClick={() => setFilterOpen(!filterOpen)}
              className="flex items-center gap-2 border border-[#e0e0e0] px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm text-[#555] hover:border-[#1a1a1a] hover:text-[#1a1a1a] transition-all shrink-0"
            >
              <Icon name="SlidersHorizontal" size={14} />
              <span className="hidden xs:inline">Фильтры</span>
              {(filterCat !== "Все" || filterMat !== "Все" || priceRange[0] > 0 || priceRange[1] < MAX_PRICE) && (
                <span className="w-2 h-2 bg-[#1a1a1a] rounded-full" />
              )}
            </button>
          </div>

          {/* FILTER PANEL */}
          {filterOpen && (
            <div className="mb-8 sm:mb-10 border border-[#e8e8e8] bg-white p-4 sm:p-6 animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">

                {/* Category */}
                <div>
                  <p className="text-[10px] sm:text-xs tracking-[0.25em] uppercase text-[#aaa] mb-3 sm:mb-4">Тип товара</p>
                  <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map(c => (
                      <button
                        key={c}
                        onClick={() => setFilterCat(c)}
                        className={`px-3 sm:px-4 py-1.5 text-xs sm:text-sm border transition-all ${filterCat === c ? "bg-[#1a1a1a] text-white border-[#1a1a1a]" : "border-[#e0e0e0] text-[#888] hover:border-[#1a1a1a] hover:text-[#1a1a1a]"}`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Material */}
                <div>
                  <p className="text-[10px] sm:text-xs tracking-[0.25em] uppercase text-[#aaa] mb-3 sm:mb-4">Материал</p>
                  <div className="flex flex-wrap gap-2">
                    {MATERIALS.map(m => (
                      <button
                        key={m}
                        onClick={() => setFilterMat(m)}
                        className={`px-3 sm:px-4 py-1.5 text-xs sm:text-sm border transition-all ${filterMat === m ? "bg-[#1a1a1a] text-white border-[#1a1a1a]" : "border-[#e0e0e0] text-[#888] hover:border-[#1a1a1a] hover:text-[#1a1a1a]"}`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price */}
                <div className="sm:col-span-2 lg:col-span-1">
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <p className="text-[10px] sm:text-xs tracking-[0.25em] uppercase text-[#aaa]">Цена</p>
                    <p className="text-xs sm:text-sm text-[#1a1a1a] font-medium">{fmt(priceRange[0])} — {fmt(priceRange[1])}</p>
                  </div>
                  <div className="relative h-1 bg-[#e8e8e8] rounded-full mt-5 sm:mt-6">
                    <div className="absolute h-1 bg-[#1a1a1a] rounded-full" style={{ left: `${(priceRange[0] / MAX_PRICE) * 100}%`, right: `${100 - (priceRange[1] / MAX_PRICE) * 100}%` }} />
                    <input type="range" min={0} max={MAX_PRICE} step={5000} value={priceRange[0]}
                      onChange={e => { const v = +e.target.value; if (v < priceRange[1]) setPriceRange([v, priceRange[1]]); }}
                      className="absolute w-full h-1 opacity-0 cursor-pointer" style={{ zIndex: priceRange[0] > MAX_PRICE * 0.9 ? 5 : 3 }}
                    />
                    <input type="range" min={0} max={MAX_PRICE} step={5000} value={priceRange[1]}
                      onChange={e => { const v = +e.target.value; if (v > priceRange[0]) setPriceRange([priceRange[0], v]); }}
                      className="absolute w-full h-1 opacity-0 cursor-pointer" style={{ zIndex: 4 }}
                    />
                    <div className="absolute w-4 h-4 bg-white border-2 border-[#1a1a1a] rounded-full -top-1.5 -translate-x-1/2 shadow pointer-events-none" style={{ left: `${(priceRange[0] / MAX_PRICE) * 100}%` }} />
                    <div className="absolute w-4 h-4 bg-white border-2 border-[#1a1a1a] rounded-full -top-1.5 -translate-x-1/2 shadow pointer-events-none" style={{ left: `${(priceRange[1] / MAX_PRICE) * 100}%` }} />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between mt-5 sm:mt-6 pt-4 sm:pt-5 border-t border-[#f0f0f0]">
                <p className="text-xs sm:text-sm text-[#aaa]">Найдено: <span className="text-[#1a1a1a] font-medium">{filtered.length}</span></p>
                <button
                  onClick={() => { setFilterCat("Все"); setFilterMat("Все"); setPriceRange([0, MAX_PRICE]); }}
                  className="text-xs sm:text-sm text-[#888] hover:text-[#1a1a1a] transition-colors underline underline-offset-2"
                >
                  Сбросить
                </button>
              </div>
            </div>
          )}

          {/* GRID */}
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-[#bbb]">
              <Icon name="PackageSearch" size={40} />
              <p className="mt-3 text-sm">Нет товаров по выбранным фильтрам</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4 lg:gap-6">
              {filtered.map((p, i) => (
                <div key={p.id} className="group" style={{ animation: `fadeUp 0.5s ease both`, animationDelay: `${i * 0.05}s` }}>
                  <div className="relative overflow-hidden bg-[#f5f5f4] aspect-[3/4]">
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    {p.tag && (
                      <span className="absolute top-2 left-2 bg-[#1a1a1a] text-white text-[8px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 tracking-widest uppercase">
                        {p.tag}
                      </span>
                    )}
                    <span className="absolute top-2 right-2 bg-white/90 text-[#555] text-[8px] sm:text-[10px] px-1.5 sm:px-2 py-0.5">
                      {p.material}
                    </span>
                    <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-4 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button onClick={() => addToCart(p)} className="w-full bg-white text-[#1a1a1a] py-1.5 sm:py-2.5 text-[10px] sm:text-sm tracking-wide hover:bg-[#f5f5f5] transition-colors">
                        В корзину
                      </button>
                    </div>
                  </div>
                  <div className="pt-2 sm:pt-3">
                    <p className="text-[8px] sm:text-[10px] text-[#aaa] tracking-[0.15em] uppercase mb-0.5">{p.category}</p>
                    <h3 style={{ fontFamily: "'Cormorant', serif" }} className="text-sm sm:text-lg font-medium mb-1 leading-tight line-clamp-2">{p.name}</h3>
                    <div className="flex items-center justify-between gap-1">
                      <p className="text-xs sm:text-base font-semibold">{fmt(p.price)}</p>
                      <button onClick={() => addToCart(p)} className="text-[#bbb] hover:text-[#1a1a1a] transition-colors p-0.5 shrink-0">
                        <Icon name="Plus" size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── RECOMMENDED ──────────────────────────────────────────── */}
      <section id="recommended" className="py-16 sm:py-20 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-14">
            <p className="text-[10px] sm:text-xs tracking-[0.35em] uppercase text-[#aaa] mb-2">Специально для вас</p>
            <h2 style={{ fontFamily: "'Cormorant', serif" }} className="text-3xl sm:text-4xl lg:text-5xl font-light">Рекомендации</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 lg:gap-6">
            {[products[1], products[2], products[5], products[6]].map((p, i) => (
              <div key={p.id} className="group" style={{ animation: `fadeUp 0.5s ease both`, animationDelay: `${i * 0.1}s` }}>
                <div className="relative overflow-hidden bg-[#f5f5f4] aspect-square mb-2 sm:mb-4">
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-2 left-2 bg-[#c8a97a] text-white text-[8px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 tracking-widest uppercase">
                    ★ Выбор
                  </div>
                </div>
                <p className="text-[8px] sm:text-[10px] text-[#aaa] tracking-[0.15em] uppercase mb-0.5">{p.category}</p>
                <h3 style={{ fontFamily: "'Cormorant', serif" }} className="text-sm sm:text-lg font-medium mb-1.5 leading-tight line-clamp-2">{p.name}</h3>
                <div className="flex items-center justify-between gap-1 flex-wrap">
                  <p className="text-xs sm:text-base font-semibold">{fmt(p.price)}</p>
                  <button onClick={() => addToCart(p)} className="bg-[#1a1a1a] text-white px-2 sm:px-3 py-1 sm:py-1.5 text-[9px] sm:text-xs tracking-wide hover:bg-[#333] transition-colors">
                    + Корзина
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ABOUT ────────────────────────────────────────────────── */}
      <section id="about" className="py-16 sm:py-20 lg:py-24 bg-[#f9f9f8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div>
              <p className="text-[10px] sm:text-xs tracking-[0.35em] uppercase text-[#aaa] mb-3 sm:mb-4">О компании</p>
              <h2 style={{ fontFamily: "'Cormorant', serif" }} className="text-3xl sm:text-4xl lg:text-5xl font-light mb-6 sm:mb-8 leading-tight">
                Мебель, которая<br />создаётся с душой
              </h2>
              <p className="text-[#555] leading-relaxed mb-4 sm:mb-5 text-sm">
                MERTA — мебельная компания, основанная с одной целью: создавать пространства, в которых хочется жить.
                Мы производим мебель на заказ — кухни, диваны, шкафы, спальни — с вниманием к каждой детали.
              </p>
              <p className="text-[#555] leading-relaxed mb-6 sm:mb-8 text-sm">
                Каждое изделие проходит многоэтапный контроль качества. Мы работаем только с проверенными материалами
                и партнёрами, чтобы результат радовал вас долгие годы.
              </p>

              <div className="grid grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-10">
                {[["7+", "лет на рынке"], ["1 200+", "проектов"], ["98%", "довольных"]].map(([n, l]) => (
                  <div key={l}>
                    <p style={{ fontFamily: "'Cormorant', serif" }} className="text-2xl sm:text-3xl font-light text-[#1a1a1a]">{n}</p>
                    <p className="text-[10px] sm:text-xs text-[#aaa] mt-1">{l}</p>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 border border-[#e8e8e8] bg-white">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#e8e8e8] rounded-full flex items-center justify-center shrink-0">
                  <Icon name="User" size={18} />
                </div>
                <div>
                  <p className="font-medium text-sm">Водинов Степан Николаевич</p>
                  <p className="text-xs text-[#aaa] mt-0.5">Основатель и руководитель MERTA</p>
                </div>
              </div>
            </div>

            <div className="relative mt-4 lg:mt-0">
              <img src={IMG_BEDROOM} alt="О нас" className="w-full aspect-[4/3] sm:aspect-[4/4] lg:aspect-[4/5] object-cover" />
              <div className="absolute -bottom-3 -left-3 sm:-bottom-4 sm:-left-4 w-24 sm:w-32 h-24 sm:h-32 bg-[#f0ebe3] -z-10" />
              <div className="absolute -top-3 -right-3 sm:-top-4 sm:-right-4 w-16 sm:w-20 h-16 sm:h-20 border border-[#e0d8cc] -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* ── CONTACTS ─────────────────────────────────────────────── */}
      <section id="contacts" className="py-16 sm:py-20 lg:py-24 bg-[#1a1a1a] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-14">
            <p className="text-[10px] sm:text-xs tracking-[0.35em] uppercase text-white/40 mb-2">Свяжитесь с нами</p>
            <h2 style={{ fontFamily: "'Cormorant', serif" }} className="text-3xl sm:text-4xl lg:text-5xl font-light">Контакты</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-10 sm:mb-14">
            {[
              { icon: "Phone",     label: "Телефон",   value: "+7 (918) 130-06-68",     href: "tel:+79181300668" },
              { icon: "Mail",      label: "Email",     value: "vadimvodinov28@gmail.com", href: "mailto:vadimvodinov28@gmail.com" },
              { icon: "Instagram", label: "Instagram", value: "@kuhni_merta",             href: "https://www.instagram.com/kuhni_merta" },
            ].map(c => (
              <a
                key={c.label}
                href={c.href}
                target={c.href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="group flex flex-col items-center text-center p-6 sm:p-8 border border-white/10 hover:border-white/30 transition-all"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 border border-white/20 flex items-center justify-center mb-3 sm:mb-4 group-hover:border-white/50 transition-colors">
                  <Icon name={c.icon} size={18} />
                </div>
                <p className="text-[10px] sm:text-xs tracking-[0.2em] uppercase text-white/40 mb-1 sm:mb-2">{c.label}</p>
                <p className="text-xs sm:text-sm text-white/80 group-hover:text-white transition-colors break-all">{c.value}</p>
              </a>
            ))}
          </div>

          <div className="text-center">
            <p className="text-white/30 text-xs mb-2">Основатель: Водинов Степан Николаевич</p>
            <p className="text-white/20 text-xs">© 2024 MERTA — мебельная компания</p>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes heroZoom {
          from { transform: scale(1.08); }
          to   { transform: scale(1.0); }
        }
        @keyframes scrollLine {
          0%   { transform: scaleY(0); transform-origin: top; }
          50%  { transform: scaleY(1); transform-origin: top; }
          51%  { transform: scaleY(1); transform-origin: bottom; }
          100% { transform: scaleY(0); transform-origin: bottom; }
        }
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to   { transform: translateY(0); }
        }
        .animate-hero-zoom  { animation: heroZoom 8s ease-out forwards; }
        .animate-scroll-line{ animation: scrollLine 2s ease-in-out infinite; }
        .animate-fade-up    { animation: fadeUp 0.7s ease both; opacity: 0; }
        .animate-fade-in    { animation: fadeUp 0.2s ease both; }
        .animate-slide-up   { animation: slideUp 0.35s ease; }
      `}</style>
    </div>
  );
}

/* ── Переиспользуемый контент корзины ────────────────────────── */
function CartContent({ cart, cartTotal, onClose, onRemove, onChangeQty, fmt }: {
  cart: CartItem[];
  cartTotal: number;
  onClose: () => void;
  onRemove: (id: number) => void;
  onChangeQty: (id: number, d: number) => void;
  fmt: (n: number) => string;
}) {
  return (
    <div className="p-5 sm:p-6">
      <div className="flex items-center justify-between mb-5">
        <h3 style={{ fontFamily: "'Cormorant', serif" }} className="text-2xl font-light">Корзина</h3>
        <button onClick={onClose} className="text-[#aaa] hover:text-[#1a1a1a] transition-colors">
          <Icon name="X" size={18} />
        </button>
      </div>
      {cart.length === 0 ? (
        <div className="text-center py-10 text-[#bbb] flex flex-col items-center gap-3">
          <Icon name="ShoppingBag" size={36} />
          <p className="text-sm">Корзина пуста</p>
        </div>
      ) : (
        <>
          <div className="space-y-4 max-h-64 sm:max-h-72 overflow-y-auto pr-1">
            {cart.map(item => (
              <div key={item.id} className="flex gap-3 items-center">
                <img src={item.image} alt={item.name} className="w-14 h-14 object-cover bg-[#f5f5f5] shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{item.name}</p>
                  <p className="text-[#888] text-xs mt-0.5">{fmt(item.price)}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <button onClick={() => onChangeQty(item.id, -1)} className="w-6 h-6 border border-[#e0e0e0] flex items-center justify-center text-sm hover:border-[#1a1a1a] transition-colors">−</button>
                    <span className="text-sm w-4 text-center">{item.qty}</span>
                    <button onClick={() => onChangeQty(item.id, 1)} className="w-6 h-6 border border-[#e0e0e0] flex items-center justify-center text-sm hover:border-[#1a1a1a] transition-colors">+</button>
                  </div>
                </div>
                <button onClick={() => onRemove(item.id)} className="text-[#ccc] hover:text-red-400 transition-colors shrink-0">
                  <Icon name="Trash2" size={14} />
                </button>
              </div>
            ))}
          </div>
          <div className="mt-5 pt-4 border-t border-[#e8e8e8]">
            <div className="flex justify-between text-sm mb-4">
              <span className="text-[#888]">Итого:</span>
              <span className="font-semibold text-base">{fmt(cartTotal)}</span>
            </div>
            <button className="w-full bg-[#1a1a1a] text-white py-3 text-sm tracking-wide hover:bg-[#333] transition-colors">
              Оформить заказ
            </button>
          </div>
        </>
      )}
    </div>
  );
}