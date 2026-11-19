const catalogue = document.querySelector('#products');
const filters = document.querySelector('#filters');
const search = document.querySelector('#search');
const groups = ['Tất cả', ...new Set(products.map(p => p.group))];
const tones = ['#eaf1e4','#f7ebdf','#e5f0f0','#f4e8ee'];
const money = new Intl.NumberFormat('vi-VN');
const fold = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replaceAll('đ','d');
let selected = groups[0];
function element(tag, className, content) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (content) node.textContent = content;
  return node;
}
function render() {
  const term = fold(search.value.trim());
  const visible = products.filter(p => (selected === groups[0] || selected === p.group) && fold([p.name,p.size,p.group].join(' ')).includes(term));
  catalogue.replaceChildren();
  document.querySelector('#count').textContent = visible.length + ' sản phẩm';
  for (const p of visible) {
    const card = element('article','card');
    const photo = element('div','photo');
    photo.style.setProperty('--tone',tones[products.indexOf(p)%tones.length]);
    if(p.image) {
      const img = element('img'); img.src=p.image; img.alt=p.name; img.loading='lazy'; photo.append(img);
    } else { photo.append(element('span','brand','SAHAKA')); }
    const body = element('div','details');
    body.append(element('p','meta',p.size),element('h3','',p.name));
    const buy = element('div','buy');
    const contact = element('a','','Hỏi mua'); contact.href='https://zalo.me/0937314745'; contact.target='_blank'; contact.rel='noopener'; contact.setAttribute('aria-label','Hỏi mua '+p.name+' qua Zalo');
    buy.append(element('span','price',p.price ? money.format(p.price)+' đ' : 'Liên hệ giá'),contact);
    body.append(buy); card.append(photo,body); catalogue.append(card);
  }
  if (!visible.length) catalogue.append(element('p','empty','Chưa tìm thấy sản phẩm. Bạn thử tên khác hoặc chọn “Tất cả” nhé.'));
}
for (const group of groups) {
  const button = element('button','',group); button.type='button'; button.setAttribute('aria-pressed',String(group===selected));
  button.addEventListener('click',()=>{selected=group; for(const item of filters.children) item.setAttribute('aria-pressed',String(item===button)); render();});
  filters.append(button);
}
search.addEventListener('input', render);
for (const path of heroImages) { const img=element('img'); img.src=path; img.alt=''; document.querySelector('#hero-images').append(img); }
render();
