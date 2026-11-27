import { Router } from 'express';
import { randomUUID } from 'node:crypto';
import { db } from '../firebase';
import { progress } from '../services/workflowProgress';
import { authenticate, AuthRequest } from '../auth';

export const workflowRouter = Router();
workflowRouter.use(authenticate);
const leads = ['team_lead','co_lead'];
const admin = (u:any) => leads.includes(u.role);
const fail = (message:string,status=400):never => {throw Object.assign(new Error(message),{status});};
const ensure = (condition:any,message:string,status=400) => {if(!condition)fail(message,status);};
const text = (v:any,label:string,max=500) => {ensure(typeof v==='string'&&v.trim().length>0&&v.trim().length<=max,label+' is required (max '+max+' characters)');return v.trim();};
const stamp = () => new Date().toISOString();
const deadline = (v:any) => {ensure(typeof v==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(v),'Select a valid deadline');const d=new Date(v+'T23:59:59.999+05:30');ensure(Number.isFinite(d.getTime())&&new Date(v+'T00:00:00Z').toISOString().slice(0,10)===v,'Invalid deadline');return d.toISOString();};
const repoUrl = (v:any) => {const s=text(v,'GitHub repository',250);ensure(/^https:\/\/github\.com\/[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+\/?$/.test(s),'Enter a GitHub repository URL, not a file or pull request');return s;};
const clean = (p:any) => {const {passwordHash,password,...safe}=p;return safe;};
const collection = (name:string) => db.collection('vibe_'+name);
const docs = async(q:any) => (await q.get()).docs.map((d:any)=>({id:d.id,...d.data()}));
const active = async(u:any) => {const cycles=await docs(collection('monthlyCycles').where('teamId','==',u.teamId).where('status','==','active'));return cycles[0]||null;};
const handle = (fn:(req:AuthRequest,res:any)=>Promise<any>) => async(req:AuthRequest,res:any) => {try{await fn(req,res);}catch(e:any){res.status(e.status||500).json({error:e.status?e.message:'Workflow request failed'});}};
const audit = (tx:any,u:any,p:any,action:string,detail:any={}) => tx.set(collection('activities').doc(),{teamId:u.teamId,cycleId:p.cycleId||p.id,projectId:p.projectId||p.id||'',memberId:p.memberId||u.id,actorId:u.id,type:action,message:action.replaceAll('_',' '),metadata:detail,timestamp:stamp()});
function normalized(features:any,group=false,members:string[]=[]){
 ensure(Array.isArray(features)&&features.length>=1&&features.length<=80,'Declare 1–80 features');
 const result=features.map((f:any)=>{const title=text(f.title,'Feature title',160);const description=typeof f.description==='string'?f.description.trim().slice(0,1000):'';const assignee=group?text(f.assignee,'Assigned member',180):'';if(group)ensure(members.includes(assignee),'Assign each feature to a group member');return {id:randomUUID(),title,description,assignee,status:'NOT_STARTED',reviewNote:''};});
 ensure(new Set(result.map((f:any)=>f.title.toLowerCase())).size===result.length,'Feature titles must be unique');return result;
}
function projectForMember(p:any,u:any){return p.type==='individual'?p.memberId===u.id:Array.isArray(p.memberIds)&&p.memberIds.includes(u.id);}
function allowed(p:any,u:any){return admin(u)||u.role==='member'&&projectForMember(p,u);}
const cycleProject = async(tx:any,id:string,u:any) => {const ref=collection('projects').doc(id);const snap=await tx.get(ref);ensure(snap.exists,'Project not found',404);const p={id:snap.id,...snap.data()} as any;ensure(p.managedWorkflow&&p.teamId===u.teamId&&allowed(p,u),'Forbidden',403);const cycle=await tx.get(collection('monthlyCycles').doc(p.cycleId));ensure(cycle.exists&&cycle.data()?.teamId===u.teamId&&cycle.data()?.status==='active','This cycle is archived',409);return {ref,p,cycle:cycle.data()};};
workflowRouter.get('/',handle(async(req,res)=>{
 const u=req.user;ensure(admin(u)||u.role==='member','Forbidden',403);
 const current=await active(u);
 let cycle=current;
 if(typeof req.query.cycleId==='string'&&req.query.cycleId!==current?.id){ensure(admin(u),'Only lead/co-lead may view archived cycles',403);const old=await collection('monthlyCycles').doc(req.query.cycleId).get();ensure(old.exists&&old.data()?.teamId===u.teamId,'Cycle not found',404);cycle={id:old.id,...old.data()};}
 const members=(await docs(collection('users').where('teamId','==',u.teamId).where('role','==','member'))).filter((m:any)=>m.active!==false&&m.status!=='inactive').map((m:any)=>({id:m.id,name:m.name}));
 const cycles=admin(u)?(await docs(collection('monthlyCycles').where('teamId','==',u.teamId))).map((c:any)=>({id:c.id,month:c.month,year:c.year,status:c.status,managedWorkflow:!!c.managedWorkflow})):[]; 
 const projects=cycle?(await docs(collection('projects').where('cycleId','==',cycle.id))).filter((p:any)=>p.managedWorkflow&&p.teamId===u.teamId&&allowed(p,u)):[];
 const visibleMembers=admin(u)?members:members.filter((m:any)=>m.id===u.id||projects.some((p:any)=>p.type==='group'&&p.memberIds?.includes(m.id)));
 res.json({cycle,members:visibleMembers,cycles,projects:projects.map(clean)});
}));
workflowRouter.post('/cycles',handle(async(req,res)=>{
 const u=req.user;ensure(u.role==='team_lead','Only the team lead can create cycles',403);
 const b=req.body||{};const month=text(b.month,'Month',7);ensure(/^\d{4}-(0[1-9]|1[0-2])$/.test(month),'Invalid month');
 ensure(Array.isArray(b.deadlines)&&b.deadlines.length===4,'Four individual deadlines are required');
 const dates=b.deadlines.map((v:any)=>{ensure(typeof v==='string'&&v.startsWith(month+'-'),'Individual deadlines must be in the cycle month');return deadline(v);});
 ensure(dates.every((v:string,i:number)=>i===0||v>dates[i-1]),'Deadlines must be in chronological order');
 const permissions={editIdea:b.permissions?.editIdea!==false,addFeatures:b.permissions?.addFeatures!==false,editFeatures:b.permissions?.editFeatures!==false,deleteFeatures:b.permissions?.deleteFeatures===true};
 const cycleRef=collection('monthlyCycles').doc();const guard=collection('workflowTeamLocks').doc(u.teamId);
 const result=await db.runTransaction(async tx=>{
  await tx.get(guard);
  const existing=await tx.get(collection('monthlyCycles').where('teamId','==',u.teamId));
  ensure(!existing.docs.some((d:any)=>d.data().managedWorkflow&&String(d.data().year)+'-'+String(d.data().month).padStart(2,'0')===month),'A managed cycle already exists for this month',409);
  const act=existing.docs.filter((d:any)=>d.data().status==='active');ensure(!act.length||b.archivePrevious===true,'Confirm archiving the previous active cycle',409);
  const memberSnap=await tx.get(collection('users').where('teamId','==',u.teamId).where('role','==','member'));
  const members=memberSnap.docs.filter((d:any)=>d.data().active!==false&&d.data().status!=='inactive');
  ensure(members.length*4+act.length+3<=500,'Team too large for a single atomic cycle; contact administrator');
  act.forEach((d:any)=>tx.update(d.ref,{status:'closed',closedAt:stamp()}));
  const cycle={teamId:u.teamId,month:Number(month.slice(5)),year:Number(month.slice(0,4)),status:'active',managedWorkflow:true,deadlines:dates,permissions,individualStartDate:month+'-01',individualEndDate:dates[3],createdAt:stamp(),createdBy:u.id};
  tx.set(cycleRef,cycle);tx.set(guard,{activeCycleId:cycleRef.id,updatedAt:stamp()});
  for(const member of members)for(let i=0;i<4;i++){const id=cycleRef.id+'_'+member.id+'_'+(i+1);tx.set(collection('projects').doc(id),{teamId:u.teamId,cycleId:cycleRef.id,type:'individual',managedWorkflow:true,slot:i+1,assignmentName:'Project '+String(i+1).padStart(2,'0'),memberId:member.id,memberName:member.data().name||'Member',name:'',domain:'',description:'',features:[],featuresLocked:false,permissions,deadline:dates[i],originalDeadline:dates[i],currentStatus:'IDEA',progressPercentage:0,verificationStatus:'DRAFT',submissionValid:false,createdAt:stamp()});}
  audit(tx,u,{id:cycleRef.id,cycleId:cycleRef.id},'CYCLE_CREATED',{memberCount:members.length});return {id:cycleRef.id,assignments:members.length*4};
 });res.status(201).json(result);
}));
workflowRouter.post('/cycles/:id/slot',handle(async(req,res)=>{
 const u=req.user;ensure(u.role==='team_lead','Only the team lead may update common assignments',403);const b=req.body||{},slot=Number(b.slot);
 ensure(Number.isInteger(slot)&&slot>=1&&slot<=4,'Select a project slot');ensure(b.changeDeadline===true||b.changePermissions===true,'Choose a setting to update');
 const due=b.changeDeadline===true?deadline(b.deadline):null;const reason=text(b.note,'Reason for update',500);
 const permissions={editIdea:b.permissions?.editIdea===true,addFeatures:b.permissions?.addFeatures===true,editFeatures:b.permissions?.editFeatures===true,deleteFeatures:b.permissions?.deleteFeatures===true};
 const result=await db.runTransaction(async tx=>{
  const cref=collection('monthlyCycles').doc(req.params.id as string);const cs=await tx.get(cref);const cycle=cs.data();
  ensure(cs.exists&&cycle?.teamId===u.teamId&&cycle?.managedWorkflow&&cycle?.status==='active','Active managed cycle not found',404);
  const snapshot=await tx.get(collection('projects').where('cycleId','==',cref.id));
  const projects=snapshot.docs.filter(d=>{const p=d.data();return p.teamId===u.teamId&&p.type==='individual'&&p.slot===slot&&p.managedWorkflow;});
  ensure(projects.length+2<=500,'Too many assignments for an atomic update');
  const dates=[...(cycle?.deadlines||[])];
  if(due){dates[slot-1]=due;ensure(dates.every((v:string,i:number)=>i===0||v>dates[i-1]),'Common deadlines must remain in chronological order');}
  const config={...(cycle?.slotPermissions||{})};
  if(b.changePermissions===true)config[String(slot)]=permissions;
  tx.update(cref,{deadlines:dates,slotPermissions:config,updatedAt:stamp()});
  for(const doc of projects){const p=doc.data(),changes:any={updatedAt:stamp()};if(due){changes.deadline=due;changes.deadlineReason=reason;if(p.submittedAt)changes.submissionTiming=p.submittedAt<=due?'ON_TIME':'LATE';}if(b.changePermissions===true)changes.permissions=permissions;tx.update(doc.ref,changes);}
  audit(tx,u,{id:cref.id,cycleId:cref.id},'SLOT_UPDATED',{slot,note:reason,changeDeadline:!!due,changePermissions:b.changePermissions===true});return {updated:projects.length};
 });res.json(result);
}));
workflowRouter.post('/groups',handle(async(req,res)=>{
 const u=req.user;ensure(admin(u),'Only lead and co-lead can create groups',403);const b=req.body||{};
 const name=text(b.name,'Project name',160),groupName=text(b.groupName,'Group name',100),description=text(b.description,'Project description',2000),due=deadline(b.deadline);
 ensure(Array.isArray(b.memberIds)&&b.memberIds.length>0,'Choose group members');const memberIds=Array.from(new Set<string>(b.memberIds));ensure(memberIds.length<=100,'Maximum 100 members per group');
 const features=normalized(b.features,true,memberIds);
 const cycle=await active(u);ensure(cycle?.managedWorkflow,'Create a managed monthly cycle first',409);
 const ref=collection('projects').doc();
 await db.runTransaction(async tx=>{const cs=await tx.get(collection('monthlyCycles').doc(cycle.id));ensure(cs.data()?.status==='active','Cycle closed',409);
 const ms=await tx.get(collection('users').where('teamId','==',u.teamId).where('role','==','member'));const valid=ms.docs.filter((m:any)=>m.data().active!==false&&m.data().status!=='inactive').map((m:any)=>m.id);ensure(memberIds.every(id=>valid.includes(id)),'Group contains an invalid or inactive member',403);
 const p={id:ref.id,teamId:u.teamId,cycleId:cycle.id,type:'group',managedWorkflow:true,name,groupName,description,memberId:u.id,memberIds,features,featuresLocked:true,deadline:due,originalDeadline:due,currentPhase:'DEVELOPMENT',currentStatus:'DEVELOPMENT',verificationStatus:'IN_PROGRESS',progressPercentage:0,submissionValid:false,createdAt:stamp()};
 tx.set(ref,p);audit(tx,u,p,'GROUP_CREATED',{groupName});});res.status(201).json({id:ref.id});
}));
workflowRouter.get('/projects/:id/history',handle(async(req,res)=>{
 const u=req.user;const pdoc=await collection('projects').doc(req.params.id as string).get();const p=pdoc.data();ensure(pdoc.exists&&p?.managedWorkflow&&p.teamId===u.teamId&&allowed(p,u),'Project not found',404);
 const records=await docs(collection('activities').where('projectId','==',pdoc.id));res.json(records.filter((a:any)=>a.teamId===u.teamId).sort((a:any,b:any)=>String(b.timestamp).localeCompare(String(a.timestamp))).slice(0,100));
}));
workflowRouter.post('/projects/:id/action',handle(async(req,res)=>{
 const u=req.user,b=req.body||{},action=b.action;const id=req.params.id as string;
 const result=await db.runTransaction(async tx=>{
  const {ref,p}=await cycleProject(tx,id,u);const lead=admin(u),own=u.role==='member'&&p.memberId===u.id,group=p.type==='group';const next={...p,features:(p.features||[]).map((f:any)=>({...f}))};const fs=next.features;
  const feature=()=>{const f=fs.find((x:any)=>x.id===b.featureId);ensure(f,'Feature not found',404);return f;};
  const invalidate=()=>{next.submissionValid=false;next.verificationStatus='IN_PROGRESS';next.completedAt=null;};
  switch(action){
   case 'declare':{
    ensure(!group&&own,'Only the individual owner can declare the project',403);ensure(!p.featuresLocked,'Feature list already finalized',409);
    const first=!p.name;const perms=p.permissions||{};
    const name=text(b.name,'Project name',160),domain=text(b.domain,'Domain',160),description=text(b.description,'Description',2000);
    ensure(first||perms.editIdea||name===p.name&&domain===p.domain&&description===p.description,'Idea edits are locked',403);
    const incoming=normalized(b.features);const old=new Map(fs.map((f:any)=>[f.id,f]));
    const raw=b.features as any[];const seen=new Set<string>();
    next.features=incoming.map((f:any,i:number)=>{const key=raw[i].id;if(!key){ensure(first||perms.addFeatures,'Adding features is disabled',403);return f;}const prior=old.get(key) as any;ensure(prior&&!seen.has(key),'Invalid feature identifier');seen.add(key);ensure(perms.editFeatures||f.title===prior.title&&f.description===prior.description,'Editing features is disabled',403);return {...prior,title:f.title,description:f.description,...(f.title!==prior.title||f.description!==prior.description?{status:'NOT_STARTED',reviewNote:'Feature details changed; implementation must be updated'}:{})};});
    ensure(first||perms.deleteFeatures||fs.every((f:any)=>seen.has(f.id)),'Deleting features is disabled',403);
    Object.assign(next,{name,title:name,domain,description,expectedOutcome:description,verificationStatus:'DRAFT'});if(b.finalize===true){next.featuresLocked=true;next.verificationStatus='IN_PROGRESS';}break;
   }
   case 'unlock_plan':{
    ensure(u.role==='team_lead'&&!group,'Only team lead may reopen individual planning',403);
    ensure(p.featuresLocked,'Planning is already open',409);const reason=text(b.note,'Reason for reopening planning',500);
    next.featuresLocked=false;invalidate();next.verificationStatus='DRAFT';next.planReopenedReason=reason;break;
   }
   case 'feature_status':{
    const f=feature();ensure(p.featuresLocked,'Finalize features first',409);ensure(group?u.role==='member'&&f.assignee===u.id:own,'Only the assigned member may update this feature',403);
    ensure(['NOT_STARTED','IN_PROGRESS','IMPLEMENTED'].includes(b.status),'Invalid feature status');
    ensure(!['VERIFIED'].includes(f.status)&&p.verificationStatus!=='VERIFIED','Verified features must be reopened by a leader',409);ensure(!p.submissionValid,'Leader must reopen a submitted project before edits',409);
    f.status=b.status;f.updatedAt=stamp();invalidate();if(fs.some((x:any)=>x.status==='REOPENED'))next.verificationStatus='CHANGES_REQUESTED';break;
   }
   case 'feature_review':{
    ensure(lead,'Lead/co-lead only',403);const f=feature();ensure(p.featuresLocked,'Project is not finalized',409);ensure(['VERIFIED','REOPENED'].includes(b.status),'Invalid review decision');ensure(b.status==='VERIFIED'?f.status==='IMPLEMENTED':['IMPLEMENTED','VERIFIED'].includes(f.status),'Only implemented or verified features may be reviewed',409);
    f.reviewNote=b.status==='REOPENED'?text(b.note,'Modification reason',1000):String(b.note||'').slice(0,1000);f.status=b.status;f.reviewedBy=u.id;f.reviewedAt=stamp();if(b.status==='REOPENED'){invalidate();next.verificationStatus='CHANGES_REQUESTED';}break;
   }
   case 'edit_group_feature':{
    ensure(lead&&group,'Only lead/co-lead may modify group requirements',403);const f=feature();const title=text(b.title,'Feature title',160);ensure(!fs.some((x:any)=>x.id!==f.id&&x.title.toLowerCase()===title.toLowerCase()),'Feature title must be unique');
    const assignee=text(b.assignee,'Assignee',180);ensure(p.memberIds.includes(assignee),'Assign a member of this group');const desc=String(b.description||'').trim().slice(0,1000);
    if(f.title!==title||f.description!==desc||f.assignee!==assignee){Object.assign(f,{title,description:desc,assignee,status:'NOT_STARTED',reviewNote:'Requirement or assignment modified by lead'});invalidate();}break;
   }
   case 'submit':{
    ensure(group?lead:own,'Only project owner may submit; group submissions require lead/co-lead',403);ensure(p.featuresLocked&&fs.length&&fs.every((f:any)=>['IMPLEMENTED','VERIFIED'].includes(f.status)),'Implement all features before repository submission',409);
    ensure(!p.submissionValid,'Project already submitted; request a reopening to revise',409);next.githubUrl=repoUrl(b.githubUrl);next.submissionValid=true;next.submittedAt=stamp();next.submissionDate=next.submittedAt;next.submissionTiming=next.submittedAt<=p.deadline?'ON_TIME':'LATE';next.verificationStatus='SUBMITTED';break;
   }
   case 'verify':{
    ensure(lead,'Lead/co-lead only',403);ensure(p.submissionValid&&p.githubUrl&&fs.length&&fs.every((f:any)=>['IMPLEMENTED','VERIFIED'].includes(f.status)),'Submit all features and repository before verification',409);
    fs.forEach((f:any)=>{f.status='VERIFIED';f.reviewedBy=u.id;f.reviewedAt=stamp();});next.verificationStatus='VERIFIED';next.completedAt=stamp();break;
   }
   case 'deadline':{
    ensure(u.role==='team_lead'||group&&lead,'Deadline changes require lead authority',403);next.deadline=deadline(b.deadline);next.deadlineReason=text(b.note,'Deadline change reason',500);if(next.submittedAt)next.submissionTiming=next.submittedAt<=next.deadline?'ON_TIME':'LATE';break;
   }
   case 'permissions':{
    ensure(u.role==='team_lead'&&!group,'Only team lead can change individual permissions',403);next.permissions={editIdea:b.permissions?.editIdea===true,addFeatures:b.permissions?.addFeatures===true,editFeatures:b.permissions?.editFeatures===true,deleteFeatures:b.permissions?.deleteFeatures===true};break;
   }
   default:fail('Unknown workflow action');
  }
  Object.assign(next,progress(next),{updatedAt:stamp()});if(group)next.currentPhase=next.currentStatus==='COMPLETED'?'COMPLETED':next.currentStatus==='VERIFICATION'?'REVIEW':'DEVELOPMENT';
  const {id:ignored,...write}=next;tx.set(ref,write);audit(tx,u,p,action.toUpperCase(),{featureId:b.featureId||'',note:typeof b.note==='string'?b.note.slice(0,1000):''});return next;
 });res.json(result);
}));
