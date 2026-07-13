// Discord風の絵文字リアクションピッカー(共通スクリプト)
const REACTION_PALETTE = ['👍', '❤️', '😂', '😮', '🍙', '🎉', '🔥', '😢'];

function buildReactionBar(reactions, onPick) {
  const bar = document.createElement('div');
  bar.className = 'react-bar';

  const used = Object.keys(reactions || {}).filter(e => (reactions[e] || 0) > 0);
  used.forEach((emoji) => {
    const pill = document.createElement('button');
    pill.className = 'react-btn';
    pill.innerHTML = emoji + '<span class="react-count">' + reactions[emoji] + '</span>';
    pill.addEventListener('click', () => onPick(emoji));
    bar.appendChild(pill);
  });

  const wrap = document.createElement('div');
  wrap.className = 'react-wrap';

  const addBtn = document.createElement('button');
  addBtn.className = 'react-add-btn';
  addBtn.textContent = '+';

  const popup = document.createElement('div');
  popup.className = 'react-popup';
  popup.style.display = 'none';
  REACTION_PALETTE.forEach((emoji) => {
    const opt = document.createElement('button');
    opt.className = 'react-popup-opt';
    opt.textContent = emoji;
    opt.addEventListener('click', (e) => {
      e.stopPropagation();
      onPick(emoji);
      popup.style.display = 'none';
    });
    popup.appendChild(opt);
  });

  addBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    document.querySelectorAll('.react-popup').forEach((p) => {
      if (p !== popup) p.style.display = 'none';
    });
    popup.style.display = popup.style.display === 'none' ? 'grid' : 'none';
  });

  wrap.appendChild(addBtn);
  wrap.appendChild(popup);
  bar.appendChild(wrap);

  return bar;
}

document.addEventListener('click', () => {
  document.querySelectorAll('.react-popup').forEach((p) => { p.style.display = 'none'; });
});
