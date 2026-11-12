// [HOME 페이지 렌더링]
function renderMenuGridHTML() {
    return `
        <div class="menu-grid">
            <div class="menu-card" onclick="openMenu('HOME')">
                <img src="icon1-home.png" alt="HOME" class="menu-icon-img">
                <span class="menu-label">HOME</span>
            </div>
            <div class="menu-card" onclick="openMenu('기상예보')">
                <img src="icon2-wt.png" alt="기상예보" class="menu-icon-img">
                <span class="menu-label">기상예보</span>
            </div>
            <div class="menu-card" onclick="openMenu('농장현황')">
                <img src="icon3-now.png" alt="농장현황" class="menu-icon-img">
                <span class="menu-label">농장현황</span>
            </div>
            <div class="menu-card" onclick="openMenu('농장관리')">
                <img src="icon4-man.png" alt="농장관리" class="menu-icon-img">
                <span class="menu-label">농장관리</span>
            </div>
            <div class="menu-card" onclick="openMenu('자동설정')">
                <img src="icon-set.png" alt="자동설정" class="menu-icon-img">
                <span class="menu-label">자동설정</span>
            </div>
            <div class="menu-card" onclick="openMenu('판넬연결')">
                <img src="icon5-auto.png" alt="판넬연결" class="menu-icon-img">
                <span class="menu-label">판넬연결</span>
            </div>
        </div>
    `;
}

function renderHomePageHTML() {
    const container = document.getElementById('content-area');
    const now = new Date();
    const topTimeString = String(now.getHours()).padStart(2, '0') + '시 ' + String(now.getMinutes()).padStart(2, '0') + '분 ' + String(now.getSeconds()).padStart(2, '0') + '초';
    const heroTimeString = now.getFullYear() + '년 ' + String(now.getMonth() + 1).padStart(2, '0') + '월 ' + String(now.getDate()).padStart(2, '0') + '일 ' + topTimeString;

    container.innerHTML = `
        <img src="saiifarm-logo1-01.png" alt="saiifarm" class="hero-logo">
        <div class="hero-divider"></div>
        <div class="hero-date-clock" id="hero-full-time">${heroTimeString}</div>
        ${renderMenuGridHTML()}
    `;
}
