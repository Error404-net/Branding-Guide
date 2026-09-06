# Error404 MOTD — Troubleshooting Guide

Common issues and solutions.

## MOTD Not Appearing

**Symptom:** Login shows no MOTD output

**Check 1: File exists and is executable**
```bash
ls -la /etc/update-motd.d/10-motd-error404      # Dynamic system
ls -la /etc/motd                                 # Static system
```

Should show `-rwxr-xr-x` permissions (755).

**Fix if needed:**
```bash
sudo chmod 755 /etc/update-motd.d/10-motd-error404
```

**Check 2: Test the script directly**
```bash
bash /etc/update-motd.d/10-motd-error404
```

If it produces output, MOTD installation is correct but may not be configured to display on login.

**Check 3: Verify PAM configuration (Ubuntu/Debian)**

Dynamic MOTD requires PAM module:
```bash
sudo grep "pam_motd" /etc/pam.d/login /etc/pam.d/sshd 2>/dev/null
```

If no output, PAM motd is not configured:
```bash
echo "session optional pam_motd.so motd=/run/motd.dynamic" | sudo tee -a /etc/pam.d/login
```

**Check 4: Other services**

On some systems, MOTD displays through:
- SSH: Check `/etc/pam.d/sshd`
- Login: Check `/etc/pam.d/login`
- SSH config: Check `PrintMotd` in `/etc/ssh/sshd_config` (should be `yes`)

---

## Colors Not Displaying

**Symptom:** MOTD shows all text as white or single color

**Check 1: Terminal supports 256 colors**
```bash
echo $TERM
```

Should output `xterm-256color`, `screen-256color`, or similar.

**Fix if needed:**
```bash
export TERM=xterm-256color
bash /etc/update-motd.d/10-motd-error404
```

**Check 2: SSH terminal forwarding**

When SSH'ing in, add `-o "SetEnv TERM=xterm-256color"`:
```bash
ssh -o "SetEnv TERM=xterm-256color" user@host
```

Or add to `~/.ssh/config`:
```
Host *
    SetEnv TERM=xterm-256color
```

**Check 3: Terminal emulator settings**

Ensure your terminal emulator (iTerm2, Terminal.app, PuTTY, etc.) is set to:
- Character encoding: UTF-8
- Colors: Support 256 colors
- TERM environment: Allow ANSI escape codes

---

## Logo Function Not Found

**Symptom:** MOTD runs but shows error like "logo_hex: command not found"

**Cause:** Typo in `ACTIVE_LOGO` variable

**Check:**
```bash
grep "ACTIVE_LOGO=" /etc/update-motd.d/10-motd-error404
```

**Valid values:**
- logo_bold
- logo_shield
- logo_matrix
- logo_compact
- logo_hex
- logo_bracket
- logo_pipeline
- logo_line
- logo_double
- logo_minimal

**Fix:** Edit and correct the spelling:
```bash
sudo nano /etc/update-motd.d/10-motd-error404
```

---

## Special Characters Display as ??

**Symptom:** Box-drawing characters show as `?` or garbled

**Cause 1: Terminal encoding not UTF-8**

Set encoding:
```bash
export LC_ALL=en_US.UTF-8
export LANG=en_US.UTF-8
```

Add to `~/.bashrc` or `~/.zshrc` to persist.

**Cause 2: SSH client not forwarding locale**

Add to SSH command or `~/.ssh/config`:
```
Host *
    SendEnv LANG LC_*
```

Ensure server has `AcceptEnv LANG LC_*` in `/etc/ssh/sshd_config`.

**Cause 3: Terminal font missing box-drawing glyphs**

Change to a font that includes Unicode box drawing:
- **Linux:** Courier New, DejaVu Sans Mono, Ubuntu Mono
- **macOS:** Menlo, Courier New
- **Windows:** Consolas, Courier New

---

## MOTD Stuck or Running Slowly

**Symptom:** MOTD takes 5+ seconds to appear or hangs

**Cause:** System information gathering (uptime, memory, etc.) timing out

**Workaround:**

Edit the script and comment out system info section:
```bash
sudo nano /etc/update-motd.d/10-motd-error404
```

Find function `show_system_info()` and comment it:
```bash
# show_system_info() {
#     ...
# }
```

Then comment the function call (look for `show_system_info`).

---

## Colors Incorrect or Wrong Palette

**Symptom:** Colors look wrong or don't match Error404 brand

**Check current color codes:**
```bash
grep "COLOR_" /etc/update-motd.d/10-motd-error404
```

**Expected values:**
```bash
COLOR_PRIMARY=51      # Cyan
COLOR_ACCENT=201      # Pink
COLOR_STATUS=48       # Mint green
COLOR_EMPHASIS=226    # Yellow
COLOR_TEXT=255        # White
```

**View full ANSI palette:**
```bash
for i in {0..255}; do printf "\033[38;5;${i}m%3d " $i; [ $((($i + 1) % 10)) -eq 0 ] && echo; done
```

**Fix:** Edit and correct the color codes:
```bash
sudo nano /etc/update-motd.d/10-motd-error404
```

Update the `COLOR_*` variables.

---

## Installation Fails

**Error: "MOTD source file not found"**

The MOTD file is missing. Reinstall:
```bash
cd ~/error404-motd
sudo ./install.sh
```

**Error: "Permission denied"**

Run with `sudo`:
```bash
sudo ./install.sh
```

**Error: "/etc/update-motd.d does not exist"**

Your system uses static MOTD. The installer should handle this automatically.

Manual install for static:
```bash
bash ~/error404-motd/motd/10-motd-error404-all-logos > /tmp/motd.tmp
sudo mv /tmp/motd.tmp /etc/motd
sudo chmod 644 /etc/motd
```

---

## Uninstall Issues

**MOTD not removing**

Manual removal:
```bash
sudo rm -f /etc/update-motd.d/10-motd-error404
sudo rm -f /etc/motd
sudo rm -f /etc/error404-motd.config
sudo rm -rf /usr/local/share/doc/error404-motd
```

**Backup restore failed**

Restore manually:
```bash
sudo mv /etc/motd.bak /etc/motd
```

---

## Getting Help

If your issue isn't listed:

1. Test the script directly:
   ```bash
   bash ~/error404-motd/motd/10-motd-error404-all-logos
   ```

2. Check for error messages:
   ```bash
   bash -x ~/error404-motd/motd/10-motd-error404-all-logos 2>&1 | head -20
   ```

3. Verify installation:
   ```bash
   ls -la /etc/update-motd.d/10-motd-error404
   cat /etc/update-motd.d/10-motd-error404 | head -40
   ```

4. Review logs:
   ```bash
   journalctl -u ssh -n 20  # For SSH login issues
   ```

---

**Error404 MOTD v1.0**
**!ignore → return "404: Message not found"**
