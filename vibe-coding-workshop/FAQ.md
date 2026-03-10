# FAQ - Frequently Asked Questions

## 🐛 Git Issues & Troubleshooting

### Q: How do I report a bug or issue?
**A:** Before creating an issue:
1. Check existing issues first
2. Search for similar problems
3. Include your Python version, OS, and error messages
4. Provide minimal reproducible example

### Q: My Python version is incompatible
**A:** The workshop requires Python 3.9+. Install using:
```bash
# Using pyenv (recommended)
pyenv install 3.9.16
pyenv global 3.9.16

# Using conda
conda create -n vibe-coding python=3.9
conda activate vibe-coding
```

### Q: Git permission denied errors
**A:** Check your SSH keys:
```bash
ssh -T git@github.com
# If fails, generate new SSH key:
ssh-keygen -t ed25519 -C "your-email@example.com"
```

## 🔄 Pull Requests (PRs)

### Q: How do I create a proper PR?
**A:** Follow these steps:
1. Fork the repository
2. Create your branch: `participant/[name]-[city]`
3. Make commits with proper format
4. Push to your fork
5. Open PR against main upstream
6. Fill PR template completely

### Q: What makes a good PR description?
**A:** Include:
- Clear title with [City] [Name] format
- What you accomplished
- Challenges faced and how you solved them
- What you learned
- Any remaining issues

### Q: PR review requirements?
**A:** Your PR must have:
- All 4 UCs completed
- Proper commit messages (4+ commits)
- All required output files
- Filled PR template
- No merge conflicts

## 🛠️ Common Troubleshooting

### Q: Module import errors
**A:** Check your Python path and virtual environment:
```bash
# Check current environment
which python
python -c "import sys; print(sys.path)"

# Install missing dependencies
pip install -r requirements.txt
```

### Q: CSV file not found errors
**A:** Verify data files exist:
```bash
ls -la data/city-test-files/
ls -la data/policy-documents/
ls -la data/budget/
```

### Q: Permission denied on files
**A:** Check file permissions:
```bash
chmod +x *.py
# On Windows, use:
icacls *.py /grant Users:F
```

### Q: Virtual environment issues
**A:** Recreate venv:
```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
# or
venv\Scripts\activate     # Windows
pip install -r requirements.txt
```

## 📊 Data File Issues

### Q: Test CSV files are empty/corrupted
**A:** Download fresh test files:
```bash
git checkout main -- data/city-test-files/
```

### Q: Policy documents not loading
**A:** Check encoding:
```python
# Try different encodings
with open('policy_hr_leave.txt', 'r', encoding='utf-8') as f:
    content = f.read()
```

## 🐍 Python-Specific Issues

### Q: Pandas/NumPy installation fails
**A:** Try different installation methods:
```bash
pip install pandas numpy
# or
conda install pandas numpy
# or
python -m pip install --upgrade pip setuptools wheel
```

### Q: Jupyter notebook issues
**A:** Install Jupyter:
```bash
pip install jupyter
jupyter notebook
```

## 🌐 Network & Git Issues

### Q: Git push fails with authentication error
**A:** Try HTTPS instead of SSH:
```bash
git remote set-url origin https://github.com/username/repo.git
```

### Q: Slow git operations
**A:** Configure git for better performance:
```bash
git config --global core.preloadindex true
git config --global core.fscache true
git config --global gc.auto 256
```

## 📝 Code Quality

### Q: How to format Python code?
**A:** Use black and flake8:
```bash
pip install black flake8
black *.py
flake8 *.py
```

### Q: Linter errors in PR
**A:** Fix common issues:
```bash
# Remove trailing whitespace
sed -i 's/[[:space:]]*$//' *.py

# Add newline at end of file
echo "" >> *.py
```

## 🚀 Performance Issues

### Q: Code runs too slow
**A:** Profile your code:
```python
import cProfile
cProfile.run('your_function()')
```

### Q: Memory errors with large datasets
**A:** Process data in chunks:
```python
chunksize = 1000
for chunk in pd.read_csv('large_file.csv', chunksize=chunksize):
    process(chunk)
```

## 📱 IDE & Editor Issues

### Q: VSCode not recognizing Python
**A:** Install Python extension and select interpreter:
1. Install Python extension
2. Ctrl+Shift+P → "Python: Select Interpreter"
3. Choose your virtual environment

### Q: PyCharm configuration issues
**A:** Configure project interpreter:
1. File → Settings → Project → Python Interpreter
2. Add your venv or system Python

## 🔧 Debug Tips

### Q: How to debug Python code effectively?
**A:** Use pdb:
```python
import pdb; pdb.set_trace()
# or use ipdb for better experience
pip install ipdb
import ipdb; ipdb.set_trace()
```

### Q: Logging for debugging
**A:** Add logging to your code:
```python
import logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)
logger.info("Debug message")
```

## 📞 Getting Help

### Q: Where to ask for help?
**A:** 
1. Check this FAQ first
2. Search existing GitHub issues
3. Create new issue with detailed information
4. Join workshop Discord/Slack if available

### Q: What information to include in help requests?
**A:** Always include:
- Python version (`python --version`)
- Operating system
- Full error message with traceback
- Steps to reproduce
- What you've already tried

---

**Still stuck?** Don't hesitate to ask for help! The learning process includes getting stuck and figuring things out. 🚀
