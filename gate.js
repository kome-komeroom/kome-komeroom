// 簡易パスワードゲート（本格的なセキュリティではなく、合言葉を知っている人だけへの目印です）
function initGate(roomId, correctPassword) {
  const sessionKey = 'gate_' + roomId;
  const gate = document.getElementById('gate');
  const content = document.getElementById('gated-content');
  const input = document.getElementById('gate-input');
  const btn = document.getElementById('gate-btn');
  const err = document.getElementById('gate-error');

  function unlock() {
    gate.style.display = 'none';
    content.style.display = 'block';
  }

  if (sessionStorage.getItem(sessionKey) === 'ok') {
    unlock();
    return;
  }

  function tryUnlock() {
    if (input.value === correctPassword) {
      sessionStorage.setItem(sessionKey, 'ok');
      unlock();
    } else {
      err.textContent = 'ちがうみたい……もう一度どうぞ。';
      input.value = '';
      input.focus();
    }
  }

  btn.addEventListener('click', tryUnlock);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') tryUnlock();
  });
}
