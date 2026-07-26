import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "../styles/dashboard.css";

function DownloadReport({
  dashboardData,
  leaks,
  analysis,
}) {
  const downloadPDF = () => {
    const doc = new jsPDF();

    // ==========================
    // TITLE
    // ==========================

    doc.setFontSize(20);
    doc.setTextColor(33, 37, 41);
    doc.text(
      "SubscriptionIQ AI Report",
      14,
      20
    );

    doc.setFontSize(11);
    doc.setTextColor(100);

    doc.text(
      `Generated on ${new Date().toLocaleString()}`,
      14,
      28
    );

    // ==========================
    // DASHBOARD SUMMARY
    // ==========================

    doc.setFontSize(15);
    doc.setTextColor(0);

    doc.text("Portfolio Summary", 14, 42);

    autoTable(doc, {
      startY: 48,

      head: [["Metric", "Value"]],

      body: [
        [
          "Leak Score",
          `${dashboardData.leakScore}/100`,
        ],
        [
          "Active Subscriptions",
          dashboardData.activeSubscriptions,
        ],
        [
          "Monthly Spend",
          `$${dashboardData.monthlySpend}`,
        ],
        [
          "Potential Savings",
          `$${dashboardData.potentialSavings}`,
        ],
      ],

      theme: "striped",

      headStyles: {
        fillColor: [52, 73, 94],
      },
    });

    // ==========================
    // SUBSCRIPTIONS
    // ==========================

    doc.setFontSize(15);

    doc.text(
      "Detected Subscriptions",
      14,
      doc.lastAutoTable.finalY + 14
    );

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 20,

      head: [[
        "Merchant",
        "Category",
        "Current",
        "Previous",
        "Price Hike",
        "Trial Trap"
      ]],

      body: leaks.map((item) => [
        item.merchantName,
        item.category,
        `$${item.currentAmount}`,
        `$${item.previousAmount}`,
        item.priceHikePercent
          ? `${item.priceHikePercent}%`
          : "-",
        item.isTrialTrap ? "Yes" : "No",
      ]),

      theme: "grid",

      headStyles: {
        fillColor: [41, 128, 185],
      },
    });

    // ==========================
    // AI REPORT
    // ==========================

    let y = doc.lastAutoTable.finalY + 15;

    if (y > 240) {
      doc.addPage();
      y = 20;
    }

    doc.setFontSize(16);

    doc.text(
      "SubscriptionIQ AI Analysis",
      14,
      y
    );

    y += 10;

    doc.setFontSize(12);

    doc.text(
      `Portfolio Health: ${
        analysis?.report?.overallPortfolioHealth || "N/A"
      }`,
      14,
      y
    );

    y += 8;

    doc.text(
      `Subscriptions: ${
        analysis?.report?.subscriptionCount || 0
      }`,
      14,
      y
    );

    y += 8;

    doc.text(
      `Monthly Spend: $${
        analysis?.report?.monthlySpend || 0
      }`,
      14,
      y
    );

    y += 8;

    doc.text(
      `Estimated Savings: $${
        analysis?.report?.estimatedYearlySavings || 0
      }`,
      14,
      y
    );

    y += 12;
        // ==========================
    // EXECUTIVE SUMMARY
    // ==========================

    if (analysis?.report?.executiveSummary) {
      const summary = doc.splitTextToSize(
        analysis.report.executiveSummary,
        180
      );

      doc.setFontSize(14);
      doc.text("Executive Summary", 14, y);

      y += 8;

      doc.setFontSize(11);
      doc.text(summary, 14, y);

      y += summary.length * 6 + 8;
    }

    // ==========================
    // TOP ISSUES
    // ==========================

    if (
      analysis?.report?.topIssues &&
      analysis.report.topIssues.length > 0
    ) {
      if (y > 240) {
        doc.addPage();
        y = 20;
      }

      doc.setFontSize(14);
      doc.text("Top Issues", 14, y);

      y += 8;

      analysis.report.topIssues.forEach((issue) => {
        const lines = doc.splitTextToSize(`• ${issue}`, 180);
        doc.setFontSize(11);
        doc.text(lines, 18, y);
        y += lines.length * 6 + 2;
      });

      y += 4;
    }

    // ==========================
    // RECOMMENDATIONS
    // ==========================

    if (
      analysis?.report?.recommendations &&
      analysis.report.recommendations.length > 0
    ) {
      if (y > 240) {
        doc.addPage();
        y = 20;
      }

      doc.setFontSize(14);
      doc.text("Recommendations", 14, y);

      y += 8;

      analysis.report.recommendations.forEach((rec) => {
        const lines = doc.splitTextToSize(`• ${rec}`, 180);
        doc.setFontSize(11);
        doc.text(lines, 18, y);
        y += lines.length * 6 + 2;
      });

      y += 4;
    }

    // ==========================
    // FINAL RECOMMENDATION
    // ==========================

    if (analysis?.report?.finalRecommendation) {
      if (y > 240) {
        doc.addPage();
        y = 20;
      }

      doc.setFontSize(14);
      doc.text("Final Recommendation", 14, y);

      y += 8;

      const finalText = doc.splitTextToSize(
        analysis.report.finalRecommendation,
        180
      );

      doc.setFontSize(11);
      doc.text(finalText, 14, y);
    }

    // ==========================
    // SAVE PDF
    // ==========================

    doc.save("SubscriptionIQ_Report.pdf");
  };

  return (
    <button
      className="download-btn"
      onClick={downloadPDF}
    >
      📄 Download AI Report
    </button>
  );
}

export default DownloadReport;