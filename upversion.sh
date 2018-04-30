#!/usr/bin/env bash
# up the patch on this build...

GITNAME=$(git config --global user.names)
GITEMAIL=$(git config --global user.email)

if [ -z "$GITNAME" ]; then
  echo "git config name not set"
  git config --global user.name "Mr Robot"  
fi

if [ -z "$GITEMAIL" ]; then
  echo "git config email not set"
  git config --global user.email "mrrobot@nowhere.com"
fi

git checkout master -f
UPDVERSION=$(npm version patch)

GITPWD=$1
URL=https://${GITNAME}:${GITPWD}@reactaad.visualstudio.com/_git/react-aad-msal
echo $URL

git push $URL

NEWVERSION=$(npm view . version)
# echo "##vso[build.addbuildtag]npm-v$NEWVERSION"
echo "##vso[build.addbuildtag]npm-$UPDVERSION"

