#!/bin/bash
#
# Error404 MOTD Uninstallation Script
# Removes Error404 MOTD from the system
#
# Usage: sudo ./uninstall.sh
#

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Check if running as root
if [[ $EUID -ne 0 ]]; then
    echo -e "${RED}Error: This script must be run as root${NC}"
    exit 1
fi

echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}  Error404 MOTD Uninstallation${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo ""

# Remove dynamic MOTD
if [[ -f /etc/update-motd.d/10-motd-error404 ]]; then
    rm -f /etc/update-motd.d/10-motd-error404
    echo -e "${GREEN}✓ Removed /etc/update-motd.d/10-motd-error404${NC}"
fi

# Restore or remove static MOTD
if [[ -f /etc/motd.bak ]]; then
    mv /etc/motd.bak /etc/motd
    echo -e "${GREEN}✓ Restored original MOTD from backup${NC}"
elif [[ -f /etc/motd ]]; then
    # Check if current motd is Error404 (contains our signature)
    if grep -q "Error404\|!ignore" /etc/motd 2>/dev/null; then
        rm -f /etc/motd
        echo -e "${GREEN}✓ Removed /etc/motd${NC}"
    fi
fi

# Remove configuration
if [[ -f /etc/error404-motd.config ]]; then
    rm -f /etc/error404-motd.config
    echo -e "${GREEN}✓ Removed /etc/error404-motd.config${NC}"
fi

# Remove documentation
if [[ -d /usr/local/share/doc/error404-motd ]]; then
    rm -rf /usr/local/share/doc/error404-motd
    echo -e "${GREEN}✓ Removed documentation${NC}"
fi

echo ""
echo -e "${GREEN}════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}  Uninstallation Complete!${NC}"
echo -e "${GREEN}════════════════════════════════════════════════════════════${NC}"
echo ""
