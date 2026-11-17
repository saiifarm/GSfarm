// [차트 페이지 렌더링 - 추후 상세 차트 라이브러리 연동용]
function renderChartPageHTML() {
    const container = document.getElementById('content-area');
    container.innerHTML = `
        <h2 style="color:#fff;">📌 실시간 센서 및 환경 차트</h2>
        <div class="hero-divider" style="width: 100%;"></div>
        <div style="background: rgba(255, 255, 255, 0.1); border-radius: 10px; width: 100%; height: 80%; display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 20px; backdrop-filter: blur(5px);">
            <p style="color:#fff; font-size:18px; font-weight:bold;">농장 환경 데이터 시각화 화면 준비 중입니다.</p>
            <p style="color:#ddd; font-size:14px; margin-top:10px;">Grafana 대시보드 또는 Chart.js 연동 영역입니다.</p>
        </div>
    `;
}