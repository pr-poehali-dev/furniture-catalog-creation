import { useState, useEffect, useRef } from "react";
import Icon from "@/components/ui/icon";

const HERO_IMG = "https://cdn.poehali.dev/projects/2f8a7944-da00-40da-8e28-49f3040aec02/files/38fb438f-c06c-4457-b9ab-97d1c07bfd0e.jpg";
const CHAIR_IMG = "https://cdn.poehali.dev/projects/2f8a7944-da00-40da-8e28-49f3040aec02/files/66833064-0910-4abf-b1ab-99afede4d5e7.jpg";
const SHELF_IMG = "https://cdn.poehali.dev/projects/2f8a7944-da00-40da-8e28-49f3040aec02/files/1de21423-591a-498b-a007-d3b52cb0701a.jpg";

const products = [
  { id: 1, name: "Диван «Норд»", category: "Диваны", price: 89900, image: HERO_IMG, tag: "Хит" },
  { id: 2, name: "Стул «Арко»", category: "Стулья", price: 14500, image: CHAIR_IMG, tag: "" },
  { id: 3, name: "Стеллаж «Линия»", category: "Хранение", price: 32000, image: SHELF_IMG, tag: "Новинка" },
  { id: 4, name: "Кресло «Тихо»", category: "Кресла", price: 54000, image: CHAIR_IMG, tag: "" },
  { id: 5, name: "Комод «Простор»", category: "Хранение", price: 28500, image: SHELF_IMG, tag: "Хит" },
  { id: 6, name: "Диван «Фьорд»", category: "Диваны", price: 112000, image: HERO_IMG, tag: "" },
  { id: 7, name: "Стол «Берег»", category: "Столы", price: 42000, image: SHELF_IMG, tag: "Новинка" },
  { id: 8, name: "Стул «Дуга»", category: "Стулья", price: 11900, image: CHAIR_IMG, tag: "" },
];

const recommended = [products[0], products[2], products[3], products[6]];
const categories = ["Все", "Диваны", "Стулья", "Кресла", "Столы", "Хранение"];

const fmt = (n: number) => n.toLocaleString("ru-RU") + " ₽";

type CartItem = { id: number; name: string; price: number; image: string; qty: number };

export default function Index() {
  const [activeSection, setActiveSection] = useState("home");
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeCategory, setActiveCategory] = useState("Все");
  const [menuOpen, setMenuOpen] = useState(false);
  const cartRef = useRef<HTMLDivElement>(null);

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const cartTotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const filtered = activeCategory === "Все" ? products : products.filter(p => p.category === activeCategory);

  const addToCart = (product: typeof products[0]) => {
    setCart(prev => {
      const ex = prev.find(i => i.id === product.id);
      if (ex) return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const removeFromCart = (id: number) => setCart(prev => prev.filter(i => i.id !== id));
  const changeQty = (id: number, delta: number) =>
    setCart(prev => prev.map(i => i.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i));

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (cartRef.current && !cartRef.current.contains(e.target as Node)) setCartOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const scrollTo = (id: string) => {
    setActiveSection(id);
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const navLinks = [
    { id: "home", label: "Главная" },
    { id: "catalog", label: "Каталог" },
    { id: "recommended", label: "Рекомендации" },
    { id: "about", label: "О нас" },
    { id: "contacts", label: "Контакты" },
  ];

  return (
    <div className="min-h-screen bg-[#f9f9f8] text-[#1a1a1a]">

      {/* NAV */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-[#e8e8e8]">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <button onClick={() => scrollTo("home")} className="font-display text-2xl font-light tracking-[0.15em] text-[#1a1a1a]">
            MERTA
          </button>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map(l => (
              <button
                key={l.id}
                onClick={() => scrollTo(l.id)}
                className={`font-body text-sm tracking-wide transition-colors duration-200 ${activeSection === l.id ? "text-[#1a1a1a] border-b border-[#1a1a1a]" : "text-[#888] hover:text-[#1a1a1a]"}`}
              >
                {l.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <div ref={cartRef} className="relative">
              <button
                onClick={() => setCartOpen(!cartOpen)}
                className="relative flex items-center gap-2 bg-[#1a1a1a] text-white px-4 py-2 text-sm font-body tracking-wide hover:bg-[#333] transition-colors"
              >
                <Icon name="ShoppingBag" size={16} />
                <span>Корзина</span>
                {cartCount > 0 && (
                  <span className="ml-1 bg-white text-[#1a1a1a] text-xs w-5 h-5 rounded-full flex items-center justify-center font-semibold">
                    {cartCount}
                  </span>
                )}
              </button>

              {cartOpen && (
                <div className="absolute right-0 top-full mt-2 w-96 bg-white border border-[#e8e8e8] shadow-xl animate-fade-in z-50">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-display text-xl font-light">Корзина</h3>
                      <button onClick={() => setCartOpen(false)} className="text-[#888] hover:text-[#1a1a1a]">
                        <Icon name="X" size={18} />
                      </button>
                    </div>
                    {cart.length === 0 ? (
                      <div className="text-center py-8 text-[#aaa] font-body text-sm flex flex-col items-center gap-2">
                        <Icon name="ShoppingBag" size={32} />
                        <p>Корзина пуста</p>
                      </div>
                    ) : (
                      <>
                        <div className="space-y-4 max-h-64 overflow-y-auto">
                          {cart.map(item => (
                            <div key={item.id} className="flex gap-3 items-center">
                              <img src={item.image} alt={item.name} className="w-14 h-14 object-cover bg-[#f5f5f5]" />
                              <div className="flex-1 min-w-0">
                                <p className="font-body text-sm font-medium truncate">{item.name}</p>
                                <p className="text-[#888] text-xs">{fmt(item.price)}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <button onClick={() => changeQty(item.id, -1)} className="w-5 h-5 border border-[#e0e0e0] flex items-center justify-center text-xs hover:border-[#1a1a1a]">−</button>
                                  <span className="text-sm">{item.qty}</span>
                                  <button onClick={() => changeQty(item.id, 1)} className="w-5 h-5 border border-[#e0e0e0] flex items-center justify-center text-xs hover:border-[#1a1a1a]">+</button>
                                </div>
                              </div>
                              <button onClick={() => removeFromCart(item.id)} className="text-[#ccc] hover:text-red-400 transition-colors">
                                <Icon name="Trash2" size={14} />
                              </button>
                            </div>
                          ))}
                        </div>
                        <div className="mt-4 pt-4 border-t border-[#e8e8e8]">
                          <div className="flex justify-between font-body text-sm mb-4">
                            <span className="text-[#888]">Итого:</span>
                            <span className="font-semibold text-base">{fmt(cartTotal)}</span>
                          </div>
                          <button className="w-full bg-[#1a1a1a] text-white py-3 font-body text-sm tracking-wide hover:bg-[#333] transition-colors">
                            Оформить заказ
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>

            <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
              <Icon name={menuOpen ? "X" : "Menu"} size={22} />
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden bg-white border-t border-[#e8e8e8]">
            {navLinks.map(l => (
              <button key={l.id} onClick={() => scrollTo(l.id)} className="block w-full text-left px-6 py-3 font-body text-sm text-[#555] hover:text-[#1a1a1a] hover:bg-[#f9f9f8] border-b border-[#f0f0f0]">
                {l.label}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* HERO */}
      <section id="home" className="pt-16">
        <div className="relative h-[90vh] overflow-hidden">
          <img src={HERO_IMG} alt="Merta" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/25 to-transparent" />
          <div className="absolute inset-0 flex items-center">
            <div className="max-w-7xl mx-auto px-6 w-full">
              <div className="max-w-lg">
                <p className="font-body text-white/70 text-sm tracking-[0.3em] uppercase mb-4 animate-fade-in-up">Коллекция 2024</p>
                <h1 className="font-display text-6xl md:text-7xl font-light text-white leading-none mb-6 animate-fade-in-up delay-100">
                  Мебель,<br />
                  <em className="italic">которую<br />хочется</em>
                </h1>
                <p className="font-body text-white/80 text-base mb-8 leading-relaxed animate-fade-in-up delay-200">
                  Качественная мебель для вашего дома. Продуманный дизайн и долговечные материалы.
                </p>
                <button
                  onClick={() => scrollTo("catalog")}
                  className="inline-flex items-center gap-2 bg-white text-[#1a1a1a] px-8 py-3 font-body text-sm tracking-wide hover:bg-[#f0f0f0] transition-all animate-fade-in-up delay-300"
                >
                  Смотреть каталог
                  <Icon name="ArrowRight" size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CATALOG */}
      <section id="catalog" className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="font-body text-xs tracking-[0.3em] uppercase text-[#aaa] mb-2">Ассортимент</p>
              <h2 className="font-display text-4xl md:text-5xl font-light">Каталог товаров</h2>
            </div>
            <p className="font-body text-sm text-[#aaa] hidden md:block">{filtered.length} позиций</p>
          </div>

          <div className="flex flex-wrap gap-2 mb-10">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 font-body text-sm tracking-wide border transition-all ${activeCategory === cat ? "bg-[#1a1a1a] text-white border-[#1a1a1a]" : "bg-transparent text-[#888] border-[#e0e0e0] hover:border-[#1a1a1a] hover:text-[#1a1a1a]"}`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filtered.map((p, i) => (
              <div key={p.id} className="group animate-fade-in-up" style={{ animationDelay: `${i * 0.07}s`, opacity: 0, animationFillMode: "forwards" }}>
                <div className="relative overflow-hidden bg-[#f5f5f4] aspect-[4/5]">
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  {p.tag && (
                    <span className="absolute top-3 left-3 bg-[#1a1a1a] text-white text-xs px-2 py-1 font-body tracking-wide">
                      {p.tag}
                    </span>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button onClick={() => addToCart(p)} className="w-full bg-white text-[#1a1a1a] py-2.5 font-body text-sm tracking-wide hover:bg-[#f0f0f0] transition-colors">
                      В корзину
                    </button>
                  </div>
                </div>
                <div className="pt-4">
                  <p className="font-body text-xs text-[#aaa] tracking-wide mb-1">{p.category}</p>
                  <h3 className="font-display text-lg font-medium mb-1">{p.name}</h3>
                  <div className="flex items-center justify-between">
                    <p className="font-body text-base font-semibold">{fmt(p.price)}</p>
                    <button onClick={() => addToCart(p)} className="text-[#aaa] hover:text-[#1a1a1a] transition-colors">
                      <Icon name="Plus" size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RECOMMENDED */}
      <section id="recommended" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="font-body text-xs tracking-[0.3em] uppercase text-[#aaa] mb-2">Специально для вас</p>
            <h2 className="font-display text-4xl md:text-5xl font-light">Рекомендуемая подборка</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {recommended.map((p, i) => (
              <div key={p.id} className="group animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s`, opacity: 0, animationFillMode: "forwards" }}>
                <div className="relative overflow-hidden bg-[#f5f5f4] aspect-square mb-4">
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-3 left-3 bg-[#c8a97a] text-white text-xs px-2 py-1 font-body tracking-wide">
                    ★ Выбор редакции
                  </div>
                </div>
                <p className="font-body text-xs text-[#aaa] tracking-wide mb-1">{p.category}</p>
                <h3 className="font-display text-lg font-medium mb-2">{p.name}</h3>
                <div className="flex items-center justify-between">
                  <p className="font-body text-base font-semibold">{fmt(p.price)}</p>
                  <button onClick={() => addToCart(p)} className="flex items-center gap-1 text-sm font-body text-[#888] hover:text-[#1a1a1a] transition-colors">
                    <Icon name="ShoppingBag" size={15} />
                    В корзину
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="font-body text-xs tracking-[0.3em] uppercase text-[#aaa] mb-4">История бренда</p>
              <h2 className="font-display text-4xl md:text-5xl font-light leading-tight mb-6">О нас</h2>
              <p className="font-body text-[#555] leading-relaxed mb-4">
                Merta — это магазин мебели, основанный с любовью к качеству и продуманному дизайну. Мы верим, что дом — это отражение вашей личности, и помогаем создать пространство, в котором хочется жить.
              </p>
              <p className="font-body text-[#555] leading-relaxed mb-8">
                Каждый предмет в нашем каталоге прошёл строгий отбор по качеству материалов, удобству и эстетике. Мы работаем напрямую с проверенными производителями, чтобы предлагать честные цены.
              </p>
              <div className="border-l-2 border-[#1a1a1a] pl-6 mb-8">
                <p className="font-display text-2xl font-light italic text-[#1a1a1a]">«Мебель — это не просто вещи. Это среда, в которой живёт ваша жизнь.»</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#1a1a1a] rounded-full flex items-center justify-center text-white font-display text-lg">С</div>
                <div>
                  <p className="font-body font-semibold text-sm">Водинов Степан Николаевич</p>
                  <p className="font-body text-xs text-[#aaa]">Основатель Merta</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#f5f5f4] aspect-[4/5] overflow-hidden">
                <img src={CHAIR_IMG} alt="О нас" className="w-full h-full object-cover" />
              </div>
              <div className="mt-8">
                <div className="bg-[#f5f5f4] aspect-[4/5] overflow-hidden">
                  <img src={SHELF_IMG} alt="О нас" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 pt-16 border-t border-[#e8e8e8]">
            {[
              { num: "8+", label: "лет на рынке" },
              { num: "500+", label: "позиций в каталоге" },
              { num: "12 000+", label: "довольных клиентов" },
              { num: "100%", label: "гарантия качества" },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <p className="font-display text-4xl md:text-5xl font-light mb-2">{s.num}</p>
                <p className="font-body text-sm text-[#aaa]">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACTS */}
      <section id="contacts" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <p className="font-body text-xs tracking-[0.3em] uppercase text-[#aaa] mb-4">Свяжитесь с нами</p>
              <h2 className="font-display text-4xl md:text-5xl font-light mb-8">Контакты</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 border border-[#e0e0e0] flex items-center justify-center mt-0.5">
                    <Icon name="Phone" size={16} />
                  </div>
                  <div>
                    <p className="font-body text-xs text-[#aaa] tracking-wide mb-1">Телефон</p>
                    <a href="tel:+78918300668" className="font-display text-2xl font-light hover:text-[#555] transition-colors">
                      +7 918 130-06-68
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 border border-[#e0e0e0] flex items-center justify-center mt-0.5">
                    <Icon name="User" size={16} />
                  </div>
                  <div>
                    <p className="font-body text-xs text-[#aaa] tracking-wide mb-1">Основатель</p>
                    <p className="font-display text-xl font-light">Водинов Степан Николаевич</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 border border-[#e0e0e0] flex items-center justify-center mt-0.5">
                    <Icon name="Clock" size={16} />
                  </div>
                  <div>
                    <p className="font-body text-xs text-[#aaa] tracking-wide mb-1">Часы работы</p>
                    <p className="font-body text-sm text-[#555]">Пн–Пт: 9:00 – 19:00</p>
                    <p className="font-body text-sm text-[#555]">Сб: 10:00 – 17:00</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#f9f9f8] p-8">
              <h3 className="font-display text-2xl font-light mb-6">Оставить заявку</h3>
              <div className="space-y-4">
                <div>
                  <label className="font-body text-xs text-[#aaa] tracking-wide uppercase block mb-2">Ваше имя</label>
                  <input type="text" placeholder="Степан" className="w-full border border-[#e0e0e0] bg-white px-4 py-3 font-body text-sm focus:outline-none focus:border-[#1a1a1a] transition-colors" />
                </div>
                <div>
                  <label className="font-body text-xs text-[#aaa] tracking-wide uppercase block mb-2">Телефон</label>
                  <input type="tel" placeholder="+7 (000) 000-00-00" className="w-full border border-[#e0e0e0] bg-white px-4 py-3 font-body text-sm focus:outline-none focus:border-[#1a1a1a] transition-colors" />
                </div>
                <div>
                  <label className="font-body text-xs text-[#aaa] tracking-wide uppercase block mb-2">Сообщение</label>
                  <textarea placeholder="Интересует диван в гостиную..." rows={4} className="w-full border border-[#e0e0e0] bg-white px-4 py-3 font-body text-sm focus:outline-none focus:border-[#1a1a1a] transition-colors resize-none" />
                </div>
                <button className="w-full bg-[#1a1a1a] text-white py-3.5 font-body text-sm tracking-wide hover:bg-[#333] transition-colors">
                  Отправить заявку
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#1a1a1a] text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <p className="font-display text-2xl font-light tracking-[0.15em] mb-1">MERTA</p>
              <p className="font-body text-xs text-white/40">Мебель для вашего дома</p>
            </div>
            <nav className="flex flex-wrap gap-6 justify-center">
              {navLinks.map(l => (
                <button key={l.id} onClick={() => scrollTo(l.id)} className="font-body text-xs text-white/50 hover:text-white/90 tracking-wide transition-colors">
                  {l.label}
                </button>
              ))}
            </nav>
            <a href="tel:+78918300668" className="font-display text-lg font-light text-white/80 hover:text-white transition-colors">
              +7 918 130-06-68
            </a>
          </div>
          <div className="mt-8 pt-8 border-t border-white/10 text-center">
            <p className="font-body text-xs text-white/30">© 2024 Merta. Все права защищены.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
