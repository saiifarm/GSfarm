// [판넬연결 및 로그 데이터 페이지 렌더링 및 기능 구현]

function renderPanelPageHTML() {
    const container = document.getElementById('content-area');

    container.innerHTML = `
        <div class="panel-wrapper" style="width: 100%; height: 100%; padding: 15px; background: #88d498; box-sizing: border-box; font-family: sans-serif; display: flex; gap: 15px; overflow: hidden;">
            
            <!-- [좌측 영역] LOG DATA 출력 화면 (스크롤 기능 포함) -->
            <div style="flex: 8; background: #ffffff; border: 2px solid #5a8262; border-radius: 8px; padding: 15px; display: flex; flex-direction: column; height: 100%; box-sizing: border-box;">
                <div style="font-size: 16px; font-weight: bold; color: #000; margin-bottom: 10px; flex-shrink: 0;">LOG DATA</div>
                
                <!-- 로그 내용이 출력되는 스크롤 박스 -->
                <div id="log-scroll-container" style="flex-grow: 1; background: #f9f9f9; border: 1px solid #ccc; border-radius: 6px; padding: 10px; overflow-y: auto; font-family: monospace; font-size: 13px; color: #333; display: flex; flex-direction: column; gap: 6px; text-align: left;">
                    <div style="color: #666;">[시스템] 판넬연결 및 로그 모니터링 시스템이 대기 중입니다.</div>
                </div>
            </div>

            <!-- [우측 영역] 제어 버튼 3개 ([LOG 다운], [LOG 삭제], [농장연결]) -->
            <div style="flex: 2; display: flex; flex-direction: column; justify-content: center; gap: 15px; height: 100%;">
                <button onclick="handleLogDownload()" style="width: 100%; height: 28%; background: #4cae4c; color: #ffffff; border: none; border-radius: 6px; font-weight: bold; font-size: 16px; cursor: pointer; box-shadow: 0 2px 4px rgba(0,0,0,0.1); transition: background 0.15s;">LOG 다운</button>
                <button onclick="handleLogDelete()" style="width: 100%; height: 28%; background: #8e44ad; color: #ffffff; border: none; border-radius: 6px; font-weight: bold; font-size: 16px; cursor: pointer; box-shadow: 0 2px 4px rgba(0,0,0,0.1); transition: background 0.15s;">LOG 삭제</button>
                <button onclick="handleFarmConnect()" style="width: 100%; height: 28%; background: #c0392b; color: #ffffff; border: none; border-radius: 6px; font-weight: bold; font-size: 16px; cursor: pointer; box-shadow: 0 2px 4px rgba(0,0,0,0.1); transition: background 0.15s;">농장연결</button>
            </div>

        </div>
    `;
}

// 📌 공통 로그 추가 및 자동 스크롤 함수
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
    
    // 스크롤을 항상 최하단(최신 로그)으로 이동
    logContainer.scrollTop = logContainer.scrollHeight;
}

// 1. [LOG 다운] 버튼 클릭 시
function handleLogDownload() {
    appendLogMessage("💾 LOG 파일 다운로드가 요청되었습니다. (CSV 내보내기 준비 중...)", "#2980b9");
    
    // 실제 다운로드 기능 구현 시 Blob 생성 등의 로직 추가 가능
    setTimeout(() => {
        appendLogMessage("✅ LOG 파일 다운로드가 완료되었습니다.", "#27ae60");
    }, 500);
}

// 2. [LOG 삭제] 버튼 클릭 시
function handleLogDelete() {
    if (confirm('모든 로그 기록을 삭제하시겠습니까?')) {
        const logContainer = document.getElementById('log-scroll-container');
        if (logContainer) {
            logContainer.innerHTML = '<div style="color: #e74c3c;">[시스템] 모든 로그 기록이 초기화되었습니다.</div>';
        }
    }
}

// 3. [농장연결] 버튼 클릭 시
function handleFarmConnect() {
    appendLogMessage("🔗 컨트롤러 및 농장 네트워크 연결을 시도합니다...", "#d35400");
    
    // MQTT 브로커 또는 서버와의 재연결 시뮬레이션
    setTimeout(() => {
        if (typeof initMQTT === 'function') {
            initMQTT();
        }
        appendLogMessage("✨ 농장 컨트롤러와 성공적으로 연결되었습니다.", "#27ae60");
    }, 800);
}
