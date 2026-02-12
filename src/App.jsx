import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, ArrowLeft, Check, X, Heart, ShoppingBag, Coins, Calendar, MapPin, Ticket, Gift, AlertCircle, Plane, Map, Navigation, ArrowDown, Clock, Train, Bus, Coffee, Info, ChevronUp, ChevronDown, Sparkles } from 'lucide-react';

// --- UI Components (Simplified shadcn/ui style) ---

// --- Button Component ---
const Button = ({ children, variant = "primary", size = "default", className = "", ...props }) => {
  const variants = {
    primary: "bg-gradient-to-r from-pink-500 to-orange-400 text-white shadow-md hover:shadow-lg transition-all duration-300",
    secondary: "bg-white border-2 border-pink-300 text-pink-600 hover:bg-pink-50 font-semibold",
    outline: "bg-white/90 border border-pink-200 text-gray-700 hover:bg-pink-50 hover:border-pink-300",
    ghost: "hover:bg-pink-50 text-pink-600 transition-colors",
    destructive: "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-md hover:shadow-lg",
    plain: "bg-white border-2 shadow-md hover:shadow-lg",
    normal: "",

    // --- 新規追加: ホーム画面用ボタン ---
    orange: "bg-orange-100 text-orange-600 hover:bg-orange-200 border-orange-200",
    pink: "bg-pink-100 text-pink-600 hover:bg-pink-200 border-pink-200",
    aqua: "bg-aqua-100 text-aqua-600 hover:bg-aqua-200 border-aqua-200",
  };

  const sizes = {
    default: "h-10 px-4 py-2",
    sm: "h-10 px-5 text-sm md:text-base", // 少し大きめでアイコン+文字が改行されない
    lg: "h-12 px-8 text-lg",
    icon: "h-10 w-10",
  };

  return (
    <button
      className={`inline-flex items-center justify-center rounded-xl font-bold transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

const Input = ({ className = "", ...props }) => (
  <input className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${className}`} {...props} />
);

const Label = ({ children, className = "", ...props }) => (
  <label className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`} {...props}>
    {children}
  </label>
);

const Card = ({ children, className = "", ...props }) => (
  <div className={`bg-white/90 backdrop-blur-sm rounded-2xl border transition-all duration-300 hover:shadow-xl ${className}`} {...props}>
    {children}
  </div>
);

const Progress = ({ value, className = "", indicatorColor = "bg-primary" }) => (
  <div className={`relative h-4 w-full overflow-hidden rounded-full bg-secondary bg-white ${className}`}>
    <div className={`h-full w-full flex-1 transition-all ${indicatorColor}`} style={{ transform: `translateX(-${100 - (value || 0)}%)` }} />
  </div>
);

const Select = ({ options, value, onChange, className = "" }) => (
  <select
    value={value}
    onChange={onChange}
    className={`flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
  >
    {options.map((opt) => (
      <option key={opt.value} value={opt.value}>{opt.label}</option>
    ))}
  </select>
);

const Textarea = ({ className = "", ...props }) => (
  <textarea className={`flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${className}`} {...props} />
);

const Tabs = ({ children, className = "" }) => (
  <div className={`w-full ${className}`}>{children}</div>
);

const TabsList = ({ children, className = "" }) => (
  <div className={`inline-flex h-10 items-center justify-center rounded-md bg-gray-100 p-1 text-muted-foreground ${className}`}>
    {children}
  </div>
);

const TabsTrigger = ({ value, activeValue, onClick, children, className = "", activeClassName = "", inactiveClassName = "" }) => (
  <button
    onClick={() => onClick(value)}
    className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${activeValue === value ? "bg-white shadow-sm ${activeClassName}" : "${inactiveClassName}"} ${className}"}
      } ${className}`}
  >
    {children}
  </button>
);

// --- AI Utility Functions ---

/**
 * Parse JSON from AI response with multiple fallback patterns
 */
const parseAiJsonResponse = (text) => {
  if (!text) throw new Error('AI応答が空です');

  // Try multiple patterns
  const patterns = [
    /```json\s*([\s\S]*?)\s*```/,  // ```json ... ```
    /```\s*([\s\S]*?)\s*```/,       // ``` ... ```
    /(\{[\s\S]*\})/,                // { ... }
    /(\[[\s\S]*\])/                 // [ ... ]
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      try {
        const jsonStr = match[1] || match[0];
        return JSON.parse(jsonStr);
      } catch (e) {
        continue;
      }
    }
  }

  throw new Error('AIの応答からJSONを抽出できませんでした。もう一度お試しください。');
};

/**
 * Handle API errors with user-friendly messages
 */
const handleApiError = (error, response) => {
  console.error('API Error:', error, response);

  if (!response) {
    return {
      title: 'ネットワークエラー',
      message: 'インターネット接続を確認してください。',
      canRetry: true
    };
  }

  switch (response.status) {
    case 401:
      return {
        title: 'APIキーエラー',
        message: 'APIキーが無効です。ブラウザのコンソールで以下を実行してください:\nlocalStorage.setItem("anthropic_api_key", "あなたのAPIキー")',
        canRetry: false
      };

    case 429:
      return {
        title: 'レート制限',
        message: 'APIの使用制限に達しました。しばらく待ってから再試行してください。',
        canRetry: true
      };

    case 500:
    case 502:
    case 503:
      return {
        title: 'サーバーエラー',
        message: 'Anthropicのサーバーで一時的な問題が発生しています。しばらく待ってから再試行してください。',
        canRetry: true
      };

    default:
      return {
        title: 'エラー',
        message: error.message || '予期しないエラーが発生しました。',
        canRetry: true
      };
  }
};

/**
 * Validate data availability for AI analysis
 */
const validateDataForAnalysis = (oshi, actions, basicInfo) => {
  const warnings = [];

  if (!actions || actions.length === 0) {
    warnings.push('⚠️ 感情記録がありません。まず推しの行動を記録してください。');
  } else if (actions.length < 3) {
    warnings.push('ℹ️ 記録が少なめです。3件以上あると、より正確な分析が可能です。');
  }

  if (!basicInfo || Object.keys(basicInfo.answers || {}).length < 5) {
    warnings.push('ℹ️ 基本情報が不足しています。一問一答を完了させると精度が向上します。');
  }

  return warnings;
};

// --- Application Component ---

function App() {

  const [loading, setLoading] = useState(false);
  const [nextPage, setNextPage] = useState(null);

  const handleNavigate = (page) => {
    setNextPage(page);
    setLoading(true);

    // アニメーション時間と同じ delay
    setTimeout(() => {
      // ページ遷移
      page(); // 例: goManagementDashboard()
      setLoading(false);
      setNextPage(null);
    }, 1500); // 1.5秒アニメ
  };


  // State
  // State Loader
  const loadData = (key, defaultValue) => {
    const saved = localStorage.getItem(`oshikatsu_${key}`);
    if (!saved) return defaultValue;

    let parsed = JSON.parse(saved);

    // Migration for feeling values
    if (key === 'actions' && Array.isArray(parsed)) {
      parsed = parsed.map(action => ({
        ...action,
        feeling: action.feeling === 'agree' ? 'positive' : (action.feeling === 'disagree' ? 'negative' : action.feeling)
      }));
    }

    return parsed;
  };

  // State
  const [oshis, setOshis] = useState(() => loadData('oshis', [
    {
      id: "oshi_1",
      name: "サンプル推し",
      genre: "アイドル",
      monthlyBudget: 30000,
      spent: 12000,
      createdAt: new Date().toISOString()
    }
  ]));
  const [goods, setGoods] = useState(() => loadData('goods', [
    {
      id: "goods_1",
      oshiId: "oshi_1",
      name: "限定Tシャツ",
      price: 3000,
      releaseDate: "2026-03-10",
      priority: "high",
      memo: "ライブ用",
      purchased: true,
      createdAt: new Date().toISOString()
    },
    {
      id: "goods_2",
      oshiId: "oshi_1",
      name: "アクリルスタンド",
      price: 1500,
      releaseDate: "2026-02-20",
      priority: "medium",
      memo: "",
      purchased: false,
      createdAt: new Date().toISOString()
    }
  ]));
  const [events, setEvents] = useState(() => loadData('events', [
    {
      id: "event_1",
      oshiId: "oshi_1",
      name: "バースデーライブ",
      date: "2026-04-15",
      location: "東京ドーム",
      budget: 12000,
      category: "ライブ",
      memo: "チケット当選祈願",
      attended: false,
      actualCost: 0,
      createdAt: new Date().toISOString()
    }
  ]));
  const [benefits, setBenefits] = useState(() => loadData('benefits', [
    {
      id: "benefit_1",
      oshiId: "oshi_1",
      storeName: "アニメイト",
      benefitDetail: "限定ブロマイド",
      location: "池袋本店",
      deadline: "2026-03-31",
      obtained: false,
      memo: "対象商品3000円以上購入",
      createdAt: new Date().toISOString()
    }
  ]));
  const [trips, setTrips] = useState(() => loadData('trips', [
    {
      id: "trip_1",
      oshiId: "oshi_1",
      name: "2026 夏の全国ツアー 東京公演",
      date: "2026-08-10",
      destinations: [
        { id: "dest_1", name: "東京駅", address: "東京都千代田区", arrivalTime: "10:00", purpose: "集合", memo: "新幹線改札口付近", surroundingInfo: "駅ナカにカフェ多数あり", travelTime: "", transportFee: 0 },
        { id: "dest_2", name: "東京ドーム", address: "東京都文京区", arrivalTime: "14:00", purpose: "イベント", memo: "17時開演、物販12時から", surroundingInfo: "ラクーアで時間つぶせる", travelTime: "電車30分", transportFee: 200 },
        { id: "dest_3", name: "ホテルメトロポリタン", address: "東京都豊島区", arrivalTime: "21:30", purpose: "宿泊", memo: "チェックインは24時まで", surroundingInfo: "駅近で便利", travelTime: "電車20分", transportFee: 170 }
      ],
      transportationCost: 370,
      totalBudget: 45000,
      completed: false,
      createdAt: new Date().toISOString()
    }
  ]));
  const [actions, setActions] = useState(() => loadData('actions', [
    {
      id: "action_1",
      oshiId: "oshi_1",
      date: "2026-02-01",
      action: "配信で視聴者の悩み相談に真剣に乗っていた",
      context: "毎週の定期生放送にて",
      feeling: "positive",
      reason: "推しの誠実さが伝わってきたから",
      tags: ["優しい", "努力家"],
      createdAt: new Date().toISOString()
    },
    {
      id: "action_2",
      oshiId: "oshi_1",
      date: "2026-02-03",
      action: "SNSでファンを煽るような過激な発言をした",
      context: "深夜のX(旧Twitter)の投稿",
      feeling: "negative",
      reason: "もっと穏やかな推しでいてほしいと感じたから",
      tags: ["ツンデレ"],
      createdAt: new Date().toISOString()
    },
    {
      id: "action_3",
      oshiId: "oshi_1",
      date: "2026-02-05",
      action: "ライブのMCで「みんなの応援が力になる」と涙ぐんでいた",
      context: "冬のソロコンサートMC",
      feeling: "positive",
      reason: "ファンの存在を大切に思ってくれているのが伝わった",
      tags: ["繊細", "ファン想い"],
      createdAt: new Date().toISOString()
    },
    {
      id: "action_4",
      oshiId: "oshi_1",
      date: "2026-02-06",
      action: "練習動画で深夜まで一人でダンスの確認をしていた",
      context: "公式YouTube의 密着動画",
      feeling: "positive",
      reason: "影の努力を惜しまない姿勢に改めて惚れ直した",
      tags: ["努力家", "かっこいい"],
      createdAt: new Date().toISOString()
    },
    {
      id: "action_5",
      oshiId: "oshi_1",
      date: "2026-02-07",
      action: "バラエティ番組で天然な発言を連発していた",
      context: "ゴールデンタイムの地上波番組",
      feeling: "positive",
      reason: "ギャップがあって非常に可愛らしかった",
      tags: ["天然", "面白い"],
      createdAt: new Date().toISOString()
    },
    {
      id: "action_6",
      oshiId: "oshi_1",
      date: "2026-02-08",
      action: "コラボグッズのデザインが予想外の方向性だった",
      context: "アパレルブランドとのコラボ発表",
      feeling: "negative",
      reason: "推しの本来のイメージとは少し違う気がした",
      tags: ["面白い"],
      createdAt: new Date().toISOString()
    }
  ]));
  const [analyses, setAnalyses] = useState(() => loadData('analyses', []));
  const [basicInfos, setBasicInfos] = useState(() => loadData('basicInfos', [
    {
      oshiId: "oshi_1",
      answers: {
        q1_name: "星野さくら（さくちゃん）",
        q2_activity: "ソロアイドル、モデル",
        q3_birthday: "2005年4月12日",
        q4_visual: "ポニーテール、158cm、透明感のある雰囲気",
        q5_personality: "誠実、天然、努力家",
        q6_anniversary: "2024年の夏フェス",
        q7_discovery: "SNSで流れてきたダンス動画",
        q8_works: "1stシングル「サクラ・スマイル」",
        q9_sns: "https://example.com/oshi_sns",
        q10_catchphrase: "世界を優しく照らす、唯一無二の桜色"
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ]));
  const [chatMessages, setChatMessages] = useState(() => loadData('chatMessages', []));

  // Persistence Sync
  useEffect(() => {
    localStorage.setItem('oshikatsu_oshis', JSON.stringify(oshis));
    localStorage.setItem('oshikatsu_goods', JSON.stringify(goods));
    localStorage.setItem('oshikatsu_events', JSON.stringify(events));
    localStorage.setItem('oshikatsu_benefits', JSON.stringify(benefits));
    localStorage.setItem('oshikatsu_trips', JSON.stringify(trips));
    localStorage.setItem('oshikatsu_actions', JSON.stringify(actions));
    localStorage.setItem('oshikatsu_analyses', JSON.stringify(analyses));
    localStorage.setItem('oshikatsu_basicInfos', JSON.stringify(basicInfos));
    localStorage.setItem('oshikatsu_chatMessages', JSON.stringify(chatMessages));
  }, [oshis, goods, events, benefits, trips, actions, analyses, basicInfos, chatMessages]);

  const [currentView, setCurrentView] = useState('home'); // 'home', 'management-dashboard', 'oshigotari-select', 'oshigotari-main', 'oshi-detail', 'oshi-form', 'goods-form', 'event-form', 'benefit-form', 'trip-form', 'trip-detail', 'action-form', 'analysis-result'
  const [selectedOshiId, setSelectedOshiId] = useState(null);
  const [selectedTripId, setSelectedTripId] = useState(null);
  const [selectedAnalysisId, setSelectedAnalysisId] = useState(null);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // UI Sub-state
  const [oshiDetailActiveTab, setOshiDetailActiveTab] = useState('goods');
  const [oshigotariMainActiveTab, setOshigotariMainActiveTab] = useState('basic');
  const [goodsFilterStatus, setGoodsFilterStatus] = useState('all');
  const [goodsSortType, setGoodsSortType] = useState('priority');
  const [actionsFilterStatus, setActionsFilterStatus] = useState('all');
  const [showGlobalAnalysis, setShowGlobalAnalysis] = useState(false);
  const [globalAnalysisData, setGlobalAnalysisData] = useState([]);
  const [aiUsageCount, setAiUsageCount] = useState(0);

  // Data helpers
  const getOshi = (id) => oshis.find(o => o.id === id);
  const getOshiGoods = (oshiId) => goods.filter(g => g.oshiId === oshiId);
  const getOshiEvents = (oshiId) => events.filter(e => e.oshiId === oshiId);
  const getOshiBenefits = (oshiId) => benefits.filter(b => b.oshiId === oshiId);
  const getOshiTrips = (oshiId) => trips.filter(t => t.oshiId === oshiId);
  const getTrip = (id) => trips.find(t => t.id === id);
  const getOshiActions = (oshiId) => actions.filter(a => a.oshiId === oshiId);
  const getOshiAnalyses = (oshiId) => analyses.filter(a => a.oshiId === oshiId);
  const getAnalysis = (id) => analyses.find(a => a.id === id);

  // Handlers - Oshi
  const saveOshi = (data) => {
    if (editingItem) {
      setOshis(oshis.map(o => o.id === editingItem.id ? { ...o, ...data } : o));
    } else {
      const newOshi = {
        id: `oshi_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        ...data,
        spent: 0,
        createdAt: new Date().toISOString()
      };
      setOshis([...oshis, newOshi]);
    }
    setCurrentView('home');
    setEditingItem(null);
  };

  const deleteOshi = (id) => {
    if (window.confirm('本当に削除しますか？紐付くグッズも削除されます。')) {
      setOshis(oshis.filter(o => o.id !== id));
      setGoods(goods.filter(g => g.oshiId !== id));
      setEvents(events.filter(e => e.oshiId !== id));
      setBenefits(benefits.filter(b => b.oshiId !== id));
      setTrips(trips.filter(t => t.oshiId !== id));
      setCurrentView('home');
    }
  };

  // Handlers - Goods
  const saveGoods = (data) => {
    if (editingItem) {
      // Update logic handled differently if changing price/purchased status? 
      // Simplified: Just update fields. Purchase status managed separately or inferred.
      // Actually form doesn't handle purchased status usually, but price change affects budget.
      // For simplicity in Phase 1, if price changes on purchased item, we need to recalc spent.
      // Let's just update the item. The spent calculation is done dynamically or needs re-summing.

      const oldItem = goods.find(g => g.id === editingItem.id);
      const priceDiff = (data.price - oldItem.price);

      setGoods(goods.map(g => g.id === editingItem.id ? { ...g, ...data } : g));

      if (oldItem.purchased) {
        updateOshiSpent(oldItem.oshiId, priceDiff);
      }
    } else {
      const newGoods = {
        id: `goods_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        oshiId: selectedOshiId,
        ...data,
        purchased: false,
        createdAt: new Date().toISOString()
      };
      setGoods([...goods, newGoods]);
    }
    setCurrentView('oshi-detail');
    setEditingItem(null);
  };

  const deleteGoods = (id) => {
    if (window.confirm('このグッズを削除しますか？')) {
      const target = goods.find(g => g.id === id);
      if (target.purchased) {
        updateOshiSpent(target.oshiId, -target.price);
      }
      setGoods(goods.filter(g => g.id !== id));
    }
  };

  const togglePurchase = (goodsId) => {
    const target = goods.find(g => g.id === goodsId);
    if (!target) return;

    const newPurchased = !target.purchased;
    setGoods(goods.map(g => g.id === goodsId ? { ...g, purchased: newPurchased, purchasedAt: newPurchased ? new Date().toISOString() : null } : g));
    updateOshiSpent(target.oshiId, newPurchased ? target.price : -target.price);
  };

  const updateOshiSpent = (oshiId, amount) => {
    setOshis(prev => prev.map(o => o.id === oshiId ? { ...o, spent: o.spent + amount } : o));
  };

  // Handlers - Events
  const saveEvent = (data) => {
    if (editingItem) {
      // Calculate difference in actualCost if attended
      const oldItem = events.find(e => e.id === editingItem.id);
      const costDiff = (data.actualCost || 0) - (oldItem.actualCost || 0);

      setEvents(events.map(e => e.id === editingItem.id ? { ...e, ...data } : e));

      if (oldItem.attended) {
        updateOshiSpent(oldItem.oshiId, costDiff);
      }
    } else {
      const newEvent = {
        id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        oshiId: selectedOshiId,
        ...data,
        attended: false,
        actualCost: 0,
        createdAt: new Date().toISOString()
      };
      setEvents([...events, newEvent]);
    }
    setCurrentView('oshi-detail');
    setEditingItem(null);
  };

  const deleteEvent = (id) => {
    if (window.confirm('このイベントを削除しますか？')) {
      const target = events.find(e => e.id === id);
      if (target.attended) {
        updateOshiSpent(target.oshiId, -(target.actualCost || 0));
      }
      setEvents(events.filter(e => e.id !== id));
    }
  };

  const toggleEventAttendance = (eventId) => {
    const target = events.find(e => e.id === eventId);
    if (!target) return;

    if (!target.attended) {
      // Marking as attended - Prompt for actual cost or use budget?
      // For simplicity/UX, let's assume they entered it in edit or we default to budget
      // But requirement says "input actual cost on check". Let's use a simple prompt for now or just use budget as default actual
      const cost = prompt("実際の費用を入力してください", target.budget);
      if (cost === null) return; // Cancelled
      const actualCost = Number(cost);

      setEvents(events.map(e => e.id === eventId ? { ...e, attended: true, actualCost } : e));
      updateOshiSpent(target.oshiId, actualCost);
    } else {
      // Unmarking
      setEvents(events.map(e => e.id === eventId ? { ...e, attended: false } : e));
      updateOshiSpent(target.oshiId, -(target.actualCost || 0));
    }
  };

  // Handlers - Benefits
  const saveBenefit = (data) => {
    if (editingItem) {
      setBenefits(benefits.map(b => b.id === editingItem.id ? { ...b, ...data } : b));
    } else {
      const newBenefit = {
        id: `benefit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        oshiId: selectedOshiId,
        ...data,
        obtained: false,
        createdAt: new Date().toISOString()
      };
      setBenefits([...benefits, newBenefit]);
    }
    setCurrentView('oshi-detail');
    setEditingItem(null);
  };

  const deleteBenefit = (id) => {
    if (window.confirm('この特典情報を削除しますか？')) {
      setBenefits(benefits.filter(b => b.id !== id));
    }
  };

  const toggleBenefitObtained = (id) => {
    const target = benefits.find(b => b.id === id);
    if (!target) return;
    setBenefits(benefits.map(b => b.id === id ? { ...b, obtained: !b.obtained } : b));
  };

  // Handlers - Trips
  const saveTrip = (data) => {
    if (editingItem) {
      setTrips(trips.map(t => t.id === editingItem.id ? { ...t, ...data } : t));
    } else {
      const newTrip = {
        id: `trip_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        oshiId: selectedOshiId,
        ...data,
        completed: false,
        createdAt: new Date().toISOString()
      };
      setTrips([...trips, newTrip]);
    }
    setCurrentView('oshi-detail');
    setEditingItem(null);
  };

  const deleteTrip = (id) => {
    if (window.confirm('この遠征プランを削除しますか？')) {
      setTrips(trips.filter(t => t.id !== id));
      if (selectedTripId === id) setSelectedTripId(null);
      setCurrentView('oshi-detail');
    }
  };

  const toggleTripCompletion = (id) => {
    setTrips(trips.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  // Handlers - Actions
  const saveAction = (data) => {
    if (editingItem) {
      setActions(actions.map(a => a.id === editingItem.id ? { ...a, ...data } : a));
    } else {
      const newAction = {
        id: `action_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        oshiId: selectedOshiId,
        ...data,
        createdAt: new Date().toISOString()
      };
      setActions([...actions, newAction]);
    }
    setCurrentView('oshi-detail');
    setEditingItem(null);
  };

  const deleteAction = (id) => {
    if (window.confirm('この記録を削除しますか？')) {
      setActions(actions.filter(a => a.id !== id));
    }
  };

  // Handlers - Analysis
  const saveAnalysis = (data) => {
    const newAnalysis = {
      id: `analysis_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      oshiId: selectedOshiId,
      date: new Date().toISOString().split('T')[0],
      ...data,
      createdAt: new Date().toISOString()
    };
    setAnalyses([...analyses, newAnalysis]);
    setSelectedAnalysisId(newAnalysis.id);
    setCurrentView('analysis-result');
  };

  const deleteAnalysis = (id) => {
    if (window.confirm('この分析履歴を削除しますか？')) {
      setAnalyses(analyses.filter(a => a.id !== id));
      if (selectedAnalysisId === id) {
        setSelectedAnalysisId(null);
        setCurrentView('oshi-detail');
      }
    }
  };

  const performAnalysis = async () => {
    const oshi = getOshi(selectedOshiId);
    if (!oshi) return;

    const oshiActions = getOshiActions(selectedOshiId);
    const basicInfo = basicInfos.find(bi => bi.oshiId === selectedOshiId);

    if (!oshiActions || oshiActions.length === 0) {
      alert('分析するための行動記録がありません。');
      return;
    }

    setIsAiLoading(true);

    try {
      const response = await fetch("/api/analyze", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          oshiName: oshi.name,
          basicInfo: basicInfo?.answers || {},
          actions: oshiActions.slice(-10)
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'サーバーエラー');
      }

      const data = await response.json();

      // 変更
      saveAnalysis(data);

    } catch (error) {
      console.error('AI分析エラー:', error);
      alert('AI分析に失敗しました: ' + error.message);
    } finally {
      setIsAiLoading(false);
    }
  };



  // Navigation
  // eslint-disable-next-line no-unused-vars
  const goHome = () => {
    setSelectedOshiId(null);
    setEditingItem(null);
    setCurrentView('home');
  };

  const goOshiDetail = (id) => {
    setSelectedOshiId(id);
    setCurrentView('oshi-detail');
  };

  const goAddOshi = () => {
    setEditingItem(null);
    setCurrentView('oshi-form');
  };

  const goAddAction = () => {
    setEditingItem(null);
    setCurrentView('action-form');
  };

  const goEditAction = (action) => {
    setEditingItem(action);
    setCurrentView('action-form');
  };

  const goAnalysisResult = (analysis) => {
    setSelectedAnalysisId(analysis.id);
    setCurrentView('analysis-result');
  };

  const goTripForm = (trip = null) => {
    setEditingItem(trip);
    setCurrentView('trip-form');
  };

  const goTripDetail = (id) => {
    setSelectedTripId(id);
    setCurrentView('trip-detail');
  };

  const goEditOshi = (oshi) => {
    setEditingItem(oshi);
    setCurrentView('oshi-form');
  };

  const goAddGoods = () => {
    setEditingItem(null);
    setCurrentView('goods-form');
  };

  const goEditGoods = (item) => {
    setEditingItem(item);
    setCurrentView('goods-form');
  };

  const goAddEvent = () => {
    setEditingItem(null);
    setCurrentView('event-form');
  };

  const goEditEvent = (item) => {
    setEditingItem(item);
    setCurrentView('event-form');
  };

  const goAddBenefit = () => {
    setEditingItem(null);
    setCurrentView('benefit-form');
  }

  const goEditBenefit = (item) => {
    setEditingItem(item);
    setCurrentView('benefit-form');
  }

  const goManagementDashboard = () => {
    setCurrentView('management-dashboard');
  };

  const goOshigotariSelect = () => {
    setCurrentView('oshigotari-select');
  };

  const goOshigotariMain = (id) => {
    setSelectedOshiId(id);
    setCurrentView('oshigotari-main');
  };

  const goBasicInfoForm = (id) => {
    setSelectedOshiId(id);
    setCurrentView('oshi-basic-form');
  };

  // --- Sub-Components (Views) ---

  const PortalHomeView = () => {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-12 px-4 py-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-pink-500 to-orange-500 bg-clip-text text-transparent">
            推し記録帳
          </h1>
          <p className="text-lg text-gray-600 font-medium">推しとの向き合い方を見つけよう</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
          {/* Card A: Management */}
          <Card
            className="group relative overflow-hidden border-2 border-orange-200 text-orange-600 cursor-pointer hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 bg-gradient-to-br from-orange-50 to-white p-8"
            onClick={goManagementDashboard}
          >
            <div className="flex flex-col h-full space-y-6 relative z-10">
              <div className="bg-gradient-to-br from-white w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg">
                <Coins className="w-8 h-8 text-orange-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-2 text-gray-800">情報管理モード</h2>
                <p className="text-gray-600 leading-relaxed">お金とスケジュールを管理。グッズ、イベント、予算を記録して計画的に推し活。</p>
              </div>
              <Button
                onClick={() => handleNavigate(goManagementDashboard)}
                variant="plain" className="mt-auto w-full bg-white text-orange-500 border border-orange-400 font-bold text-base md:text-lg py-5 rounded-xl shadow-md hover:shadow-lg whitespase-nowrap">
                管理画面へ
              </Button>
            </div>
            <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform duration-500">
              <Calendar className="w-48 h-48 text-orange-800" />
            </div>
          </Card>

          {/* Card B: Oshi-Talk */}
          <Card
            className="group relative overflow-hidden border-2 border-pink-200 text-pink-600 cursor-pointer hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 bg-gradient-to-br from-pink-50 to-white border-2 border-pink-200 p-8"
            onClick={goOshigotariSelect}
          >
            <div className="flex flex-col h-full space-y-6 relative z-10">
              <div className="bg-gradient-to-br from-white w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg">
                <Heart className="w-8 h-8 text-pink-500" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-2 text-gray-800">推し語りモード</h2>
                <p className="text-gray-600 leading-relaxed">推しの魅力を言語化。推しの行動を記録して、自分の好きを深く理解する。</p>
              </div>
              <Button variant="plain" className="mt-auto w-full bg-white text-pink-500 border border-pink-400 font-bold text-base md:text-lg py-5 rounded-xl shadow-md hover:shadow-lg whitespase-nowrap">
                推し語りへ
              </Button>
            </div>
            <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform duration-500">
              <Heart className="w-48 h-48 text-pink-800" />
            </div>
          </Card>
        </div>
      </div>
    );
  };

  const ManagementDashboardView = () => {
    const totalBudget = oshis.reduce((sum, o) => sum + o.monthlyBudget, 0);
    const totalSpent = oshis.reduce((sum, o) => sum + o.spent, 0);
    const remaining = totalBudget - totalSpent;

    return (
      <div className="space-y-6 animate-ethereal-fade">
        <header className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Button variant="normal" size="icon" onClick={() => setCurrentView('home')}><ArrowLeft className="w-5 h-5 text-gray-400 hover:text-gray-600 hover:bg-gray-200/70 rounded-lg transition-colors" /></Button>
            <h1 className="text-2xl font-bold text-orange-600">情報管理</h1>
          </div>
          <div className="flex gap-2">
            <Button onClick={goOshigotariSelect} size="sm" variant="plain" className="border-pink-400 text-pink-500 "><Heart className="w-4 h-4 mr-2 text-pink-500" /> 推し語りへ</Button>
            <Button onClick={goAddOshi} size="sm" variant="plain" className="border-orange-500 text-orange-600 "><Plus className="w-4 h-4 mr-2 text-orange-600" /> 推し追加</Button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Left Column: Stats & Oshi List */}
          <div className="md:col-span-2 space-y-6">
            {/* Budget Summary */}
            <div className="p-6 rounded-2xl bg-white/90 backdrop-blur-md border border-white/60 shadow-[0_10px_20px_rgba(255,140,0,0.25)]">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center"><Coins className="w-5 h-5 mr-2 text-orange-600" />今月の予算サマリー</h2>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-sm text-gray-500">総予算</p>
                  <p className="text-xl font-bold text-gray-700">¥{totalBudget.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">支出</p>
                  <p className="text-xl font-bold text-orange-700">¥{totalSpent.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">残高</p>
                  <p className="text-xl font-bold text-aqua-700">¥{remaining.toLocaleString()}</p>
                </div>
              </div>
              <div className="mt-4">
                <Progress value={totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0} className="h-2 bg-gray-200" indicatorColor="bg-gradient-to-r from-orange-300 to-orange-600" />
              </div>
            </div>

            {/* Oshi List */}
            <div>
              <h2 className="text-lg font-bold mb-3 flex items-center"><Heart className="w-5 h-5 mr-2 text-orange-600" /> 推し一覧</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {oshis.map(oshi => {
                  const percent = oshi.monthlyBudget > 0 ? (oshi.spent / oshi.monthlyBudget) * 100 : 0;
                  return (
                    <Card key={oshi.id} className="p-4 hover:shadow-lg transition-shadow cursor-pointer border-orange-200" onClick={() => goOshiDetail(oshi.id)}>
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-lg font-bold text-gray-800">{oshi.name}</h3>
                          <span className="text-xs px-2 py-1 bg-orange-100 text-orange-700 rounded-full">{oshi.genre}</span>
                        </div>
                        <ArrowLeft className="w-4 h-4 text-gray-300 transform rotate-180" />
                      </div>
                      <div className="mt-4 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">残高</span>
                          <span className={`font-medium ${oshi.monthlyBudget - oshi.spent < 0 ? 'text-orange-500' : 'text-gray-700'}`}>
                            ¥{(oshi.monthlyBudget - oshi.spent).toLocaleString()}
                          </span>
                        </div>
                        <Progress value={percent} className="h-2" indicatorColor="bg-orange-300" />
                      </div>
                    </Card>
                  );
                })}
                {oshis.length === 0 && (
                  <div className="col-span-full text-center py-10 text-gray-400 border-2 border-dashed rounded-lg">
                    推しが登録されていません。<br />「推し追加」ボタンから登録してください。
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Alerts & Updates */}
          <div className="space-y-6">
            {/* Upcoming Events */}
            <Card className="p-4">
              <h3 className="text-md font-bold mb-3 flex items-center text-gray-700"><Calendar className="w-4 h-4 mr-2" /> 直近のイベント</h3>
              <div className="space-y-3">
                {events
                  .filter(e => new Date(e.date) >= new Date()) // Future events only
                  .sort((a, b) => new Date(a.date) - new Date(b.date))
                  .slice(0, 3)
                  .map(event => {
                    const oshiName = getOshi(event.oshiId)?.name || '不明';
                    return (
                      <div key={event.id} className="text-sm border-b last:border-0 pb-2 cursor-pointer hover:bg-gray-50 p-1 rounded" onClick={() => goOshiDetail(event.oshiId)}>
                        <div className="flex justify-between text-gray-500 text-xs mb-0.5">
                          <span>{event.date}</span>
                          <span className="text-orange-400 font-medium">{oshiName}</span>
                        </div>
                        <div className="font-medium">{event.name}</div>
                      </div>
                    );
                  })
                }
                {events.filter(e => new Date(e.date) >= new Date()).length === 0 && (
                  <div className="text-center text-gray-400 text-sm py-4">予定されているイベントはありません</div>
                )}
              </div>
            </Card>

            {/* Benefit Deadlines */}
            <Card className="p-4">
              <h3 className="text-md font-bold mb-3 flex items-center text-gray-700"><AlertCircle className="w-4 h-4 mr-2" /> 特典・期限アラート</h3>
              <div className="space-y-3">
                {benefits
                  .filter(b => !b.obtained && new Date(b.deadline) >= new Date()) // Not obtained & future
                  .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
                  .slice(0, 3)
                  .map(benefit => {
                    const oshiName = getOshi(benefit.oshiId)?.name || '不明';
                    const diffDays = Math.ceil((new Date(benefit.deadline) - new Date()) / (1000 * 60 * 60 * 24));
                    const isUrgent = diffDays <= 3;

                    return (
                      <div key={benefit.id} className="text-sm border-b last:border-0 pb-2 cursor-pointer hover:bg-gray-50 p-1 rounded" onClick={() => goOshiDetail(benefit.oshiId)}>
                        <div className="flex justify-between text-gray-500 text-xs mb-0.5">
                          <span className={`${isUrgent ? 'text-red-500 font-bold' : ''}`}>あと{diffDays}日 ({benefit.deadline})</span>
                          <span className="text-orange-400 font-medium">{oshiName}</span>
                        </div>
                        <div className="font-medium">{benefit.storeName}</div>
                        <div className="text-xs text-gray-400 truncate">{benefit.benefitDetail}</div>
                      </div>
                    );
                  })
                }
                {benefits.filter(b => !b.obtained && new Date(b.deadline) >= new Date()).length === 0 && (
                  <div className="text-center text-gray-400 text-sm py-4">期限が迫っている特典はありません</div>
                )}
              </div>
            </Card>

            {/* Upcoming Trips */}
            <Card className="p-4">
              <h3 className="text-md font-bold mb-3 flex items-center text-gray-700"><Plane className="w-4 h-4 mr-2" /> 今後の遠征</h3>
              <div className="space-y-3">
                {trips
                  .filter(t => !t.completed && new Date(t.date) >= new Date())
                  .sort((a, b) => new Date(a.date) - new Date(b.date))
                  .slice(0, 3)
                  .map(trip => {
                    const oshiName = getOshi(trip.oshiId)?.name || '不明';
                    return (
                      <div key={trip.id} className="text-sm border-b last:border-0 pb-2 cursor-pointer hover:bg-gray-50 p-1 rounded" onClick={() => { setSelectedOshiId(trip.oshiId); goTripDetail(trip.id); }}>
                        <div className="flex justify-between text-gray-500 text-xs mb-0.5">
                          <span>{trip.date}</span>
                          <span className="text-orange-400 font-medium">{oshiName}</span>
                        </div>
                        <div className="font-medium">{trip.name}</div>
                        <div className="text-xs text-gray-400">{trip.destinations.length}箇所の目的地</div>
                      </div>
                    );
                  })
                }
                {trips.filter(t => !t.completed && new Date(t.date) >= new Date()).length === 0 && (
                  <div className="text-center text-gray-400 text-sm py-4">予定されている遠征はありません</div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  };

  const handleGlobalAnalysis = async () => {
    const unpurchased = goods.filter(g => g.oshiId === selectedOshiId && !g.purchased);
    if (unpurchased.length === 0) return alert('未購入のグッズがありません');

    setIsAiLoading(true);
    try {
      const oshi = getOshi(selectedOshiId);
      const oshiActions = getOshiActions(selectedOshiId);
      const oshiBasicInfo = basicInfos.find(bi => bi.oshiId === selectedOshiId);

      const prompt = `あなたは推し活アドバイザーです。
未購入のグッズリストを、推しの基本情報とこれまでの感情記録（プラス・マイナス）をもとに一括分析し、
それぞれの購入優先度を提案してください。

【推しの名前】: ${oshi.name}
【最近の感情記録】
${oshiActions.slice(-10).map(a => `- ${a.feeling === 'positive' ? 'プラス' : 'マイナス'}: ${a.action} (${a.reason})`).join('\n')}

【未購入グッズリスト】
${unpurchased.map(g => `- ID: ${g.id}, 名前: ${g.name}, 価格: ${g.price}円, メモ: ${g.memo || 'なし'}`).join('\n')}

【出力要求】
各グッズに対して、以下のJSON形式を含む配列のみで回答してください：
[
  {
    "id": "グッズのID",
    "aiPriority": "high" | "medium" | "low",
    "aiScore": 0から100の数値,
    "aiReason": "具体的な理由（80文字程度）"
  },
  ...
]`;

      const apiKey = localStorage.getItem('anthropic_api_key') || 'YOUR_API_KEY_HERE';
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerously-allow-browser": "true"
        },
        body: JSON.stringify({
          model: "claude-3-sonnet-20240229",
          max_tokens: 2000,
          messages: [{ role: 'user', content: prompt }]
        })
      });

      if (!response.ok) {
        const errorInfo = handleApiError(new Error(`HTTP ${response.status}`), response);
        throw new Error(errorInfo.message);
      }

      const data = await response.json();
      const text = data.content[0].text;

      // Use robust JSON parser
      const results = parseAiJsonResponse(text);

      // Merge AI results back to the original goods data for the modal
      const mergedResults = unpurchased.map(g => {
        const aiData = results.find(r => r.id === g.id);
        return {
          ...g,
          aiScore: aiData?.aiScore || 50,
          aiPriority: aiData?.aiPriority || 'medium',
          aiReason: aiData?.aiReason || "分析結果が得られませんでした。"
        };
      });

      setGlobalAnalysisData(mergedResults.sort((a, b) => b.aiScore - a.aiScore));
      setShowGlobalAnalysis(true);
    } catch (error) {
      console.error('Global Analysis Error:', error);
      alert('一括分析に失敗しました:\n' + error.message);
    } finally {
      setIsAiLoading(false);
    }
  };

  const applyAllAiPriorities = () => {
    const updatedGoods = goods.map(g => {
      const analysis = globalAnalysisData.find(ad => ad.id === g.id);
      if (analysis) {
        return { ...g, priority: analysis.aiPriority };
      }
      return g;
    });
    setGoods(updatedGoods);
    setShowGlobalAnalysis(false);
    alert('AIの推奨優先度をすべてに適用しました！');
  };

  const OshiDetailView = () => {
    const oshi = getOshi(selectedOshiId);
    const oshiGoods = getOshiGoods(selectedOshiId);
    const oshiEvents = getOshiEvents(selectedOshiId);
    const oshiBenefits = getOshiBenefits(selectedOshiId);
    const oshiTrips = getOshiTrips(selectedOshiId);
    const oshiActions = getOshiActions(selectedOshiId);
    const oshiAnalyses = getOshiAnalyses(selectedOshiId);

    // UI State for Tabs
    const [isAiLoading, setIsAiLoading] = useState(false);

    if (!oshi) return <div>Data not found</div>;

    const remaining = oshi.monthlyBudget - oshi.spent;
    const usagePercent = oshi.monthlyBudget > 0 ? (oshi.spent / oshi.monthlyBudget) * 100 : 0;

    // Filter Logic
    let displayGoods = oshiGoods.filter(g => {
      if (goodsFilterStatus === 'bought') return g.purchased;
      if (goodsFilterStatus === 'not-bought') return !g.purchased;
      return true;
    });

    // Sort Logic
    // eslint-disable-next-line array-callback-return
    displayGoods.sort((a, b) => {
      if (goodsSortType === 'priority') {
        const map = { high: 3, medium: 2, low: 1 };
        return map[b.priority] - map[a.priority];
      }
      if (goodsSortType === 'price') return a.price - b.price;
      if (goodsSortType === 'date') return new Date(a.releaseDate) - new Date(b.releaseDate);
    });

    return (
      <div className="space-y-6 animate-ethereal-fade">
        <div className="flex items-center justify-between mb-4 gap-2">
          <div className="flex items-center gap-2">
            <Button variant="normal" size="icon" onClick={() => setCurrentView('management-dashboard')} className="rounded-full"><ArrowLeft className="w-5 h-5 text-gray-400 hover:text-gray-600 hover:bg-gray-200/70 rounded-lg transition-colors" /></Button>
            <h1 className="text-2xl font-bold text-orange-600">{oshi.name} 詳細</h1>
          </div>
          <Button onClick={goOshigotariSelect} size="sm" variant="plain" className="border-pink-400 text-pink-500 "><Heart className="w-4 h-4 mr-2 text-pink-500" /> 推し語りへ</Button>
        </div>

        {/* Oshi Info Header */}
        <Card className="p-6 border-orange-100">
          <div className="flex justify-between items-start">
            <div>
              <h2 variant="normal" className="text-2xl font-bold flex items-center gap-2 text-gray-800">
                {oshi.name} <span className="text-sm font-normal px-2 py-1 bg-gray-100 rounded-full">{oshi.genre}</span>
              </h2>
            </div>
            <div className="flex space-x-2">
              <Button variant="orange" size="sm" onClick={() => goEditOshi(oshi)}><Edit className="w-4 h-4 mr-1" /> 編集</Button>
              <Button variant="aqua" size="sm" onClick={() => deleteOshi(oshi.id)}><Trash2 className="w-4 h-4 mr-1" /> 削除</Button>
            </div>
          </div>

          {/* Dashboard */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-end">
              <span className="text-sm font-medium text-gray-500">今月の予算状況</span>
              <span className={`text-xl font-bold ${remaining < (oshi.monthlyBudget * 0.1) ? 'text-orange-600' : 'text-gray-800'}`}>
                残高 ¥{remaining.toLocaleString()}
              </span>
            </div>
            <Progress value={usagePercent} className="h-4 rounded-full bg-white/30 backdrop-blur-sm shadow-inner" indicatorColor={usagePercent > 90 ? "bg-gradient-to-r from-orange-400 to-orange-600" : "bg-gradient-to-r from-orange-300 to-orange-500"} />
            <div className="flex justify-between mt-2 text-sm text-gray-800">
              <span>支出: ¥{oshi.spent.toLocaleString()}</span>
              <span>予算: ¥{oshi.monthlyBudget.toLocaleString()}</span>
            </div>
            {remaining < (oshi.monthlyBudget * 0.1) && (
              <div className="mt-2 text-xs text-orange-600 font-bold flex items-center">
                ⚠️ 予算残高がピンチです！
              </div>
            )}
          </div>
        </Card>



        {/* Tabs Navigation */}
        <Tabs>
          <TabsList className="grid w-full grid-cols-4 mb-4 h-auto flex-wrap">
            <TabsTrigger value="goods" activeValue={oshiDetailActiveTab} onClick={() => setOshiDetailActiveTab('goods')} className="py-2">
              <ShoppingBag className="w-4 h-4 md:mr-2" /> <span className="hidden md:inline">グッズ</span>
              <span className="ml-1 md:ml-2 text-[10px] md:text-xs bg-gray-200 text-gray-700 px-1.5 py-0.5 rounded-full">{oshiGoods.length}</span>
            </TabsTrigger>
            <TabsTrigger value="events" activeValue={oshiDetailActiveTab} onClick={() => setOshiDetailActiveTab('events')} className="py-2">
              <Calendar className="w-4 h-4 md:mr-2" /> <span className="hidden md:inline">イベント</span>
              <span className="ml-1 md:ml-2 text-[10px] md:text-xs bg-gray-200 text-gray-700 px-1.5 py-0.5 rounded-full">{oshiEvents.length}</span>
            </TabsTrigger>
            <TabsTrigger value="benefits" activeValue={oshiDetailActiveTab} onClick={() => setOshiDetailActiveTab('benefits')} className="py-2">
              <Gift className="w-4 h-4 md:mr-2" /> <span className="hidden md:inline">特典</span>
              <span className="ml-1 md:ml-2 text-[10px] md:text-xs bg-gray-200 text-gray-700 px-1.5 py-0.5 rounded-full">{oshiBenefits.length}</span>
            </TabsTrigger>
            <TabsTrigger value="trips" activeValue={oshiDetailActiveTab} onClick={() => setOshiDetailActiveTab('trips')} className="py-2">
              <Map className="w-4 h-4 md:mr-2" /> <span className="hidden md:inline">遠征</span>
              <span className="ml-1 md:ml-2 text-[10px] md:text-xs bg-gray-200 text-gray-700 px-1.5 py-0.5 rounded-full">{oshiTrips.length}</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Goods Section */}
        {
          oshiDetailActiveTab === 'goods' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold flex items-center"><ShoppingBag className="w-5 h-5 mr-2" /> グッズリスト</h3>
                <div className="flex gap-2">
                  <Button
                    onClick={handleGlobalAnalysis}
                    size="sm"
                    variant="aqua"
                    disabled={isAiLoading || getOshiActions(selectedOshiId).length === 0}
                  >
                    {isAiLoading ? (
                      <span className="w-4 h-4 border-2 border-orange-400 border-t-transparent rounded-full animate-spin mr-1"></span>
                    ) : (
                      <Sparkles className="w-4 h-4 mr-1" />
                    )}
                    おすすめ分析
                  </Button>
                  <Button variant="orange" onClick={goAddGoods} size="sm"><Plus className="w-4 h-4 mr-1" /> グッズ追加</Button>
                </div>
              </div>

              {/* Filters */}
              <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                <Select className="w-[140px]"
                  options={[
                    { label: '優先度順', value: 'priority' },
                    { label: '価格順', value: 'price' },
                    { label: '発売日順', value: 'date' },
                  ]}
                  value={goodsSortType}
                  onChange={(e) => setGoodsSortType(e.target.value)}
                />
                <Select className="w-[140px]"
                  options={[
                    { label: 'すべて', value: 'all' },
                    { label: '未購入', value: 'not-bought' },
                    { label: '購入済', value: 'bought' },
                  ]}
                  value={goodsFilterStatus}
                  onChange={(e) => setGoodsFilterStatus(e.target.value)}
                />
              </div>

              {/* Goods List */}
              <div className="space-y-3">
                {displayGoods.map(item => {
                  const priorityColors = {
                    high: 'bg-red-100 text-red-700 border-red-200',
                    medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
                    low: 'bg-aqua-100 text-aqua-700 border-aqua-200'
                  };
                  const priorityLabel = { high: '高', medium: '中', low: '低' };

                  return (
                    <Card key={item.id} className={`p-4 flex items-center justify-between transition-colors ${item.purchased ? 'bg-gray-50' : 'bg-white'}`}>
                      <div className="flex items-center gap-4 flex-1">
                        <div className="relative">
                          <input
                            type="checkbox"
                            checked={item.purchased}
                            onChange={() => togglePurchase(item.id)}
                            className="w-6 h-6 rounded border-gray-300 text-orange-500 focus:ring-orange-500 cursor-pointer"
                          />
                        </div>
                        {item.photo && (
                          <div
                            className="w-12 h-12 rounded overflow-hidden border border-gray-200 cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={() => setSelectedPhoto(item.photo)}
                          >
                            <img src={item.photo} alt={item.name} className="w-full h-full object-cover" />
                          </div>
                        )}
                        <div className={`flex-1 ${item.purchased ? 'opacity-50' : ''}`}>
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-xs px-2 py-0.5 rounded border ${priorityColors[item.priority]}`}>
                              優先度{priorityLabel[item.priority]}
                            </span>
                            <h4 className="font-bold text-gray-800">{item.name}</h4>
                          </div>
                          <div className="text-sm text-gray-500 flex gap-4">
                            <span>¥{item.price.toLocaleString()}</span>
                            {item.releaseDate && <span>発売: {item.releaseDate}</span>}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <button className="h-8 w-8 flex items-center justify-center text-orange-600" onClick={() => goEditGoods(item)}><Edit className="w-4 h-4" /></button>
                        <button onClick={() => deleteGoods(item.id)} className="h-8 w-8 flex items-center justify-center text-aqua-600">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </Card>
                  )
                })}
                {displayGoods.length === 0 && (
                  <div className="text-center py-8 text-gray-400 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                    条件に一致するグッズはありません
                  </div>
                )}
              </div>
            </div>
          )
        }

        {/* Events Section */}
        {
          oshiDetailActiveTab === 'events' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold flex items-center"><Ticket className="w-5 h-5 mr-2" /> イベントリスト</h3>
                <Button variant="orange" onClick={goAddEvent} size="sm"><Plus className="w-4 h-4 mr-1" /> イベント追加</Button>
              </div>

              <div className="space-y-3">
                {oshiEvents.length === 0 && (
                  <div className="text-center py-8 text-gray-400 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                    イベントは登録されていません
                  </div>
                )}
                {oshiEvents.sort((a, b) => new Date(a.date) - new Date(b.date)).map(event => (
                  <Card key={event.id} className={`p-4 transition-colors ${event.attended ? 'bg-gray-50' : 'bg-white'}`}>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full">{event.category}</span>
                          <h4 className="font-bold text-gray-800">{event.name}</h4>
                        </div>
                        <div className="flex items-center text-sm text-gray-600 mb-2">
                          <Calendar className="w-3 h-3 mr-1" /> {event.date}
                          <MapPin className="ml-3 w-3 h-3 mr-1" /> {event.location}
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center">
                            <span className="text-gray-500 mr-2">予算:</span>
                            <span className="font-medium">¥{event.budget.toLocaleString()}</span>
                          </div>
                          {event.attended && (
                            <div className="flex items-center">
                              <span className="text-gray-500 mr-2">実績:</span>
                              <span className={`font-bold ${event.actualCost > event.budget ? 'text-lavender-500' : 'text-lavender-600'}`}>
                                ¥{event.actualCost.toLocaleString()}
                              </span>
                              <span className="text-xs ml-1 text-gray-400">
                                ({event.actualCost > event.budget ? '+' : ''}{(event.actualCost - event.budget).toLocaleString()})
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <button
                          onClick={() => toggleEventAttendance(event.id)}
                          className={`text-xs px-3 py-1 rounded-full border transition-colors flex items-center ${event.attended ? 'bg-lavender-50 text-lavender-700 border-lavender-700' : 'bg-white text-gray-500 border-gray-300 hover:bg-gray-50'}`}
                        >
                          <Check className="w-3 h-3 mr-1" /> {event.attended ? '参加済' : '未参加'}
                        </button>
                        <div className="flex gap-1 mt-2">
                          <Button variant="normal" size="icon" className="h-8 w-8 text-orange-600 hover:text-orange-900" onClick={() => goEditEvent(event)}><Edit className="w-3 h-3" /></Button>
                          <Button variant="normal" size="icon" className="h-8 w-8 text-aqua-600 hover:text-aqua-900" onClick={() => deleteEvent(event.id)}><Trash2 className="w-3 h-3" /></Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )
        }

        {/* Collab Section */}
        {
          oshiDetailActiveTab === 'collab' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold flex items-center"><Ticket className="w-5 h-5 mr-2" /> コラボリスト</h3>
                <Button variant="orange" onClick={goAddCollab} size="sm"><Plus className="w-4 h-4 mr-1" /> コラボ追加</Button>
              </div>

              <div className="space-y-3">
                {oshiTokuten.length === 0 && (
                  <div className="text-center py-8 text-gray-400 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                    コラボ情報は登録されていません
                  </div>
                )}
                {oshiTokuten.sort((a, b) => new Date(a.date) - new Date(b.date)).map(collab => (
                  <Card key={collab.id} className={`p-4 transition-colors ${collab.attended ? 'bg-gray-50' : 'bg-white'}`}>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs px-2 py-0.5 bg-aqua-100 text-aqua-700 rounded-full">{collab.category}</span>
                          <h4 className="font-bold text-gray-800">{collab.name}</h4>
                        </div>
                        <div className="flex items-center text-sm text-gray-600 mb-2">
                          <Calendar className="w-3 h-3 mr-1" /> {collab.date}
                          <MapPin className="ml-3 w-3 h-3 mr-1" /> {collab.location}
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center">
                            <span className="text-gray-500 mr-2">予算:</span>
                            <span className="font-medium">¥{collab.budget.toLocaleString()}</span>
                          </div>
                          {collab.attended && (
                            <div className="flex items-center">
                              <span className="text-gray-500 mr-2">実績:</span>
                              <span className={`font-bold ${collab.actualCost > collab.budget ? 'text-orange-500' : 'text-orange-600'}`}>
                                ¥{collab.actualCost.toLocaleString()}
                              </span>
                              <span className="text-xs ml-1 text-gray-400">
                                ({collab.actualCost > collab.budget ? '+' : ''}{(collab.actualCost - collab.budget).toLocaleString()})
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <button
                          onClick={() => toggleEventAttendance(tokuten.id)}
                          className={`text-xs px-3 py-1 rounded-full border transition-colors flex items-center ${tokuten.attended ? 'bg-orange-50 text-orange-700 border-orange-200' : 'bg-white text-gray-500 border-gray-300 hover:bg-gray-50'}`}
                        >
                          <Check className="w-3 h-3 mr-1" /> {tokuten.attended ? '参加済' : '未参加'}
                        </button>
                        <div className="flex gap-1 mt-2">
                          <Button variant="normal" size="icon" className="h-8 w-8 text-orange-600 hover:text-orange-900" onClick={() => goEditEvent(event)}><Edit className="w-3 h-3" /></Button>
                          <Button variant="normal" size="icon" className="h-8 w-8 text-aqua-600 hover:text-aqua-900" onClick={() => deleteEvent(event.id)}><Trash2 className="w-3 h-3" /></Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )
        }

        {/* Trips Section */}
        {oshiDetailActiveTab === 'trips' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold flex items-center"><Map className="w-5 h-5 mr-2" /> 遠征プランリスト</h3>
              <Button variant="orange" onClick={() => goTripForm()} size="sm"><Plus className="w-4 h-4 mr-1" /> プラン作成</Button>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {oshiTrips.length === 0 && (
                <div className="text-center py-8 text-gray-400 bg-gray-50 rounded-lg border border-dashed border-gray-200 col-span-full">
                  遠征プランは登録されていません
                </div>
              )}
              {oshiTrips.sort((a, b) => new Date(a.date) - new Date(b.date)).map(trip => (
                <Card key={trip.id} className={`p-4 hover:border-orange-300 transition-colors ${trip.completed ? 'opacity-70 bg-gray-50' : ''}`}>
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-gray-500">{trip.date}</span>
                        {trip.completed && <span className="text-[10px] px-1.5 py-0.5 bg-aqua-100 text-aqua-700 rounded-full font-bold">完了</span>}
                      </div>
                      <h4 className="font-bold text-lg text-gray-800">{trip.name}</h4>
                    </div>
                    <Button variant="normal" size="sm" className="text-orange-600 font-bold" onClick={() => goTripDetail(trip.id)}>詳細を見る</Button>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center"><MapPin className="w-3.5 h-3.5 mr-1" />{trip.destinations.length}箇所</span>
                    <span className="flex items-center"><Coins className="w-3.5 h-3.5 mr-1" />¥{trip.totalBudget.toLocaleString()}</span>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Actions Section */}
        {oshiDetailActiveTab === 'actions' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-pink-500 flex items-center liquid-text"><Heart className="w-5 h-5 mr-2 text-pink-400 drop-shadow-sm" /> 推し語り記録</h3>
              <div className="flex gap-2">
                <Button onClick={performAnalysis} size="sm" variant="secondary" className="shadow-orange-200/50"><AlertCircle className="w-4 h-4 mr-1" /> AIで魅力を分析</Button>
                <Button onClick={goAddAction} size="sm" variant="primary" className="shadow-pink-200/50"><Plus className="w-4 h-4 mr-1" /> 行動を記録</Button>
              </div>
            </div>

            {/* Analysis History Mini List */}
            {oshiAnalyses.length > 0 && (
              <div className="bg-orange-50 p-3 rounded-lg border border-orange-100 mb-4">
                <h4 className="text-xs font-bold text-orange-700 mb-2 uppercase tracking-wider">過去の分析履歴</h4>
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {oshiAnalyses.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map(an => (
                    <button
                      key={an.id}
                      onClick={() => goAnalysisResult(an)}
                      className="whitespace-nowrap bg-white border border-orange-100 text-orange-500 px-3 py-1 rounded-full text-xs hover:bg-orange-100 transition-colors"
                    >
                      {an.date} の分析
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Visualizations */}
            {oshiActions.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <Card className="p-4 bg-white border-pink-100 h-full">
                  <h4 className="text-xs font-bold text-gray-500 mb-3 uppercase tracking-wider flex items-center">
                    <Heart className="w-3 h-3 mr-1 text-pink-400" /> 特徴タグクラウド
                  </h4>
                  <div className="flex flex-wrap gap-2 justify-center items-center h-[100px]">
                    {Array.from(new Set(oshiActions.flatMap(a => a.tags))).slice(0, 10).map((tag, idx) => {
                      const count = oshiActions.filter(a => a.tags.includes(tag)).length;
                      const size = Math.min(1.5, 0.8 + (count * 0.2));
                      return (
                        <span key={tag} className="bg-pink-50 text-pink-500 px-2 py-0.5 rounded border border-pink-100 font-bold" style={{ fontSize: `${size}rem` }}>
                          {tag}
                        </span>
                      );
                    })}
                  </div>
                </Card>
                <Card className="p-4 bg-white border-aqua-100 h-full">
                  <h4 className="text-xs font-bold text-gray-500 mb-3 uppercase tracking-wider flex items-center">
                    <Info className="w-3 h-3 mr-1 text-aqua-500" /> プラス・マイナス感情比率
                  </h4>
                  <div className="flex items-center justify-between h-[100px] px-4">
                    <div className="relative w-24 h-24 rounded-full border-4 border-aqua-200 overflow-hidden shadow-lg bg-white/90">
                      <div
                        className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-pink-500 to-pink-300 transition-all duration-1000 animate-liquid-ripple"
                        style={{ height: `${(oshiActions.filter(a => a.feeling === 'positive').length / oshiActions.length) * 100}%` }}
                      ></div>
                      <div
                        className="absolute top-0 left-0 w-full bg-gradient-to-b from-aqua-600 to-aqua-400 transition-all duration-1000"
                        style={{ height: `${(oshiActions.filter(a => a.feeling === 'negative').length / oshiActions.length) * 100}%`, top: 0 }}
                      ></div>
                      <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent pointer-events-none"></div>
                    </div>
                    <div className="flex flex-col gap-1 text-xs font-bold">
                      <div className="flex items-center text-pink-600">
                        <div className="w-2 h-2 bg-pink-400 rounded-full mr-1"></div>
                        プラス: {Math.round((oshiActions.filter(a => a.feeling === 'positive').length / oshiActions.length) * 100)}%
                      </div>
                      <div className="flex items-center text-aqua-600">
                        <div className="w-2 h-2 bg-aqua-500 rounded-full mr-1"></div>
                        マイナス: {Math.round((oshiActions.filter(a => a.feeling === 'negative').length / oshiActions.length) * 100)}%
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {/* Action Filters */}
            <div className="flex gap-2 mb-2 overflow-x-auto pb-1">
              <Select className="w-[120px] h-8 text-xs"
                options={[
                  { label: 'すべて', value: 'all' },
                  { label: '解釈一致', value: 'agree' },
                  { label: '不一致', value: 'disagree' },
                ]}
                value={actionsFilterStatus}
                onChange={(e) => setActionsFilterStatus(e.target.value)}
              />
            </div>

            <div className="space-y-4">
              {oshiActions.length === 0 && (
                <div className="text-center py-10 text-gray-400 border-2 border-dashed rounded-lg bg-gray-50">
                  推しの行動がまだ記録されていません。<br />「推し追加」ボタンから登録してください。
                </div>
              )}
              {oshiActions
                .filter(a => actionsFilterStatus === 'all' ? true : a.feeling === actionsFilterStatus)
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .map(action => (
                  <Card key={action.id} className={`p-4 border-l-4 ${action.feeling === 'agree' ? 'bg-pink-50 border-pink-400' : 'bg-aqua-50 border-aqua-400'}`}>
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-gray-500">{action.date}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold shadow-sm ${action.feeling === 'agree' ? 'bg-pink-500 text-white' : 'bg-aqua-500 text-white'}`}>
                          {action.feeling === 'agree' ? '解釈一致 💖' : '不一致 💙'}
                        </span>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="normal" size="icon" className="h-7 w-7 text-pink-500 hover:text-pink-800" onClick={() => goEditAction(action)}><Edit className="w-3 h-3" /></Button>
                        <Button variant="normal" size="icon" className="h-7 w-7 text-aqua-600 hover:text-aqua-900" onClick={() => deleteAction(action.id)}><Trash2 className="w-3 h-3" /></Button>
                      </div>
                    </div>
                    <div className="mb-3">
                      <h5 className="font-bold text-gray-800 leading-tight mb-1">{action.action}</h5>
                      <p className="text-xs text-gray-500 italic">@ {action.context}</p>
                    </div>
                    <div className="bg-white/50 p-2 rounded text-sm text-gray-700 mb-2">
                      {action.reason}
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {action.tags.map(tag => (
                        <span key={tag} className="text-[10px] px-1.5 py-0.5 bg-white/80 text-gray-600 rounded border border-gray-200">#{tag}</span>
                      ))}
                    </div>
                  </Card>
                ))}
            </div>
          </div >
        )
        }
      </div >
    );
  };

  const OshiForm = () => {
    const [formData, setFormData] = useState(editingItem || {
      name: '',
      genre: 'アイドル',
      monthlyBudget: 0
    });

    const handleSubmit = () => {
      if (!formData.name) return alert('名前を入力してください');
      saveOshi({
        ...formData,
        monthlyBudget: Number(formData.monthlyBudget)
      });
    };

    return (
      <div className="max-w-2xl mx-auto space-y-6 animate-ethereal-fade">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" onClick={() => setCurrentView('home')} className="rounded-full"><X className="w-5 h-5" /></Button>
          <h1 className="text-xl font-black liquid-text">{editingItem ? '推しを編集' : '推しを登録'}</h1>
        </div>
        <Card className="p-6 space-y-4">
          <div className="space-y-2">
            <Label>名前 <span className="text-orange-500">*</span></Label>
            <Input
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              placeholder="推しの名前"
            />
          </div>
          <div className="space-y-2">
            <Label>ジャンル</Label>
            <Select
              value={formData.genre}
              onChange={e => setFormData({ ...formData, genre: e.target.value })}
              options={[
                { label: 'アイドル', value: 'アイドル' },
                { label: '2次元', value: '2次元' },
                { label: 'Youtuber', value: 'Youtuber' },
                { label: '歌手', value: '歌手' },
                { label: '俳優', value: '俳優' },
                { label: 'その他', value: 'その他' },
              ]}
            />
          </div>
          <div className="space-y-2">
            <Label>月間予算 (円) <span className="text-orange-500">*</span></Label>
            <Input
              type="number"
              min="0"
              value={formData.monthlyBudget}
              onChange={e => setFormData({ ...formData, monthlyBudget: e.target.value })}
            />
          </div>
          <div className="pt-4 flex gap-3">
            <Button className="flex-1" variant="outline" onClick={() => setCurrentView('home')}>キャンセル</Button>
            <Button className="flex-1" onClick={handleSubmit}>保存する</Button>
          </div>
        </Card>
      </div>
    );
  };

  const GoodsForm = () => {
    const [formData, setFormData] = useState(editingItem || {
      name: '',
      price: '',
      releaseDate: '',
      priority: 'medium',
      memo: '',
      photo: null
    });

    const handleFileChange = (e) => {
      const file = e.target.files[0];
      if (!file) return;

      if (file.size > 5 * 1024 * 1024) {
        alert('画像サイズは5MB以下にしてください');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, photo: reader.result });
      };
      reader.readAsDataURL(file);
    };

    const [aiResult, setAiResult] = useState(null);
    const [isAiError, setIsAiError] = useState(false);

    const handleAiSuggest = async () => {
      const oshiActions = getOshiActions(selectedOshiId);
      if (oshiActions.length === 0) return;
      if (aiUsageCount >= 10) return alert('本日のAI相談回数制限（10回）に達しました。');

      setIsAiLoading(true);
      setAiResult(null);
      setIsAiError(false);

      try {
        const oshi = getOshi(selectedOshiId);
        const oshiBasicInfo = basicInfos.find(bi => bi.oshiId === selectedOshiId);
        const positiveActions = oshiActions.filter(a => a.feeling === 'positive');
        const negativeActions = oshiActions.filter(a => a.feeling === 'negative');

        let prompt = `あなたは推し活アドバイザーです。
ユーザーの推しに対する感情記録をもとに、今登録しようとしているグッズの優先度を提案してください。

【推しの名前】: ${oshi.name}
【推しの基本情報】
${oshiBasicInfo?.answers ? Object.entries(oshiBasicInfo.answers)
            .map(([key, value]) => `${key}: ${value}`)
            .join('\n') : '未登録'}

【プラス感情の記録（好きな点）】
${positiveActions.length > 0
            ? positiveActions.slice(-5).map(a => `・行動: ${a.action}\n  理由: ${a.reason}`).join('\n\n')
            : 'だ記録がありません'}

【マイナス感情の記録（苦手な点）】
${negativeActions.length > 0
            ? negativeActions.slice(-5).map(a => `・行動: ${a.action}\n  理由: ${a.reason}`).join('\n\n')
            : 'まだ記録がありません'}

【登録予定のグッズ】
グッズ名: ${formData.name || '未設定'}
価格: ${formData.price || 0}円
${formData.memo ? `メモ: ${formData.memo}` : ''}

【提案してほしいこと】
以下のJSON形式のみで答えてください：
{
  "priority": "high" | "medium" | "low",
  "reason": "150文字程度の具体的な理由",
  "score": 0から100の数値
}`;

        const content = formData.photo
          ? [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: "image/jpeg",
                data: formData.photo.split(',')[1]
              }
            },
            {
              type: "text",
              text: prompt + '\n\n画像のビジュアルも考慮して分析してください。'
            }
          ]
          : [{ type: "text", text: prompt }];

        const apiKey = localStorage.getItem('anthropic_api_key') || 'YOUR_API_KEY_HERE';
        const response = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": apiKey,
            "anthropic-version": "2023-06-01",
            "anthropic-dangerously-allow-browser": "true"
          },
          body: JSON.stringify({
            model: "claude-3-sonnet-20240229",
            max_tokens: 1000,
            messages: [{ role: 'user', content }]
          })
        });

        if (!response.ok) {
          const errorInfo = handleApiError(new Error(`HTTP ${response.status}`), response);
          throw new Error(errorInfo.message);
        }

        const data = await response.json();
        const text = data.content[0].text;

        // Use robust JSON parser
        const result = parseAiJsonResponse(text);
        setAiResult(result);
        setAiUsageCount(prev => prev + 1);
      } catch (error) {
        console.error('AI Recommendation Error:', error);
        setIsAiError(true);
        alert('AI分析に失敗しました:\n' + error.message);
      } finally {
        setIsAiLoading(false);
      }
    };

    const useSuggestedPriority = () => {
      if (aiResult) {
        setFormData({ ...formData, priority: aiResult.priority });
        setAiResult(null);
      }
    };

    const handleSubmit = () => {
      if (!formData.name) return alert('グッズ名を入力してください');
      if (!formData.price) return alert('価格を入力してください');

      saveGoods({
        ...formData,
        price: Number(formData.price)
      });
    };

    return (
      <div className="max-w-md mx-auto space-y-6 animate-ethereal-fade" >
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" onClick={() => setCurrentView('oshi-detail')} className="rounded-full"><X className="w-5 h-5" /></Button>
          <h1 className="text-xl font-black liquid-text">{editingItem ? 'グッズを編集' : 'グッズを登録'}</h1>
        </div>
        <Card className="p-6 space-y-4">
          <div className="space-y-2">
            <Label>グッズ名 <span className="text-red-500">*</span></Label>
            <Input
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              placeholder="アクスタ、ペンライトなど"
            />
          </div>
          <div className="space-y-2">
            <Label>価格 (円) <span className="text-red-500">*</span></Label>
            <Input
              type="number"
              min="0"
              value={formData.price}
              onChange={e => setFormData({ ...formData, price: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>発売日 (任意)</Label>
            <Input
              type="date"
              value={formData.releaseDate}
              onChange={e => setFormData({ ...formData, releaseDate: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>優先度</Label>
            <Select
              value={formData.priority}
              onChange={e => setFormData({ ...formData, priority: e.target.value })}
              options={[
                { label: '高 (絶対欲しい)', value: 'high' },
                { label: '中 (予算があれば)', value: 'medium' },
                { label: '低 (様子見)', value: 'low' },
              ]}
            />
            <Button
              variant="secondary"
              size="sm"
              className="w-full mt-1 bg-orange-50 text-orange-500 hover:bg-orange-100 border-orange-100 text-xs py-1 h-8"
              onClick={handleAiSuggest}
              disabled={isAiLoading || getOshiActions(selectedOshiId).length === 0}
            >
              {isAiLoading ? (
                <span className="flex items-center">
                  <span className="w-3 h-3 border-2 border-orange-400 border-t-transparent rounded-full animate-spin mr-2"></span>
                  分析中...
                </span>
              ) : (
                <><Sparkles className="w-3 h-3 mr-2" /> AIに優先度を相談する</>
              )}
            </Button>
            {getOshiActions(selectedOshiId).length === 0 && (
              <p className="text-[10px] text-gray-400 mt-1 flex items-center"><AlertCircle className="w-3 h-3 mr-1 text-orange-400" /> 推し語りで感情記録を追加すると、より精度の高い提案ができます</p>
            )}

            {isAiError && (
              <div className="mt-2 p-2 bg-red-50 border border-red-100 rounded text-xs text-red-600 flex items-center">
                <AlertCircle className="w-3 h-3 mr-2" /> 分析できませんでした。後でもう一度お試しください
              </div>
            )}

            {aiResult && (
              <div className="mt-3 p-3 bg-orange-50 border border-orange-100 rounded-lg animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-orange-500 uppercase tracking-wider">AI Suggestion</span>
                  <span className="text-[10px] px-2 py-0.5 bg-white text-orange-500 rounded-full border border-orange-100 font-bold">
                    一致度: {aiResult.score}%
                  </span>
                </div>
                <div className="text-xs font-bold text-gray-800 mb-1">
                  推奨優先度: <span className={aiResult.priority === 'high' ? 'text-pink-400' : (aiResult.priority === 'low' ? 'text-aqua-500' : 'text-orange-500')}>
                    {aiResult.priority === 'high' ? '高 (絶対欲しい)' : (aiResult.priority === 'low' ? '低 (様子見)' : '中 (予算があれば)')}
                  </span>
                </div>
                <p className="text-[11px] text-gray-600 leading-relaxed italic mb-3">
                  「{aiResult.reason}」
                </p>
                <div className="flex gap-2">
                  <Button size="sm" className="flex-1 text-[10px] h-7 bg-orange-500" onClick={useSuggestedPriority}>この優先度を使う</Button>
                  <Button size="sm" variant="outline" className="flex-1 text-[10px] h-7" onClick={() => setAiResult(null)}>自分で決める</Button>
                </div>
              </div>
            )}
          </div>
          <div className="space-y-2">
            <Label>メモ</Label>
            <Textarea
              value={formData.memo}
              onChange={e => setFormData({ ...formData, memo: e.target.value })}
              placeholder="特典情報や購入場所など"
            />
          </div>
          <div className="space-y-2">
            <Label>グッズの写真 (任意)</Label>
            <div className="flex flex-col gap-4">
              {formData.photo && (
                <div className="relative w-full aspect-square max-h-48 rounded-lg overflow-hidden border border-gray-200">
                  <img src={formData.photo} alt="Preview" className="w-full h-full object-cover" />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-8 w-8 rounded-full"
                    onClick={() => setFormData({ ...formData, photo: null })}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              )}
              <Input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="cursor-pointer"
              />
              <p className="text-[10px] text-gray-400">※最大5MBまで。Base64形式で保存されます。</p>
            </div>
          </div>
          <div className="pt-4 flex gap-3">
            <Button className="flex-1" variant="outline" onClick={() => setCurrentView('oshi-detail')}>キャンセル</Button>
            <Button className="flex-1" onClick={handleSubmit}>保存する</Button>
          </div>
        </Card>
      </div>
    );
  };

  const EventForm = () => {
    const [formData, setFormData] = useState(editingItem || {
      name: '',
      date: '',
      location: '',
      budget: '',
      category: 'ライブ',
      memo: '',
      actualCost: 0
    });

    const handleSubmit = () => {
      if (!formData.name) return alert('イベント名を入力してください');
      if (!formData.date) return alert('日時を入力してください');

      saveEvent({
        ...formData,
        budget: Number(formData.budget),
        actualCost: Number(formData.actualCost)
      });
    };

    return (
      <div className="max-w-md mx-auto space-y-6 animate-ethereal-fade">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" onClick={() => setCurrentView('oshi-detail')} className="rounded-full"><X className="w-5 h-5" /></Button>
          <h1 className="text-xl font-black liquid-text">{editingItem ? 'イベントを編集' : 'イベントを登録'}</h1>
        </div>
        <Card className="p-6 space-y-4">
          <div className="space-y-2">
            <Label>イベント名 <span className="text-red-500">*</span></Label>
            <Input
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              placeholder="ライブ、イベント名"
            />
          </div>
          <div className="space-y-2">
            <Label>日時 <span className="text-red-500">*</span></Label>
            <Input
              type="date"
              value={formData.date}
              onChange={e => setFormData({ ...formData, date: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>場所</Label>
            <Input
              value={formData.location}
              onChange={e => setFormData({ ...formData, location: e.target.value })}
              placeholder="会場名など"
            />
          </div>
          <div className="space-y-2">
            <Label>カテゴリ</Label>
            <Select
              value={formData.category}
              onChange={e => setFormData({ ...formData, category: e.target.value })}
              options={[
                { label: 'ライブ', value: 'ライブ' },
                { label: 'サイン会', value: 'サイン会' },
                { label: '展示会', value: '展示会' },
                { label: 'コラボカフェ', value: 'コラボカフェ' },
                { label: 'その他', value: 'その他' },
              ]}
            />
          </div>
          <div className="space-y-2">
            <Label>予算 (円)</Label>
            <Input
              type="number"
              min="0"
              value={formData.budget}
              onChange={e => setFormData({ ...formData, budget: e.target.value })}
            />
          </div>
          {editingItem && editingItem.attended && (
            <div className="space-y-2 bg-gray-50 p-2 rounded">
              <Label>実際の費用 (円)</Label>
              <Input
                type="number"
                min="0"
                value={formData.actualCost}
                onChange={e => setFormData({ ...formData, actualCost: e.target.value })}
              />
            </div>
          )}
          <div className="space-y-2">
            <Label>メモ</Label>
            <Textarea
              value={formData.memo}
              onChange={e => setFormData({ ...formData, memo: e.target.value })}
              placeholder="持ち物や注意事項など"
            />
          </div>
          <div className="pt-4 flex gap-3">
            <Button className="flex-1" variant="outline" onClick={() => setCurrentView('oshi-detail')}>キャンセル</Button>
            <Button className="flex-1" onClick={handleSubmit}>保存する</Button>
          </div>
        </Card>
      </div>
    );
  };

  const TripForm = () => {
    const [formData, setFormData] = useState(editingItem || {
      name: '',
      date: '',
      totalBudget: '',
      destinations: [
        { id: '1', name: '', address: '', arrivalTime: '', purpose: 'イベント', memo: '', surroundingInfo: '', travelTime: '', transportFee: 0 }
      ]
    });

    const updateTripValue = (key, val) => setFormData({ ...formData, [key]: val });

    const updateDest = (id, key, val) => {
      setFormData({
        ...formData,
        destinations: formData.destinations.map(d => d.id === id ? { ...d, [key]: val } : d)
      });
    };

    const addDest = () => {
      const newId = Date.now().toString();
      setFormData({
        ...formData,
        destinations: [...formData.destinations, { id: newId, name: '', address: '', arrivalTime: '', purpose: 'イベント', memo: '', surroundingInfo: '', travelTime: '', transportFee: 0 }]
      });
    };

    const removeDest = (id) => {
      if (formData.destinations.length <= 1) return;
      setFormData({
        ...formData,
        destinations: formData.destinations.filter(d => d.id !== id)
      });
    };

    const moveDest = (index, direction) => {
      const newDests = [...formData.destinations];
      const target = index + direction;
      if (target < 0 || target >= newDests.length) return;
      [newDests[index], newDests[target]] = [newDests[target], newDests[index]];
      setFormData({ ...formData, destinations: newDests });
    };

    const handleSubmit = () => {
      if (!formData.name) return alert('プラン名を入力してください');
      if (!formData.date) return alert('日付を入力してください');

      const transCost = formData.destinations.reduce((sum, d) => sum + (Number(d.transportFee) || 0), 0);

      saveTrip({
        ...formData,
        totalBudget: Number(formData.totalBudget) || 0,
        transportationCost: transCost
      });
    };

    return (
      <div className="max-w-2xl mx-auto space-y-6 pb-20 animate-ethereal-fade">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" onClick={() => setCurrentView('oshi-detail')} className="rounded-full"><X className="w-5 h-5" /></Button>
          <h1 className="text-xl font-black liquid-text">{editingItem ? '遠征プランを編集' : '遠征プランを作成'}</h1>
        </div>

        <Card className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>プラン名 <span className="text-red-500">*</span></Label>
              <Input value={formData.name} onChange={e => updateTripValue('name', e.target.value)} placeholder="例：東京遠征、〇〇ライブ遠征" />
            </div>
            <div className="space-y-2">
              <Label>日付 <span className="text-red-500">*</span></Label>
              <Input type="date" value={formData.date} onChange={e => updateTripValue('date', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>総予算 (交通費込・任意)</Label>
              <Input type="number" value={formData.totalBudget} onChange={e => updateTripValue('totalBudget', e.target.value)} placeholder="50000" />
            </div>
          </div>
        </Card>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold flex items-center"><Navigation className="w-5 h-5 mr-2" /> 目的地設定</h2>
          </div>

          {formData.destinations.map((dest, idx) => (
            <Card key={dest.id} className="p-4 relative border-l-4 border-l-orange-500">
              <div className="absolute right-2 top-2 flex gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => moveDest(idx, -1)} disabled={idx === 0}><ChevronUp className="w-4 h-4" /></Button>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => moveDest(idx, 1)} disabled={idx === formData.destinations.length - 1}><ChevronDown className="w-4 h-4" /></Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500" onClick={() => removeDest(dest.id)}><Trash2 className="w-4 h-4" /></Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                <div className="space-y-2 col-span-full md:col-span-1">
                  <Label>場所名 <span className="text-red-500">*</span></Label>
                  <Input value={dest.name} onChange={e => updateDest(dest.id, 'name', e.target.value)} placeholder="会場名、駅名など" />
                </div>
                <div className="space-y-2">
                  <Label>到着予定時刻</Label>
                  <Input type="time" value={dest.arrivalTime} onChange={e => updateDest(dest.id, 'arrivalTime', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>目的</Label>
                  <Select
                    value={dest.purpose}
                    onChange={e => updateDest(dest.id, 'purpose', e.target.value)}
                    options={[
                      { label: 'イベント', value: 'イベント' },
                      { label: '店舗特典', value: '店舗特典' },
                      { label: '集合', value: '集合' },
                      { label: '宿泊', value: '宿泊' },
                      { label: '観光', value: '観光' },
                      { label: 'その他', value: 'その他' },
                    ]}
                  />
                </div>
                <div className="space-y-2">
                  <Label>交通手段・時間</Label>
                  <Input value={dest.travelTime} onChange={e => updateDest(dest.id, 'travelTime', e.target.value)} placeholder="例：電車30分" />
                </div>
                <div className="space-y-2">
                  <Label>交通費 (円)</Label>
                  <Input type="number" value={dest.transportFee} onChange={e => updateDest(dest.id, 'transportFee', e.target.value)} />
                </div>
                <div className="col-span-full space-y-2">
                  <Label>メモ・周辺情報</Label>
                  <Textarea value={dest.memo} onChange={e => updateDest(dest.id, 'memo', e.target.value)} placeholder="持ち物、待ち時間の過ごし方など" />
                </div>
              </div>
            </Card>
          ))}

          <Button variant="outline" className="w-full border-dashed py-6" onClick={addDest}>
            <Plus className="w-4 h-4 mr-2" /> 目的地を追加
          </Button>
        </div>

        <div className="flex gap-4">
          <Button variant="outline" className="flex-1" onClick={() => setCurrentView('oshi-detail')}>キャンセル</Button>
          <Button className="flex-1" onClick={handleSubmit}>プランを保存</Button>
        </div>
      </div>
    );
  };

  const TripDetailView = () => {
    const trip = getTrip(selectedTripId);
    if (!trip) return <div>Trip not found</div>;

    const totalTrans = trip.destinations.reduce((sum, d) => sum + (Number(d.transportFee) || 0), 0);

    return (
      <div className="max-w-2xl mx-auto space-y-6 pb-20 animate-ethereal-fade">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button variant="normal" size="icon" onClick={() => setCurrentView('oshi-detail')}><ArrowLeft className="w-5 h-5 text-gray-400 hover:text-gray-600 hover:bg-gray-200/70 rounded-lg transition-colors" /></Button>
            <h1 className="text-xl font-bold text-orange-600">{trip.name}</h1>
          </div>
          <div className="flex gap-2">
            <Button variant="orange" size="sm" onClick={() => goTripForm(trip)}><Edit className="w-4 h-4" /></Button>
            <Button variant="aqua" size="sm" onClick={() => deleteTrip(trip.id)}><Trash2 className="w-4 h-4" /></Button>
          </div>
        </div>

        <Card className="p-4 bg-gradient-to-r from-orange-50 to-white border-orange-100 flex justify-between items-center">
          <div>
            <p className="text-xs text-gray-500 mb-1">遠征日: {trip.date}</p>
            <p className="text-sm font-bold text-orange-600 bg-white px-2 py-0.5 rounded border border-orange-100 inline-block">総予算: ¥{trip.totalBudget.toLocaleString()}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400">合計交通費</p>
            <p className="text-lg font-bold text-aqua-600 bg-aqua-50 px-3 py-1 rounded-full border border-aqua-100">¥{totalTrans.toLocaleString()}</p>
          </div>
        </Card>

        {/* Timeline View */}
        <div className="space-y-0 px-2 relative">
          <div className="absolute left-7 top-4 bottom-4 w-0.5 bg-gray-200 z-0"></div>

          {trip.destinations.map((dest, idx) => {
            const nextDest = trip.destinations[idx + 1];
            const hasGap = dest.arrivalTime && nextDest && nextDest.arrivalTime;
            let gapMinutes = 0;

            if (hasGap) {
              const [h1, m1] = dest.arrivalTime.split(':').map(Number);
              const [h2, m2] = nextDest.arrivalTime.split(':').map(Number);
              gapMinutes = (h2 * 60 + m2) - (h1 * 60 + m1);
            }

            return (
              <React.Fragment key={dest.id}>
                <div className="relative z-10 flex items-start gap-4 mb-4">
                  <div className="w-10 h-10 rounded-full bg-orange-400 text-white flex items-center justify-center font-bold shadow-md shrink-0">
                    {idx + 1}
                  </div>
                  <Card className="flex-1 p-4 shadow-sm border-gray-100">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center text-orange-400 font-bold">
                        <Clock className="w-4 h-4 mr-1" /> {dest.arrivalTime || '--:--'}
                      </div>
                      <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">{dest.purpose}</span>
                    </div>
                    <h4 className="font-bold text-lg mb-1">{dest.name}</h4>
                    {dest.address && <p className="text-xs text-gray-500 mb-2 flex items-center"><MapPin className="w-3 h-3 mr-1" /> {dest.address}</p>}

                    {dest.memo && (
                      <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 mt-2 flex items-start">
                        <Info className="w-4 h-4 mr-2 text-gray-400 shrink-0 mt-0.5" />
                        <div>{dest.memo}</div>
                      </div>
                    )}
                  </Card>
                </div>

                {nextDest && (
                  <div className="relative z-10 pl-4 py-4 flex flex-col items-center ml-[20px] mb-4">
                    <div className="bg-aqua-50 text-aqua-700 px-3 py-1 rounded-md text-xs font-bold border border-aqua-100 flex items-center mb-2">
                      <Navigation className="w-3 h-3 mr-1" /> {dest.travelTime || '移動'} (¥{dest.transportFee || 0})
                    </div>
                    <ArrowDown className="w-6 h-6 text-gray-300" />

                    {gapMinutes > 60 && (
                      <div className="mt-2 bg-yellow-50 text-yellow-800 p-2 rounded-md text-xs border border-yellow-100 flex items-center">
                        <Clock className="w-3 h-3 mr-1" /> {Math.floor(gapMinutes / 60)}時間{gapMinutes % 60}分の空き時間があります。周辺情報をチェック！
                      </div>
                    )}
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        <div className="pt-4">
          <Button
            variant="normal"
            className={`w-full rounded-xl transition-all duration-300 ${trip.completed
              ? 'bg-orange-100 text-orange-500'
              : 'bg-gradient-to-r from-orange-400 to-orange-500 text-white shadow-[0_6px_18px_rgba(255,140,0,0.35)] hover:shadow-[0_8px_22px_rgba(255,140,0,0.45)]'
              }`}
            onClick={() => toggleTripCompletion(trip.id)}
          >
            {trip.completed ? '完了済みを取り消す' : 'この遠征を完了済みにする'}
          </Button>
        </div>
      </div>
    );
  };

  const OshiGotariSelectView = () => {
    const [showSimpleForm, setShowSimpleForm] = useState(false);
    const [newName, setNewName] = useState('');
    const [newGenre, setNewGenre] = useState('');

    const handleSimpleAdd = () => {
      if (!newName) return alert('名前を入力してください');
      const newOshi = {
        id: `oshi_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: newName,
        genre: newGenre || '未設定',
        monthlyBudget: 0,
        spent: 0,
        createdAt: new Date().toISOString()
      };
      setOshis([...oshis, newOshi]);
      goOshigotariMain(newOshi.id);
    };

    return (
      <div className="max-w-4xl mx-auto space-y-8 animate-ethereal-fade">
        <header className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button variant="normal" size="icon" onClick={() => setCurrentView('home')}><ArrowLeft className="w-5 h-5 text-gray-400 hover:text-gray-600 hover:bg-gray-200/70 rounded-lg transition-colors" /></Button>
            <h1 className="text-2xl font-bold text-pink-600">推し語り選択</h1>
          </div>
          <Button onClick={goManagementDashboard} size="sm" variant="plain" className="border-orange-500 text-orange-600"><Coins className="w-4 h-4 mr-2 text-orange-600" /> 管理画面へ</Button>
        </header>

        <div className="text-center space-y-2">
          <h2 className="text-xl font-bold text-gray-700">どの推しについて語りますか？</h2>
          <p className="text-gray-500 italic">あなたの「好き」を深掘りしましょう。</p>
        </div>

        {oshis.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {oshis.map(oshi => (
              <Card
                key={oshi.id}
                className="p-6 cursor-pointer hover:border-pink-400 hover:shadow-md transition-all group"
                onClick={() => goOshigotariMain(oshi.id)}
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-400 to-pink-400 flex items-center justify-center group-hover:from-pink-200 group-hover:to-pink-200 transition-colors animate-floating">
                    <Heart className="w-10 h-10 text-pink-400 group-hover:scale-110 transition-transform" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{oshi.name}</h3>
                    <p className="text-sm text-gray-500">{oshi.genre}</p>
                  </div>
                </div>
              </Card>
            ))}
            <Card
              className="p-6 flex flex-col items-center justify-center border-dashed border-2 text-gray-400 hover:text-pink-400 hover:border-pink-300 transition-colors cursor-pointer"
              onClick={() => setShowSimpleForm(true)}
            >
              <Plus className="w-10 h-10 mb-2" />
              <p className="font-bold">新しい推しを追加</p>
            </Card>
          </div>
        ) : (
          <div className="text-center space-y-6 py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-gray-600">まだ推しが登録されていません</h3>
              <p className="text-gray-400">まず推しを登録して、語り始めましょう！</p>
            </div>
            {!showSimpleForm ? (
              <Button onClick={() => setShowSimpleForm(true)} className="bg-gradient-to-r from-pink-400 to-pink-400 border-none px-8 py-6 text-lg">
                推しを登録する
              </Button>
            ) : null}
          </div>
        )}

        {showSimpleForm && (
          <Card className="p-6 max-w-md mx-auto shadow-xl border-pink-100 animate-ethereal-fade">
            <h3 className="text-lg font-bold mb-4 flex items-center"><Plus className="w-5 h-5 mr-2 text-pink-500" /> かんたん推し登録</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>名前 <span className="text-red-500">*</span></Label>
                <Input value={newName} onChange={e => setNewName(e.target.value)} placeholder="推しの名前" />
              </div>
              <div className="space-y-2">
                <Label>ジャンル</Label>
                <Input value={newGenre} onChange={e => setNewGenre(e.target.value)} placeholder="例：アイドル、アニメ、俳優" />
              </div>
              <div className="flex gap-2 pt-2">
                <Button variant="ghost" className="flex-1" onClick={() => setShowSimpleForm(false)}>キャンセル</Button>
                <Button className="flex-1 bg-pink-500 hover:bg-pink-500" onClick={handleSimpleAdd}>登録して語る</Button>
              </div>
            </div>
          </Card>
        )}
      </div>
    );
  };

  const OshiGotariMainView = () => {
    const oshi = getOshi(selectedOshiId);
    const basicInfo = basicInfos.find(bi => bi.oshiId === selectedOshiId);
    const oshiActions = getOshiActions(selectedOshiId);

    if (!oshi) return <div>Data not found</div>;

    const ActionTabContent = () => (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold flex items-center"><Heart className="w-5 h-5 mr-2 text-pink-500" /> 感情記録</h3>
          <Button variant="pink" size="sm" onClick={goAddAction}><Plus className="w-4 h-4 mr-1" /> 感情を記録</Button>
        </div>

        {/* Action Filters */}
        <div className="flex gap-2 mb-2 overflow-x-auto pb-1">
          <Select className="w-[150px] h-8 text-xs"
            options={[
              { label: 'すべて', value: 'all' },
              { label: 'プラス感情のみ', value: 'positive' },
              { label: 'マイナス感情のみ', value: 'negative' },
            ]}
            value={actionsFilterStatus}
            onChange={(e) => setActionsFilterStatus(e.target.value)}
          />
        </div>

        <div className="space-y-4">
          {oshiActions.length === 0 && (
            <div className="text-center py-10 text-gray-400 border-2 border-dashed rounded-lg bg-gray-50">
              まだ記録がありません。
            </div>
          )}
          {oshiActions
            .filter(a => actionsFilterStatus === 'all' ? true : a.feeling === actionsFilterStatus)
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .map(action => (
              <Card key={action.id} className={`p-4 border-l-4 ${action.feeling === 'positive' ? 'border-pink-400 bg-pink-50' : 'border-aqua-400 bg-aqua-50'}`}>
                <div className="flex justify-between items-start mb-2">
                  <span className="text-sm font-bold text-gray-500">{action.date}</span>
                  <div className="flex gap-1">
                    <Button variant="normal" size="icon" className="h-7 w-7 text-pink-500 hover:text-pink-800" onClick={() => goEditAction(action)}><Edit className="w-3 h-3" /></Button>
                    <Button variant="normal" size="icon" className="h-7 w-7 text-aqua-600 hover:text-aqua-900" onClick={() => deleteAction(action.id)}><Trash2 className="w-3 h-3" /></Button>
                  </div>
                </div>
                <h5 className="font-bold text-gray-800 mb-1">{action.action}</h5>
                <p className="text-xs text-gray-500 mb-2 italic">@ {action.context}</p>
                <div className="bg-white/50 p-2 rounded text-sm text-gray-700">{action.reason}</div>
              </Card>
            ))}
        </div>
      </div>
    );

    return (
      <div className="space-y-6 animate-ethereal-fade">
        <header className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Button variant="normal" size="icon" onClick={() => setCurrentView('oshigotari-select')} className="rounded-full"><ArrowLeft className="w-5 h-5 text-gray-400 hover:text-gray-600 hover:bg-gray-200/70 rounded-lg transition-colors" /></Button>
            <h1 className="text-2xl font-black text-pink-600">{oshi.name} を語る</h1>
          </div>
          <Button onClick={goManagementDashboard} size="sm" variant="plain" className="border-orange-500 text-orange-600"><Coins className="w-4 h-4 mr-2 text-orange-600" /> 管理画面へ</Button>
        </header>

        <Card className="p-4 bg-gradient-to-r from-pink-200 border-pink-100 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-xl shadow-sm">✨</div>
            <div>
              <p className="text-xs text-pink-500 font-bold uppercase tracking-wider">Now Reviewing</p>
              <h2 className="text-xl font-bold text-gray-800">{oshi.name}</h2>
            </div>
          </div>
          <p className="text-sm text-gray-500 italic hidden md:block">「好き」を言葉にして、魅力を再発見しましょう。</p>
        </Card>

        {/* Tabs */}
        <Tabs>
          <TabsList className="grid w-full grid-cols-3 mb-6 bg-pink-50 p-1 rounded-xl">
            <TabsTrigger value="basic" activeValue={oshigotariMainActiveTab} onClick={() => setOshigotariMainActiveTab('basic')} className={`py-2 rounded-lg transition-all ${oshigotariMainActiveTab === 'basic' ? 'bg-white text-pink-500 shadow-sm' : 'text-pink-400 hover:text-pink-500'}`}>
              <Info className="w-4 h-4 mr-2" /> 基本情報
            </TabsTrigger>
            <TabsTrigger value="actions" activeValue={oshigotariMainActiveTab} onClick={() => setOshigotariMainActiveTab('actions')} className={`py-2 rounded-lg transition-all ${oshigotariMainActiveTab === 'actions' ? 'bg-white text-pink-600 shadow-sm' : 'text-pink-400 hover:text-pink-500'}`}>
              <Heart className="w-4 h-4 mr-2" /> 感情記録
            </TabsTrigger>
            <TabsTrigger value="analysis" activeValue={oshigotariMainActiveTab} onClick={() => setOshigotariMainActiveTab('analysis')} className={`py-2 rounded-lg transition-all ${oshigotariMainActiveTab === 'analysis' ? 'bg-white text-aqua-600 shadow-sm' : 'text-aqua-400 hover:text-aqua-500'}`}>
              <AlertCircle className="w-4 h-4 mr-2" /> AI分析
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Tab Content */}
        <div className="min-h-[400px]">
          {oshigotariMainActiveTab === 'basic' && (
            <div className="bg-white p-6 rounded-2xl border border-pink-100 shadow-sm">
              <h3 className="text-lg font-bold text-pink-700 mb-6 flex items-center"><Check className="w-5 h-5 mr-2" /> 一問一答データ</h3>
              {basicInfo ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-sm font-bold text-gray-400 mb-1">Q1: 推しの名前は？</h4>
                      <p className="text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-100">{basicInfo.answers.q1_name}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-400 mb-1">Q2: 推しは何をしている人？</h4>
                      <p className="text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-100">{basicInfo.answers.q2_activity}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-400 mb-1">Q3: 推しの誕生日は？</h4>
                      <p className="text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-100">{basicInfo.answers.q3_birthday}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-400 mb-1">Q4: 推しの外見的特徴は？</h4>
                      <p className="text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-100">{basicInfo.answers.q4_visual}</p>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full border-dashed border-pink-100 text-pink-500 font-bold py-8 rounded-xl hover:bg-pink-50" onClick={() => goBasicInfoForm(oshi.id)}>一問一答を編集・追加する</Button>
                </div>
              ) : (
                <div className="text-center py-12 space-y-6">
                  <p className="text-gray-500 leading-relaxed">まだ基本情報が入力されていません。<br />まずは一問一答で推しの解像度を上げましょう！</p>
                  <Button onClick={() => goBasicInfoForm(oshi.id)} className="bg-pink-500 hover:bg-pink-600 px-8 py-6 rounded-xl text-lg font-bold shadow-lg shadow-pink-100">
                    一問一答を始める
                  </Button>
                </div>
              )}
            </div>
          )}

          {oshigotariMainActiveTab === 'actions' && <ActionTabContent />}

          {oshigotariMainActiveTab === 'analysis' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold flex items-center text-aqua-600"><AlertCircle className="w-5 h-5 mr-2" /> AI分析結果</h3>
                <Button onClick={performAnalysis} size="sm" variant="aqua">再分析する</Button>
              </div>
              <div className="bg-aqua-50 p-8 rounded-2xl border border-aqua-100 text-center">
                <p className="text-aqua-400">一問一答と行動記録に基づいてAIがあなたの「好き」を言語化します。</p>

                {/* ここに過去ログを表示したい */}

                <Button variant="plain" onClick={performAnalysis} className="mt-4 bg-white text-aqua-500 border border-aqua-400 font-bold text-base md:text-lg py-5 rounded-xl shadow-md hover:shadow-lg whitespase-nowrap">分析を開始する</Button>
              </div>
            </div>
          )}
        </div>
      </div >
    );
  };

  const ActionForm = () => {
    const [formData, setFormData] = useState(editingItem || {
      date: new Date().toISOString().split('T')[0],
      action: '',
      context: '',
      feeling: 'positive',
      reason: '',
      tags: []
    });

    const presetTags = ['優しい', '面白い', 'かっこいい', '頼もしい', '繊細', '努力家', '天然', 'ツンデレ'];

    const handleSubmit = () => {
      if (!formData.action) return alert('行動・発言を入力してください');
      saveAction(formData);
    };
    const toggleTag = (tag) => {
      if (formData.tags.includes(tag)) {
        setFormData({ ...formData, tags: formData.tags.filter(t => t !== tag) });
      } else {
        setFormData({ ...formData, tags: [...formData.tags, tag] });
      }
    };

    return (
      <div className="max-w-md mx-auto space-y-6 animate-ethereal-fade">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" onClick={() => setCurrentView('oshi-detail')}><X className="w-5 h-5" /></Button>
          <h1 className="text-xl font-bold">{editingItem ? '感情記録を編集' : '新しい感情を記録'}</h1>
        </div>
        <Card className="p-6 space-y-4">
          <div className="space-y-2">
            <Label>日付 <span className="text-red-500">*</span></Label>
            <Input type="date" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>具体的に何があったか <span className="text-red-500">*</span></Label>
            <Textarea
              value={formData.action}
              onChange={e => setFormData({ ...formData, action: e.target.value })}
              placeholder="推しの行動や発言など"
            />
          </div>
          <div className="space-y-2">
            <Label>状況・背景</Label>
            <Textarea
              value={formData.context}
              onChange={e => setFormData({ ...formData, context: e.target.value })}
              placeholder="ライブ中、SNSでの発言など"
            />
          </div>
          <div className="space-y-2">
            <Label>今の気持ち <span className="text-red-500">*</span></Label>
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-pink-50 transition-colors">
                <input type="radio" checked={formData.feeling === 'positive'} onChange={() => setFormData({ ...formData, feeling: 'positive' })} className="text-pink-400 focus:ring-pink-400" />
                <span className="text-sm">プラス感情（好き・嬉しい・素敵） 💖</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-aqua-50 transition-colors">
                <input type="radio" checked={formData.feeling === 'negative'} onChange={() => setFormData({ ...formData, feeling: 'negative' })} className="text-aqua-500 focus:ring-aqua-500" />
                <span className="text-sm">マイナス感情（苦手・違和感・残念） 💙</span>
              </label>
            </div>
          </div>
          <div className="pt-4 flex gap-3">
            <Button className="flex-1" variant="outline" onClick={() => setCurrentView('oshigotari-main')}>キャンセル</Button>
            <Button className="flex-1" onClick={() => {
              if (!formData.action) return alert('行動・発言を入力してください');
              setEditingItem(formData);
              setCurrentView('chat-session');
            }}>AIと対話する</Button>
          </div>
        </Card>
      </div>
    );
  };

  const ChatSessionView = () => {
    const oshi = getOshi(selectedOshiId);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = React.useRef(null);

    const callClaudeAPI = async (systemPrompt, messages) => {
      const apiKey = localStorage.getItem('anthropic_api_key') || 'YOUR_API_KEY_HERE';
      if (apiKey === 'YOUR_API_KEY_HERE') {
        throw new Error('APIキーが設定されていません。ブラウザのコンソールで localStorage.setItem("anthropic_api_key", "あなたのキー") を実行してください。');
      }

      console.log('--- AI API Call ---');
      console.log('Messages Count:', messages.length);
      console.log('System Prompt Snippet:', systemPrompt.substring(0, 100) + '...');

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerously-allow-browser": "true"
        },
        body: JSON.stringify({
          model: "claude-3-sonnet-20240229", // Latest stable sonnet
          max_tokens: 2000,
          system: systemPrompt,
          messages: messages
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (response.status === 401) throw new Error('API認証エラーです。APIキーを確認してください。');
        if (response.status === 429) throw new Error('利用制限に達しました。しばらく待ってから再試行してください。');
        throw new Error(errorData.error?.message || `API Error: ${response.status}`);
      }

      const data = await response.json();
      console.log('API Response:', data);

      if (!data.content || !data.content[0]) throw new Error('Invalid response format');
      return data.content[0].text;
    };

    const getSystemPrompt = () => {
      const basicInfo = basicInfos.find(bi => bi.oshiId === selectedOshiId);
      return `あなたは共感的なカウンセラーです。
ユーザーが記録した推し「${oshi.name}」の行動について、
なぜその行動が「${editingItem.feeling === 'positive' ? 'プラス感情' : 'マイナス感情'}」
と感じたのか、対話を通して一緒に探っていきます。

【記録された行動】
${editingItem.action}

【状況・背景】
${editingItem.context || '特になし'}

【推しの基本情報】
${JSON.stringify(basicInfo?.answers || {}, null, 2)}

【対話の進め方】
1. まず、その行動のどこに注目したかを尋ねる
2. 過去の似た経験や感情を思い出してもらう
3. 推しの性格や特徴と照らし合わせる
4. 「なぜそう感じたのか」を言語化する手助けをする

質問は1つずつ、短く。共感的で優しい口調で。
ユーザーが自分の言葉で気づけるようサポートしてください。`;
    };

    // Initial message from AI
    useEffect(() => {
      if (chatMessages.length === 0) {
        const initChat = async () => {
          setIsTyping(true);
          try {
            const firstResponse = await callClaudeAPI(getSystemPrompt(), [
              { role: 'user', content: '会話を開始してください。' }
            ]);
            setChatMessages([{ role: 'assistant', content: firstResponse }]);
          } catch (error) {
            console.error('Initial Chat Error:', error);
            alert(error.message);
          } finally {
            setIsTyping(false);
          }
        };
        initChat();
      }
    }, []);

    useEffect(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    }, [chatMessages]);

    const handleSend = async () => {
      if (!inputValue.trim() || isTyping) return;
      const userMsg = { role: 'user', content: inputValue };
      const newHistory = [...chatMessages, userMsg];

      setChatMessages(newHistory);
      setInputValue('');
      setIsTyping(true);

      try {
        const assistantResponse = await callClaudeAPI(getSystemPrompt(), newHistory);
        setChatMessages([...newHistory, { role: 'assistant', content: assistantResponse }]);
      } catch (error) {
        console.error('Chat Error:', error);
        alert('AI対話に失敗しました:\n' + error.message + '\n\nもう一度お試しください。');
      } finally {
        setIsTyping(false);
      }
    };

    return (
      <div className="flex flex-col h-[600px] border-2 border-pink-200 rounded-3xl overflow-hidden bg-white/90 backdrop-blur-sm shadow-2xl">
        <header className="bg-gradient-to-r from-pink-50 p-4 border-b border-pink-200 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 flex items-center justify-center text-xl shadow-lg">✨</div>
            <div>
              <p className="text-[10px] text-pink-600 font-bold uppercase tracking-widest">Recording Action for</p>
              <h2 className="text-lg font-black text-gray-800 liquid-text leading-tight">{oshi.name}</h2>
            </div>
          </div>
          <Button size="sm" className="bg-gradient-to-r from-pink-500 text-white">
            会話を終了
          </Button>
        </header>

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/30">
          {chatMessages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] p-3 rounded-2xl text-sm shadow-sm ${msg.role === 'user'
                ? 'bg-gradient-to-br from-pink-500 text-white rounded-tr-none'
                : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
                }`}>
                {msg.content}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-gray-100 shadow-sm flex gap-1">
                <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce delay-75"></span>
                <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce delay-150"></span>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-100 bg-white shadow-inner flex gap-2">
          <Input
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="メッセージを入力..."
            className="flex-1 border-gray-100 focus:border-pink-300 transition-all"
            disabled={isTyping}
          />
          <Button onClick={handleSend} disabled={isTyping} className="bg-pink-400 hover:bg-pink-500">
            送信
          </Button>
        </div>
      </div>
    );
  };

  const ReasonSummaryView = () => {
    const [finalReason, setFinalReason] = useState("");
    const [isGenerating, setIsGenerating] = useState(true);

    useEffect(() => {
      const generateSummary = async () => {
        setIsGenerating(true);
        try {
          const oshi = getOshi(selectedOshiId);
          const basicInfo = basicInfos.find(bi => bi.oshiId === selectedOshiId);

          const systemPrompt = `あなたは推し活アドバイザーです。
ユーザーが推しの特定の行動についてAIと対話した記録があります。
その対話の内容を150文字程度で要約し、ユーザーがなぜその行動に心を動かされたのか（あるいは違和感を覚えたのか）を言語化してください。

【推しの名前】: ${oshi.name}
【基本情報の一部】: ${basicInfo?.answers.q10_catchphrase || 'なし'}
【記録された行動】: ${editingItem?.action}

感情の種類: ${editingItem?.feeling === 'positive' ? 'プラス' : 'マイナス'}`;

          const apiKey = localStorage.getItem('anthropic_api_key') || 'YOUR_API_KEY_HERE';
          const response = await fetch("https://api.anthropic.com/v1/messages", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-api-key": apiKey,
              "anthropic-version": "2023-06-01",
              "anthropic-dangerously-allow-browser": "true"
            },
            body: JSON.stringify({
              model: "claude-3-sonnet-20240229",
              max_tokens: 1000,
              messages: [
                ...chatMessages,
                { role: 'user', content: 'これまでの対話を要約して、理由を言語化してください。' }
              ],
              system: systemPrompt
            })
          });

          if (!response.ok) throw new Error(`API Error: ${response.status}`);
          const data = await response.json();
          setFinalReason(data.content[0].text);
        } catch (error) {
          console.error('Summary Generation Error:', error);
          setFinalReason('要約の生成に失敗しました。ご自身で入力をお願いします。');
        } finally {
          setIsGenerating(false);
        }
      };

      if (chatMessages.length > 0) {
        generateSummary();
      } else {
        setIsGenerating(false);
      }
    }, [chatMessages]);

    const handleFinalSave = () => {
      const oshiAction = {
        ...editingItem,
        oshiId: selectedOshiId,
        id: editingItem.id || `action_${Date.now()}`,
        reason: finalReason,
        chatLog: chatMessages,
        aiSummary: finalReason,
        createdAt: editingItem.createdAt || new Date().toISOString()
      };

      const newActions = oshiAction.id && actions.find(a => a.id === oshiAction.id)
        ? actions.map(a => a.id === oshiAction.id ? oshiAction : a)
        : [...actions, oshiAction];

      setActions(newActions);
      setChatMessages([]);
      setCurrentView('oshigotari-main');
      setEditingItem(null);
    };

    return (
      <div className="max-w-2xl mx-auto space-y-8 animate-ethereal-fade">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-black bg-gradient-to-r from-pink-500 bg-clip-text text-transparent liquid-text">対話のまとめ</h1>
          <p className="text-gray-500 font-medium">AIとの対話から言語化された理由を確認してください</p>
        </div>

        <Card className="p-8 space-y-6 shadow-xl border-pink-100 bg-white">
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-pink-400 uppercase tracking-widest flex items-center">
              <AlertCircle className="w-4 h-4 mr-2" /> AI Summary
            </h2>
            <div className={`p-6 rounded-2xl border transition-all ${isGenerating ? 'bg-gray-50 border-gray-100' : 'bg-pink-50 border-pink-100'}`}>
              {isGenerating ? (
                <div className="flex items-center gap-3 text-gray-400">
                  <div className="w-5 h-5 border-2 border-pink-100 border-t-pink-500 rounded-full animate-spin"></div>
                  要約を作成中...
                </div>
              ) : (
                <p className="text-gray-800 leading-relaxed italic">「{finalReason}」</p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-sm font-bold text-pink-400 uppercase tracking-widest flex items-center">
              <Edit className="w-4 h-4 mr-2" /> Refine your Thoughts
            </h2>
            <p className="text-xs text-gray-400">AIの要約を参考に、自分の言葉で理由を書いてください</p>
            <span className="sr-only">Final Reason Editor</span>
            <Textarea
              value={finalReason}
              onChange={e => setFinalReason(e.target.value)}
              className="min-h-[150px] border-gray-100 focus:border-pink-300 transition-all text-lg"
              disabled={isGenerating}
            />
          </div>

          <div className="flex gap-4 pt-4 border-t border-gray-100">
            <Button variant="outline" className="flex-1" onClick={() => setCurrentView('chat-session')}>
              もう少し対話する
            </Button>
            <Button className="flex-1 bg-gradient-to-r from-pink-400 to-pink-500 border-none shadow-lg shadow-pink-100 font-bold" onClick={handleFinalSave} disabled={isGenerating}>
              この内容で保存
            </Button>
          </div>
        </Card>
      </div>
    );
  };

  const OshiBasicInfoForm = () => {
    const oshi = getOshi(selectedOshiId);
    const existingInfo = basicInfos.find(bi => bi.oshiId === selectedOshiId);

    const questions = [
      { id: 'q1_name', label: '推しの名前は？（フルネーム・愛称）' },
      { id: 'q2_activity', label: '推しは何をしている人？（職業・活動内容）' },
      { id: 'q3_birthday', label: '推しの誕生日は？' },
      { id: 'q4_visual', label: '推しの外見的特徴は？（髪型、身長、雰囲気など）' },
      { id: 'q5_personality', label: '推しの性格を3つの言葉で表すと？' },
      { id: 'q6_anniversary', label: '推しを好きになったのはいつ？' },
      { id: 'q7_discovery', label: '推しを知ったきっかけは？' },
      { id: 'q8_works', label: '推しの代表的な作品・活動は？' },
      { id: 'q9_sns', label: '推しの公式SNSやサイトは？（任意）' },
      { id: 'q10_catchphrase', label: '推しのキャッチフレーズを自分で作るなら？' }
    ];

    const [qIndex, setQIndex] = useState(0);
    const [answers, setAnswers] = useState(existingInfo?.answers || {
      q1_name: '',
      q2_activity: '',
      q3_birthday: '',
      q4_visual: '',
      q5_personality: '',
      q6_anniversary: '',
      q7_discovery: '',
      q8_works: '',
      q9_sns: '',
      q10_catchphrase: ''
    });

    if (!oshi) return <div>Oshi not found</div>;

    const currentQ = questions[qIndex];
    const progress = ((qIndex + 1) / questions.length) * 100;

    const handleNext = () => {
      if (qIndex < questions.length - 1) {
        setQIndex(qIndex + 1);
      } else {
        saveBasicInfo();
      }
    };

    const handleBack = () => {
      if (qIndex > 0) setQIndex(qIndex - 1);
    };

    const saveBasicInfo = () => {
      const newInfo = {
        oshiId: selectedOshiId,
        answers,
        updatedAt: new Date().toISOString()
      };

      const existingIdx = basicInfos.findIndex(bi => bi.oshiId === selectedOshiId);
      if (existingIdx >= 0) {
        const updated = [...basicInfos];
        updated[existingIdx] = { ...updated[existingIdx], ...newInfo };
        setBasicInfos(updated);
      } else {
        setBasicInfos([...basicInfos, { ...newInfo, createdAt: new Date().toISOString() }]);
      }
      setCurrentView('oshigotari-main');
    };

    return (
      <div className="max-w-2xl mx-auto space-y-8 animate-ethereal-fade">
        <header className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => setCurrentView('oshigotari-main')}><X className="w-5 h-5" /></Button>
          <div>
            <h1 className="text-xl font-bold">{oshi.name} 一問一答</h1>
            <p className="text-sm text-gray-500">質問に答えて魅力を深掘りしましょう</p>
          </div>
        </header>

        <Card className="p-8 space-y-8 min-h-[400px] flex flex-col justify-between border-pink-100 shadow-xl">
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-pink-400 uppercase tracking-wider">
                <span>Question {qIndex + 1} of {questions.length}</span>
                <span>{Math.round(progress)}% Complete</span>
              </div>
              <Progress value={progress} className="h-2" indicatorColor="bg-gradient-to-r from-pink-400" />
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-800 leading-tight">
                {currentQ.label}
              </h2>
              <Textarea
                value={answers[currentQ.id]}
                onChange={e => setAnswers({ ...answers, [currentQ.id]: e.target.value })}
                placeholder="自由に語ってください..."
                className="text-lg min-h-[150px] border-pink-100 focus:border-pink-400 transition-colors"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.ctrlKey) handleNext();
                }}
              />
              <p className="text-xs text-gray-400">Ctrl + Enter で次へ</p>
            </div>
          </div>

          <div className="flex gap-4 pt-6 mt-auto">
            <Button
              variant="outline"
              className="flex-1 py-6 border-gray-200"
              onClick={handleBack}
              disabled={qIndex === 0}
            >
              前へ
            </Button>
            <Button
              className="flex-[2] py-6 bg-pink-500 hover:bg-pink-600 text-lg"
              onClick={handleNext}
            >
              {qIndex === questions.length - 1 ? '完了！' : '次へ'}
            </Button>
          </div>
        </Card>

        <div className="flex justify-center gap-2">
          {questions.map((_, idx) => (
            <div
              key={idx}
              className={`w-3 h-1 rounded-full ${idx === qIndex ? 'bg-pink-500 w-6' : idx < qIndex ? 'bg-pink-200' : 'bg-gray-200'} transition-all`}
            />
          ))}
        </div>
      </div>
    );
  };

  const AnalysisResultView = () => {
    const analysis = getAnalysis(selectedAnalysisId);
    if (!analysis) return <div>Analysis not found</div>;

    return (
      <div className="max-w-2xl mx-auto space-y-6 pb-20 animate-ethereal-fade">
        <div className="flex items-center space-x-2">
          <Button variant="normal" size="icon" onClick={() => setCurrentView('oshi-detail')} className="rounded-full"><ArrowLeft className="w-5 h-5 text-gray-400 hover:text-gray-600 hover:bg-gray-200/70 rounded-lg transition-colors" /></Button>
          <h1 className="text-xl font-black liquid-text">AI魅力分析結果 ({analysis.date})</h1>
        </div>

        <Card className="p-6 space-y-6 shadow-md border-pink-100">
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-pink-600 border-b pb-2">✨ あなたが惹かれる推しの魅力</h2>
            <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">{analysis.attraction}</div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-bold text-aqua-600 border-b pb-2">👀 気になる点・苦手な部分</h2>
            <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">{analysis.concerns}</div>
          </div>

          <div className="space-y-4 bg-pink-50 p-4 rounded-lg border border-pink-100">
            <h2 className="text-xl font-bold text-gray-800 flex items-center"><Heart className="w-5 h-5 mr-2 text-pink-400" /> 結論：推しのどこが好きなのか</h2>
            <div className="text-gray-800 font-medium leading-relaxed italic">「{analysis.conclusion}」</div>
          </div>
        </Card>

        <div className="space-y-4">
          <h2 className="text-lg font-bold flex items-center"><ShoppingBag className="w-5 h-5 mr-2" /> おすすめのキャラ・コンテンツ</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(analysis.recommendations || []).map((rec, idx) => (
              <Card key={idx} className="p-4 bg-white border-gray-100">
                <h3 className="font-bold text-gray-800 mb-1">{rec.name}</h3>
                <p className="text-xs text-gray-500">{rec.reason}</p>
              </Card>
            ))}
          </div>
        </div>

        <div className="bg-pink-50 p-4 rounded-lg border border-pink-100">
          <h2 className="text-md font-bold text-pink-700 mb-2 flex items-center"><Info className="w-4 h-4 mr-2" /> 推し活のヒント</h2>
          <p className="text-sm text-pink-500">{analysis.hint}</p>
        </div>

        <div className="flex gap-4">
          <Button className="flex-1" variant="outline" onClick={() => setCurrentView('oshi-detail')}>戻る</Button>
          <Button className="flex-1" onClick={() => alert('再分析機能を実行します（シミュレーション）')}>再分析する</Button>
        </div>
      </div>
    );
  };

  // Global AI Analysis Modal
  const GlobalAiAnalysisModal = () => {
    if (!showGlobalAnalysis) return null;

    return (
      <div className="fixed inset-0 bg-black/60 z-[70] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-300">
        <Card className="max-w-xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border-orange-100 scale-in-center">
          <header className="p-4 border-b border-orange-50 flex items-center justify-between bg-gradient-to-r from-orange-50 to-white">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center shadow-lg shadow-pink-200">
                <Sparkles className="text-white w-4 h-4" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-800 leading-tight">未購入アイテムのおすすめ分析</h2>
                <p className="text-[10px] text-orange-500 font-medium">現在の感情と一問一答に基づくAI推奨</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setShowGlobalAnalysis(false)} className="h-8 w-8 rounded-full">
              <X className="w-5 h-5 text-gray-400" />
            </Button>
          </header>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50/50">
            {globalAnalysisData.length > 0 ? (
              globalAnalysisData.map((item) => (
                <div key={item.id} className="relative">
                  <div className={`absolute -left-1 top-0 bottom-0 w-1 rounded-full ${item.aiPriority === 'high' ? 'bg-pink-400' : (item.aiPriority === 'low' ? 'bg-aqua-500' : 'bg-orange-500')}`}></div>
                  <Card className="p-3 border-gray-100 hover:border-orange-100 transition-all bg-white">
                    <div className="flex items-start gap-3">
                      {item.photo && (
                        <div className="w-12 h-12 rounded border border-gray-100 overflow-hidden shrink-0">
                          <img src={item.photo} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-[9px] px-1.5 py-0.5 rounded border ${item.aiPriority === 'high' ? 'bg-pink-50 text-rose-600 border-pink-100' : (item.aiPriority === 'low' ? 'bg-aqua-50 text-aqua-600 border-aqua-100' : 'bg-orange-50 text-orange-100 border-orange-100')}`}>
                            推奨{item.aiPriority === 'high' ? '高' : (item.aiPriority === 'low' ? '低' : '中')}
                          </span>
                          <span className="text-[9px] bg-orange-50 text-orange-500 px-1.5 py-0.5 rounded border border-orange-100">
                            一致度 {item.aiScore}%
                          </span>
                        </div>
                        <h4 className="font-bold text-sm text-gray-800 truncate">{item.name}</h4>
                        <p className="text-[10px] text-gray-500 mb-2 font-medium">¥{item.price.toLocaleString()}</p>
                        <div className="bg-gray-50 p-2 rounded text-[10px] text-gray-600 italic">
                          「{item.aiReason}」
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              ))
            ) : (
              <div className="text-center py-10 text-gray-400 text-xs">分析データがありません</div>
            )}
          </div>

          <footer className="p-4 border-t border-orange-50 bg-white flex flex-col sm:flex-row gap-2">
            <Button variant="outline" className="flex-1 h-9 text-xs" onClick={() => setShowGlobalAnalysis(false)}>閉じる</Button>
            <Button className="flex-[2] h-9 text-xs bg-orange-500 hover:bg-pink-600 shadow-lg shadow-pink-100 font-bold" onClick={applyAllAiPriorities}>
              推奨優先度を一括適用
            </Button>
          </footer>
        </Card>
      </div>
    );
  };

  // Image Viewer Component
  const ImageViewer = () => {
    if (!selectedPhoto) return null;
    return (
      <div className="fixed inset-0 bg-black/90 z-[60] flex items-center justify-center p-4 animate-in fade-in duration-200" onClick={() => setSelectedPhoto(null)}>
        <Button variant="ghost" size="icon" className="absolute top-4 right-4 text-white hover:bg-white/10"><X className="w-8 h-8" /></Button>
        <img src={selectedPhoto} alt="Full view" className="max-w-full max-h-full object-contain rounded-lg shadow-2xl" />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-gray-900">
      {/* Background Decoration */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-aqua-100/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-pink-100/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-orange-100/20 rounded-full blur-3xl" />
      </div>

      {/* Navigation */}
      <nav className="bg-white/95 backdrop-blur-sm border-b border-pink-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={goHome}>
            <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-orange-400 rounded-xl flex items-center justify-center shadow-lg">
              <Heart className="text-white w-6 h-6 fill-current" />
            </div>
            <span className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-orange-400 liquid-text">
              推し記録帳
            </span>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-6 overflow-hidden">
        {currentView === 'home' && <PortalHomeView />}
        {currentView === 'management-dashboard' && <ManagementDashboardView />}
        {currentView === 'oshigotari-select' && <OshiGotariSelectView />}
        {currentView === 'oshigotari-main' && <OshiGotariMainView />}
        {currentView === 'oshi-detail' && <OshiDetailView />}
        {currentView === 'oshi-form' && <OshiForm />}
        {currentView === 'goods-form' && <GoodsForm />}
        {currentView === 'event-form' && <EventForm />}
        {currentView === 'benefit-form' && <BenefitForm />}
        {currentView === 'trip-form' && <TripForm />}
        {currentView === 'trip-detail' && <TripDetailView />}
        {currentView === 'action-form' && <ActionForm />}
        {currentView === 'chat-session' && <ChatSessionView />}
        {currentView === 'reason-summary' && <ReasonSummaryView />}
        {currentView === 'oshi-basic-form' && <OshiBasicInfoForm />}
        {currentView === 'analysis-result' && <AnalysisResultView />}
      </main>

      <ImageViewer />
      <GlobalAiAnalysisModal />
    </div>
  );
}

export default App;
