# Al Murattil Quran Institute — standalone Vercel build

This is the full pre-Supabase version of the institute website. It is a static HTML/CSS/JavaScript project designed for deployment on Vercel while the real Supabase backend is being prepared.

## Public navigation
Home → Courses → Announcement → Log in → Register

There are no public Student, Teacher or Admin portal links. Everyone uses the same login page, and the workspace adapts to the account role after login.

## Deploy to Vercel
1. Put all files directly in the root of the GitHub repository.
2. Import the repository into Vercel.
3. Application Preset: Other.
4. Root Directory: ./
5. Build Command: leave blank.
6. Output Directory: leave blank.
7. Install Command: leave blank.
8. Environment Variables: none for this standalone build.
9. Deploy.

## Demo logins
- Admin: admin@almurattil.test / Admin123!
- Teacher: teacher@almurattil.test / Teacher123!
- Student: student@almurattil.test / Student123!

## Preserved demo functionality
- One shared login for all roles.
- Role-based workspace after login.
- Full student registration form.
- Application reference numbers.
- Admin approval/rejection workflow.
- Approved students receive a student account and enrollment.
- Student IDs are generated.
- Admin user creation/removal.
- Teacher recruitment test workflow and teacher-account creation.
- Admin course creation and activation/deactivation.
- Registration course dropdown reads active courses.
- Admin announcement creation/deletion.
- Student course and progress display.
- Teacher teaching and student views.
- Account active-status checking.

## Important limitation
The standalone version stores data in the current browser using localStorage. This is only for interface and workflow testing. Data is not shared between devices and is not secure for production use.

When Supabase is connected, the same pages and workflow can remain while the localStorage functions are replaced by Supabase Auth and database calls.
