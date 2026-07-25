import { useEffect, useState } from "react";
import LeakCard from "../components/LeakCard";
import CategoryChart from "../components/CategoryChart";
import AIFinanceTeam from "../components/AIFinanceTeam";
import AIInsightCard from "../components/AIInsightCard";
import DownloadReport from "../components/DownloadReport";
import "../styles/dashboard.css";
import { getDashboard } from "../services/api";

function Dashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [analysis, setAnalysis] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const userId = localStorage.getItem("userId");

        if (!userId) {
          setLoading(false);
          return;
        }

        const response = await getDashboard(userId);
        setDashboard(response);
      } catch (err) {
        console.error("Dashboard Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading-state">
          <h2>Loading your subscription dashboard...</h2>
        </div>
      </div>
    );
  }

  if (!dashboard?.success) {
    return (
      <div className="dashboard-container">
        <div className="loading-state">
          <h2>Unable to load dashboard.</h2>
        </div>
      </div>
    );
  }

  const subscriptions = dashboard.subscriptions || [];
  const leakScore = dashboard.leakScore || {};

  const monthlySpend = subscriptions.reduce(
    (sum, sub) => sum + (sub.currentAmount || 0),
    0
  );

  const categories = {};

  subscriptions.forEach((sub) => {
    const key = sub.category || "Other";
    categories[key] = (categories[key] || 0) + 1;
  });

  const chartData = Object.keys(categories).map((key) => ({
    name: key,
    value: categories[key],
  }));

  const priceHike = subscriptions.find(
    (sub) => sub.priceHikePercent > 0
  );

  return (
    <div className="dashboard-container">

      {/* ================= HERO ================= */}

      <section className="dashboard-header">

        <div className="hero-content">

          <div>

            <h1>💳 Subscription Leak Dashboard</h1>

            <p>
              Detect hidden subscriptions, recurring payment leaks,
              silent price hikes and discover opportunities to reduce
              unnecessary recurring expenses.
            </p>

          </div>

        </div>

      </section>

      {/* ================= STATS ================= */}

      <section className="stats-container">

        <div className="stat-card">

          <span>Total Subscriptions</span>

          <h2>{subscriptions.length}</h2>

        </div>

        <div className="stat-card">

          <span>Leak Score</span>

          <h2>{leakScore.score || 82}/100</h2>

        </div>

        <div className="stat-card">

          <span>Monthly Spend</span>

          <h2>${monthlySpend.toFixed(2)}</h2>

        </div>

        <div className="stat-card savings">

          <span>Potential Savings</span>

          <h2>${leakScore.yearlyWasteEstimate || 0}</h2>

        </div>

      </section>

      {/* ================= PRICE ALERT ================= */}

      {priceHike && (

        <section className="price-alert">

          <div className="price-alert-header">

            <h2>🚨 Silent Price Hike Detected</h2>

            <p>
              One of your recurring subscriptions has increased
              without requiring any action from you.
            </p>

          </div>

          <div className="price-content">

            <div className="price-box">

              <h4>{priceHike.merchantName}</h4>

              <small>Previous Price</small>

              <h2>${priceHike.previousAmount}</h2>

            </div>

            <div className="arrow">

              ↑ {priceHike.priceHikePercent}%

            </div>

            <div className="price-box">

              <small>Current Price</small>

              <h2 className="new-price">

                ${priceHike.currentAmount}

              </h2>

            </div>

          </div>

        </section>

      )}

      {/* ================= CATEGORY CHART ================= */}

      {chartData.length > 0 && (

        <section className="chart-section">

          <CategoryChart data={chartData} />

        </section>

      )}

      {/* ================= SUBSCRIPTIONS ================= */}

      <section className="leaks-section">

        <div className="section-title">

          <h2>Detected Subscriptions</h2>

          <p>
            Review all recurring payments detected from your uploaded
            transactions.
          </p>

        </div>

        <div className="leak-container">

          {subscriptions.map((sub) => (

            <LeakCard
              key={sub._id}
              leak={{
                id: sub._id,
                title: sub.merchantName,
                amount: sub.currentAmount,
                previousAmount: sub.previousAmount,
                category: sub.category,
                score: leakScore.score || 82,

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

          ))}

        </div>

      </section>

      {/* ================= AI ANALYSIS ================= */}

      <AIFinanceTeam
        onAnalysisComplete={setAnalysis}
      />
            {/* ================= AI RESULTS ================= */}

      {analysis?.report && (

        <section className="analysis-section">

          <div className="analysis-header">

            <h2>🤖 SubscriptionIQ AI Analysis</h2>

            <p>
              Your complete subscription portfolio has been analyzed by AI.
              Review the overall health, key risks, and personalized
              recommendations below.
            </p>

          </div>

          {/* Summary Cards */}

          <div className="analysis-summary">

            <div className="summary-card">

              <span className="summary-label">
                Portfolio Health
              </span>

<h2>
  {analysis.report.overallPortfolioHealth
    ?.split(".")[0]
    .replace(/\.$/, "")}
</h2>

            </div>

            <div className="summary-card">

              <span className="summary-label">
                Active Subscriptions
              </span>

              <h2>
                {analysis.report.subscriptionCount}
              </h2>

            </div>

            <div className="summary-card">

              <span className="summary-label">
                Monthly Spend
              </span>

              <h2>
                ${analysis.report.monthlySpend}
              </h2>

            </div>

            <div className="summary-card">

              <span className="summary-label">
                Estimated Savings
              </span>

              <h2>
                ${analysis.report.estimatedYearlySavings}
              </h2>

            </div>

          </div>

          {/* Detailed AI Report */}

          <AIInsightCard
            item={analysis.report}
          />

          {/* Download */}

          <div className="download-wrapper">

            <DownloadReport
              dashboardData={{
                monthlySpend,
                potentialSavings:
                  leakScore.yearlyWasteEstimate || 0,
                activeSubscriptions: subscriptions.length,
                leakScore: leakScore.score || 82,
              }}
              leaks={subscriptions}
              analysis={analysis}
            />

          </div>

        </section>

      )}

    </div>
  );
}

export default Dashboard;