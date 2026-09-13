/* =========================================================
   AL MURATTIL QURAN INSTITUTE
   COMMON.JS

   Current website functionality is preserved.
   Supabase is currently used only for course synchronisation.
   ========================================================= */


/* =========================================================
   BASIC HELPERS
   ========================================================= */

const $ = (s, r = document) => r.querySelector(s);

const $$ = (s, r = document) =>
  [...r.querySelectorAll(s)];


/* =========================================================
   LOCAL STORAGE
   ========================================================= */

const STORE_KEY = 'almurattil_demo_v1';

const SESSION_KEY = 'almurattil_demo_session';


/* =========================================================
   SUPABASE CONNECTION
   ========================================================= */

const SUPABASE_URL =
  'https://gdbcfvnqfjduxmrksdfe.supabase.co';

const SUPABASE_PUBLISHABLE_KEY =
  'sb_publishable_BEAC-BvYycE7ia4UMx6TUg_-gWt6mM3';

let supabaseClient = null;


/*
   Loads Supabase automatically.

   This means your existing HTML files do NOT need
   a separate Supabase <script> tag.
*/

async function loadSupabaseLibrary() {

  if (
    window.supabase &&
    typeof window.supabase.createClient === 'function'
  ) {

    return true;
  }


  return new Promise(resolve => {

    const existing =
      document.querySelector(
        'script[data-almurattil-supabase]'
      );


    if (existing) {

      existing.addEventListener(
        'load',
        () => resolve(true)
      );

      existing.addEventListener(
        'error',
        () => resolve(false)
      );

      return;
    }


    const script =
      document.createElement('script');


    script.src =
      'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';


    script.async = true;


    script.setAttribute(
      'data-almurattil-supabase',
      'true'
    );


    script.onload =
      () => resolve(true);


    script.onerror =
      () => resolve(false);


    document.head.appendChild(
      script
    );

  });
}


async function getSupabaseClient() {

  if (supabaseClient) {

    return supabaseClient;
  }


  const loaded =
    await loadSupabaseLibrary();


  if (
    !loaded ||
    !window.supabase
  ) {

    console.warn(
      'Supabase library could not be loaded.'
    );

    return null;
  }


  supabaseClient =
    window.supabase.createClient(
      SUPABASE_URL,
      SUPABASE_PUBLISHABLE_KEY
    );


  return supabaseClient;
}


/* =========================================================
   EXISTING DEMO / FALLBACK DATA
   ========================================================= */

const seed = {

  courses: [

    {
      id: 'TQ101',
      name: 'Tajweed Level 1',
      length: '12 weeks',
      schedule:
        'Tuesday & Thursday · 6:30 PM',
      fee: 'MVR 1,250',
      status: 'active'
    },

    {
      id: 'TQ201',
      name: 'Tajweed Level 2',
      length: '12 weeks',
      schedule:
        'Sunday & Wednesday · 7:00 PM',
      fee: 'MVR 1,450',
      status: 'active'
    },

    {
      id: 'NQ100',
      name: 'Noorani Qaida',
      length: '10 weeks',
      schedule:
        'Saturday & Monday · 5:30 PM',
      fee: 'MVR 950',
      status: 'active'
    },

    {
      id: 'HF101',
      name:
        'Hifz (Memorisation) Program',
      length: 'Ongoing',
      schedule:
        'Flexible guided sessions',
      fee: 'MVR 1,600',
      status: 'active'
    }

  ],


  announcements: [

    {
      id: 'ANN001',

      title:
        'October 2026 intake is open',

      body:
        'Applications are being accepted for selected Qur’an learning programmes. Complete the registration form and submit your payment details for review.',

      tag:
        'Admissions',

      date:
        '2026-09-13'
    }

  ],


  users: [

    {
      id:
        'USR001',

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
      id:
        'USR002',

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
      id:
        'USR003',

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
   CLONE
   ========================================================= */

function clone(x) {

  return JSON.parse(
    JSON.stringify(x)
  );
}


/* =========================================================
   DATABASE
   ========================================================= */

function db() {

  let d;


  try {

    d = JSON.parse(
      localStorage.getItem(
        STORE_KEY
      )
    );

  } catch {}


  /*
     First visit
  */

  if (!d) {

    d =
      clone(seed);

    saveDb(d);
  }


  /*
     IMPORTANT DATA PROTECTION

     Repair missing sections individually.

     Existing users/applications/etc. are NOT replaced.
  */

  if (
    !Array.isArray(
      d.users
    )
  ) {

    d.users =
      clone(seed.users);
  }


  if (
    !Array.isArray(
      d.applications
    )
  ) {

    d.applications =
      clone(seed.applications);
  }


  if (
    !Array.isArray(
      d.enrollments
    )
  ) {

    d.enrollments =
      clone(seed.enrollments);
  }


  if (
    !Array.isArray(
      d.announcements
    )
  ) {

    d.announcements =
      clone(seed.announcements);
  }


  if (
    !Array.isArray(
      d.teacherApplications
    )
  ) {

    d.teacherApplications =
      clone(
        seed.teacherApplications
      );
  }


  /*
     Repair the earlier empty-course issue.

     This happens only when the course array is
     missing or completely empty.
  */

  if (
    !Array.isArray(
      d.courses
    ) ||
    d.courses.length === 0
  ) {

    d.courses =
      clone(seed.courses);
  }


  saveDb(d);


  return d;
}


/* =========================================================
   SAVE DATABASE
   ========================================================= */

function saveDb(d) {

  localStorage.setItem(
    STORE_KEY,
    JSON.stringify(d)
  );
}


/* =========================================================
   ID GENERATION
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


/* =========================================================
   APPLICATION REFERENCE
   ========================================================= */

function nextReference(d) {

  return `AM-2026-${String(
    d.applications.length + 1
  ).padStart(4, '0')}`;
}


/* =========================================================
   SESSION
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


/* =========================================================
   LOGIN
   ========================================================= */

function login(
  email,
  password
) {

  const d =
    db();


  const u =
    d.users.find(

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


/* =========================================================
   LOGOUT
   ========================================================= */

function logout() {

  localStorage.removeItem(
    SESSION_KEY
  );
}


/* =========================================================
   CURRENT USER
   ========================================================= */

function currentUser() {

  const s =
    session();


  if (!s) {

    return null;
  }


  return (

    db().users.find(
      x =>
        x.id ===
        s.user_id
    ) ||

    null

  );
}


/* =========================================================
   REQUIRE USER
   ========================================================= */

function requireUser() {

  const u =
    currentUser();


  if (!u) {

    location.href =
      '/login';


    throw new Error(
      'Not signed in'
    );
  }


  return u;
}


/* =========================================================
   ACTIVE NAVIGATION
   ========================================================= */

function setActiveNav() {

  const p =

    location.pathname
      .replace(
        /\.html$/,
        ''
      ) ||

    '/';


  $$('.navlinks a')
    .forEach(a => {

      const target =

        new URL(
          a.href
        )
          .pathname
          .replace(
            /\.html$/,
            ''
          );


      if (
        target === p
      ) {

        a.classList.add(
          'active'
        );
      }

    });
}


/* =========================================================
   MESSAGE
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
   COURSE NAME
   ========================================================= */

function courseName(
  code,
  d = db()
) {

  return (

    d.courses.find(
      c =>
        c.id === code
    )?.name ||

    code

  );
}


/* =========================================================
   RESET DEMO
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
   SUPABASE COURSE NORMALISER
   ========================================================= */

function normaliseSupabaseCourse(
  course
) {

  return {

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

  };
}


/* =========================================================
   MERGE SUPABASE COURSES INTO LOCAL DATA

   This does NOT delete local-only courses.

   Existing applications/users/etc. are untouched.
   ========================================================= */

function mergeSupabaseCourses(
  remoteCourses
) {

  const d =
    db();


  const byId =
    new Map();


  /*
     Preserve every existing local course first.
  */

  d.courses.forEach(
    course => {

      byId.set(
        course.id,
        course
      );
    }
  );


  /*
     Supabase updates courses with matching IDs
     and adds new Supabase courses.
  */

  remoteCourses.forEach(
    course => {

      const remote =
        normaliseSupabaseCourse(
          course
        );


      const existing =
        byId.get(
          remote.id
        ) || {};


      byId.set(

        remote.id,

        {
          ...existing,
          ...remote
        }

      );

    }
  );


  d.courses =
    [...byId.values()];


  saveDb(d);


  return d.courses;
}


/* =========================================================
   UPDATE PUBLIC COURSES PAGE
   ========================================================= */

function renderSupabaseCourses(
  remoteCourses
) {

  const container =
    $('#courses');


  if (!container) {

    return;
  }


  const courses =
    remoteCourses

      .map(
        normaliseSupabaseCourse
      )

      .filter(
        course =>
          course.status ===
          'active'
      );


  /*
     IMPORTANT:

     Never replace the current page with an empty result.

     If Supabase returns nothing, the existing local
     fallback remains visible.
  */

  if (
    courses.length === 0
  ) {

    return;
  }


  container.innerHTML =

    courses

      .map(c => `

        <article
          class="card course-card"
        >

          <span class="pill">
            ${c.id}
          </span>

          <h2>
            ${c.name}
          </h2>

          <p class="muted">

            ${c.length}

            <br>

            ${c.schedule}

            <br>

            <strong>
              ${c.fee}
            </strong>

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

      `)

      .join('');
}


/* =========================================================
   UPDATE REGISTRATION COURSE SELECT
   ========================================================= */

function renderSupabaseCourseSelect(
  remoteCourses
) {

  const select =
    $('#courseSelect');


  if (!select) {

    return;
  }


  const courses =
    remoteCourses

      .map(
        normaliseSupabaseCourse
      )

      .filter(
        course =>
          course.status ===
          'active'
      );


  if (
    courses.length === 0
  ) {

    return;
  }


  const currentlySelected =
    select.value;


  const queryCourse =

    new URLSearchParams(
      location.search
    ).get(
      'course'
    );


  select.innerHTML =

    '<option value="">Select a course</option>';


  courses.forEach(
    course => {

      select.insertAdjacentHTML(

        'beforeend',

        `
          <option value="${course.id}">
            ${course.name}
          </option>
        `

      );

    }
  );


  const preferred =

    currentlySelected ||

    queryCourse;


  if (
    preferred &&
    courses.some(
      c =>
        c.id === preferred
    )
  ) {

    select.value =
      preferred;
  }
}


/* =========================================================
   FETCH COURSES FROM SUPABASE
   ========================================================= */

async function syncCoursesFromSupabase() {

  try {

    const client =
      await getSupabaseClient();


    if (!client) {

      console.warn(
        'Supabase unavailable. Existing local course data remains active.'
      );

      return false;
    }


    const {
      data,
      error
    } = await client

      .from(
        'courses'
      )

      .select(
        `
          id,
          name,
          length,
          schedule,
          fee,
          status,
          delivery_type,
          google_meet_enabled,
          moodle_enabled,
          moodle_course_id,
          moodle_course_url
        `
      )

      .eq(
        'status',
        'active'
      )

      .order(
        'name',
        {
          ascending: true
        }
      );


    if (error) {

      console.error(
        'Supabase courses error:',
        error
      );


      return false;
    }


    /*
       Critical protection:

       Empty Supabase results must never erase
       the existing website data.
    */

    if (
      !Array.isArray(data) ||
      data.length === 0
    ) {

      console.warn(
        'Supabase returned zero active courses. Existing local courses have been preserved.'
      );


      return false;
    }


    /*
       Merge them into the existing browser data.

       Only courses are touched.
    */

    mergeSupabaseCourses(
      data
    );


    /*
       Update only the public course UI where applicable.
    */

    renderSupabaseCourses(
      data
    );


    renderSupabaseCourseSelect(
      data
    );


    console.log(
      `Supabase connected successfully. ${data.length} active course(s) loaded.`
    );


    return true;

  } catch (error) {

    console.error(
      'Supabase connection failed:',
      error
    );


    return false;
  }
}


/* =========================================================
   PAGE INITIALISATION
   ========================================================= */

document.addEventListener(

  'DOMContentLoaded',

  () => {

    /*
       Existing behaviour
    */

    setActiveNav();


    /*
       Calling db() here repairs an earlier empty
       course array but preserves all other existing data.
    */

    db();


    /*
       Supabase course sync.

       Website keeps working from localStorage even if
       Supabase fails.
    */

    syncCoursesFromSupabase();

  }

);
