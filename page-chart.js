// [차트 페이지 렌더링 및 Chart.js 데이터 시각화]
let farmChartInstance = null;

function renderChartPageHTML() {
    const container = document.getElementById('content-area');

    // 기본 날짜 설정 (7일 전 ~ 오늘)
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
                            <input type="radio" name="chart-zone" value="H1" onchange="onChartZoneChange()"> H1
                        </label>
                        <label class="chart-radio-label">
                            <input type="radio" name="chart-zone" value="H2" onchange="onChartZoneChange()"> H2
                        </label>
                        <label class="chart-radio-label">
                            <input type="radio" name="chart-zone" value="H3" onchange="onChartZoneChange()"> H3
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
                    <div class="chart-display-title" id="chart-header-title">OUT1 - 온도 추이</div>
                    <div class="chart-display-subtitle" id="chart-header-period">${formatDate(weekAgo)} ~ ${formatDate(today)}</div>
                </div>
                <div class="chart-canvas-container">
                    <canvas id="farmChartCanvas"></canvas>
                </div>
            </div>
        </div>
    `;

    // 초기 구역 조건에 맞게 항목 활성화 상태 동기화 및 초기 차트 로드
    onChartZoneChange();
    fetchAndDrawChart();
}

// 구역 변경 시 항목 활성화/비활성화 제어
function onChartZoneChange() {
    const selectedZone = document.querySelector('input[name="chart-zone"]:checked').value;

    const sunInput = document.querySelector('input[name="chart-metric"][value="sun"]');
    const rainInput = document.querySelector('input[name="chart-metric"][value="rain"]');
    const soilInput = document.querySelector('input[name="chart-metric"][value="soil"]');
    const tempInput = document.querySelector('input[name="chart-metric"][value="temp"]');

    const sunLabel = document.getElementById('lbl-metric-sun');
    const rainLabel = document.getElementById('lbl-metric-rain');
    const soilLabel = document.getElementById('lbl-metric-soil');

    // 태양광, 강수량: OUT1에서만 선택 가능
    const allowSunRain = (selectedZone === 'OUT1');
    sunInput.disabled = !allowSunRain;
    rainInput.disabled = !allowSunRain;
    sunLabel.classList.toggle('disabled', !allowSunRain);
    rainLabel.classList.toggle('disabled', !allowSunRain);

    // 토양습도: OUT1과 H3에서만 선택 가능
    const allowSoil = (selectedZone === 'OUT1' || selectedZone === 'H3');
    soilInput.disabled = !allowSoil;
    soilLabel.classList.toggle('disabled', !allowSoil);

    // 현재 선택된 항목이 비활성화되었다면 기본값('온도')으로 자동 전환
    const currentCheckedMetric = document.querySelector('input[name="chart-metric"]:checked');
    if (currentCheckedMetric && currentCheckedMetric.disabled) {
        tempInput.checked = true;
    }
}

// 데이터베이스 API 호출 및 Chart.js 그리기
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
        temp: { label: '온도', unit: '°C', color: '#d9534f', bg: 'rgba(217, 83, 79, 0.15)' },
        hum:  { label: '습도', unit: '%',  color: '#337ab7', bg: 'rgba(51, 122, 183, 0.15)' },
        sun:  { label: '태양광', unit: 'lx', color: '#f0ad4e', bg: 'rgba(240, 173, 78, 0.2)' },
        rain: { label: '강수량', unit: 'mm', color: '#5bc0de', bg: 'rgba(91, 192, 222, 0.2)' },
        soil: { label: '토양습도', unit: '%', color: '#8d5524', bg: 'rgba(141, 85, 36, 0.15)' }
    };
    const meta = metricMeta[metric];

    // 상단 타이틀 갱신
    document.getElementById('chart-header-title').innerText = `${zone} - ${meta.label} (${meta.unit})`;
    document.getElementById('chart-header-period').innerText = `${startDate} ~ ${endDate}`;

    let labels = [];
    let values = [];

    try {
        // Cloudflare Worker / DB API 연동 호출 (엔드포인트에 맞게 URL 수정 가능)
        const queryUrl = `${WORKER_URL}/api/chart?zone=${zone}&metric=${metric}&start=${startDate}&end=${endDate}`;
        const response = await fetch(queryUrl);

        if (!response.ok) throw new Error('DB API 응답 없음');
        const result = await response.json();

        // 예상 응답 포맷: { success: true, data: [{ timestamp: '2026-11-15 12:00', value: 21.5 }, ...] }
        if (result.success && Array.isArray(result.data)) {
            labels = result.data.map(row => row.timestamp);
            values = result.data.map(row => row.value);
        } else {
            throw new Error('데이터 포맷 오류');
        }
    } catch (err) {
        console.warn('DB API 연동 전이거나 응답이 없어 샘플 데이터를 표시합니다:', err);
        // API 구축 전 화면 확인용 더미 데이터 생성 (시작일 ~ 종료일 일 단위)
        const sample = generateSampleChartData(startDate, endDate, metric);
        labels = sample.labels;
        values = sample.values;
    }

    renderChartCanvas(labels, values, zone, meta);
}

// Chart.js 인스턴스 생성 및 업데이트
function renderChartCanvas(labels, values, zone, meta) {
    const ctx = document.getElementById('farmChartCanvas').getContext('2d');

    if (farmChartInstance) {
        farmChartInstance.destroy();
    }

    farmChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: `${zone} ${meta.label} (${meta.unit})`,
                data: values,
                borderColor: meta.color,
                backgroundColor: meta.bg,
                borderWidth: 2.5,
                pointRadius: 3.5,
                pointHoverRadius: 6,
                fill: true,
                tension: 0.25
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index',
                intersect: false
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: { font: { size: 13, weight: 'bold' } }
                },
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
                    ticks: { font: { size: 11 }, maxRotation: 45, minRotation: 0 }
                },
                y: {
                    beginAtZero: (meta.unit === 'mm' || meta.unit === 'lx'),
                    ticks: {
                        font: { size: 12 },
                        callback: function(value) {
                            return value + ' ' + meta.unit;
                        }
                    }
                }
            }
        }
    });
}

// DB API 연결 전 화면 테스트용 샘플 데이터 생성기
function generateSampleChartData(startStr, endStr, metric) {
    const labels = [];
    const values = [];
    let curr = new Date(startStr);
    const end = new Date(endStr);

    while (curr <= end) {
        labels.push(curr.toISOString().split('T')[0]);
        let val = 0;
        if (metric === 'temp') val = +(15 + Math.random() * 12).toFixed(1);
        else if (metric === 'hum') val = +(45 + Math.random() * 35).toFixed(1);
        else if (metric === 'sun') val = Math.floor(15000 + Math.random() * 45000);
        else if (metric === 'rain') val = +(Math.random() > 0.7 ? (Math.random() * 15).toFixed(1) : 0);
        else if (metric === 'soil') val = +(30 + Math.random() * 30).toFixed(1);
        values.push(val);
        curr.setDate(curr.getDate() + 1);
    }
    return { labels, values };
}
