// [농장관리 페이지 상태 관리, UI 렌더링 및 조작 이벤트]
let manageState = {
    windows: [
        { id: 'w1', title: '1중(좌)', code: 'W1_L', statusImg: 'red.png', targetPct: 100, cmd: 'stop', currentPct: 0 },
        { id: 'w2', title: '1중(우)', code: 'W1_R', statusImg: 'red.png', targetPct: 100, cmd: 'stop', currentPct: 0 },
        { id: 'w3', title: '2중(좌)', code: 'W2_L', statusImg: 'red.png', targetPct: 100, cmd: 'stop', currentPct: 0 },
        { id: 'w4', title: '2중(우)', code: 'W2_R', statusImg: 'red.png', targetPct: 100, cmd: 'stop', currentPct: 0 },
        { id: 'w5', title: '삽목(좌)', code: 'W3_L', statusImg: 'red.png', targetPct: 100, cmd: 'stop', currentPct: 0 },
        { id: 'w6', title: '삽목(우)', code: 'W3_R', statusImg: 'red.png', targetPct: 100, cmd: 'stop', currentPct: 0 }
    ],
    devices: {
        ventFan: { duration: '1분', power: 'OFF', cmdKey: 'F1' },
        circFan: { duration: '1분', power: 'OFF', cmdKey: 'F2' },
        growLight: { duration: '1분', power: 'OFF', cmdKey: 'LT' },
        automation: { power: 'OFF' }
    }
};

// MQTT 메시지 발행 공통 함수 (토픽: saiifarm24/smart_R, QoS: 2, retained: false)
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
        console.warn("MQTT가 연결되어 있지 않아 메시지를 전송할 수 없습니다:", payloadStr);
        alert("MQTT 연결이 끊어져 있어 명령을 전송할 수 없습니다.");
    }
}

function renderManagePageHTML() {
    var container = document.getElementById('content-area');
    var pctOptions = [25, 50, 75, 100];

    // 3개의 쌍 그룹으로 명확히 분할 (1중, 2중, 삽목)
    var pairs = [
        [0, 1], // 1중(좌), 1중(우)
        [2, 3], // 2중(좌), 2중(우)
        [4, 5]  // 삽목(좌), 삽목(우)
    ];

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
                        <button class="win-btn ' + (win.cmd === 'open' ? 'active' : '') + '" id="btn-open-' + idx + '" onclick="controlWindow(' + idx + ', \'open\')">열기</button>\
                        <button class="win-btn ' + (win.cmd === 'stop' ? 'active' : '') + '" id="btn-stop-' + idx + '" onclick="controlWindow(' + idx + ', \'stop\')">정지</button>\
                        <button class="win-btn ' + (win.cmd === 'close' ? 'active' : '') + '" id="btn-close-' + idx + '" onclick="controlWindow(' + idx + ', \'close\')">닫기</button>\
                    </div>\
                    <div class="win-percent" id="win-pct-text-' + idx + '">' + win.currentPct + '%</div>\
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
                    <select class="dev-select" onchange="changeDeviceTime(\'' + key + '\', this.value)">' + optionsHTML + '</select>\
                    <div class="dev-btn-row">\
                        <button class="dev-btn ' + (dev.power === 'ON' ? 'active' : '') + '" id="dev-on-' + key + '" onclick="toggleDevicePower(\'' + key + '\', \'ON\')">ON</button>\
                        <button class="dev-btn ' + (dev.power === 'OFF' ? 'active' : '') + '" id="dev-off-' + key + '" onclick="toggleDevicePower(\'' + key + '\', \'OFF\')">OFF</button>\
                    </div>\
                </div>\
            </div>\
        ';
    }

    var autoDev = manageState.devices.automation;
    var autoHTML = '\
        <div class="auto-box">\
            <div class="auto-title">자동화</div>\
            <div class="auto-btn-row">\
                <button class="dev-btn ' + (autoDev.power === 'ON' ? 'active' : '') + '" id="dev-on-automation" onclick="toggleDevicePower(\'automation\', \'ON\')">ON</button>\
                <button class="dev-btn ' + (autoDev.power === 'OFF' ? 'active' : '') + '" id="dev-off-automation" onclick="toggleDevicePower(\'automation\', \'OFF\')">OFF</button>\
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
}

// 창 개폐 목표 비율(25%/50%/75%/100%) 단일 선택 핸들러
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

// 창 개폐 제어 버튼(열기/정지/닫기) 클릭 시 MQTT 송신 및 UI 반영
function controlWindow(winIdx, cmd) {
    var win = manageState.windows[winIdx];
    win.cmd = cmd;

    if (cmd === 'open') {
        win.statusImg = 'up.png';
        sendManageMQTT(win.targetPct + ',' + win.code + '_UP');
    } else if (cmd === 'close') {
        win.statusImg = 'down.png';
        sendManageMQTT(win.targetPct + ',' + win.code + '_DOWN');
    } else {
        win.statusImg = 'red.png';
        sendManageMQTT('SM-LOVE,' + win.code + '_STOP');
    }

    var imgEl = document.getElementById('win-img-' + winIdx);
    if (imgEl) imgEl.src = win.statusImg;

    ['open', 'stop', 'close'].forEach(function(c) {
        var btn = document.getElementById('btn-' + c + '-' + winIdx);
        if (btn) {
            if (c === cmd) btn.classList.add('active');
            else btn.classList.remove('active');
        }
    });
}

// 우측 환기팬/유동팬/생육등 가동 시간 선택 변경
function changeDeviceTime(key, val) {
    manageState.devices[key].duration = val;
}

// 우측 설비 및 자동화 ON/OFF 버튼 클릭 시 MQTT 송신 및 UI 전환
function toggleDevicePower(key, state) {
    manageState.devices[key].power = state;
    var dev = manageState.devices[key];

    if (key === 'automation') {
        if (state === 'ON') {
            sendManageMQTT('SM-LOVE,AUTO_ON');
        } else {
            sendManageMQTT('SM-LOVE,AUTO_OFF');
        }
    } else {
        if (state === 'ON') {
            sendManageMQTT(dev.duration + ',' + dev.cmdKey + '_ON');
        } else {
            sendManageMQTT(dev.duration + ',' + dev.cmdKey + '_OFF');
        }
    }

    var onBtn = document.getElementById('dev-on-' + key);
    var offBtn = document.getElementById('dev-off-' + key);
    if (onBtn && offBtn) {
        if (state === 'ON') {
            onBtn.classList.add('active');
            offBtn.classList.remove('active');
        } else {
            offBtn.classList.add('active');
            onBtn.classList.remove('active');
        }
    }
}
