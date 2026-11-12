// [농장관리 페이지 상태 관리, UI 렌더링 및 조작 이벤트]
let manageState = {
    windows: [
        { id: 'w1', title: '1중(좌)', prefix: '1L', code: 'W1_L', statusImg: 'red.png', targetPct: 100, cmd: 'stop', currentPct: 0 },
        { id: 'w2', title: '1중(우)', prefix: '1R', code: 'W1_R', statusImg: 'red.png', targetPct: 100, cmd: 'stop', currentPct: 0 },
        { id: 'w3', title: '2중(좌)', prefix: '2L', code: 'W2_L', statusImg: 'red.png', targetPct: 100, cmd: 'stop', currentPct: 0 },
        { id: 'w4', title: '2중(우)', prefix: '2R', code: 'W2_R', statusImg: 'red.png', targetPct: 100, cmd: 'stop', currentPct: 0 },
        { id: 'w5', title: '삽목(좌)', prefix: '3L', code: 'W3_L', statusImg: 'red.png', targetPct: 100, cmd: 'stop', currentPct: 0 },
        { id: 'w6', title: '삽목(우)', prefix: '3R', code: 'W3_R', statusImg: 'red.png', targetPct: 100, cmd: 'stop', currentPct: 0 }
    ],
    devices: {
        ventFan: { duration: '1분', power: 'OFF', prefix: 'F1' },
        circFan: { duration: '1분', power: 'OFF', prefix: 'F2' },
        growLight: { duration: '1분', power: 'OFF', prefix: 'LT' },
        automation: { power: 'OFF', prefix: 'AUTO' }
    }
};

// MQTT 메시지 발행 공통 함수 (버튼 클릭 시 자체 UI 변경 없음)
function sendManageMQTT(payloadStr) {
    if (typeof mqttClient !== 'undefined' && mqttClient && mqttClient.isConnected && mqttClient.isConnected()) {
        try {
            const message = new Paho.MQTT.Message(payloadStr);
            message.destinationName = "saiifarm24/smart_R";
            message.qos = 2;
            message.retained = false;
            mqttClient.send(message);
            console.log("📤 MQTT 송신 [saiifarm24/smart_R]:", payloadStr);
        } catch (e) {
            console.error("MQTT 송신 오류:", e);
        }
    } else {
        console.warn("MQTT가 연결되어 있지 않습니다:", payloadStr);
    }
}

function renderManagePageHTML() {
    var container = document.getElementById('content-area');
    var pctOptions = [25, 50, 75, 100];

    var pairs = [[0, 1], [2, 3], [4, 5]];

    var pairsHTML = pairs.map(function(pair) {
        var colsHTML = pair.map(function(idx) {
            var win = manageState.windows[idx];
            var checksHTML = pctOptions.map(function(pct) {
                var isChecked = (win.targetPct === pct) ? 'checked' : '';
                return '\
                    <div class="win-check-label" onclick="selectWindowPct(' + idx + ', ' + pct + ')">\
                        <span class="win-check-box ' + isChecked + '" id="chk-' + idx + '-' + pct + '"></span>\
                        <span>' + pct + '%</span>\
                    </div>\
                ';
            }).join('');

            return '\
                <div class="win-col">\
                    <div class="win-title">' + win.title + '</div>\
                    <img src="' + win.statusImg + '" alt="상태" class="win-status-img" id="win-img-' + idx + '">\
                    <div class="win-checks">' + checksHTML + '</div>\
                    <div class="win-btns">\
                        <button class="win-btn" id="btn-open-' + idx + '" onclick="controlWindow(' + idx + ', \'open\')">열기</button>\
                        <button class="win-btn" id="btn-stop-' + idx + '" onclick="controlWindow(' + idx + ', \'stop\')">정지</button>\
                        <button class="win-btn" id="btn-close-' + idx + '" onclick="controlWindow(' + idx + ', \'close\')">닫기</button>\
                    </div>\
                    <div class="win-percent" id="win-pct-text-' + idx + '">' + String(win.currentPct).replace('%', '') + '%</div>\
                </div>\
            ';
        }).join('');

        return '<div class="win-pair-group">' + colsHTML + '</div>';
    }).join('');

    var timeOptions = ['1분', '1시간', '2시간', '3시간', '4시간', '5시간', '6시간', '7시간', '8시간'];

    function buildDeviceBox(key, label) {
        var dev = manageState.devices[key];
        var optionsHTML = timeOptions.map(function(opt) {
            return '<option value="' + opt + '" ' + (dev.duration === opt ? 'selected' : '') + '>' + opt + '</option>';
        }).join('');

        return '\
            <div class="dev-box">\
                <div class="dev-title">' + label + '</div>\
                <div class="dev-controls">\
                    <select class="dev-select" id="select-' + key + '" onchange="changeDeviceTime(\'' + key + '\', this.value)">' + optionsHTML + '</select>\
                    <div class="dev-btn-row">\
                        <button class="dev-btn" id="dev-on-' + key + '" onclick="toggleDevicePower(\'' + key + '\', \'ON\')">ON</button>\
                        <button class="dev-btn" id="dev-off-' + key + '" onclick="toggleDevicePower(\'' + key + '\', \'OFF\')">OFF</button>\
                    </div>\
                </div>\
            </div>\
        ';
    }

    var autoHTML = '\
        <div class="auto-box">\
            <div class="auto-title">자동화</div>\
            <div class="auto-btn-row">\
                <button class="dev-btn" id="dev-on-automation" onclick="toggleDevicePower(\'automation\', \'ON\')">ON</button>\
                <button class="dev-btn" id="dev-off-automation" onclick="toggleDevicePower(\'automation\', \'OFF\')">OFF</button>\
            </div>\
        </div>\
    ';

    container.innerHTML = '\
        <div class="manage-wrapper">\
            <div class="manage-windows-area">' + pairsHTML + '</div>\
            <div class="manage-devices-area">\
                ' + buildDeviceBox('ventFan', '환기팬') + '\
                <div class="dev-divider"></div>\
                ' + buildDeviceBox('circFan', '유동팬') + '\
                <div class="dev-divider"></div>\
                ' + buildDeviceBox('growLight', '생육등') + '\
                ' + autoHTML + '\
            </div>\
        </div>\
    ';
    
    syncAllManageUI();
}

// 퍼센트 체크박스 선택 핸들러
function selectWindowPct(winIdx, pct) {
    manageState.windows[winIdx].targetPct = pct;
    [25, 50, 75, 100].forEach(function(val) {
        var box = document.getElementById('chk-' + winIdx + '-' + val);
        if (box) {
            if (val === pct) box.classList.add('checked');
            else box.classList.remove('checked');
        }
    });
}

// 창 제어 버튼 클릭 (MQTT 송신만 수행, 로컬 UI 변경 없음)
function controlWindow(winIdx, cmd) {
    var win = manageState.windows[winIdx];
    if (cmd === 'open') {
        sendManageMQTT(win.targetPct + ',' + win.code + '_UP');
    } else if (cmd === 'close') {
        sendManageMQTT(win.targetPct + ',' + win.code + '_DOWN');
    } else {
        sendManageMQTT('SM-LOVE,' + win.code + '_STOP');
    }
}

// 시간 선택 변경
function changeDeviceTime(key, val) {
    manageState.devices[key].duration = val;
}

// 팬/생육등/자동화 ON/OFF 버튼 클릭 (MQTT 송신만 수행)
function toggleDevicePower(key, state) {
    var dev = manageState.devices[key];
    if (key === 'automation') {
        sendManageMQTT('SM-LOVE,AUTO_' + state);
    } else {
        sendManageMQTT(dev.duration + ',' + dev.prefix + '_' + state);
    }
}

// -------------------------------------------------------------
// [농장 컨트롤러 피드백 수신 핸들러: saiifarm24/smart_S 토픽]
// -------------------------------------------------------------
function handleSmartFeedback(parts) {
    if (parts.length < 2) return;
    var p1 = parts[0];
    var p2 = parts[1];

    // 1. 창 상태 피드백 처리 (1L, 1R, 2L, 2R, 3L, 3R)
    manageState.windows.forEach(function(win, idx) {
        if (p1 === win.prefix + '_WIN') {
            // %가 중복 붙지 않도록 순수 숫자만 추출 후 % 부착
            var cleanPct = String(p2).replace('%', '').trim();
            win.currentPct = cleanPct;
            var pctTextEl = document.getElementById('win-pct-text-' + idx);
            if (pctTextEl) pctTextEl.innerText = cleanPct + '%';
        }

        if (p2 === win.prefix + '_UP') {
            win.cmd = 'open';
            win.statusImg = 'up.png';
            updateWinUI(idx, 'open');
        } else if (p2 === win.prefix + '_STOP') {
            win.cmd = 'stop';
            win.statusImg = 'red.png';
            updateWinUI(idx, 'stop');
        } else if (p2 === win.prefix + '_DOWN') {
            win.cmd = 'close';
            win.statusImg = 'down.png';
            updateWinUI(idx, 'close');
        }
    });

    // 2. 환기팬, 유동팬, 생육등, 자동화 피드백 처리
    var devicesMap = { 'F1': 'ventFan', 'F2': 'circFan', 'LT': 'growLight' };
    
    // 시간 바 변경 피드백 (F1_TIME, F2_TIME, LT_TIME 등)
    Object.keys(devicesMap).forEach(function(prefix) {
        if (p1 === prefix + '_TIME') {
            var devKey = devicesMap[prefix];
            manageState.devices[devKey].duration = p2;
            var selectEl = document.getElementById('select-' + devKey);
            if (selectEl) selectEl.value = p2;
        }
    });

    // 팬/생육등 ON/OFF 피드백 (F1_NOW, F2_NOW, LT_NOW 등)
    Object.keys(devicesMap).forEach(function(prefix) {
        if (p1 === prefix + '_NOW') {
            var devKey = devicesMap[prefix];
            manageState.devices[devKey].power = p2;
            updateDeviceUI(devKey, p2);
        }
    });

    // 자동화 피드백 처리 (AUTO_NOW00)
    if (p1 === 'AUTO_NOW00') {
        manageState.devices.automation.power = p2;
        updateDeviceUI('automation', p2);
    }
}

// 개별 창 UI 스타일 업데이트 헬퍼
function updateWinUI(idx, state) {
    var win = manageState.windows[idx];
    var imgEl = document.getElementById('win-img-' + idx);
    if (imgEl) imgEl.src = win.statusImg;

    var btnOpen = document.getElementById('btn-open-' + idx);
    var btnStop = document.getElementById('btn-stop-' + idx);
    var btnClose = document.getElementById('btn-close-' + idx);

    if (!btnOpen || !btnStop || !btnClose) return;

    // 초기화 (밝은 회색)
    btnOpen.style.background = '#c7c7c7';
    btnStop.style.background = '#c7c7c7';
    btnClose.style.background = '#c7c7c7';

    if (state === 'open') {
        btnOpen.style.background = '#007bff'; // 파란색
    } else if (state === 'stop') {
        btnStop.style.background = '#dc3545'; // 빨간색
    } else if (state === 'close') {
        btnClose.style.background = '#007bff'; // 파란색
    }
}

// 설비(환기팬, 유동팬, 생육등, 자동화) 버튼 색상 업데이트 헬퍼
function updateDeviceUI(key, state) {
    var onBtn = document.getElementById('dev-on-' + key);
    var offBtn = document.getElementById('dev-off-' + key);
    if (!onBtn || !offBtn) return;

    if (key === 'automation') {
        if (state === 'ON') {
            onBtn.style.background = '#007bff'; // 파란색
            offBtn.style.background = '#c7c7c7'; // 밝은 회색
        } else {
            onBtn.style.background = '#c7c7c7'; // 회색
            offBtn.style.background = '#dc3545'; // 빨간색
        }
    } else {
        if (state === 'ON') {
            onBtn.style.background = '#007bff'; // 파란색
            offBtn.style.background = '#c7c7c7'; // 밝은 회색
        } else {
            onBtn.style.background = '#c7c7c7'; // 회색
            offBtn.style.background = '#dc3545'; // 빨간색 -> 수정
        }
    }
}

// 전체 관리 UI 동기화 초기화
function syncAllManageUI() {
    manageState.windows.forEach(function(win, idx) {
        updateWinUI(idx, win.cmd);
    });
    Object.keys(manageState.devices).forEach(function(key) {
        updateDeviceUI(key, manageState.devices[key].power);
    });
}
