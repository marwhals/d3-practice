import { buildBarChart } from './components/barChart.js';
import { buildLines } from './components/lineChart.js';
import { buildUSMap } from './components/usMap.js';

async function initDashboard() {
    await buildBarChart();
    await buildLines();
    await buildUSMap();
}

initDashboard();