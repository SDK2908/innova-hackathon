function buildPrompt(subscriptions) {
  const subscriptionList = subscriptions
    .map((sub, index) => {
      return `
Subscription ${index + 1}

Merchant: ${sub.merchantName}
Category: ${sub.category}
Current Amount: $${sub.currentAmount}
Previous Amount: $${sub.previousAmount || 0}
Billing Frequency: ${sub.billingFrequency || "Monthly"}
Trial Trap: ${sub.isTrialTrap ? "Yes" : "No"}
Price Increase: ${sub.priceHikePercent || 0}%
Renewal Date: ${sub.renewalDate || "Unknown"}
Status: ${sub.status}
`;
    })
    .join("\n");

  return `
You are SubscriptionIQ AI.

Analyze the following subscription portfolio.

Return ONLY valid JSON.

Do NOT return Markdown.

Do NOT return explanations.

Do NOT wrap the response inside code blocks.

The response MUST exactly follow this schema:

{
  "overallPortfolioHealth": "string",
  "subscriptionCount": number,
  "monthlySpend": number,
  "estimatedYearlySavings": number,
  "priceHikesDetected": number,
  "executiveSummary": "string",
  "topIssues": [
    "string"
  ],
  "recommendations": [
    {
      "action": "string",
      "estimatedYearlySavings": number
    }
  ],
  "finalRecommendation": "string"
}

Use these rules:

• overallPortfolioHealth should be a SHORT status like:
  "Excellent"
  "Good"
  "Moderate Risk"
  "High Risk"

NOT a paragraph.

• executiveSummary should be one concise paragraph.

• topIssues should contain only the major problems.

• recommendations should contain practical actions with yearly savings.

• finalRecommendation should be ONE concise sentence summarizing the best overall action.

Here is the subscription portfolio:

${subscriptionList}
`;
}

module.exports = buildPrompt;