Deployment Notes — Hostinger (Shared Hosting)

Project root:
/home/u969744314/domains/jovoc.com/public_html/practice-english

⚙️ 1. Fix Vite Build Assets Path

After running a Vite/Laravel build, assets are placed under:
public/build/assets

But the app expects them under:
build/assets

So you need to create a symbolic link manually.

✅ Command:
> ln -s /home/u9xxx14/domains/jovoc.com/public_html/practice-english/public/build/assets /home/u969744314/domains/jovoc.com/public_html/practice-english/build/assets


🗂️ 2. Link Laravel Storage Folder

Laravel requires /public/storage to point to /storage/app/public.

✅ Command:
> ls -l /home/u9xxx14/domains/jovoc.com/public_html/practice-english/public

