document.addEventListener('DOMContentLoaded', function () {
  const navLinks = document.querySelectorAll('nav a');
  const sections = document.querySelectorAll('section');

  // === NAVBAR ACTIVE ===
  navLinks.forEach(link => {
    link.addEventListener('click', function (event) {
      event.preventDefault();
      navLinks.forEach(navLink => navLink.classList.remove('active'));
      this.classList.add('active');

      const sectionId = this.getAttribute('href');
      if (sectionId && sectionId.startsWith('#')) {
        if (sectionId === '#home') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          const target = document.querySelector(sectionId);
          if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
          }
        }
      }
    });
  });

  // === PROFILE CARD SLIDER (CODE MỚI THÊM VÀO) ===
  const slider = document.querySelector('.slider-container');
  if (slider) { // Chỉ chạy code nếu slider tồn tại trên trang
    const slides = slider.querySelector('.slides');
    const prevBtn = slider.querySelector('.arrow.prev');
    const nextBtn = slider.querySelector('.arrow.next');
    const images = slides.querySelectorAll('img');
    
    if (slides && prevBtn && nextBtn && images.length > 0) {
      let currentIndex = 0;
      const totalImages = images.length;

      // Cập nhật CSS tự động dựa trên số lượng ảnh
      slides.style.width = `${totalImages * 100}%`;
      images.forEach(img => {
        img.style.width = `calc(100% / ${totalImages})`;
      });

      // Hàm di chuyển đến slide
      function goToSlide(index) {
        const offset = -index * (100 / totalImages);
        slides.style.transform = `translateX(${offset}%)`;
      }

      // Sự kiện cho nút Next
      nextBtn.addEventListener('click', () => {
        currentIndex++;
        if (currentIndex >= totalImages) {
          currentIndex = 0; // Quay về ảnh đầu
        }
        goToSlide(currentIndex);
      });

      // Sự kiện cho nút Prev
      prevBtn.addEventListener('click', () => {
        currentIndex--;
        if (currentIndex < 0) {
          currentIndex = totalImages - 1; // Về ảnh cuối
        }
        goToSlide(currentIndex);
      });
      
      // Khởi tạo slider ở vị trí đầu tiên
      goToSlide(0);
    }
  }


  // === AUTO HIGHLIGHT ON SCROLL ===
  let lastActive = 'home';
  window.addEventListener('scroll', () => {
    let currentSection = '';
    const scrollY = window.scrollY;

    if (scrollY < 300) {
      currentSection = 'home';
    } else {
      sections.forEach(section => {
        const top = section.offsetTop - 300;
        const bottom = top + section.offsetHeight + 200;
        if (scrollY >= top && scrollY < bottom) {
          currentSection = section.getAttribute('id');
        }
      });
    }

    if (!currentSection) currentSection = lastActive;
    if (currentSection !== lastActive) {
      lastActive = currentSection;
      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${currentSection}`);
      });
    }
  });

  

  const projectBtn = document.querySelector('.action-buttons .btn-primary');

  const projectSection = document.querySelector('#projects'); // phần cần cuộn đến

  if (projectBtn && projectSection) {
    projectBtn.addEventListener('click', (e) => {
      e.preventDefault();
      projectSection.scrollIntoView({ behavior: 'smooth' }); // cuộn mượt

      // 💫 hiệu ứng sáng nhẹ khi click
      projectBtn.style.boxShadow = "0 0 25px rgba(229, 9, 20, 0.6)";
      setTimeout(() => projectBtn.style.boxShadow = "", 400);
    });
  }


  // === MOVE ON TOP BUTTON ===
  const moveTopBtn = document.getElementById("moveTopBtn");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
      moveTopBtn.style.display = "flex";
    } else {
      moveTopBtn.style.display = "none";
    }
  });
  moveTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });


  // === ANIMATE SKILL PROGRESS BARS ===
  const progressBars = document.querySelectorAll('.progress');
  const skillsSection = document.querySelector('#skills');
  window.addEventListener('scroll', () => {
    const sectionTop = skillsSection.getBoundingClientRect().top;
    const screenHeight = window.innerHeight;
    if (sectionTop < screenHeight - 100) {
      progressBars.forEach(bar => {
        const width = bar.getAttribute('data-width');
        bar.style.width = width;
        const percent = bar.parentElement.nextElementSibling;
        if (percent) {
          percent.style.opacity = 1;
          percent.style.transform = 'translateY(0)';
        }
      });
    }
  });

  // === CONTACT FORM POPUP ===
  const form = document.getElementById('contactForm');
  const popup = document.getElementById('thankYouPopup');
  const closeBtn = popup?.querySelector('.close-btn');

  if (form && popup) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const message = document.getElementById('message').value.trim();

      if (!name || !email || !message) {
        alert("❗ Vui lòng điền đầy đủ thông tin trước khi gửi.");
        return;
      }

      // ✅ Hiện popup cảm ơn
      popup.classList.add('active');

      // Reset form
      form.reset();

      // Tự ẩn sau 2.5s
      setTimeout(() => {
        popup.classList.remove('active');
      }, 2500);
    });

    // Đóng popup khi click nút ×
    closeBtn?.addEventListener('click', () => {
      popup.classList.remove('active');
    });

    // Đóng popup khi click ra ngoài
    popup.addEventListener('click', (e) => {
      if (e.target === popup) popup.classList.remove('active');
    });
  }

  // === SKILL BUBBLES ANIMATION ===
  const stage = document.getElementById('stage');
  if (stage) {
    let W = stage.clientWidth, H = stage.clientHeight;

    // Tự động lấy 3 bubble core (không phụ thuộc id)
    const coreEls = stage.querySelectorAll('.bubble.core');
    if (coreEls.length < 3) {
      console.warn("⚠️ Cần ít nhất 3 .bubble.core trong #stage để chạy hiệu ứng.");
      return;
    }
    const [coreA, coreB, coreC] = coreEls;

    function layoutCores() {
      W = stage.clientWidth;
      H = stage.clientHeight;
      const size = coreA.offsetWidth;
      const gap = 20;
      const total = size * 3 + gap * 2;
      const startX = (W - total) / 2;
      const baseY = (H - size) / 2;
      const offsetY = 40;

      coreA.style.transform = `translate(${startX}px, ${baseY + offsetY}px)`;
      coreB.style.transform = `translate(${startX + size + gap}px, ${baseY - offsetY}px)`;
      coreC.style.transform = `translate(${startX + (size + gap) * 2}px, ${baseY + offsetY}px)`;
    }
    window.addEventListener('resize', layoutCores);
    layoutCores();

    // === Bubble nhỏ ===
    const movers = [...stage.querySelectorAll('.bubble.small')].map(el => {
      const size = 50 + Math.random() * 20;
      el.style.width = el.style.height = `${size}px`;
      return {
        el,
        size,
        x: Math.random() * (W - size),
        y: Math.random() * (H - size),
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        mass: size * size * 0.002,
        bobPhase: Math.random() * Math.PI * 2
      };
    });

    function rect(el) {
      const s = el.getBoundingClientRect(), r = stage.getBoundingClientRect();
      return { cx: s.left - r.left + s.width / 2, cy: s.top - r.top + s.height / 2, r: s.width / 2 };
    }
    function coreObstacles() {
      return [coreA, coreB, coreC].map(rect);
    }

    const mouse = { x: -9999, y: -9999, active: false };
    stage.addEventListener('mousemove', e => {
      const r = stage.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
      mouse.active = true;
    });
    stage.addEventListener('mouseleave', () => (mouse.active = false));

    const friction = 0.992,
          wallBounce = 0.9,
          repelRadius = 120,
          repelStrength = 2.2;

    // === Xử lý va chạm giữa các bubble nhỏ ===
    function resolveMoverMover() {
      for (let i = 0; i < movers.length; i++) {
        for (let j = i + 1; j < movers.length; j++) {
          const a = movers[i];
          const b = movers[j];
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const dist = Math.hypot(dx, dy);
          const minDist = (a.size + b.size) / 2;

          if (dist < minDist && dist > 0.001) {
            const nx = dx / dist;
            const ny = dy / dist;
            const overlap = minDist - dist;
            const totalMass = a.mass + b.mass;

            // đẩy nhẹ ra 2 phía
            a.x -= nx * overlap * (b.mass / totalMass);
            a.y -= ny * overlap * (b.mass / totalMass);
            b.x += nx * overlap * (a.mass / totalMass);
            b.y += ny * overlap * (a.mass / totalMass);

            // phản xạ vận tốc (như vật lý)
            const rvx = b.vx - a.vx;
            const rvy = b.vy - a.vy;
            const vn = rvx * nx + rvy * ny;
            if (vn < 0) {
              const e = 0.8;
              const j = -(1 + e) * vn / (1 / a.mass + 1 / b.mass);
              const ix = j * nx, iy = j * ny;
              a.vx -= ix / a.mass;
              a.vy -= iy / a.mass;
              b.vx += ix / b.mass;
              b.vy += iy / b.mass;
            }
          }
        }
      }
    }

    function resolveWalls(m) {
      if (m.x < 0) { m.x = 0; m.vx = Math.abs(m.vx) * wallBounce; }
      if (m.y < 0) { m.y = 0; m.vy = Math.abs(m.vy) * wallBounce; }
      if (m.x + m.size > W) { m.x = W - m.size; m.vx = -Math.abs(m.vx) * wallBounce; }
      if (m.y + m.size > H) { m.y = H - m.size; m.vy = -Math.abs(m.vy) * wallBounce; }
    }

    function step() {
      const cores = coreObstacles();

      resolveMoverMover(); // ✅ tránh chồng lên nhau

      for (const m of movers) {
        // Đẩy khỏi các core
        for (const c of cores) {
          const mx = m.x + m.size / 2, my = m.y + m.size / 2;
          const dx = mx - c.cx, dy = my - c.cy;
          const dist = Math.hypot(dx, dy);
          const repelRange = c.r + 90;
          if (dist < repelRange && dist > 1) {
            const f = (1 - dist / repelRange) * 0.08;
            const nx = dx / dist, ny = dy / dist;
            m.vx += nx * f;
            m.vy += ny * f;
          }
        }

        // Đẩy chuột
        if (mouse.active) {
          const dx = m.x + m.size / 2 - mouse.x;
          const dy = m.y + m.size / 2 - mouse.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < repelRadius * repelRadius) {
            const d = Math.sqrt(d2) || 1;
            const f = (1 - d / repelRadius) * repelStrength;
            m.vx += (dx / d) * f;
            m.vy += (dy / d) * f;
          }
        }

        // Cập nhật vị trí
        m.x += m.vx;
        m.y += m.vy;
        m.vx *= friction;
        m.vy *= friction;
        resolveWalls(m);

        // Hiệu ứng bồng bềnh
        const t = performance.now() / 1000;
        const bobY = Math.sin(t * 2.5 + m.bobPhase) * 10;
        const bobX = Math.cos(t * 2 + m.bobPhase) * 6;
        m.el.style.transform = `translate(${m.x + bobX}px, ${m.y + bobY}px)`;
      }

      requestAnimationFrame(step);
    }

    movers.forEach(m => m.el.style.transform = `translate(${m.x}px,${m.y}px)`);
    step();
  }

});