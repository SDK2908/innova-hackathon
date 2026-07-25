function buildPrompt(agent, subscriptions) {
  if (!subscriptions || subscriptions.length === 0) {
    return `
No subscription records were found for this user.

Explain that no recurring subscriptions were detected and recommend uploading a valid bank statement or transaction CSV.
`;
  }

  const subscriptionList = subscriptions
    .map((sub, index) => {
      return `
Subscription ${index + 1}
Merchant: ${sub.merchantName}
Category: ${sub.category}
Billing Cycle: ${sub.cycleType}
Amount: $${sub.currentAmount}
Previous Amount: ${
  sub.previousAmount !== null ? `$${sub.previousAmount}` : "N/A"
}
Price Hike: ${sub.priceHikePercent}%
Unused: ${sub.isUnused ? "Yes" : "No"}
Trial Trap: ${sub.isTrialTrap ? "Yes" : "No"}
Status: ${sub.status}
Last Charge: ${new Date(sub.lastChargeDate).toLocaleDateString()}
`;
    })
    .join("\n");

  const commonData = `
You are analyzing the user's subscription portfolio.

Here are the detected subscriptions:

${subscriptionList}

Generate a professional and well-structured report.
`;

  switch (agent) {
    case "forensics":
      return `
You are the Financial Forensics Agent.

Tasks:
- Detect hidden subscriptions.
- Identify duplicate subscriptions.
- Identify unused subscriptions.
- Detect suspicious recurring payments.
- Explain every finding clearly.

${commonData}
`;

    case "recovery":
      return `
You are the Financial Recovery Strategist.

Tasks:
- Identify subscriptions that should be cancelled.
- Recommend downgrade opportunities.
- Prioritize savings.
- Estimate monthly savings.
- Estimate yearly savings.

${commonData}
`;

    case "intelligence":
      return `
You are the Subscription Intelligence Agent.

Tasks:
- Analyze spending patterns.
- Detect overlapping services.
- Group subscriptions by category.
- Identify expensive categories.
- Suggest optimization opportunities.

${commonData}
`;

    case "simulator":
      return `
You are the Financial Future Simulator.

Tasks:
- Estimate annual spending.
- Predict spending after cancelling unnecessary subscriptions.
- Compare current spending vs optimized spending.
- Explain long-term financial impact.

${commonData}
`;

    case "resolution":
      return `
You are the Customer Resolution Assistant.

Tasks:
- Prepare cancellation recommendations.
- Draft polite cancellation emails.
- Suggest negotiation strategies.
- Recommend downgrade requests where applicable.

${commonData}
`;

    case "executive":
      return `
You are the Executive Recovery Orchestrator.

Tasks:
- Produce an executive summary.
- Highlight major findings.
- Calculate overall subscription health.
- Prioritize action items.
- Provide a concise recovery roadmap.

${commonData}
`;

    default:
      return commonData;
  }
}

module.exports = buildPrompt;