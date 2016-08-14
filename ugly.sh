#!/usr/bin/env bash
echo Minify app.http.service.js
uglifyjs app.http.service.js --screw-ie8 -c sequences,dead_code,conditionals,comparisons,unsafe_comps,evaluate,booleans,loops,unused,if_return,join_vars,collapse_vars,cascade,passes=5 -m toplevel,eval -r '$,require,exports' -o app.http.service.js --source-map app.http.service.js.map --source-map-include-sources
echo Minify app.liveredis.service.js
uglifyjs app.liveredis.service.js --screw-ie8 -c sequences,dead_code,conditionals,comparisons,unsafe_comps,evaluate,booleans,loops,unused,if_return,join_vars,collapse_vars,cascade,passes=5 -m toplevel,eval -r '$,require,exports' -o app.liveredis.service.js --source-map app.liveredis.service.js.map --source-map-include-sources
echo Minify app.simulator.js
uglifyjs app.simulator.js --screw-ie8 -c sequences,dead_code,conditionals,comparisons,unsafe_comps,evaluate,booleans,loops,unused,if_return,join_vars,collapse_vars,cascade,passes=5 -m toplevel,eval -r '$,require,exports' -o app.simulator.js --source-map app.simulator.js.map --source-map-include-sources
echo Minify http_profile.umd.js
uglifyjs http_profile.umd.js --screw-ie8 -c sequences,dead_code,conditionals,comparisons,unsafe_comps,evaluate,booleans,loops,unused,if_return,join_vars,collapse_vars,cascade,passes=5 -m toplevel,eval -r '$,require,exports' -o http_profile.umd.js --source-map http_profile.umd.js.map --source-map-include-sources
echo Minify app.module.js
uglifyjs app.module.js --screw-ie8 -c sequences,dead_code,conditionals,comparisons,unsafe_comps,evaluate,booleans,loops,unused,if_return,join_vars,collapse_vars,cascade,passes=5 -m toplevel,eval -r '$,require,exports' -o app.module.js --source-map app.module.js.map --source-map-include-sources
echo Minify main.js
uglifyjs main.js --screw-ie8 -c sequences,dead_code,conditionals,comparisons,unsafe_comps,evaluate,booleans,loops,unused,if_return,join_vars,collapse_vars,cascade,passes=5 -m toplevel,eval -r '$,require,exports' -o main.js --source-map main.js.map --source-map-include-sources
echo Minify ng2-nvd3.js
uglifyjs ng2-nvd3.js --screw-ie8 -c sequences,dead_code,conditionals,comparisons,unsafe_comps,evaluate,booleans,loops,unused,if_return,join_vars,collapse_vars,cascade,passes=5 -m -r '$,require,exports' -o ng2-nvd3.js
echo Minify Reflect.js
uglifyjs ./node_modules/reflect-metadata/Reflect.js --screw-ie8 -c sequences,dead_code,conditionals,comparisons,unsafe_comps,evaluate,booleans,loops,unused,if_return,join_vars,collapse_vars,cascade,passes=5 -m -r '$,require,exports' -o ./node_modules/reflect-metadata/Reflect.js
echo Minify socket.io.js
uglifyjs ./node_modules/socket.io-client/socket.io.js --screw-ie8 -c sequences,dead_code,conditionals,comparisons,unsafe_comps,evaluate,booleans,loops,unused,if_return,join_vars,collapse_vars,cascade,passes=5 -m -r '$,require,exports' -o ./node_modules/socket.io-client/socket.io.js
echo Finished minifying files
echo Gzipping static files
gzip -k9f ./favicon.png
gzip -k9f ./node_modules/bootstrap/dist/css/bootstrap.min.css
gzip -k9f ./node_modules/nvd3/build/nv.d3.min.css
gzip -k9f ./font-awesome-4.6.3/css/font-awesome.min.css
gzip -k9f ./font-awesome-4.6.3/fonts/fontawesome-webfont.woff2
gzip -k9f ./font-awesome-4.6.3/fonts/fontawesome-webfont.woff
gzip -k9f ./font-awesome-4.6.3/fonts/fontawesome-webfont.ttf
gzip -k9f ./font-awesome-4.6.3/fonts/fontawesome-webfont.svg
gzip -k9f ./font-awesome-4.6.3/fonts/fontawesome-webfont.eot
gzip -k9f ./font-awesome-4.6.3/fonts/FontAwesome.otf
gzip -k9f ./node_modules/jquery/dist/jquery.min.js
gzip -k9f ./node_modules/bootstrap/dist/js/bootstrap.min.js
gzip -k9f ./node_modules/d3/d3.min.js
gzip -k9f ./node_modules/nvd3/build/nv.d3.min.js
gzip -k9f ./node_modules/socket.io-client/socket.io.js
gzip -k9f ./node_modules/intl/dist/Intl.min.js
gzip -k9f ./node_modules/intl/locale-data/jsonp/en.js
gzip -k9f ./node_modules/es6-shim/es6-shim.min.js
gzip -k9f ./node_modules/zone.js/dist/zone.min.js
gzip -k9f ./node_modules/reflect-metadata/Reflect.js
gzip -k9f ./node_modules/rxjs/bundles/Rx.umd.min.js
gzip -k9f ./node_modules/@angular/core/bundles/core.umd.min.js
gzip -k9f ./node_modules/@angular/common/bundles/common.umd.min.js
gzip -k9f ./node_modules/@angular/compiler/bundles/compiler.umd.min.js
gzip -k9f ./node_modules/@angular/platform-browser/bundles/platform-browser.umd.min.js
gzip -k9f ./node_modules/@angular/platform-browser-dynamic/bundles/platform-browser-dynamic.umd.min.js
gzip -k9f ./http_profile.umd.js
gzip -k9f ./ng2-nvd3.js
gzip -k9f ./app.reference.js
gzip -k9f ./app.http.service.js
gzip -k9f ./app.liveredis.service.js
gzip -k9f ./app.simulator.js
gzip -k9f ./app.module.js
gzip -k9f ./main.js
gzip -k9f ./execution-arch.png
gzip -k9f ./sequence-diagram.png
gzip -k9f ./simulator.html
gzip -k9f ./index.html
echo Finished gzipping static files
