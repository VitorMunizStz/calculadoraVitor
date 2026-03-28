// JavaScript Mastery – Calculadora Científica Floresta Lunar

const display = document.getElementById('display');
const clearBtn = document.getElementById('clear');
const igualBtn = document.getElementById('igual');
const toggleSinalBtn = document.getElementById('toggle-sinal');

const botoes = document.querySelectorAll('button[data-value]');

botoes.forEach(botao => {
  botao.addEventListener('click', () => {
    const valor = botao.getAttribute('data-value');
    addToDisplay(valor);
  });
});

function addToDisplay(valor) {
  display.value += valor;
}

function limparDisplay() {
  display.value = '';
}

function toggleSinal() {
  if (display.value) {
    display.value = (parseFloat(display.value) * -1).toString();
  }
}

function calcular() {
  try {
    let expressao = display.value
      .replace(/sin\(/g, 'Math.sin(')
      .replace(/cos\(/g, 'Math.cos(')
      .replace(/tan\(/g, 'Math.tan(')
      .replace(/log\(/g, 'Math.log10(')
      .replace(/ln\(/g, 'Math.log(')
      .replace(/sqrt\(/g, 'Math.sqrt(')
      .replace(/π/g, '(Math.PI)')
      .replace(/e/g, '(Math.E)')
      .replace(/\^/g, '**')
      .replace(/÷/g, '/')
      .replace(/×/g, '*')
      .replace(/−/g, '-');

    const resultado = eval(expressao);
    display.value = Number.isFinite(resultado)
      ? Number(resultado.toFixed(8)).toString().replace(/\.?0+$/, '')
      : 'Erro';
  } catch (err) {
    display.value = 'Erro';
    setTimeout(limparDisplay, 1400);
  }
}

clearBtn.addEventListener('click', limparDisplay);
igualBtn.addEventListener('click', calcular);
toggleSinalBtn.addEventListener('click', toggleSinal);

// Suporte a teclado
document.addEventListener('keydown', e => {
  if (e.key === 'Enter' || e.key === '=') {
    e.preventDefault();
    calcular();
  }
  if (e.key === 'Escape' || e.key === 'c' || e.key === 'C') {
    limparDisplay();
  }
  if ('0123456789.+-*/()^'.includes(e.key)) {
    addToDisplay(e.key);
  }
});