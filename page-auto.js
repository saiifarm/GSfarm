// [괴산농장 Main Controller V2.0 - 자동설정 항목별 기본값 및 선택 옵션 정의]
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
                                    ${generateCustomOptions([10, 15, 20, 25, 30], cfg.htExtTemp)}
                                </select>
                                <span style="font-size: 13px; font-weight: bold; color: #000;">'C</span>
                            </div>

                            <span style="font-size: 13px; color: #000;">기준온도(내부)</span>
                            <div style="display: flex; align-items: center; gap: 5px;">
                                <select id="ht-int-temp" style="width: 70px; text-align: center; padding: 4px; background: #dcdcdc; border: 1px solid #bbb; border-radius: 4px; font-weight: bold; color: #000;">
                                    ${generateCustomOptions([15, 20, 25, 27, 30, 35], cfg.htIntTemp)}
                                </select>
                                <span style="font-size: 13px; font-weight: bold; color: #000;">'C</span>
                            </div>

                            <span style="font-size: 13px; color: #000;">온도폭</span>
                            <div style="display: flex; align-items: center; gap: 5px;">
                                <select id="ht-temp-range" style="width: 70px; text-align: center; padding: 4px; background: #dcdcdc; border: 1px solid #bbb; border-radius: 4px; font-weight: bold; color: #000;">
                                    ${generateCustomOptions([3, 5], cfg.htTempRange)}
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
                                    ${generateCustomOptions([20, 25, 30, 35], cfg.fanTargetTemp)}
                                </select>
                                <span style="font-size: 13px; font-weight: bold; color: #000;">'C</span>
                            </div>

                            <span style="font-size: 13px; color: #000; font-weight: bold;">팬 가동시간</span>
                            <div style="display: flex; align-items: center; gap: 5px;">
                                <select id="fan-run-time" style="width: 70px; text-align: center; padding: 4px; background: #dcdcdc; border: 1px solid #bbb; border-radius: 4px; font-weight: bold; color: #000;">
                                    ${generateCustomOptions([1, 2, 3], cfg.fanRunTime)}
                                </select>
                                <span style="font-size: 13px; font-weight: bold; color: #000;">시간</span>
                            </div>

                            <span style="font-size: 13px; color: #000; font-weight: bold;">팬 휴식시간</span>
                            <div style="display: flex; align-items: center; gap: 5px;">
                                <select id="fan-rest-time" style="width: 70px; text-align: center; padding: 4px; background: #dcdcdc; border: 1px solid #bbb; border-radius: 4px; font-weight: bold; color: #000;">
                                    ${generateCustomOptions([5, 10, 15, 20, 30], cfg.fanRestTime)}
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
                                    ${generateRangeOptions(0, 23, cfg.cutOpenTime)}
                                </select>
                                <span style="font-size: 13px; font-weight: bold; color: #000;">시</span>
                            </div>

                            <span style="font-size: 13px; color: #000;">개폐간격</span>
                            <div style="display: flex; align-items: center; gap: 5px;">
                                <select id="cut-interval" style="width: 70px; text-align: center; padding: 4px; background: #dcdcdc; border: 1px solid #bbb; border-radius: 4px; font-weight: bold; color: #000;">
                                    ${generateRangeOptions(1, 10, cfg.cutInterval)}
                                </select>
                                <span style="font-size: 13px; font-weight: bold; color: #000;">시간</span>
                            </div>

                            <span style="font-size: 13px; color: #000;">생육등 점등</span>
                            <div style="display: flex; align-items: center; gap: 5px;">
                                <select id="cut-light-on" style="width: 70px; text-align: center; padding: 4px; background: #dcdcdc; border: 1px solid #bbb; border-radius: 4px; font-weight: bold; color: #000;">
                                    ${generateRangeOptions(0, 23, cfg.cutLightOn)}
                                </select>
                                <span style="font-size: 13px; font-weight: bold; color: #000;">시</span>
                            </div>

                            <span style="font-size: 13px; color: #000;">점등시간</span>
                            <div style="display: flex; align-items: center; gap: 5px;">
                                <select id="cut-light-duration" style="width: 70px; text-align: center; padding: 4px; background: #dcdcdc; border: 1px solid #bbb; border-radius: 4px; font-weight: bold; color: #000;">
                                    ${generateRangeOptions(1, 10, cfg.cutLightDuration)}
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

// 헬퍼 함수: 커스텀 옵션 생성
function generateCustomOptions(values, selectedVal) {
    let options = '';
    values.forEach(val => {
        const selected = (val === selectedVal) ? 'selected' : '';
        options += `<option value="${val}" ${selected}>${val}</option>`;
    });
    return options;
}

// 헬퍼 함수: 범위 옵션 생성
function generateRangeOptions(min, max, selectedVal) {
    let options = '';
    for (let i = min; i <= max; i++) {
        const selected = (i === selectedVal) ? 'selected' : '';
        options += `<option value="${i}" ${selected}>${i}</option>`;
    }
    return options;
}

// [DEFAULT 버튼 동작] 모든 입력 필드를 DEFAULT_AUTO_CONFIG 값으로 즉시 복원
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

// [UPLOAD 버튼 동작] 지정된 조건(토픽, 21개 콤마 연결 페이로드, QoS 2, retain: false)으로 MQTT 퍼블리쉬 수행
function uploadAutoConfig() {
    // 체크박스는 참/거짓을 각각 1과 0으로 변환, 선택값은 정수형으로 수집
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

    // 21개 항목을 콤마로 연결한 페이로드 문자열 생성
    const payloadString = [
        p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, 
        p11, p12, p13, p14, p15, p16, p17, p18, p19, p20, p21
    ].join(',');

    const topic = "saiifarm24/autoset00";

    // 프로젝트에서 사용 중인 전역 MQTT 클라이언트 객체(예: client)를 통해 퍼블리쉬 수행
    if (typeof client !== 'undefined' && client && client.connected) {
        client.publish(topic, payloadString, { qos: 2, retain: false }, function (err) {
            if (!err) {
                console.log(`MQTT Publish Success -> Topic: ${topic}, Payload: ${payloadString}`);
                alert('자동설정값이 MQTT로 성공적으로 업로드(퍼블리쉬)되었습니다.');
            } else {
                console.error('MQTT Publish Error:', err);
                alert('MQTT 업로드 중 오류가 발생했습니다.');
            }
        });
    } else {
        // MQTT 클라이언트가 정의되지 않았거나 연결되지 않은 경우 콘솔 시뮬레이션 및 안내
        console.warn('MQTT client가 연결되어 있지 않습니다. 시뮬레이션 페이로드:', payloadString);
        alert(`[MQTT 시뮬레이션]\n토픽: ${topic}\n페이로드: ${payloadString}\n(QoS: 2, Retain: false)`);
    }
}
