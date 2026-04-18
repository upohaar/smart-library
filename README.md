# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)


এই Digital Library প্রজেক্টে যা যা আছে:

বইয়ের সিস্টেম

গুগল বুকস API দিয়ে লক্ষ লক্ষ বই সার্চ করা যায়
বইয়ের বিস্তারিত পেজ — কভার, লেখক, রেটিং, বিবরণ
"Load More" দিয়ে আরো বই লোড করা যায়
ইউজার অ্যাকাউন্ট

লগইন / লগআউট (যেকোনো নাম-পাসওয়ার্ড দিলেই চলে)
লগইন না করলে Favorites/Borrowed পেজে যেতে দেয় না
ফেভারিট সিস্টেম

যেকোনো বইতে হার্ট বাটন দিয়ে ফেভারিট করা যায়
আলাদা Favorites পেজে সব দেখা যায়
বই ধার নেওয়া (Borrow)

বই ধার নেওয়া যায়, ১৪ দিনের ডেডলাইন সেট হয়
Overdue হলে আলাদা ব্যাজ দেখায়
Borrowed পেজে সব ধার করা বই দেখায়
রেকমেন্ডেশন সিস্টেম

ফেভারিট বইয়ের ক্যাটাগরি দেখে রেকমেন্ড করে
ফেভারিট না থাকলে র‍্যান্ডম ক্যাটাগরি দেখায়
স্মুথ fade-in অ্যানিমেশন সহ লোড হয়
ক্যাটাগরি ফিল্টার

Fiction, Science, History, Technology ইত্যাদি বাটনে ক্লিক করলে সরাসরি সার্চ হয়
গেমিফিকেশন (পয়েন্ট ও ব্যাজ)

ফেভারিট করলে +১০, ধার নিলে +১৫, ফেরত দিলে +৫ পয়েন্ট
পয়েন্ট বাড়লে ব্যাজ আপগ্রেড হয়: 📚 Bookworm → 🔍 Explorer → 📖 Reader → 🎓 Scholar → 🏆 Librarian
ড্যাশবোর্ড

মোট পয়েন্ট, ব্যাজ, পড়ার স্ট্যাটস একসাথে দেখায়
ডার্ক মোড

Light/Dark থিম টগল করা যায়, পছন্দ সেভ থাকে
লোকাল স্টোরেজ

সব ডেটা ব্রাউজারে সেভ থাকে, পেজ রিফ্রেশ করলেও হারায় না
এরর হ্যান্ডলিং

API এরর হলে অটো ৩ বার রিট্রাই করে
তারপরেও না হলে Retry বাটন দেখায়





Frontend Framework

React.js — পুরো UI বানাতে ব্যবহার করেছি
Routing

React Router DOM — পেজ নেভিগেশনের জন্য (Home, Login, Favorites, Borrowed, Dashboard)
Styling

Tailwind CSS — সব ডিজাইন ও responsive layout এর জন্য
Dark Mode — Tailwind এর class-based dark mode
State Management

React Context API — global state (user, favorites, borrowed, theme, points) manage করতে
Custom Hooks

useGoogleBooks — API call ও caching
useDebounce — search input delay
useLocalStorage — browser storage
External API

Google Books API — বইয়ের ডেটা, কভার, রেটিং আনতে
Data Persistence

localStorage — user data browser এ save রাখতে (login, favorites, borrowed, points)
Performance Optimization

Debouncing — বারবার API call কমাতে
In-memory Caching — একই query বারবার API hit না করতে
useMemo / useCallback — unnecessary re-render কমাতে
Gamification

নিজে বানানো points ও badge system (বই favor করলে/ধার নিলে পয়েন্ট)
Build Tool

Create React App (CRA) — project setup ও build এর জন্য