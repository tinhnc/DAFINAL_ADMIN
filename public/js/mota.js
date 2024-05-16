const Quill = require('quill');

const editor = new Quill('#editor', {
  theme: 'snow' // Chọn theme cho Quill (ví dụ: 'snow', 'bubble')
});

editor.on('text-change', function(delta, oldDelta, source) {
  if (source === 'user') {
    const html = editor.root.innerHTML;
    document.getElementById('hiddenInput').value = html; // Cập nhật nội dung vào textarea ẩn
  }
});