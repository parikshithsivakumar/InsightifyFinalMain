import React, { useState, useRef, useEffect } from "react";
import Header from "../Header";
import "./RiskAnalysis.css";

// All domains and their questions
const DOMAIN_OPTIONS = [
  { value: "", label: "Select a Domain" },
  { value: "Income Tax", label: "Income Tax" },
  { value: "Professional Tax", label: "Professional Tax" },
  { value: "Loan", label: "Loan Eligibility" },
  { value: "Rental", label: "Rental Agreement" },
  { value: "FD", label: "Fixed Deposit Withdrawal" },
  { value: "Credit Card", label: "Credit Card Eligibility" },
  { value: "Insurance", label: "Insurance Claim Risk" },
  { value: "Startup Loan", label: "Startup/Business Loan Risk" },
  { value: "Credit Utilization", label: "Credit Utilization Risk" },
  { value: "Visa", label: "Travel Visa Risk" }
];

const DOMAIN_QUESTIONS = {
  "Income Tax": [
    { name: "income", question: "What is your annual income (in ₹)?" }
  ],
  "Professional Tax": [
    { name: "monthlySalary", question: "What is your monthly salary (in ₹)?" },
    { name: "gender", question: "What is your gender?", type: "select", options: ["male", "female"] }
  ],
  "Loan": [
    { name: "cibil", question: "What is your CIBIL score?" },
    { name: "income", question: "What is your monthly income (in ₹)?" },
    { name: "emis", question: "What is your total monthly EMIs (in ₹)?" },
    { name: "age", question: "What is your age?" }
  ],
  "Rental": [
    { name: "type", question: "Is the property residential or commercial?", type: "select", options: ["residential", "commercial"] },
    { name: "rent", question: "What is your current rent (in ₹)?" },
    { name: "proposedRent", question: "What is the proposed rent (in ₹)?" },
    { name: "deposit", question: "What is the deposit amount (in ₹)?" },
    { name: "maintenance", question: "What is the monthly maintenance (in ₹)?" }
  ],
  "FD": [
    { name: "amount", question: "What is the FD amount (in ₹)?" },
    { name: "tenureMonths", question: "How many months have you completed?" },
    { name: "reason", question: "What is the reason for withdrawal?", type: "select", options: ["normal", "critical_illness"] }
  ],
  "Credit Card": [
    { name: "income", question: "What is your monthly income (₹)?" },
    { name: "cibil", question: "What is your CIBIL score?" },
    { name: "existingCards", question: "How many active credit cards do you have?", type: "number" },
    { name: "latePayments", question: "How many late payments in the last year?", type: "number" }
  ],
  "Insurance": [
    { name: "type", question: "Claim type?", type: "select", options: ["Health", "Car", "Home"] },
    { name: "amount", question: "Claim amount (₹)?" },
    { name: "policyActive", question: "Was the policy active at the time of the event?", type: "select", options: ["Yes", "No"] },
    { name: "previousClaims", question: "How many claims in the last 3 years?", type: "number" }
  ],
  "Startup Loan": [
    { name: "businessAge", question: "Business age (years)?" },
    { name: "turnover", question: "Annual turnover (₹)?" },
    { name: "profit", question: "Last year's profit (₹)?" },
    { name: "existingLoans", question: "Do you have existing business loans?", type: "select", options: ["Yes", "No"] }
  ],
  "Credit Utilization": [
    { name: "totalLimit", question: "Total credit limit (₹)?" },
    { name: "outstanding", question: "Current outstanding (₹)?" },
    { name: "activeLines", question: "How many active credit lines?" }
  ],
  "Visa": [
    { name: "country", question: "Destination country?" },
    { name: "purpose", question: "Purpose of visit?", type: "select", options: ["Tourism", "Business", "Study"] },
    { name: "rejections", question: "How many previous visa rejections?", type: "number" },
    { name: "funds", question: "Funds available (₹)?" }
  ]
};

function getResult(domain, formData) {
  let output;
  switch (domain) {
    case "Income Tax":
      const income = Number(formData.income);
      output = income > 700000
        ? `You are liable to pay income tax as your income of ₹${income} exceeds ₹7,00,000.`
        : `No income tax liability. Your income of ₹${income} is within the exemption limit.`;
      break;

    case "Professional Tax":
      const salary = Number(formData.monthlySalary);
      const gender = formData.gender;
      output =
        gender === "female" && salary < 10000
          ? `No professional tax due. Female employees earning below ₹10,000 are exempt.`
          : `Professional tax applicable based on ₹${salary}/month salary.`;
      break;

    case "Loan":
      const cibil = Number(formData.cibil);
      const loanIncome = Number(formData.income);
      const emis = Number(formData.emis);
      const age = Number(formData.age);
      const maxEMI = loanIncome * 0.4;

      if (cibil < 700) {
        output = `Loan eligibility low due to CIBIL score of ${cibil}.`;
      } else if (emis > maxEMI) {
        output = `Too many current EMIs. Max allowed is ₹${maxEMI}, but yours is ₹${emis}.`;
      } else if (age > 60) {
        output = `Loan approval unlikely due to age ${age}.`;
      } else {
        output = `Eligible for personal loan with current profile.`;
      }
      break;

    case "Rental":
      const rent = Number(formData.rent);
      const proposedRent = Number(formData.proposedRent);
      const deposit = Number(formData.deposit);
      const maintenance = Number(formData.maintenance);
      const rentHike = proposedRent - rent;

      if (rentHike > rent * 0.2) {
        output = `Proposed rent hike of ₹${rentHike} is above typical 20% threshold. Negotiate further.`;
      } else if (deposit > 10 * proposedRent) {
        output = `Deposit ₹${deposit} is unusually high (more than 10x rent). May be risky.`;
      } else {
        output = `Rental terms seem reasonable. Proceed with caution.`;
      }
      break;

    case "FD":
      const amount = Number(formData.amount);
      const tenureMonths = Number(formData.tenureMonths);
      const reason = formData.reason;

      if (reason === "critical_illness") {
        output = `FD premature withdrawal of ₹${amount} is justified under critical illness.`;
      } else if (tenureMonths < 6) {
        output = `Penalty likely. Tenure of ${tenureMonths} months is too short.`;
      } else {
        output = `Withdrawal reasonable, but check penalty clauses with the bank.`;
      }
      break;

    // New Domains
    case "Credit Card": {
      const cibil = Number(formData.cibil);
      const late = Number(formData.latePayments);
      output = cibil < 700 || late > 2
        ? "High risk: Likely rejection due to low score or payment history."
        : "Eligible for most credit cards.";
      break;
    }
    case "Insurance": {
      const active = formData.policyActive === "Yes";
      const claims = Number(formData.previousClaims);
      output = !active
        ? "Claim likely denied: Policy was inactive."
        : claims > 2
          ? "Higher scrutiny: Multiple recent claims."
          : "Claim likely approved.";
      break;
    }
    case "Startup Loan": {
      const age = Number(formData.businessAge);
      const profit = Number(formData.profit);
      output = age < 2 && profit < 500000
        ? "High risk: New business with low profitability."
        : "Consider for loan with collateral.";
      break;
    }
    case "Credit Utilization": {
      const limit = Number(formData.totalLimit);
      const used = Number(formData.outstanding);
      const utilization = (used / limit) * 100;
      output = utilization > 50
        ? `High risk: ${utilization.toFixed(1)}% credit utilization. Limit new credit.`
        : "Healthy credit utilization.";
      break;
    }
    case "Visa": {
      const funds = Number(formData.funds);
      const rejections = Number(formData.rejections);
      output = rejections > 0
        ? "Higher risk: Previous visa rejections."
        : funds < 50000
          ? "Risk: Insufficient funds for travel."
          : "Likely approved with proper documentation.";
      break;
    }
    default:
      output = "Please select a valid domain.";
  }
  return output;
}

const RiskAnalysis = () => {
  const [domain, setDomain] = useState("");
  const [formData, setFormData] = useState({});
  const [step, setStep] = useState(0);
  const [chat, setChat] = useState([]);
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");

  const handleDomainChange = (e) => {
    setDomain(e.target.value);
    setFormData({});
    setStep(0);
    setChat([
      { from: "bot", text: `You chose "${e.target.value}". Let's begin!` }
    ]);
    setResult("");
    setInput("");
  };

  const currentQuestion =
    domain && DOMAIN_QUESTIONS[domain] && DOMAIN_QUESTIONS[domain][step];

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setChat((prev) => [...prev, { from: "user", text: input }]);
    const q = currentQuestion;
    let value = input;
    setFormData((prev) => ({ ...prev, [q.name]: value }));
    setInput("");

    if (step + 1 < DOMAIN_QUESTIONS[domain].length) {
      setTimeout(() => setStep(step + 1), 400);
    } else {
      setTimeout(() => {
        const output = getResult(domain, { ...formData, [q.name]: value });
        setChat((prev) => [
          ...prev,
          { from: "bot", text: "Analyzing your inputs..." },
          { from: "bot", text: output }
        ]);
        setResult(output);
      }, 600);
    }
  };

  const handleSelect = (option) => {
    setChat((prev) => [...prev, { from: "user", text: option }]);
    const q = currentQuestion;
    setFormData((prev) => ({ ...prev, [q.name]: option }));
    setInput("");
    if (step + 1 < DOMAIN_QUESTIONS[domain].length) {
      setTimeout(() => setStep(step + 1), 400);
    } else {
      setTimeout(() => {
        const output = getResult(domain, { ...formData, [q.name]: option });
        setChat((prev) => [
          ...prev,
          { from: "bot", text: "Analyzing your inputs..." },
          { from: "bot", text: output }
        ]);
        setResult(output);
      }, 600);
    }
  };

  const showInput =
    domain &&
    DOMAIN_QUESTIONS[domain] &&
    step < DOMAIN_QUESTIONS[domain].length &&
    !result;

  const chatBottomRef = useRef(null);
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  return (
    <div className="risk-bg">
      <Header />
      <div className="risk-chat-container">
        <div className="risk-chat-card">
          <h2 className="chat-title">Risk Analysis Assistant</h2>
          <div className="chat-domain-select">
            <select
              value={domain}
              onChange={handleDomainChange}
              className="chat-domain-dropdown"
            >
              {DOMAIN_OPTIONS.map(opt => (
                <option value={opt.value} key={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          <div className="chat-history">
            {chat.map((msg, idx) => (
              <div
                key={idx}
                className={`chat-bubble ${msg.from === "user" ? "user" : "bot"}`}
              >
                {msg.text}
              </div>
            ))}
            <div ref={chatBottomRef} />
          </div>

          {showInput && (
            <form className="chat-input-row" onSubmit={handleSend}>
              {currentQuestion && currentQuestion.type === "select" ? (
                <div className="chat-select-options">
                  {currentQuestion.options.map(opt => (
                    <button
                      type="button"
                      key={opt}
                      className="chat-option-btn"
                      onClick={() => handleSelect(opt)}
                    >
                      {opt.charAt(0).toUpperCase() + opt.slice(1)}
                    </button>
                  ))}
                </div>
              ) : (
                <>
                  <input
                    className="chat-input"
                    type={
                      currentQuestion &&
                      (currentQuestion.type === "number" ||
                        currentQuestion.name.toLowerCase().includes("amount") ||
                        currentQuestion.name.toLowerCase().includes("score") ||
                        currentQuestion.name.toLowerCase().includes("age") ||
                        currentQuestion.name.toLowerCase().includes("months") ||
                        currentQuestion.name.toLowerCase().includes("lines") ||
                        currentQuestion.name.toLowerCase().includes("turnover") ||
                        currentQuestion.name.toLowerCase().includes("profit") ||
                        currentQuestion.name.toLowerCase().includes("funds") ||
                        currentQuestion.name.toLowerCase().includes("rejections")
                      )
                        ? "number"
                        : "text"
                    }
                    placeholder={currentQuestion ? currentQuestion.question : ""}
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    autoFocus
                  />
                  <button type="submit" className="chat-send-btn">Send</button>
                </>
              )}
            </form>
          )}

          {result && (
            <div className="chat-end-summary">
              <strong>Analysis Complete.</strong>
              <pre>{result}</pre>
              <button className="chat-restart-btn" onClick={() => {
                setDomain("");
                setFormData({});
                setStep(0);
                setChat([]);
                setResult("");
                setInput("");
              }}>
                Start New Analysis
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RiskAnalysis;
