const defaultArticles = [
  { id: 1, category: 'Portrait', title: 'The patience of a craft', excerpt: 'In her studio, Awa transforms raw materials with rare attention.', price: 150, color: 'terracotta' },
  { id: 2, category: 'Society', title: 'The cities we imagine', excerpt: 'Three voices share the new gestures bringing neighborhoods closer.', price: 120, color: 'ochre' },
  { id: 3, category: 'Culture', title: 'A taste for passing it on', excerpt: 'A conversation about what we preserve, and what we choose to share.', price: 100, color: 'sage' }
];
let articles = loadArticles();
const $ = (selector) => document.querySelector(selector);

function loadArticles() {
  return (JSON.parse(localStorage.getItem('naya-articles') || 'null') || defaultArticles).map((article, index) => ({ ...article, price: article.price || defaultArticles[index]?.price || 100 }));
}

function save() { localStorage.setItem('naya-articles', JSON.stringify(articles)); }
function formatPrice(price) { return `$${Number(price || 0).toLocaleString('en-US')}`; }
function renderPublic() {
  $('#article-grid').innerHTML = articles.map((article, index) => `<article class="article-card ${index === 0 ? 'article-card-featured' : ''}"><div class="article-cover ${article.color}"${article.image ? ` style="background-image:url('${article.image}')"` : ''}><span>${article.category.toUpperCase()}</span><b class="cover-number">0${index + 1}</b></div><div class="article-info"><div><h3>${article.title}</h3><p>${article.excerpt}</p></div><strong class="article-price">${formatPrice(article.price)}</strong></div></article>`).join('');
  $('#article-count').textContent = `${String(articles.length).padStart(2, '0')} puppies`;
}

function setActiveTab(tabId) {
  document.querySelectorAll('.tab-button').forEach((button) => button.classList.toggle('active', button.dataset.tab === tabId));
  document.querySelectorAll('.tab-panel').forEach((panel) => panel.classList.toggle('active', panel.id === tabId));
}

function initTabs() {
  document.querySelectorAll('.tab-button').forEach((button) => {
    button.addEventListener('click', () => {
      const tabId = button.dataset.tab;
      setActiveTab(tabId);
      const target = document.getElementById(tabId);
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  });

  window.addEventListener('hashchange', () => {
    const hash = window.location.hash.slice(1);
    if (hash && document.getElementById(hash)) {
      setActiveTab(hash);
    }
  });

  const initialHash = window.location.hash.slice(1);
  if (initialHash && document.getElementById(initialHash)) {
    setActiveTab(initialHash);
  }
}

renderPublic();
initTabs();

window.addEventListener('storage', (event) => {
  if (event.key === 'naya-articles') {
    articles = loadArticles();
    renderPublic();
  }
});
window.addEventListener('pageshow', () => {
  articles = loadArticles();
  renderPublic();
});