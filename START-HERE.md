# 🚀 START HERE - Bombovo Website Setup

## What Error Are You Getting?

Please identify which error you're seeing and follow the corresponding solution:

---

## ❌ Error Type 1: "command not found: npm"

**What it means:** Node.js is not installed

**Fix:**
1. Go to https://nodejs.org/
2. Download the LTS version (Long Term Support)
3. Install it
4. Restart your terminal
5. Try again

---

## ❌ Error Type 2: Errors during `npm install`

**Try these steps in order:**

### Step 1: Check Node.js version
```bash
node --version
```
Should show v18.17.0 or higher. If not, update Node.js.

### Step 2: Clean install
```bash
cd "/Users/matej/Desktop/Bombovo WEB/Bombovo-web-1.6"
rm -rf node_modules package-lock.json
npm install
```

### Step 3: If still fails, check internet connection
npm needs to download packages from the internet.

---

## ❌ Error Type 3: Errors during `npm run dev`

**What to check:**

### Check 1: Did npm install finish successfully?
If not, go back to Error Type 2.

### Check 2: Port 3000 in use?
```bash
# Use a different port
npm run dev -- -p 3001
```
Then go to http://localhost:3001

### Check 3: Clear Next.js cache
```bash
rm -rf .next
npm run dev
```

---

## ❌ Error Type 4: Browser shows error or blank page

### Fix 1: Open browser console
1. Open http://localhost:3000
2. Press F12 (or right-click → Inspect)
3. Click "Console" tab
4. Look for red error messages
5. Tell me what error you see

### Fix 2: Try the test page first
Go to: http://localhost:3000/test

If this works, the issue is with the homepage components.

### Fix 3: Hard refresh the browser
- Mac: `Cmd + Shift + R`
- Windows: `Ctrl + Shift + R`

---

## ✅ QUICK START (If no errors)

### Step 1: Open Terminal
```bash
cd "/Users/matej/Desktop/Bombovo WEB/Bombovo-web-1.6"
```

### Step 2: Install (first time only)
```bash
npm install
```
Wait 1-2 minutes for it to complete.

### Step 3: Start server
```bash
npm run dev
```

### Step 4: Open browser
Go to: **http://localhost:3000**

---

## 🧪 TESTING STEPS

Try these URLs in order:

1. **http://localhost:3000/test** 
   - Simple test page
   - If this works, Next.js is fine

2. **http://localhost:3000**
   - Full homepage
   - If this doesn't work but /test does, issue is with a component

3. **http://localhost:3000/letne-tabory**
   - Placeholder page
   - Should show "Pripravujeme"

---

## 🔍 DIAGNOSTIC COMMANDS

Run these and share the output if you need help:

```bash
# Check your setup
node --version
npm --version
pwd

# Check if files exist
ls -la

# Try to start and capture error
npm run dev 2>&1 | tee error-log.txt
```

---

## 📝 TELL ME SPECIFICALLY:

To help you better, please tell me:

1. **Which command failed?**
   - [ ] npm install
   - [ ] npm run dev
   - [ ] Browser loading page
   - [ ] Something else

2. **What is the EXACT error message?**
   Copy and paste it or take a screenshot

3. **What do you see in the browser?**
   - [ ] Blank white page
   - [ ] Error message (what does it say?)
   - [ ] Page partially loads
   - [ ] Nothing (page won't open)

4. **Can you access the test page?**
   Try: http://localhost:3000/test

---

## 🔧 MOST COMMON FIX

**90% of the time, this fixes it:**

```bash
# Stop the server (Ctrl+C if running)

# Clean everything
rm -rf node_modules package-lock.json .next

# Fresh install
npm install

# Start again
npm run dev
```

---

## 🆘 IF NOTHING WORKS

Try the simple version:

1. Rename `app/page.tsx` to `app/page-backup.tsx`
2. Rename `app/page-simple.txt` to `app/page.tsx`
3. Run `npm run dev`
4. Go to http://localhost:3000

If this works, we know the issue is with one of the components, and I can fix it.

---

## 📞 SHARE THIS INFO

If you still have issues, share:

```
1. Operating System: [Mac/Windows/Linux]
2. Node version: [result of: node --version]
3. Error message: [paste here]
4. What you tried: [which steps above]
5. Test page works? [yes/no - http://localhost:3000/test]
```

---

**Let me know what specific error you're seeing and I'll fix it immediately!** 🚀



