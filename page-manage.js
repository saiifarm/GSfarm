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

// Cloudflare Worker를 통한 안전한 MQTT 발행 함수
function sendManageMQTT(payloadStr) {
    const topic = "saiifarm24/smart_R";
    
    fetch(WORKER_URL + '/api/mqtt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            topic: topic,
            payload: payloadStr,
            qos: 2,
            retain: false
        })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            console.log("📤 MQTT Proxy 송신 성공 [saiifarm24/smart_R]:", payloadStr);
        } else {
            console.error("MQTT Proxy 송신 실패:", data.message);
        }
    })
    .catch(err => {
        console.error("MQTT Proxy 통신 오류:", err);
    });
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

function changeDeviceTime(key, val) {
    manageState.devices[key].duration = val;
}

function toggleDevicePower(key, state) {
    var dev = manageState.devices[key];
    if (key === 'automation') {
        sendManageMQTT('SM-LOVE,AUTO_' + state);
    } else {
        sendManageMQTT(dev.duration + ',' + dev.prefix + '_' + state);
    }
}

function updateWinUI(idx, state) {
    var win = manageState.windows[idx];
    var imgEl = document.getElementById('win-img-' + idx);
    if (imgEl) imgEl.src = win.statusImg;

    var btnOpen = document.getElementById('btn-open-' + idx);
    var btnStop = document.getElementById('btn-stop-' + idx);
    var btnClose = document.getElementById('btn-close-' + idx);

    if (!btnOpen || !btnStop || !btnClose) return;

    btnOpen.style.background = '#c7c7c7';
    btnStop.style.background = '#c7c7c7';
    btnClose.style.background = '#c7c7c7';

    if (state === 'open') btnOpen.style.background = '#007bff';
    else if (state === 'stop') btnStop.style.background = '#dc3545';
    else if (state === 'close') btnClose.style.background = '#007bff';
}

function updateDeviceUI(key, state) {
    var onBtn = document.getElementById('dev-on-' + key);
    var offBtn = document.getElementById('dev-off-' + key);
    if (!onBtn || !offBtn) return;

    if (state === 'ON') {
        onBtn.style.background = '#007bff';
        offBtn.style.background = '#c7c7c7';
    } else {
        onBtn.style.background = '#c7c7c7';
        offBtn.style.background = '#dc3545';
    }
}

function syncAllManageUI() {
    manageState.windows.forEach(function(win, idx) {
        updateWinUI(idx, win.cmd);
    });
    Object.keys(manageState.devices).forEach(function(key) {
        updateDeviceUI(key, manageState.devices[key].power);
    });
}
