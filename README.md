# NoteSession - Intelligent Note Organization

[![Project Status](https://img.shields.io/badge/status-active-brightgreen)](https://github.com/omarabdiwali/note-session)
[![Next.js](https://img.shields.io/badge/Next.js-16.x-black)](https://nextjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)](https://www.mongodb.com/cloud/atlas)

## Overview

NoteSession is a sophisticated note-taking application that leverages the Eisenhower Matrix for intelligent task prioritization. Built with modern web technologies, it offers a seamless experience for organizing and managing your notes across multiple quadrants.

#### The project is hosted at: https://note-session.vercel.app

### Key Features

#### **Eisenhower Matrix Organization**
* Four-quadrant system for task prioritization
* Dynamic categorization

#### **Rich Note Editing**
* Real-time Markdown editing with live preview
* Support for LaTeX mathematical expressions
* Code block syntax highlighting
* Keyboard shortcuts and auto-save functionality

#### **Cloud Synchronization**
* Secure Google OAuth authentication
* Real-time sync across devices
* Automatic data backup and versioning

#### **User Interface**
* Responsive design for various screen sizes
* Intuitive quadrant-based dashboard
* Visual indicators for note status and category

## Technical Specifications

### Technology Stack
* **Frontend Framework**: Next.js
* **Database**: MongoDB (Atlas)
* **Authentication**: NextAuth.js (Google OAuth)
* **Markdown Processing**: `react-markdown`, `remark-math`, `rehype-katex`
* **Styling**: Tailwind CSS with Heroicons
* **State Management**: React Hooks

### Getting Started

1. **Clone the Repository**
   ```bash
   git clone https://github.com/omarabdiwali/note-session.git
   ```
2. **Install Dependencies**
   ```bash
   npm install
   ```
3. **Configure Environment Variables**
   Create a `.env.local` file with the following:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   GOOGLE_CLIENT_ID=your_google_oauth_id
   GOOGLE_CLIENT_SECRET=your_google_oauth_secret
   SECRET=your_auth_secret
   ```
4. **Start Development Server**
   ```bash
   npm run dev
   ```

## Project Structure

The project follows a modular architecture with separate components for different features. The main components include:

* Quadrant-based dashboard
* Rich note editor with Markdown support
* Secure authentication system
