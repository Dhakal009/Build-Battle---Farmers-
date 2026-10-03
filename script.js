const providers=[
 {id:1,name:'Maya Rai',skill:'Electrician',category:'Home & Garden',level:'professional',demand:'high',rating:'4.9',reviews:48,distance:'1.2 km',price:'NPR 800',availability:'Available today',avatar:'👩🏽‍🔧',verified:true,experience:'8 years',completed:'126',bio:'Reliable home electrical repairs, installations and safety checks. I bring my own tools and explain the fix clearly.'},
 {id:2,name:'Aarav Sharma',skill:'Computer Repair',category:'Tech & Design',level:'intermediate',demand:'high',rating:'4.8',reviews:32,distance:'2.4 km',price:'NPR 600',availability:'Available tomorrow',avatar:'👨🏻‍💻',verified:true,experience:'5 years',completed:'84',bio:'Laptop tune-ups, software setup and patient help for people who want to understand their tech.'},
 {id:3,name:'Nisha Karki',skill:'Math Tutoring',category:'Learning',level:'professional',demand:'medium',rating:'5.0',reviews:27,distance:'0.8 km',price:'NPR 500/hr',availability:'Open this week',avatar:'👩🏻‍🏫',verified:true,experience:'6 years',completed:'73',bio:'Friendly, practical math tutoring for grades 6–12. We will build confidence one problem at a time.'},
 {id:4,name:'Rohan Thapa',skill:'Home Cleaning',category:'Home & Garden',level:'junior',demand:'medium',rating:'4.7',reviews:19,distance:'1.8 km',price:'NPR 900',availability:'Available today',avatar:'🧹',verified:false,experience:'4 years',completed:'51',bio:'Detailed, dependable home cleaning with flexible bookings for busy households.'},
 {id:5,name:'Saanvi Joshi',skill:'Graphic Design',category:'Tech & Design',level:'professional',demand:'high',rating:'4.9',reviews:36,distance:'3.1 km',price:'NPR 1,200',availability:'Open this week',avatar:'👩🏻‍🎨',verified:true,experience:'7 years',completed:'96',bio:'Branding, social graphics and thoughtful visual identities for small local businesses.'},
 {id:6,name:'Bikash Gurung',skill:'Bike Repair',category:'Transport',level:'intermediate',demand:'low',rating:'4.8',reviews:41,distance:'2.0 km',price:'NPR 400',availability:'Available today',avatar:'🧰',verified:false,experience:'9 years',completed:'142',bio:'Quick bicycle repairs and honest advice. Workshop pickup available around the neighborhood.'}
];
const creditRates={junior:1,intermediate:1.5,professional:2.2},demandMultipliers={low:.85,medium:1,high:1.25};
function calculateCredits(level='intermediate',demand='medium'){return Math.round(creditRates[level]*demandMultipliers[demand]*10)/10}
const categories=['All services','Home & Garden','Tech & Design','Learning','Transport','Health & Beauty'];
const savedProvider=JSON.parse(localStorage.getItem('skillswap-provider')||'null');
if(savedProvider) providers.unshift(savedProvider);
const grid=document.querySelector('#providerGrid'),categoryRow=document.querySelector('#categoryRow'),searchInput=document.querySelector('#searchInput'),resultCount=document.querySelector('#resultCount'),sortSelect=document.querySelector('#sortSelect'),availabilityFilter=document.querySelector('#availabilityFilter'),distanceFilter=document.querySelector('#distanceFilter');
let activeCategory='All services',activeSearch='';
categoryRow.innerHTML=categories.map((category,index)=>`<button class="category ${index===0?'active':''}" data-category="${category}" type="button">${category}</button>`).join('');
function renderProviders(){
 const matches=providers.filter(provider=>{
  const term=[provider.name,provider.skill,provider.category,provider.bio].join(' ').toLowerCase();
  const distance=parseFloat(provider.distance);
  const available=availabilityFilter.value==='all'||(availabilityFilter.value==='today'?provider.availability.includes('today'):provider.availability.includes('week')||provider.availability.includes('today'));
  const nearby=distanceFilter.value==='all'||distance<=Number(distanceFilter.value);
  return(activeCategory==='All services'||provider.category===activeCategory)&&(activeSearch===''||term.includes(activeSearch.toLowerCase()))&&available&&nearby;
 });
 matches.sort((a,b)=>sortSelect.value==='rating'?Number(b.rating)-Number(a.rating):sortSelect.value==='distance'?parseFloat(a.distance)-parseFloat(b.distance):sortSelect.value==='price'?parseFloat(a.price.replace(/[^0-9.]/g,''))-parseFloat(b.price.replace(/[^0-9.]/g,'')):a.id-b.id);
 resultCount.textContent=matches.length?`${matches.length} trusted provider${matches.length===1?'':'s'} nearby`:'No matches yet — try another service';
 grid.innerHTML=matches.length?matches.map(provider=>`<article class="provider-card"><span class="verified">${provider.verified?'✓ Verified':''}</span><div class="provider-head"><span class="avatar">${provider.avatar}</span><div><h3>${provider.name}</h3><p class="role">${provider.skill}</p></div></div><p class="rating"><b>★ ${provider.rating}</b> <span>(${provider.reviews} reviews)</span></p><div class="provider-info"><span>LOCATION<strong>📍 ${provider.distance}</strong></span><span>FROM<strong>${provider.price}</strong></span></div><div class="credit-line"><b>✦ ${calculateCredits(provider.level,provider.demand)} credits</b><span>${provider.level} · ${provider.demand} demand</span></div><div class="card-bottom"><span class="available">● ${provider.availability}</span><button data-provider="${provider.id}" type="button">View profile</button></div></article>`).join(''):`<div class="empty-state"><h3>We couldn't find that yet.</h3><p>Try “electrician”, “tutoring”, or clear a filter above.</p></div>`;
}
function closeModal(modal){if(!modal.open)return;modal.classList.add('closing');setTimeout(()=>{modal.classList.remove('closing');modal.close()},180)}
function openProfile(id){const provider=providers.find(item=>item.id===Number(id)),modal=document.querySelector('#providerModal');document.querySelector('#providerDetails').innerHTML=`<div class="profile-large"><span class="avatar">${provider.avatar}</span><div><h2>${provider.name}</h2><p>${provider.skill} · ${provider.distance} away</p><b class="rating">★ ${provider.rating} <span>(${provider.reviews} reviews)</span></b></div></div><p class="profile-copy">${provider.bio}</p><div class="profile-stats"><div><b>${provider.experience}</b><small>experience</small></div><div><b>${provider.completed}</b><small>completed</small></div><div><b>${calculateCredits(provider.level,provider.demand)} ✦</b><small>credits / service</small></div></div><div class="profile-credit-note">${provider.level} provider · ${provider.demand} local demand</div><p class="available">● ${provider.availability}</p><button class="button button-dark" data-request="${provider.id}" type="button">Request service</button>`;modal.showModal()}
function openRequest(id){const provider=providers.find(item=>item.id===Number(id)),modal=document.querySelector('#requestModal');document.querySelector('#requestContent').innerHTML=`<h2>Request ${provider.skill}</h2><p>Send a request to <strong>${provider.name}</strong>. They usually reply within an hour.</p><form class="request-form" id="requestForm"><label>Date<input type="date" name="date" required></label><label>Preferred time<input type="time" name="time" required></label><label>What do you need help with?<textarea name="description" rows="3" required placeholder="Give ${provider.name} a little context..."></textarea><button class="button button-dark" type="submit">Send request</button></form>`;modal.showModal();document.querySelector('#requestForm').addEventListener('submit',event=>{event.preventDefault();document.querySelector('#requestContent').innerHTML=`<div class="status"><b>Request sent ✓</b><span class="status-step active">● Pending</span> &nbsp; <span class="status-step">○ Accepted</span> &nbsp; <span class="status-step">○ Completed</span></div><h2>${provider.name} has your request.</h2><p>We’ll let you know when they accept.</p><button class="button button-dark" id="doneRequest" type="button">Done</button>`;document.querySelector('#doneRequest').addEventListener('click',()=>closeModal(modal))})}
renderProviders();
document.querySelector('#searchForm').addEventListener('submit',event=>{event.preventDefault();activeSearch=searchInput.value.trim();document.querySelector('#discover').scrollIntoView({behavior:'smooth'});renderProviders()});
categoryRow.addEventListener('click',event=>{const button=event.target.closest('.category');if(!button)return;activeCategory=button.dataset.category;document.querySelectorAll('.category').forEach(item=>item.classList.toggle('active',item===button));renderProviders()});
document.querySelector('#filterButton').addEventListener('click',event=>{const panel=document.querySelector('#filterPanel');panel.hidden=!panel.hidden;event.currentTarget.setAttribute('aria-expanded',String(!panel.hidden))});
document.querySelector('#clearFilters').addEventListener('click',()=>{availabilityFilter.value='all';distanceFilter.value='all';sortSelect.value='recommended';renderProviders()});
availabilityFilter.addEventListener('change',renderProviders);
distanceFilter.addEventListener('change',renderProviders);
sortSelect.addEventListener('change',renderProviders);
grid.addEventListener('click',event=>{const button=event.target.closest('[data-provider]');if(button)openProfile(button.dataset.provider)});
document.querySelector('#providerDetails').addEventListener('click',event=>{const button=event.target.closest('[data-request]');if(button){closeModal(document.querySelector('#providerModal'));setTimeout(()=>openRequest(button.dataset.request),180)}});
document.querySelector('#modalClose').addEventListener('click',()=>closeModal(document.querySelector('#providerModal')));
document.querySelector('#requestClose').addEventListener('click',()=>closeModal(document.querySelector('#requestModal')));
document.querySelector('#offer').addEventListener('click',event=>{if(event.target.closest('a[href="#offer-form"]')){event.preventDefault();document.querySelector('#offer-form').classList.remove('hidden');document.querySelector('#offer-form').scrollIntoView({behavior:'smooth'})}});
const levelSelect=document.querySelector('#levelSelect'),demandSelect=document.querySelector('#demandSelect'),creditPreview=document.querySelector('#creditPreview');
function updateCreditPreview(){creditPreview.querySelector('strong').textContent=`${calculateCredits(levelSelect.value,demandSelect.value)} credits`;creditPreview.querySelector('small').textContent=`${levelSelect.options[levelSelect.selectedIndex].text.split(' · ')[0]} level · ${demandSelect.options[demandSelect.selectedIndex].text.replace(' demand','')} demand`};
levelSelect.addEventListener('change',updateCreditPreview);demandSelect.addEventListener('change',updateCreditPreview);updateCreditPreview();
document.querySelector('#offer-form').addEventListener('submit',event=>{event.preventDefault();const formData=new FormData(event.target);const newProvider={id:0,name:'You',skill:formData.get('skill'),category:formData.get('category'),level:formData.get('level'),demand:formData.get('demand'),rating:'New',reviews:0,distance:'0.0 km',price:formData.get('price'),availability:formData.get('availability'),avatar:'✨',verified:false,experience:'New provider',completed:'0',bio:formData.get('description')};providers.unshift(newProvider);localStorage.setItem('skillswap-provider',JSON.stringify(newProvider));activeCategory='All services';activeSearch='';searchInput.value='';document.querySelectorAll('.category').forEach((item,index)=>item.classList.toggle('active',index===0));document.querySelector('#offerSuccess').textContent=`Your skill is live at ${calculateCredits(newProvider.level,newProvider.demand)} credits per service.`;event.target.reset();updateCreditPreview();renderProviders();document.querySelector('#discover').scrollIntoView({behavior:'smooth'})});
document.querySelector('#menuToggle').addEventListener('click',event=>{const open=document.querySelector('#navLinks').classList.toggle('open');event.currentTarget.setAttribute('aria-expanded',String(open))});
document.querySelector('#year').textContent=new Date().getFullYear();
document.querySelectorAll('a[href^="#"]').forEach(link=>link.addEventListener('click',event=>{
 const target=document.querySelector(link.getAttribute('href'));if(!target)return;
 event.preventDefault();document.querySelector('#pageTransition').classList.add('active');
 setTimeout(()=>{target.scrollIntoView({behavior:'smooth',block:'start'});document.querySelector('#pageTransition').classList.remove('active')},180);
 if(document.querySelector('#navLinks').classList.contains('open')){document.querySelector('#navLinks').classList.remove('open');document.querySelector('#menuToggle').setAttribute('aria-expanded','false')}
}));

const header=document.querySelector('.site-header');
const revealItems=document.querySelectorAll('.discover,.how-it-works,.offer,.section-heading,.search-box,.category-row,.results-meta,.provider-grid,.steps,.offer-card,.offer-form');
revealItems.forEach(item=>item.classList.add(item.classList.contains('provider-grid')||item.classList.contains('steps')?'reveal-stagger':'reveal'));
const revealObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');revealObserver.unobserve(entry.target)}}),{threshold:.12,rootMargin:'0px 0px -40px'});
revealItems.forEach(item=>revealObserver.observe(item));
const sectionLinks=[...document.querySelectorAll('.nav-links a')],navSections=sectionLinks.map(link=>document.querySelector(link.getAttribute('href'))).filter(Boolean);
const navObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){sectionLinks.forEach(link=>link.classList.toggle('is-active',link.getAttribute('href')===`#${entry.target.id}`))}}),{rootMargin:'-30% 0px -55% 0px',threshold:0});
navSections.forEach(section=>navObserver.observe(section));
let scrollTick=false;
addEventListener('scroll',()=>{if(scrollTick)return;scrollTick=true;requestAnimationFrame(()=>{header.classList.toggle('is-scrolled',scrollY>24);scrollTick=false})},{passive:true});
header.classList.toggle('is-scrolled',scrollY>24);

const scrollProgress=document.querySelector('#scrollProgress');
function updateScrollProgress(){
 const scrollable=document.documentElement.scrollHeight-innerHeight;
 scrollProgress.style.width=`${scrollable>0?(scrollY/scrollable)*100:0}%`;
}
updateScrollProgress();
addEventListener('scroll',updateScrollProgress,{passive:true});

const counters=document.querySelectorAll('[data-count]');
const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;
function formatCounter(value,counter){
 const decimals=Number(counter.dataset.decimals||0);
 if(counter.dataset.format==='compact'&&value>=1000)return `${(value/1000).toFixed(value>=10000?0:1).replace('.0','')}k`;
 return value.toLocaleString(undefined,{minimumFractionDigits:decimals,maximumFractionDigits:decimals});
}
function animateCounter(counter){
 const target=Number(counter.dataset.count),duration=1400,start=performance.now();
 if(reducedMotion){counter.textContent=`${formatCounter(target,counter)}${counter.dataset.suffix||''}`;return}
 function tick(now){
  const progress=Math.min((now-start)/duration,1),eased=1-Math.pow(1-progress,3);
  counter.textContent=`${formatCounter(target*eased,counter)}${counter.dataset.suffix||''}`;
  if(progress<1)requestAnimationFrame(tick);
 }
 requestAnimationFrame(tick);
}
const counterObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){animateCounter(entry.target);counterObserver.unobserve(entry.target)}}),{threshold:.8});
counters.forEach(counter=>counterObserver.observe(counter));
