#!/usr/bin/env bash
# up the patch on this build...

GITNAME=$(git config --global user.names)
GITEMAIL=$(git config --global user.email)

if [ -z "$GITNAME" ]; then
  echo "git config name not set"
  git config --global user.name "cicorias"  
fi

if [ -z "$GITEMAIL" ]; then
  echo "git config email not set"
  git config --global user.email "mrrobot@nowhere.com"
fi

git checkout master -f
UPDVERSION=$(npm version patch)

GITPWD=$1
GITURL=$2
URL=https://${GITNAME}:${GITPWD}@${GITURL}
echo $URL

git push $URL

NEWVERSION=$(npm view . version)
# echo "##vso[build.addbuildtag]npm-v$NEWVERSION"
echo "##vso[build.addbuildtag]npm-$UPDVERSION"
