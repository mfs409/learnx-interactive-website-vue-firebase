# The purpose of this script is to stage our app into the 'public' folder, so
# that we can then use 'firebase deploy' to put the app online

# create the public version of the code
npm run prod

# get rid of the current 'public' folder
rm -rf public

# make a new 'public' folder, and put our files into it
mkdir public
cp index.html public
mv bundle.js public

# that's it!