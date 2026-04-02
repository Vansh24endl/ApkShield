const ApkJob = require('../models/ApkJob');
const { runApkSimulation } = require('../utils/apkSimulator');

exports.uploadApk = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "Invalid APK or no file uploaded." });
    
    const job = new ApkJob({
      userId: "demo_user_123", // Can be replaced with actual user ID later
      filename: req.file.originalname,
      originalFilePath: req.file.path,
      layers: req.body.layers ? JSON.parse(req.body.layers) : [],
    });

    await job.save();

    // Trigger asynchronous workflow
    this.processApkWorkflow(job._id);

    res.status(201).json({ message: "APK uploaded successfully. Awaiting Review.", jobId: job._id });
  } catch (error) {
    res.status(500).json({ error: "Upload failed: " + error.message });
  }
};

exports.processApkWorkflow = async (jobId) => {
  const job = await ApkJob.findById(jobId);
  try {
    const pushLog = async (stage, msg, status) => {
      const updateData = {
        $push: { logs: { stage, message: msg } }
      };
      if (status) {
        updateData.$set = { status };
      }
      await ApkJob.findByIdAndUpdate(jobId, updateData, { new: true });
    };

    // STAGE 2: ANALYSIS ENGINE
    await pushLog("ANALYSIS", "Starting static analysis...", "Assessing Security");
    const analysisResult = await runApkSimulation('analyse', job.originalFilePath);
    
    if(!analysisResult.success) {
      await pushLog("ANALYSIS", "Static analysis failed.", "Analysis Failed");
      return; 
    }

    await ApkJob.findByIdAndUpdate(jobId, { $set: { report: analysisResult.report } });
    await pushLog("ASSESSMENT", "Vulnerabilities found. Awaiting Review.", "Awaiting Review");

    // Automatically approving 
    await new Promise(r => setTimeout(r, 2000));
    await pushLog("APPROVAL", "Security assessment approved.", "Approved");

    // STAGE 4: INJECTION ENGINE
    await pushLog("INJECTION", "Decompiling, injecting layers, recompiling...", "Injecting Layers");
    const injectionResult = await runApkSimulation('inject', job.layers);

    if(!injectionResult.success) {
      await pushLog("INJECTION", "Failed to inject layers.", "Injection Failed");
      return;
    }

    // STAGE 5: TESTING & VALIDATION
    await pushLog("TESTING", "Validating Android compatibility...", "Testing Compatibility");
    const testingResult = await runApkSimulation('test');

    if(!testingResult.success) {
      await pushLog("TESTING", "Compatibility test failed.", "Validation Failed");
      return;
    }

    await ApkJob.findByIdAndUpdate(jobId, { 
      $set: { modifiedFilePath: `uploads/secured_${job.filename}` }
    });
    await pushLog("COMPLETE", "APK successfully secured and signed.", "Completed");

  } catch (error) {
    job.status = "Analysis Failed";
    job.logs.push({ stage: "ERROR", message: error.message });
    await job.save();
  }
};

exports.getJobStatus = async (req, res) => {
  try {
    const job = await ApkJob.findById(req.params.id);
    if (!job) return res.status(404).json({ error: "Not found" });
    res.json(job);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllJobs = async (req, res) => {
    try {
        const jobs = await ApkJob.find().sort({ createdAt: -1 });
        res.json(jobs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.downloadApk = async (req, res) => {
  try {
    const job = await ApkJob.findById(req.params.id);
    if (!job) return res.status(404).json({ error: "Job not found" });
    if (job.status !== "Completed" || !job.modifiedFilePath) {
      return res.status(400).json({ error: "APK not ready for download" });
    }
    
    const fs = require('fs');
    const path = require('path');
    const dummyPath = path.join(__dirname, '..', job.modifiedFilePath);
    
    // Create dummy file for simulation if it doesn't exist
    if (!fs.existsSync(dummyPath)) {
      const dir = path.dirname(dummyPath);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(dummyPath, "This is a secured dummy APK file for simulation purposes.");
    }
    
    res.download(dummyPath, `secured_${job.filename}`);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
