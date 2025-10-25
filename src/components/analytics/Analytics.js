import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';
import DashboardCard from '../common/DashboardCard';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Analytics = ({ db, currentUser }) => {
  const [analyticsData, setAnalyticsData] = useState({
    monthlySales: 0,
    salesGrowth: 0,
    topProduct: { product: '', sales: 0 },
    inventoryValue: 0,
    avgDailySales: 0,
    salesTrend: 0
  });

  const [salesChartData, setSalesChartData] = useState(null);
  const [inventoryChartData, setInventoryChartData] = useState(null);

  useEffect(() => {
    loadAnalyticsData();
  }, []);

  const loadAnalyticsData = () => {
    const monthlySales = db.getMonthlySales();
    const salesGrowth = db.getSalesGrowth();
    const topProduct = db.getTopProduct();
    const inventoryValue = db.getInventoryValue();
    const avgDailySales = db.getAverageDailySales();
    const salesTrend = db.getSalesTrend();
    const salesData = db.getSalesDataForChart();
    const inventoryData = db.getInventoryDataForChart();

    setAnalyticsData({
      monthlySales,
      salesGrowth,
      topProduct,
      inventoryValue,
      avgDailySales,
      salesTrend
    });

    // Prepare sales chart data
    setSalesChartData({
      labels: salesData.labels,
      datasets: [
        {
          label: 'Monthly Sales (₹)',
          data: salesData.data,
          backgroundColor: 'rgba(52, 152, 219, 0.2)',
          borderColor: 'rgba(52, 152, 219, 1)',
          borderWidth: 2,
          tension: 0.4,
          fill: true,
        },
      ],
    });

    // Prepare inventory chart data
    setInventoryChartData({
      labels: inventoryData.labels,
      datasets: [
        {
          data: inventoryData.data,
          backgroundColor: [
            'rgba(52, 152, 219, 0.7)',
            'rgba(46, 204, 113, 0.7)',
            'rgba(155, 89, 182, 0.7)',
            'rgba(243, 156, 18, 0.7)',
            'rgba(231, 76, 60, 0.7)',
            'rgba(26, 188, 156, 0.7)',
            'rgba(241, 196, 15, 0.7)'
          ],
          borderColor: [
            'rgba(52, 152, 219, 1)',
            'rgba(46, 204, 113, 1)',
            'rgba(155, 89, 182, 1)',
            'rgba(243, 156, 18, 1)',
            'rgba(231, 76, 60, 1)',
            'rgba(26, 188, 156, 1)',
            'rgba(241, 196, 15, 1)'
          ],
          borderWidth: 1,
        },
      ],
    });
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `₹${context.raw.toLocaleString()}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return `₹${value.toLocaleString()}`;
          }
        }
      }
    }
  };

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `₹${context.raw.toLocaleString()}`;
          }
        }
      }
    }
  };

  const cards = [
    {
      title: 'Sales This Month',
      value: `₹${analyticsData.monthlySales.toLocaleString()}`,
      footer: `+${Math.round(analyticsData.salesGrowth)}% from last month`,
      icon: 'fas fa-chart-bar',
      color: '#3498db'
    },
    {
      title: 'Top Selling Product',
      value: analyticsData.topProduct.product,
      footer: `${analyticsData.topProduct.sales} units sold`,
      icon: 'fas fa-star',
      color: '#2ecc71'
    },
    {
      title: 'Inventory Value',
      value: `₹${analyticsData.inventoryValue.toLocaleString()}`,
      footer: `${db.getProducts().length} items in stock`,
      icon: 'fas fa-boxes',
      color: '#9b59b6'
    },
    {
      title: 'Avg. Daily Sales',
      value: `₹${Math.round(analyticsData.avgDailySales).toLocaleString()}`,
      footer: `+${Math.round(analyticsData.salesTrend)}% from last week`,
      icon: 'fas fa-shopping-cart',
      color: '#f39c12'
    }
  ];

  return (
    <div>
      {/* Analytics Cards */}
      <div className="dashboard-cards">
        {cards.map((card, index) => (
          <DashboardCard key={index} {...card} />
        ))}
      </div>
     
      {/* Charts Section */}
      <div className="inventory-table" style={{ marginBottom: '20px' }}>
        <div className="table-header">
          <h3>Sales Trends</h3>
        </div>
        <div style={{ padding: '20px', textAlign: 'center', minHeight: '300px', backgroundColor: '#f8f9fa' }}>
          {salesChartData ? (
            <Line data={salesChartData} options={chartOptions} />
          ) : (
            <p>Loading chart data...</p>
          )}
        </div>
      </div>
     
      <div className="inventory-table">
        <div className="table-header">
          <h3>Inventory Analysis</h3>
        </div>
        <div style={{ padding: '20px', textAlign: 'center', minHeight: '300px', backgroundColor: '#f8f9fa' }}>
          {inventoryChartData ? (
            <Doughnut data={inventoryChartData} options={doughnutOptions} />
          ) : (
            <p>Loading chart data...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analytics;