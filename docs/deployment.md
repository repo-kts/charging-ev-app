# Deployment (CI/CD)

Two GitHub Actions workflows drive everything.

| Workflow | Trigger | Does |
|----------|---------|------|
| [`ci.yml`](../.github/workflows/ci.yml) | every PR + push to `main` | lint + typecheck (server, admin, client2). Gate only — **no deploy**. |
| [`deploy.yml`](../.github/workflows/deploy.yml) | push to `main` + manual `workflow_dispatch` | builds + ships frontends and the server. |

```
client2/dist ─┐
admin/dist   ─┤→ S3 → CloudFront        (static SPAs)
              │
server ───────┴─ EC2: git reset --hard <sha> + bun install
                      + prisma migrate deploy + systemctl restart trio-ev-charging-server
                      (bun, no Docker)

media → s3://<media bucket>             (runtime, server/src/lib/storage.ts — unchanged)
```

`deploy.yml` has two independent jobs:

- **frontends** — builds `client2/` + `admin/` with `VITE_API_URL` baked in, syncs each `dist/` to its S3 bucket (hashed assets `immutable`, `index.html` `no-cache`), then invalidates the matching CloudFront distribution (`/*`).
- **server-deploy** — SSHes to EC2 and runs: `git reset --hard <sha>` → `bun install` → `prisma generate` → `prisma migrate deploy` → `sudo systemctl restart trio-ev-charging-server`.

> The old `client/` workspace is **not** deployed — the public site is `client2/`.

## Required GitHub secrets

Settings → Secrets and variables → Actions.

### Frontends (S3 + CloudFront)

| Secret | What |
|--------|------|
| `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` | IAM user with `s3:*Object` + `s3:ListBucket` on both buckets and `cloudfront:CreateInvalidation` on both distributions |
| `AWS_REGION` | e.g. `ap-south-1` |
| `S3_CLIENT_BUCKET` | bucket for the **client2** public SPA |
| `S3_ADMIN_BUCKET` | bucket for the **admin** SPA |
| `CLOUDFRONT_CLIENT_ID` | CloudFront distribution ID in front of the client2 bucket |
| `CLOUDFRONT_ADMIN_ID` | CloudFront distribution ID in front of the admin bucket |
| `VITE_API_URL` | public URL of the server (e.g. `https://api.example.com`) — baked into both bundles |

### Server (EC2, systemd)

| Secret | What |
|--------|------|
| `EC2_HOST` | public DNS / IP of the EC2 box |
| `EC2_USER` | SSH user (e.g. `ubuntu`, `ec2-user`) — must own the cloned repo |
| `EC2_SSH_KEY` | private key (PEM) for that user |
| `EC2_APP_DIR` | absolute path of the cloned repo (optional; defaults to `$HOME/trio-ev-app`) |

No registry — the server runs straight from source via bun under the `trio-ev-charging-server` systemd unit.

## One-time S3 + CloudFront setup (per frontend)

1. Create a **private** S3 bucket (serve via CloudFront OAC, not public website hosting).
2. Create a CloudFront distribution with that bucket as origin (Origin Access Control).
3. **SPA routing**: add a custom error response — HTTP `403` and `404` → response page `/index.html`, response code `200`. Without this, deep links (e.g. `/inquiries/123`) 404.
4. Caching is handled by the workflow: `index.html` is uploaded `no-cache`; hashed assets are `immutable`; each deploy invalidates `/*`.

## One-time EC2 setup

Repo cloned + bun installed already. Remaining wiring (templates live in [`deploy/`](../deploy)):

1. **`server/.env`** (chmod 600, never committed) — see [`deploy/server.env.example`](../deploy/server.env.example). Point `DATABASE_URL` at local Postgres / RDS.
2. **systemd unit** — install [`deploy/trio-ev-charging-server.service`](../deploy/trio-ev-charging-server.service):
   ```bash
   sudo cp deploy/trio-ev-charging-server.service /etc/systemd/system/trio-ev-charging-server.service
   # replace __EC2_USER__ / paths to match the box
   sudo systemctl daemon-reload && sudo systemctl enable --now trio-ev-charging-server
   ```
3. **Passwordless restart** — the deploy SSHes as `EC2_USER` and runs `sudo systemctl restart trio-ev-charging-server`. Grant exactly that with [`deploy/sudoers-trio`](../deploy/sudoers-trio):
   ```bash
   sudo visudo -cf deploy/sudoers-trio && sudo cp deploy/sudoers-trio /etc/sudoers.d/trio
   sudo chmod 440 /etc/sudoers.d/trio
   ```
4. **TLS** in front of `:8001` (nginx/Caddy reverse proxy or an ALB) so `VITE_API_URL` can be `https://…`.

## Notes

- Deploy is `git reset --hard <sha>` — local edits on the box are wiped. Keep config only in `server/.env`, never in tracked files.
- **Rollback**: re-run `deploy.yml` via `workflow_dispatch` from an older commit/tag (the SSH step resets to that SHA), or on the box: `git reset --hard <old sha> && sudo systemctl restart trio-ev-charging-server`.
- `docker-compose.prod.yml` (all three services containerized on one box) remains as an alternative single-box deploy.
