document.addEventListener('DOMContentLoaded', function() {
  // 步骤折叠/展开
  document.querySelectorAll('.step-header').forEach(function(header) {
    header.addEventListener('click', function() {
      this.closest('.step').classList.toggle('open');
    });
  });

  // 生词卡片折叠
  document.querySelectorAll('.vocab-header').forEach(function(header) {
    header.addEventListener('click', function() {
      this.closest('.vocab-card').classList.toggle('open');
    });
  });

  // 例句折叠
  document.querySelectorAll('.example-toggle').forEach(function(toggle) {
    toggle.addEventListener('click', function() {
      this.closest('.example-item').classList.toggle('open');
    });
  });

  // 口头填空
  document.querySelectorAll('.blank').forEach(function(blank) {
    blank.addEventListener('click', function() {
      this.classList.toggle('revealed');
    });
  });

  // 默认展开第一步
  var firstStep = document.querySelector('.step');
  if (firstStep) firstStep.classList.add('open');

  // ===== 逐句音频 =====
  var currentSpeed = 1.0;

  document.querySelectorAll('.sentence-item').forEach(function(item) {
    var jpText = item.querySelector('.jp').textContent;
    var audioDiv = document.createElement('div');
    audioDiv.className = 'sentence-audio';

    var playBtn = document.createElement('button');
    playBtn.className = 'btn-play';
    playBtn.innerHTML = '&#9654;';
    playBtn.title = '再生';
    audioDiv.appendChild(playBtn);

    var speedGroup = document.createElement('div');
    speedGroup.className = 'speed-group';
    [0.5, 0.75, 1, 1.25].forEach(function(spd) {
      var btn = document.createElement('button');
      btn.className = 'btn-speed' + (spd === 1 ? ' active' : '');
      btn.textContent = spd === 1 ? '1x' : spd + 'x';
      btn.dataset.speed = spd;
      btn.addEventListener('click', function() {
        speedGroup.querySelectorAll('.btn-speed').forEach(function(b) { b.classList.remove('active'); });
        btn.classList.add('active');
        currentSpeed = spd;
      });
      speedGroup.appendChild(btn);
    });
    audioDiv.appendChild(speedGroup);
    item.appendChild(audioDiv);

    playBtn.addEventListener('click', function() {
      window.speechSynthesis.cancel();
      document.querySelectorAll('.btn-play').forEach(function(b) {
        b.classList.remove('playing');
        b.innerHTML = '&#9654;';
      });

      var utter = new SpeechSynthesisUtterance(jpText);
      utter.lang = 'ja-JP';
      utter.rate = currentSpeed;
      utter.pitch = 1.05;

      // 优先日语女声
      var voices = window.speechSynthesis.getVoices();
      var jaVoices = voices.filter(function(v) { return v.lang.indexOf('ja') === 0; });
      var femaleVoice = jaVoices.find(function(v) {
        var n = v.name.toLowerCase();
        return n.indexOf('kyoko') >= 0 || n.indexOf('o-ren') >= 0 || n.indexOf('female') >= 0;
      });
      if (!femaleVoice && jaVoices.length > 0) femaleVoice = jaVoices[0];
      if (femaleVoice) utter.voice = femaleVoice;

      playBtn.classList.add('playing');
      playBtn.innerHTML = '&#9632;';

      utter.onend = function() { playBtn.classList.remove('playing'); playBtn.innerHTML = '&#9654;'; };
      utter.onerror = function() { playBtn.classList.remove('playing'); playBtn.innerHTML = '&#9654;'; };

      window.speechSynthesis.speak(utter);
    });
  });

  if (window.speechSynthesis) {
    window.speechSynthesis.getVoices();
    window.speechSynthesis.onvoiceschanged = function() { window.speechSynthesis.getVoices(); };
  }
});
