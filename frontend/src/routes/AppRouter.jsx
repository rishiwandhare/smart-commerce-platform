import React, { useEffect, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { Toast } from '../components/common/Toast';
import { CompareDrawer } from '../components/comparison/CompareDrawer';
import { HomePage } from '../pages/customer/HomePage';
import { SearchResultsPage } from '../pages/customer/SearchResultsPage';
import { ProductDetailPage } from '../pages/customer/ProductDetailPage';
import { CustomerDashboardPage } from '../pages/customer/CustomerDashboardPage';
import { WishlistPage } from '../pages/customer/WishlistPage';
import { useAuth } from '../context/AuthContext';
import { usePreferences } from '../context/UserPreferencesContext';
import { productService } from '../services/productService';
import { shopkeeperService } from '../services/shopkeeperService';
import { adminService } from '../services/adminService';
import { DemandForecastChart } from '../components/dashboard/DemandForecastChart';
import { IconBell, IconCheck, IconSearch, IconShoppingBag, IconStore, IconTrendingDown, IconUser } from '../components/common/Icons';

function RoutedApp() {
  const location = useLocation();
  const navigate = useNavigate();
  const routePath = location.pathname.replace(/^\//, '');
  const go = (path = '') => navigate(path ? `/${path}` : '/');

  return (
    <div className="app-shell">
      <Navbar onNavigate={go} currentPath={routePath} />
      <main>
        <Routes>
          <Route path="/" element={<HomeRoute onNavigate={go} />} />
          <Route path="/search" element={<SearchRoute onNavigate={go} />} />
          <Route path="/product/:productId" element={<ProductRoute onNavigate={go} />} />
          <Route path="/wishlist" element={<WishlistPage onNavigate={go} />} />
          <Route path="/alerts" element={<AlertsPage onNavigate={go} />} />
          <Route path="/orders" element={<OrdersPage onNavigate={go} />} />
          <Route path="/customer" element={<CustomerDashboardPage onNavigate={go} />} />
          <Route path="/auth" element={<AuthPage onNavigate={go} />} />
          <Route path="/shopkeeper/*" element={<ShopkeeperPortal onNavigate={go} />} />
          <Route path="/admin/*" element={<AdminPortal onNavigate={go} />} />
          <Route path="/results" element={<Navigate to="/search" replace />} />
          <Route path="/details" element={<Navigate to="/product/prod-1" replace />} />
          <Route path="*" element={<NotFoundPage onNavigate={go} />} />
        </Routes>
      </main>
      <CompareDrawer onNavigate={go} />
      <Toast />
      <Footer onNavigate={go} />
    </div>
  );
}

function HomeRoute({ onNavigate }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    productService.getProducts({ sortBy: 'biggest_drop' }).then(setProducts);
  }, []);

  return <HomePage products={products} onNavigate={onNavigate} />;
}

function SearchRoute({ onNavigate }) {
  const [searchParams] = useSearchParams();
  const queryParams = Object.fromEntries(searchParams.entries());
  return <SearchResultsPage onNavigate={onNavigate} queryParams={queryParams} />;
}

function ProductRoute({ onNavigate }) {
  const { productId } = useParams();
  return <ProductDetailPage productId={productId} onNavigate={onNavigate} />;
}

function AlertsPage({ onNavigate }) {
  const { alerts, removePriceAlert } = usePreferences();

  return (
    <section className="container portal-page">
      <PageHeading icon={<IconBell size={20} />} eyebrow="Price intelligence" title="Price alerts" description="Keep the comparison engine watching for the prices you are willing to pay." />
      <div className="portal-toolbar">
        <button className="btn btn-primary" onClick={() => onNavigate('search')}><IconSearch size={17} /> Find a product to track</button>
        <span className="muted-copy">{alerts.length} active alerts</span>
      </div>
      {alerts.length === 0 ? <EmptyState title="No alerts yet" description="Save a product and set a target price from its offer page." action="Browse products" onClick={() => onNavigate('search')} /> : (
        <div className="portal-list">
          {alerts.map((alert) => (
            <article className="portal-list-item glass-card" key={alert.id}>
              <div>
                <span className="eyebrow">Monitoring price</span>
                <h3>{alert.productTitle}</h3>
                <p>Current <strong>${alert.currentPrice.toFixed(2)}</strong> · Target <strong className="success-text">${alert.targetPrice.toFixed(2)}</strong></p>
              </div>
              <div className="list-actions">
                <button className="btn btn-outline btn-sm" onClick={() => onNavigate(`product/${alert.productId}`)}>View offer</button>
                <button className="btn btn-secondary btn-sm" onClick={() => removePriceAlert(alert.id)}>Delete</button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

function OrdersPage({ onNavigate }) {
  const { orders } = usePreferences();

  return (
    <section className="container portal-page">
      <PageHeading icon={<IconShoppingBag size={20} />} eyebrow="Local commerce" title="Pickup orders" description="Your reserved products and collection details live here." />
      {orders.length === 0 ? <EmptyState title="No pickup orders" description="Choose a local pickup offer from a product comparison page." action="Compare products" onClick={() => onNavigate('search')} /> : (
        <div className="portal-list">
          {orders.map((order) => (
            <article className="portal-list-item glass-card" key={order.id}>
              <div>
                <span className="eyebrow">{order.id}</span>
                <h3>{order.productTitle}</h3>
                <p>{order.storeName} · {order.pickupAddress}</p>
              </div>
              <div className="order-status">
                <span className="badge badge-success"><IconCheck size={14} /> {order.status}</span>
                <strong>Code {order.pickupCode}</strong>
                <span>${order.pricePaid.toFixed(2)}</span>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

function AuthPage({ onNavigate }) {
  const { login } = useAuth();
  const [role, setRole] = useState('customer');

  const handleSubmit = (event) => {
    event.preventDefault();
    login('', '', role);
    onNavigate(role === 'customer' ? 'customer' : role);
  };

  return (
    <section className="container auth-page">
      <form className="auth-panel glass-card" onSubmit={handleSubmit}>
        <span className="eyebrow">Demo account access</span>
        <h1>Choose your workspace</h1>
        <p className="muted-copy">Use a seeded persona to explore each platform workflow while the FastAPI auth integration is connected.</p>
        <label>Email<input type="email" placeholder="you@example.com" required /></label>
        <label>Password<input type="password" placeholder="••••••••" required /></label>
        <label>Workspace<select value={role} onChange={(event) => setRole(event.target.value)}><option value="customer">Customer</option><option value="shopkeeper">Shopkeeper</option><option value="admin">Admin</option></select></label>
        <button className="btn btn-primary" type="submit"><IconUser size={17} /> Continue to workspace</button>
      </form>
    </section>
  );
}

function ShopkeeperPortal({ onNavigate }) {
  const location = useLocation();
  const [inventory, setInventory] = useState([]);
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    Promise.all([shopkeeperService.getInventory(), shopkeeperService.getAnalytics()]).then(([items, stats]) => {
      setInventory(items);
      setAnalytics(stats);
    });
  }, []);

  const view = location.pathname.split('/')[2] || 'dashboard';
  const isInventory = view === 'inventory' || view === 'products';
  const isAnalytics = view === 'analytics' || view === 'forecast';

  return (
    <section className="container portal-page">
      <PageHeading icon={<IconStore size={20} />} eyebrow="Merchant workspace" title="MetroTech Express" description="Manage local offers, inventory readiness, and demand signals from one workspace." />
      <div className="portal-tabs"><button className={view === 'dashboard' ? 'active' : ''} onClick={() => onNavigate('shopkeeper')}>Dashboard</button><button className={view === 'profile' ? 'active' : ''} onClick={() => onNavigate('shopkeeper/profile')}>Store profile</button><button className={view === 'products' ? 'active' : ''} onClick={() => onNavigate('shopkeeper/products')}>Products</button><button className={view === 'inventory' ? 'active' : ''} onClick={() => onNavigate('shopkeeper/inventory')}>Inventory</button><button className={view === 'orders' ? 'active' : ''} onClick={() => onNavigate('shopkeeper/orders')}>Orders</button><button className={view === 'analytics' ? 'active' : ''} onClick={() => onNavigate('shopkeeper/analytics')}>Sales analytics</button><button className={view === 'forecast' ? 'active' : ''} onClick={() => onNavigate('shopkeeper/forecast')}>Demand forecast</button></div>
      {view === 'profile' ? <StoreProfile /> : view === 'orders' ? <MerchantOrders inventory={inventory} /> : isInventory ? <InventoryTable inventory={inventory} /> : isAnalytics ? <><DemandForecastChart inventory={inventory} /><AnalyticsPanel analytics={analytics} /></> : <MerchantOverview inventory={inventory} analytics={analytics} onNavigate={onNavigate} />}
    </section>
  );
}

function AdminPortal({ onNavigate }) {
  const location = useLocation();
  const [stats, setStats] = useState(null);
  const [stores, setStores] = useState([]);
  const [matches, setMatches] = useState([]);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    Promise.all([adminService.getPlatformStats(), adminService.getStores(), adminService.getProductMatchingQueue(), adminService.getUsers(), productService.getProducts()]).then(([platformStats, retailerStores, queue, platformUsers, catalog]) => {
      setStats(platformStats);
      setStores(retailerStores);
      setMatches(queue);
      setUsers(platformUsers);
      setProducts(catalog);
    });
  }, []);

  const view = location.pathname.split('/')[2] || 'overview';
  return (
    <section className="container portal-page">
      <PageHeading icon={<IconCheck size={20} />} eyebrow="Platform operations" title="Admin console" description="Monitor catalog quality, retailer feeds, and product matching confidence." />
      <div className="portal-tabs"><button className={view === 'overview' ? 'active' : ''} onClick={() => onNavigate('admin')}>Dashboard</button><button className={view === 'users' ? 'active' : ''} onClick={() => onNavigate('admin/users')}>Users</button><button className={view === 'stores' ? 'active' : ''} onClick={() => onNavigate('admin/stores')}>Stores</button><button className={view === 'products' ? 'active' : ''} onClick={() => onNavigate('admin/products')}>Products</button><button className={view === 'offers' ? 'active' : ''} onClick={() => onNavigate('admin/offers')}>Offers</button><button className={view === 'reports' ? 'active' : ''} onClick={() => onNavigate('admin/reports')}>Reports</button></div>
      {view === 'users' ? <UserTable users={users} /> : view === 'stores' ? <FeedTable stores={stores} /> : view === 'products' ? <ProductAdminTable products={products} /> : view === 'offers' ? <OfferAdminTable products={products} /> : view === 'reports' ? <ReportsPanel stats={stats} /> : <AdminOverview stats={stats} />}
    </section>
  );
}

function MerchantOverview({ inventory, analytics, onNavigate }) {
  const lowStock = inventory.filter((item) => item.stock < item.minThreshold).length;
  return <><div className="metric-grid"><Metric title="Monthly revenue" value={analytics ? `$${analytics.monthlyRevenue.toLocaleString()}` : '...'} icon={<IconTrendingDown size={18} />} /><Metric title="Orders" value={analytics?.monthlyOrders || '...'} icon={<IconShoppingBag size={18} />} /><Metric title="Active products" value={inventory.length || '...'} icon={<IconStore size={18} />} /><Metric title="Low stock" value={lowStock} icon={<IconBell size={18} />} /></div><div className="portal-columns"><section className="glass-card portal-panel"><h2>Price position</h2><p className="muted-copy">Compare your local listings against the lowest online offer before publishing updates.</p><button className="btn btn-primary" onClick={() => onNavigate('shopkeeper/inventory')}>Review inventory</button></section><section className="glass-card portal-panel"><h2>Sales trend</h2><div className="sparkline">{(analytics?.weeklySalesTrend || []).map((point) => <div className="sparkline-bar" style={{ height: `${Math.max(12, point.revenue / 100)}px` }} key={point.day}><span>{point.day}</span></div>)}</div></section></div></>;
}

function StoreProfile() {
  return <section className="glass-card portal-panel"><span className="eyebrow">Verified local seller</span><h2>MetroTech Express</h2><p className="muted-copy">452 Market St, Suite 100 · Open today 9:00 AM–9:00 PM</p><div className="metric-grid"><Metric title="Seller rating" value="4.9 / 5" /><Metric title="Pickup readiness" value="98.5%" /><Metric title="Feed status" value="Connected" /></div></section>;
}

function MerchantOrders({ inventory }) {
  const orders = inventory.slice(0, 3).map((item, index) => ({ id: `MT-${1200 + index}`, product: item.productTitle, status: index === 1 ? 'Awaiting pickup' : 'Ready', total: item.currentPrice }));
  return <Table title="Store orders" headers={['Order', 'Product', 'Status', 'Total', 'Action']} rows={orders.map((order) => [order.id, order.product, order.status, `$${order.total.toFixed(2)}`, 'Review'])} />;
}

function InventoryTable({ inventory }) {
  return <section className="glass-card table-panel"><div className="panel-heading"><div><span className="eyebrow">Live merchant data</span><h2>Prices and inventory</h2></div><span className="muted-copy">{inventory.length} listings</span></div><div className="table-scroll"><table><thead><tr><th>Product</th><th>Price</th><th>Online low</th><th>Stock</th><th>Status</th><th>Demand</th></tr></thead><tbody>{inventory.map((item) => <tr key={item.productId}><td><strong>{item.productTitle}</strong><small>{item.sku}</small></td><td>${item.currentPrice.toFixed(2)}</td><td>${item.onlineMinPrice.toFixed(2)}</td><td>{item.stock}</td><td><span className={`badge ${item.stock < item.minThreshold ? 'badge-warning' : 'badge-success'}`}>{item.status}</span></td><td>{item.demandTrend}</td></tr>)}</tbody></table></div></section>;
}

function AnalyticsPanel({ analytics }) {
  if (!analytics) return <LoadingPanel />;
  return <section className="metric-grid"><Metric title="Average order value" value={`$${analytics.avgOrderValue.toFixed(2)}`} /><Metric title="Pickup fulfillment" value={analytics.pickupFulfillmentRate} /><Metric title="Weekly revenue" value={`$${analytics.weeklySalesTrend.reduce((sum, item) => sum + item.revenue, 0).toLocaleString()}`} /></section>;
}

function AdminOverview({ stats }) {
  if (!stats) return <LoadingPanel />;
  return <><div className="metric-grid"><Metric title="Total users" value={stats.totalUsers.toLocaleString()} /><Metric title="Active products" value={stats.totalActiveProducts.toLocaleString()} /><Metric title="Daily updates" value={stats.totalDailyPriceUpdates.toLocaleString()} /><Metric title="Feed health" value={stats.feedHealthScore} /></div><div className="portal-columns"><section className="glass-card portal-panel"><h2>Open issues</h2><p>{stats.pendingStoreVerifications} store verifications pending.</p><p>{stats.priceAnomaliesDetected} price anomalies need review.</p></section><section className="glass-card portal-panel"><h2>Comparison integrity</h2><p className="success-text">Retailer feeds are operating within expected update windows.</p></section></div></>;
}

function FeedTable({ stores }) { return <Table title="Retailer feed health" headers={['Retailer', 'Type', 'Status', 'Last sync', 'Indexed']} rows={stores.map((store) => [store.name, store.type, store.status, store.lastSync, store.itemsIndexed.toLocaleString()])} />; }
function MatchTable({ matches }) { return <Table title="Product matching queue" headers={['Candidate', 'Suggested match', 'Confidence', 'Status']} rows={matches.map((match) => [match.candidateTitle, match.suggestedMatch, `${Math.round(match.confidenceScore * 100)}%`, match.status])} />; }
function UserTable({ users }) { return <Table title="User management" headers={['Name', 'Email', 'Role', 'Status', 'Joined', 'Action']} rows={users.map((user) => [user.name, user.email, user.role, user.status, user.joined, 'Manage'])} />; }
function ProductAdminTable({ products }) { return <Table title="Catalog products" headers={['Product', 'Brand', 'Category', 'Offers', 'Rating', 'Action']} rows={products.map((product) => [product.title, product.brand, product.category, product.offers.length, product.rating, 'Review'])} />; }
function OfferAdminTable({ products }) { return <Table title="Offer monitoring" headers={['Product', 'Seller', 'Price', 'Stock', 'Availability', 'Action']} rows={products.flatMap((product) => product.offers.slice(0, 2).map((offer) => [product.title, offer.retailerName, `$${offer.price.toFixed(2)}`, offer.stockCount, offer.availability, 'Inspect']))} />; }
function ReportsPanel({ stats }) { return <section className="portal-columns"><div className="glass-card portal-panel"><span className="eyebrow">Operational reports</span><h2>Reports and issues</h2><p>{stats?.priceAnomaliesDetected || 0} price anomalies require review.</p><p>{stats?.pendingStoreVerifications || 0} seller verifications are pending.</p></div><div className="glass-card portal-panel"><span className="eyebrow">System status</span><h2>Feed health</h2><p className="success-text">All demo retailer feeds are within their expected update windows.</p></div></section>; }
function Table({ title, headers, rows }) {
  const [query, setQuery] = useState('');
  const [sortIndex, setSortIndex] = useState(0);
  const [page, setPage] = useState(0);
  const pageSize = 6;
  const filteredRows = rows.filter((row) => row.some((cell) => String(cell).toLowerCase().includes(query.toLowerCase())));
  const sortedRows = [...filteredRows].sort((a, b) => String(a[sortIndex]).localeCompare(String(b[sortIndex])));
  const pageCount = Math.max(1, Math.ceil(sortedRows.length / pageSize));
  const pageRows = sortedRows.slice(page * pageSize, page * pageSize + pageSize);

  return <section className="glass-card table-panel">
    <div className="panel-heading"><div><h2>{title}</h2><span className="muted-copy">Demo data · {filteredRows.length} records</span></div><input className="table-search" value={query} onChange={(event) => { setQuery(event.target.value); setPage(0); }} placeholder="Search records" aria-label={`Search ${title}`} /></div>
    <div className="table-scroll"><table><thead><tr>{headers.map((header, index) => <th key={header}><button className="table-sort" onClick={() => setSortIndex(index)}>{header}{sortIndex === index ? ' ↑' : ''}</button></th>)}</tr></thead><tbody>{pageRows.map((row, rowIndex) => <tr key={rowIndex}>{row.map((cell, cellIndex) => <td key={cellIndex}>{cellIndex === row.length - 1 && ['Manage', 'Review', 'Inspect', 'Action'].includes(String(cell)) ? <button className="btn btn-outline btn-sm">{cell}</button> : cell}</td>)}</tr>)}</tbody></table></div>
    <div className="table-pagination"><span>Page {page + 1} of {pageCount}</span><div><button className="btn btn-secondary btn-sm" disabled={page === 0} onClick={() => setPage((current) => Math.max(0, current - 1))}>Previous</button><button className="btn btn-secondary btn-sm" disabled={page >= pageCount - 1} onClick={() => setPage((current) => Math.min(pageCount - 1, current + 1))}>Next</button></div></div>
  </section>;
}
function Metric({ title, value, icon }) { return <article className="metric-card glass-card">{icon && <span className="metric-icon">{icon}</span>}<span className="metric-label">{title}</span><strong>{value}</strong></article>; }
function LoadingPanel() { return <div className="glass-card loading-panel">Loading workspace data...</div>; }
function PageHeading({ icon, eyebrow, title, description }) { return <header className="portal-heading"><span className="section-icon">{icon}</span><div><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p>{description}</p></div></header>; }
function EmptyState({ title, description, action, onClick }) { return <div className="glass-card empty-state"><h2>{title}</h2><p>{description}</p><button className="btn btn-primary" onClick={onClick}>{action}</button></div>; }
function NotFoundPage({ onNavigate }) { return <section className="container empty-state"><h1>That page is not available</h1><p>Use the comparison flow to find a product and compare its live offers.</p><button className="btn btn-primary" onClick={() => onNavigate('')}>Back to home</button></section>; }

export default function AppRouter() {
  return (
    <BrowserRouter>
      <RoutedApp />
    </BrowserRouter>
  );
}
