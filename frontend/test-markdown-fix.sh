#!/bin/bash

# Test Markdown Fix - Validation Script
# Run this to verify the fix is working

echo "================================================"
echo "🔍 MARKDOWN FIX VALIDATION SCRIPT"
echo "================================================"
echo ""

# Test 1: Check plugin installation
echo "✅ Test 1: Verify @tailwindcss/typography is installed"
if grep -q "@tailwindcss/typography" package.json; then
    echo "   ✓ Found in package.json"
else
    echo "   ✗ NOT found in package.json"
    echo "   → Run: npm install -D @tailwindcss/typography"
fi

if grep -q "@tailwindcss/typography" tailwind.config.js; then
    echo "   ✓ Found in tailwind.config.js"
else
    echo "   ✗ NOT found in tailwind.config.js"
    echo "   → Add to plugins: [require('@tailwindcss/typography')]"
fi

echo ""

# Test 2: Check FormattedSummary exists
echo "✅ Test 2: Verify FormattedSummary component exists"
if [ -f "components/FormattedSummary.tsx" ]; then
    echo "   ✓ components/FormattedSummary.tsx exists"

    if grep -q "prose prose-slate" components/FormattedSummary.tsx; then
        echo "   ✓ Using prose classes"
    else
        echo "   ⚠ Not using prose classes (might be using custom CSS)"
    fi
else
    echo "   ✗ components/FormattedSummary.tsx NOT found"
fi

echo ""

# Test 3: Check if alternative solutions exist
echo "✅ Test 3: Check alternative implementations"
if [ -f "components/FormattedSummaryCustomCSS.tsx" ]; then
    echo "   ℹ Alternative CSS implementation available"
    echo "   → To use: mv FormattedSummary.tsx FormattedSummaryWithPlugin.tsx"
    echo "   → Then: mv FormattedSummaryCustomCSS.tsx FormattedSummary.tsx"
fi

if [ -f "components/DiagnosticMarkdown.tsx" ]; then
    echo "   ℹ Diagnostic component available"
    echo "   → Import in page.tsx to test rendering"
fi

echo ""

# Test 4: Check dev server
echo "✅ Test 4: Dev server status"
if lsof -i :3000 > /dev/null 2>&1; then
    echo "   ✓ Dev server is running on port 3000"
    echo "   ℹ IMPORTANT: If you just installed the plugin, RESTART dev server:"
    echo "   → Ctrl+C to stop"
    echo "   → npm run dev to start"
else
    echo "   ⚠ Dev server NOT running"
    echo "   → Run: npm run dev"
fi

echo ""

# Test 5: Check backend
echo "✅ Test 5: Backend status"
if lsof -i :8000 > /dev/null 2>&1; then
    echo "   ✓ Backend is running on port 8000"
else
    echo "   ⚠ Backend NOT running"
    echo "   → Run: cd ../backend && uvicorn main:app --reload"
fi

echo ""
echo "================================================"
echo "🎯 NEXT STEPS"
echo "================================================"
echo ""
echo "1. Restart dev server (if not done yet):"
echo "   Ctrl+C → npm run dev"
echo ""
echo "2. Open browser:"
echo "   http://localhost:3000"
echo ""
echo "3. Generate a summary and check:"
echo "   - Headers should be BLUE and LARGE (not gray)"
echo "   - Lists should have BLUE ▸ bullets"
echo "   - Proper spacing between sections"
echo ""
echo "4. Inspect element (F12):"
echo "   - Right-click on a header"
echo "   - Select 'Inspect'"
echo "   - Check Computed styles:"
echo "     • color should be blue (not gray)"
echo "     • font-size should be 1.5rem or larger"
echo "     • border-bottom should exist"
echo ""
echo "5. If still not working:"
echo "   - Read MARKDOWN_FIX.md for detailed troubleshooting"
echo "   - Check console for errors (F12 → Console tab)"
echo ""
echo "================================================"
