"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { CheckCircle2, CircleDashed, XCircle, Loader2, Download, Terminal, Shield } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function PipelineView() {
  const { id } = useParams();
  const [job, setJob] = useState<any>(null);

  useEffect(() => {
    const fetchStatus = () => {
      fetch(`http://localhost:5000/api/apk/status/${id}`)
        .then(res => res.json())
        .then(data => setJob(data))
        .catch(err => console.error("Error fetching job status:", err));
    };
    
    fetchStatus();
    const interval = setInterval(fetchStatus, 3000);
    return () => clearInterval(interval);
  }, [id]);

  if (!job) return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
    </div>
  );

  const steps = [
    { name: "Upload & Verify", states: ["Pending", "Validity Check Failed"] },
    { name: "Analysis Engine", states: ["Analysis Failed", "Assessing Security", "Awaiting Review"] },
    { name: "Approval Flow", states: ["Approved", "Rejected"] },
    { name: "Injection Engine", states: ["Injecting Layers", "Injection Failed"] },
    { name: "Testing & Validation", states: ["Testing Compatibility", "Validation Failed"] },
    { name: "Ready", states: ["Completed"] }
  ];

  const currentStepIndex = steps.findIndex(s => s.states.includes(job.status));
  const finalStepIndex = currentStepIndex === -1 ? 5 : currentStepIndex;

  const handleDownload = () => {
    window.location.href = `http://localhost:5000/api/apk/download/${id}`;
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="mx-auto max-w-4xl space-y-8">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 border-b pb-6">
          <Shield className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">Job Pipeline</h1>
          <span className="rounded-full bg-accent/20 px-4 py-1.5 text-sm font-medium text-accent">
            {job.filename}
          </span>
        </div>
        
        <Card>
          <CardContent className="p-8">
            <div className="space-y-8">
              {steps.map((step, idx) => {
                const isError = step.states.includes(job.status) && job.status.toLowerCase().includes('failed');
                const isPast = job.status === "Completed" || (idx < finalStepIndex && !isError);
                const isCurrent = idx === finalStepIndex && job.status !== "Completed" && !isError;

                return (
                  <div key={idx} className="flex items-center space-x-6 relative">
                    {/* Connecting UI line */}
                    {idx < steps.length - 1 && (
                      <div className={`absolute left-[1.125rem] top-10 h-10 w-0.5 z-0 ${isPast ? 'bg-primary' : 'bg-muted'}`} />
                    )}

                    <div className="z-10 bg-background overflow-hidden relative">
                      {isError ? (
                        <XCircle className="text-destructive h-10 w-10 animate-pulse bg-background" />
                      ) : isCurrent ? (
                        <div className="relative h-10 w-10 bg-background flex items-center justify-center">
                           <Loader2 className="text-primary h-8 w-8 animate-spin" />
                           <div className="absolute inset-0 rounded-full border-2 border-primary/30 animate-ping"></div>
                        </div>
                      ) : isPast ? (
                        <CheckCircle2 className="text-primary h-10 w-10 bg-background" />
                      ) : (
                        <CircleDashed className="text-muted h-10 w-10 bg-background" />
                      )}
                    </div>
                    
                    <div className="flex-1 pb-2">
                      <h3 className={`text-xl font-medium ${isCurrent ? 'text-primary font-bold' : isPast ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {step.name}
                      </h3>
                      {isCurrent && <p className="text-sm text-muted-foreground mt-1">Current Status: <span className="text-primary font-medium">{job.status}</span></p>}
                      {isError && <p className="text-sm text-destructive mt-1">{job.status}</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Terminal Section */}
        <Card className="overflow-hidden border-border bg-card shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between border-b bg-muted/50 py-4">
            <div className="flex items-center gap-2">
              <Terminal className="h-5 w-5 text-primary" />
              <CardTitle className="text-base font-semibold">
                {job.status === "Completed" ? "Execution Complete" : "Live Terminal Output"}
              </CardTitle>
              {job.status !== "Completed" && (
                <span className="ml-2 flex h-2.5 w-2.5 relative">
                  <span className="absolute inline-flex h-2.5 w-2.5 animate-ping rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-primary"></span>
                </span>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="relative flex h-72 flex-col bg-[#0a0a0a] p-5 overflow-hidden">
              {job.status !== "Completed" && (
                <div className="absolute left-0 top-0 h-1 w-full bg-primary/20">
                   <div className="h-full w-1/3 animate-pulse bg-primary" />
                </div>
              )}
              
              <div className="font-mono text-sm space-y-2 overflow-y-auto flex-1 pr-2">
                {job.logs?.map((log: any, i: number) => (
                  <div key={i} className="text-emerald-400 hover:bg-emerald-900/20 p-1 rounded transition-colors break-words">
                    <span className="text-slate-500">[{new Date(log.timestamp).toLocaleTimeString()}]</span> 
                    <span className="text-emerald-300 ml-2 font-bold opacity-80">[{log.stage}]</span> 
                    <span className="ml-2 text-emerald-50">{log.message}</span>
                  </div>
                ))}
                {job.status !== "Completed" && !job.status.toLowerCase().includes('failed') && (
                  <div className="text-emerald-600/50 animate-pulse ml-2">_</div>
                )}
              </div>

              {job.status === "Completed" && (
                <div className="flex flex-col sm:flex-row gap-4 mt-6">
                  <Button onClick={handleDownload} className="gap-2 shadow-[0_0_15px_rgba(var(--primary),0.5)] animate-pulse hover:animate-none flex-1 font-semibold text-md h-12">
                    <Download className="h-5 w-5" />
                    Download Secure APK
                  </Button>
                  <Button onClick={() => window.location.href = '/dashboard'} variant="outline" className="gap-2 hover:bg-primary/10 flex-1 font-semibold text-md h-12 border-primary/50 text-white dark:text-white">
                    <Shield className="h-5 w-5 text-primary" />
                    Go to Dashboard
                  </Button>
                  <Button onClick={() => window.location.href = `/report/${id}`} variant="outline" className="gap-2 hover:bg-emerald-500/10 flex-1 font-semibold text-md h-12 border-emerald-500/50 text-white dark:text-white">
                    <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                    View Detailed Report
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
