(function(app) {
	app.AppSimulator = (function() {
		function AppSimulator (HTTPService, DOMSanitizer) {
			//
			// Initialize string constants
			//
			this.PI2 = "raspberrypi2";
			this.PI3 = "raspberrypi3";
			this.PI5 = "raspberrypi5";
			this.PI6 = "raspberrypi6";
			this._red = "-redis";
			this._ang = "-angular";
			this._ngi = "-nginx";
			this._nod = "-node";
			this.baseUrl = "https://giancarlobonansea.homeip.net";
			//
			// Initialize services
			//
			this.httpService = HTTPService;
			this.sanitizerService = DOMSanitizer;
			//
			// View execution variables
			//
			this.initViewExecVariables();
			//
			// View execution parameters
			//
			this.initViewExecParameters();
			//
			// View presentation variables - control
			//
			this.initViewPresentationControlVariables();
			//
			// View presentation variables - reference links
			//
			this.initReferenceLinks();
			//
			// Charts configuration and initialization
			//
			this.initCharts();
			//
			// Execution scope variables
			//
			this.initExecutionScopeVariables();
			//
			// Statistical variables
			//
			this.initStatisticsVariables();
			//
			// Live Events socket variables and configuration
			//
			this.initLiveEvents();
		}
		AppSimulator.parameters = [
			app.HTTPService,
			ng.platformBrowser.DomSanitizationService
		];
		AppSimulator.annotations = [
			new ng.core.Component({
				selector:     'node-cluster-simulator',
				templateUrl:  'simulator.html',
				providers:    [
					app.HTTPService,
					ng.http.HTTP_PROVIDERS,
					ng.platformBrowser.DomSanitizationService,
					ng.platformBrowser.BROWSER_SANITIZATION_PROVIDERS
				],
				directives: [nvD3]
			})
		];
		AppSimulator.prototype.safeUrl = function(url) {
			return this.sanitizerService.bypassSecurityTrustResourceUrl(url);
		};
		//
		// Configuration & Initialization methods
		//
		AppSimulator.prototype.initReferenceLinks = function() {
			this.links = {
				l0: REFLINKS.l0,
				l1: REFLINKS.l1,
				v:  []
			};
			for (var i = 0; i < REFLINKS.v.length; i++) {
				this.links.v.push({title:     REFLINKS.v[i].title,
					                  anchor: []
				                  });
				for (var j = 0; j < REFLINKS.v[i].anchor.length; j++) {
					this.links.v[i].anchor.push({
						                            href: this.safeUrl(REFLINKS.v[i].anchor[j].href),
						                            desc: REFLINKS.v[i].anchor[j].desc
					                            });
				}
			}
		};
		AppSimulator.prototype.initViewExecVariables = function() {
			this.resetViewExecVariables();
			this.running = false;
		};
		AppSimulator.prototype.resetViewExecVariables = function() {
			this.respErrors = 0;
			this.respOK = 0;
		};
		AppSimulator.prototype.initViewExecParameters = function() {
			this.isDuration = false;
			this.reqConn = 2;
			this.reqCount = 100;
			this.reqDuration = 5;
			this.reqInterval = 50;
			this.urlOptions = [[this.baseUrl + ':33333/api',
			                    'DNS Public'],
			                   ['https://raspberrypi4:8010/api',
			                    'DNS Private'],
			                   ['https://192.168.69.242:8010/api',
			                    'IP Private']];
		};
		AppSimulator.prototype.initViewPresentationControlVariables = function() {
			this.resetViewPresentationControlVariables();
			this.selectedUrl = this.urlOptions[0][0];
			this.liveEvents = false;
		};
		AppSimulator.prototype.resetViewPresentationControlVariables = function() {
			this.histogram = [[50,
			                   0,
			                   0,
			                   0,
			                   0],
			                  [75,
			                   0,
			                   0,
			                   0,
			                   0],
			                  [87.5,
			                   0,
			                   0,
			                   0,
			                   0],
			                  [93.75,
			                   0,
			                   0,
			                   0,
			                   0],
			                  [96.875,
			                   0,
			                   0,
			                   0,
			                   0],
			                  [98.4375,
			                   0,
			                   0,
			                   0,
			                   0],
			                  [99.21875,
			                   0,
			                   0,
			                   0,
			                   0],
			                  [100,
			                   0,
			                   0,
			                   0,
			                   0]];
			this.showReference = false;
			this.calculating = false;
			this.operType = [0,
			                 0,
			                 0,
			                 0];
			this.reqCached = 0;
		};
		AppSimulator.prototype.initCharts = function() {
			this.barChartOptions = {
				chart: {
					type:         'multiBarChart',
					showControls: false,
					height:       400,
					margin:       {
						top:    20,
						right:  20,
						bottom: 20,
						left:   45
					},
					x:            function(d) {return d.label;},
					y:            function(d) {return d.value;},
					clipEdge:     true,
					stacked:      true,
					showXAxis:    false,
					duration:     500,
					xAxis:        {
						showMaxMin: false
					},
					yAxis:        {
						tickFormat: function(d) {
							return d3.format('d')(d);
						}
					}
				}
			};
			this.lineChartOptions = {
				chart: {
					type:                    'lineWithFocusChart',
					showControls:            false,
					height:                  400,
					showLegend:              true,
					clipEdge:                true,
					duration:                500,
					margin:                  {
						top:    20,
						right:  20,
						bottom: 40,
						left:   55
					},
					x:                       function(d) { return d.x; },
					y:                       function(d) { return d.y; },
					useInteractiveGuideline: true,
					xAxis:                   {
						axisLabel: 'Percentile (%)'
						// ,tickFormat:   function(d) {
						//     return d3.format('.5f')(d);
						// }
					},
					yAxis:                   {
						axisLabel:         'AngularJS Latency (ms)',
						axisLabelDistance: -10,
						rotateYLabel:      true
					},
					x2Axis:                  {
						// tickFormat: function(d) {
						//     return d3.format('.5f')(d);
						// }
					},
					y2Axis:                  {},
					brushExtent:             [75,
					                          100]
				}
			};
			this.polarChartOptions = {
				chart: {
					type:          'pieChart',
					height:        299,
					showLegend:    false,
					donut:         true,
					padAngle:      0.08,
					cornerRadius:  5,
					title:         'nginX',
					x:             function(d) {return d.key;},
					y:             function(d) {return d.y;},
					showLabels:    true,
					labelType:     function(d) {return d.data.key + ': ' + (d.data.y | 0);},
					labelsOutside: true,
					duration:      500
				}
			};
			this.polarChartOptions2 = {
				chart: {
					type:          'pieChart',
					height:        299,
					showLegend:    false,
					donut:         true,
					padAngle:      0.08,
					cornerRadius:  5,
					title:         'AngularJS',
					x:             function(d) {return d.key;},
					y:             function(d) {return d.y;},
					showLabels:    true,
					labelsOutside: true,
					labelType:     function(d) {return d.data.key + ': ' + (d.data.y | 0);},
					duration:      500
				}
			};
			this.resetChartsData();
		};
		AppSimulator.prototype.resetChartsData = function() {
			this.bcd = [{
				key:    this.PI2 + this._red,
				values: []
			},
			            {
				                     key:    this.PI3 + this._red,
				                     values: []
			                     },
			            {
				                     key:    this.PI5 + this._red,
				                     values: []
			                     },
			            {
				                     key:    this.PI6 + this._red,
				                     values: []
			                     },
			                     {
				                     key:    this.PI2 + this._nod,
				                     values: []
			                     },
			                     {
				                     key:    this.PI3 + this._nod,
				                     values: []
			                     },
			                     {
				                     key:    this.PI5 + this._nod,
				                     values: []
			                     },
			                     {
				                     key:    this.PI6 + this._nod,
				                     values: []
			                     },
			                     {
				                     key:    this.PI2 + this._ngi,
				                     values: []
			                     },
			                     {
				                     key:    this.PI3 + this._ngi,
				                     values: []
			                     },
			                     {
				                     key:    this.PI5 + this._ngi,
				                     values: []
			                     },
			                     {
				                     key:    this.PI6 + this._ngi,
				                     values: []
			                     },
			            {
				                     key:    this.PI2 + this._ang,
				                     values: []
			                     },
			            {
				                     key:    this.PI3 + this._ang,
				                     values: []
			                     },
			            {
				                     key:    this.PI5 + this._ang,
				                     values: []
			                     },
			            {
				                     key:    this.PI6 + this._ang,
				                     values: []
			                     }];
			this.pcd = [{
				key: this.PI2,
				y:   0
			},
			            {
				                       key: this.PI3,
				                       y:   0
			                       },
			            {
				                       key: this.PI5,
				                       y:   0
			                       },
			            {
				                       key: this.PI6,
				                       y:   0
			                       }];
			this.pcd2 = [{
				key: this.PI2,
				y:   0
			},
			             {
				                        key: this.PI3,
				                        y:   0
			                        },
			             {
				                        key: this.PI5,
				                        y:   0
			                        },
			             {
				                        key: this.PI6,
				                        y:   0
			                        }];
			this.lcd = [
				{
					key:    'w/o Coord. Omission',
					values: [],
					area:   false
				},
				{
					key:    'Latency/Percentile',
					values: [],
					area:   true
				}
			];
		};
		AppSimulator.prototype.initExecutionScopeVariables = function() {
			this.operationProb = [0,
			                      0,
			                      0,
			                      0,
			                      0,
			                      0,
			                      0,
			                      1,
			                      2,
			                      3];
			this.urlHDR = this.baseUrl + ':33333/hdr';
			this.duration = 0;
		};
		AppSimulator.prototype.resetExecutionScopeVariables = function() {
			this.duration = 0;
			this.rq = [[],
			           [],
			           []];
			this.rs = [[this.PI2,
			            []],
			           [this.PI3,
			                 []],
			           [this.PI5,
			                 []],
			           [this.PI6,
			                 []]];
			this.nodeIdx = {
				"raspberrypi2": [0,
				                 0],
				"raspberrypi3": [1,
				                 0],
				"raspberrypi5": [2,
				                 0],
				"raspberrypi6": [3,
				                 0]
			};
			this.pidIdx = {
				"raspberrypi2": {},
				"raspberrypi3": {},
				"raspberrypi5": {},
				"raspberrypi6": {}
			};
			this.cachedResp = [];
			this.observableRequests = undefined;
		};
		AppSimulator.prototype.saveExecutionParametersCopy = function() {
			this.execMode = this.getSimulationMethod();
			this.execReq = this.reqCount;
			this.execDuration = this.reqDuration;
			this.execInterval = this.reqInterval;
			this.execConn = this.reqConn;
			this.execMaxReq = this.getDurationRequests();
		};
		AppSimulator.prototype.initStatisticsVariables = function() {
			this.tpAngular = 0;
			this.tpNginx = 0;
			this.tpNode = 0;
			this.tpRedis = 0;
		};
		AppSimulator.prototype.resetStatisticsVariables = function() {
			this.initStatisticsVariables();
			this.totAngular = 0;
			this.totNginx = 0;
			this.totNode = 0;
			this.totRedis = 0;
		};
		AppSimulator.prototype.resetLiveEventsMatrix = function() {
			this.evMatrix = [
				[0,
				 0,
				 0,
				 0,
				 0,
				 0,
				 0,
				 0,
				 0,
				 0,
				 0,
				 0,
				 0,
				 0,
				 0,
				 0,
				 0,
				 0,
				 0,
				 0,
				 0,
				 0,
				 0,
				 0,
				 0,
				 0,
				 0,
				 0,
				 0,
				 0,
				 0,
				 0],
				[0,
				 0,
				 0,
				 0,
				 0,
				 0,
				 0,
				 0,
				 0,
				 0,
				 0,
				 0,
				 0,
				 0,
				 0,
				 0,
				 0,
				 0,
				 0,
				 0,
				 0,
				 0,
				 0,
				 0,
				 0,
				 0,
				 0,
				 0,
				 0,
				 0,
				 0,
				 0],
				[0,
				 0,
				 0,
				 0,
				 0,
				 0,
				 0,
				 0,
				 0,
				 0,
				 0,
				 0,
				 0,
				 0,
				 0,
				 0,
				 0,
				 0,
				 0,
				 0,
				 0,
				 0,
				 0,
				 0,
				 0,
				 0,
				 0,
				 0,
				 0,
				 0,
				 0,
				 0],
				[0,
				 0,
				 0,
				 0,
				 0,
				 0,
				 0,
				 0,
				 0,
				 0,
				 0,
				 0,
				 0,
				 0,
				 0,
				 0,
				 0,
				 0,
				 0,
				 0,
				 0,
				 0,
				 0,
				 0,
				 0,
				 0,
				 0,
				 0,
				 0,
				 0,
				 0,
				 0],
				[0,
				 0,
				 0,
				 0,
				 0,
				 0,
				 0,
				 0,
				 0,
				 0,
				 0,
				 0,
				 0,
				 0,
				 0,
				 0,
				 0,
				 0,
				 0,
				 0,
				 0,
				 0,
				 0,
				 0,
				 0,
				 0,
				 0,
				 0,
				 0,
				 0,
				 0,
				 0],
				[0,
				 0,
				 0,
				 0,
				 0,
				 0,
				 0,
				 0,
				 0,
				 0,
				 0,
				 1,
				 1,
				 1,
				 1,
				 1,
				 1,
				 1,
				 1,
				 1,
				 1,
				 1,
				 1,
				 1,
				 1,
				 1,
				 1,
				 1,
				 1,
				 1,
				 1,
				 1],
				[1,
				 1,
				 1,
				 1,
				 1,
				 1,
				 1,
				 1,
				 1,
				 1,
				 1,
				 1,
				 1,
				 1,
				 1,
				 1,
				 1,
				 1,
				 1,
				 1,
				 1,
				 1,
				 1,
				 1,
				 1,
				 1,
				 1,
				 1,
				 1,
				 1,
				 1,
				 1],
				[1,
				 1,
				 1,
				 1,
				 1,
				 1,
				 1,
				 1,
				 1,
				 1,
				 1,
				 1,
				 1,
				 1,
				 1,
				 1,
				 1,
				 1,
				 1,
				 1,
				 1,
				 1,
				 1,
				 1,
				 1,
				 1,
				 1,
				 1,
				 1,
				 1,
				 1,
				 1],
				[1,
				 1,
				 1,
				 1,
				 1,
				 1,
				 1,
				 1,
				 1,
				 1,
				 1,
				 1,
				 1,
				 1,
				 1,
				 1,
				 1,
				 1,
				 1,
				 1,
				 1,
				 1,
				 1,
				 1,
				 1,
				 1,
				 1,
				 1,
				 1,
				 1,
				 1,
				 1],
				[1,
				 1,
				 1,
				 1,
				 1,
				 1,
				 1,
				 1,
				 1,
				 1,
				 1,
				 1,
				 1,
				 1,
				 1,
				 1,
				 1,
				 1,
				 1,
				 1,
				 1,
				 1,
				 1,
				 1,
				 1,
				 1,
				 1,
				 1,
				 1,
				 1,
				 1,
				 1],
				[1,
				 1,
				 1,
				 1,
				 1,
				 1,
				 1,
				 1,
				 1,
				 1,
				 1,
				 1,
				 1,
				 1,
				 1,
				 1,
				 1,
				 1,
				 1,
				 1,
				 1,
				 1,
				 2,
				 2,
				 2,
				 2,
				 2,
				 2,
				 2,
				 2,
				 2,
				 2],
				[2,
				 2,
				 2,
				 2,
				 2,
				 2,
				 2,
				 2,
				 2,
				 2,
				 2,
				 2,
				 2,
				 2,
				 2,
				 2,
				 2,
				 2,
				 2,
				 2,
				 2,
				 2,
				 2,
				 2,
				 2,
				 2,
				 2,
				 2,
				 2,
				 2,
				 2,
				 2],
				[2,
				 2,
				 2,
				 2,
				 2,
				 2,
				 2,
				 2,
				 2,
				 2,
				 2,
				 2,
				 2,
				 2,
				 2,
				 2,
				 2,
				 2,
				 2,
				 2,
				 2,
				 2,
				 2,
				 2,
				 2,
				 2,
				 2,
				 2,
				 2,
				 2,
				 2,
				 2],
				[2,
				 2,
				 2,
				 2,
				 2,
				 2,
				 2,
				 2,
				 2,
				 2,
				 2,
				 2,
				 2,
				 2,
				 2,
				 2,
				 2,
				 2,
				 2,
				 2,
				 2,
				 2,
				 2,
				 2,
				 2,
				 2,
				 2,
				 2,
				 2,
				 2,
				 2,
				 2],
				[2,
				 2,
				 2,
				 2,
				 2,
				 2,
				 2,
				 2,
				 2,
				 2,
				 2,
				 2,
				 2,
				 2,
				 2,
				 2,
				 2,
				 2,
				 2,
				 2,
				 2,
				 2,
				 2,
				 2,
				 2,
				 2,
				 2,
				 2,
				 2,
				 2,
				 2,
				 2],
				[2,
				 2,
				 2,
				 2,
				 2,
				 2,
				 2,
				 2,
				 2,
				 2,
				 2,
				 2,
				 2,
				 2,
				 2,
				 2,
				 2,
				 2,
				 2,
				 2,
				 2,
				 2,
				 2,
				 2,
				 2,
				 2,
				 2,
				 2,
				 2,
				 2,
				 2,
				 2]
			];
		};
		AppSimulator.prototype.initLiveEvents = function() {
			this.resetLiveEventsMatrix();
			var ioMtx = this;
			io(this.baseUrl + ':33331').on('redis', function(data) {
				if (ioMtx.evMatrix[data.x][data.y] !== 3) {
					var x = data.x,
					    y = data.y;
					ioMtx.evMatrix[x][y] = 3;
					setTimeout(function() {
						ioMtx.evMatrix[x][y] = (((x * 32) + y) * 16 / 2731) | 0;
					}, 500);
				}
			});
		};
		//
		// UI related methods
		//
		AppSimulator.prototype.setSmall = function() {
            if (this.isDuration) {
                this.reqDuration = 5;
                this.reqInterval = 50;
                this.reqConn = 4;
            }
            else {
                this.reqCount = 100;
                this.reqConn = 2;
            }
            ga('send', 'event', 'Simulation', 'Configuration', 'Small Preset');
		};
		AppSimulator.prototype.setMedium = function() {
            if (this.isDuration) {
                this.reqDuration = 10;
                this.reqInterval = 30;
                this.reqConn = 4;
            }
            else {
                this.reqCount = 512;
                this.reqConn = 16;
            }
            ga('send', 'event', 'Simulation', 'Configuration', 'Medium Preset');
        };
		AppSimulator.prototype.setLarge = function() {
            if (this.isDuration) {
                this.reqDuration = 30;
                this.reqInterval = 25;
                this.reqConn = 4;
            }
            else {
                this.reqCount = 1024;
                this.reqConn = 64;
            }
            ga('send', 'event', 'Simulation', 'Configuration', 'Large Preset');
        };
		AppSimulator.prototype.setHuge = function() {
            if (this.isDuration) {
                this.reqDuration = 60;
                this.reqInterval = 25;
                this.reqConn = 8;
            }
            else {
                this.reqCount = 2048;
                this.reqConn = 128;
            }
            ga('send', 'event', 'Simulation', 'Configuration', 'Huge Preset');
        };
        AppSimulator.prototype.setDuration = function() {
            this.isDuration = true;
            this.setSmall();
        };
        AppSimulator.prototype.setRequests = function() {
            this.isDuration = false;
            this.setSmall();
        };
        AppSimulator.prototype.isDurationMethod = function() {
            return this.isDuration;
        };
        AppSimulator.prototype.isRequestMethod = function() {
            return !this.isDuration;
        };
        AppSimulator.prototype.usedDurationMethod = function() {
            return this.execMode === 'STABILITY';
        };
        AppSimulator.prototype.usedRequestMethod = function() {
            return this.execMode === 'STRESS';
        };
        AppSimulator.prototype.getSimulationMethod = function() {
            return this.isDuration ? 'STABILITY' : 'STRESS';
        };
		AppSimulator.prototype.onRefLinkClick = function(title, desc) {
			ga('send', 'event', 'Reference', title, desc);
		};
		AppSimulator.prototype.showRef = function() {
			this.showReference = !this.showReference;
			if (this.showReference) {
				this.liveEvents = false;
			}
		};
		AppSimulator.prototype.showLive = function() {
			this.liveEvents = !this.liveEvents;
			if (this.liveEvents) {
				this.showReference = false;
			}
		};
		AppSimulator.prototype.getDatabaseStatus = function(cond) {
			switch (cond) {
				case 0:
					return 'text-info';
				case 2:
					return 'text-primary';
				case 1:
					return 'text-muted';
				case 3:
					return 'text-danger bg-danger';
			}
		};
		AppSimulator.prototype.percValue = function() {
			return Math.ceil(this.respOK * 100 / this.reqCount);
		};
		AppSimulator.prototype.calcPosition = function(hist) {
			return Math.ceil(this.respOK * hist / 100);
		};
		AppSimulator.prototype.getDurationRequests = function() {
			var tot = (this.reqDuration * 1000 * this.reqConn / this.reqInterval) | 0;
			return tot - (tot % this.reqConn);
		};
		AppSimulator.prototype.getDurationThroughput = function() {
			return (this.getDurationRequests() / this.reqDuration) | 0;
		};
		//
		// Execution control methods
		//
		AppSimulator.prototype.isRunning = function() {
            return this.running;
		};
		AppSimulator.prototype.getRandomOperation = function() {
			return this.operationProb[(Math.random() * 10) | 0];
		};
		AppSimulator.prototype.getRandomDBRecord = function() {
			return (Math.random() * 16384) | 0;
		};
		AppSimulator.prototype.populateRequestSamples = function() {
			for (var reqId = 0; reqId < this.reqCount; reqId++) {
				var operT = this.getRandomOperation();
				this.operType[operT]++;
				this.rq[0].push({
					                rtt:          0,
					                      hst:    '',
					                      rid:    0,
					                      tsn:    0,
					                      exts:   0,
					                      red:    0,
					                      cached: false
				                      });
				this.rq[1].push(this.httpService.get(reqId, this.selectedUrl, operT, this.getRandomDBRecord()));
				this.rq[2].push(operT);
			}
		};

		AppSimulator.prototype.calculateHistogram = function() {
			this.resetChartsData();
            this.disregard = Math.ceil(this.reqExecuted * 4.55 / 100.0);
			this.dLo = Math.floor(this.disregard / 2);
			this.dUp = this.reqExecuted - Math.ceil(this.disregard / 2) - 1;
            //
            // Populate barchart as processed (no sorting)
            //
			var self = this;
			var setBcd = function(i, l, v) {
				self.bcd[i].values.push({
					                        label: l,
					                        value: v
				                        });
			};
			for (var i = 0; i < this.rq[0].length; i++) {
				var _hst  = this.rq[0][i].hst,
				    _rtt  = this.rq[0][i].rtt,
				    _tsn  = this.rq[0][i].tsn,
				    _exts = this.rq[0][i].exts,
				    _red  = this.rq[0][i].red,
				    _rid  = this.rq[0][i].rid,
				    rtt2  = 0,
				    rtt3  = 0,
				    rtt5  = 0,
				    rtt6  = 0,
				    tsn2  = 0,
				    tsn3  = 0,
				    tsn5  = 0,
				    tsn6  = 0,
				    exts2 = 0,
				    exts3 = 0,
				    exts5 = 0,
				    exts6 = 0,
				    red2  = 0,
				    red3  = 0,
				    red5  = 0,
				    red6  = 0;
				switch (_hst) {
					case 0:
						rtt2 = _rtt;
						tsn2 = _tsn;
						exts2 = _exts;
						red2 = _red;
						break;
					case 1:
						rtt3 = _rtt;
						tsn3 = _tsn;
						exts3 = _exts;
						red3 = _red;
						break;
					case 2:
						rtt5 = _rtt;
						tsn5 = _tsn;
						exts5 = _exts;
						red5 = _red;
						break;
					case 3:
						rtt6 = _rtt;
						tsn6 = _tsn;
						exts6 = _exts;
						red6 = _red;
						break;
				}
				setBcd(0, _rid, Math.ceil(red2));
				setBcd(1, _rid, Math.ceil(red3));
				setBcd(2, _rid, Math.ceil(red5));
				setBcd(3, _rid, Math.ceil(red6));
				setBcd(4, _rid, Math.ceil(exts2 - red2));
				setBcd(5, _rid, Math.ceil(exts3 - red3));
				setBcd(6, _rid, Math.ceil(exts5 - red5));
				setBcd(7, _rid, Math.ceil(exts6 - red6));
				setBcd(8, _rid, Math.floor(tsn2 - exts2));
				setBcd(9, _rid, Math.floor(tsn3 - exts3));
				setBcd(10, _rid, Math.floor(tsn5 - exts5));
				setBcd(11, _rid, Math.floor(tsn6 - exts6));
				setBcd(12, _rid, rtt2 - tsn2);
				setBcd(13, _rid, rtt3 - tsn3);
				setBcd(14, _rid, rtt5 - tsn5);
				setBcd(15, _rid, rtt6 - tsn6);
            }
            //
            // HDR by RTT (AngularJS time)
            //
            var hdrRTTpost = {"arr": []};
			for (var n = 0; n < this.rq[0].length; n++) {
				hdrRTTpost.arr.push(this.rq[0][n].rtt);
            }
            //
            // Sorting by RTT (AngularJS time)
            //
			this.totReqAng = [0,0,0,0];
			this.rq[0].sort(function(a, b) {return a.rtt - b.rtt});
			for (i = 0; i < this.rq[0].length; i++) {
				rtt2 = this.rq[0][i].hst === 0 ? this.rq[0][i].rtt : 0;
				rtt3 = this.rq[0][i].hst === 1 ? this.rq[0][i].rtt : 0;
				rtt5 = this.rq[0][i].hst === 2 ? this.rq[0][i].rtt : 0;
				rtt6 = this.rq[0][i].hst === 3 ? this.rq[0][i].rtt : 0;
				this.pcd2[0].y += ((i >= this.dLo) && (i <= this.dUp)) ? rtt2 : 0;
				this.pcd2[1].y += ((i >= this.dLo) && (i <= this.dUp)) ? rtt3 : 0;
				this.pcd2[2].y += ((i >= this.dLo) && (i <= this.dUp)) ? rtt5 : 0;
				this.pcd2[3].y += ((i >= this.dLo) && (i <= this.dUp)) ? rtt6 : 0;
				this.totReqAng[0] += ((this.rq[0][i].hst === 0) && (i >= this.dLo) && (i <= this.dUp)) ? 1 : 0;
				this.totReqAng[1] += ((this.rq[0][i].hst === 1) && (i >= this.dLo) && (i <= this.dUp)) ? 1 : 0;
				this.totReqAng[2] += ((this.rq[0][i].hst === 2) && (i >= this.dLo) && (i <= this.dUp)) ? 1 : 0;
				this.totReqAng[3] += ((this.rq[0][i].hst === 3) && (i >= this.dLo) && (i <= this.dUp)) ? 1 : 0;
				this.totAngular += ((i >= this.dLo) && (i <= this.dUp)) ? this.rq[0][i].rtt : 0;
			}
			this.pcd2[0].y = this.pcd2[0].y / this.totReqAng[0];
			this.pcd2[1].y = this.pcd2[1].y / this.totReqAng[1];
			this.pcd2[2].y = this.pcd2[2].y / this.totReqAng[2];
			this.pcd2[3].y = this.pcd2[3].y / this.totReqAng[3];
            this.tpAngular = Math.ceil(this.reqExecuted / (this.duration / 1000));
			for (i = 0; i < this.histogram.length; i++) {
				this.histogram[i][1] = this.rq[0][Math.ceil(this.reqExecuted * this.histogram[i][0] / 100) - 1].rtt;
            }
			//
			// Sorting by TSN (nginX time)
			//
			this.totReqNgi = [0,0,0,0];
			this.rq[0].sort(function(a, b) {return a.tsn - b.tsn});
			for (i = 0; i < this.histogram.length; i++) {
				this.histogram[i][2] = this.rq[0][Math.ceil(this.reqExecuted * this.histogram[i][0] / 100) - 1].tsn;
            }
			for (i = 0; i < this.rq[0].length; i++) {
				tsn2 = this.rq[0][i].hst === 0 ? this.rq[0][i].tsn : 0;
				tsn3 = this.rq[0][i].hst === 1 ? this.rq[0][i].tsn : 0;
				tsn5 = this.rq[0][i].hst === 2 ? this.rq[0][i].tsn : 0;
				tsn6 = this.rq[0][i].hst === 3 ? this.rq[0][i].tsn : 0;
				this.pcd[0].y += ((i >= this.dLo) && (i <= this.dUp)) ? tsn2 : 0;
				this.pcd[1].y += ((i >= this.dLo) && (i <= this.dUp)) ? tsn3 : 0;
				this.pcd[2].y += ((i >= this.dLo) && (i <= this.dUp)) ? tsn5 : 0;
				this.pcd[3].y += ((i >= this.dLo) && (i <= this.dUp)) ? tsn6 : 0;
				this.totReqNgi[0] += ((this.rq[0][i].hst === 0) && (i >= this.dLo) && (i <= this.dUp)) ? 1 : 0;
				this.totReqNgi[1] += ((this.rq[0][i].hst === 1) && (i >= this.dLo) && (i <= this.dUp)) ? 1 : 0;
				this.totReqNgi[2] += ((this.rq[0][i].hst === 2) && (i >= this.dLo) && (i <= this.dUp)) ? 1 : 0;
				this.totReqNgi[3] += ((this.rq[0][i].hst === 3) && (i >= this.dLo) && (i <= this.dUp)) ? 1 : 0;
				this.totNginx += ((i >= this.dLo) && (i <= this.dUp)) ? this.rq[0][i].tsn : 0;
			}
			this.pcd[0].y = this.pcd[0].y / this.totReqNgi[0];
			this.pcd[1].y = this.pcd[1].y / this.totReqNgi[1];
			this.pcd[2].y = this.pcd[2].y / this.totReqNgi[2];
			this.pcd[3].y = this.pcd[3].y / this.totReqNgi[3];
            this.tpNginx = Math.ceil(this.tpAngular * this.totAngular / this.totNginx);
			//
			// Sort by EXTS (nodeJS time)
			//
			this.rq[0].sort(function(a, b) {return a.exts - b.exts});
			for (i = 0; i < this.histogram.length; i++) {
				this.histogram[i][3] = this.rq[0][Math.ceil(this.reqExecuted * this.histogram[i][0] / 100) - 1].exts;
            }
			for (i = 0; i < this.rq[0].length; i++) {
				this.totNode += ((i >= this.dLo) && (i <= this.dUp)) ? this.rq[0][i].exts : 0;
			}
            this.tpNode = Math.ceil(this.tpNginx * this.totNginx / this.totNode);
            //
            // Sort by RED (redis.io time)
            //
			this.rq[0].sort(function(a, b) {return a.red - b.red});
            for (i = 0; i < this.histogram.length; i++) {
	            this.histogram[i][4] = this.rq[0][Math.ceil(this.reqExecuted * this.histogram[i][0] / 100) - 1].red;
            }
			for (i = 0; i < this.rq[0].length; i++) {
				this.totRedis += ((i >= this.dLo) && (i <= this.dUp)) ? this.rq[0][i].red : 0;
            }
            this.tpRedis = Math.ceil(this.tpNode * this.totNode / this.totRedis);
            //
            // Calculating HDR Histogram
            //
            this.hdrRTTresults = {table: [], chart: []};
			this.lcd[0].values = [];
			this.lcd[1].values = [];
            var selfRTT = this;
            this.observableRTT = this.httpService.post(this.urlHDR, JSON.stringify(hdrRTTpost)).subscribe(
                function(response) {
                    selfRTT.hdrRTTresults = response;
	                selfRTT.rq[0].sort(function(a, b) {return a.rtt - b.rtt});
	                for (var n = 0; n < selfRTT.hdrRTTresults.chart.length; n++) {
		                var idx = ((selfRTT.hdrRTTresults.chart[n].percentile * selfRTT.respOK / 100) | 0) - 1;
		                selfRTT.lcd[0].values.push({
			                                                     x: selfRTT.hdrRTTresults.chart[n].percentile,
			                                                     y: selfRTT.hdrRTTresults.chart[n].value
		                                                     });
		                selfRTT.lcd[1].values.push({
			                                                     x: selfRTT.hdrRTTresults.chart[n].percentile,
			                                           y:           selfRTT.rq[0][(idx < 0) ? 0 : idx].rtt
		                                                     });
	                }
                },
                function(error) {
                    console.log("HDR Service error");
                },
                function() {
                    selfRTT.observableRTT.unsubscribe();
                    selfRTT.observableRTT = undefined;
	                selfRTT.calculating = false;
                    selfRTT.running = false;
                    selfRTT.liveEvents = false;
                }
            );
            ga('send', 'event', 'Simulation', 'Execution', 'Throughput', this.tpAngular);
        };

		AppSimulator.prototype.observableResponse = function(response) {
			for (var k = 0; k < response.length; k++) {
				var res = response[k],
				    req = res.reqId,
				    hst = res.json.hostname,
				    ndx = this.nodeIdx[hst][0],
				    cch = res.cached;
				this.rq[0][req] = {
					rid:    'Request ' + ((req | 0) + 1),
					hst:    ndx,
					rtt:    res.rtt,
					tsn:    res.tsn,
					exts:   res.exts,
					red:    res.red,
					cached: cch
				};
				++this.respOK;
				if (cch) {
					this.reqCached++;
					this.cachedResp.push(this.respOK);
				}
				else {
					var pid  = res.json.pid,
					    oper = this.rq[2][req];
					if (!(pid in this.pidIdx[hst])) {
						this.rs[ndx][1].push([pid,
						                      [[],
						                            [],
						                            [],
						                            []]]);
						this.pidIdx[hst][pid] = this.rs[ndx][1].length - 1;
					}
					this.rs[ndx][1][this.pidIdx[hst][pid]][1][oper].push(this.respOK);
					this.nodeIdx[hst][1]++;
				}
				this.countResponses++;
			}
		};
		AppSimulator.prototype.popResponses = function() {
			if (this.countResponses > this.reqCount) {
				for (var z = 0; z < this.reqConn; z++) {
					this.rq[0].pop();
					this.rq[1].pop();
					this.rq[2].pop();
					this.countResponses--;
				}
			}
		};
		AppSimulator.prototype.startStatistics = function() {
			this.calculating = true;
			var selfStop = this;
			setTimeout(function() {
				selfStop.calculateHistogram();
			}, 500);
		};
		AppSimulator.prototype.stopHTTPduration = function() {
			if (this.intervalHandler) {
				clearInterval(this.intervalHandler);
			}
			this.reqExecuted = this.countResponses;
			this.startStatistics();
		};
		AppSimulator.prototype.stopHTTPrequests = function() {
			this.reqExecuted = this.reqCount;
			this.startStatistics();
		};
		AppSimulator.prototype.throwHTTPrequests = function() {
			var self   = this,
			    arrReq = [];
			self.iniTime = Date.now();
			for (var i = 0; i < self.reqCount; i += self.reqConn) {
				for (var j = 0; j < self.reqConn; j++) {
					arrReq.push(self.rq[1][i + j]);
				}
				var observableRequests = Rx.Observable.forkJoin(arrReq).subscribe(
					function(response) {
						self.observableResponse(response);
					},
					function(error) {
						self.respErrors++;
					},
					function() {
						observableRequests.unsubscribe();
						self.duration = Date.now() - self.iniTime;
						if (self.respOK + self.respErrors >= self.reqCount) {
							self.stopHTTPrequests();
						}
					}
				);
			}
		};
        AppSimulator.prototype.throwHTTPduration = function() {
            var self  = this,
                reqId = 0;
            self.countRequests = 0;
            self.countResponses = 0;
            var intervalFunction = function() {
                if (self.timerRunning && self.countRequests < self.reqCount) {
                    self.countRequests += self.reqConn;
                    var arrReq = [];
                    for (var j = 0; j < self.reqConn; j++) {
	                    arrReq.push(self.rq[1][reqId]);
                        reqId++;
                    }
                    var observableRequestsA = Rx.Observable.forkJoin(arrReq).subscribe(
                        function(response) {
                            self.duration = Date.now() - self.iniTime;
                            if (self.countResponses < self.reqCount) {
	                            self.observableResponse(response);
                            }
                            else {
	                            self.popResponses();
                            }
                        },
                        function(error) {
                            self.duration = Date.now() - self.iniTime;
                            if (self.countResponses < self.reqCount) {
	                            self.respErrors++;
                                self.countResponses++;
                            }
                            else {
	                            self.popResponses();
                            }
                        },
                        function() {
                            if (!self.timerRunning && !self.calculating && self.countRequests === self.countResponses) {
	                            self.stopHTTPduration();
                            }
                            observableRequestsA.unsubscribe();
                        }
                    );
                }
                else {
                    if (!self.calculating && self.countRequests === self.countResponses) {
	                    self.stopHTTPduration();
                    }
	                if (observableRequestsA)
		                observableRequestsA.unsubscribe();
                }
            };
	        self.timerRunning = true;
	        self.iniTime = Date.now();
            setTimeout(function() {
                self.timerRunning = false;
            }, (self.reqDuration * 1000) + 100);
            intervalFunction();
            self.intervalHandler = setInterval(intervalFunction, self.reqInterval);
        };
		AppSimulator.prototype.startSimulator = function() {
			////
			//// Initialize execution variables - once for each execution
			//// all first time initialization performed on constructor function
			////
			//
			// Save execution parameters
			//
			this.saveExecutionParametersCopy();
			//
			// Reset statistic variables
			//
			this.resetStatisticsVariables();
			//
			// Reset view presentation variables - control
			//
			this.resetViewPresentationControlVariables();
			this.liveEvents = true;
			//
			// Reset execution scope variables
			//
			this.resetExecutionScopeVariables();
			//
			// Reset Live Events socket variables
			//
			this.resetLiveEventsMatrix();
			//
			// Reset view execution variables
			//
			this.resetViewExecVariables();
			this.running = true;
			//
			// Switch among simulation methods (stress or duration)
			//
            if (this.isDuration) {
                this.reqCount = this.getDurationRequests();
	            this.populateRequestSamples();
                this.throwHTTPduration();
            }
            else {
	            this.populateRequestSamples();
	            this.throwHTTPrequests();
            }
		};
		return AppSimulator;
	})();
})(window.app || (window.app = {}));
