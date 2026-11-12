// [코어 제어 스크립트 - 로그인, MQTT 연결 유지, 메뉴 라우팅, 시계]
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

let mqttClient = null;

function updateMqttStatusUI(isConnected, text) {
    const dot = document.getElementById('mqtt-dot');
    const statusText = document.getElementById('mqtt-status-text');
    if (dot && statusText) {
        if (isConnected) {
            dot.classList.add('connected');
            statusText.innerText = text || "MQTT 연결됨";
        } else {
            dot.classList.remove('connected');
            statusText.innerText = text || "MQTT 연결 끊김";
        }
    }
}

function initMQTT() {
    if (mqttClient && mqttClient.isConnected && mqttClient.isConnected()) return;

    const clientId = "saiifarm_web_" + Math.random().toString(16).substring(2, 9);
    const isSecure = window.location.protocol === 'https:';
    const mqttHost = "broker.mqtt-dashboard.com";
    const mqttPort = isSecure ? 8884 : 8000;
    const mqttPath = "/mqtt";

    updateMqttStatusUI(false, "MQTT 연결 중...");

    try {
        mqttClient = new Paho.MQTT.Client(mqttHost, Number(mqttPort), mqttPath, clientId);
    } catch (err) {
        mqttClient = null;
        setTimeout(initMQTT, 5000);
        return;
    }

    mqttClient.onConnectionLost = function(responseObject) {
        updateMqttStatusUI(false, "연결 끊김 (재시도 중)");
        mqttClient = null;
        setTimeout(initMQTT, 5000);
    };

    mqttClient.onMessageArrived = function(message) {
        try {
            const topic = message.destinationName;
            const payload = message.payloadString;
            const parts = payload.split(',').map(item => item.trim());

            console.log("📥 MQTT 수신 [" + topic + "]:", payload);

            // 농장관리 피드백 토픽 수신 처리 (saiifarm24/smart_S)
            if (topic === "saiifarm24/smart_S") {
                if (typeof handleSmartFeedback === 'function') {
                    handleSmartFeedback(parts);
                }
                return;
            }

            if (topic === "saiifarm24/farm_o1" && parts.length >= 10) {
                sensorData.farm_a = {
                    sun: parts[1] || '-',
                    temp: parts[2] || '-',
                    tempMax: parts[3] || '-',
                    tempMin: parts[4] || '-',
                    hum: parts[5] || '-',
                    humMax: parts[6] || '-',
                    humMin: parts[7] || '-',
                    rain: parts[8] || '0',
                    rainAmount: parts[9] || '0.00',
                    soil: parts[10] || '-'
                };
            } else if (topic === "saiifarm24/farm_o2" && parts.length >= 7) {
                sensorData.farm_b = {
                    temp: parts[1] || '-',
                    tempMax: parts[2] || '-',
                    tempMin: parts[3] || '-',
                    hum: parts[4] || '-',
                    humMax: parts[5] || '-',
                    humMin: parts[6] || '-'
                };
            } else if (topic === "saiifarm24/house1" && parts.length >= 7) {
                sensorData.house1 = {
                    temp: parts[1] || '-',
                    tempMax: parts[2] || '-',
                    tempMin: parts[3] || '-',
                    hum: parts[4] || '-',
                    humMax: parts[5] || '-',
                    humMin: parts[6] || '-'
                };
            } else if (topic === "saiifarm24/house2" && parts.length >= 7) {
                sensorData.house2 = {
                    temp: parts[1] || '-',
                    tempMax: parts[2] || '-',
                    tempMin: parts[3] || '-',
                    hum: parts[4] || '-',
                    humMax: parts[5] || '-',
                    humMin: parts[6] || '-'
                };
            } else if (topic === "saiifarm24/house3" && parts.length >= 8) {
                sensorData.house3 = {
                    temp: parts[1] || '-',
                    tempMax: parts[2] || '-',
                    tempMin: parts[3] || '-',
                    hum: parts[4] || '-',
                    humMax: parts[5] || '-',
                    humMin: parts[6] || '-',
                    soil: parts[7] || '-'
                };
            }

            if (currentMenu === '농장현황' && typeof updateStatusDOM === 'function') {
                updateStatusDOM();
            }
            if (typeof updateTopHeaderTemp === 'function') {
                updateTopHeaderTemp();
            }

        } catch (e) {
            console.error("MQTT 메시지 파싱 오류:", e);
        }
    };

    mqttClient.connect({
        onSuccess: function() {
            updateMqttStatusUI(true, "MQTT 연결됨");
            mqttClient.subscribe("saiifarm24/farm_o1");
            mqttClient.subscribe("saiifarm24/farm_o2");
            mqttClient.subscribe("saiifarm24/house1");
            mqttClient.subscribe("saiifarm24/house2");
            mqttClient.subscribe("saiifarm24/house3");
            mqttClient.subscribe("saiifarm24/smart_S"); // 👈 농장 피드백 토픽 구독 추가
        },
        onFailure: function(message) {
            updateMqttStatusUI(false, "연결 실패 (재시도 중)");
            mqttClient = null;
            setTimeout(initMQTT, 5000);
        },
        useSSL: isSecure
    });
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
    initMQTT(); 
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
    const menus = ['HOME', '기상예보', '농장현황', '농장관리', '자동설정', '판넬연결'];
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
