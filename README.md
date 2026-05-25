# k-clique-app

This repository contains a small web app (frontend + backend) used for the k-clique assignment.

Purpose of this cleanup: prepare the project directory for uploading to GitHub for instructor review while keeping large/local-only data out of the repo.

Checklist performed by the provided scripts:
- Move large data files from `backend/` into `backend/local_data/` (these files are ignored by git)
- Leave small placeholder files so the code doesn't fail when files are referenced
- Add a script to restore the moved files locally

Quick steps to prepare for GitHub (PowerShell)

Run the preparation script (creates `backend/local_data/` and moves large files there):

```powershell
Set-Location "C:\Users\harry\PycharmProjects\k-clique-app"
.\scripts\prepare_for_github.ps1
```

Confirm the repo is clean and then create a git repo and push:

```powershell
git init
git add .
git commit -m "Prepare project for instructor review: remove large local data and add cleanup scripts"
# create remote repo on GitHub, then:
git remote add origin <your-repo-url>
git push -u origin main
```

How to run locally (after cloning)
- Install dependencies (Python 3.10+ recommended):

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt  # or use your usual install method
```

- Start backend (example):

```powershell
Set-Location backend
python app.py
```

- Start frontend (in a second terminal):

```powershell
Set-Location frontend
npm install
npm run dev
```

- Optional backend test check:

```powershell
Set-Location .
python -m unittest discover -s tests -q
```

Notes
- The script moves only files above a size threshold into `backend/local_data/`. If you want to keep some files in repo, move them back before committing.
- If your solver binary is local and not allowed to be committed, put it in `backend/local_data/` and update your local config to point to that path.
- Sample graph inputs are organized in `backend/graphs/`.

