// [차트 페이지 렌더링 및 Chart.js 데이터 시각화]
let farmChartInstance = null;

function renderChartPageHTML() {
    const container = document.getElementById('content-area');

    const today = new Date();
    const weekAgo = new Date(today.getTime() - 6 * 24 * 60 * 60 * 1000);
    const formatDate = (d) => d.toISOString().split('T')[0];

    container.innerHTML = `
        <div class="chart-wrapper">
            <!-- 좌측 30% 설정 패널 -->
            <div class="chart-controls-area">
                <!-- (1) 데이터 선택 -->
                <div class="chart-control-group">
                    <div class="chart-group-title">1. 데이터 선택</div>
                    <div class="chart-radio-grid">
                        <label class="chart-radio-label">
                            <input type="radio" name="chart-zone" value="OUT1" checked onchange="onChartZoneChange()"> OUT1
                        </label>
                        <label class="chart-radio-label">
                            <input type="radio" name="chart-zone" value="OUT2" onchange="onChartZoneChange()"> OUT2
                        </label>
                        <label class="chart-radio-label">
                            <input type="radio" name="chart-zone" value="HOUSE1" onchange="onChartZoneChange()"> HOUSE1
                        </label>
                        <label class="chart-radio-label">
                            <input type="radio" name="chart-zone" value="HOUSE2" onchange="onChartZoneChange()"> HOUSE2
                        </label>
                        <label class="chart-radio-label">
                            <input type="radio" name="chart-zone" value="HOUSE3" onchange="onChartZoneChange()"> HOUSE3
                        </label>
                    </div>
                </div>

                <!-- (2) 항목 선택 -->
                <div class="chart-control-group">
                    <div class="chart-group-title">2. 항목 선택</div>
                    <div class="chart-radio-grid">
                        <label class="chart-radio-label" id="lbl-metric-temp">
                            <input type="radio" name="chart-metric" value="temp" checked> 온도
                        </label>
                        <label class="chart-radio-label" id="lbl-metric-hum">
                            <input type="radio" name="chart-metric" value="hum"> 습도
                        </label>
                        <label class="chart-radio-label" id="lbl-metric-sun">
                            <input type="radio" name="chart-metric" value="sun"> 태양광
                        </label>
                        <label class="chart-radio-label" id="lbl-metric-rain">
                            <input type="radio" name="chart-metric" value="rain"> 강수량
                        </label>
                        <label class="chart-radio-label" id="lbl-metric-soil">
                            <input type="radio" name="chart-metric" value="soil"> 토양습도
                        </label>
                    </div>
                </div>

                <!-- (3) 기간 설정 -->
                <div class="chart-control-group">
                    <div class="chart-group-title">3. 기간 설정</div>
                    <div class="chart-date-row">
                        <div class="chart-date-item">
                            <span>언제부터</span>
                            <input type="date" id="chart-start-date" class="chart-date-input" value="${formatDate(weekAgo)}">
                        </div>
                        <div class="chart-date-item">
                            <span>언제까지</span>
                            <input type="date" id="chart-end-date" class="chart-date-input" value="${formatDate(today)}">
                        </div>
                    </div>
                </div>

                <!-- (4) 차트 그리기 버튼 -->
                <button class="btn-draw-chart" onclick="fetchAndDrawChart()">📊 차트 그리기</button>
            </div>

            <!-- 우측 70% 차트 출력 영역 -->
            <div class="chart-display-area">
                <div class="chart-display-header">
                    <div>
                        <div class="chart-display-title" id="chart-header-title">OUT1 - 온도 추이</div>
                        <div class="chart-display-subtitle" id="chart-header-period">${formatDate(weekAgo)} ~ ${formatDate(today)}</div>
                    </div>
                    <!-- 최고/최저값 표기 영역 -->
                    <div id="chart-stats-box" style="font-size: 12px; font-weight: bold; color: #333; background: #f0f4f1; padding: 4px 10px; border-radius: 4px; border: 1px solid #d2e2d5;">
                        최저: - | 최고: -
                    </div>
                </div>
                <div class="chart-canvas-container">
                    <canvas id="farmChartCanvas"></canvas>
                </div>
            </div>
        </div>
    `;

    onChartZoneChange();
    fetchAndDrawChart();
}

function onChartZoneChange() {
    const selectedZone = document.querySelector('input[name="chart-zone"]:checked').value;

    const sunInput = document.querySelector('input[name="chart-metric"][value="sun"]');
    const rainInput = document.querySelector('input[name="chart-metric"][value="rain"]');
    const soilInput = document.querySelector('input[name="chart-metric"][value="soil"]');
    const tempInput = document.querySelector('input[name="chart-metric"][value="temp"]');

    const sunLabel = document.getElementById('lbl-metric-sun');
    const rainLabel = document.getElementById('lbl-metric-rain');
    const soilLabel = document.getElementById('lbl-metric-soil');

    const allowSunRain = (selectedZone === 'OUT1');
    sunInput.disabled = !allowSunRain;
    rainInput.disabled = !allowSunRain;
    sunLabel.classList.toggle('disabled', !allowSunRain);
    rainLabel.classList.toggle('disabled', !allowSunRain);

    const allowSoil = (selectedZone === 'OUT1' || selectedZone === 'HOUSE3');
    soilInput.disabled = !allowSoil;
    soilLabel.classList.toggle('disabled', !allowSoil);

    const currentCheckedMetric = document.querySelector('input[name="chart-metric"]:checked');
    if (currentCheckedMetric && currentCheckedMetric.disabled) {
        tempInput.checked = true;
    }
}

async function fetchAndDrawChart() {
    const zone = document.querySelector('input[name="chart-zone"]:checked').value;
    const metric = document.querySelector('input[name="chart-metric"]:checked').value;
    const startDate = document.getElementById('chart-start-date').value;
    const endDate = document.getElementById('chart-end-date').value;

    if (!startDate || !endDate) {
        alert('조회할 시작일과 종료일을 모두 선택해주세요.');
        return;
    }
    if (startDate > endDate) {
        alert('시작일이 종료일보다 늦을 수 없습니다.');
        return;
    }

    const metricMeta = {
        temp: { label: '온도', unit: '°C', color: '#d9534f', bg: 'rgba(217, 83, 79, 0.2)' },
        hum:  { label: '습도', unit: '%',  color: '#337ab7', bg: 'rgba(51, 122, 183, 0.2)' },
        sun:  { label: '태양광', unit: 'lx', color: '#f0ad4e', bg: 'rgba(240, 173, 78, 0.25)' },
        rain: { label: '강수량', unit: 'mm', color: '#5bc0de', bg: 'rgba(91, 192, 222, 0.4)' },
        soil: { label: '토양습도', unit: '%', color: '#8d5524', bg: 'rgba(141, 85, 36, 0.2)' }
    };
    const meta = metricMeta[metric];

    document.getElementById('chart-header-title').innerText = `${zone} - ${meta.label} (${meta.unit})`;
    document.getElementById('chart-header-period').innerText = `${startDate} ~ ${endDate}`;

    let labels = [];
    let values = [];

    try {
        const queryUrl = `${WORKER_URL}/api/chart?zone=${zone}&metric=${metric}&start=${startDate}&end=${endDate}`;
        const response = await fetch(queryUrl);

        if (!response.ok) throw new Error('DB API 응답 오류');
        const result = await response.json();

        if (result.success && Array.isArray(result.data)) {
            labels = result.data.map(row => row.timestamp);
            values = result.data.map(row => row.value);
        } else {
            throw new Error('데이터 포맷 오류');
        }
    } catch (err) {
        console.warn('DB 연동 전이거나 응답이 없어 샘플 데이터를 표시합니다:', err);
        const sample = generateSampleChartData(startDate, endDate, metric);
        labels = sample.labels;
        values = sample.values;
    }

    // 요구사항 (1), (2) 반영: 최고/최저 데이터에 날짜 및 시간 표기, 강수량은 최저 삭제 후 최고만 날짜 표기
    if (values.length > 0) {
        const minVal = Math.min(...values);
        const maxVal = Math.max(...values);
        const minIdx = values.indexOf(minVal);
        const maxIdx = values.indexOf(maxVal);
        const minTime = labels[minIdx];
        const maxTime = labels[maxIdx];

        if (metric === 'rain') {
            document.getElementById('chart-stats-box').innerText = `최고강수량 : ${maxVal} ${meta.unit} (${maxTime})`;
        } else {
            document.getElementById('chart-stats-box').innerText = `최저 : ${minVal} ${meta.unit} (${minTime})  |  최고 : ${maxVal} ${meta.unit} (${maxTime})`;
        }
    } else {
        document.getElementById('chart-stats-box').innerText = `최저: - | 최고: -`;
    }

    renderChartCanvas(labels, values, zone, meta, metric);
}

function renderChartCanvas(labels, values, zone, meta, metric) {
    const ctx = document.getElementById('farmChartCanvas').getContext('2d');

    if (farmChartInstance) {
        farmChartInstance.destroy();
    }

    const chartType = (metric === 'rain') ? 'bar' : 'line';

    farmChartInstance = new Chart(ctx, {
        type: chartType,
        data: {
            labels: labels,
            datasets: [{
                label: `${zone} ${meta.label} (${meta.unit})`,
                data: values,
                borderColor: meta.color,
                backgroundColor: meta.bg,
                borderWidth: (chartType === 'bar' ? 1 : 2),
                pointRadius: 2,
                pointHoverRadius: 4.5,
                fill: true,
                tension: 0.25
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: { mode: 'index', intersect: false },
            plugins: {
                legend: { display: true, position: 'top', labels: { font: { size: 13, weight: 'bold' } } },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: ${context.parsed.y} ${meta.unit}`;
                        }
                    }
                }
            },
            scales: {
                x: { 
                    grid: { display: false }, 
                    ticks: { 
                        font: { size: 11 }, 
                        maxRotation: 0,
                        // 🌟 0시(00:00)에만 '26.11.14' 형식으로 표기하고 나머지는 생략
                        callback: function(val, index) {
                            const labelStr = this.getLabelForValue(index);
                            if (metric === 'rain') {
                                // 강수량은 일 단위이므로 모든 날짜 표기 (원하시면 조정 가능)
                                return labelStr;
                            }
                            // '00:00'인 데이터만 날짜로 변환 (예: 2026-11-15 00:00 -> 26.11.15)
                            if (labelStr && labelStr.includes('00:00')) {
                                const datePart = labelStr.split(' ')[0]; // 2026-11-15
                                const parts = datePart.split('-');
                                if (parts.length === 3) {
                                    const yy = parts[0].slice(2); // 26
                                    return `${yy}.${parts[1]}.${parts[2]}`; // 26.11.15
                                }
                            }
                            return ''; // 0시가 아닌 시간대는 라벨 비우기
                        }
                    } 
                },
                y: {
                    beginAtZero: true,
                    ticks: {
                        font: { size: 12 },
                        callback: function(value) { return value + ' ' + meta.unit; }
                    }
                }
            }
        },
        // 요구사항 (3) 반영: 강수량 막대그래프 각 막대에 수치 데이터를 표시하는 커스텀 플러그인
        plugins: [{
            id: 'barDataLabels',
            afterDatasetsDraw(chart) {
                if (chart.config.type !== 'bar') return;
                const ctx = chart.ctx;
                chart.data.datasets.forEach((dataset, i) => {
                    const metaData = chart.getDatasetMeta(i);
                    metaData.data.forEach((bar, index) => {
                        const value = dataset.data[index];
                        if (value !== undefined && value !== null && value > 0) {
                            ctx.save();
                            ctx.fillStyle = '#222';
                            ctx.font = 'bold 11px sans-serif';
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'bottom';
                            ctx.fillText(value + ' mm', bar.x, bar.y - 4);
                            ctx.restore();
                        }
                    });
                });
            }
        }]
    });
}

function generateSampleChartData(startStr, endStr, metric) {
    const labels = [];
    const values = [];
    let curr = new Date(startStr);
    const end = new Date(endStr);

    while (curr <= end) {
        // 하루에 30분 간격으로 샘플 데이터 생성 (테스트용)
        for (let h = 0; h < 24; h++) {
            for (let m = 0; m < 60; m += 30) {
                const year = curr.getFullYear();
                const month = String(curr.getMonth() + 1).padStart(2, '0');
                const day = String(curr.getDate()).padStart(2, '0');
                const hours = String(h).padStart(2, '0');
                const mins = String(m).padStart(2, '0');

                const timeStr = `${year}-${month}-${day} ${hours}:${mins}`;
                labels.push(timeStr);

                let val = 0;
                if (metric === 'temp') val = +(15 + Math.random() * 12).toFixed(1);
                else if (metric === 'hum') val = +(45 + Math.random() * 35).toFixed(1);
                else if (metric === 'sun') val = Math.floor(15000 + Math.random() * 45000);
                else if (metric === 'rain') val = +(Math.random() > 0.7 ? (Math.random() * 15).toFixed(1) : 0);
                else if (metric === 'soil') val = +(30 + Math.random() * 30).toFixed(1);
                values.push(val);
            }
        }
        curr.setDate(curr.getDate() + 1);
    }
    return { labels, values };
}
