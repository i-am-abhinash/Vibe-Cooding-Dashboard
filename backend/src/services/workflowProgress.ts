export function progress(p:any){
 const fs=Array.isArray(p.features)?p.features:[];const done=fs.filter((f:any)=>['IMPLEMENTED','VERIFIED'].includes(f.status)).length;
 const all=fs.length>0&&done===fs.length;
 const pct=all&&p.githubUrl&&p.submissionValid===true?100:fs.length?Math.floor(99*done/fs.length):0;
 return {progressPercentage:pct,currentStatus:p.verificationStatus==='VERIFIED'&&pct===100?'COMPLETED':pct===100?'VERIFICATION':fs.some((f:any)=>f.status==='REOPENED')?'MODIFICATION_REQUESTED':p.featuresLocked?'DEVELOPMENT':'IDEA'};
}
