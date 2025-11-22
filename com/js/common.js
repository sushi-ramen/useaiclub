/**
 * common.js
 * 全ページ共通のJavaScript処理
 * - グローバルナビの挙動（ハンバーガーメニュー開閉）
 * - 汎用的なスクロールアニメーション
 * - カスタムカーソル（要素が配置されている場合のみ動作）
 * - クリック時のA/Bエフェクト
 */

document.documentElement.classList.add('js-enabled');
document.addEventListener('DOMContentLoaded', () => {

    // =========================================
    // 1. モバイルメニューの開閉処理
    // =========================================
    const menuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (menuBtn && mobileMenu) {
        menuBtn.setAttribute('aria-controls', 'mobile-menu');
        menuBtn.setAttribute('aria-expanded', 'false');

        const toggleMenu = () => {
            const isHidden = mobileMenu.classList.toggle('hidden');
            menuBtn.setAttribute('aria-expanded', String(!isHidden));
        };

        menuBtn.addEventListener('click', (event) => {
            event.stopPropagation();
            toggleMenu();
        });

        mobileMenu.addEventListener('click', (event) => {
            event.stopPropagation();
        });

        document.addEventListener('click', () => {
            if (!mobileMenu.classList.contains('hidden')) {
                mobileMenu.classList.add('hidden');
                menuBtn.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // =========================================
    // 2. スクロール出現アニメーション
    // =========================================
    const scrollElements = document.querySelectorAll('.scroll-animate');

    if (scrollElements.length > 0) {
        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -100px 0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        scrollElements.forEach((el) => observer.observe(el));
    }

    // =========================================
    // 3. カスタムカーソル（オプション機能）
    // =========================================
    const customCursor = document.getElementById('custom-cursor');

    if (customCursor && document.body.classList.contains('has-custom-cursor')) {
        let mouseX = 0;
        let mouseY = 0;
        let cursorX = 0;
        let cursorY = 0;
        const speed = 0.15;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        function animateCursor() {
            const distX = mouseX - cursorX;
            const distY = mouseY - cursorY;
            cursorX += distX * speed;
            cursorY += distY * speed;
            customCursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`;
            requestAnimationFrame(animateCursor);
        }
        animateCursor();

        const interactiveElements = document.querySelectorAll(
            'a, button, [role="button"], input[type="submit"], .interactive'
        );

        interactiveElements.forEach((el) => {
            el.addEventListener('mouseenter', () => {
                customCursor.classList.add('is-interactive');
            });
            el.addEventListener('mouseleave', () => {
                customCursor.classList.remove('is-interactive');
            });
        });

        document.addEventListener('mousedown', () => {
            customCursor.classList.add('is-clicking');
        });

        document.addEventListener('mouseup', () => {
            customCursor.classList.remove('is-clicking');
        });
    }

    // =========================================
    // 5. クリックエフェクト
    // =========================================
    // クリック時のカーソル変更ロジック

    document.addEventListener('mousedown', (e) => {
        customCursor.style.width = '4rem';
        customCursor.style.height = '4rem';
        customCursor.style.opacity = '1';
        customCursor.style.color = '#fff';

        if (e.button === 0) { // 左クリック
            customCursor.textContent = 'A';
            // クリック時の色は、ベースカラーパレットから逸脱しないようオレンジを使用
            customCursor.style.backgroundColor = 'var(--color-accent)';
        } else if (e.button === 2) { // 右クリック
            customCursor.textContent = 'B';
            // 右クリック時はメイングリーンを使用
            customCursor.style.backgroundColor = 'var(--color-primary)';
        }
    });
    document.addEventListener('mouseup', (e) => {
        customCursor.textContent = '';
        customCursor.style.color = '';

        const target = document.elementFromPoint(e.clientX, e.clientY);
        const isInteractive = target && (target.closest('.interactive') || target.tagName === 'A' || target.tagName === 'BUTTON');

        if (isInteractive) {
            customCursor.style.width = '2.5rem';
            customCursor.style.height = '2.5rem';
            customCursor.style.opacity = '0.3';
            customCursor.style.backgroundColor = 'var(--color-primary)';
        } else {
            customCursor.style.width = '1rem';
            customCursor.style.height = '1rem';
            customCursor.style.opacity = '0.8';
            customCursor.style.backgroundColor = 'var(--color-accent)';
        }
    });

    document.addEventListener('contextmenu', (e) => {
        e.preventDefault();
    });

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.scroll-animate').forEach(el => {
        observer.observe(el);
    });

    const nav = document.getElementById('main-nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.05)';
        } else {
            nav.style.boxShadow = 'none';
        }
    });
});
