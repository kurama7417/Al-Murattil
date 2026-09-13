# Al Murattil Quran Institute — standalone pre-Supabase build

This version is intentionally database-free. It is a static HTML/CSS/JS project that can be deployed directly to Vercel while the Supabase backend is being prepared.

## Deploy to Vercel
1. Unzip this folder.
2. Upload it to a GitHub repository OR import the folder/project into Vercel.
3. Framework preset: Other.
4. Build command: leave empty.
5. Output directory: leave empty / project root.
6. Deploy.

`vercel.json` enables clean URLs, so `/register` serves `register.html`, `/login` serves `login.html`, etc.

## Demo logins
- Admin: admin@almurattil.test / Admin123!
- Teacher: teacher@almurattil.test / Teacher123!
- Student: student@almurattil.test / Student123!

## What works before Supabase
- Public Home, Register, Log in, Announcements and Courses navigation.
- No public Student / Teacher / Admin portal links.
- One login page for all roles.
- Role-based workspace after login.
- Student registration and test payment reference entry.
- Admin application approval/rejection.
- Approval creates a student account and enrollment.
- Admin can create/remove users.
- Teacher interview test record can be approved into a teacher account.
- Admin can add/activate/deactivate courses.
- Registration dropdown uses current active courses.
- Admin can add/delete announcements.
- Student course/progress demo.
- Teacher course/student demo.

## Important limitation
Data is stored in the current browser's `localStorage`. It is not shared between devices/users and is not secure. This is ONLY for interface/workflow testing.

Once Supabase is ready, replace the functions in `assets/common.js` and the admin actions with Supabase Auth/database calls. The page design and workflow can remain largely unchanged.
