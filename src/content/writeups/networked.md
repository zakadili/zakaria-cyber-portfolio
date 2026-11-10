---
title: "Networked"
platform: "Hack The Box"
difficulty: "Easy"
date: 2026-11-10
summary: "A guided technical breakdown of web enumeration, upload validation, cron-based command injection, and Linux privilege escalation."
tags: ["PHP", "File Upload", "Cron", "Linux PrivEsc"]
status: "Guided"
published: true
---

> **Scope and accuracy:** This is a **guided learning write-up** of the retired Hack The Box machine Networked. During the exercise, a shell as `guly` and access to a privileged script were observed. I did **not independently verify a final root shell**. Commands below are illustrative checks unless explicitly described as observed. No flags or screenshots are invented.

## 01 / Objective and attack path

Networked brings together several common security failures: a web-facing file-upload feature, a scheduled task processing files, and a privileged local script. The useful learning objective is to trace how control of data at one trust boundary can become command execution at another.

| Stage | What to investigate | Evidence status |
| --- | --- | --- |
| Reconnaissance | Open ports, web routes and exposed source | Exact scan output not preserved |
| Initial access | How the upload feature validates files | Technique discussed; exact payload not preserved |
| Local pivot | Cleanup task processing filenames | Shell as `guly` observed in guided session |
| Privilege escalation | Permissions on a privileged script | Script access observed; root not independently confirmed |

## 02 / Reconnaissance and enumeration

Start with a deliberate scan, then examine the web service rather than guessing an exploit.

```bash
# Replace the placeholder with your assigned HTB lab IP
nmap -sC -sV -oN networked-initial.nmap <TARGET_IP>
curl -i http://<TARGET_IP>/
```

These are **suggested reproducible commands**, not an exact transcript of my session. Save the results, identify the web technology, and map the reachable paths. On an authorized training target, useful questions include:

- Are there upload, gallery, or image-viewing routes?
- Are application files or backups unintentionally accessible?
- Does the server check an upload's extension, content, or both?
- Where do uploaded files end up, and can the web server execute them?

**Missing from the original notes:** actual port numbers, discovered paths, screenshots and scan output. Those should be added only after reviewing the original session evidence.

## 03 / Upload validation: where the trust boundary breaks

A file upload is not safe merely because a filename looks like an image or the first bytes resemble an expected format. The server must enforce a consistent policy **and** store the result in a location where it cannot be interpreted as executable code.

A disciplined lab investigation checks four things:

1. **Acceptance:** What extensions, MIME types and file signatures does the application accept?
2. **Storage:** Does the server rename uploads, and is the destination predictable?
3. **Execution:** Are uploaded files served as inert downloads, or can a server-side interpreter process them?
4. **Permissions:** Which account owns the uploaded file and runs the web service?

For this guided exercise, upload handling was the entry point under study. I have not retained the exact request, filename or response that established code execution, so I am not presenting a fabricated working payload.

### Defensive takeaway

Validate decoded content using a trusted parser, generate new server-side filenames, store uploads outside executable web paths, and configure the server to treat uploads as data.

## 04 / Local enumeration after access

After gaining an authorized lab shell, confirm the account and enumerate the immediate environment before trying to escalate privileges.

```bash
whoami
id
pwd
hostname
ls -la
ps aux
ls -la /etc/cron*
cat /etc/crontab
sudo -l
```

The guided session reached the **`guly` account**. That observation matters: it is a specific foothold, **not** proof of root access.

For each scheduled task, record its execution account, frequency, script path, writable directories, and whether it processes filenames or other attacker-controlled data.

## 05 / Cron jobs and unsafe filename handling

A key lesson from Networked is the danger of combining scheduled scripts with untrusted filenames. A script may appear to perform ordinary cleanup, yet become vulnerable if it inserts filename text into a shell command without safe handling.

The chain to reason about is:

```text
Attacker-controlled file name
          |
          v
Scheduled cleanup reads file name
          |
          v
Unsafe shell interpolation
          |
          v
Commands may run with the cleanup job's privileges
```

When examining this behavior in a lab, distinguish between a **writable directory**, a **vulnerable command construction**, and **verified execution**. All three require evidence; the presence of a cron job alone does not establish exploitability.

### Defensive takeaway

Avoid invoking a shell to process filenames where possible. Use argument arrays, quote variables correctly, terminate option parsing, and treat filenames as arbitrary bytes rather than trusted command fragments.

## 06 / Privilege escalation and verification

The guided work also identified a **privileged sudo script**. That is a promising lead, but the important question is what the script actually allows a lower-privileged user to influence.

A repeatable review looks at:

- The exact `sudo -l` rule and permitted arguments.
- The script's ownership and write permissions.
- Any environment variables, configuration files or executable paths it trusts.
- Whether the script calls external tools without absolute paths.
- Whether the intended privilege boundary can actually be crossed.

```bash
sudo -l
id
stat /path/to/authorized-script
# Read the permitted script before making changes
```

**Verification standard:** after any escalation, run `id` and `whoami` and retain the output. Because that final evidence was not preserved here, I am **not claiming root compromise or a completed independent solve**.

## 07 / What I learned

The most useful lesson wasn't a single trick. It was how one weak assumption can compound with another: an upload accepted as data, a background task trusting filenames, and a privileged process trusting controllable input.

This machine also reinforced a habit I want to keep in every future write-up: **separate what I observed from what I inferred**, and don't claim an exploit succeeded unless the shell, permissions and output prove it.

## 08 / Evidence to add from the original lab

This write-up can become a full command-by-command walkthrough once the original terminal logs or screenshots are available:

- Nmap scan results and confirmed web routes.
- The upload request, response, and precise validation behavior.
- The cron script contents and relevant filesystem permissions.
- The exact transition to the `guly` shell.
- The privileged script and `sudo -l` output.
- Final identity verification, if root was actually obtained.

**Publication note:** Networked is retired; follow Hack The Box's current rules for publishing solutions. Never publish active-machine spoilers or exam content.
