#!/bin/bash

# MCP CLI Release Script
# This script helps automate the release process

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Please run this script from the project root."
    exit 1
fi

# Check if git is clean
if [ -n "$(git status --porcelain)" ]; then
    print_error "Git working directory is not clean. Please commit or stash your changes."
    git status --short
    exit 1
fi

# Get current version
CURRENT_VERSION=$(node -p "require('./package.json').version")
print_status "Current version: $CURRENT_VERSION"

# Ask for release type
echo ""
echo "Select release type:"
echo "1) patch (bug fixes) - $CURRENT_VERSION -> $(npm version --no-git-tag-version patch --dry-run | grep -o '[0-9]\+\.[0-9]\+\.[0-9]\+')"
echo "2) minor (new features) - $CURRENT_VERSION -> $(npm version --no-git-tag-version minor --dry-run | grep -o '[0-9]\+\.[0-9]\+\.[0-9]\+')"
echo "3) major (breaking changes) - $CURRENT_VERSION -> $(npm version --no-git-tag-version major --dry-run | grep -o '[0-9]\+\.[0-9]\+\.[0-9]\+')"
echo "4) custom version"
echo "5) cancel"

read -p "Enter your choice (1-5): " choice

case $choice in
    1)
        RELEASE_TYPE="patch"
        ;;
    2)
        RELEASE_TYPE="minor"
        ;;
    3)
        RELEASE_TYPE="major"
        ;;
    4)
        read -p "Enter custom version (e.g., 1.2.3-beta.1): " CUSTOM_VERSION
        if [[ ! $CUSTOM_VERSION =~ ^[0-9]+\.[0-9]+\.[0-9]+(-[a-zA-Z0-9.-]+)?$ ]]; then
            print_error "Invalid version format. Please use semantic versioning (e.g., 1.2.3 or 1.2.3-beta.1)"
            exit 1
        fi
        RELEASE_TYPE="custom"
        ;;
    5)
        print_warning "Release cancelled."
        exit 0
        ;;
    *)
        print_error "Invalid choice. Please run the script again."
        exit 1
        ;;
esac

# Update version
if [ "$RELEASE_TYPE" = "custom" ]; then
    npm version $CUSTOM_VERSION --no-git-tag-version
    NEW_VERSION=$CUSTOM_VERSION
else
    NEW_VERSION=$(npm version $RELEASE_TYPE --no-git-tag-version)
    NEW_VERSION=${NEW_VERSION#v}  # Remove 'v' prefix if present
fi

print_success "Version updated to: $NEW_VERSION"

# Build the project
print_status "Building project..."
npm run build

# Run tests if they exist
print_status "Running tests..."
npm test || print_warning "Tests failed or not defined, continuing anyway..."

# Show what will be included in the release
print_status "Checking package contents..."
npm pack --dry-run

# Confirm release
echo ""
print_warning "Ready to release version $NEW_VERSION"
echo "This will:"
echo "  1. Commit the version change"
echo "  2. Create and push a git tag (v$NEW_VERSION)"
echo "  3. Trigger GitHub Actions to create a release and publish to npm"
echo ""
read -p "Do you want to continue? (y/N): " confirm

if [[ $confirm != [yY] && $confirm != [yY][eE][sS] ]]; then
    print_warning "Release cancelled. Reverting version change..."
    git checkout -- package.json package-lock.json
    exit 0
fi

# Commit version change
print_status "Committing version change..."
git add package.json package-lock.json
git commit -m "chore: bump version to $NEW_VERSION"

# Create and push tag
print_status "Creating and pushing tag v$NEW_VERSION..."
git tag "v$NEW_VERSION"
git push origin main
git push origin "v$NEW_VERSION"

print_success "Release initiated! 🚀"
echo ""
print_status "GitHub Actions will now:"
echo "  ✅ Build and test the project"
echo "  ✅ Create a GitHub release with changelog"
echo "  ✅ Publish to npm registry"
echo ""
print_status "You can monitor the progress at:"
echo "  🔗 https://github.com/aurracloud/hyperliquid-mcp/actions"
echo ""
print_success "Release v$NEW_VERSION is on its way! 🎉" 