import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, ArrowLeft, Check, X, Heart, ShoppingBag, Coins, Calendar, MapPin, Ticket, Gift, AlertCircle, Plane, Map, Navigation, ArrowDown, Clock, Train, Bus, Coffee, Info, ChevronUp, ChevronDown } from 'lucide-react';

// --- UI Components (Simplified shadcn/ui style) ---

const Button = ({ children, variant = "primary", size = "default", className = "", ...props }) => {
  const baseStyles = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50";
  const variants = {
    primary: "bg-pink-500 text-white hover:bg-pink-600 shadow-sm",
    secondary: "bg-purple-500 text-white hover:bg-purple-600 shadow-sm",
    outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
    ghost: "hover:bg-accent hover:text-accent-foreground",
    destructive: "bg-red-500 text-white hover:bg-red-600 shadow-sm",
    link: "text-primary underline-offset-4 hover:underline",
  };
  const sizes = {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded-md px-3",
    lg: "h-11 rounded-md px-8",
    icon: "h-10 w-10",
  };
  return (
    <button className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size] || sizes.default} ${className}`} {...props}>
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
  <div className={`rounded-xl border bg-card text-card-foreground shadow-sm bg-white ${className}`} {...props}>
    {children}
  </div>
);

const Progress = ({ value, className = "", indicatorColor = "bg-primary" }) => (
  <div className={`relative h-4 w-full overflow-hidden rounded-full bg-secondary bg-gray-200 ${className}`}>
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

const TabsTrigger = ({ value, activeValue, onClick, children, className = "" }) => (
  <button
    onClick={() => onClick(value)}
    className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${activeValue === value ? "bg-white text-gray-900 shadow-sm" : "hover:text-gray-900 text-gray-500"
      } ${className}`}
  >
    {children}
  </button>
);

// --- Application Component ---

function App() {
  // State
  const [oshis, setOshis] = useState([
    {
      id: "oshi_1",
      name: "サンプル推し",
      genre: "アイドル",
      monthlyBudget: 30000,
      spent: 12000,
      createdAt: new Date().toISOString()
    }
  ]);
  const [goods, setGoods] = useState([
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
  ]);
  const [events, setEvents] = useState([
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
  ]);
  const [benefits, setBenefits] = useState([
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
  ]);
  const [trips, setTrips] = useState([
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
  ]);

  const [currentView, setCurrentView] = useState('home'); // 'home', 'oshi-detail', 'oshi-form', 'goods-form', 'event-form', 'benefit-form', 'trip-form', 'trip-detail'
  const [selectedOshiId, setSelectedOshiId] = useState(null);
  const [selectedTripId, setSelectedTripId] = useState(null);
  const [editingItem, setEditingItem] = useState(null);

  // Data helpers
  const getOshi = (id) => oshis.find(o => o.id === id);
  const getOshiGoods = (oshiId) => goods.filter(g => g.oshiId === oshiId);
  const getOshiEvents = (oshiId) => events.filter(e => e.oshiId === oshiId);
  const getOshiBenefits = (oshiId) => benefits.filter(b => b.oshiId === oshiId);
  const getOshiTrips = (oshiId) => trips.filter(t => t.oshiId === oshiId);
  const getTrip = (id) => trips.find(t => t.id === id);

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

  const goTripForm = (item = null) => {
    setEditingItem(item);
    setCurrentView('trip-form');
  };

  const goTripDetail = (id) => {
    setSelectedTripId(id);
    setCurrentView('trip-detail');
  };


  // --- Sub-Components (Views) ---

  const HomeView = () => {
    const totalBudget = oshis.reduce((sum, o) => sum + o.monthlyBudget, 0);
    const totalSpent = oshis.reduce((sum, o) => sum + o.spent, 0);
    const remaining = totalBudget - totalSpent;

    return (
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">推し活マネージャー</h1>
          <Button onClick={goAddOshi} size="sm" variant="primary"><Plus className="w-4 h-4 mr-2" /> 推し追加</Button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Left Column: Stats & Oshi List */}
          <div className="md:col-span-2 space-y-6">
            {/* Budget Summary Card */}
            <Card className="p-6 bg-gradient-to-br from-pink-50 to-purple-50 border-purple-100">
              <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center"><Coins className="w-5 h-5 mr-2" />今月の予算サマリー</h2>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-sm text-gray-500">総予算</p>
                  <p className="text-xl font-bold text-gray-800">¥{totalBudget.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">支出</p>
                  <p className="text-xl font-bold text-pink-600">¥{totalSpent.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">残高</p>
                  <p className={`text-xl font-bold ${remaining < 0 ? 'text-red-500' : 'text-blue-600'}`}>¥{remaining.toLocaleString()}</p>
                </div>
              </div>
              <div className="mt-4">
                <Progress value={totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0} className="h-2" indicatorColor="bg-gradient-to-r from-pink-500 to-purple-500" />
              </div>
            </Card>

            {/* Oshi List */}
            <div>
              <h2 className="text-lg font-bold mb-3 flex items-center"><Heart className="w-5 h-5 mr-2 text-pink-500" /> 推し一覧</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {oshis.map(oshi => {
                  const percent = oshi.monthlyBudget > 0 ? (oshi.spent / oshi.monthlyBudget) * 100 : 0;
                  return (
                    <Card key={oshi.id} className="p-4 hover:shadow-lg transition-shadow cursor-pointer border-pink-100" onClick={() => goOshiDetail(oshi.id)}>
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-lg font-bold text-gray-800">{oshi.name}</h3>
                          <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded-full">{oshi.genre}</span>
                        </div>
                        <ArrowLeft className="w-4 h-4 text-gray-300 transform rotate-180" />
                      </div>
                      <div className="mt-4 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">残高</span>
                          <span className={`font-medium ${oshi.monthlyBudget - oshi.spent < 0 ? 'text-red-500' : 'text-gray-700'}`}>
                            ¥{(oshi.monthlyBudget - oshi.spent).toLocaleString()}
                          </span>
                        </div>
                        <Progress value={percent} className="h-2" indicatorColor={percent > 90 ? "bg-red-500" : "bg-pink-500"} />
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
                          <span className="text-pink-500 font-medium">{oshiName}</span>
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
                          <span className="text-pink-500 font-medium">{oshiName}</span>
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
                          <span className="text-pink-500 font-medium">{oshiName}</span>
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

  const OshiDetailView = () => {
    const oshi = getOshi(selectedOshiId);
    const oshiGoods = getOshiGoods(selectedOshiId);
    const oshiEvents = getOshiEvents(selectedOshiId);
    const oshiBenefits = getOshiBenefits(selectedOshiId);
    const oshiTrips = getOshiTrips(selectedOshiId);

    // UI State for Tabs
    const [activeTab, setActiveTab] = useState('goods'); // 'goods' | 'events' | 'benefits' | 'trips'

    // Filters state
    const [filterStatus, setFilterStatus] = useState('all'); // all, bought, not-bought
    const [sortType, setSortType] = useState('priority'); // priority, date, price

    if (!oshi) return <div>Data not found</div>;

    const remaining = oshi.monthlyBudget - oshi.spent;
    const usagePercent = oshi.monthlyBudget > 0 ? (oshi.spent / oshi.monthlyBudget) * 100 : 0;

    // Filter Logic
    let displayGoods = oshiGoods.filter(g => {
      if (filterStatus === 'bought') return g.purchased;
      if (filterStatus === 'not-bought') return !g.purchased;
      return true;
    });

    // Sort Logic
    // eslint-disable-next-line array-callback-return
    displayGoods.sort((a, b) => {
      if (sortType === 'priority') {
        const map = { high: 3, medium: 2, low: 1 };
        return map[b.priority] - map[a.priority];
      }
      if (sortType === 'price') return a.price - b.price;
      if (sortType === 'date') return new Date(a.releaseDate) - new Date(b.releaseDate);
    });

    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-2 mb-4">
          <Button variant="ghost" size="icon" onClick={() => setCurrentView('home')}><ArrowLeft className="w-5 h-5" /></Button>
          <h1 className="text-xl font-bold">{oshi.name} 詳細</h1>
        </div>

        {/* Oshi Info Header */}
        <Card className="p-6 border-pink-200">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                {oshi.name} <span className="text-sm font-normal px-2 py-1 bg-gray-100 rounded-full">{oshi.genre}</span>
              </h2>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={() => goEditOshi(oshi)}><Edit className="w-4 h-4 mr-1" /> 編集</Button>
              <Button variant="destructive" size="sm" onClick={() => deleteOshi(oshi.id)}><Trash2 className="w-4 h-4 mr-1" /> 削除</Button>
            </div>
          </div>

          {/* Dashboard */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-end mb-2">
              <span className="text-sm font-medium text-gray-500">今月の予算状況</span>
              <span className={`text-xl font-bold ${remaining < (oshi.monthlyBudget * 0.1) ? 'text-red-500' : 'text-gray-800'}`}>
                残高 ¥{remaining.toLocaleString()}
              </span>
            </div>
            <Progress value={usagePercent} className="h-3" indicatorColor={usagePercent > 90 ? "bg-red-500" : "bg-pink-500"} />
            <div className="flex justify-between mt-2 text-sm text-gray-400">
              <span>支出: ¥{oshi.spent.toLocaleString()}</span>
              <span>予算: ¥{oshi.monthlyBudget.toLocaleString()}</span>
            </div>
            {remaining < (oshi.monthlyBudget * 0.1) && (
              <div className="mt-2 text-xs text-red-500 font-bold flex items-center">
                ⚠️ 予算残高がピンチです！
              </div>
            )}
          </div>
        </Card>



        {/* Tabs Navigation */}
        <Tabs>
          <TabsList className="grid w-full grid-cols-4 mb-4 h-auto flex-wrap">
            <TabsTrigger value="goods" activeValue={activeTab} onClick={setActiveTab} className="py-2">
              <ShoppingBag className="w-4 h-4 md:mr-2" /> <span className="hidden md:inline">グッズ</span>
              <span className="ml-1 md:ml-2 text-[10px] md:text-xs bg-gray-200 text-gray-700 px-1.5 py-0.5 rounded-full">{oshiGoods.length}</span>
            </TabsTrigger>
            <TabsTrigger value="events" activeValue={activeTab} onClick={setActiveTab} className="py-2">
              <Calendar className="w-4 h-4 md:mr-2" /> <span className="hidden md:inline">イベント</span>
              <span className="ml-1 md:ml-2 text-[10px] md:text-xs bg-gray-200 text-gray-700 px-1.5 py-0.5 rounded-full">{oshiEvents.length}</span>
            </TabsTrigger>
            <TabsTrigger value="benefits" activeValue={activeTab} onClick={setActiveTab} className="py-2">
              <Gift className="w-4 h-4 md:mr-2" /> <span className="hidden md:inline">特典</span>
              <span className="ml-1 md:ml-2 text-[10px] md:text-xs bg-gray-200 text-gray-700 px-1.5 py-0.5 rounded-full">{oshiBenefits.length}</span>
            </TabsTrigger>
            <TabsTrigger value="trips" activeValue={activeTab} onClick={setActiveTab} className="py-2">
              <Map className="w-4 h-4 md:mr-2" /> <span className="hidden md:inline">遠征</span>
              <span className="ml-1 md:ml-2 text-[10px] md:text-xs bg-gray-200 text-gray-700 px-1.5 py-0.5 rounded-full">{oshiTrips.length}</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Goods Section */}
        {
          activeTab === 'goods' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold flex items-center"><ShoppingBag className="w-5 h-5 mr-2" /> グッズリスト</h3>
                <Button onClick={goAddGoods} size="sm"><Plus className="w-4 h-4 mr-1" /> グッズ追加</Button>
              </div>

              {/* Filters */}
              <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                <Select className="w-[140px]"
                  options={[
                    { label: '優先度順', value: 'priority' },
                    { label: '価格順', value: 'price' },
                    { label: '発売日順', value: 'date' },
                  ]}
                  value={sortType}
                  onChange={(e) => setSortType(e.target.value)}
                />
                <Select className="w-[140px]"
                  options={[
                    { label: 'すべて', value: 'all' },
                    { label: '未購入', value: 'not-bought' },
                    { label: '購入済', value: 'bought' },
                  ]}
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                />
              </div>

              {/* Goods List */}
              <div className="space-y-3">
                {displayGoods.map(item => {
                  const priorityColors = {
                    high: 'bg-red-100 text-red-700 border-red-200',
                    medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
                    low: 'bg-green-100 text-green-700 border-green-200'
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
                            className="w-6 h-6 rounded border-gray-300 text-pink-500 focus:ring-pink-500 cursor-pointer"
                          />
                        </div>
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
                        <button onClick={() => deleteGoods(item.id)} className="text-gray-400 hover:text-red-500 p-1">
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
          activeTab === 'events' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold flex items-center"><Ticket className="w-5 h-5 mr-2" /> イベントリスト</h3>
                <Button onClick={goAddEvent} size="sm"><Plus className="w-4 h-4 mr-1" /> イベント追加</Button>
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
                          <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">{event.category}</span>
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
                              <span className={`font-bold ${event.actualCost > event.budget ? 'text-red-500' : 'text-green-600'}`}>
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
                          className={`text-xs px-3 py-1 rounded-full border transition-colors flex items-center ${event.attended ? 'bg-green-50 text-green-700 border-green-200' : 'bg-white text-gray-500 border-gray-300 hover:bg-gray-50'}`}
                        >
                          <Check className="w-3 h-3 mr-1" /> {event.attended ? '参加済' : '未参加'}
                        </button>
                        <div className="flex gap-1 mt-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => goEditEvent(event)}><Edit className="w-3 h-3" /></Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-red-400 hover:text-red-600" onClick={() => deleteEvent(event.id)}><Trash2 className="w-3 h-3" /></Button>
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
        {activeTab === 'trips' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold flex items-center"><Map className="w-5 h-5 mr-2" /> 遠征プランリスト</h3>
              <Button onClick={() => goTripForm()} size="sm"><Plus className="w-4 h-4 mr-1" /> プラン作成</Button>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {oshiTrips.length === 0 && (
                <div className="text-center py-8 text-gray-400 bg-gray-50 rounded-lg border border-dashed border-gray-200 col-span-full">
                  遠征プランは登録されていません
                </div>
              )}
              {oshiTrips.sort((a, b) => new Date(a.date) - new Date(b.date)).map(trip => (
                <Card key={trip.id} className={`p-4 hover:border-pink-300 transition-colors ${trip.completed ? 'opacity-70 bg-gray-50' : ''}`}>
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-gray-500">{trip.date}</span>
                        {trip.completed && <span className="text-[10px] px-1.5 py-0.5 bg-green-100 text-green-700 rounded-full font-bold">完了</span>}
                      </div>
                      <h4 className="font-bold text-lg text-gray-800">{trip.name}</h4>
                    </div>
                    <Button variant="ghost" size="sm" className="text-pink-500 font-bold" onClick={() => goTripDetail(trip.id)}>詳細を見る</Button>
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
      </div>
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
      <div className="max-w-md mx-auto space-y-6">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" onClick={() => setCurrentView('home')}><X className="w-5 h-5" /></Button>
          <h1 className="text-xl font-bold">{editingItem ? '推しを編集' : '推しを登録'}</h1>
        </div>
        <Card className="p-6 space-y-4">
          <div className="space-y-2">
            <Label>名前 <span className="text-red-500">*</span></Label>
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
            <Label>月間予算 (円) <span className="text-red-500">*</span></Label>
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
      memo: ''
    });

    const handleSubmit = () => {
      if (!formData.name) return alert('グッズ名を入力してください');
      if (!formData.price) return alert('価格を入力してください');

      saveGoods({
        ...formData,
        price: Number(formData.price)
      });
    };

    return (
      <div className="max-w-md mx-auto space-y-6">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" onClick={() => setCurrentView('oshi-detail')}><X className="w-5 h-5" /></Button>
          <h1 className="text-xl font-bold">{editingItem ? 'グッズを編集' : 'グッズを登録'}</h1>
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
          </div>
          <div className="space-y-2">
            <Label>メモ</Label>
            <Textarea
              value={formData.memo}
              onChange={e => setFormData({ ...formData, memo: e.target.value })}
              placeholder="特典情報や購入場所など"
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
      <div className="max-w-md mx-auto space-y-6">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" onClick={() => setCurrentView('oshi-detail')}><X className="w-5 h-5" /></Button>
          <h1 className="text-xl font-bold">{editingItem ? 'イベントを編集' : 'イベントを登録'}</h1>
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
      <div className="max-w-2xl mx-auto space-y-6 pb-20">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" onClick={() => setCurrentView('oshi-detail')}><X className="w-5 h-5" /></Button>
          <h1 className="text-xl font-bold">{editingItem ? '遠征プランを編集' : '遠征プランを作成'}</h1>
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
            <Card key={dest.id} className="p-4 relative border-l-4 border-l-pink-500">
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
      <div className="max-w-2xl mx-auto space-y-6 pb-20">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" onClick={() => setCurrentView('oshi-detail')}><ArrowLeft className="w-5 h-5" /></Button>
            <h1 className="text-xl font-bold">{trip.name}</h1>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => goTripForm(trip)}><Edit className="w-4 h-4" /></Button>
            <Button variant="destructive" size="sm" onClick={() => deleteTrip(trip.id)}><Trash2 className="w-4 h-4" /></Button>
          </div>
        </div>

        <Card className="p-4 bg-gradient-to-r from-pink-50 to-white border-pink-100 flex justify-between items-center">
          <div>
            <p className="text-xs text-gray-500 mb-1">遠征日: {trip.date}</p>
            <p className="text-sm font-bold text-pink-600 bg-white px-2 py-0.5 rounded border border-pink-100 inline-block">総予算: ¥{trip.totalBudget.toLocaleString()}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400">合計交通費</p>
            <p className="text-lg font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full border border-green-100">¥{totalTrans.toLocaleString()}</p>
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
                  <div className="w-10 h-10 rounded-full bg-pink-500 text-white flex items-center justify-center font-bold shadow-md shrink-0">
                    {idx + 1}
                  </div>
                  <Card className="flex-1 p-4 shadow-sm border-gray-100">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center text-pink-500 font-bold">
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
                    <div className="bg-green-50 text-green-700 px-3 py-1 rounded-md text-xs font-bold border border-green-100 flex items-center mb-2">
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
          <Button className={`w-full ${trip.completed ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'}`} onClick={() => toggleTripCompletion(trip.id)}>
            {trip.completed ? '完了済みを取り消す' : 'この遠征を完了済みにする'}
          </Button>
        </div>
      </div>
    );
  };

  // --- Main Render ---

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-4 md:p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        {currentView === 'home' && <HomeView />}
        {currentView === 'oshi-detail' && <OshiDetailView />}
        {currentView === 'oshi-form' && <OshiForm />}
        {currentView === 'goods-form' && <GoodsForm />}
        {currentView === 'event-form' && <EventForm />}
        {currentView === 'benefit-form' && <BenefitForm />}
        {currentView === 'trip-form' && <TripForm />}
        {currentView === 'trip-detail' && <TripDetailView />}
      </div>
    </div>
  );
}

export default App;

