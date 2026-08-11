const defaultArticles = [
  { id: 1, category: 'Portrait', title: 'The patience of a craft', excerpt: 'In her studio, Awa transforms raw materials with rare attention.', price: 150, color: 'terracotta' },
  { id: 2, category: 'Society', title: 'The cities we imagine', excerpt: 'Three voices share the new gestures bringing neighborhoods closer.', price: 120, color: 'ochre' },
  { id: 3, category: 'Culture', title: 'A taste for passing it on', excerpt: 'A conversation about what we preserve, and what we choose to share.', price: 100, color: 'sage' }
];
let articles = (JSON.parse(localStorage.getItem('naya-articles') || 'null') || defaultArticles).map((article, index) => ({ ...article, price: article.price || defaultArticles[index]?.price || 100 }));
let editingId = null;
const $ = (selector) => document.querySelector(selector);
const formatPrice = (price) => `$${Number(price || 0).toLocaleString('en-US')}`;
const save = () => {
  localStorage.setItem('naya-articles', JSON.stringify(articles));
  localStorage.setItem('naya-articles-updated', String(Date.now()));
};
function renderManage() {
  $('#dashboard-count').textContent = String(articles.length).padStart(2, '0');
  $('#manage-list').innerHTML = articles.map((article) => `<div class="manage-item"><div><h3>${article.title}</h3><p>${article.category} · Published now</p></div><strong class="manage-price">${formatPrice(article.price)}</strong><div class="manage-actions"><button data-edit="${article.id}">Edit</button><button class="delete" data-delete="${article.id}">Delete</button></div></div>`).join('') || '<p>No published articles.</p>';
}
function openArticle(article = null) {
  editingId = article?.id || null;
  $('#dialog-title').textContent = article ? 'Edit article' : 'New article';
  $('#article-title').value = article?.title || '';
  $('#article-category').value = article?.category || '';
  $('#article-excerpt').value = article?.excerpt || '';
  $('#article-price').value = article?.price || '';
  $('#article-color').value = article?.color || 'terracotta';
  $('#article-image').value = '';
  $('#image-preview').src = article?.image || '';
  $('#image-preview').dataset.currentImage = article?.image || '';
  $('#image-preview').classList.toggle('hidden', !article?.image);
  $('#article-dialog').showModal();
}
document.addEventListener('click', (event) => {
  const editButton = event.target.closest('[data-edit]');
  if (editButton) openArticle(articles.find((article) => article.id === Number(editButton.dataset.edit)));
  const deleteButton = event.target.closest('[data-delete]');
  if (deleteButton && confirm('Delete this article?')) { articles = articles.filter((article) => article.id !== Number(deleteButton.dataset.delete)); save(); renderManage(); }
});
$('#login-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const email = $('#admin-email').value.trim().toLowerCase();
  const password = $('#admin-password').value.trim().replace(/\s+/g, ' ');
  const isAdmin = email === 'admin@gmail.com' && password === 'sun goes down';
  if (!isAdmin) return alert('Only the TIMBER CREEK GOLDEN RETRIEVERS administrator can access this area.');
  $('#login-panel').classList.add('hidden'); $('#dashboard').classList.remove('hidden'); renderManage();
});
$('#logout').addEventListener('click', () => { $('#dashboard').classList.add('hidden'); $('#login-panel').classList.remove('hidden'); $('#admin-password').value = ''; });
$('#add-article').addEventListener('click', () => openArticle());
$('#article-image').addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (!file) return;
  if (file.size > 2 * 1024 * 1024) {
    alert('Please choose an image smaller than 2 MB.');
    event.target.value = '';
    return;
  }
  const reader = new FileReader();
  reader.addEventListener('load', () => {
    $('#image-preview').src = reader.result;
    $('#image-preview').dataset.currentImage = reader.result;
    $('#image-preview').classList.remove('hidden');
  });
  reader.readAsDataURL(file);
});
$('#article-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const data = { id: editingId || Date.now(), title: $('#article-title').value, category: $('#article-category').value, excerpt: $('#article-excerpt').value, price: Number($('#article-price').value), color: $('#article-color').value, image: $('#image-preview').dataset.currentImage || '' };
  articles = editingId ? articles.map((article) => article.id === editingId ? data : article) : [data, ...articles];
  save(); renderManage(); $('#article-dialog').close();
});
