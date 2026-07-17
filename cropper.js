// シンプルな画像クロッパー(ドラッグで位置調整・スライダーでズーム)
// 使い方: openCropper(file, (dataUrl) => { ... });
function openCropper(file, onDone) {
  const VIEW = 240;   // 表示上のビューポートサイズ
  const OUT = 200;    // 書き出しサイズ

  const overlay = document.createElement('div');
  overlay.className = 'cropper-overlay';

  const box = document.createElement('div');
  box.className = 'cropper-box';

  const title = document.createElement('p');
  title.className = 'cropper-title';
  title.textContent = 'アイコンの範囲をえらぶ';

  const viewport = document.createElement('div');
  viewport.className = 'cropper-viewport';
  viewport.style.width = VIEW + 'px';
  viewport.style.height = VIEW + 'px';

  const img = document.createElement('img');
  img.className = 'cropper-img';
  viewport.appendChild(img);

  const zoomRow = document.createElement('div');
  zoomRow.className = 'cropper-zoom-row';
  const zoomSlider = document.createElement('input');
  zoomSlider.type = 'range';
  zoomSlider.min = '100';
  zoomSlider.max = '300';
  zoomSlider.value = '100';
  zoomRow.appendChild(zoomSlider);

  const btnRow = document.createElement('div');
  btnRow.className = 'cropper-btn-row';
  const cancelBtn = document.createElement('button');
  cancelBtn.className = 'echat-btn';
  cancelBtn.textContent = 'キャンセル';
  const okBtn = document.createElement('button');
  okBtn.className = 'echat-btn primary';
  okBtn.textContent = 'これにする';
  btnRow.appendChild(cancelBtn);
  btnRow.appendChild(okBtn);

  box.appendChild(title);
  box.appendChild(viewport);
  box.appendChild(zoomRow);
  box.appendChild(btnRow);
  overlay.appendChild(box);
  document.body.appendChild(overlay);

  let naturalW = 0, naturalH = 0;
  let coverScale = 1;
  let scale = 1;
  let offX = 0, offY = 0; // 画像左上のビューポート内での位置
  let dragging = false;
  let startX = 0, startY = 0, startOffX = 0, startOffY = 0;

  function applyTransform() {
    img.style.width = (naturalW * scale) + 'px';
    img.style.height = (naturalH * scale) + 'px';
    img.style.left = offX + 'px';
    img.style.top = offY + 'px';
  }

  function clampOffset() {
    const w = naturalW * scale;
    const h = naturalH * scale;
    const minX = VIEW - w;
    const minY = VIEW - h;
    offX = Math.min(0, Math.max(minX, offX));
    offY = Math.min(0, Math.max(minY, offY));
  }

  const reader = new FileReader();
  reader.onload = (ev) => {
    img.onload = () => {
      naturalW = img.naturalWidth;
      naturalH = img.naturalHeight;
      coverScale = Math.max(VIEW / naturalW, VIEW / naturalH);
      scale = coverScale;
      offX = (VIEW - naturalW * scale) / 2;
      offY = (VIEW - naturalH * scale) / 2;
      applyTransform();
    };
    img.src = ev.target.result;
  };
  reader.readAsDataURL(file);

  function pointerDown(x, y) {
    dragging = true;
    startX = x; startY = y;
    startOffX = offX; startOffY = offY;
  }
  function pointerMove(x, y) {
    if (!dragging) return;
    offX = startOffX + (x - startX);
    offY = startOffY + (y - startY);
    clampOffset();
    applyTransform();
  }
  function pointerUp() { dragging = false; }

  viewport.addEventListener('mousedown', (e) => pointerDown(e.clientX, e.clientY));
  window.addEventListener('mousemove', (e) => pointerMove(e.clientX, e.clientY));
  window.addEventListener('mouseup', pointerUp);
  viewport.addEventListener('touchstart', (e) => {
    const t = e.touches[0];
    pointerDown(t.clientX, t.clientY);
  }, { passive: true });
  viewport.addEventListener('touchmove', (e) => {
    const t = e.touches[0];
    pointerMove(t.clientX, t.clientY);
  }, { passive: true });
  viewport.addEventListener('touchend', pointerUp);

  zoomSlider.addEventListener('input', () => {
    const centerX = VIEW/2, centerY = VIEW/2;
    const imgX = (centerX - offX) / scale;
    const imgY = (centerY - offY) / scale;
    scale = coverScale * (zoomSlider.value / 100);
    offX = centerX - imgX * scale;
    offY = centerY - imgY * scale;
    clampOffset();
    applyTransform();
  });

  function close() {
    document.body.removeChild(overlay);
  }

  cancelBtn.addEventListener('click', close);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) close();
  });

  okBtn.addEventListener('click', () => {
    const canvas = document.createElement('canvas');
    canvas.width = OUT;
    canvas.height = OUT;
    const ctx = canvas.getContext('2d');
    const ratio = OUT / VIEW;
    ctx.drawImage(
      img,
      0, 0, naturalW, naturalH,
      offX * ratio, offY * ratio, naturalW * scale * ratio, naturalH * scale * ratio
    );
    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
    close();
    onDone(dataUrl);
  });
}
