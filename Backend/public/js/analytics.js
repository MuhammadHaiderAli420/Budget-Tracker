const chartCanvas = document.getElementById('chartCanvas');
const dateRangeText = document.getElementById('date-range');
const toggleChart = document.getElementById('toggleChart');
const refreshChart = document.getElementById('refreshChart');

let currentChartType = 'bar';
let chartInstance = null;

const monthsOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul',
  'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function getMonthName(dateStr) {
  return new Date(dateStr).toLocaleString('default', { month: 'short' });
}

function getDateRange(data) {
  const sorted = [...data].sort((a, b) =>
    monthsOrder.indexOf(a.month) - monthsOrder.indexOf(b.month)
  );
  if (!sorted.length) return 'No data available';
  if (sorted.length === 1) return `${sorted[0].month} ${new Date().getFullYear()}`;
  return `${sorted[0].month} to ${sorted[sorted.length - 1].month} ${new Date().getFullYear()}`;
}

async function fetchData() {
  try {
    const token = localStorage.getItem('token');
    const baseUrl = import.meta?.env?.VITE_SERVER_ADDRESS || 'http://localhost:5000';

    const [incomeRes, expenseRes] = await Promise.all([
      fetch(`${baseUrl}/api/v1/income/get`, {
        headers: { Authorization: `Bearer ${token}` },
      }).then(res => res.json()),
      fetch(`${baseUrl}/api/v1/expense/get`, {
        headers: { Authorization: `Bearer ${token}` },
      }).then(res => res.json()),
    ]);

    const monthlyData = {};

    incomeRes.forEach(({ date, amount }) => {
      const month = getMonthName(date);
      monthlyData[month] = monthlyData[month] || { month, income: 0, expense: 0 };
      monthlyData[month].income += amount;
    });

    expenseRes.forEach(({ date, amount }) => {
      const month = getMonthName(date);
      monthlyData[month] = monthlyData[month] || { month, income: 0, expense: 0 };
      monthlyData[month].expense += amount;
    });

    const dataArray = Object.values(monthlyData).sort(
      (a, b) => monthsOrder.indexOf(a.month) - monthsOrder.indexOf(b.month)
    );

    return dataArray;
  } catch (err) {
    console.error('Fetch error:', err);
    return [];
  }
}

function renderChart(data, type = 'bar') {
  if (chartInstance) {
    chartInstance.destroy();
  }

  const labels = data.map(d => d.month);
  const incomeData = data.map(d => d.income);
  const expenseData = data.map(d => d.expense);

  chartInstance = new Chart(chartCanvas, {
    type,
    data: {
      labels,
      datasets: [
        {
          label: 'Income',
          data: incomeData,
          backgroundColor: '#a78bfa',
          borderColor: '#a78bfa',
          fill: type === 'line' ? false : true,
          tension: 0.4
        },
        {
          label: 'Expense',
          data: expenseData,
          backgroundColor: '#7c3aed',
          borderColor: '#7c3aed',
          fill: type === 'line' ? false : true,
          tension: 0.4
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        tooltip: {
          callbacks: {
            label: context => `$${context.raw}`
          }
        }
      },
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
}

async function loadChart() {
  const data = await fetchData();
  if (data.length === 0) {
    dateRangeText.textContent = 'No transaction data available';
    return;
  }
  dateRangeText.textContent = getDateRange(data);
  renderChart(data, currentChartType);
}

// Event listeners
toggleChart.addEventListener('click', () => {
  currentChartType = currentChartType === 'bar' ? 'line' : 'bar';
  toggleChart.textContent = `Switch to ${currentChartType === 'bar' ? 'Line' : 'Bar'} Chart`;
  loadChart();
});

refreshChart.addEventListener('click', () => {
  loadChart();
});

// Initial Load
loadChart();
