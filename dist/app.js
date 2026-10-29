const timetable=[[["19:00","Сальса · женский стиль","Диана"],["20:00","Сальса · женский стиль","Диана"],["21:00","Реггетон","Алекс"]],[["19:00","Сальса в паре","Освел"],["20:00","Кизомба в паре","Освел"],["21:00","Кизомба · практика","Освел"]],[["19:00","Dance Fit","Диана"],["20:00","Бачата · женский стиль","Диана"],["21:00","Бачата · женский стиль","Диана"]],[["19:00","Здоровая спина","Светлана"],["20:00–22:00","Творческая группа","Диана"]],[["19:00","Бачата в паре","Эрнесто"],["20:00","Бачата в паре","Эрнесто"],["21:00","Бачата · практика","Эрнесто"]],[["11:00","Здоровая спина","Светлана"]],[["[время]","[занятия в воскресенье]","[уточнить]"]]];
const dayNames=['Пн','Вт','Ср','Чт','Пт','Сб','Вс'],fullNames=['Понедельник','Вторник','Среда','Четверг','Пятница','Суббота','Воскресенье'];const days=document.querySelector('.days'),classes=document.querySelector('#classes'),choice=document.querySelector('#choice');
function selectStyle(value){const match=Array.from(choice.options).find(o=>value.toLowerCase().includes(o.value.toLowerCase()));choice.value=match?match.value:choice.options[0].value;updateChoice()}
function updateChoice(){const chosen=choice.selectedIndex?choice.value:'занятия';document.querySelector('#telegram').href='https://t.me/mang0dance?text='+encodeURIComponent('Здравствуйте! Интересуют '+chosen+'. Подскажите, пожалуйста, актуальное расписание и условия записи.');document.querySelector('#selection-note').textContent=choice.selectedIndex?'Выбрано: '+choice.value+'. Откроется Telegram с текстом, который вы сможете отправить.':'Откроется чат студии. Сообщение отправляете вы.'}
function showDay(index){days.querySelectorAll('button').forEach((b,i)=>{b.classList.toggle('active',i===index);b.setAttribute('aria-pressed',i===index?'true':'false')});classes.innerHTML=timetable[index].map(([time,title,teacher])=>'<div class="class-row"><time>'+time+'</time><h3>'+title+'</h3><p>'+teacher+'</p><a href="#start" data-class="'+title+'">Записаться ↗</a></div>').join('');classes.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>selectStyle(a.dataset.class)))}
dayNames.forEach((name,i)=>{const button=document.createElement('button');button.textContent=name;button.setAttribute('aria-label',fullNames[i]);button.addEventListener('click',()=>showDay(i));days.append(button)});showDay(0);document.querySelectorAll('[data-style]').forEach(button=>button.addEventListener('click',()=>{selectStyle(button.dataset.style);document.querySelector('#start').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'})}));document.querySelectorAll('[data-choice]').forEach(a=>a.addEventListener('click',()=>{choice.value=a.dataset.choice;updateChoice()}));choice.addEventListener('change',updateChoice);updateChoice();


// Native swipe rows retain keyboard scrolling and visible scrollbars on mobile.
document.querySelectorAll('.directions-grid,.price-grid,.faq-grid,#classes').forEach((track)=>{
  const labels={ 'directions-grid':'Направления', 'price-grid':'Стоимость', 'faq-grid':'Вопросы' };
  const label=labels[track.className]||'Занятия выбранного дня';
  track.tabIndex=0;
  track.setAttribute('role','region');
  track.setAttribute('aria-label',label+' — горизонтальная прокрутка на телефоне');
  const hint=document.createElement('p');
  hint.className='scroll-hint';
  hint.innerHTML='<span>Листайте карточки</span><span class="scroll-arrows"><button type="button" class="scroll-arrow" aria-label="'+label+': предыдущая карточка">←</button><button type="button" class="scroll-arrow" aria-label="'+label+': следующая карточка">→</button></span>';
  track.before(hint);
  const [previous,next]=hint.querySelectorAll('button');
  const refresh=()=>{
    previous.disabled=track.scrollLeft<=2;
    next.disabled=track.scrollLeft>=track.scrollWidth-track.clientWidth-2;
  };
  const move=(direction)=>{
    const cards=Array.from(track.children);
    const origin=cards[0]?.getBoundingClientRect().left||0;
    const positions=cards.map(card=>Math.max(0,card.getBoundingClientRect().left-origin));
    const current=track.scrollLeft;
    const target=direction>0?positions.find(position=>position>current+3):positions.reverse().find(position=>position<current-3);
    track.scrollTo({left:target??(direction>0?track.scrollWidth:0),behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
  };
  previous.addEventListener('click',()=>move(-1));
  next.addEventListener('click',()=>move(1));
  track.addEventListener('scroll',refresh,{passive:true});
  new ResizeObserver(refresh).observe(track);
  new MutationObserver(()=>{track.scrollLeft=0;requestAnimationFrame(refresh)}).observe(track,{childList:true});
  refresh();
});
