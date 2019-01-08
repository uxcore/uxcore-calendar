set terminal png transparent size 640,240
set size 1.0,1.0

set terminal png transparent size 640,480
set output 'commits_by_author.png'
set key left top
set yrange [0:]
set xdata time
set timefmt "%s"
set format x "%Y-%m-%d"
set grid y
set ylabel "Commits"
set xtics rotate
set bmargin 6
plot 'commits_by_author.dat' using 1:2 title "光弘" w lines, 'commits_by_author.dat' using 1:3 title "biangang.bg" w lines, 'commits_by_author.dat' using 1:4 title "qili.taoqili" w lines, 'commits_by_author.dat' using 1:5 title "知蕾" w lines, 'commits_by_author.dat' using 1:6 title "eternalsky" w lines, 'commits_by_author.dat' using 1:7 title "vincent.bian" w lines, 'commits_by_author.dat' using 1:8 title "macisi" w lines, 'commits_by_author.dat' using 1:9 title "wb-fjp324710" w lines, 'commits_by_author.dat' using 1:10 title "yanbingbing" w lines, 'commits_by_author.dat' using 1:11 title "quanyun" w lines, 'commits_by_author.dat' using 1:12 title "ermin.zem" w lines, 'commits_by_author.dat' using 1:13 title "陶启立" w lines, 'commits_by_author.dat' using 1:14 title "cumulus" w lines
