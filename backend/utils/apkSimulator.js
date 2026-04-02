const delay = ms => new Promise(res => setTimeout(res, ms));

exports.runApkSimulation = async (action, data) => {
  await delay(2000); // Simulate processing time

  if (action === 'analyse') {
    return {
      success: true,
      report: {
        staticAnalysis: "Completed",
        manifestExtracted: true,
        vulnerabilities: [
          { type: "Insecure Storage", severity: "High", description: "Hardcoded API keys", recommendation: "Obfuscate keys" },
          { type: "Manifest Exposure", severity: "Medium", description: "Exported activities", recommendation: "Set exported=false" }
        ]
      }
    };
  }

  if (action === 'inject' || action === 'test') {
    return { success: true };
  }

  return { success: false };
};
