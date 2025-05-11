// Simple rule checker - replace with actual clause checks
module.exports = function checkCompliance(text) {
    const requiredKeywords = ['agreement', 'obligation', 'termination', 'dispute'];
  
    const missing = requiredKeywords.filter(word => !text.toLowerCase().includes(word));
    return missing.length === 0 ? 'Pass' : `Fail - Missing: ${missing.join(', ')}`;
  };
  