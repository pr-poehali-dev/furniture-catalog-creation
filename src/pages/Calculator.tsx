import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "@/components/ui/icon";

const fmt = (n: number) => n.toLocaleString("ru-RU") + " ₽";

const CALC_TYPES = [
  { id: "sofa",     label: "Диван",   base: 35000, img: "🛋️" },
  { id: "kitchen",  label: "Кухня",   base: 55000, img: "🍳" },
  { id: "bedroom",  label: "Спальня", base: 40000, img: "🛏️" },
  { id: "wardrobe", label: "Шкаф",    base: 22000, img: "🚪" },
];

const CALC_MATS = [
  { id: "ldsp",    label: "ЛДСП",   coef: 1.0 },
  { id: "mdf",     label: "МДФ",    coef: 1.3 },
  { id: "wood",    label: "Дерево", coef: 1.8 },
  { id: "fabric",  label: "Ткань",  coef: 1.2 },
  { id: "leather", label: "Кожа",   coef: 1.9 },
  { id: "velvet",  label: "Велюр",  coef: 1.5 },
  { id: "enamel",  label: "Эмаль",  coef: 1.4 },
  { id: "glass",   label: "Стекло", coef: 1.6 },
];

export default function Calculator() {
  const navigate = useNavigate();
  const [type,   setType]   = useState(CALC_TYPES[0].id);
  const [mat,    setMat]    = useState(CALC_MATS[0].id);
  const [width,  setWidth]  = useState(200);
  const [height, setHeight] = useState(220);
  const [depth,  setDepth]  = useState(60);

  const selectedType = CALC_TYPES.find(t => t.id === type)!;
  const selectedMat  = CALC_MATS.find(m => m.id === mat)!;

  const stdVol = 200 * 220 * 60;
  const curVol = width * height * depth;
  const sizeK  = Math.max(0.5, Math.min(3.5, curVol / stdVol));
  const price  = Math.round(selectedType.base * selectedMat.coef * sizeK / 1000) * 1000;

  const dims = [
    { label: "Ширина",  icon: "MoveHorizontal" as const, value: width,  set: setWidth,  min: 40,  max: 500 },
    { label: "Высота",  icon: "MoveVertical"   as const, value: height, set: setHeight, min: 40,  max: 300 },
    { label: "Глубина", icon: "Box"            as const, value: depth,  set: setDepth,  min: 20,  max: 120 },
  ];

  return (
    <div className="min-h-screen bg-[#f9f9f8] text-[#1a1a1a]" style={{ fontFamily: "'Golos Text', sans-serif" }}>

      {/* Header */}
      <header className="bg-white border-b border-[#e8e8e8] sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-[#888] hover:text-[#1a1a1a] transition-colors text-sm"
          >
            <Icon name="ArrowLeft" size={16} />
            <span className="hidden sm:inline">Вернуться на сайт</span>
            <span className="sm:hidden">Назад</span>
          </button>

          <span style={{ fontFamily: "'Cormorant', serif" }} className="text-xl sm:text-2xl font-light tracking-[0.2em]">
            MERTA
          </span>

          <a
            href="tel:+79181300668"
            className="flex items-center gap-1.5 text-xs sm:text-sm text-[#1a1a1a] hover:text-[#555] transition-colors"
          >
            <Icon name="Phone" size={14} />
            <span className="hidden sm:inline">+7 (918) 130-06-68</span>
          </a>
        </div>
      </header>

      {/* Page title */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-10 sm:pt-14 pb-6 sm:pb-8 text-center">
        <p className="text-[10px] sm:text-xs tracking-[0.35em] uppercase text-[#aaa] mb-2">Подберите стоимость</p>
        <h1 style={{ fontFamily: "'Cormorant', serif" }} className="text-3xl sm:text-4xl lg:text-5xl font-light mb-3">
          Калькулятор цены
        </h1>
        <p className="text-[#888] text-sm max-w-md mx-auto">
          Укажите тип изделия, материал и размеры — получите ориентировочную стоимость
        </p>
      </div>

      {/* Calculator card */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-16 sm:pb-20">
        <div className="bg-white border border-[#e8e8e8] shadow-sm">

          {/* Тип изделия */}
          <div className="p-5 sm:p-8 border-b border-[#f0f0f0]">
            <p className="text-xs tracking-[0.25em] uppercase text-[#aaa] mb-4">Шаг 1 — Тип изделия</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
              {CALC_TYPES.map(t => (
                <button
                  key={t.id}
                  onClick={() => setType(t.id)}
                  className={`flex flex-col items-center gap-2 py-5 sm:py-6 px-3 border transition-all ${
                    type === t.id
                      ? "bg-[#1a1a1a] text-white border-[#1a1a1a]"
                      : "border-[#e8e8e8] text-[#555] hover:border-[#1a1a1a]"
                  }`}
                >
                  <span className="text-2xl sm:text-3xl">{t.img}</span>
                  <span className="text-xs sm:text-sm tracking-wide">{t.label}</span>
                  <span className={`text-[10px] ${type === t.id ? "text-white/60" : "text-[#bbb]"}`}>
                    от {fmt(t.base)}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Материал */}
          <div className="p-5 sm:p-8 border-b border-[#f0f0f0]">
            <p className="text-xs tracking-[0.25em] uppercase text-[#aaa] mb-4">Шаг 2 — Материал</p>
            <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 lg:grid-cols-8 gap-2">
              {CALC_MATS.map(m => (
                <button
                  key={m.id}
                  onClick={() => setMat(m.id)}
                  className={`py-2.5 sm:py-3 px-2 text-xs sm:text-sm border transition-all flex flex-col items-center gap-1 ${
                    mat === m.id
                      ? "bg-[#1a1a1a] text-white border-[#1a1a1a]"
                      : "border-[#e0e0e0] text-[#888] hover:border-[#1a1a1a] hover:text-[#1a1a1a]"
                  }`}
                >
                  <span>{m.label}</span>
                  <span className={`text-[9px] ${mat === m.id ? "text-white/50" : "text-[#ccc]"}`}>
                    ×{m.coef.toFixed(1)}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Размеры */}
          <div className="p-5 sm:p-8 border-b border-[#f0f0f0]">
            <p className="text-xs tracking-[0.25em] uppercase text-[#aaa] mb-6">Шаг 3 — Размеры (см)</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
              {dims.map(dim => (
                <div key={dim.label}>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-[#555] flex items-center gap-1.5 font-medium">
                      <Icon name={dim.icon} size={15} />
                      {dim.label}
                    </span>
                    <span className="text-lg font-semibold text-[#1a1a1a]">{dim.value} <span className="text-sm font-normal text-[#aaa]">см</span></span>
                  </div>
                  <div className="relative">
                    <input
                      type="range"
                      min={dim.min} max={dim.max} step={5}
                      value={dim.value}
                      onChange={e => dim.set(+e.target.value)}
                      className="w-full h-1.5 appearance-none bg-[#e8e8e8] rounded-full cursor-pointer accent-[#1a1a1a]"
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-[#ccc] mt-1.5">
                    <span>{dim.min} см</span>
                    <span>{dim.max} см</span>
                  </div>

                  {/* Number input */}
                  <div className="flex items-center gap-2 mt-3">
                    <button
                      onClick={() => dim.set(Math.max(dim.min, dim.value - 5))}
                      className="w-8 h-8 border border-[#e0e0e0] flex items-center justify-center text-[#888] hover:border-[#1a1a1a] hover:text-[#1a1a1a] transition-colors"
                    >−</button>
                    <input
                      type="number"
                      min={dim.min} max={dim.max}
                      value={dim.value}
                      onChange={e => {
                        const v = Math.max(dim.min, Math.min(dim.max, +e.target.value));
                        if (!isNaN(v)) dim.set(v);
                      }}
                      className="flex-1 text-center border border-[#e0e0e0] py-1.5 text-sm focus:outline-none focus:border-[#1a1a1a]"
                    />
                    <button
                      onClick={() => dim.set(Math.min(dim.max, dim.value + 5))}
                      className="w-8 h-8 border border-[#e0e0e0] flex items-center justify-center text-[#888] hover:border-[#1a1a1a] hover:text-[#1a1a1a] transition-colors"
                    >+</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Итог */}
          <div className="p-5 sm:p-8 bg-[#f9f9f8]">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div>
                <p className="text-xs text-[#aaa] mb-2 flex flex-wrap gap-2">
                  <span className="bg-white border border-[#e8e8e8] px-2 py-0.5">{selectedType.label}</span>
                  <span className="bg-white border border-[#e8e8e8] px-2 py-0.5">{selectedMat.label}</span>
                  <span className="bg-white border border-[#e8e8e8] px-2 py-0.5">{width}×{height}×{depth} см</span>
                </p>
                <p className="text-[10px] text-[#aaa] mb-1">Ориентировочная стоимость</p>
                <p style={{ fontFamily: "'Cormorant', serif" }} className="text-4xl sm:text-5xl lg:text-6xl font-light text-[#1a1a1a] leading-none">
                  {fmt(price)}
                </p>
                <p className="text-[10px] text-[#bbb] mt-2">Точная цена рассчитывается после замера и согласования</p>
              </div>

              <div className="flex flex-col gap-3 w-full sm:w-auto">
                <a
                  href="tel:+79181300668"
                  className="flex items-center justify-center gap-2 bg-[#1a1a1a] text-white px-7 py-3.5 text-xs sm:text-sm tracking-widest uppercase hover:bg-[#333] transition-colors w-full sm:w-auto"
                >
                  <Icon name="Phone" size={14} />
                  Заказать замер
                </a>
                <a
                  href="mailto:vadimvodinov28@gmail.com"
                  className="flex items-center justify-center gap-2 border border-[#1a1a1a] text-[#1a1a1a] px-7 py-3.5 text-xs sm:text-sm tracking-widest uppercase hover:bg-[#1a1a1a] hover:text-white transition-colors w-full sm:w-auto"
                >
                  <Icon name="Mail" size={14} />
                  Написать на почту
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-[#bbb] mt-6">
          © 2024 MERTA — мебельная компания · Водинов Степан Николаевич
        </p>
      </div>

      <style>{`
        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 18px; height: 18px;
          border-radius: 50%;
          background: #1a1a1a;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 1px 4px rgba(0,0,0,0.2);
        }
        input[type=range]::-moz-range-thumb {
          width: 18px; height: 18px;
          border-radius: 50%;
          background: #1a1a1a;
          cursor: pointer;
          border: 2px solid white;
        }
      `}</style>
    </div>
  );
}
