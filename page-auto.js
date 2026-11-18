// [괴산농장 Main Controller V2.0 - 자동설정 항목별 기본값 및 선택 옵션 정의]
const DEFAULT_AUTO_CONFIG = {
    rainEnable: true,
    rainVent1: true,
    rainVent2: false,
    highTempEnable: true,
    htExtTemp: 15,
    htIntTemp: 25,
    htTempRange: 3,
    fanTargetTemp: 30,
    fanRunTime: 1,
    fanRestTime: 15,
    deviceVent1: true,
    deviceVent2: true,
    deviceExhaust: true,
    deviceCirculation: true,
    cuttingEnable: false,
    cutOpenTime: 22,
    cutInterval: 2,
    cutLightOn: 20,
    cutLightDuration: 2,
    cutOpCheck: true,
    cutLightCheck: false
};

function renderAutoPageHTML() {
    const container = document.getElementById('content-area');
    const cfg = DEFAULT_AUTO_CONFIG;

    container.innerHTML = `
        <div class="auto-config-wrapper">
            <div class="auto-vertical-stack">
                
                <!-- [카테고리 1] 우천관리 -->
                <div class="auto-category-card">
                    <label class="auto-cat-header">
                        <input type="checkbox" id="auto-rain-enable" style="width: 18px; height: 18px; margin-right: 8px; accent-color: #d9534f;" ${cfg.rainEnable ? 'checked' : ''}> 우천관리
                    </label>
                    <div style="display: flex; flex-direction: column; gap: 8px; padding-left: 5px;">
                        <label style="display: flex; align-items: center; font-size: 20px; color: #000; font-weight: bold; cursor: pointer;">
                            <input type="checkbox" id="rain-vent-1" style="width: 16px; height: 16px; margin-right: 8px; accent-color: #d9534f;" ${cfg.rainVent1 ? 'checked' : ''}> 1중창
                        </label>
                        <label style="display: flex; align-items: center; font-size: 20px; color: #000; font-weight: bold; cursor: pointer;">
                            <input type="checkbox" id="rain-vent-2" style="width: 16px; height: 16px; margin-right: 8px; accent-color: #d9534f;" ${cfg.rainVent2 ? 'checked' : ''}> 2중창
                        </label>
                    </div>
                </div>

                <!-- [카테고리 2] 고온관리 (기존 2단 영역의 팬온도~유동팬 체크까지 통합) -->
                <div class="auto-category-card">
                    <label class="auto-cat-header">
                        <input type="checkbox" id="auto-high-temp-enable" style="width: 18px; height: 18px; margin-right: 8px; accent-color: #d9534f;" ${cfg.highTempEnable ? 'checked' : ''}> 고온관리
                    </label>
                    <div style="display: grid; grid-template-columns: 1fr auto; row-gap: 10px; column-gap: 10px; align-items: center; margin-bottom: 14px;">
                        <span style="font-size: 20px; color: #000; font-weight: bold;">기준온도(외부)</span>
                        <div style="display: flex; align-items: center; gap: 5px;">
                            <select id="ht-ext-temp" class="auto-select">
                                ${generateCustomOptions([10, 15, 20, 25, 30], cfg.htExtTemp)}
                            </select>
                            <span style="font-size: 20px; font-weight: bold; color: #000;">°C</span>
                        </div>
                        <span style="font-size: 20px; color: #000; font-weight: bold;">기준온도(내부)</span>
                        <div style="display: flex; align-items: center; gap: 5px;">
                            <select id="ht-int-temp" class="auto-select">
                                ${generateCustomOptions([15, 20, 25, 27, 30, 35], cfg.htIntTemp)}
                            </select>
                            <span style="font-size: 20px; font-weight: bold; color: #000;">°C</span>
                        </div>
                        <span style="font-size: 20px; color: #000; font-weight: bold;">온도폭</span>
                        <div style="display: flex; align-items: center; gap: 5px;">
                            <select id="ht-temp-range" class="auto-select">
                                ${generateCustomOptions([3, 5], cfg.htTempRange)}
                            </select>
                            <span style="font-size: 20px; font-weight: bold; color: #000;">°C</span>
                        </div>
                        <span style="font-size: 20px; color: #000; font-weight: bold;">팬온도(내부)</span>
                        <div style="display: flex; align-items: center; gap: 5px;">
                            <select id="fan-target-temp" class="auto-select">
                                ${generateCustomOptions([20, 25, 30, 35], cfg.fanTargetTemp)}
                            </select>
                            <span style="font-size: 20px; font-weight: bold; color: #000;">°C</span>
                        </div>
                        <span style="font-size: 20px; color: #000; font-weight: bold;">팬 가동시간</span>
                        <div style="display: flex; align-items: center; gap: 5px;">
                            <select id="fan-run-time" class="auto-select">
                                ${generateCustomOptions([1, 2, 3], cfg.fanRunTime)}
                            </select>
                            <span style="font-size: 20px; font-weight: bold; color: #000;">시간</span>
                        </div>
                        <span style="font-size: 20px; color: #000; font-weight: bold;">팬 휴식시간</span>
                        <div style="display: flex; align-items: center; gap: 5px;">
                            <select id="fan-rest-time" class="auto-select">
                                ${generateCustomOptions([5, 10, 15, 20, 30], cfg.fanRestTime)}
                            </select>
                            <span style="font-size: 20px; font-weight: bold; color: #000;">분</span>
                        </div>
                    </div>

                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; border-top: 1px dashed #ccc; padding-top: 12px;">
                        <label style="display: flex; align-items: center; font-size: 20px; font-weight: bold; color: #000; cursor: pointer;">
                            <input type="checkbox" id="device-vent-1" style="width: 16px; height: 16px; margin-right: 8px; accent-color: #d9534f;" ${cfg.deviceVent1 ? 'checked' : ''}> 1중창
                        </label>
                        <label style="display: flex; align-items: center; font-size: 20px; font-weight: bold; color: #000; cursor: pointer;">
                            <input type="checkbox" id="device-vent-2" style="width: 16px; height: 16px; margin-right: 8px; accent-color: #d9534f;" ${cfg.deviceVent2 ? 'checked' : ''}> 2중창
                        </label>
                        <label style="display: flex; align-items: center; font-size: 20px; font-weight: bold; color: #000; cursor: pointer;">
                            <input type="checkbox" id="device-exhaust" style="width: 16px; height: 16px; margin-right: 8px; accent-color: #d9534f;" ${cfg.deviceExhaust ? 'checked' : ''}> 환풍기
                        </label>
                        <label style="display: flex; align-items: center; font-size: 20px; font-weight: bold; color: #000; cursor: pointer;">
                            <input type="checkbox" id="device-circulation" style="width: 16px; height: 16px; margin-right: 8px; accent-color: #d9534f;" ${cfg.deviceCirculation ? 'checked' : ''}> 유동팬
                        </label>
                    </div>
                </div>

                <!-- [카테고리 3] 삽목장관리 -->
                <div class="auto-category-card">
                    <label class="auto-cat-header">
                        <input type="checkbox" id="auto-cutting-enable" style="width: 18px; height: 18px; margin-right: 8px; accent-color: #5a8262;" ${cfg.cuttingEnable ? 'checked' : ''}> 삽목장관리
                    </label>
                    <div style="display: grid; grid-template-columns: 1fr auto; row-gap: 10px; column-gap: 10px; align-items: center; margin-bottom: 12px;">
                        <span style="font-size: 20px; color: #000; font-weight: bold;">개폐시간</span>
                        <div style="display: flex; align-items: center; gap: 5px;">
                            <select id="cut-open-time" class="auto-select">
                                ${generateRangeOptions(0, 23, cfg.cutOpenTime)}
                            </select>
                            <span style="font-size: 20px; font-weight: bold; color: #000;">시</span>
                        </div>
                        <span style="font-size: 20px; color: #000; font-weight: bold;">개폐간격</span>
                        <div style="display: flex; align-items: center; gap: 5px;">
                            <select id="cut-interval" class="auto-select">
                                ${generateRangeOptions(1, 10, cfg.cutInterval)}
                            </select>
                            <span style="font-size: 20px; font-weight: bold; color: #000;">시간</span>
                        </div>
                        <span style="font-size: 20px; color: #000; font-weight: bold;">생육등 점등</span>
                        <div style="display: flex; align-items: center; gap: 5px;">
                            <select id="cut-light-on" class="auto-select">
                                ${generateRangeOptions(0, 23, cfg.cutLightOn)}
                            </select>
                            <span style="font-size: 20px; font-weight: bold; color: #000;">시</span>
                        </div>
                        <span style="font-size: 20px; color: #000; font-weight: bold;">점등시간</span>
                        <div style="display: flex; align-items: center; gap: 5px;">
                            <select id="cut-light-duration" class="auto-select">
                                ${generateRangeOptions(1, 10, cfg.cutLightDuration)}
                            </select>
                            <span style="font-size: 20px; font-weight: bold; color: #000;">시간</span>
                        </div>
                    </div>

                    <div style="display: flex; gap: 15px; border-top: 1px dashed #ccc; padding-top: 12px;">
                        <label style="display: flex; align-items: center; font-size: 20px; color: #000; font-weight: bold; cursor: pointer;">
                            <input type="checkbox" id="cut-op-check" style="width: 16px; height: 16px; margin-right: 8px; accent-color: #d9534f;" ${cfg.cutOpCheck ? 'checked' : ''}> 삽목장 개폐
                        </label>
                        <label style="display: flex; align-items: center; font-size: 20px; color: #000; font-weight: bold; cursor: pointer;">
                            <input type="checkbox" id="cut-light-check" style="width: 16px; height: 16px; margin-right: 8px; accent-color: #d9534f;" ${cfg.cutLightCheck ? 'checked' : ''}> 생육등 점등
                        </label>
                    </div>
                </div>

                <!-- [카테고리 4] 설정 적용 및 초기화 버튼 별도 박스 -->
                <div class="auto-category-card">
                    <div style="font-size: 25px; font-weight: bold; color: #000; margin-bottom: 10px;">설정 전송 및 초기화</div>
                    <div style="display: flex; gap: 10px;">
                        <button onclick="uploadAutoConfig()" style="flex: 1; background: #2D6A3F; color: #fff; border: none; padding: 12px; border-radius: 6px; font-weight: bold; font-size: 20px; cursor: pointer; box-shadow: 0 2px 4px rgba(0,0,0,0.15);">UPLOAD</button>
                        <button onclick="resetAutoConfigDefault()" style="flex: 1; background: #6c757d; color: #fff; border: none; padding: 12px; border-radius: 6px; font-weight: bold; font-size: 20px; cursor: pointer; box-shadow: 0 2px 4px rgba(0,0,0,0.15);">DEFAULT</button>
                    </div>
                </div>

            </div>
        </div>
    `;
}

function generateCustomOptions(values, selectedVal) {
    let options = '';
    values.forEach(val => {
        const selected = (val === selectedVal) ? 'selected' : '';
        options += `<option value="${val}" ${selected}>${val}</option>`;
    });
    return options;
}

function generateRangeOptions(min, max, selectedVal) {
    let options = '';
    for (let i = min; i <= max; i++) {
        const selected = (i === selectedVal) ? 'selected' : '';
        options += `<option value="${i}" ${selected}>${i}</option>`;
    }
    return options;
}

function resetAutoConfigDefault() {
    if (!confirm('모든 설정값을 초기 기본값(DEFAULT)으로 되돌리시겠습니까?')) return;
    const cfg = DEFAULT_AUTO_CONFIG;

    document.getElementById('auto-rain-enable').checked = cfg.rainEnable;
    document.getElementById('rain-vent-1').checked = cfg.rainVent1;
    document.getElementById('rain-vent-2').checked = cfg.rainVent2;
    document.getElementById('auto-high-temp-enable').checked = cfg.highTempEnable;
    document.getElementById('ht-ext-temp').value = cfg.htExtTemp;
    document.getElementById('ht-int-temp').value = cfg.htIntTemp;
    document.getElementById('ht-temp-range').value = cfg.htTempRange;
    document.getElementById('fan-target-temp').value = cfg.fanTargetTemp;
    document.getElementById('fan-run-time').value = cfg.fanRunTime;
    document.getElementById('fan-rest-time').value = cfg.fanRestTime;
    document.getElementById('device-vent-1').checked = cfg.deviceVent1;
    document.getElementById('device-vent-2').checked = cfg.deviceVent2;
    document.getElementById('device-exhaust').checked = cfg.deviceExhaust;
    document.getElementById('device-circulation').checked = cfg.deviceCirculation;
    document.getElementById('auto-cutting-enable').checked = cfg.cuttingEnable;
    document.getElementById('cut-open-time').value = cfg.cutOpenTime;
    document.getElementById('cut-interval').value = cfg.cutInterval;
    document.getElementById('cut-light-on').value = cfg.cutLightOn;
    document.getElementById('cut-light-duration').value = cfg.cutLightDuration;
    document.getElementById('cut-op-check').checked = cfg.cutOpCheck;
    document.getElementById('cut-light-check').checked = cfg.cutLightCheck;
}

function uploadAutoConfig() {
    const p1 = document.getElementById('auto-rain-enable').checked ? 1 : 0;
    const p2 = document.getElementById('rain-vent-1').checked ? 1 : 0;
    const p3 = document.getElementById('rain-vent-2').checked ? 1 : 0;
    const p4 = document.getElementById('auto-high-temp-enable').checked ? 1 : 0;
    const p5 = Number(document.getElementById('ht-ext-temp').value);
    const p6 = Number(document.getElementById('ht-int-temp').value);
    const p7 = Number(document.getElementById('ht-temp-range').value);
    const p8 = Number(document.getElementById('fan-target-temp').value);
    const p9 = Number(document.getElementById('fan-run-time').value);
    const p10 = Number(document.getElementById('fan-rest-time').value);
    const p11 = document.getElementById('device-vent-1').checked ? 1 : 0;
    const p12 = document.getElementById('device-vent-2').checked ? 1 : 0;
    const p13 = document.getElementById('device-exhaust').checked ? 1 : 0;
    const p14 = document.getElementById('device-circulation').checked ? 1 : 0;
    const p15 = document.getElementById('auto-cutting-enable').checked ? 1 : 0;
    const p16 = Number(document.getElementById('cut-open-time').value);
    const p17 = Number(document.getElementById('cut-interval').value);
    const p18 = Number(document.getElementById('cut-light-on').value);
    const p19 = Number(document.getElementById('cut-light-duration').value);
    const p20 = document.getElementById('cut-op-check').checked ? 1 : 0;
    const p21 = document.getElementById('cut-light-check').checked ? 1 : 0;

    const payloadString = [
        p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, 
        p11, p12, p13, p14, p15, p16, p17, p18, p19, p20, p21
    ].join(',');

    const topic = "saiifarm24/autoset00";

    if (typeof mqttClient !== 'undefined' && mqttClient && mqttClient.connected) {
        try {
            mqttClient.publish(topic, payloadString, { qos: 2, retain: false });
            console.log(`📤 직접 MQTT 송신 성공 [${topic}]:`, payloadString);
            alert('자동설정값이 MQTT로 직접 안전하게 업로드되었습니다.');
        } catch (e) {
            console.error("MQTT 직접 송신 오류:", e);
            alert('MQTT 송신 중 예외가 발생했습니다.');
        }
    } else {
        console.warn("⚠️ MQTT가 연결되어 있지 않습니다.");
        alert('MQTT가 연결되어 있지 않습니다. 연결 상태를 확인해주세요.');
    }
}
