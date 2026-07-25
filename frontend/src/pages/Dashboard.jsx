import { useEffect, useState } from "react";
import LeakCard from "../components/LeakCard";
import CategoryChart from "../components/CategoryChart";
import AIFinanceTeam from "../components/AIFinanceTeam";
import "../styles/dashboard.css";
import { getDashboard } from "../services/api";

function Dashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const userId = localStorage.getItem("userId");

        if (!userId) {
          console.error("User ID not found");
          setLoading(false);
          return;
        }

        const response = await getDashboard(userId);

        setDashboard(response);
      } catch (err) {
        console.error("Failed to load dashboard:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="dashboard-container">
        <h2>Loading dashboard...</h2>
      </div>
    );
  }

  if (!dashboard || !dashboard.success) {
    return (
      <div className="dashboard-container">
        <h2>Unable to load dashboard.</h2>
      </div>
    );
  }

  const subscriptions = dashboard.subscriptions || [];
  const leakScore = dashboard.leakScore || {};

  const monthlySpend = subscriptions.reduce(
    (sum, item) => sum + (item.currentAmount || 0),
    0
  );

  const categories = {};

  subscriptions.forEach((sub) => {
    const category = sub.category || "Other";
    categories[category] = (categories[category] || 0) + 1;
  });

  const chartData = Object.keys(categories).map((key) => ({
    name: key,
    value: categories[key],
  }));

  const priceHike = subscriptions.find(
    (item) => item.priceHikePercent > 0
  );

  return (
    <div className="dashboard-container">

      <div className="dashboard-header">
        <h1>Subscription Leak Dashboard</h1>

        <p>
          Analyze your recurring payments and identify hidden subscription
          leaks.
        </p>
      </div>

      <div className="stats-container">

        <div className="stat-card">
          <h3>Total Subscriptions</h3>
          <h2>{subscriptions.length}</h2>
        </div>

        <div className="stat-card">
          <h3>Leak Score</h3>
          <h2>{leakScore.score || 0}/100</h2>
        </div>

        <div className="stat-card">
          <h3>Monthly Spend</h3>
          <h2>${monthlySpend.toFixed(2)}</h2>
        </div>

        <div className="stat-card savings">
          <h3>Potential Savings</h3>
          <h2>${leakScore.yearlyWasteEstimate || 0}</h2>
        </div>

      </div>

      {priceHike && (
        <div className="price-alert">

          <h2>🚨 Price Hike Detected</h2>

          <div className="price-content">

            <div>
              <h3>{priceHike.merchantName}</h3>

              <p>Previous Price</p>

              <span>${priceHike.previousAmount}</span>
            </div>

            <div className="arrow">
              ↑ {priceHike.priceHikePercent}%
            </div>

            <div>
              <p>New Price</p>

              <span className="new-price">
                ${priceHike.currentAmount}
              </span>
            </div>

          </div>

        </div>
      )}

      {chartData.length > 0 && (
        <CategoryChart data={chartData} />
      )}

      <div className="leaks-section">

        <h2>Detected Subscription Leaks</h2>

        <div className="leak-container">

          {subscriptions.length === 0 ? (
            <p>No subscriptions detected.</p>
          ) : (
            subscriptions.map((sub) => (
              <LeakCard
                key={sub._id}
                leak={{
                  id: sub._id,
                  title: sub.merchantName,
                  amount: sub.currentAmount,
                  category: sub.category,

                  severity:
                    sub.priceHikePercent > 0
                      ? "High"
                      : sub.isTrialTrap
                      ? "Medium"
                      : "Low",

                  description:
                    sub.priceHikePercent > 0
                      ? `Price increased by ${sub.priceHikePercent}%`
                      : "Recurring subscription",
                }}
              />
            ))
          )}

        </div>

      </div>

      {/* ==========================
          AI Finance Team
      ========================== */}

      <AIFinanceTeam />

    </div>
  );
}

export default Dashboard;