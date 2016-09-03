[[ `git log -1 --oneline --pretty=%B` =~ ^wip$ ]] && exit 1
git config --global user.email "dstancu+schema_chlg@nyu.edu"
git config --global user.name "CircleCI (dstancu)"

BRANCH=`git rev-parse --abbrev-ref HEAD`

git reset --hard; git pull --rebase origin master; git checkout master; git merge $BRANCH --no-ff --no-edit; git push