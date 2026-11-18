// [판넬연결 및 로그 데이터 페이지 렌더링 및 기능 구현]

function renderPanelPageHTML() {
    const container = document.getElementById('content-area');

    container.innerHTML = `
        <div class="panel-wrapper">
            
            <!-- [상단 영역] LOG DATA 출력 화면 (스크롤 기능 포함) -->
            <div class="panel-log-box">
                <div style="font-size: 15px; font-weight: bold; color: #000; margin-bottom: 8px; flex-shrink: 0; text-align: left;">LOG DATA</div>
                
                <!-- 로그 내용이 출력되는 스크롤 박스 -->
                <div id="log-scroll-container" class="panel-log-scroll">
                    <div style="color: #666;">[시스템] 판넬연결 및 로그 모니터링 시스템이 대기 중입니다.</div>
                </div>
            </div>

            <!-- [하단 영역] 버튼 3개 가로 방향으로 옆으로 나란히 배치 -->
            <div class="panel-btn-row">
                <button onclick="handleLogDownload()" class="panel-btn" style="background: #448654;">LOG 다운</button>
                <button onclick="handleLogDelete()" class="panel-btn" style="background: #803f5c;">LOG 삭제</button>
                <button onclick="handleFarmConnect()" class="panel-btn" style="background: #b33939;">농장연결</button>
            </div>

        </div>
    `;
}

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

function handleLogDownload() {
    const topic = "saiifarm24/smart_R";
    const payload = "saiiLOG,request";

    if (typeof mqttClient !== 'undefined' && mqttClient && mqttClient.connected) {
        try {
            mqttClient.publish(topic, payload, { qos: 2, retain: false });
            appendLogMessage(`💾 송신완료 [${topic}] : ${payload}`, "#2980b9");
        } catch (e) {
            appendLogMessage("❌ MQTT 송신 중 예외 발생", "#c0392b");
        }
    } else {
        appendLogMessage("⚠️ MQTT가 연결되어 있지 않습니다.", "#c0392b");
    }
}

function handleLogDelete() {
    const logContainer = document.getElementById('log-scroll-container');
    if (logContainer) {
        logContainer.innerHTML = '';
    }
}

function handleFarmConnect() {
    const topic = "saiifarm24/smart_R";
    const payload = "SMLOVE,AUTONOW00";

    if (typeof mqttClient !== 'undefined' && mqttClient && mqttClient.connected) {
        try {
            mqttClient.publish(topic, payload, { qos: 2, retain: false });
            appendLogMessage(`🔗 송신완료 [${topic}] : ${payload}`, "#d35400");
        } catch (e) {
            appendLogMessage("❌ MQTT 송신 중 예외 발생", "#c0392b");
        }
    } else {
        appendLogMessage("⚠️ MQTT가 연결되어 있지 않습니다.", "#c0392b");
    }
}

function handleSmartLogMessage(payload) {
    const logContainer = document.getElementById('log-scroll-container');
    if (!logContainer) return;

    logContainer.innerHTML = '';

    const lines = payload.split('\n');
    lines.forEach(line => {
        const item = document.createElement('div');
        item.style.color = "#222";
        item.innerText = line;
        logContainer.appendChild(item);
    });

    logContainer.scrollTop = logContainer.scrollHeight;
}
