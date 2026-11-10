---
title: "Networked"
platform: "Hack The Box"
difficulty: "Easy"
date: 2026-11-10
summary: "Lessons from file upload validation, cron jobs, and Linux privilege escalation."
tags: ["PHP", "File Upload", "Cron", "Linux PrivEsc"]
status: "Guided"
published: true
---
> **Learning disclosure:** This is a guided recap, not an independent solve. A shell as `guly` and a privileged sudo script were observed; final root access was not independently verified.

## Overview
Networked is a retired Hack The Box Linux machine. It illustrates unsafe upload handling, a scheduled cleanup task and privileged configuration scripts.

## Enumeration
Document discovered endpoints and server behavior before attempting exploitation.

## Upload validation
Filename and superficial content checks are not sufficient when uploaded content can be interpreted as executable code.

## Scheduled tasks
Investigate cron jobs that process attacker-controlled filenames. Unsafely interpolated shell input can lead to command injection.

## Privilege escalation
Verify each identity and permission change rather than assuming it worked.

```bash
whoami
id
sudo -l
ps aux
ls -la /etc/cron*
```

## Reflection
This machine required substantial assistance. The key lessons were systematic enumeration, understanding shell syntax, and verifying each step.

**Disclosure:** Only publish write-ups allowed by the lab platform. Never publish active-machine spoilers or exam content.