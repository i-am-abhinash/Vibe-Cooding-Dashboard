import test from 'node:test';
import assert from 'node:assert/strict';
import { progress } from './workflowProgress';

const project=(completed:number,total:number,extra:Record<string,unknown>={})=>({
 features:Array.from({length:total},(_,i)=>({status:i<completed?'IMPLEMENTED':'NOT_STARTED'})),
 featuresLocked:true,...extra
});
test('empty feature list does not receive completion credit',()=>assert.equal(progress(project(0,0)).progressPercentage,0));
test('partial feature progress is bounded below 99%',()=>assert.equal(progress(project(8,10)).progressPercentage,79));
test('all features implemented without a repository equals 99%',()=>assert.equal(progress(project(10,10)).progressPercentage,99));
test('repository submission reaches 100% but awaits verification',()=>{
 const result=progress(project(10,10,{githubUrl:'https://github.com/example/project',submissionValid:true,verificationStatus:'SUBMITTED'}));
 assert.deepEqual(result,{progressPercentage:100,currentStatus:'VERIFICATION'});
});
test('leader verification marks completed',()=>assert.equal(progress(project(10,10,{githubUrl:'https://github.com/example/project',submissionValid:true,verificationStatus:'VERIFIED'})).currentStatus,'COMPLETED'));
test('repository URL alone cannot make incomplete work 100%',()=>assert.equal(progress(project(8,10,{githubUrl:'https://github.com/example/project',submissionValid:true})).progressPercentage,79));
test('reopening a feature invalidates completion',()=>{
 const result=progress({features:[{status:'VERIFIED'},{status:'REOPENED'}],featuresLocked:true,githubUrl:'https://github.com/example/project',submissionValid:false,verificationStatus:'CHANGES_REQUESTED'});
 assert.deepEqual(result,{progressPercentage:49,currentStatus:'MODIFICATION_REQUESTED'});
});
test('completed features after reopening require a fresh submission',()=>assert.equal(progress(project(10,10,{githubUrl:'https://github.com/example/project',submissionValid:false})).progressPercentage,99));
