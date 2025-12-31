// question list
const questions = [
  { id: 'q1', img: 'img1.jpg', text: 'Le questionnaire va montrer des photos, tu n as rien a faire pour linstant. Passe a la prochaine image quand tu veux', type: 'text' },
  { id: 'q2', img: 'img2.jpg', text: 'Passe a la suite quand tu veux', type: 'text' },
  { id: 'q3', img: 'img3.jpg', text: 'Passe a la suite quand tu veux', type: 'text' },
  { id: 'q4', text: 'Pour toi, les plantes sont...:', type: 'radio',
    choices: ['A','B','C'] },
];

let current = 0;
let startTime = null;
let sessionId = sessionStorage.getItem('session')
               || (sessionStorage.setItem('session', crypto.randomUUID()), crypto.randomUUID());

function renderQuestion(i) {
  const q = questions[i];
  const container = document.getElementById('app');
  container.innerHTML = `
    <h2>${q.text}</h2>
    ${q.img ? `<img src="${q.img}" alt="" style="max-width:100%;">` : ''}
    ${q.type === 'text'
      ? `<input id="ans" type="text">`
      : `<div>${q.choices.map(c=>`<label><input type="radio" name="ans" value="${c}"> ${c}</label>`).join(' ')}</div>`
    }
    <button id="next">Next</button>
  `;
  startTime = Date.now();

  document.getElementById('next').onclick = () => submitAnswer(i);
}

async function submitAnswer(i) {
  const q = questions[i];
  const elapsed = Date.now() - startTime;
  const ansEl = document.querySelector('#ans') ||
                document.querySelector('input[name="ans"]:checked');
  const answer = ansEl ? ansEl.value : '';

  // POST to Netlify Function
  await fetch('/api/save', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      session_id: sessionId,
      question_id: q.id,
      answer,
      elapsed_ms: elapsed
    })
  });

  // Move to next question or finish
  if (i + 1 < questions.length) renderQuestion(i + 1);
  else document.getElementById('app').innerHTML = '<h2>Merci!</h2>';
}

// Kick‑off
renderQuestion(0);
