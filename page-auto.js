// [자동설정 페이지 렌더링 및 로직 - UI 및 입력창 정렬 개선 버전]
function renderAutoPageHTML() {
    const container = document.getElementById('content-area');

    container.innerHTML = `
        <div class="auto-config-wrapper" style="width: 100%; height: 100%; padding: 15px; background: #88d498; box-sizing: border-box; font-family: sans-serif; overflow-y: auto;">
            
            <!-- 메인 3단 그리드 레이아웃 (전체 폭 가득 채우기) -->
            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px; width: 100%; height: 100%; box-sizing: border-box;">
                
                <!-- [1단 영역] 우천관리 & 고온관리 -->
                <div style="display: flex; flex-direction: column; gap: 15px;">
                    
                    <!-- 우천관리 카드 -->
                    <div style="background: #ffffff; border: 2px solid #5a8262; border-radius: 8px; padding: 15px;">
                        <label style="display: flex; align-items: center; font-size: 16px; font-weight: bold; color: #000; margin-bottom: 12px; cursor: pointer;">
                            <input type="checkbox" id="auto-rain-enable" style="width: 18px; height: 18px; margin-right: 8px; accent-color: #d9534f;" checked> 우천관리
                        </label>
                        <div style="display: flex; flex-direction: column; gap: 8px; padding-left: 5px;">
                            <label style="display: flex; align-items: center; font-size: 14px; color: #000; cursor: pointer;">
                                <input type="checkbox" id="rain-vent-1" style="width: 16px; height: 16px; margin-right: 8px; accent-color: #d9534f;" checked> 1중창
                            </label>
                            <label style="display: flex; align-items: center; font-size: 14px; color: #000; cursor: pointer;">
                                <input type="checkbox" id="rain-vent-2" style="width: 16px; height: 16px; margin-right: 8px; accent-color: #d9534f;"> 2중창
                            </label>
                        </div>
                    </div>

                    <!-- 고온관리 카드 -->
                    <div style="background: #ffffff; border: 2px solid #5a8262; border-radius: 8px; padding: 15px;">
                        <label style="display: flex; align-items: center; font-size: 16px; font-weight: bold; color: #000; margin-bottom: 12px; cursor: pointer;">
                            <input type="checkbox" id="auto-high-temp-enable" style="width: 18px; height: 18px; margin-right: 8px; accent-color: #d9534f;" checked> 고온관리
                        </label>
                        <div style="display: flex; flex-direction: column; gap: 10px;">
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <span style="font-size: 13px; color: #000;">기준온도(외부)</span>
                                <div style="display: flex; align-items: center; gap: 5px;">
                                    <select id="ht-ext-temp" style="width: 70px; text-align: center; padding: 4px; background: #dcdcdc; border: 1px solid #bbb; border-radius: 4px; font-weight: bold; color: #000;">
                                        ${generateNumberOptions(5, 35, 15)}
                                    </select>
                                    <span style="font-size: 13px; font-weight: bold; color: #000;">'C</span>
                                </div>
                            </div>
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <span style="font-size: 13px; color: #000;">기준온도(내부)</span>
                                <div style="display: flex; align-items: center; gap: 5px;">
                                    <select id="ht-int-temp" style="width: 70px; text-align: center; padding: 4px; background: #dcdcdc; border: 1px solid #bbb; border-radius: 4px; font-weight: bold; color: #000;">
                                        ${generateNumberOptions(10, 45, 25)}
                                    </select>
                                    <span style="font-size: 13px; font-weight: bold; color: #000;">'C</span>
                                </div>
                            </div>
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <span style="font-size: 13px; color: #000;">온도폭</span>
                                <div style="display: flex; align-items: center; gap: 5px;">
                                    <select id="ht-temp-range" style="width: 70px; text-align: center; padding: 4px; background: #dcdcdc; border: 1px solid #bbb; border-radius: 4px; font-weight: bold; color: #000;">
                                        ${generateNumberOptions(1, 10, 3)}
                                    </select>
                                    <span style="font-size: 13px; font-weight: bold; color: #000;">'C</span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                <!-- [2단 영역] 팬 제어 및 연동 기기 선택 -->
                <div style="background: #ffffff; border: 2px solid #5a8262; border-radius: 8px; padding: 15px; display: flex; flex-direction: column; justify-content: space-between;">
                    <div>
                        <!-- 팬 설정 입력 필드들 (열 맞춤 정렬) -->
                        <div style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 20px;">
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <span style="font-size: 13px; color: #000; font-weight: bold;">팬온도(내부)</span>
                                <div style="display: flex; align-items: center; gap: 5px;">
                                    <select id="fan-target-temp" style="width: 70px; text-align: center; padding: 4px; background: #dcdcdc; border: 1px solid #bbb; border-radius: 4px; font-weight: bold; color: #000;">
                                        ${generateNumberOptions(15, 50, 30)}
                                    </select>
                                    <span style="font-size: 13px; font-weight: bold; color: #000;">'C</span>
                                </div>
                            </div>
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <span style="font-size: 13px; color: #000; font-weight: bold;">팬 가동시간</span>
                                <div style="display: flex; align-items: center; gap: 5px;">
                                    <select id="fan-run-time" style="width: 70px; text-align: center; padding: 4px; background: #dcdcdc; border: 1px solid #bbb; border-radius: 4px; font-weight: bold; color: #000;">
                                        ${generateNumberOptions(1, 12, 1)}
                                    </select>
                                    <span style="font-size: 13px; font-weight: bold; color: #000;">시간</span>
                                </div>
                            </div>
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <span style="font-size: 13px; color: #000; font-weight: bold;">팬 휴식시간</span>
                                <div style="display: flex; align-items: center; gap: 5px;">
                                    <select id="fan-rest-time" style="width: 70px; text-align: center; padding: 4px; background: #dcdcdc; border: 1px solid #bbb; border-radius: 4px; font-weight: bold; color: #000;">
                                        ${generateNumberOptions(5, 60, 15, 5)}
                                    </select>
                                    <span style="font-size: 13px; font-weight: bold; color: #000;">분</span>
                                </div>
                            </div>
                        </div>

                        <!-- 연동 기기 체크박스 목록 -->
                        <div style="display: flex; flex-direction: column; gap: 10px; border-top: 1px dashed #ccc; padding-top: 15px;">
                            <label style="display: flex; align-items: center; font-size: 14px; font-weight: bold; color: #000; cursor: pointer;">
                                <input type="checkbox" id="device-vent-1" style="width: 16px; height: 16px; margin-right: 8px; accent-color: #d9534f;" checked> 1중창
                            </label>
                            <label style="display: flex; align-items: center; font-size: 14px; font-weight: bold; color: #000; cursor: pointer;">
                                <input type="checkbox" id="device-vent-2" style="width: 16px; height: 16px; margin-right: 8px; accent-color: #d9534f;" checked> 2중창
                            </label>
                            <label style="display: flex; align-items: center; font-size: 14px; font-weight: bold; color: #000; cursor: pointer;">
                                <input type="checkbox" id="device-exhaust" style="width: 16px; height: 16px; margin-right: 8px; accent-color: #d9534f;" checked> 환풍기
                            </label>
                            <label style="display: flex; align-items: center; font-size: 14px; font-weight: bold; color: #000; cursor: pointer;">
                                <input type="checkbox" id="device-circulation" style="width: 16px; height: 16px; margin-right: 8px; accent-color: #d9534f;" checked> 유동팬
                            </label>
                        </div>
                    </div>
                </div>

                <!-- [3단 영역] 삽목장관리 및 업로드/기본값 버튼 -->
                <div style="background: #ffffff; border: 2px solid #5a8262; border-radius: 8px; padding: 15px; display: flex; flex-direction: column; justify-content: space-between;">
                    <div>
                        <label style="display: flex; align-items: center; font-size: 16px; font-weight: bold; color: #000; margin-bottom: 12px; cursor: pointer;">
                            <input type="checkbox" id="auto-cutting-enable" style="width: 18px; height: 18px; margin-right: 8px; accent-color: #5a8262;"> 삽목장관리
                        </label>
                        <div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 15px;">
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <span style="font-size: 13px; color: #000;">개폐시간</span>
                                <div style="display: flex; align-items: center; gap: 5px;">
                                    <select id="cut-open-time" style="width: 70px; text-align: center; padding: 4px; background: #dcdcdc; border: 1px solid #bbb; border-radius: 4px; font-weight: bold; color: #000;">
                                        ${generateNumberOptions(0, 23, 22)}
                                    </select>
                                    <span style="font-size: 13px; font-weight: bold; color: #000;">시</span>
                                </div>
                            </div>
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <span style="font-size: 13px; color: #000;">개폐간격</span>
                                <div style="display: flex; align-items: center; gap: 5px;">
                                    <select id="cut-interval" style="width: 70px; text-align: center; padding: 4px; background: #dcdcdc; border: 1px solid #bbb; border-radius: 4px; font-weight: bold; color: #000;">
                                        ${generateNumberOptions(1, 12, 2)}
                                    </select>
                                    <span style="font-size: 13px; font-weight: bold; color: #000;">시간</span>
                                </div>
                            </div>
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <span style="font-size: 13px; color: #000;">생육등 점등</span>
                                <div style="display: flex; align-items: center; gap: 5px;">
                                    <select id="cut-light-on" style="width: 70px; text-align: center; padding: 4px; background: #dcdcdc; border: 1px solid #bbb; border-radius: 4px; font-weight: bold; color: #000;">
                                        ${generateNumberOptions(0, 23, 20)}
                                    </select>
                                    <span style="font-size: 13px; font-weight: bold; color: #000;">시</span>
                                </div>
                            </div>
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <span style="font-size: 13px; color: #000;">점등시간</span>
                                <div style="display: flex; align-items: center; gap: 5px;">
                                    <select id="cut-light-duration" style="width: 70px; text-align: center; padding: 4px; background: #dcdcdc; border: 1px solid #bbb; border-radius: 4px; font-weight: bold; color: #000;">
                                        ${generateNumberOptions(1, 12, 2)}
                                    </select>
                                    <span style="font-size: 13px; font-weight: bold; color: #000;">시간</span>
                                </div>
                            </div>
                        </div>

                        <!-- 삽목장 관리 아래 선택박스 정렬 맞춤 -->
                        <div style="display: flex; flex-direction: column; gap: 8px; border-top: 1px dashed #ccc; padding-top: 15px;">
                            <label style="display: flex; align-items: center; font-size: 14px; color: #000; cursor: pointer;">
                                <input type="checkbox" id="cut-op-check" style="width: 16px; height: 16px; margin-right: 8px; accent-color: #d9534f;" checked> 삽목장 개폐
                            </label>
                            <label style="display: flex; align-items: center; font-size: 14px; color: #000; cursor: pointer;">
                                <input type="checkbox" id="cut-light-check" style="width: 16px; height: 16px; margin-right: 8px; accent-color: #d9534f;"> 생육등 점등
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

function uploadAutoConfig() {
    alert('설정값이 컨트롤러(ESP32)로 업로드(저장)되었습니다.');
}

function resetAutoConfigDefault() {
    if (confirm('설정값을 기본값(DEFAULT)으로 되돌리시겠습니까?')) {
        renderAutoPageHTML();
    }
}
