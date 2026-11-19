/* Clickable prototype player (used by index.html and demo.html) */
(function () {
  // Hotspot boxes are [x, y, width, height] on the 1920×1080 Figma frame.
  var BOY = [1795, 715, 105, 105], GIRL = [1795, 605, 105, 105], SNOW = [30, 830, 105, 105];
  var SCREENS = {
    theme:   { cta: 'Choose Midsommar', img: '01-theme', text: '<b>Choose a world.</b> The child picks a theme for the story. Try <b>Midsommar</b>.', go: [[[1521, 134, 120, 120], 'land']] },
    land:    { cta: 'Ask the Wise AI', img: '02-landscape', text: '<b>The Midsommar meadow.</b> Two paths: ask the <b>Wise AI</b> for a story (top icon on the right), or build your own scene by adding the <b>girl</b>.', go: [[[1795, 135, 110, 110], 'wise'], [GIRL, 'b1']] },
    wise:    { cta: 'Choose the boy', img: '03-wise-ai', text: '<b>The Wise AI offers to create a story together.</b> Choose a main character: the <b>boy</b>.', go: [[BOY, 'story']] },
    story:   { img: '04-story-start', text: '<b>The AI opens with a mystery.</b> Gunna’s grandmother’s drum has gone silent. Why?', next: 'turns' },
    turns:   { img: '05-turn-taking', text: '<b>Turn-taking.</b> The child continues the story the AI started, then the AI answers.', next: 'twist' },
    twist:   { img: '06-twist', text: '<b>The AI adds a twist.</b> The birds have stopped singing. Why has nature gone quiet?', next: 'help' },
    help:    { cta: 'Press help', img: '07-help', text: '<b>The child is stuck</b> and presses the <b>help</b> button (the light bulb).', go: [[[1795, 140, 110, 105], 'hint']] },
    hint:    { cta: 'Ride the horse', img: '08-hint', text: '<b>A hint, not an answer:</b> ask the ancient birch tree. Travel there with the <b>horse</b>.', go: [[[1795, 940, 105, 105], 'horse']] },
    horse:   { img: '09-horse', text: '<b>Gunna rides to the old birch</b> to ask what it knows.', next: 'birch' },
    birch:   { img: '10-birch', text: '<b>The birch tree speaks.</b> The forest spirits are quiet because they feel forgotten.', next: 'tasks' },
    tasks:   { img: '11-tasks', text: '<b>Two tasks:</b> find a hidden path, and give the spirits a memory, such as a story from your family. This is where the parent joins in.', end: true },
    b1:      { cta: 'Add the boy', img: 'b1-girl', path: 'Build-a-scene path', text: '<b>Add characters</b> by tapping them. Add the <b>boy</b> too.', go: [[BOY, 'b2']] },
    b2:      { cta: 'Make it snow', img: 'b2-two-kids', path: 'Build-a-scene path', text: '<b>Change the weather.</b> Tap <b>snow</b> on the left.', go: [[SNOW, 'b3']] },
    b3:      { cta: 'Snow again', img: 'b3-snow', path: 'Build-a-scene path', text: '<b>It starts to snow.</b> Tap <b>snow</b> again to change the season.', go: [[SNOW, 'b4']] },
    b4:      { img: 'b4-winter', path: 'Build-a-scene path', text: '<b>The meadow turns to winter.</b> The scene is ready for a new story.', end: true }
  };
  var MAIN = ['theme', 'land', 'wise', 'story', 'turns', 'twist', 'help', 'hint', 'horse', 'birch', 'tasks'];
  var BRANCH = ['b1', 'b2', 'b3', 'b4'];

  var stage = document.getElementById('stage'), img = document.getElementById('screen');
  var trail = [], current = 'theme';

  // Preload all screens so clicks feel instant.
  Object.keys(SCREENS).forEach(function (k) { new Image().src = 'screens/' + SCREENS[k].img + '.webp?v=2'; });

  function nextOf(key) { var s = SCREENS[key]; return s.next || (s.go && s.go[0][1]) || null; }

  function show(key, push) {
    if (push) trail.push(current);
    current = key;
    var s = SCREENS[key];
    img.src = 'screens/' + s.img + '.webp?v=2';
    img.alt = s.text.replace(/<[^>]+>/g, '');
    stage.querySelectorAll('.hotspot').forEach(function (h) { h.remove(); });
    (s.go || []).forEach(function (g) {
      var r = g[0], b = document.createElement('button');
      b.className = 'hotspot'; b.type = 'button';
      b.setAttribute('aria-label', 'Go to: ' + SCREENS[g[1]].text.replace(/<[^>]+>/g, ''));
      b.style.left = (r[0] / 19.2) + '%'; b.style.top = (r[1] / 10.8) + '%';
      b.style.width = (r[2] / 19.2) + '%'; b.style.height = (r[3] / 10.8) + '%';
      b.onclick = function (e) { e.stopPropagation(); show(g[1], true); };
      stage.appendChild(b);
    });
    var list = BRANCH.indexOf(key) >= 0 ? BRANCH : MAIN;
    var pos = list.indexOf(key) + 1;
    document.getElementById('step').innerHTML = (s.path ? '<span class="path">' + s.path + '</span> ' : '') + pos + ' / ' + list.length;
    document.getElementById('text').innerHTML = s.text;
    document.getElementById('prev').disabled = trail.length === 0;
    document.getElementById('next').textContent = s.end ? 'Start again' : (s.cta ? s.cta + ' →' : 'Next');
  }

  function forward() {
    var s = SCREENS[current];
    if (s.end) { trail = []; show('theme', false); return; }
    show(nextOf(current), true);
  }
  function back() { if (trail.length) show(trail.pop(), false); }

  document.getElementById('next').onclick = forward;
  document.getElementById('prev').onclick = back;
  // Clicking outside a hotspot: advance on story screens, otherwise show where to click.
  stage.onclick = function () {
    if (SCREENS[current].go) { stage.classList.remove('flash'); void stage.offsetWidth; stage.classList.add('flash'); }
    else forward();
  };
  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') forward();
    if (e.key === 'ArrowLeft') back();
  });
  var start = location.hash.slice(1);
  show(SCREENS[start] ? start : 'theme', false);
})();
