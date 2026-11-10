---
title: "Busqueda"
platform: "Hack The Box"
difficulty: "Easy"
date: 2026-10-29
summary: "From a web foothold to svc, local Gitea/Docker enumeration, and confirmed root access through a privileged maintenance workflow."
tags: ["Linux", "Web Enumeration", "Gitea", "Docker", "Sudo", "Privilege Escalation"]
status: "Completed"
published: true
---

> **Completion:** This is a recap of my own guided learning session on the retired Hack The Box machine **Busqueda**. I reached a shell as `svc`, obtained the user flag, and later verified root execution with `uid=0(root)` and obtained the root flag. Flags and credentials are deliberately not published. Where the original command sequence was not retained, I label the commands below as examples rather than presenting them as a transcript.

## 01 / Overview

Busqueda was a Linux box that taught me how to move beyond the initial web foothold and investigate **what a low-privileged account is allowed to execute**, especially when administrative scripts interface with local Docker containers and Git services.

| Phase | Finding | Result |
| --- | --- | --- |
| Initial access | Web-focused investigation | Shell as `svc` confirmed |
| Local enumeration | `sudo -l` exposed a root-run Python maintenance script | Privileged attack surface identified |
| Service discovery | Gitea and MySQL containers | Local services and repository data examined |
| Privilege escalation | Maintenance-script workflow | Root execution confirmed (`uid=0(root)`) |

## 02 / Reconnaissance and initial foothold

I started from a web-oriented target and ultimately reached a shell running as **`svc`**. The exact HTTP request, payload and transition to that shell were not preserved in the notes available for this write-up, so I won't invent a working exploit chain.

A repeatable starting checklist for an authorized lab target is:

```bash
# Example enumeration commands; not a verbatim session log
nmap -sC -sV -oN busqueda-initial.nmap <TARGET_IP>
curl -I http://<TARGET_IP>/
```

Once on the machine, I confirmed my account and began looking for permissions and services that could change the attack path.

```bash
whoami
id
sudo -l
```

**Verified session outcome:** shell access as `svc` and retrieval of the user flag.

## 03 / The critical sudo permission

The most important local finding was this sudo rule:

```text
(root) /usr/bin/python3 /opt/scripts/system-checkup.py *
```

This is a powerful permission: the `svc` user could invoke a particular Python maintenance script **as root**, with arguments. It does **not** mean the user can execute arbitrary Python scripts with sudo; the allowed script and its supported operations still need to be examined.

The script offered these actions:

```text
docker-ps
docker-inspect
full-checkup
```

At this stage, the questions were: What does each operation call? What input does it trust? Does it interact with a writable working directory, a repository, or another controllable resource?

## 04 / Docker and local service discovery

Using the maintenance workflow, I found Docker containers for **Gitea** and **MySQL**. The observed local services included:

```text
gitea     127.0.0.1:3000, :222
mysql_db  127.0.0.1:3306, :33060
```

These details changed the investigation. A service bound to localhost may be unavailable from outside the target but accessible to local processes. Administrative scripts interacting with such services can expose additional configuration, secrets or execution paths.

During Git/Gitea investigation, I encountered repository credentials. **The credentials are intentionally redacted** here: publishing a working password adds no educational value.

### Lessons from this stage

- Don't assume localhost services are irrelevant to privilege escalation.
- Review what a privileged helper script actually does, not just its filename.
- Treat source repositories and deployment configuration as possible sources of sensitive information.
- Keep credential discoveries out of public write-ups unless safely sanitized.

## 05 / Privilege escalation

The escalation work focused on the root-run maintenance script and its `full-checkup` operation. The combination of **wildcard arguments**, **Docker/Gitea context**, and **privileged script execution** was the area to examine.

I am intentionally not claiming an exact payload or command-injection mechanism here, because the full terminal transcript is not available in the preserved notes. The important verified result is that **root execution succeeded**.

```text
uid=0(root)
```

The root flag was also retrieved in the session; its value is omitted.

### Verification matters

Seeing a promising `sudo -l` entry is not proof of compromise. I only mark Busqueda as **Completed** because the session included confirmation of root identity and retrieval of the root flag.

## 06 / Takeaways

Busqueda helped me connect several concepts in one practical exercise:

1. **Web access is only the beginning.** Once inside, local permissions often matter more than the initial vulnerability.
2. **Sudo rules require precise reading.** A script with root privileges and controllable inputs deserves careful inspection.
3. **Internal services expand the picture.** Docker containers and Gitea repositories can reveal how the host is administered.
4. **Document evidence, not assumptions.** Confirm the account and privileges at each stage.
5. **Redact sensitive artifacts.** A public portfolio should demonstrate methodology without exposing credentials or flags.

## 07 / What I'd add from a full session log

To make this a reproducible command-by-command walkthrough, I'd still want the original web exploitation request, the precise `full-checkup` execution path, and terminal screenshots. Until then, this page distinguishes **verified outcomes** from **reconstructed learning notes**.

**Scope:** Retired HTB training machine. Do not reuse these techniques against systems without authorization.
