#!/bin/bash
#
# Error404 MOTD Installation Script
# Installs and configures Error404 branded MOTD on Linux systems
# 
# Usage: sudo ./install.sh
#

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Detect OS
detect_os() {
    if [[ -f /etc/os-release ]]; then
        . /etc/os-release
        echo "$ID"
    elif [[ -f /etc/lsb-release ]]; then
        . /etc/lsb-release
        echo "$DISTRIB_ID" | tr '[:upper:]' '[:lower:]'
    else
        echo "unknown"
    fi
}

# Check if running as root
if [[ $EUID -ne 0 ]]; then
    echo -e "${RED}Error: This script must be run as root${NC}"
    echo "Usage: sudo ./install.sh"
    exit 1
fi

OS=$(detect_os)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}  Error404 MOTD Installation${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo ""
echo "Detected OS: $OS"
echo "Installation directory: $SCRIPT_DIR"
echo ""

# Determine installation method based on OS
if [[ -d /etc/update-motd.d ]]; then
    MOTD_STYLE="dynamic"
    INSTALL_PATH="/etc/update-motd.d/10-motd-error404"
    echo -e "${GREEN}✓ Dynamic MOTD system detected (update-motd.d)${NC}"
elif [[ -f /etc/motd ]]; then
    MOTD_STYLE="static"
    INSTALL_PATH="/etc/motd.bak"
    echo -e "${YELLOW}⚠ Static MOTD system detected (using /etc/motd)${NC}"
    echo -e "${YELLOW}  Backing up existing MOTD to /etc/motd.bak${NC}"
else
    MOTD_STYLE="create"
    INSTALL_PATH="/etc/motd"
    echo -e "${GREEN}✓ Creating new MOTD file${NC}"
fi

echo ""

# Verify source file exists
if [[ ! -f "$SCRIPT_DIR/motd/10-motd-error404-all-logos" ]]; then
    echo -e "${RED}Error: MOTD source file not found at $SCRIPT_DIR/motd/10-motd-error404-all-logos${NC}"
    exit 1
fi

# Install for dynamic MOTD system
if [[ "$MOTD_STYLE" == "dynamic" ]]; then
    echo -e "${BLUE}Installing to /etc/update-motd.d/...${NC}"
    
    # Copy the MOTD script
    cp "$SCRIPT_DIR/motd/10-motd-error404-all-logos" "$INSTALL_PATH"
    chmod 755 "$INSTALL_PATH"
    
    # Create/update PAM config to enable dynamic MOTD
    if ! grep -q "pam_motd.so" /etc/pam.d/login 2>/dev/null; then
        echo "session optional pam_motd.so motd=/run/motd.dynamic" >> /etc/pam.d/login
        echo -e "${GREEN}✓ PAM motd module configured${NC}"
    fi
    
    # Test the MOTD
    echo ""
    echo -e "${BLUE}Testing MOTD output:${NC}"
    echo "════════════════════════════════════════════════════════════"
    bash "$INSTALL_PATH"
    echo "════════════════════════════════════════════════════════════"
    
# Install for static MOTD system
elif [[ "$MOTD_STYLE" == "static" ]]; then
    echo -e "${BLUE}Installing to /etc/motd...${NC}"
    
    # Backup existing motd if it exists
    if [[ -f /etc/motd && -s /etc/motd ]]; then
        cp /etc/motd /etc/motd.bak
    fi
    
    # Create static version by running the script and saving output
    bash "$SCRIPT_DIR/motd/10-motd-error404-all-logos" > /etc/motd
    chmod 644 /etc/motd
    
    echo -e "${GREEN}✓ Static MOTD installed${NC}"
    echo ""
    echo -e "${BLUE}MOTD preview:${NC}"
    echo "════════════════════════════════════════════════════════════"
    cat /etc/motd
    echo "════════════════════════════════════════════════════════════"

# Create new MOTD file
else
    echo -e "${BLUE}Creating new MOTD file...${NC}"
    
    bash "$SCRIPT_DIR/motd/10-motd-error404-all-logos" > /etc/motd
    chmod 644 /etc/motd
    
    echo -e "${GREEN}✓ MOTD created at /etc/motd${NC}"
    echo ""
    echo -e "${BLUE}MOTD preview:${NC}"
    echo "════════════════════════════════════════════════════════════"
    cat /etc/motd
    echo "════════════════════════════════════════════════════════════"
fi

# Copy configuration file if present
if [[ -f "$SCRIPT_DIR/motd.config" ]]; then
    cp "$SCRIPT_DIR/motd.config" /etc/error404-motd.config
    chmod 600 /etc/error404-motd.config
    echo -e "${GREEN}✓ Configuration file installed to /etc/error404-motd.config${NC}"
fi

# Copy documentation
if [[ -d "$SCRIPT_DIR/docs" ]]; then
    mkdir -p /usr/local/share/doc/error404-motd
    cp "$SCRIPT_DIR/docs"/* /usr/local/share/doc/error404-motd/ 2>/dev/null || true
    echo -e "${GREEN}✓ Documentation installed to /usr/local/share/doc/error404-motd/${NC}"
fi

echo ""
echo -e "${GREEN}════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}  Installation Complete!${NC}"
echo -e "${GREEN}════════════════════════════════════════════════════════════${NC}"
echo ""
echo "The Error404 MOTD has been installed successfully."
echo ""
echo "Next steps:"
if [[ "$MOTD_STYLE" == "dynamic" ]]; then
    echo "  1. To customize the logo, edit: $INSTALL_PATH"
    echo "     Change ACTIVE_LOGO variable to one of:"
    echo "       • logo_bold (default) - Large ASCII art"
    echo "       • logo_shield - Professional shield"
    echo "       • logo_matrix - Modern tech style"
    echo "       • logo_compact - Ultra-minimal"
    echo "       • logo_hex - Geometric hexagon"
    echo "       • logo_bracket - Clean bracket"
    echo "       • logo_pipeline - Infrastructure/DevOps"
    echo "       • logo_line - Elegant minimal"
    echo "       • logo_double - Professional double line"
    echo "       • logo_minimal - Single line"
    echo ""
    echo "  2. Changes take effect on next login"
    echo ""
    echo "To test immediately:"
    echo "  bash $INSTALL_PATH"
else
    echo "  MOTD has been installed and will display on next login."
fi

echo ""
echo "To uninstall:"
echo "  sudo ./uninstall.sh"
echo ""
