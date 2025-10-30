/* Acessibilidade: menu responsivo */
const toggle = document.querySelector('.nav-toggle');
const menu = document.getElementById('menu');
if (toggle && menu){
  toggle.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!expanded));
    menu.setAttribute('aria-expanded', String(!expanded));
  });
}

/* Máscaras simples (CPF, telefone, CEP) */
function onlyDigits(v){ return v.replace(/\D/g, ''); }

function maskCPF(v){
  v = onlyDigits(v).slice(0,11);
  return v
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}

function maskPhone(v){
  v = onlyDigits(v).slice(0,11);
  // (11) 98888-7777  ou (11) 3888-7777
  if (v.length <= 10){
    return v
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{4})(\d)/, '$1-$2');
  } else {
    return v
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2');
  }
}

function maskCEP(v){
  v = onlyDigits(v).slice(0,8);
  return v.replace(/(\d{5})(\d)/, '$1-$2');
}

function attachMask(id, fn){
  const el = document.getElementById(id);
  if(!el) return;
  el.addEventListener('input', e => { e.target.value = fn(e.target.value); });
  el.addEventListener('blur', e => { e.target.value = fn(e.target.value); });
}

attachMask('cpf', maskCPF);
attachMask('telefone', maskPhone);
attachMask('cep', maskCEP);

/* Validação nativa + feedback acessível */
const form = document.getElementById('form-cadastro');
if (form){
  const status = document.getElementById('status');
  form.addEventListener('submit', (e) => {
    if (!form.checkValidity()){
      e.preventDefault();
      status.textContent = 'Por favor, corrija os campos destacados.';
      status.style.color = '#ffb703';
    } else {
      e.preventDefault();
      status.textContent = 'Cadastro enviado com sucesso! (demonstração)';
      status.style.color = '#90ee90';
      form.reset();
    }
  });

  // Mostrar dica ao invalidar
  Array.from(form.elements).forEach(el => {
    el.addEventListener('invalid', () => {
      el.classList.add('invalid');
    });
    el.addEventListener('input', () => {
      if (el.checkValidity()) el.classList.remove('invalid');
    });
  });
}
