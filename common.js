/* =========================================================
   AL MURATTIL QURAN INSTITUTE
   common.js

   IMPORTANT:
   - Existing localStorage workflows are preserved.
   - Supabase is currently used only to sync course data.
   - Users, applications, enrollments, announcements,
     teacher applications and sessions remain unchanged.
   ========================================================= */


/* =========================================================
   SUPABASE CONNECTION
   ========================================================= */

const SUPABASE_URL =
  'https://gdbcfvnqfjduxmrksdfe.supabase.co';

const SUPABASE_PUBLISHABLE_KEY =
  'sb_publishable_BEAC-BvYycE7ia4UMx6TUg_-gWt6mM3';

let supabaseClient = null;


/*
  Create the Supabase client only if the Supabase browser
  library has already loaded.

  This prevents the rest of the existing website from
  breaking if Supabase is temporarily unavailable.
*/
if (
  typeof window !== 'undefined' &&
  window.supabase &&
  typeof window.supabase.createClient === 'function'
) {
  supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
  );
}


/* =========================================================
   EXISTING HELPER FUNCTIONS
   PRESERVED
   ========================================================= */

const $ = (s, r = document) => r.querySelector(s);

const $$ = (s, r = document) =>
  [...r.querySelectorAll(s)];


const STORE_KEY = 'almurattil_demo_v1';

const SESSION_KEY = 'almurattil_demo_session';


/* =========================================================
   EXISTING DEMO / FALLBACK DATA
   PRESERVED
   ========================================================= */

const seed = {

  courses: [

    {
      id: 'TQ101',
      name: 'Tajweed Level 1',
      length: '12 weeks',
      schedule: 'Tuesday & Thursday · 6:30 PM',
      fee: 'MVR 1,250',
      status: 'active'
    },

    {
      id: 'TQ201',
      name: 'Tajweed Level 2',
      length: '12 weeks',
      schedule: 'Sunday & Wednesday · 7:00 PM',
      fee: 'MVR 1,450',
      status: 'active'
    },

    {
      id: 'NQ100',
      name: 'Noorani Qaida',
      length: '10 weeks',
      schedule: 'Saturday & Monday · 5:30 PM',
      fee: 'MVR 950',
      status: 'active'
    },

    {
      id: 'HF101',
      name: 'Hifz (Memorisation) Program',
      length: 'Ongoing',
      schedule: 'Flexible guided sessions',
      fee: 'MVR 1,600',
      status: 'active'
    }

  ],


  announcements: [

    {
      id: 'ANN001',
      title: 'October 2026 intake is open',

      body:
        'Applications are being accepted for selected Qur’an learning programmes. Complete the registration form and submit your payment details for review.',

      tag: 'Admissions',

      date: '2026-09-13'
    }

  ],


  users: [

    {
      id: 'USR001',

      full_name:
        'Demo Administrator',

      email:
        'admin@almurattil.test',

      password:
        'Admin123!',

      role:
        'admin',

      status:
        'active'
    },


    {
      id: 'USR002',

      full_name:
        'Demo Teacher',

      email:
        'teacher@almurattil.test',

      password:
        'Teacher123!',

      role:
        'teacher',

      status:
        'active'
    },


    {
      id: 'USR003',

      full_name:
        'Demo Student',

      email:
        'student@almurattil.test',

      password:
        'Student123!',

      role:
        'student',

      status:
        'active',

      student_id:
        'STU-2026-0001'
    }

  ],


  applications: [

    {
      id:
        'APP001',

      reference:
        'AM-2026-0001',

      full_name:
        'Aishath Sample',

      dob:
        '2005-05-10',

      national_id:
        'A000000',

      email:
        'sample@student.test',

      phone:
        '7000000',

      guardian_name:
        '',

      guardian_phone:
        '',

      course_code:
        'TQ101',

      payment_method:
        'bank_transfer',

      payment_reference:
        'TEST-001',

      note:
        'Test application',

      status:
        'pending',

      submitted_at:
        '2026-09-13'
    }

  ],


  enrollments: [

    {
      id:
        'ENR001',

      user_id:
        'USR003',

      course_code:
        'TQ101',

      status:
        'active',

      progress:
        35
    }

  ],


  teacherApplications: [

    {
      id:
        'TAPP001',

      full_name:
        'Mohamed Example',

      email:
        'applicant@teacher.test',

      phone:
        '7111111',

      position:
        'Qur’an Teacher',

      stage:
        'interview_completed',

      result:
        'recommended'
    }

  ]

};


/* =========================================================
   EXISTING DATABASE HELPERS
   PRESERVED
   ========================================================= */

function clone(x) {
  return JSON.parse(
    JSON.stringify(x)
  );
}


function db() {

  let d;

  try {

    d = JSON.parse(
      localStorage.getItem(
        STORE_KEY
      )
    );

  } catch {}


  if (!d) {

    d = clone(seed);

    saveDb(d);
  }


  /*
    Safety checks.

    These ensure older browser data does not break if a
    property is missing.
  */

  if (!Array.isArray(d.courses)) {
    d.courses = clone(seed.courses);
  }

  if (!Array.isArray(d.announcements)) {
    d.announcements =
      clone(seed.announcements);
  }

  if (!Array.isArray(d.users)) {
    d.users =
      clone(seed.users);
  }

  if (!Array.isArray(d.applications)) {
    d.applications =
      clone(seed.applications);
  }

  if (!Array.isArray(d.enrollments)) {
    d.enrollments =
      clone(seed.enrollments);
  }

  if (!Array.isArray(d.teacherApplications)) {
    d.teacherApplications =
      clone(seed.teacherApplications);
  }


  return d;
}


function saveDb(d) {

  localStorage.setItem(
    STORE_KEY,
    JSON.stringify(d)
  );
}


/* =========================================================
   EXISTING ID / REFERENCE HELPERS
   PRESERVED
   ========================================================= */

function uid(prefix) {

  return (
    prefix +
    Date.now()
      .toString(36)
      .toUpperCase() +

    Math.random()
      .toString(36)
      .slice(2, 5)
      .toUpperCase()
  );
}


function nextReference(d) {

  return `AM-2026-${String(
    d.applications.length + 1
  ).padStart(4, '0')}`;
}


/* =========================================================
   EXISTING SESSION / LOGIN SYSTEM
   PRESERVED
   ========================================================= */

function session() {

  try {

    return JSON.parse(
      localStorage.getItem(
        SESSION_KEY
      )
    );

  } catch {

    return null;
  }
}


function login(
  email,
  password
) {

  const d = db();


  const u = d.users.find(
    x =>

      x.email
        .toLowerCase() ===
      email.toLowerCase()

      &&

      x.password ===
      password

      &&

      x.status ===
      'active'
  );


  if (!u) {

    throw new Error(
      'Incorrect email/password or inactive account.'
    );
  }


  localStorage.setItem(
    SESSION_KEY,

    JSON.stringify({
      user_id: u.id
    })
  );


  return u;
}


function logout() {

  localStorage.removeItem(
    SESSION_KEY
  );
}


function currentUser() {

  const s = session();


  if (!s) {
    return null;
  }


  return (
    db().users.find(
      x => x.id === s.user_id
    ) || null
  );
}


function requireUser() {

  const u = currentUser();


  if (!u) {

    location.href = '/login';

    throw new Error(
      'Not signed in'
    );
  }


  return u;
}


/* =========================================================
   EXISTING NAVIGATION
   PRESERVED
   ========================================================= */

function setActiveNav() {

  const p =
    location.pathname
      .replace(/\.html$/, '') ||
    '/';


  $$('.navlinks a')
    .forEach(a => {

      const destination =
        new URL(a.href)
          .pathname
          .replace(/\.html$/, '');


      if (destination === p) {

        a.classList.add(
          'active'
        );
      }

    });
}


/* =========================================================
   EXISTING MESSAGE HELPER
   PRESERVED
   ========================================================= */

function showMessage(
  el,
  msg,
  kind = 'notice'
) {

  el.className =
    kind;

  el.textContent =
    msg;

  el.classList.remove(
    'hidden'
  );
}


/* =========================================================
   EXISTING COURSE NAME HELPER
   PRESERVED
   ========================================================= */

function courseName(
  code,
  d = db()
) {

  return (
    d.courses.find(
      c => c.id === code
    )?.name ||
    code
  );
}


/* =========================================================
   EXISTING RESET FUNCTION
   PRESERVED
   ========================================================= */

function resetDemo() {

  localStorage.removeItem(
    STORE_KEY
  );

  localStorage.removeItem(
    SESSION_KEY
  );

  db();
}


/* =========================================================
   NEW:
   SUPABASE COURSE SYNCHRONISATION

   This is the only new database behaviour currently added.

   It DOES NOT delete:
   - users
   - applications
   - enrollments
   - announcements
   - teacher applications
   ========================================================= */

async function syncCoursesFromSupabase() {

  /*
    If Supabase did not initialise, keep using the local
    courses. The rest of the website continues working.
  */

  if (!supabaseClient) {

    console.warn(
      'Supabase client is unavailable. Using local course data.'
    );

    return false;
  }


  try {

    const {
      data: courses,
      error
    } = await supabaseClient

      .from('courses')

      .select(
        'id,name,length,schedule,fee,status,delivery_type,google_meet_enabled,moodle_enabled,moodle_course_id,moodle_course_url'
      )

      .order(
        'name',
        {
          ascending: true
        }
      );


    if (error) {

      console.error(
        'Unable to load courses from Supabase:',
        error
      );

      return false;
    }


    if (!Array.isArray(courses)) {

      return false;
    }


    /*
      Preserve the entire existing local database.

      ONLY replace d.courses.
    */

    const d = db();


    d.courses = courses.map(
      course => ({

        id:
          course.id,

        name:
          course.name,

        length:
          course.length || '',

        schedule:
          course.schedule || '',

        fee:
          course.fee || '',

        status:
          course.status || 'active',

        /*
          These are additional fields for the new
          live/video/hybrid architecture.
        */

        delivery_type:
          course.delivery_type ||
          'live',

        google_meet_enabled:
          Boolean(
            course.google_meet_enabled
          ),

        moodle_enabled:
          Boolean(
            course.moodle_enabled
          ),

        moodle_course_id:
          course.moodle_course_id ||
          null,

        moodle_course_url:
          course.moodle_course_url ||
          null

      })
    );


    saveDb(d);


    /*
      Refresh only course-related parts of the page.
    */

    refreshCoursePage();

    refreshRegistrationCourseDropdown();


    console.log(
      'Courses successfully synced from Supabase.'
    );


    return true;

  } catch (error) {

    console.error(
      'Unexpected Supabase course sync error:',
      error
    );

    return false;
  }
}


/* =========================================================
   NEW:
   REFRESH COURSES PAGE

   Existing courses.html does not need to be changed.
   ========================================================= */

function refreshCoursePage() {

  const container =
    $('#courses');


  /*
    If we are not on the courses page,
    do nothing.
  */

  if (!container) {
    return;
  }


  const d = db();


  const activeCourses =
    d.courses.filter(
      c =>
        c.status ===
        'active'
    );


  if (
    activeCourses.length ===
    0
  ) {

    container.innerHTML =
      '<div class="card">No active courses.</div>';

    return;
  }


  container.innerHTML =
    activeCourses

      .map(c => {

        /*
          Optional label for future
          Moodle / Meet support.
        */

        let deliveryLabel = '';


        if (
          c.delivery_type ===
          'video'
        ) {

          deliveryLabel =
            '<span class="pill">Video course</span>';

        } else if (
          c.delivery_type ===
          'hybrid'
        ) {

          deliveryLabel =
            '<span class="pill">Hybrid course</span>';

        } else if (
          c.delivery_type ===
          'live'
        ) {

          deliveryLabel =
            '<span class="pill">Live course</span>';
        }


        return `

          <article class="card course-card">

            <span class="pill">
              ${c.id}
            </span>

            ${deliveryLabel}

            <h2>
              ${c.name}
            </h2>

            <p class="muted">

              ${c.length || ''}

              ${
                c.schedule
                  ? `<br>${c.schedule}`
                  : ''
              }

              ${
                c.fee
                  ? `<br><strong>${c.fee}</strong>`
                  : ''
              }

            </p>


            <a
              class="btn btn-primary"
              href="/register?course=${encodeURIComponent(
                c.id
              )}"
            >
              Register
            </a>

          </article>

        `;

      })

      .join('');
}


/* =========================================================
   NEW:
   REFRESH REGISTRATION COURSE DROPDOWN

   Existing register.html does not need to be changed.
   ========================================================= */

function refreshRegistrationCourseDropdown() {

  const select =
    $('#courseSelect');


  /*
    If this is not the registration page,
    do nothing.
  */

  if (!select) {
    return;
  }


  const d = db();


  const selectedBeforeRefresh =
    select.value;


  const queryCourse =
    new URLSearchParams(
      location.search
    ).get('course');


  /*
    Clear the current options before rebuilding them.
  */

  select.innerHTML =
    '<option value="">Select a course</option>';


  d.courses

    .filter(
      c =>
        c.status ===
        'active'
    )

    .forEach(c => {

      select.insertAdjacentHTML(

        'beforeend',

        `
          <option value="${c.id}">
            ${c.name}
          </option>
        `
      );

    });


  /*
    Keep whichever course was already selected.

    If there was no previous selection,
    use ?course=TQ101 etc.
  */

  const preferredCourse =
    selectedBeforeRefresh ||
    queryCourse;


  if (
    preferredCourse &&
    d.courses.some(
      c =>
        c.id ===
        preferredCourse &&
        c.status ===
        'active'
    )
  ) {

    select.value =
      preferredCourse;
  }
}


/* =========================================================
   INITIAL PAGE LOAD
   ========================================================= */

document.addEventListener(
  'DOMContentLoaded',
  () => {

    /*
      Existing behaviour.
    */

    setActiveNav();


    /*
      New behaviour:

      Fetch current course information from Supabase.

      This runs AFTER the existing page HTML/scripts have
      loaded, so the current website remains functional
      even while Supabase responds.
    */

    syncCoursesFromSupabase();

  }
);
