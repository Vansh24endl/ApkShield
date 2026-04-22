const delay = ms => new Promise(res => setTimeout(res, ms));

exports.runApkSimulation = async (action, data) => {
  await delay(2000); // Simulate processing time

  if (action === 'analyse') {
    const hash = (data || "").split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    const vulns = [];
    if (hash % 2 === 0) vulns.push({ type: "Insecure Storage", severity: "High", description: "Hardcoded API keys or Secrets detected in simulation.", recommendation: "Obfuscate keys" });
    if (hash % 3 === 0) vulns.push({ type: "Manifest Exposure", severity: "Medium", description: "Exported activities found in simulation.", recommendation: "Set exported=false unless specifically required." });
    if (hash % 5 === 0) vulns.push({ type: "Network Security", severity: "Critical", description: "Cleartext HTTP allowed in simulation.", recommendation: "Use HTTPS only." });
    if (vulns.length === 0) vulns.push({ type: "Clean", severity: "Low", description: "No vulnerabilities simulated.", recommendation: "Appears secure." });

    return {
      success: true,
      report: {
        staticAnalysis: "Completed (Simulated)",
        manifestExtracted: true,
        vulnerabilities: vulns
      }
    };
  }

  if (action === 'inject' || action === 'test') {
    return { success: true };
  }

  return { success: false };
};
