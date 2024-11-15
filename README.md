# Encryo: Securely Manage Your Project Secrets

## Introduction

As developers, we all face the struggle of managing environment variables (env vars) and API keys across multiple projects. Keeping track of them all becomes increasingly difficult as project numbers grow. Storing them directly in version control systems like GitHub is a security risk. **Encryo** solves this problem by providing a secure and collaborative platform to manage your project secrets.

---

## How Encryo Works

### 1. Login with GitHub
Sign up for Encryo using your GitHub account for secure authentication.

### 2. Manage Your Repositories
- View all your public GitHub repositories.
- Add specific repositories to your Encryo workspace for easier access.

### 3. Generate Encryption Keys
- Navigate to the **Settings** tab within a repository to generate a unique key pair for encryption.
- This key pair secures your project secrets.

### 4. Upload Config & Env Files
- Upload individual config or env files containing sensitive information.
- Paste the file contents directly or upload multiple files in bulk.
- Encryo encrypts the content of these files using the generated key pair for maximum security.

### 5. Download & Extract Files
- Download all encrypted files for a specific repository as a ZIP archive.
- Extract the ZIP archive in your desired project directory for easy access to your secrets.

### 6. Command-Line Interface (CLI)
Simplify workflows with the Encryo CLI:
- Download all encrypted files for a repository with a single command, streamlining your development process.

---

## Team Collaboration

Encryo facilitates secure collaboration on projects:

- **Grant Access:** Share Encryo access with other users who have logged in with GitHub.
- **Control Permissions:** Assign either read-only or read-write access to team members, ensuring granular control over secret management.

---

## Services and API Keys

Encryo extends beyond managing config and env files:

- **Service Integration:** Set up services you use (e.g., cloud providers, APIs) by providing their API keys.
- **Secure Storage:** Encryo securely stores all API keys in your database for safekeeping.
- **Sharing with Teammates:** Grant access to services and their API keys to team members, promoting efficient collaboration.

---

## Benefits of Encryo

1. **Enhanced Security:**
   - Encryo uses robust encryption to protect your project secrets, minimizing security risks associated with storing them in plain text.

2. **Improved Efficiency:**
   - Simplifies file management and retrieval, saving you time and effort.
   - The CLI streamlines workflows, further boosting your development efficiency.

3. **Team Collaboration:**
   - Enables secure collaboration on projects by allowing controlled access management for team members.

---

## Get Started with Encryo

1. Visit the Encryo website and sign up using your GitHub account.
2. Explore the features and familiarize yourself with the platform.
3. Start managing your project secrets by adding repositories, generating keys, and uploading files.

**Encryo empowers developers to streamline secret management, ensuring secure project development and collaboration.**
