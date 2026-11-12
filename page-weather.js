// [기상예보 페이지 렌더링 및 기상청 단기예보 API 연동]
function renderWeatherPageHTML() {
    var container = document.getElementById('content-area');
    container.innerHTML = '\
        <div class="weather-wrapper">\
            <div class="weather-sticky-title">SAIIFARM 괴산농장 기상예보</div>\
            <div id="weather-data-container" class="weather-container">\
                <p style="color: #fff; padding: 20px; text-align: center;">기상청 단기예보 데이터를 불러오는 중입니다...</p>\
            </div>\
        </div>\
    ';
    fetchKMAWeather();
}

function fetchKMAWeather() {
    var weatherContainer = document.getElementById('weather-data-container');

    fetch(WORKER_URL + '/api/weather')
        .then(res => res.ok ? res.json() : Promise.reject('네트워크 응답 오류'))
        .then(jsonData => {
            if (!jsonData.success || !Array.isArray(jsonData.items) || jsonData.items.length === 0) return;

            var groupedData = {};
            jsonData.items.forEach(item => {
                var key = item.fcstDate + '_' + item.fcstTime;
                if (!groupedData[key]) groupedData[key] = { fcstDate: item.fcstDate, fcstTime: item.fcstTime };
                groupedData[key][item.category] = item.fcstValue;
            });

            var tableRows = '';
            var now = new Date();
            var todayStr = String(now.getFullYear()) + String(now.getMonth() + 1).padStart(2, '0') + String(now.getDate()).padStart(2, '0');
            var tomorrowStr = String(new Date(now.getTime() + 86400000).getFullYear()) + String(new Date(now.getTime() + 86400000).getMonth() + 1).padStart(2, '0') + String(new Date(now.getTime() + 86400000).getDate()).padStart(2, '0');
            var afterTomorrowStr = String(new Date(now.getTime() + 172800000).getFullYear()) + String(new Date(now.getTime() + 172800000).getMonth() + 1).padStart(2, '0') + String(new Date(now.getTime() + 172800000).getDate()).padStart(2, '0');

            var sortedKeys = Object.keys(groupedData).sort();
            var count = 0;

            sortedKeys.forEach(key => {
                if (count >= 36) return;
                var d = groupedData[key];
                var hourNum = parseInt(d.fcstTime.substring(0, 2), 10);
                var isNight = (hourNum >= 18 || hourNum < 6);
                
                var dayLabel = (d.fcstDate === todayStr) ? '오늘' : (d.fcstDate === tomorrowStr) ? '내일' : (d.fcstDate === afterTomorrowStr) ? '모레' : '';
                if (!dayLabel) return;

                var pty = d.PTY || '0';
                var sky = d.SKY || '1';
                var weatherIcon = isNight ? '🌙' : '☀️';
                var weatherText = '맑음';

                if (pty !== '0') {
                    if (pty === '1') { weatherText = '비'; weatherIcon = '🌧️'; }
                    else if (pty === '2') { weatherText = '비/눈'; weatherIcon = '🌨️'; }
                    else if (pty === '3') { weatherText = '눈'; weatherIcon = '❄️'; }
                    else if (pty === '4') { weatherText = '소나기'; weatherIcon = '🌦️'; }
                } else {
                    if (sky === '3') { weatherText = '구름많음'; weatherIcon = isNight ? '☁️' : '⛅'; }
                    else if (sky === '4') { weatherText = '흐림'; weatherIcon = '☁️'; }
                }

                if (count === 0) {
                    sensorData.firstWeatherIcon = weatherIcon;
                    const stIconEl = document.getElementById('st-weather-icon');
                    if (stIconEl) stIconEl.innerText = weatherIcon;
                }

                tableRows += '\
                    <tr ' + (isNight ? 'class="night-row"' : '') + '>\
                        <td><span class="weather-badge">' + dayLabel + ' ' + d.fcstTime.substring(0, 2) + '시</span></td>\
                        <td><b>' + weatherIcon + ' ' + weatherText + '</b></td>\
                        <td>' + (d.TMP || '-') + ' ℃</td>\
                        <td>🌧️ ' + (d.POP || '0') + '%</td>\
                        <td>💧 ' + (d.REH || '0') + '%</td>\
                        <td>💨 ' + parseFloat(d.WSD || '0').toFixed(1) + ' m/s</td>\
                    </tr>\
                ';
                count++;
            });

            if (weatherContainer) {
                weatherContainer.innerHTML = '\
                    <div class="weather-table-scroll">\
                        <table class="weather-table">\
                            <thead>\
                                <tr><th>시간</th><th>날씨</th><th>기온</th><th>강수확률</th><th>습도</th><th>풍속</th></tr>\
                            </thead>\
                            <tbody>' + tableRows + '</tbody>\
                        </table>\
                    </div>\
                ';
            }
        })
        .catch(err => console.error('기상 데이터 오류:', err));
}
