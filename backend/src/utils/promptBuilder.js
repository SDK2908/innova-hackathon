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

Return ONLY valid JSON matching the schema configured for your Lyzr Agent.

Do not return Markdown.

Do not return explanations.

Do not wrap the response inside code blocks.

Here is the subscription portfolio:

${subscriptionList}

Analyze:

• Overall portfolio health

• Monthly spend

• Estimated yearly savings

• Number of subscriptions

• Number of detected price hikes

• Top issues

• Actionable recommendations

• Executive summary
`;
}

module.exports = buildPrompt;