// [농장현황 페이지 렌더링 및 MQTT 센서 데이터 DOM 갱신]
function updateTopHeaderTemp() {
    const tempFarmA = document.getElementById('header-farm-temp');
    const tempHouse1 = document.getElementById('header-house1-temp');
    if (tempFarmA && sensorData.farm_a.temp !== '-') tempFarmA.innerText = sensorData.farm_a.temp + " °C";
    if (tempHouse1 && sensorData.house1.temp !== '-') tempHouse1.innerText = sensorData.house1.temp + " °C";
}

function renderStatusPageHTML() {
    const container = document.getElementById('content-area');
    container.innerHTML = `
        <div class="status-wrapper">
            <div class="status-top-bar">
                <div class="status-weather-box">
                    <div class="status-weather-icon" id="st-weather-icon">${sensorData.firstWeatherIcon}</div>
                    <div class="status-weather-text">
                        <div id="status-rain-text" class="status-rain-status" style="color: #444;">비 안옴</div>
                        <div class="status-rain-amount">강수 <span id="status-rain-val">0.00</span>mm</div>
                    </div>
                </div>
                <div class="status-summary-temps">
                    <div class="summary-temp-item">🌡️ <span id="header-farm-temp" style="color:#d9534f;">--.- °C</span></div>
                    <div class="summary-temp-item" style="margin-left: 20px;"><span style="color:#46b8da; font-weight:800;">H</span> <span id="header-house1-temp" style="color:#d9534f;">--.- °C</span></div>
                </div>
            </div>
            <div class="status-body-grid">
                <div class="status-column">
                    <div class="zone-card">
                        <div class="zone-header">OUTDOOR FARM</div>
                        <table class="sensor-table">
                            <tr>
                                <td rowspan="4" class="lbl-farma">A</td>
                                <td class="lbl-sun">태양광</td>
                                <td class="val-farma"><span id="st-fa-sun">-</span> lx</td>
                            </tr>
                            <tr>
                                <td class="lbl-temp">기온</td>
                                <td class="val-farma"><span id="st-fa-temp">-</span> °C <span style="font-size:0.75em;">(상<span id="st-fa-tmax">-</span>/하<span id="st-fa-tmin">-</span>)</span></td>
                            </tr>
                            <tr>
                                <td class="lbl-hum">습도</td>
                                <td class="val-farma"><span id="st-fa-hum">-</span> % <span style="font-size:0.75em;">(상<span id="st-fa-hmax">-</span>/하<span id="st-fa-hmin">-</span>)</span></td>
                            </tr>
                            <tr>
                                <td class="lbl-soil">토양습도</td>
                                <td class="val-farma"><span id="st-fa-soil">-</span> %</td>
                            </tr>
                            <tr>
                                <td rowspan="2" class="lbl-farmb">B</td>
                                <td class="lbl-temp">기온</td>
                                <td class="val-farmb"><span id="st-fb-temp">-</span> °C <span style="font-size:0.75em;">(상<span id="st-fb-tmax">-</span>/하<span id="st-fb-tmin">-</span>)</span></td>
                            </tr>
                            <tr>
                                <td class="lbl-hum">습도</td>
                                <td class="val-farmb"><span id="st-fb-hum">-</span> % <span style="font-size:0.75em;">(상<span id="st-fb-hmax">-</span>/하<span id="st-fb-hmin">-</span>)</span></td>
                            </tr>
                        </table>
                    </div>
                </div>
                <div class="status-column">
                    <div class="zone-card">
                        <div class="zone-header house-title">HOUSE</div>
                        <table class="sensor-table">
                            <tr>
                                <td rowspan="2" class="lbl-h1">H1</td>
                                <td class="lbl-temp">기온</td>
                                <td class="val-h1"><span id="st-h1-temp">-</span> °C <span style="font-size:0.75em;">(상<span id="st-h1-tmax">-</span>/하<span id="st-h1-tmin">-</span>)</span></td>
                            </tr>
                            <tr>
                                <td class="lbl-hum">습도</td>
                                <td class="val-h1"><span id="st-h1-hum">-</span> % <span style="font-size:0.75em;">(상<span id="st-h1-hmax">-</span>/하<span id="st-h1-hmin">-</span>)</span></td>
                            </tr>
                            <tr>
                                <td rowspan="2" class="lbl-h2">H2</td>
                                <td class="lbl-temp">기온</td>
                                <td class="val-h2"><span id="st-h2-temp">-</span> °C <span style="font-size:0.75em;">(상<span id="st-h2-tmax">-</span>/하<span id="st-h2-tmin">-</span>)</span></td>
                            </tr>
                            <tr>
                                <td class="lbl-hum">습도</td>
                                <td class="val-h2"><span id="st-h2-hum">-</span> % <span style="font-size:0.75em;">(상<span id="st-h2-hmax">-</span>/하<span id="st-h2-hmin">-</span>)</span></td>
                            </tr>
                            <tr>
                                <td rowspan="3" class="lbl-h3">H3</td>
                                <td class="lbl-temp">기온</td>
                                <td class="val-h3"><span id="st-h3-temp">-</span> °C <span style="font-size:0.75em;">(상<span id="st-h3-tmax">-</span>/하<span id="st-h3-tmin">-</span>)</span></td>
                            </tr>
                            <tr>
                                <td class="lbl-hum">습도</td>
                                <td class="val-h3"><span id="st-h3-hum">-</span> % <span style="font-size:0.75em;">(상<span id="st-h3-hmax">-</span>/하<span id="st-h3-hmin">-</span>)</span></td>
                            </tr>
                            <tr>
                                <td class="lbl-soil">토양습도</td>
                                <td class="val-h3"><span id="st-h3-soil">-</span> %</td>
                            </tr>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    `;
    updateStatusDOM();
    updateTopHeaderTemp();
}

function updateStatusDOM() {
    const weatherIconEl = document.getElementById('st-weather-icon');
    if (weatherIconEl) weatherIconEl.innerText = sensorData.firstWeatherIcon;

    // (1) FARM A
    setVal('st-fa-sun', sensorData.farm_a.sun);
    setVal('st-fa-temp', sensorData.farm_a.temp);
    setVal('st-fa-tmax', sensorData.farm_a.tempMax);
    setVal('st-fa-tmin', sensorData.farm_a.tempMin);
    setVal('st-fa-hum', sensorData.farm_a.hum);
    setVal('st-fa-hmax', sensorData.farm_a.humMax);
    setVal('st-fa-hmin', sensorData.farm_a.humMin);
    setVal('st-fa-soil', sensorData.farm_a.soil);
    setVal('status-rain-val', sensorData.farm_a.rainAmount);

    const rainText = document.getElementById('status-rain-text');
    if (rainText) {
        if (sensorData.farm_a.rain === "1") {
            rainText.innerText = "비가 옵니다.";
            rainText.style.color = "#337ab7";
        } else {
            rainText.innerText = "비 안옴";
            rainText.style.color = "#444";
        }
    }

    // (2) FARM B
    setVal('st-fb-temp', sensorData.farm_b.temp);
    setVal('st-fb-tmax', sensorData.farm_b.tempMax);
    setVal('st-fb-tmin', sensorData.farm_b.tempMin);
    setVal('st-fb-hum', sensorData.farm_b.hum);
    setVal('st-fb-hmax', sensorData.farm_b.humMax);
    setVal('st-fb-hmin', sensorData.farm_b.humMin);

    // (3) HOUSE 1
    setVal('st-h1-temp', sensorData.house1.temp);
    setVal('st-h1-tmax', sensorData.house1.tempMax);
    setVal('st-h1-tmin', sensorData.house1.tempMin);
    setVal('st-h1-hum', sensorData.house1.hum);
    setVal('st-h1-hmax', sensorData.house1.humMax);
    setVal('st-h1-hmin', sensorData.house1.humMin);

    // (4) HOUSE 2
    setVal('st-h2-temp', sensorData.house2.temp);
    setVal('st-h2-tmax', sensorData.house2.tempMax);
    setVal('st-h2-tmin', sensorData.house2.tempMin);
    setVal('st-h2-hum', sensorData.house2.hum);
    setVal('st-h2-hmax', sensorData.house2.humMax);
    setVal('st-h2-hmin', sensorData.house2.humMin);

    // (5) 삽목장 (House 3)
    setVal('st-h3-temp', sensorData.house3.temp);
    setVal('st-h3-tmax', sensorData.house3.tempMax);
    setVal('st-h3-tmin', sensorData.house3.tempMin);
    setVal('st-h3-hum', sensorData.house3.hum);
    setVal('st-h3-hmax', sensorData.house3.humMax);
    setVal('st-h3-hmin', sensorData.house3.humMin);
    setVal('st-h3-soil', sensorData.house3.soil);
}
