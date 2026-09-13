const SUPABASE_URL='https://gdbcfvnqfjduxmrksdfe.supabase.co';
const SUPABASE_ANON_KEY='sb_publishable_BEAC-BvYycE7ia4UMx6TUg_-gWt6mM3';
const supabaseClient=supabase.createClient(SUPABASE_URL,SUPABASE_ANON_KEY);

const $=(s,r=document)=>r.querySelector(s); const $$=(s,r=document)=>[...r.querySelectorAll(s)];
const STORE_KEY='almurattil_demo_v1'; const SESSION_KEY='almurattil_demo_session';
const seed={
 courses:[
  {id:'TQ101',name:'Tajweed Level 1',length:'12 weeks',schedule:'Tuesday & Thursday · 6:30 PM',fee:'MVR 1,250',status:'active'},
  {id:'TQ201',name:'Tajweed Level 2',length:'12 weeks',schedule:'Sunday & Wednesday · 7:00 PM',fee:'MVR 1,450',status:'active'},
  {id:'NQ100',name:'Noorani Qaida',length:'10 weeks',schedule:'Saturday & Monday · 5:30 PM',fee:'MVR 950',status:'active'},
  {id:'HF101',name:'Hifz (Memorisation) Program',length:'Ongoing',schedule:'Flexible guided sessions',fee:'MVR 1,600',status:'active'}
 ],
 announcements:[{id:'ANN001',title:'October 2026 intake is open',body:'Applications are being accepted for selected Qur’an learning programmes. Complete the registration form and submit your payment details for review.',tag:'Admissions',date:'2026-09-13'}],
 users:[
  {id:'USR001',full_name:'Demo Administrator',email:'admin@almurattil.test',password:'Admin123!',role:'admin',status:'active'},
  {id:'USR002',full_name:'Demo Teacher',email:'teacher@almurattil.test',password:'Teacher123!',role:'teacher',status:'active'},
  {id:'USR003',full_name:'Demo Student',email:'student@almurattil.test',password:'Student123!',role:'student',status:'active',student_id:'STU-2026-0001'}
 ],
 applications:[{id:'APP001',reference:'AM-2026-0001',full_name:'Aishath Sample',dob:'2005-05-10',national_id:'A000000',email:'sample@student.test',phone:'7000000',guardian_name:'',guardian_phone:'',course_code:'TQ101',payment_method:'bank_transfer',payment_reference:'TEST-001',note:'Test application',status:'pending',submitted_at:'2026-09-13'}],
 enrollments:[{id:'ENR001',user_id:'USR003',course_code:'TQ101',status:'active',progress:35}],
 teacherApplications:[{id:'TAPP001',full_name:'Mohamed Example',email:'applicant@teacher.test',phone:'7111111',position:'Qur’an Teacher',stage:'interview_completed',result:'recommended'}]
};
function clone(x){return JSON.parse(JSON.stringify(x));}
function db(){let d;try{d=JSON.parse(localStorage.getItem(STORE_KEY));}catch{} if(!d){d=clone(seed);saveDb(d)} return d;}
function saveDb(d){localStorage.setItem(STORE_KEY,JSON.stringify(d));}
function uid(prefix){return prefix+Date.now().toString(36).toUpperCase()+Math.random().toString(36).slice(2,5).toUpperCase();}
function nextReference(d){return `AM-2026-${String(d.applications.length+1).padStart(4,'0')}`;}
function session(){try{return JSON.parse(localStorage.getItem(SESSION_KEY))}catch{return null}}
function login(email,password){const d=db();const u=d.users.find(x=>x.email.toLowerCase()===email.toLowerCase()&&x.password===password&&x.status==='active');if(!u)throw new Error('Incorrect email/password or inactive account.');localStorage.setItem(SESSION_KEY,JSON.stringify({user_id:u.id}));return u;}
function logout(){localStorage.removeItem(SESSION_KEY)}
function currentUser(){const s=session();if(!s)return null;return db().users.find(x=>x.id===s.user_id)||null;}
function requireUser(){const u=currentUser();if(!u){location.href='/login';throw new Error('Not signed in')}return u;}
function setActiveNav(){const p=location.pathname.replace(/\.html$/,'')||'/';$$('.navlinks a').forEach(a=>{if(new URL(a.href).pathname.replace(/\.html$/,'')===p)a.classList.add('active')})}
function showMessage(el,msg,kind='notice'){el.className=kind;el.textContent=msg;el.classList.remove('hidden')}
function courseName(code,d=db()){return d.courses.find(c=>c.id===code)?.name||code}
function resetDemo(){localStorage.removeItem(STORE_KEY);localStorage.removeItem(SESSION_KEY);db();}
document.addEventListener('DOMContentLoaded',setActiveNav);
