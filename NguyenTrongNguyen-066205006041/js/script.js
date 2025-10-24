// =========================
// script.js
// =========================

// khi tai trang hoac cuon, cap nhat ky nang va hien nut scroll top
function handleScrollEffects() {
    // an hien skill-level theo viewport
    const skills = document.querySelectorAll('.skill-level');
    skills.forEach(s => {
        const rect = s.getBoundingClientRect();
        if (rect.top < window.innerHeight - 100) {
            const width = s.getAttribute('data-skill') || '0%';
            s.style.width = width;
        }
    });

    // hien nut scroll top neu cuon duoc mot khoang
    const scrollTopBtn = document.getElementById('scrollTopBtn');
    if (!scrollTopBtn) return;
    if (window.scrollY > 300) {
        scrollTopBtn.style.display = 'flex';
        scrollTopBtn.style.opacity = '1';
    } else {
        scrollTopBtn.style.opacity = '0';
        // su dung time out de tao hieu ung bong
        setTimeout(() => { if (window.scrollY <= 300) scrollTopBtn.style.display = 'none'; }, 200);
    }
}

// cuon len dau trang
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// them su kien cho nut
document.addEventListener('DOMContentLoaded', function () {
    // khoi tao lan dau
    handleScrollEffects();

    // them listener scroll
    window.addEventListener('scroll', handleScrollEffects);

    // nut scroll top
    const btn = document.getElementById('scrollTopBtn');
    if (btn) btn.addEventListener('click', scrollToTop);

    // them class 'visible' cho cac section khi vao viewport (khi DOM content loaded)
    const sections = document.querySelectorAll('section');
    function revealSections() {
        sections.forEach(sec => {
            const rect = sec.getBoundingClientRect();
            if (rect.top < window.innerHeight - 100) {
                sec.classList.add('visible');
            }
        });
    }
    // reveal lan dau va khi cuon
    revealSections();
    window.addEventListener('scroll', revealSections);

    // form contact: chi demo - ngan chan reload va hien thong bao
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            alert('Cam on ban da gui thong diep! (demo - form khong gui thong tin toi server trong ban mau nay)');
            contactForm.reset();
        });
    }
});
