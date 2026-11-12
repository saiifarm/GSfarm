// [농장관리 페이지 상태 관리, UI 렌더링 및 조작 이벤트]
let manageState = {
    windows: [
        { id: 'w1', title: '-1중(좌)-', statusImg: 'red.png', targetPct: 100, cmd: 'stop', currentPct: 0 },
        { id: 'w2', title: '-1중(우)-', statusImg: 'red.png', targetPct: 100, cmd: 'stop', currentPct: 0 },
        { id: 'w3', title: '-2중(좌)-', statusImg: 'red.png', targetPct: 100, cmd: 'stop', currentPct: 0 },
        { id: 'w4', title: '-2중(우)-', statusImg: 'red.png', targetPct: 100, cmd: 'stop', currentPct: 0 },
        { id: 'w5', title: '-삽목(좌)-', statusImg: 'red.png', targetPct: 100, cmd: 'stop', currentPct: 0 },
        { id: 'w6', title: '-삽목(우)-', statusImg: 'red.png', targetPct: 100, cmd: 'stop', currentPct: 0 }
    ],
    devices: {
        ventFan: { duration: '1분', power: 'OFF' },
        circFan: { duration: '1분', power: 'OFF' },
        growLight: { duration: '1분', power: 'OFF' },
        automation: { power: 'OFF' }
    }
};

function renderManagePageHTML() {
    const container = document.getElementById('content-area');
    const pctOptions = [25, 50, 75, 100];

    const windowsHTML = manageState.windows.map(function(win, idx) {
        const checksHTML = pctOptions.map(function(pct) {
            const isChecked = (win.targetPct === pct) ? 'checked' : '';
            return `
                <div class="win-check-label" onclick="selectWindowPct(${idx}, ${pct})">
                    <span class="win-check-box ${isChecked}" id="chk-${idx}-${pct}"></span>
                    <span>${pct}%</span>
                </div>
            `;
        }).join('');

        return `
            <div class="win-col">
                <div class="win-title">${win.title}</div>
                <img src="${win.statusImg}" alt="상태" class="win-status-img" id="win-img-${idx}">
                <div class="win-checks">${checksHTML}</div>
                <div class="win-btns">
                    <button class="win-btn ${win.cmd === 'open' ? 'active' : ''}" id="btn-open-${idx}" onclick="controlWindow(${idx}, 'open')">열기</button>
                    <button class="win-btn ${win.cmd === 'stop' ? 'active' : ''}" id="btn-stop-${idx}" onclick="controlWindow(${idx}, 'stop')">정지</button>
                    <button class="win-btn ${win.cmd === 'close' ? 'active' : ''}" id="btn-close-${idx}" onclick="controlWindow(${idx}, 'close')">닫기</button>
                </div>
                <div class="win-percent" id="win-pct-text-${idx}">${win.currentPct}%</div>
            </div>
        `;
    }).join('');

    const timeOptions = ['1분', '1시간', '2시간', '3시간', '4시간', '5시간', '6시간', '7시간', '8시간'];

    function buildDeviceBox(key, label) {
        const dev = manageState.devices[key];
        const optionsHTML = timeOptions.map(function(opt) {
            return `<option value="${opt}" ${dev.duration === opt ? 'selected' : ''}>${opt}</option>`;
        }).join('');

        return `
            <div class="dev-box">
                <div class="dev-title">${label}</div>
                <div class="dev-controls">
                    <select class="dev-select" onchange="changeDeviceTime('${key}', this.value)">${optionsHTML}</select>
                    <div class="dev-btn-row">
                        <button class="dev-btn ${dev.power === 'ON' ? 'active' : ''}" id="dev-on-${key}" onclick="toggleDevicePower('${key}', 'ON')">ON</button>
                        <button class="dev-btn ${dev.power === 'OFF' ? 'active' : ''}" id="dev-off-${key}" onclick="toggleDevicePower('${key}', 'OFF')">OFF</button>
                    </div>
                </div>
            </div>
        `;
    }

    const autoDev = manageState.devices.automation;
    const autoHTML = `
        <div class="auto-box">
            <div class="auto-title">자동화</div>
            <div class="auto-btn-row">
                <button class="dev-btn ${autoDev.power === 'ON' ? 'active' : ''}" id="dev-on-automation" onclick="toggleDevicePower('automation', 'ON')">ON</button>
                <button class="dev-btn ${autoDev.power === 'OFF' ? 'active' : ''}" id="dev-off-automation" onclick="toggleDevicePower('automation', 'OFF')">OFF</button>
            </div>
        </div>
    `;

    container.innerHTML = `
        <div class="manage-wrapper">
            <div class="manage-windows-area">${windowsHTML}</div>
            <div class="manage-devices-area">
                ${buildDeviceBox('ventFan', '환기팬')}
                <div class="dev-divider"></div>
                ${buildDeviceBox('circFan', '유동팬')}
                <div class="dev-divider"></div>
                ${buildDeviceBox('growLight', '생육등')}
                ${autoHTML}
            </div>
        </div>
    `;
}

// 창 개폐 목표 비율(25%/50%/75%/100%) 단일 선택 핸들러
function selectWindowPct(winIdx, pct) {
    manageState.windows[winIdx].targetPct = pct;
    [25, 50, 75, 100].forEach(function(val) {
        const box = document.getElementById('chk-' + winIdx + '-' + val);
        if (box) {
            if (val === pct) box.classList.add('checked');
            else box.classList.remove('checked');
        }
    });
}

// 창 개폐 제어 버튼(열기/정지/닫기) 및 상단 이미지(up.png / red.png / down.png) 전환
function controlWindow(winIdx, cmd) {
    const win = manageState.windows[winIdx];
    win.cmd = cmd;

    if (cmd === 'open') win.statusImg = 'up.png';
    else if (cmd === 'close') win.statusImg = 'down.png';
    else win.statusImg = 'red.png';

    const imgEl = document.getElementById('win-img-' + winIdx);
    if (imgEl) imgEl.src = win.statusImg;

    ['open', 'stop', 'close'].forEach(function(c) {
        const btn = document.getElementById('btn-' + c + '-' + winIdx);
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

// 우측 설비 및 자동화 ON/OFF 버튼 전환
function toggleDevicePower(key, state) {
    manageState.devices[key].power = state;
    const onBtn = document.getElementById('dev-on-' + key);
    const offBtn = document.getElementById('dev-off-' + key);
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
