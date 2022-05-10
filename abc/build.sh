source ~/.bash_profile
mkdir -p output
eslint --ext .js,.vue --format=checkstyle src -o output/eslint-result.xml