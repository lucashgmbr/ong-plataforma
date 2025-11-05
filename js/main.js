/* Menu principal */
const toggle = document.querySelector('.nav-toggle');
const menu = document.getElementById('menu');
if (toggle && menu){
  toggle.addEventListener('click', () => {
    const expanded = menu.getAttribute('aria-expanded') === 'true';
    menu.setAttribute('aria-expanded', String(!expanded));
    toggle.setAttribute('aria-expanded', String(!expanded));
  });
}

/* Submenu (desktop + mobile) */
document.querySelectorAll('.has-submenu').forEach(li => {
  const btn = li.querySelector('button');
  const submenu = li.querySelector('.submenu');
  const toggleSub = () => {
    const expanded = li.getAttribute('aria-expanded') === 'true';
    li.setAttribute('aria-expanded', String(!expanded));
    btn.setAttribute('aria-expanded', String(!expanded));
  };
  btn?.addEventListener('click', toggleSub);
  li.addEventListener('mouseenter', () => { if (window.matchMedia('(min-width: 641px)').matches){ li.setAttribute('aria-expanded','true'); } });
  li.addEventListener('mouseleave', () => { if (window.matchMedia('(min-width: 641px)').matches){ li.setAttribute('aria-expanded','false'); } });
});

/* Máscaras simples (CPF, telefone, CEP) */
function onlyDigits(v){ return v.replace(/\D/g, ''); }
function maskCPF(v){ v = onlyDigits(v).slice(0,11);
  return v.replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}
function maskPhone(v){ v = onlyDigits(v).slice(0,11);
  if (v.length <= 10){
    return v.replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{4})(\d)/, '$1-$2');
  } else {
    return v.replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{5})(\d)/, '$1-$2');
  }
}
function maskCEP(v){ v = onlyDigits(v).slice(0,8);
  return v.replace(/(\d{5})(\d)/, '$1-$2');
}
['cpf','telefone','cep'].forEach(id=>{
  const el=document.getElementById(id);
  if(el){
    const f = id==='cpf'?maskCPF:id==='telefone'?maskPhone:maskCEP;
    ['input','blur'].forEach(ev=>el.addEventListener(ev, e=> e.target.value = f(e.target.value)));
  }
});

/* Validação nativa + feedback acessível */
const form = document.getElementById('form-cadastro');
if (form){
  const status = document.getElementById('status');
  form.addEventListener('submit', (e) => {
    if (!form.checkValidity()){
      e.preventDefault();
      status.textContent = 'Por favor, corrija os campos destacados.';
      status.style.color = '#fbbf24';
    } else {
      e.preventDefault();
      status.textContent = 'Cadastro enviado com sucesso! (demonstração)';
      status.style.color = '#90ee90';
      form.reset();
    }
  });
}

/* Toast */
const toastStack = document.getElementById('toasts');
document.getElementById('btn-toast')?.addEventListener('click', () => {
  const t = document.createElement('div');
  t.className = 'toast';
  t.textContent = 'Ação concluída com sucesso.';
  toastStack?.appendChild(t);
  setTimeout(()=>{ t.remove(); }, 3500);
});

/* Modal */
const modal = document.getElementById('modal');
const openModal = () => modal?.classList.add('modal-show');
const closeModal = () => modal?.classList.remove('modal-show');
document.getElementById('open-modal')?.addEventListener('click', openModal);
document.getElementById('close-modal')?.addEventListener('click', closeModal);
document.getElementById('dismiss-modal')?.addEventListener('click', closeModal);
modal?.addEventListener('click', (e)=>{ if(e.target === modal) closeModal(); });


// Abrir/fechar múltiplos modais por data-modal
document.querySelectorAll('.js-open-modal').forEach(btn=>{
  btn.addEventListener('click', (e)=>{
    e.preventDefault();
    const id = btn.dataset.modal;
    const el = document.getElementById('modal-'+id);
    el?.classList.add('modal-show');
  });
});
document.querySelectorAll('.js-close-modal').forEach(btn=>{
  btn.addEventListener('click', ()=> btn.closest('.modal-backdrop')?.classList.remove('modal-show'));
});

// Copiar PIX e mostrar toast
function showToast(msg){
  const stack = document.getElementById('toasts');
  if(!stack) return;
  const t = document.createElement('div');
  t.className = 'toast';
  t.textContent = msg;
  stack.appendChild(t);
  setTimeout(()=>t.remove(), 3000);
}
document.querySelectorAll('.js-copy-pix').forEach(btn=>{
  btn.addEventListener('click', async ()=>{
    const pix = btn.dataset.pix;
    try{ await navigator.clipboard.writeText(pix); showToast('Chave PIX copiada!'); }
    catch{ showToast('Não foi possível copiar.'); }
  });
});

// Newsletter -> toast de confirmação e fechar modal
document.getElementById('form-newsletter')?.addEventListener('submit', (e)=>{
  e.preventDefault();
  const email = document.getElementById('news-email').value.trim();
  if(!email){ return; }
  showToast('Inscrição confirmada para ' + email);
  document.getElementById('modal-newsletter')?.classList.remove('modal-show');
});

// Cadastro -> alert success visível + status ARIA
const alertSuccess = document.getElementById('alert-success');
if (alertSuccess && form){
  form.addEventListener('submit', (e)=>{
    if (form.checkValidity()){
      alertSuccess.classList.remove('hidden');
      setTimeout(()=>alertSuccess.classList.add('hidden'), 4000);
    }
  });
}
