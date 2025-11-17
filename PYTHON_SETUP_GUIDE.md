# 🐍 Python Setup Guide for SkillBridge

Complete guide to installing Python and all required packages for SkillBridge backend.

---

## 📋 Table of Contents

1. [Install Python](#step-1-install-python)
2. [Verify Python Installation](#step-2-verify-installation)
3. [Install pip (Package Manager)](#step-3-install-pip)
4. [Create Virtual Environment](#step-4-create-virtual-environment)
5. [Install All Packages](#step-5-install-all-packages)
6. [Package List & Purpose](#what-each-package-does)
7. [Troubleshooting](#troubleshooting)

---

## Step 1: Install Python

### Windows

1. **Download Python:**
   - Go to [python.org/downloads](https://www.python.org/downloads/)
   - Click "Download Python 3.x.x" (latest version)

2. **Run the Installer:**
   - Double-click the downloaded file
   - ⚠️ **IMPORTANT:** Check ✅ "Add Python to PATH"
   - Click "Install Now"
   - Wait for installation to complete
   - Click "Close"

3. **Verify Installation:**
   ```cmd
   python --version
   ```
   Should show: `Python 3.x.x`

### macOS

**Option 1: Using Homebrew (Recommended)**
```bash
# Install Homebrew if not installed
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Python
brew install python@3.10

# Verify
python3 --version
```

**Option 2: Download from Website**
1. Go to [python.org/downloads](https://www.python.org/downloads/)
2. Download macOS installer
3. Run the .pkg file
4. Follow installation steps

### Linux (Ubuntu/Debian)

```bash
# Update package list
sudo apt update

# Install Python 3 and pip
sudo apt install python3 python3-pip python3-venv

# Verify installation
python3 --version
pip3 --version
```

### Linux (CentOS/RHEL)

```bash
# Install Python 3
sudo yum install python3 python3-pip

# Verify installation
python3 --version
pip3 --version
```

---

## Step 2: Verify Installation

### Check Python Version

```bash
# Windows
python --version

# macOS/Linux
python3 --version
```

**Required:** Python 3.8 or higher

### Check pip Version

```bash
# Windows
pip --version

# macOS/Linux
pip3 --version
```

Should show pip version and Python version.

---

## Step 3: Install pip (Package Manager)

pip usually comes with Python, but if it's missing:

### Windows
```cmd
python -m ensurepip --upgrade
```

### macOS/Linux
```bash
python3 -m ensurepip --upgrade
```

### Upgrade pip to Latest Version

```bash
# Windows
python -m pip install --upgrade pip

# macOS/Linux
python3 -m pip install --upgrade pip
```

---

## Step 4: Create Virtual Environment

A virtual environment keeps SkillBridge packages separate from your system Python.

### Navigate to Project

```bash
cd SkillBridge/backend
```

### Create Virtual Environment

```bash
# Windows
python -m venv venv

# macOS/Linux
python3 -m venv venv
```

This creates a folder called `venv` with isolated Python packages.

### Activate Virtual Environment

```bash
# Windows (Command Prompt)
venv\Scripts\activate

# Windows (PowerShell)
venv\Scripts\Activate.ps1

# macOS/Linux
source venv/bin/activate
```

**You should see** `(venv)` at the start of your command line:
```
(venv) C:\SkillBridge\backend>
```

### Deactivate (When Done)

```bash
deactivate
```

---

## Step 5: Install All Packages

With virtual environment activated:

### Install from requirements.txt

```bash
pip install -r requirements.txt
```

This installs ALL required packages automatically.

### Install Packages Manually (Alternative)

If requirements.txt doesn't work, install each package:

```bash
# Core Framework
pip install Flask==3.0.0
pip install Flask-SQLAlchemy==3.1.1
pip install SQLAlchemy==2.0.23

# Authentication
pip install Flask-JWT-Extended==4.5.3
pip install Flask-Bcrypt==1.0.1

# Email
pip install Flask-Mail==0.9.1

# CORS (Cross-Origin Resource Sharing)
pip install Flask-CORS==4.0.0

# Environment Variables
pip install python-dotenv==1.0.0

# Date/Time Utilities
pip install python-dateutil==2.8.2

# HTTP Requests
pip install requests==2.31.0

# Email Validation
pip install email-validator==2.1.0

# Werkzeug (Flask dependency)
pip install Werkzeug==3.0.1
```

### Verify Installation

```bash
pip list
```

Should show all installed packages.

---

## 📦 What Each Package Does

### Core Packages

| Package | Version | Purpose |
|---------|---------|---------|
| **Flask** | 3.0.0 | Web framework - handles HTTP requests, routing |
| **Flask-SQLAlchemy** | 3.1.1 | Database integration - connects Flask with SQLAlchemy |
| **SQLAlchemy** | 2.0.23 | ORM - manages database operations without SQL |

### Authentication Packages

| Package | Version | Purpose |
|---------|---------|---------|
| **Flask-JWT-Extended** | 4.5.3 | JWT tokens - handles login sessions securely |
| **Flask-Bcrypt** | 1.0.1 | Password hashing - encrypts user passwords |

### Communication Packages

| Package | Version | Purpose |
|---------|---------|---------|
| **Flask-Mail** | 0.9.1 | Email sending - welcome emails, password reset, notifications |
| **Flask-CORS** | 4.0.0 | Cross-Origin - allows frontend to talk to backend |

### Utility Packages

| Package | Version | Purpose |
|---------|---------|---------|
| **python-dotenv** | 1.0.0 | Environment variables - loads .env configuration |
| **python-dateutil** | 2.8.2 | Date/time utilities - handles dates and timestamps |
| **requests** | 2.31.0 | HTTP requests - makes API calls to external services |
| **email-validator** | 2.1.0 | Email validation - checks if emails are valid |
| **Werkzeug** | 3.0.1 | WSGI utilities - Flask's core utility library |

---

## 🔍 Complete Package List

Here's everything that gets installed with `requirements.txt`:

```
Flask==3.0.0
Flask-SQLAlchemy==3.1.1
Flask-JWT-Extended==4.5.3
Flask-Mail==0.9.1
Flask-CORS==4.0.0
Flask-Bcrypt==1.0.1
SQLAlchemy==2.0.23
python-dotenv==1.0.0
python-dateutil==2.8.2
requests==2.31.0
email-validator==2.1.0
Werkzeug==3.0.1
```

---

## ✅ Verification Checklist

After installation, verify everything:

### 1. Check Python Version
```bash
python --version  # or python3 --version
```
✅ Should be 3.8 or higher

### 2. Check pip
```bash
pip --version  # or pip3 --version
```
✅ Should show pip version

### 3. Check Virtual Environment
```bash
# Should see (venv) in terminal
```
✅ Virtual environment activated

### 4. Check Installed Packages
```bash
pip list
```
✅ Should show all packages listed above

### 5. Test Import
```bash
python
>>> import flask
>>> import sqlalchemy
>>> import flask_jwt_extended
>>> exit()
```
✅ No errors means packages are working

---

## ❗ Troubleshooting

### Issue 1: "python: command not found"

**Windows:**
- Reinstall Python and check "Add Python to PATH"
- Or add manually: System Properties → Environment Variables → Path → Add Python folder

**macOS/Linux:**
- Use `python3` instead of `python`
- Or create alias: `alias python=python3`

### Issue 2: "pip: command not found"

```bash
# Windows
python -m pip --version

# macOS/Linux
python3 -m pip --version
```

If still not found:
```bash
python -m ensurepip --upgrade
```

### Issue 3: "Permission denied" (Linux/macOS)

**Don't use sudo!** Use virtual environment instead:
```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### Issue 4: "Cannot activate virtual environment" (Windows PowerShell)

Run PowerShell as Administrator:
```powershell
Set-ExecutionPolicy RemoteSigned
```

Then try activating again:
```powershell
venv\Scripts\Activate.ps1
```

### Issue 5: "Module not found after installation"

1. Make sure virtual environment is activated
2. Reinstall packages:
```bash
pip install --force-reinstall -r requirements.txt
```

### Issue 6: Package version conflicts

```bash
# Uninstall all packages
pip freeze | xargs pip uninstall -y

# Reinstall from requirements.txt
pip install -r requirements.txt
```

### Issue 7: "SSL Certificate Error"

```bash
pip install --trusted-host pypi.org --trusted-host files.pythonhosted.org -r requirements.txt
```

---

## 🔄 Update Packages

To update all packages to latest versions:

```bash
# Upgrade pip first
pip install --upgrade pip

# Upgrade all packages
pip install --upgrade -r requirements.txt
```

---

## 🗑️ Uninstall Packages

### Uninstall Single Package
```bash
pip uninstall flask
```

### Uninstall All Packages
```bash
pip freeze | xargs pip uninstall -y
```

### Delete Virtual Environment
```bash
# Windows
rmdir /s venv

# macOS/Linux
rm -rf venv
```

---

## 📝 requirements.txt File

If you need to create or update `requirements.txt`:

### Generate from Current Environment
```bash
pip freeze > requirements.txt
```

### What's in requirements.txt
```txt
Flask==3.0.0
Flask-SQLAlchemy==3.1.1
Flask-JWT-Extended==4.5.3
Flask-Mail==0.9.1
Flask-CORS==4.0.0
Flask-Bcrypt==1.0.1
SQLAlchemy==2.0.23
python-dotenv==1.0.0
python-dateutil==2.8.2
requests==2.31.0
email-validator==2.1.0
Werkzeug==3.0.1
```

---

## 🚀 Quick Reference

### Install Python
```bash
# Download from python.org
# Or use package manager (brew, apt)
```

### Create Virtual Environment
```bash
cd backend
python -m venv venv
```

### Activate Virtual Environment
```bash
# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate
```

### Install All Packages
```bash
pip install -r requirements.txt
```

### Verify Installation
```bash
pip list
```

---

## 💡 Best Practices

1. **Always use virtual environments** - Keeps projects isolated
2. **Activate venv before installing** - Ensures packages go in right place
3. **Keep requirements.txt updated** - Track all dependencies
4. **Use specific versions** - Prevents breaking changes
5. **Update pip regularly** - `pip install --upgrade pip`

---

## 🎯 Next Steps

After Python setup:

1. ✅ Python installed
2. ✅ Virtual environment created
3. ✅ Packages installed
4. ✅ Installation verified

**Now you can:**
- Run the backend: `python run.py`
- Continue with frontend setup
- Start developing!

---

## 🆘 Need More Help?

- **Full Setup Guide:** See PROJECT_SETUP_GUIDE.md
- **Quick Setup:** See QUICK_SETUP.md
- **Complete Installation:** See INSTALLATION_GUIDE.md
- **All Documentation:** See DOCUMENTATION_INDEX.md

---

## ✅ Final Checklist

- [ ] Python 3.8+ installed
- [ ] pip working
- [ ] Virtual environment created (`venv` folder exists)
- [ ] Virtual environment activated (see `(venv)` in terminal)
- [ ] All packages installed (`pip list` shows 12+ packages)
- [ ] No errors when importing packages
- [ ] Ready to run backend!

---

**Python Setup Complete! 🎉**

You're now ready to run the SkillBridge backend.

**Start the backend:**
```bash
cd backend
source venv/bin/activate  # or venv\Scripts\activate on Windows
python run.py
```

**Happy Coding! 🚀**
