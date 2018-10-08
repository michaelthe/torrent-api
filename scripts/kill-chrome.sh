
ps aux | grep chromium | grep -v grep |  awk '{ print $2}'  | xargs kill -9
