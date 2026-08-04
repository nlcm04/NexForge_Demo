/* =========================================================
   NEXFORGE — interactions
   Vanilla JS, no dependencies. Cross-browser. Runs from file:// or a server.
   ========================================================= */
(function () {
  "use strict";
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var raf = window.requestAnimationFrame || function (cb) { return setTimeout(cb, 16); };

  /* ---------- i18n : EN / VI ---------- */
  var LANG_KEY = "nf-lang";
  var currentLang = "en";
  var MSG = {
    en: {
      email: "Please enter a valid email address.",
      role: "Tell us which best describes you first.",
      thanks: "Thank you — we'll be in touch.",
      sent: "Thank you — your details are with us. We'll be in touch shortly."
    },
    vi: {
      email: "Vui lòng nhập một địa chỉ email hợp lệ.",
      role: "Trước tiên, hãy chọn mục mô tả đúng nhất về bạn.",
      thanks: "Cảm ơn bạn — chúng tôi sẽ liên hệ lại.",
      sent: "Cảm ơn bạn — chúng tôi đã nhận được thông tin và sẽ sớm liên hệ."
    }
  };
  function setYear() { var y = document.getElementById("year"); if (y) y.textContent = new Date().getFullYear(); }
  function applyLang(lang) {
    if (lang !== "vi") lang = "en";
    currentLang = lang;
    document.documentElement.lang = lang;
    var els = document.querySelectorAll("[data-en]"), i;
    for (i = 0; i < els.length; i++) {
      var v = els[i].getAttribute("data-" + lang);
      if (v != null) els[i].innerHTML = v;
    }
    var phs = document.querySelectorAll("[data-en-ph]");
    for (i = 0; i < phs.length; i++) {
      var pv = phs[i].getAttribute("data-" + lang + "-ph");
      if (pv != null) phs[i].setAttribute("placeholder", pv);
    }
    var btns = document.querySelectorAll(".lang-btn");
    for (i = 0; i < btns.length; i++) btns[i].classList.toggle("active", btns[i].getAttribute("data-lang") === lang);
    setYear();
    renderBioIfOpen();
    try { localStorage.setItem(LANG_KEY, lang); } catch (e) {}
  }
  (function () {
    var btns = document.querySelectorAll(".lang-btn");
    for (var i = 0; i < btns.length; i++) {
      (function (b) { b.addEventListener("click", function () { applyLang(b.getAttribute("data-lang")); }); })(btns[i]);
    }
  })();
  var saved = "en";
  try { saved = localStorage.getItem(LANG_KEY) || "en"; } catch (e) {}
  applyLang(saved);

  /* ---------- sticky nav ---------- */
  var nav = document.getElementById("nav");
  function onNavScroll() { if (nav) nav.classList.toggle("scrolled", window.pageYOffset > 60); }
  window.addEventListener("scroll", onNavScroll, { passive: true });
  onNavScroll();

  /* ---------- mobile menu ---------- */
  var toggle = document.getElementById("navToggle");
  var links = document.getElementById("navLinks");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    links.addEventListener("click", function (e) {
      if (e.target.tagName === "A") { links.classList.remove("open"); toggle.setAttribute("aria-expanded", "false"); }
    });
  }

  /* ---------- scroll reveal (plain scroll math — identical in every browser) ---------- */
  var reveals = document.querySelectorAll(".reveal");
  function revealAll() { for (var q = 0; q < reveals.length; q++) reveals[q].classList.add("in"); }
  if (reduceMotion) {
    revealAll();
  } else {
    var revScheduled = false;
    function revealInView() {
      revScheduled = false;
      var vh = window.innerHeight || document.documentElement.clientHeight;
      for (var q = 0; q < reveals.length; q++) {
        var el = reveals[q];
        if (el.classList.contains("in")) continue;
        var rect = el.getBoundingClientRect();
        if (rect.top < vh * 0.92 && rect.bottom > -40) el.classList.add("in");
      }
    }
    function onRev() { if (!revScheduled) { revScheduled = true; raf(revealInView); } }
    revealInView();
    window.addEventListener("scroll", onRev, { passive: true });
    window.addEventListener("resize", onRev);
    window.addEventListener("load", revealInView);
    // hard safety: nothing may ever stay hidden, whatever the browser does
    setTimeout(revealAll, 4000);
  }

  /* ---------- stat counters (if any) ---------- */
  var counters = document.querySelectorAll("[data-count]");
  function runCount(el) {
    var target = +el.dataset.count, suffix = el.dataset.suffix || "", start = null, dur = 1400;
    function frame(t) {
      if (!start) start = t;
      var p = Math.min((t - start) / dur, 1), eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(eased * target) + suffix;
      if (p < 1) raf(frame);
    }
    raf(frame);
  }
  var countDone = [];
  function runCountsInView() {
    if (!counters.length) return;
    var vh = window.innerHeight || document.documentElement.clientHeight;
    for (var c = 0; c < counters.length; c++) {
      if (countDone[c]) continue;
      var rect = counters[c].getBoundingClientRect();
      if (rect.top < vh * 0.85 && rect.bottom > 0) { countDone[c] = 1; runCount(counters[c]); }
    }
  }
  if (reduceMotion) {
    for (var c2 = 0; c2 < counters.length; c2++) counters[c2].textContent = counters[c2].getAttribute("data-count") + (counters[c2].getAttribute("data-suffix") || "");
  } else {
    runCountsInView();
    window.addEventListener("scroll", runCountsInView, { passive: true });
    window.addEventListener("load", runCountsInView);
    // safety: force-finish any counter that never scrolled into view
    setTimeout(function () { for (var c3 = 0; c3 < counters.length; c3++) if (!countDone[c3]) { countDone[c3] = 1; runCount(counters[c3]); } }, 4200);
  }

  /* ---------- connect form ---------- */
  var picks = document.querySelectorAll(".pick"), chosenRole = "";
  for (var pk = 0; pk < picks.length; pk++) {
    (function (b) {
      b.addEventListener("click", function () {
        for (var j = 0; j < picks.length; j++) picks[j].classList.remove("active");
        b.classList.add("active"); chosenRole = b.getAttribute("data-role");
      });
    })(picks[pk]);
  }
  var form = document.getElementById("connectForm"), msg = document.getElementById("formMsg");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var t = MSG[currentLang] || MSG.en;
      var email = document.getElementById("email").value.trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { msg.textContent = t.email; return; }
      if (!chosenRole) { msg.textContent = t.role; return; }
      msg.textContent = t.thanks + " (" + chosenRole + ")";
      form.reset();
      for (var j = 0; j < picks.length; j++) picks[j].classList.remove("active");
      chosenRole = "";
    });
  }

  /* ---------- progress bar + back-to-top ---------- */
  var progress = document.getElementById("progress"), toTop = document.getElementById("toTop");
  function onScrollUI() {
    var st = window.pageYOffset || document.documentElement.scrollTop;
    var docH = document.documentElement.scrollHeight - window.innerHeight;
    if (progress) progress.style.width = (docH > 0 ? (st / docH) * 100 : 0) + "%";
    if (toTop) toTop.classList.toggle("show", st > 620);
  }
  window.addEventListener("scroll", onScrollUI, { passive: true });
  onScrollUI();
  if (toTop) toTop.addEventListener("click", function () {
    try { window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" }); } catch (e) { window.scrollTo(0, 0); }
  });

  /* ---------- story timeline fill ---------- */
  var storyline = document.getElementById("storyline"), storyFill = document.getElementById("storyFill");
  function onStoryScroll() {
    if (!storyline || !storyFill) return;
    var rect = storyline.getBoundingClientRect();
    var vh = window.innerHeight || document.documentElement.clientHeight;
    var startPt = vh * 0.72, total = rect.height + startPt * 0.4;
    var progressed = startPt - rect.top;
    var pct = Math.max(0, Math.min(1, progressed / total));
    storyFill.style.height = (pct * 100) + "%";
  }
  window.addEventListener("scroll", onStoryScroll, { passive: true });
  window.addEventListener("resize", onStoryScroll);
  onStoryScroll();

  /* ---------- deal-intake modal ---------- */
  var modal = document.getElementById("intakeModal"), modalClose = document.getElementById("modalClose");
  var intakeForm = document.getElementById("intakeForm"), intakeMsg = document.getElementById("intakeMsg");
  function openModal() {
    if (!modal) return;
    modal.classList.add("open"); modal.setAttribute("aria-hidden", "false"); document.body.style.overflow = "hidden";
    var f = document.getElementById("in-name"); if (f) setTimeout(function () { f.focus(); }, 50);
  }
  function closeModal() {
    if (!modal) return;
    modal.classList.remove("open"); modal.setAttribute("aria-hidden", "true"); document.body.style.overflow = "";
  }
  var intakeBtns = document.querySelectorAll(".js-intake");
  for (var ib = 0; ib < intakeBtns.length; ib++) intakeBtns[ib].addEventListener("click", function (e) { e.preventDefault(); openModal(); });
  if (modalClose) modalClose.addEventListener("click", closeModal);
  if (modal) modal.addEventListener("click", function (e) { if (e.target === modal) closeModal(); });
  document.addEventListener("keydown", function (e) { if ((e.key === "Escape" || e.keyCode === 27) && modal && modal.classList.contains("open")) closeModal(); });
  if (intakeForm) {
    intakeForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var t = MSG[currentLang] || MSG.en;
      var email = (document.getElementById("in-email") || {}).value || "";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) { intakeMsg.style.color = "#E0A11B"; intakeMsg.textContent = t.email; return; }
      intakeMsg.style.color = "#1D9E75"; intakeMsg.textContent = t.sent;
      intakeForm.reset(); setTimeout(closeModal, 1800);
    });
  }

  /* ---------- team bios ---------- */
  var TEAM = [
    { name: "Kelly Wong", mono: "KW",
      roleEn: "Founding Partner · Origination & Capital", roleVi: "Nhà sáng lập · Cơ hội & Vốn",
      bioEn: "Kelly is one of NEXFORGE's two partners. He looks after where the firm's money goes and the relationships that bring in work, and he has a say in every investment we make. By background he's a technology and finance leader, and today he runs one of Vietnam's best-known technology companies. Over the years he has worked across gaming, consumer goods and financial services, and led large digital and international projects along the way. Earlier in his career he was group CFO and deputy CEO of a large Vietnamese consumer group, and a managing director in investment banking, after starting out in corporate banking at an international bank. He brings the network, the capital relationships and the feel for technology that our build side leans on.",
      bioVi: "Kelly là một trong hai nhà sáng lập của NEXFORGE. Anh phụ trách việc dòng vốn của công ty đi đâu và các mối quan hệ mang về công việc, đồng thời có tiếng nói trong mọi quyết định đầu tư. Xuất thân là một lãnh đạo về công nghệ và tài chính, hiện anh điều hành một trong những công ty công nghệ được biết đến nhiều nhất Việt Nam. Nhiều năm qua, anh đã làm việc qua các lĩnh vực game, hàng tiêu dùng và dịch vụ tài chính, và dẫn dắt nhiều dự án lớn về chuyển đổi số và mở rộng ra quốc tế. Trước đó anh từng là Giám đốc Tài chính Tập đoàn kiêm Phó Tổng Giám đốc của một tập đoàn tiêu dùng lớn của Việt Nam, và là giám đốc điều hành trong ngân hàng đầu tư, sau khi khởi nghiệp ở mảng ngân hàng doanh nghiệp tại một ngân hàng quốc tế. Anh mang đến mạng lưới quan hệ, các mối quan hệ về vốn và sự nhạy bén về công nghệ mà mảng kiến tạo của chúng tôi dựa vào." },
    { name: "Vũ Thành Lê", mono: "VL",
      roleEn: "Founding Partner · Investment & Structure", roleVi: "Nhà sáng lập · Đầu tư & Cấu trúc",
      bioEn: "Lê is NEXFORGE's other partner. He leads the investment work, and the hands-on job of turning a good business into one that can raise capital, take on a partner, or be passed to the next generation. His background is in insurance, financial services and corporate strategy. He has held senior investment and finance roles at one of Vietnam's leading insurers, been a CFO inside a life-insurance joint venture, and sat on the boards of companies in real estate, consumer goods and pharmaceuticals. He started out in corporate banking, and these days he pairs that financial discipline with a real feel for structure, governance and reporting, which is where NEXFORGE does its best work.",
      bioVi: "Lê là nhà sáng lập còn lại của NEXFORGE. Anh dẫn dắt mảng đầu tư, và công việc trực tiếp biến một doanh nghiệp tốt thành một doanh nghiệp có thể gọi vốn, đón đối tác, hoặc trao lại cho thế hệ sau. Nền tảng của anh là bảo hiểm, dịch vụ tài chính và chiến lược doanh nghiệp. Anh từng giữ các vị trí đầu tư và tài chính cấp cao tại một trong những công ty bảo hiểm hàng đầu Việt Nam, từng là Giám đốc Tài chính trong một liên doanh bảo hiểm nhân thọ, và tham gia hội đồng quản trị nhiều công ty trong lĩnh vực bất động sản, hàng tiêu dùng và dược phẩm. Anh khởi nghiệp trong mảng ngân hàng doanh nghiệp, và giờ đây kết hợp kỷ luật tài chính đó với sự am hiểu thật sự về cấu trúc, quản trị và báo cáo, cũng chính là nơi NEXFORGE làm tốt nhất." }
  ];
  var bioModal = document.getElementById("bioModal"), bioOpenIdx = null;
  function renderBio(i) {
    var p = TEAM[i]; if (!p || !bioModal) return;
    document.getElementById("bioMono").textContent = p.mono;
    document.getElementById("bioName").textContent = p.name;
    document.getElementById("bioRole").textContent = (currentLang === "vi") ? p.roleVi : p.roleEn;
    document.getElementById("bioText").textContent = (currentLang === "vi") ? p.bioVi : p.bioEn;
  }
  function renderBioIfOpen() { if (bioOpenIdx != null) renderBio(bioOpenIdx); }
  function openBio(i) {
    if (!bioModal) return;
    bioOpenIdx = i; renderBio(i);
    bioModal.classList.add("open"); bioModal.setAttribute("aria-hidden", "false"); document.body.style.overflow = "hidden";
  }
  function closeBio() {
    if (!bioModal) return;
    bioOpenIdx = null; bioModal.classList.remove("open"); bioModal.setAttribute("aria-hidden", "true"); document.body.style.overflow = "";
  }
  var teamBtns = document.querySelectorAll("[data-teamidx]");
  for (var tb = 0; tb < teamBtns.length; tb++) {
    (function (el) { el.addEventListener("click", function () { openBio(+el.getAttribute("data-teamidx")); }); })(teamBtns[tb]);
  }
  var bioCloseBtn = document.getElementById("bioClose");
  if (bioCloseBtn) bioCloseBtn.addEventListener("click", closeBio);
  if (bioModal) bioModal.addEventListener("click", function (e) { if (e.target === bioModal) closeBio(); });
  document.addEventListener("keydown", function (e) { if ((e.key === "Escape" || e.keyCode === 27) && bioModal && bioModal.classList.contains("open")) closeBio(); });

  /* =========================================================
     Hero canvas — drifting aperture-dot field (amber on bone)
     ========================================================= */
  (function () {
    var canvas = document.getElementById("heroCanvas");
    if (!canvas || !canvas.getContext) return;
    var ctx = canvas.getContext("2d");
    if (!ctx) return;
    var w = 0, h = 0, dpr = 1, dots = [], running = true, mouseX = 0.5, mouseY = 0.5;

    function make(seed) {
      return {
        x: Math.random(), y: Math.random(),
        r: 1 + Math.random() * 2.6,
        sq: Math.random() > 0.5,
        vx: (Math.random() - 0.5) * 0.00028,
        vy: (Math.random() - 0.5) * 0.00028,
        a: 0.18 + Math.random() * 0.4,
        ph: Math.random() * Math.PI * 2
      };
    }
    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var want = Math.max(28, Math.min(90, Math.round(w * h / 20000)));
      dots = [];
      for (var i = 0; i < want; i++) dots.push(make(true));
    }
    function draw() {
      if (!running) return;
      ctx.clearRect(0, 0, w, h);
      var t = Date.now() * 0.001;
      for (var i = 0; i < dots.length; i++) {
        var d = dots[i];
        d.x += d.vx; d.y += d.vy;
        if (d.x < -0.02) d.x = 1.02; if (d.x > 1.02) d.x = -0.02;
        if (d.y < -0.02) d.y = 1.02; if (d.y > 1.02) d.y = -0.02;
        var px = (d.x + Math.sin(t * 0.3 + d.ph) * 0.004) * w;
        var py = (d.y + Math.cos(t * 0.26 + d.ph) * 0.004) * h;
        px += (mouseX - 0.5) * 26 * (d.r / 3);
        py += (mouseY - 0.5) * 26 * (d.r / 3);
        var alpha = d.a * (0.6 + 0.4 * Math.sin(t + d.ph));
        ctx.fillStyle = "rgba(224,161,27," + alpha.toFixed(3) + ")";
        if (d.sq) {
          var s = d.r * 1.7;
          ctx.fillRect(px - s / 2, py - s / 2, s, s);
        } else {
          ctx.beginPath(); ctx.arc(px, py, d.r, 0, Math.PI * 2); ctx.fill();
        }
      }
      raf(draw);
    }
    window.addEventListener("resize", resize);
    if (!reduceMotion) {
      window.addEventListener("mousemove", function (e) {
        mouseX = e.clientX / (window.innerWidth || 1);
        mouseY = e.clientY / (window.innerHeight || 1);
      }, { passive: true });
      document.addEventListener("visibilitychange", function () {
        running = !document.hidden; if (running) draw();
      });
    }
    resize();
    if (reduceMotion) {
      // static single frame
      ctx.clearRect(0, 0, w, h);
      for (var i = 0; i < dots.length; i++) {
        var d = dots[i], px = d.x * w, py = d.y * h;
        ctx.fillStyle = "rgba(224,161,27," + d.a.toFixed(3) + ")";
        ctx.beginPath(); ctx.arc(px, py, d.r, 0, Math.PI * 2); ctx.fill();
      }
    } else {
      draw();
    }
  })();
})();
