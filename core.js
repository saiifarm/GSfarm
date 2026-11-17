// [코어 제어 스크립트 - 로그인, 메뉴 라우팅, 시계]
const WORKER_URL = 'https://sf-gs-weather.definezero.workers.dev';
let currentMenu = 'HOME';

let sensorData = {
    firstWeatherIcon: '⛅',
    farm_a: { sun: '-', temp: '-', tempMax: '-', tempMin: '-', hum: '-', humMax: '-', humMin: '-', rain: '0', rainAmount: '0.00', soil: '-' },
    farm_b: { temp: '-', tempMax: '-', tempMin: '-', hum: '-', humMax: '-', humMin: '-' },
    house1: { temp: '-', tempMax: '-', tempMin: '-', hum: '-', humMax: '-', humMin: '-' },
    house2: { temp: '-', tempMax: '-', tempMin: '-', hum: '-', humMax: '-', humMin: '-' },
    house3: { temp: '-', tempMax: '-', tempMin: '-', hum: '-', humMax: '-', humMin: '-', soil: '-' }
};

function updateMqttStatusUI(isConnected, text) {
    const dot = document.getElementById('mqtt-dot');
    const statusText = document.getElementById('mqtt-status-text');
    if (dot && statusText) {
        if (isConnected) {
            dot.classList.add('connected');
            statusText.innerText = text || "시스템 연결됨";
        } else {
            dot.classList.remove('connected');
            statusText.innerText = text || "시스템 연결 대기";
        }
    }
}

function initMQTTProxy() {
    // 서버 중계 방식으로 전환되어 직접 연결 상태 대신 정상 표시
    updateMqttStatusUI(true, "서버 연동 완료");
}

function setVal(id, val) {
    const el = document.getElementById(id);
    if (el) el.innerText = val;
}

function checkLogin() {
    const inputId = document.getElementById('username').value.trim();
    const inputPw = document.getElementById('password').value;
    const errorMsg = document.getElementById('error-msg');

    if (!inputId || !inputPw) {
        errorMsg.innerText = '아이디와 비밀번호를 입력해주세요.';
        errorMsg.style.display = 'block';
        return;
    }

    fetch(WORKER_URL + '/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: inputId, password: inputPw })
    })
    .then(res => res.json().then(data => ({ status: res.status, body: data })))
    .then(res => {
        if (res.status === 200 && res.body.success) {
            sessionStorage.setItem('isLoggedIn', 'true');
            showMain();
        } else {
            errorMsg.innerText = res.body.message || '아이디 또는 비밀번호가 틀렸습니다.';
            errorMsg.style.display = 'block';
            document.getElementById('password').value = '';
        }
    })
    .catch(error => {
        errorMsg.innerText = '서버 통신 중 오류가 발생했습니다.';
        errorMsg.style.display = 'block';
    });
}

function showMain() {
    document.getElementById('login-section').style.display = 'none';
    const mainContent = document.getElementById('main-content');
    mainContent.style.display = 'flex';
    initMQTTProxy(); 
    openMenu('HOME');
    if (typeof lucide !== 'undefined') lucide.createIcons();
    if (typeof fetchKMAWeather === 'function') fetchKMAWeather();
}

function logout() {
    sessionStorage.removeItem('isLoggedIn');
    location.reload();
}

function updateNavigationState(menuName) {
    currentMenu = menuName;
    const menus = ['HOME', '기상예보', '농장현황', '농장관리', '차트', '자동설정', '판넬연결'];
    menus.forEach(function(name) {
        const topBtn = document.getElementById('nav-btn-' + name);
        if (topBtn) topBtn.disabled = (name === menuName);
    });
}

function openMenu(menuName) {
    const heroArea = document.getElementById('main-hero-area');

    if (menuName === 'HOME') {
        heroArea.style.backgroundColor = '#2D6A3F';
        renderHomePageHTML();
    } else if (menuName === '기상예보') {
        heroArea.style.backgroundColor = '#2D6A3F';
        renderWeatherPageHTML();
    } else if (menuName === '농장현황') {
        heroArea.style.backgroundColor = '#5cb85c';
        renderStatusPageHTML();
    } else if (menuName === '농장관리') {
        heroArea.style.backgroundColor = '#66a182';
        renderManagePageHTML();
    } else if (menuName === '차트') {
        heroArea.style.backgroundColor = '#2D6A3F';
        renderChartPageHTML();
    } else if (menuName === '자동설정') {
        heroArea.style.backgroundColor = '#2D6A3F';
        renderAutoPageHTML();
    } else if (menuName === '판넬연결') {
        heroArea.style.backgroundColor = '#2D6A3F';
        renderPanelPageHTML();
    }

    updateNavigationState(menuName);
}

(function startClock() {
    function update() {
        const now = new Date();
        const topTimeString = String(now.getHours()).padStart(2, '0') + '시 ' + String(now.getMinutes()).padStart(2, '0') + '분 ' + String(now.getSeconds()).padStart(2, '0') + '초';
        const heroTimeString = now.getFullYear() + '년 ' + String(now.getMonth() + 1).padStart(2, '0') + '월 ' + String(now.getDate()).padStart(2, '0') + '일 ' + topTimeString;

        setVal('top-time', topTimeString);
        setVal('hero-full-time', heroTimeString);
    }
    update();
    setInterval(update, 1000);
})();

window.onload = function() {
    if (sessionStorage.getItem('isLoggedIn') === 'true') {
        showMain();
    } else if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
};
