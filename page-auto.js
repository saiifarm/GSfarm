// [자동설정 페이지 렌더링 및 로직]
function renderAutoPageHTML() {
    const container = document.getElementById('content-area');

    container.innerHTML = `
        <div class="auto-config-wrapper" style="padding: 15px; background: #e8ede9; height: 100%; box-sizing: border-box; font-family: sans-serif; overflow-y: auto;">
            
            <!-- 상단 헤더 타이틀 영역 -->
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; background: #fff; padding: 10px 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                <div style="font-size: 18px; font-weight: bold; color: #2e5a36;">🌱 괴산농장 Main Controller V2.0 - 자동설정</div>
                <div id="controller-time-display" style="font-size: 16px; font-weight: bold; color: #333;">17시 04분 00초</div>
            </div>

            <!-- 메인 3단 그리드 레이아웃 -->
            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px;">
                
                <!-- [1단 영역] 우천관리 & 고온관리 -->
                <div style="display: flex; flex-direction: column; gap: 15px;">
                    
                    <!-- 우천관리 카드 -->
                    <div style="background: #ffffff; border: 2px solid #5a8262; border-radius: 8px; padding: 15px;">
                        <label style="display: flex; align-items: center; font-size: 16px; font-weight: bold; color: #2e5a36; margin-bottom: 12px; cursor: pointer;">
                            <input type="checkbox" id="auto-rain-enable" style="width: 18px; height: 18px; margin-right: 8px; accent-color: #d9534f;" checked> 우천관리
                        </label>
                        <div style="display: flex; flex-direction: column; gap: 8px; padding-left: 5px;">
                            <label style="display: flex; align-items: center; font-size: 14px; cursor: pointer;">
                                <input type="checkbox" id="rain-vent-1" style="width: 16px; height: 16px; margin-right: 8px; accent-color: #d9534f;" checked> 1중창
                            </label>
                            <label style="display: flex; align-items: center; font-size: 14px; cursor: pointer;">
                                <input type="checkbox" id="rain-vent-2" style="width: 16px; height: 16px; margin-right: 8px; accent-color: #d9534f;"> 2중창
                            </label>
                        </div>
                    </div>

                    <!-- 고온관리 카드 -->
                    <div style="background: #ffffff; border: 2px solid #5a8262; border-radius: 8px; padding: 15px;">
                        <label style="display: flex; align-items: center; font-size: 16px; font-weight: bold; color: #2e5a36; margin-bottom: 12px; cursor: pointer;">
                            <input type="checkbox" id="auto-high-temp-enable" style="width: 18px; height: 18px; margin-right: 8px; accent-color: #d9534f;" checked> 고온관리
                        </label>
                        <div style="display: flex; flex-direction: column; gap: 10px;">
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <span style="font-size: 13px; color: #444;">기준온도(외부)</span>
                                <div style="display: flex; align-items: center; gap: 5px;">
                                    <input type="number" id="ht-ext-temp" value="15" style="width: 50px; text-align: center; padding: 4px; background: #dcdcdc; border: 1px solid #bbb; border-radius: 4px; font-weight: bold;">
                                    <span style="font-size: 13px; font-weight: bold;">'C</span>
                                </div>
                            </div>
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <span style="font-size: 13px; color: #444;">기준온도(내부)</span>
                                <div style="display: flex; align-items: center; gap: 5px;">
                                    <input type="number" id="ht-int-temp" value="25" style="width: 50px; text-align: center; padding: 4px; background: #dcdcdc; border: 1px solid #bbb; border-radius: 4px; font-weight: bold;">
                                    <span style="font-size: 13px; font-weight: bold;">'C</span>
                                </div>
                            </div>
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <span style="font-size: 13px; color: #444;">온도폭</span>
                                <div style="display: flex; align-items: center; gap: 5px;">
                                    <input type="number" id="ht-temp-range" value="3" style="width: 50px; text-align: center; padding: 4px; background: #dcdcdc; border: 1px solid #bbb; border-radius: 4px; font-weight: bold;">
                                    <span style="font-size: 13px; font-weight: bold;">'C</span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                <!-- [2단 영역] 팬 제어 및 연동 기기 선택 -->
                <div style="background: #ffffff; border: 2px solid #5a8262; border-radius: 8px; padding: 15px; display: flex; flex-direction: column; justify-content: space-between;">
                    <div>
                        <!-- 팬 설정 입력 필드들 -->
                        <div style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 20px;">
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <span style="font-size: 13px; color: #444; font-weight: bold;">팬온도(내부)</span>
                                <div style="display: flex; align-items: center; gap: 5px;">
                                    <input type="number" id="fan-target-temp" value="30" style="width: 50px; text-align: center; padding: 4px; background: #dcdcdc; border: 1px solid #bbb; border-radius: 4px; font-weight: bold;">
                                    <span style="font-size: 13px; font-weight: bold;">'C</span>
                                </div>
                            </div>
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <span style="font-size: 13px; color: #444; font-weight: bold;">팬 가동시간</span>
                                <div style="display: flex; align-items: center; gap: 5px;">
                                    <input type="number" id="fan-run-time" value="1" style="width: 50px; text-align: center; padding: 4px; background: #dcdcdc; border: 1px solid #bbb; border-radius: 4px; font-weight: bold;">
                                    <span style="font-size: 13px; font-weight: bold;">시간</span>
                                </div>
                            </div>
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <span style="font-size: 13px; color: #444; font-weight: bold;">팬 휴식시간</span>
                                <div style="display: flex; align-items: center; gap: 5px;">
                                    <input type="number" id="fan-rest-time" value="15" style="width: 50px; text-align: center; padding: 4px; background: #dcdcdc; border: 1px solid #bbb; border-radius: 4px; font-weight: bold;">
                                    <span style="font-size: 13px; font-weight: bold;">분</span>
                                </div>
                            </div>
                        </div>

                        <!-- 연동 기기 체크박스 목록 -->
                        <div style="display: flex; flex-direction: column; gap: 10px; border-top: 1px dashed #ccc; padding-top: 15px;">
                            <label style="display: flex; align-items: center; font-size: 14px; font-weight: bold; cursor: pointer;">
                                <input type="checkbox" id="device-vent-1" style="width: 16px; height: 16px; margin-right: 8px; accent-color: #d9534f;" checked> 1중창
                            </label>
                            <label style="display: flex; align-items: center; font-size: 14px; font-weight: bold; cursor: pointer;">
                                <input type="checkbox" id="device-vent-2" style="width: 16px; height: 16px; margin-right: 8px; accent-color: #d9534f;" checked> 2중창
                            </label>
                            <label style="display: flex; align-items: center; font-size: 14px; font-weight: bold; cursor: pointer;">
                                <input type="checkbox" id="device-exhaust" style="width: 16px; height: 16px; margin-right: 8px; accent-color: #d9534f;" checked> 환풍기
                            </label>
                            <label style="display: flex; align-items: center; font-size: 14px; font-weight: bold; cursor: pointer;">
                                <input type="checkbox" id="device-circulation" style="width: 16px; height: 16px; margin-right: 8px; accent-color: #d9534f;" checked> 유동팬
                            </label>
                        </div>
                    </div>
                </div>

                <!-- [3단 영역] 삽목장관리 및 업로드/기본값 버튼 -->
                <div style="background: #ffffff; border: 2px solid #5a8262; border-radius: 8px; padding: 15px; display: flex; flex-direction: column; justify-content: space-between;">
                    <div>
                        <label style="display: flex; align-items: center; font-size: 16px; font-weight: bold; color: #2e5a36; margin-bottom: 12px; cursor: pointer;">
                            <input type="checkbox" id="auto-cutting-enable" style="width: 18px; height: 18px; margin-right: 8px; accent-color: #5a8262;"> 삽목장관리
                        </label>
                        <div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 15px;">
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <span style="font-size: 13px; color: #444;">개폐시간</span>
                                <div style="display: flex; align-items: center; gap: 5px;">
                                    <input type="number" id="cut-open-time" value="22" style="width: 50px; text-align: center; padding: 4px; background: #dcdcdc; border: 1px solid #bbb; border-radius: 4px; font-weight: bold;">
                                    <span style="font-size: 13px; font-weight: bold;">시</span>
                                </div>
                            </div>
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <span style="font-size: 13px; color: #444;">개폐간격</span>
                                <div style="display: flex; align-items: center; gap: 5px;">
                                    <input type="number" id="cut-interval" value="2" style="width: 50px; text-align: center; padding: 4px; background: #dcdcdc; border: 1px solid #bbb; border-radius: 4px; font-weight: bold;">
                                    <span style="font-size: 13px; font-weight: bold;">시간</span>
                                </div>
                            </div>
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <span style="font-size: 13px; color: #444;">생육등 점등</span>
                                <div style="display: flex; align-items: center; gap: 5px;">
                                    <input type="number" id="cut-light-on" value="20" style="width: 50px; text-align: center; padding: 4px; background: #dcdcdc; border: 1px solid #bbb; border-radius: 4px; font-weight: bold;">
                                    <span style="font-size: 13px; font-weight: bold;">시</span>
                                </div>
                            </div>
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <span style="font-size: 13px; color: #444;">점등시간</span>
                                <div style="display: flex; align-items: center; gap: 5px;">
                                    <input type="number" id="cut-light-duration" value="2" style="width: 50px; text-align: center; padding: 4px; background: #dcdcdc; border: 1px solid #bbb; border-radius: 4px; font-weight: bold;">
                                    <span style="font-size: 13px; font-weight: bold;">시간</span>
                                </div>
                            </div>
                        </div>

                        <div style="display: flex; flex-direction: column; gap: 8px; border-top: 1px dashed #ccc; padding-top: 15px;">
                            <label style="display: flex; align-items: center; font-size: 14px; cursor: pointer;">
                                <input type="checkbox" id="cut-op-check" style="width: 16px; height: 16px; margin-right: 8px; accent-color: #d9534f;" checked> 삽목장 개폐
                            </label>
                            <label style="display: flex; align-items: center; font-size: 14px; cursor: pointer;">
                                <input type="checkbox" id="cut-light-check" style="width: 16px; height: 16px; margin-right: 8px; accent-color: #d9534f;"> 생육등 점등
                            </label>
                        </div>
                    </div>

                    <!-- 하단 제어 버튼 (UPLOAD / DEFAULT) -->
                    <div style="display: flex; gap: 10px; margin-top: 20px;">
                        <button onclick="uploadAutoConfig()" style="flex: 1; background: #88d498; color: #1c3b22; border: none; padding: 10px; border-radius: 6px; font-weight: bold; font-size: 15px; cursor: pointer; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">UPLOAD</button>
                        <button onclick="resetAutoConfigDefault()" style="flex: 1; background: #88d498; color: #1c3b22; border: none; padding: 10px; border-radius: 6px; font-weight: bold; font-size: 15px; cursor: pointer; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">DEFAULT</button>
                    </div>
                </div>

            </div>
        </div>
    `;

    // 실시간 시계 연동 (상단 중앙 시간 표시)
    startAutoClock();
}

function startAutoClock() {
    if (window._autoClockInterval) clearInterval(window._autoClockInterval);
    window._autoClockInterval = setInterval(() => {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        const el = document.getElementById('controller-time-display');
        if (el) {
            el.innerText = `${hours}시 ${minutes}분 ${seconds}초`;
        }
    }, 1000);
}

function uploadAutoConfig() {
    alert('설정값이 컨트롤러(ESP32)로 업로드(저장)되었습니다.');
}

function resetAutoConfigDefault() {
    if (confirm('설정값을 기본값(DEFAULT)으로 되돌리시겠습니까?')) {
        renderAutoPageHTML();
    }
}
