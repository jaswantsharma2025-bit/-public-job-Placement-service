// Create a production-ready frontend application for a startup called INSTAFF.

// INSTAFF is an on-demand workforce fulfillment platform that connects customers with verified workers.

// Think:

// Urban Company
// Apna
// WorkIndia
// Local staffing agency

// combined into one platform.

// TECH STACK

// Frontend:

// Next.js 15
// React 19
// TypeScript
// Tailwind CSS
// Shadcn UI
// React Query (TanStack Query)
// Axios
// React Hook Form
// Zod
// Sonner Toast
// Framer Motion
// Lucide Icons

// Folder:

// frontend/

// Structure:

// frontend/
// ├── app/
// ├── components/
// ├── features/
// ├── services/
// ├── hooks/
// ├── store/
// ├── types/
// ├── utils/
// ├── layouts/
// ├── public/

// Mobile-first.

// Fully responsive.

// Professional SaaS startup UI.

// No flashy colors.

// Clean.

// Modern.

// Minimal.

// Fast.

// IMPORTANT BACKEND ALIGNMENT

// The frontend MUST use the exact backend field names.

// Do NOT rename fields.

// Use exact API payload keys.

// Examples:

// User:

// name
// phone
// password
// role

// Roles:

// CUSTOMER
// WORKER
// ADMIN
// EMPLOYER

// Worker Skill Categories:

// MAID
// COOK
// DRIVER
// NURSE
// PLUMBER
// ELECTRICIAN

// Booking Status:

// PENDING
// ACCEPTED
// REJECTED
// IN_PROGRESS
// COMPLETED
// CANCELLED
// NO_SHOW

// Booking Type:

// INSTANT
// SCHEDULED

// Payment Status:

// PENDING
// PAID
// API BASE
// http://localhost:5000/api

// Create:

// services/api.ts

// Axios instance.

// JWT interceptor.

// Token storage.

// Auto logout on 401.

// AUTH MODULE

// Pages:

// /auth/login
// /auth/register

// Register form:

// name
// phone
// password
// role

// Role options:

// CUSTOMER
// WORKER

// Employer:

// Coming Soon Badge

// Admin:

// Hidden

// Login:

// phone
// password

// Store:

// token
// user
// role

// Show success/error toasts.

// LANDING PAGE

// Hero:

// Verified Workers in Minutes

// Search bar.

// Categories.

// CTA buttons.

// Popular services.

// Worker statistics.

// Customer testimonials.

// Footer.

// CUSTOMER PORTAL

// Route:

// /customer

// Dashboard cards:

// Total Bookings
// Active Bookings
// Completed Services
// Pending Payments
// CUSTOMER HOME

// Categories grid:

// Maid

// Cook

// Driver

// Nurse

// Plumber

// Electrician

// Use icons.

// Cards.

// Ratings.

// CATEGORY DISCOVERY

// Use backend:

// GET

// /api/workers

// Filters:

// skillCategory
// city
// isAvailable
// isVerified

// UI Filters:

// Available Only
// Verified Only
// City
// Category

// Worker cards:

// name
// rating
// experience
// city
// expectedSalary
// isVerified

// Buttons:

// View Profile
// Book Now
// WORKER DETAILS PAGE

// Route:

// /workers/[id]

// Fetch:

// GET /api/workers/:id

// Show:

// user.name
// phone
// skillCategory
// experience
// rating
// city
// state
// expectedSalary
// isVerified

// Reviews section.

// Book Now button.

// BOOKING FLOW

// Route:

// /booking/create

// Fields MUST match backend:

// workerId
// bookingType
// serviceCategory
// address
// city
// scheduledDate
// durationMinutes
// servicePrice
// notes

// Booking Type:

// INSTANT
// SCHEDULED

// Show booking summary.

// Create booking button.

// Toast success.

// Redirect to My Bookings.

// MY BOOKINGS PAGE

// Route:

// /customer/bookings

// Fetch:

// GET /api/bookings/my

// Cards.

// Status badges.

// Actions based on status.

// BOOKING ACTIONS

// PENDING

// Waiting for worker response

// ACCEPTED

// Buttons:

// Start Service
// Request Replacement
// Cancel

// IN_PROGRESS

// Button:

// Complete Service

// COMPLETED

// Buttons:

// Leave Review

// NO_SHOW

// Button:

// Request Replacement
// MAP TRACKING PAGE

// Design Uber-style tracking page.

// But backend not implemented.

// Show:

// Live Tracking
// Coming Soon

// Use beautiful map placeholder.

// PAYMENTS PAGE

// Backend exists partially.

// Real payments not implemented.

// Show:

// Cash On Delivery

// UPI

// Card

// Wallet

// All:

// Coming Soon

// Display toast:

// Online payments launching soon.
// COMPLAINTS PAGE

// Route:

// /customer/complaints

// Create complaint.

// Fields:

// bookingId
// againstUserId
// reason
// description

// My complaints.

// Status:

// OPEN
// RESOLVED
// REJECTED
// REVIEW PAGE

// Create Review:

// bookingId
// rating
// comment

// Fetch:

// GET /api/reviews/worker/:workerId

// Star ratings.

// CUSTOMER PROFILE

// Route:

// /customer/profile

// Fields:

// gender
// address
// city
// state
// latitude
// longitude

// Edit profile.

// Save.

// Toast success.

// WORKER PORTAL

// Route:

// /worker

// Dashboard:

// Cards:

// Today's Jobs
// Completed Jobs
// Rating
// Earnings
// WORKER PROFILE

// Fields:

// aadhaarNumber
// gender
// skillCategory
// experience
// expectedSalary
// city
// state
// latitude
// longitude

// Verification Status:

// Pending
// Verified
// Rejected

// Badge.

// WORKER AVAILABILITY

// Toggle:

// isAvailable

// Online

// Offline

// Patch:

// /api/worker/availability
// WORKER LOCATION

// Page:

// /worker/location

// Update:

// latitude
// longitude
// city
// state

// Map UI.

// Use browser geolocation.

// WORKER BOOKINGS

// Fetch:

// GET /api/bookings/worker/my

// Actions:

// Accept

// Reject

// Show status timeline.

// WORKER EARNINGS

// Fetch:

// GET /api/worker/earnings

// Show:

// totalBookings
// totalEarnings

// Chart.

// ADMIN PANEL

// Route:

// /admin

// Professional dashboard.

// Sidebar.

// Analytics.

// Tables.

// Search.

// Filters.

// ADMIN ANALYTICS

// Fetch:

// GET /api/admin/analytics

// Show:

// totalCustomers
// totalWorkers
// verifiedWorkers
// totalBookings
// completedBookings
// totalRevenue

// Charts.

// Cards.

// PENDING WORKERS

// Fetch:

// GET /api/admin/workers/pending

// Approve.

// Reject.

// Modal.

// Reason field.

// WORKER MANAGEMENT

// Suspend.

// Reactivate.

// Status badges.

// BOOKINGS MANAGEMENT

// Fetch:

// GET /api/admin/bookings

// Admin actions:

// Force Complete
// Force Cancel
// Reassign Worker
// REPLACEMENT MANAGEMENT

// Fetch:

// GET /api/admin/bookings/:id/replacement-candidates

// Choose worker.

// Assign.

// Toast.

// COMPLAINT MANAGEMENT

// Fetch:

// GET /api/complaints/admin

// Actions:

// Resolve.

// Reject.

// Admin Notes.

// EMPLOYER PANEL

// PHASE 1:

// NOT IMPLEMENTED.

// Create route:

// /employer

// Professional page.

// Large illustration.

// Text:

// Employer Portal

// Bulk Hiring
// Attendance
// Payroll
// Workforce Management

// Coming Soon in Phase 2

// No backend integration.

// AI FEATURES

// Create section.

// Everything disabled.

// Cards:

// AI Worker Matching
// AI Lead Bot
// AI WhatsApp Bot
// AI Call Bot
// AI Fraud Detection
// AI Retention Bot

// Badge:

// Coming Soon
// NOTIFICATION SYSTEM

// Install:

// sonner

// Create global toast provider.

// Show toast for:

// Login

// Register

// Booking Created

// Booking Accepted

// Booking Rejected

// Complaint Submitted

// Review Submitted

// Worker Approved

// Worker Suspended

// Replacement Requested

// Payment Coming Soon

// RESPONSIVENESS

// Must support:

// 320px
// 375px
// 768px
// 1024px
// 1440px

// Mobile first.

// Sidebar collapses.

// Bottom navigation for mobile.

// Desktop sidebar for large screens.

// DARK MODE

// Implement:

// Light
// Dark
// System

// Persist preference.

// DESIGN LANGUAGE

// Use:

// shadcn cards
// rounded-xl
// subtle shadows
// glassmorphism only in hero section
// professional startup feel
// no neon colors
// clean dashboards
// modern admin panel
// FINAL REQUIREMENT

// Generate every screen, route, component, modal, form, table, dashboard, API service, TypeScript types, hooks, loading states, empty states, error states and responsive layouts.

// Anything not available in backend must still have UI and clearly show:

// Coming Soon

// Never create APIs that do not exist.

// Frontend must be directly connectable to the provided backend with minimal modifications.