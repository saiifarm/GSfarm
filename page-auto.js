// [괴산농장 Main Controller V2.0 - 자동설정 기본값 정의]
const DEFAULT_AUTO_CONFIG = {
    // 1. 우천관리
    rainEnable: true,
    rainVent1: true,
    rainVent2: false,

    // 2. 고온관리
    highTempEnable: true,
    htExtTemp: 15,
    htIntTemp: 25,
    htTempRange: 3,

    // 3. 팬 제어 및 연동 기기
    fanTargetTemp: 30,
    fanRunTime: 1,
    fanRestTime: 15,
    deviceVent1: true,
    deviceVent2: true,
    deviceExhaust: true,
    deviceCirculation: true,

    // 4. 삽목장관리
    cuttingEnable: false,
    cutOpenTime: 22,
    cutInterval: 2,
    cutLightOn: 20,
    cutLightDuration: 2,
    cutOpCheck: true,
    cutLightCheck: false
};

// [자동설정 페이지 렌더링 및 로직]
function renderAutoPageHTML() {
    const container = document.getElementById('content-area');
    const cfg = DEFAULT_AUTO_CONFIG;

    container.innerHTML = `
        <div class="auto-config-wrapper" style="width: 100%; height: 100%; padding: 15px; background: #88d498; box-sizing: border-box; font-family: sans-serif; overflow-y: auto;">
            
            <!-- 메인 3단 그리드 레이아웃 -->
            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px; width: 100%; height: 100%; box-sizing: border-box;">
                
                <!-- [1단 영역] 우천관리 & 고온관리 -->
                <div style="display: flex; flex-direction: column; gap: 15px;">
                    
                    <!-- 우천관리 카드 -->
                    <div style="background: #ffffff; border: 2px solid #5a8262; border-radius: 8px; padding: 15px;">
                        <label style="display: flex; align-items: center; font-size: 16px; font-weight: bold; color: #000; margin-bottom: 12px; cursor: pointer;">
                            <input type="checkbox" id="auto-rain-enable" style="width: 18px; height: 18px; margin-right: 8px; accent-color: #d9534f;" ${cfg.rainEnable ? 'checked' : ''}> 우천관리
                        </label>
                        <div style="display: flex; flex-direction: column; gap: 8px; padding-left: 5px;">
                            <label style="display: flex; align-items: center; font-size: 14px; color: #000; cursor: pointer;">
                                <input type="checkbox" id="rain-vent-1" style="width: 16px; height: 16px; margin-right: 8px; accent-color: #d9534f;" ${cfg.rainVent1 ? 'checked' : ''}> 1중창
                            </label>
                            <label style="display: flex; align-items: center; font-size: 14px; color: #000; cursor: pointer;">
                                <input type="checkbox" id="rain-vent-2" style="width: 16px; height: 16px; margin-right: 8px; accent-color: #d9534f;" ${cfg.rainVent2 ? 'checked' : ''}> 2중창
                            </label>
                        </div>
                    </div>

                    <!-- 고온관리 카드 -->
                    <div style="background: #ffffff; border: 2px solid #5a8262; border-radius: 8px; padding: 15px;">
                        <label style="display: flex; align-items: center; font-size: 16px; font-weight: bold; color: #000; margin-bottom: 12px; cursor: pointer;">
                            <input type="checkbox" id="auto-high-temp-enable" style="width: 18px; height: 18px; margin-right: 8px; accent-color: #d9534f;" ${cfg.highTempEnable ? 'checked' : ''}> 고온관리
                        </label>
                        <div style="display: grid; grid-template-columns: 1fr auto; row-gap: 10px; column-gap: 10px; align-items: center;">
                            <span style="font-size: 13px; color: #000;">기준온도(외부)</span>
                            <div style="display: flex; align-items: center; gap: 5px;">
                                <select id="ht-ext-temp" style="width: 70px; text-align: center; padding: 4px; background: #dcdcdc; border: 1px solid #bbb; border-radius: 4px; font-weight: bold; color: #000;">
                                    ${generateNumberOptions(5, 35, cfg.htExtTemp)}
                                </select>
                                <span style="font-size: 13px; font-weight: bold; color: #000;">'C</span>
                            </div>

                            <span style="font-size: 13px; color: #000;">기준온도(내부)</span>
                            <div style="display: flex; align-items: center; gap: 5px;">
                                <select id="ht-int-temp" style="width: 70px; text-align: center; padding: 4px; background: #dcdcdc; border: 1px solid #bbb; border-radius: 4px; font-weight: bold; color: #000;">
                                    ${generateNumberOptions(10, 45, cfg.htIntTemp)}
                                </select>
                                <span style="font-size: 13px; font-weight: bold; color: #000;">'C</span>
                            </div>

                            <span style="font-size: 13px; color: #000;">온도폭</span>
                            <div style="display: flex; align-items: center; gap: 5px;">
                                <select id="ht-temp-range" style="width: 70px; text-align: center; padding: 4px; background: #dcdcdc; border: 1px solid #bbb; border-radius: 4px; font-weight: bold; color: #000;">
                                    ${generateNumberOptions(1, 10, cfg.htTempRange)}
                                </select>
                                <span style="font-size: 13px; font-weight: bold; color: #000;">'C</span>
                            </div>
                        </div>
                    </div>

                </div>

                <!-- [2단 영역] 팬 제어 및 연동 기기 선택 -->
                <div style="background: #ffffff; border: 2px solid #5a8262; border-radius: 8px; padding: 15px; display: flex; flex-direction: column; justify-content: space-between;">
                    <div>
                        <div style="display: grid; grid-template-columns: 1fr auto; row-gap: 12px; column-gap: 10px; align-items: center; margin-bottom: 20px;">
                            <span style="font-size: 13px; color: #000; font-weight: bold;">팬온도(내부)</span>
                            <div style="display: flex; align-items: center; gap: 5px;">
                                <select id="fan-target-temp" style="width: 70px; text-align: center; padding: 4px; background: #dcdcdc; border: 1px solid #bbb; border-radius: 4px; font-weight: bold; color: #000;">
                                    ${generateNumberOptions(15, 50, cfg.fanTargetTemp)}
                                </select>
                                <span style="font-size: 13px; font-weight: bold; color: #000;">'C</span>
                            </div>

                            <span style="font-size: 13px; color: #000; font-weight: bold;">팬 가동시간</span>
                            <div style="display: flex; align-items: center; gap: 5px;">
                                <select id="fan-run-time" style="width: 70px; text-align: center; padding: 4px; background: #dcdcdc; border: 1px solid #bbb; border-radius: 4px; font-weight: bold; color: #000;">
                                    ${generateNumberOptions(1, 12, cfg.fanRunTime)}
                                </select>
                                <span style="font-size: 13px; font-weight: bold; color: #000;">시간</span>
                            </div>

                            <span style="font-size: 13px; color: #000; font-weight: bold;">팬 휴식시간</span>
                            <div style="display: flex; align-items: center; gap: 5px;">
                                <select id="fan-rest-time" style="width: 70px; text-align: center; padding: 4px; background: #dcdcdc; border: 1px solid #bbb; border-radius: 4px; font-weight: bold; color: #000;">
                                    ${generateNumberOptions(5, 60, cfg.fanRestTime, 5)}
                                </select>
                                <span style="font-size: 13px; font-weight: bold; color: #000;">분</span>
                            </div>
                        </div>

                        <!-- 연동 기기 체크박스 목록 -->
                        <div style="display: flex; flex-direction: column; gap: 10px; border-top: 1px dashed #ccc; padding-top: 15px;">
                            <label style="display: flex; align-items: center; font-size: 14px; font-weight: bold; color: #000; cursor: pointer;">
                                <input type="checkbox" id="device-vent-1" style="width: 16px; height: 16px; margin-right: 8px; accent-color: #d9534f;" ${cfg.deviceVent1 ? 'checked' : ''}> 1중창
                            </label>
                            <label style="display: flex; align-items: center; font-size: 14px; font-weight: bold; color: #000; cursor: pointer;">
                                <input type="checkbox" id="device-vent-2" style="width: 16px; height: 16px; margin-right: 8px; accent-color: #d9534f;" ${cfg.deviceVent2 ? 'checked' : ''}> 2중창
                            </label>
                            <label style="display: flex; align-items: center; font-size: 14px; font-weight: bold; color: #000; cursor: pointer;">
                                <input type="checkbox" id="device-exhaust" style="width: 16px; height: 16px; margin-right: 8px; accent-color: #d9534f;" ${cfg.deviceExhaust ? 'checked' : ''}> 환풍기
                            </label>
                            <label style="display: flex; align-items: center; font-size: 14px; font-weight: bold; color: #000; cursor: pointer;">
                                <input type="checkbox" id="device-circulation" style="width: 16px; height: 16px; margin-right: 8px; accent-color: #d9534f;" ${cfg.deviceCirculation ? 'checked' : ''}> 유동팬
                            </label>
                        </div>
                    </div>
                </div>

                <!-- [3단 영역] 삽목장관리 및 업로드/기본값 버튼 -->
                <div style="background: #ffffff; border: 2px solid #5a8262; border-radius: 8px; padding: 15px; display: flex; flex-direction: column; justify-content: space-between;">
                    <div>
                        <label style="display: flex; align-items: center; font-size: 16px; font-weight: bold; color: #000; margin-bottom: 12px; cursor: pointer;">
                            <input type="checkbox" id="auto-cutting-enable" style="width: 18px; height: 18px; margin-right: 8px; accent-color: #5a8262;" ${cfg.cuttingEnable ? 'checked' : ''}> 삽목장관리
                        </label>
                        <div style="display: grid; grid-template-columns: 1fr auto; row-gap: 10px; column-gap: 10px; align-items: center; margin-bottom: 15px;">
                            <span style="font-size: 13px; color: #000;">개폐시간</span>
                            <div style="display: flex; align-items: center; gap: 5px;">
                                <select id="cut-open-time" style="width: 70px; text-align: center; padding: 4px; background: #dcdcdc; border: 1px solid #bbb; border-radius: 4px; font-weight: bold; color: #000;">
                                    ${generateNumberOptions(0, 23, cfg.cutOpenTime)}
                                </select>
                                <span style="font-size: 13px; font-weight: bold; color: #000;">시</span>
                            </div>

                            <span style="font-size: 13px; color: #000;">개폐간격</span>
                            <div style="display: flex; align-items: center; gap: 5px;">
                                <select id="cut-interval" style="width: 70px; text-align: center; padding: 4px; background: #dcdcdc; border: 1px solid #bbb; border-radius: 4px; font-weight: bold; color: #000;">
                                    ${generateNumberOptions(1, 12, cfg.cutInterval)}
                                </select>
                                <span style="font-size: 13px; font-weight: bold; color: #000;">시간</span>
                            </div>

                            <span style="font-size: 13px; color: #000;">생육등 점등</span>
                            <div style="display: flex; align-items: center; gap: 5px;">
                                <select id="cut-light-on" style="width: 70px; text-align: center; padding: 4px; background: #dcdcdc; border: 1px solid #bbb; border-radius: 4px; font-weight: bold; color: #000;">
                                    ${generateNumberOptions(0, 23, cfg.cutLightOn)}
                                </select>
                                <span style="font-size: 13px; font-weight: bold; color: #000;">시</span>
                            </div>

                            <span style="font-size: 13px; color: #000;">점등시간</span>
                            <div style="display: flex; align-items: center; gap: 5px;">
                                <select id="cut-light-duration" style="width: 70px; text-align: center; padding: 4px; background: #dcdcdc; border: 1px solid #bbb; border-radius: 4px; font-weight: bold; color: #000;">
                                    ${generateNumberOptions(1, 12, cfg.cutLightDuration)}
                                </select>
                                <span style="font-size: 13px; font-weight: bold; color: #000;">시간</span>
                            </div>
                        </div>

                        <div style="display: flex; flex-direction: column; gap: 8px; border-top: 1px dashed #ccc; padding-top: 15px;">
                            <label style="display: flex; align-items: center; font-size: 14px; color: #000; cursor: pointer;">
                                <input type="checkbox" id="cut-op-check" style="width: 16px; height: 16px; margin-right: 8px; accent-color: #d9534f;" ${cfg.cutOpCheck ? 'checked' : ''}> 삽목장 개폐
                            </label>
                            <label style="display: flex; align-items: center; font-size: 14px; color: #000; cursor: pointer;">
                                <input type="checkbox" id="cut-light-check" style="width: 16px; height: 16px; margin-right: 8px; accent-color: #d9534f;" ${cfg.cutLightCheck ? 'checked' : ''}> 생육등 점등
                            </label>
                        </div>
                    </div>

                    <!-- 하단 제어 버튼 (UPLOAD / DEFAULT) -->
                    <div style="display: flex; gap: 10px; margin-top: 20px;">
                        <button onclick="uploadAutoConfig()" style="flex: 1; background: #88d498; color: #000; border: none; padding: 10px; border-radius: 6px; font-weight: bold; font-size: 15px; cursor: pointer; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">UPLOAD</button>
                        <button onclick="resetAutoConfigDefault()" style="flex: 1; background: #88d498; color: #000; border: none; padding: 10px; border-radius: 6px; font-weight: bold; font-size: 15px; cursor: pointer; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">DEFAULT</button>
                    </div>
                </div>

            </div>
        </div>
    `;
}

// 숫자를 동적으로 드롭다운(select) 옵션으로 생성해주는 헬퍼 함수
function generateNumberOptions(min, max, selectedVal, step = 1) {
    let options = '';
    for (let i = min; i <= max; i += step) {
        const selected = (i === selectedVal) ? 'selected' : '';
        options += `<option value="${i}" ${selected}>${i}</option>`;
    }
    return options;
}

// [DEFAULT 버튼 동작] 모든 입력 필드를 DEFAULT_AUTO_CONFIG 값으로 즉시 복원
function resetAutoConfigDefault() {
    if (!confirm('모든 설정값을 초기 기본값(DEFAULT)으로 되돌리시겠습니까?')) return;

    const cfg = DEFAULT_AUTO_CONFIG;

    // 1. 우천관리 복원
    document.getElementById('auto-rain-enable').checked = cfg.rainEnable;
    document.getElementById('rain-vent-1').checked = cfg.rainVent1;
    document.getElementById('rain-vent-2').checked = cfg.rainVent2;

    // 2. 고온관리 복원
    document.getElementById('auto-high-temp-enable').checked = cfg.highTempEnable;
    document.getElementById('ht-ext-temp').value = cfg.htExtTemp;
    document.getElementById('ht-int-temp').value = cfg.htIntTemp;
    document.getElementById('ht-temp-range').value = cfg.htTempRange;

    // 3. 팬 제어 및 연동 기기 복원
    document.getElementById('fan-target-temp').value = cfg.fanTargetTemp;
    document.getElementById('fan-run-time').value = cfg.fanRunTime;
    document.getElementById('fan-rest-time').value = cfg.fanRestTime;
    document.getElementById('device-vent-1').checked = cfg.deviceVent1;
    document.getElementById('device-vent-2').checked = cfg.deviceVent2;
    document.getElementById('device-exhaust').checked = cfg.deviceExhaust;
    document.getElementById('device-circulation').checked = cfg.deviceCirculation;

    // 4. 삽목장관리 복원
    document.getElementById('auto-cutting-enable').checked = cfg.cuttingEnable;
    document.getElementById('cut-open-time').value = cfg.cutOpenTime;
    document.getElementById('cut-interval').value = cfg.cutInterval;
    document.getElementById('cut-light-on').value = cfg.cutLightOn;
    document.getElementById('cut-light-duration').value = cfg.cutLightDuration;
    document.getElementById('cut-op-check').checked = cfg.cutOpCheck;
    document.getElementById('cut-light-check').checked = cfg.cutLightCheck;
}

// [UPLOAD 버튼 동작] 현재 화면의 설정값을 수집하여 컨트롤러로 전송
function uploadAutoConfig() {
    const currentConfig = {
        rainEnable: document.getElementById('auto-rain-enable').checked,
        rainVent1: document.getElementById('rain-vent-1').checked,
        rainVent2: document.getElementById('rain-vent-2').checked,
        highTempEnable: document.getElementById('auto-high-temp-enable').checked,
        htExtTemp: Number(document.getElementById('ht-ext-temp').value),
        htIntTemp: Number(document.getElementById('ht-int-temp').value),
        htTempRange: Number(document.getElementById('ht-temp-range').value),
        fanTargetTemp: Number(document.getElementById('fan-target-temp').value),
        fanRunTime: Number(document.getElementById('fan-run-time').value),
        fanRestTime: Number(document.getElementById('fan-rest-time').value),
        deviceVent1: document.getElementById('device-vent-1').checked,
        deviceVent2: document.getElementById('device-vent-2').checked,
        deviceExhaust: document.getElementById('device-exhaust').checked,
        deviceCirculation: document.getElementById('device-circulation').checked,
        cuttingEnable: document.getElementById('auto-cutting-enable').checked,
        cutOpenTime: Number(document.getElementById('cut-open-time').value),
        cutInterval: Number(document.getElementById('cut-interval').value),
        cutLightOn: Number(document.getElementById('cut-light-on').value),
        cutLightDuration: Number(document.getElementById('cut-light-duration').value),
        cutOpCheck: document.getElementById('cut-op-check').checked,
        cutLightCheck: document.getElementById('cut-light-check').checked
    };

    console.log('전송할 자동설정 데이터:', currentConfig);
    alert('현재 설정값이 컨트롤러(ESP32)로 업로드되었습니다.');
}
