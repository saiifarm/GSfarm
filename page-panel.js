// [판넬연결 및 로그 데이터 페이지 렌더링 및 기능 구현]

function renderPanelPageHTML() {
    const container = document.getElementById('content-area');

    container.innerHTML = `
        <div class="panel-wrapper" style="width: 100%; height: 100%; padding: 10px; box-sizing: border-box; font-family: sans-serif; display: flex; gap: 12px; overflow: hidden; position: relative;">
            
            <!-- [좌측 영역] LOG DATA 출력 화면 (스크롤 기능 포함) -->
            <div style="flex: 1; background: #ffffff; border: 2px solid #5a8262; border-radius: 8px; padding: 12px; display: flex; flex-direction: column; height: 100%; box-sizing: border-box;">
                <div style="font-size: 15px; font-weight: bold; color: #000; margin-bottom: 8px; flex-shrink: 0;">LOG DATA</div>
                
                <!-- 로그 내용이 출력되는 스크롤 박스 -->
                <div id="log-scroll-container" style="flex-grow: 1; background: #f9f9f9; border: 1px solid #ccc; border-radius: 6px; padding: 10px; overflow-y: auto; font-family: monospace; font-size: 13px; color: #333; display: flex; flex-direction: column; gap: 6px; text-align: left;">
                    <div style="color: #666;">[시스템] 판넬연결 및 로그 모니터링 시스템이 대기 중입니다.</div>
                </div>
            </div>

            <!-- [우측 하단 영역] 버튼 3개 ([LOG 다운], [LOG 삭제], [농장연결]) -->
            <div style="display: flex; flex-direction: column; justify-content: flex-end; align-items: flex-end; gap: 8px; height: 100%; width: 140px; flex-shrink: 0;">
                <!-- 1. LOG 다운 (진한 초록색) -->
                <button onclick="handleLogDownload()" style="width: 100%; height: 38px; background: #448654; color: #ffffff; border: none; border-radius: 6px; font-weight: bold; font-size: 14px; cursor: pointer; box-shadow: 0 2px 4px rgba(0,0,0,0.15); transition: background 0.15s;">LOG 다운</button>
                <!-- 2. LOG 삭제 (진한 자주/보라색) -->
                <button onclick="handleLogDelete()" style="width: 100%; height: 38px; background: #803f5c; color: #ffffff; border: none; border-radius: 6px; font-weight: bold; font-size: 14px; cursor: pointer; box-shadow: 0 2px 4px rgba(0,0,0,0.15); transition: background 0.15s;">LOG 삭제</button>
                <!-- 3. 농장연결 (진한 벽돌/빨간색) -->
                <button onclick="handleFarmConnect()" style="width: 100%; height: 38px; background: #b33939; color: #ffffff; border: none; border-radius: 6px; font-weight: bold; font-size: 14px; cursor: pointer; box-shadow: 0 2px 4px rgba(0,0,0,0.15); transition: background 0.15s;">농장연결</button>
            </div>

        </div>
    `;
}

// 📌 텍스트 박스에 안내 메시지 추가 함수
function appendLogMessage(message, color = "#333") {
    const logContainer = document.getElementById('log-scroll-container');
    if (!logContainer) return;

    const now = new Date();
    const timeStr = String(now.getHours()).padStart(2, '0') + ':' + 
                    String(now.getMinutes()).padStart(2, '0') + ':' + 
                    String(now.getSeconds()).padStart(2, '0');

    const logItem = document.createElement('div');
    logItem.style.color = color;
    logItem.innerText = `[${timeStr}] ${message}`;
    
    logContainer.appendChild(logItem);
    logContainer.scrollTop = logContainer.scrollHeight;
}

// 1. [LOG 다운] 버튼 클릭 시 -> 서버에 단순 액션명만 전달 (토픽/페이로드 은닉)
function handleLogDownload() {
    fetch(WORKER_URL + '/api/mqtt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: "get_log" })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            appendLogMessage("💾 LOG 다운 요청 전송 완료", "#2980b9");
        } else {
            appendLogMessage("⚠️ 전송 실패", "#c0392b");
        }
    })
    .catch(err => {
        appendLogMessage("❌ 서버 통신 오류", "#c0392b");
    });
}

// 2. [LOG 삭제] 버튼 클릭 시 -> 좌측 텍스트 박스의 내용을 전부 지움
function handleLogDelete() {
    const logContainer = document.getElementById('log-scroll-container');
    if (logContainer) {
        logContainer.innerHTML = '';
    }
}

// 3. [농장연결] 버튼 클릭 시 -> 서버에 단순 액션명만 전달 (토픽/페이로드 은닉)
function handleFarmConnect() {
    fetch(WORKER_URL + '/api/mqtt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: "farm_connect" })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            appendLogMessage("🔗 농장연결 요청 전송 완료", "#d35400");
        } else {
            appendLogMessage("⚠️ 전송 실패", "#c0392b");
        }
    })
    .catch(err => {
        appendLogMessage("❌ 서버 통신 오류", "#c0392b");
    });
}

// 4. [MQTT: saiifarm24/smart_LOG 수신 핸들러] core.js에서 호출됨
function handleSmartLogMessage(payload) {
    const logContainer = document.getElementById('log-scroll-container');
    if (!logContainer) return;

    // (1) 먼저 텍스트 박스의 내용을 전부 지움
    logContainer.innerHTML = '';

    // (2) 데이터값을 텍스트 박스에 그대로 써줌
    const lines = payload.split('\n');
    lines.forEach(line => {
        const item = document.createElement('div');
        item.style.color = "#222";
        item.innerText = line;
        logContainer.appendChild(item);
    });

    logContainer.scrollTop = logContainer.scrollHeight;
}
