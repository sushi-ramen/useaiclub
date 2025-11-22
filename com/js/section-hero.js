// js/section-hero.js

document.addEventListener('DOMContentLoaded', () => {
    // 1. セクションの存在確認
    const heroSection = document.getElementById('section-hero');
    if (!heroSection) return;

    // 2. 対象となるテキストラッパーの取得
    const heroTextWrapper = document.getElementById('hero-text-wrapper');
    if (!heroTextWrapper) return;

    // 3. マウスの位置に応じて3D回転を適用
    document.addEventListener('mousemove', (e) => {
        const rect = heroTextWrapper.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const diffX = (e.clientX - centerX) / 60; // 左右方向の差分
        const diffY = (e.clientY - centerY) / 60; // 上下方向の差分

        heroTextWrapper.style.transform =
            `perspective(1000px) rotateX(${diffY}deg) rotateY(${-diffX}deg)`;
    });

    // 4. セクション外にマウスが出たら元に戻す
    heroSection.addEventListener('mouseleave', () => {
        heroTextWrapper.style.transform =
            'perspective(1000px) rotateX(0deg) rotateY(0deg)';
    });
});
