const STORAGE_KEYS = {
  users: "almurattil_users",
  courses: "almurattil_courses",
  announcements: "almurattil_announcements",
  applications: "almurattil_applications",
  session: "almurattil_session"
};

function seedDemoData() {
  if (!localStorage.getItem(STORAGE_KEYS.users)) {
    const users = [
      {
        id: "ADM001",
        name: "Demo Administrator",
        email: "admin@almurattil.test",
        password: "Admin123!",
        role: "admin"
      },
      {
        id: "TCH001",
        name: "Demo Teacher",
        email: "teacher@almurattil.test",
        password: "Teacher123!",
        role: "teacher"
      },
      {
        id: "STD001",
        name: "Demo Student",
        email: "student@almurattil.test",
        password: "Student123!",
        role: "student"
      }
    ];

    localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(users));
  }

  if (!localStorage.getItem(STORAGE_KEYS.courses)) {
    const courses = [
      {
        id: "TQ101",
        name: "Tajweed Level 1",
        description:
          "An introductory course covering the foundations of correct Quran recitation and essential Tajweed rules.",
        duration: "12 weeks",
        schedule: "Tuesday & Thursday",
        fee: "MVR 1,250",
        active: true
      },
      {
        id: "TQ201",
        name: "Tajweed Level 2",
        description:
          "A continuation course for students who have completed the basic Tajweed level and wish to strengthen recitation.",
        duration: "12 weeks",
        schedule: "Saturday & Monday",
        fee: "MVR 1,450",
        active: true
      },
      {
        id: "NQ101",
        name: "Noorani Qaida",
        description:
          "A foundational Quran reading program focusing on Arabic letters, pronunciation and confident reading.",
        duration: "10 weeks",
        schedule: "Sunday & Wednesday",
        fee: "MVR 950",
        active: true
      },
      {
        id: "HF101",
        name: "Hifz (Memorisation) Program",
        description:
          "Structured memorisation support with regular revision and teacher guidance.",
        duration: "Ongoing",
        schedule: "Flexible",
        fee: "MVR 1,500",
        active: true
      }
    ];

    localStorage.setItem(STORAGE_KEYS.courses, JSON.stringify(courses));
  }

  if (!localStorage.getItem(STORAGE_KEYS.announcements)) {
    const announcements = [
      {
        id: "ANN001",
        title: "October 2026 Intake",
        date: "13 September 2026",
        body:
          "Registration is now open for selected Quran learning programs. Students may review course details before submitting a registration."
      },
      {
        id: "ANN002",
        title: "Online Learning Portal",
        date: "10 September 2026",
        body:
          "The institute is developing a new digital learning portal for students and teachers."
      }
    ];

    localStorage.setItem(
      STORAGE_KEYS.announcements,
      JSON.stringify(announcements)
    );
  }

  if (!localStorage.getItem(STORAGE_KEYS.applications)) {
    localStorage.setItem(STORAGE_KEYS.applications, JSON.stringify([]));
  }
}

function getData(key) {
  return JSON.parse(localStorage.getItem(key) || "[]");
}

function setData(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function getCurrentUser() {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.session) || "null");
}

function logout() {
  localStorage.removeItem(STORAGE_KEYS.session);
  window.location.href = "/login";
}

function toggleMenu() {
  document.querySelector(".main-nav")?.classList.toggle("open");
}

function renderCourses(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const courses = getData(STORAGE_KEYS.courses).filter(course => course.active);

  if (!courses.length) {
    container.innerHTML =
      '<div class="empty-state">There are currently no active courses.</div>';
    return;
  }

  container.innerHTML = courses
    .map(
      course => `
        <article class="course-card">
          <span class="badge">${course.id}</span>
          <h2>${course.name}</h2>
          <p>${course.description}</p>

          <div class="course-meta">
            <span class="badge">${course.duration}</span>
            <span class="badge">${course.schedule}</span>
            <span class="badge">${course.fee}</span>
          </div>

          <a class="button" href="/register?course=${encodeURIComponent(
            course.id
          )}">
            Register
          </a>
        </article>
      `
    )
    .join("");
}

function renderAnnouncements(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const announcements = getData(STORAGE_KEYS.announcements);

  if (!announcements.length) {
    container.innerHTML =
      '<div class="empty-state">There are currently no announcements.</div>';
    return;
  }

  container.innerHTML = announcements
    .map(
      item => `
        <article class="announcement-card">
          <span class="badge">${item.date}</span>
          <h2>${item.title}</h2>
          <p>${item.body}</p>
        </article>
      `
    )
    .join("");
}

function populateCourseSelect() {
  const select = document.getElementById("course");
  if (!select) return;

  const courses = getData(STORAGE_KEYS.courses).filter(course => course.active);

  select.innerHTML =
    '<option value="">Select a course</option>' +
    courses
      .map(
        course =>
          `<option value="${course.id}">${course.name} (${course.id})</option>`
      )
      .join("");

  const params = new URLSearchParams(window.location.search);
  const selectedCourse = params.get("course");

  if (selectedCourse) {
    select.value = selectedCourse;
  }
}

function submitRegistration(event) {
  event.preventDefault();

  const form = event.target;
  const message = document.getElementById("registrationMessage");

  const application = {
    id: "APP" + Date.now(),
    fullName: form.fullName.value.trim(),
    email: form.email.value.trim(),
    phone: form.phone.value.trim(),
    course: form.course.value,
    paymentMethod: form.paymentMethod.value,
    paymentReference: form.paymentReference.value.trim(),
    status: "pending",
    submittedAt: new Date().toISOString()
  };

  const applications = getData(STORAGE_KEYS.applications);
  applications.push(application);
  setData(STORAGE_KEYS.applications, applications);

  message.className = "form-message success";
  message.textContent =
    "Registration submitted successfully. Your application is now pending review.";

  form.reset();
}

function loginUser(event) {
  event.preventDefault();

  const email = document.getElementById("email").value.trim().toLowerCase();
  const password = document.getElementById("password").value;
  const message = document.getElementById("loginMessage");

  const users = getData(STORAGE_KEYS.users);

  const user = users.find(
    item =>
      item.email.toLowerCase() === email && item.password === password
  );

  if (!user) {
    message.className = "form-message error";
    message.textContent = "Incorrect email or password.";
    return;
  }

  localStorage.setItem(
    STORAGE_KEYS.session,
    JSON.stringify({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    })
  );

  window.location.href = "/workspace";
}

function renderWorkspace() {
  const user = getCurrentUser();

  if (!user) {
    window.location.href = "/login";
    return;
  }

  document.getElementById("workspaceUserName").textContent = user.name;
  document.getElementById("workspaceRole").textContent =
    user.role.charAt(0).toUpperCase() + user.role.slice(1);

  const content = document.getElementById("workspaceContent");

  if (user.role === "student") {
    content.innerHTML = `
      <section class="workspace-grid">
        <div class="workspace-card">
          <h3>My Courses</h3>
          <p>Your approved courses and learning materials will appear here.</p>
        </div>

        <div class="workspace-card">
          <h3>My Progress</h3>
          <p>Lesson completion, attendance and progress information will appear here.</p>
        </div>

        <div class="workspace-card">
          <h3>Assignments</h3>
          <p>Your course assignments and submissions will appear here.</p>
        </div>

        <div class="workspace-card">
          <h3>Announcements</h3>
          <p>Important messages from your teachers and the institute will appear here.</p>
        </div>
      </section>
    `;
  }

  if (user.role === "teacher") {
    content.innerHTML = `
      <section class="workspace-grid">
        <div class="workspace-card">
          <h3>My Classes</h3>
          <p>Your assigned courses and class schedules will appear here.</p>
        </div>

        <div class="workspace-card">
          <h3>Students</h3>
          <p>View students enrolled in your assigned courses.</p>
        </div>

        <div class="workspace-card">
          <h3>Learning Materials</h3>
          <p>Upload lessons, documents and course materials here.</p>
        </div>

        <div class="workspace-card">
          <h3>Grades & Progress</h3>
          <p>Record student performance and course progress here.</p>
        </div>
      </section>
    `;
  }

  if (user.role === "admin") {
    renderAdminWorkspace();
  }
}

function renderAdminWorkspace() {
  const applications = getData(STORAGE_KEYS.applications);

  const applicationHtml = applications.length
    ? applications
        .map(
          app => `
          <li>
            <strong>${app.fullName}</strong><br>
            ${app.email}<br>
            Course: ${app.course}<br>
            Status: ${app.status}

            ${
              app.status === "pending"
                ? `
              <div style="margin-top:10px">
                <button onclick="approveApplication('${app.id}')">Approve</button>
                <button class="button danger" onclick="rejectApplication('${app.id}')">Reject</button>
              </div>
            `
                : ""
            }
          </li>
        `
        )
        .join("")
    : "<li>No registrations yet.</li>";

  document.getElementById("workspaceContent").innerHTML = `
    <section class="workspace-grid">

      <div class="workspace-card">
        <h3>Student Registrations</h3>
        <ul class="data-list">
          ${applicationHtml}
        </ul>
      </div>

      <div class="workspace-card">
        <h3>User Management</h3>
        <p>Create and manage student, teacher and administrator accounts.</p>
      </div>

      <div class="workspace-card">
        <h3>Course Management</h3>
        <p>Create courses, change schedules and manage enrollment.</p>
      </div>

      <div class="workspace-card">
        <h3>Announcements</h3>
        <p>Create and publish institute announcements.</p>
      </div>

    </section>
  `;
}

function approveApplication(id) {
  const applications = getData(STORAGE_KEYS.applications);

  const application = applications.find(item => item.id === id);
  if (!application) return;

  application.status = "approved";

  const users = getData(STORAGE_KEYS.users);

  const alreadyExists = users.some(
    user => user.email.toLowerCase() === application.email.toLowerCase()
  );

  if (!alreadyExists) {
    users.push({
      id: "STD" + Date.now(),
      name: application.fullName,
      email: application.email,
      password: "Student123!",
      role: "student"
    });

    setData(STORAGE_KEYS.users, users);
  }

  setData(STORAGE_KEYS.applications, applications);
  renderAdminWorkspace();

  alert(
    "Student approved. Demo password: Student123!"
  );
}

function rejectApplication(id) {
  const applications = getData(STORAGE_KEYS.applications);

  const application = applications.find(item => item.id === id);
  if (!application) return;

  application.status = "rejected";

  setData(STORAGE_KEYS.applications, applications);
  renderAdminWorkspace();
}

seedDemoData();
