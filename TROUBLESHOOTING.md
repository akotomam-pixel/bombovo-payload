# Troubleshooting Guide

## Common Issues and Solutions

### Issue 1: "command not found: npm"

**Problem:** Node.js is not installed or not in your PATH

**Solution:**
1. Install Node.js from https://nodejs.org/
2. Download the LTS version (Long Term Support)
3. After installation, restart your terminal
4. Verify installation: `node --version` and `npm --version`

---

### Issue 2: npm install fails

**Problem:** Network issues or permission errors

**Solution:**
```bash
# Try clearing npm cache
npm cache clean --force

# Try install again
npm install

# If permission error on Mac/Linux
sudo npm install
```

---

### Issue 3: Port 3000 already in use

**Problem:** Another application is using port 3000

**Solution:**
```bash
# Use a different port
npm run dev -- -p 3001

# Or find and kill the process using port 3000
# On Mac/Linux:
lsof -ti:3000 | xargs kill -9

# On Windows:
netstat -ano | findstr :3000
taskkill /PID <PID_NUMBER> /F
```

---

### Issue 4: "Module not found" error

**Problem:** Dependencies not installed properly

**Solution:**
```bash
# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Or on Windows:
# rmdir /s node_modules
# del package-lock.json

# Reinstall
npm install
```

---

### Issue 5: Page shows blank or white screen

**Problem:** JavaScript error in browser

**Solution:**
1. Open browser DevTools (F12 or Right-click → Inspect)
2. Go to Console tab
3. Look for red error messages
4. Share the error message for specific help

---

### Issue 6: "Error: Cannot find module 'next'"

**Problem:** Next.js not installed

**Solution:**
```bash
npm install next@14.2.18 react@18.3.1 react-dom@18.3.1
```

---

### Issue 7: TypeScript errors

**Problem:** TypeScript compilation errors

**Solution:**
```bash
# Restart TypeScript server in VS Code
# Command Palette (Cmd+Shift+P / Ctrl+Shift+P)
# Type: "TypeScript: Restart TS Server"

# Or delete and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

### Issue 8: Tailwind styles not loading

**Problem:** Tailwind CSS not configured properly

**Solution:**
1. Make sure these files exist:
   - `tailwind.config.ts`
   - `postcss.config.js`
   - `app/globals.css`

2. Restart dev server:
```bash
# Stop server (Ctrl+C)
npm run dev
```

---

### Issue 9: Framer Motion animations not working

**Problem:** Framer Motion not installed

**Solution:**
```bash
npm install framer-motion@11.11.17
```

---

### Issue 10: "React is not defined"

**Problem:** Missing React import (though not needed in Next.js 13+)

**Solution:** This shouldn't happen in Next.js 14, but if it does:
- Restart the dev server
- Clear .next folder: `rm -rf .next`
- Restart: `npm run dev`

---

## Step-by-Step Clean Installation

If nothing works, try this complete reset:

```bash
# 1. Navigate to project
cd "/Users/matej/Desktop/Bombovo WEB/Bombovo-web-1.6"

# 2. Delete generated files
rm -rf node_modules
rm -rf .next
rm -f package-lock.json

# 3. Install dependencies
npm install

# 4. Start dev server
npm run dev
```

---

## Check Your Setup

Run these commands to verify your environment:

```bash
# Check Node.js version (should be 18.17+)
node --version

# Check npm version
npm --version

# Check if in correct directory
pwd

# List files to confirm project structure
ls -la
```

---

## Still Not Working?

### Copy this information and share it:

```bash
# Your environment info
node --version
npm --version
pwd

# Try to start and copy the FULL error message
npm run dev
```

Share:
1. The exact error message (screenshot or copy-paste)
2. What step you're at (install, dev, or browser)
3. Your operating system (Mac, Windows, Linux)

---

## Quick Health Check Script

Run this to see if everything is set up correctly:

```bash
cd "/Users/matej/Desktop/Bombovo WEB/Bombovo-web-1.6"
echo "Node version:" && node --version
echo "NPM version:" && npm --version
echo "Checking files..."
ls -1 | head -10
echo "Done! If you see version numbers above, Node.js is installed correctly."
```

---

## Browser-Specific Issues

### Chrome/Edge
- Hard refresh: `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows)
- Clear cache: DevTools → Network → Disable cache checkbox

### Firefox
- Hard refresh: `Cmd+Shift+R` (Mac) or `Ctrl+F5` (Windows)

### Safari
- Hard refresh: `Cmd+Option+R`
- Enable Developer Menu: Preferences → Advanced → Show Develop menu

---

## Next.js Specific Issues

### Clear Next.js cache
```bash
rm -rf .next
npm run dev
```

### Build to check for errors
```bash
npm run build
```
This will show any compilation errors more clearly.

---

## Need More Help?

1. Check the error in browser console (F12)
2. Check the terminal output for error messages
3. Share the specific error message
4. Include what command you ran and what happened

**Most common fix:** Delete `node_modules`, run `npm install`, then `npm run dev`



