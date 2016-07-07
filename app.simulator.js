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
			this.eRe = {
				//rtt = A
				A: 0,
				//hst = H
				H: '',
				//rid = Q
				Q: 0,
				//tsn = X
				X: 0,
				//exts = N
				N: 0,
				//erd = R
				R: 0,
				//cached = C
				C: false
			};
			//
			// Initialize services
			//
			this.httpService = HTTPService;
			this.sanitizerService = DOMSanitizer;
			//
			// View execution variables
			//
			this.iVEV();
			//
			// View execution parameters
			//
			this.iVEP();
			//
			// View presentation variables - control
			//
			this.iVPCV();
			//
			// View presentation variables - reference links
			//
			this.iRL();
			//
			// Charts configuration and initialization
			//
			this.iC();
			//
			// Execution scope variables
			//
			this.iESV();
			//
			// Statistical variables
			//
			this.iSV();
			//
			// Live Events socket variables and configuration
			//
			this.iLE();
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
		AppSimulator.prototype.safeUrl = function(u) {
			return this.sanitizerService.bypassSecurityTrustResourceUrl(u);
		};
		//
		// Configuration & Initialization methods
		//
		//// initReferenceLinks
		AppSimulator.prototype.iRL = function() {
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
		//// initViewExecVariables
		AppSimulator.prototype.iVEV = function() {
			this.rVEV();
			this.running = false;
		};
		//// resetViewExecVariables
		AppSimulator.prototype.rVEV = function() {
			this.rER = 0;
			this.rOK = 0;
		};
		//// initViewExecParameters
		AppSimulator.prototype.iVEP = function() {
			this.iD = false;
			this.rqCn = 2;
			this.rqCt = 100;
			this.rqDu = 5;
			this.rqIn = 50;
			this.uO = [[this.baseUrl + ':33333/api',
			            'DNS Public'],
			           ['https://raspberrypi4:8010/api',
			                    'DNS Private'],
			           ['https://192.168.69.242:8010/api',
			            'IP Private']];
		};
		//// initViewPresentationControlVariables
		AppSimulator.prototype.iVPCV = function() {
			this.rVPCV();
			this.sU = this.uO[0][0];
			this.lE = false;
		};
		//// resetViewPresentationControlVariables
		AppSimulator.prototype.rVPCV = function() {
			this.hg = [[50,
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
			this.sRe = false;
			this.clc = false;
			this.oT = [0,
			           0,
			           0,
			           0];
			this.rqCh = 0;
		};
		//// initCharts
		AppSimulator.prototype.iC = function() {
			this.bco = {
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
			this.lco = {
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
			this.pco = {
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
			this.pco2 = {
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
			this.rCD();
		};
		//// resetChartsData
		AppSimulator.prototype.rCD = function() {
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
		//// initExecutionScopeVariables
		AppSimulator.prototype.iESV = function() {
			this.oP = [0,
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
			this.dur = 0;
		};
		//// resetExecutionScopeVariables
		AppSimulator.prototype.rESV = function() {
			this.dur = 0;
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
			this.nix = {
				"raspberrypi2": [0,
				                 0],
				"raspberrypi3": [1,
				                 0],
				"raspberrypi5": [2,
				                 0],
				"raspberrypi6": [3,
				                 0]
			};
			this.pix = {
				"raspberrypi2": {},
				"raspberrypi3": {},
				"raspberrypi5": {},
				"raspberrypi6": {}
			};
			this.chRe = [];
		};
		//// saveExecutionParametersCopy
		AppSimulator.prototype.sEPC = function() {
			this.exM = this.gSM();
			this.exR = this.rqCt;
			this.exD = this.rqDu;
			this.exI = this.rqIn;
			this.exC = this.rqCn;
			this.exmR = this.gDR();
		};
		//// initStatisticsVariables
		AppSimulator.prototype.iSV = function() {
			this.tpA = 0;
			this.tpX = 0;
			this.tpN = 0;
			this.tpR = 0;
		};
		//// resetStatisticsVariables
		AppSimulator.prototype.rSV = function() {
			this.iSV();
			this.toA = 0;
			this.toX = 0;
			this.toN = 0;
			this.toR = 0;
		};
		//// resetLiveEventsMatrix
		AppSimulator.prototype.rLEM = function() {
			this.leMx = [
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
		//// initLiveEvents
		AppSimulator.prototype.iLE = function() {
			this.rLEM();
			var self = this;
			io(this.baseUrl + ':33331').on('redis', function(d) {
				if (self.leMx[d.x][d.y] !== 3) {
					var x = d.x,
					    y = d.y;
					self.leMx[x][y] = 3;
					setTimeout(function() {
						self.leMx[x][y] = (((x * 32) + y) * 16 / 2731) | 0;
					}, 500);
				}
			});
		};
		//
		// UI related methods
		//
		//// setSmall
		AppSimulator.prototype.sS = function() {
			if (this.iD) {
				this.rqDu = 5;
				this.rqIn = 50;
				this.rqCn = 4;
            }
            else {
				this.rqCt = 100;
				this.rqCn = 2;
            }
            ga('send', 'event', 'Simulation', 'Configuration', 'Small Preset');
		};
		//// setMedium
		AppSimulator.prototype.sM = function() {
			if (this.iD) {
				this.rqDu = 10;
				this.rqIn = 30;
				this.rqCn = 4;
            }
            else {
				this.rqCt = 512;
				this.rqCn = 16;
            }
            ga('send', 'event', 'Simulation', 'Configuration', 'Medium Preset');
        };
		//// setLarge
		AppSimulator.prototype.sL = function() {
			if (this.iD) {
				this.rqDu = 30;
				this.rqIn = 25;
				this.rqCn = 4;
            }
            else {
				this.rqCt = 1024;
				this.rqCn = 64;
            }
            ga('send', 'event', 'Simulation', 'Configuration', 'Large Preset');
        };
		//// setHuge
		AppSimulator.prototype.sH = function() {
			if (this.iD) {
				this.rqDu = 60;
				this.rqIn = 25;
				this.rqCn = 8;
            }
            else {
				this.rqCt = 2048;
				this.rqCn = 128;
            }
            ga('send', 'event', 'Simulation', 'Configuration', 'Huge Preset');
        };
		//// setDuration
		AppSimulator.prototype.sD = function() {
			this.iD = true;
			this.sS();
        };
		//// setRequests
		AppSimulator.prototype.sR = function() {
			this.iD = false;
			this.sS();
        };
		//// isDurationMethod
		AppSimulator.prototype.iDM = function() {
			return this.iD;
        };
		//// isRequestMethod
		AppSimulator.prototype.iRM = function() {
			return !this.iD;
        };
		//// usedDurationMethod
		AppSimulator.prototype.uDM = function() {
			return this.exM === 'STABILITY';
        };
		//// usedRequestMethod
		AppSimulator.prototype.uRM = function() {
			return this.exM === 'STRESS';
        };
		//// getSimulationMethod
		AppSimulator.prototype.gSM = function() {
			return this.iD ? 'STABILITY' : 'STRESS';
        };
		//// onRefLinkClick
		AppSimulator.prototype.oRLC = function(t, d) {
			ga('send', 'event', 'Reference', t, d);
		};
		//// showRef
		AppSimulator.prototype.shR = function() {
			this.sRe = !this.sRe;
			if (this.sRe) {
				this.lE = false;
			}
		};
		//// showLive
		AppSimulator.prototype.shL = function() {
			this.lE = !this.lE;
			if (this.lE) {
				this.sRe = false;
			}
		};
		//// getDatabaseStatus
		AppSimulator.prototype.gDS = function(cond) {
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
		//// percValue
		AppSimulator.prototype.pV = function() {
			return Math.ceil(this.rOK * 100 / this.rqCt);
		};
		//// calcPosition
		AppSimulator.prototype.cP = function(h) {
			return Math.ceil(this.rOK * h / 100);
		};
		//// getDurationRequests
		AppSimulator.prototype.gDR = function() {
			var tot = (this.rqDu * 1000 * this.rqCn / this.rqIn) | 0;
			return tot - (tot % this.rqCn);
		};
		//// getDurationThroughput
		AppSimulator.prototype.gDT = function() {
			return (this.gDR() / this.rqDu) | 0;
		};
		//
		// Execution control methods
		//
		//// isRunning
		AppSimulator.prototype.iR = function() {
            return this.running;
		};
		//// getRandomOperation
		AppSimulator.prototype.gRO = function() {
			return this.oP[(Math.random() * 10) | 0];
		};
		//// getRandomDBRecord
		AppSimulator.prototype.gRD = function() {
			return (Math.random() * 16384) | 0;
		};
		//// populateRequestSamples
		AppSimulator.prototype.pRS = function() {
			for (var q = 0; q < this.rqCt; q++) {
				var o = this.gRO();
				this.oT[o]++;
				this.rq[0].push(this.eRe);
				this.rq[1].push(this.httpService.get(q, this.sU, o, this.gRD()));
				this.rq[2].push(o);
			}
		};
		//// calculateHistogram
		AppSimulator.prototype.cH = function() {
			this.rCD();
			var dr  = Math.ceil(this.rqEx * 4.55 / 100.0),
			    dLo = Math.floor(dr / 2),
			    dUp = this.rqEx - Math.ceil(dr / 2) - 1;
            //
            // Populate barchart as processed (no sorting)
            //
			var self   = this,
			    setBcd = function(i, l, v) {
				    self.bcd[i].values.push({
					                        label: l,
					                        value: v
				                        });
			    },
			    rq0    = this.rq[0];
			for (var i = 0; i < rq0.length; i++) {
				var _hst  = rq0[i].H,
				    _rtt  = rq0[i].A,
				    _tsn  = rq0[i].X,
				    _exts = rq0[i].N,
				    _red  = rq0[i].R,
				    _rid  = rq0[i].Q,
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
			for (var n = 0; n < rq0.length; n++) {
				hdrRTTpost.arr.push(rq0[n].A);
            }
            //
            // Sorting by RTT (AngularJS time)
            //
			var totReqAng = [0,
			                 0,
			                 0,
			                 0];
			rq0.sort(function(a, b) {return a.A - b.A});
			for (i = 0; i < rq0.length; i++) {
				var _hstR = rq0[i].H,
				    _rttR = rq0[i].A;
				rtt2 = _hstR === 0 ? _rttR : 0;
				rtt3 = _hstR === 1 ? _rttR : 0;
				rtt5 = _hstR === 2 ? _rttR : 0;
				rtt6 = _hstR === 3 ? _rttR : 0;
				this.pcd2[0].y += ((i >= dLo) && (i <= dUp)) ? rtt2 : 0;
				this.pcd2[1].y += ((i >= dLo) && (i <= dUp)) ? rtt3 : 0;
				this.pcd2[2].y += ((i >= dLo) && (i <= dUp)) ? rtt5 : 0;
				this.pcd2[3].y += ((i >= dLo) && (i <= dUp)) ? rtt6 : 0;
				totReqAng[0] += ((_hstR === 0) && (i >= dLo) && (i <= dUp)) ? 1 : 0;
				totReqAng[1] += ((_hstR === 1) && (i >= dLo) && (i <= dUp)) ? 1 : 0;
				totReqAng[2] += ((_hstR === 2) && (i >= dLo) && (i <= dUp)) ? 1 : 0;
				totReqAng[3] += ((_hstR === 3) && (i >= dLo) && (i <= dUp)) ? 1 : 0;
				this.toA += ((i >= dLo) && (i <= dUp)) ? _rttR : 0;
			}
			this.pcd2[0].y = this.pcd2[0].y / totReqAng[0];
			this.pcd2[1].y = this.pcd2[1].y / totReqAng[1];
			this.pcd2[2].y = this.pcd2[2].y / totReqAng[2];
			this.pcd2[3].y = this.pcd2[3].y / totReqAng[3];
			this.tpA = Math.ceil(this.rqEx / (this.dur / 1000));
			for (i = 0; i < this.hg.length; i++) {
				this.hg[i][1] = rq0[Math.ceil(this.rqEx * this.hg[i][0] / 100) - 1].A;
            }
			//
			// Sorting by TSN (nginX time)
			//
			var totReqNgi = [0,
			                 0,
			                 0,
			                 0];
			rq0.sort(function(a, b) {return a.X - b.X});
			for (i = 0; i < this.hg.length; i++) {
				this.hg[i][2] = rq0[Math.ceil(this.rqEx * this.hg[i][0] / 100) - 1].X;
            }
			for (i = 0; i < rq0.length; i++) {
				var _hstT = rq0[i].H,
				    _tsnT = rq0[i].X;
				tsn2 = _hstT === 0 ? _tsnT : 0;
				tsn3 = _hstT === 1 ? _tsnT : 0;
				tsn5 = _hstT === 2 ? _tsnT : 0;
				tsn6 = _hstT === 3 ? _tsnT : 0;
				this.pcd[0].y += ((i >= dLo) && (i <= dUp)) ? tsn2 : 0;
				this.pcd[1].y += ((i >= dLo) && (i <= dUp)) ? tsn3 : 0;
				this.pcd[2].y += ((i >= dLo) && (i <= dUp)) ? tsn5 : 0;
				this.pcd[3].y += ((i >= dLo) && (i <= dUp)) ? tsn6 : 0;
				totReqNgi[0] += ((_hstT === 0) && (i >= dLo) && (i <= dUp)) ? 1 : 0;
				totReqNgi[1] += ((_hstT === 1) && (i >= dLo) && (i <= dUp)) ? 1 : 0;
				totReqNgi[2] += ((_hstT === 2) && (i >= dLo) && (i <= dUp)) ? 1 : 0;
				totReqNgi[3] += ((_hstT === 3) && (i >= dLo) && (i <= dUp)) ? 1 : 0;
				this.toX += ((i >= dLo) && (i <= dUp)) ? _tsnT : 0;
			}
			this.pcd[0].y = this.pcd[0].y / totReqNgi[0];
			this.pcd[1].y = this.pcd[1].y / totReqNgi[1];
			this.pcd[2].y = this.pcd[2].y / totReqNgi[2];
			this.pcd[3].y = this.pcd[3].y / totReqNgi[3];
			this.tpX = Math.ceil(this.tpA * this.toA / this.toX);
			//
			// Sort by EXTS (nodeJS time)
			//
			rq0.sort(function(a, b) {return a.N - b.N});
			for (i = 0; i < this.hg.length; i++) {
				this.hg[i][3] = rq0[Math.ceil(this.rqEx * this.hg[i][0] / 100) - 1].N;
            }
			for (i = 0; i < rq0.length; i++) {
				this.toN += ((i >= dLo) && (i <= dUp)) ? rq0[i].N : 0;
			}
			this.tpN = Math.ceil(this.tpX * this.toX / this.toN);
            //
            // Sort by RED (redis.io time)
            //
			rq0.sort(function(a, b) {return a.R - b.R});
			for (i = 0; i < this.hg.length; i++) {
				this.hg[i][4] = rq0[Math.ceil(this.rqEx * this.hg[i][0] / 100) - 1].R;
            }
			for (i = 0; i < rq0.length; i++) {
				this.toR += ((i >= dLo) && (i <= dUp)) ? rq0[i].R : 0;
            }
			this.tpR = Math.ceil(this.tpN * this.toN / this.toR);
            //
            // Calculating HDR Histogram
            //
			this.hdrAr = {
				table: [],
				chart: []
			};
			this.lcd[0].values = [];
			this.lcd[1].values = [];
			this.oRTT = this.httpService.post(this.urlHDR, JSON.stringify(hdrRTTpost)).subscribe(
	            function(re) {
		            self.hdrAr = re;
		            self.rq[0].sort(function(a, b) {return a.A - b.A});
		            for (var n = 0; n < self.hdrAr.chart.length; n++) {
			            var idx = ((self.hdrAr.chart[n].percentile * self.rOK / 100) | 0) - 1;
			            self.lcd[0].values.push({
				                                    x: self.hdrAr.chart[n].percentile,
				                                    y: self.hdrAr.chart[n].value
		                                                     });
			            self.lcd[1].values.push({
				                                    x: self.hdrAr.chart[n].percentile,
				                                    y: self.rq[0][(idx < 0) ? 0 : idx].A
		                                                     });
	                }
                },
	            function(error) {
                    console.log("HDR Service error");
                },
	            function() {
		            self.oRTT.unsubscribe();
		            self.clc = false;
		            self.running = false;
		            self.lE = false;
                }
            );
			ga('send', 'event', 'Simulation', 'Execution', 'Throughput', this.tpA);
        };
		//// observableResponse
		AppSimulator.prototype.oR = function(re) {
			for (var k = 0; k < re.length; k++) {
				var res = re[k],
				    req = res.Q,
				    hst = res.json.hostname,
				    ndx = this.nix[hst][0],
				    cch = res.C;
				this.rq[0][req] = {
					Q: 'Request ' + ((req | 0) + 1),
					H: ndx,
					A: res.A,
					X: res.X,
					N: res.N,
					R: res.R,
					C: cch
				};
				++this.rOK;
				if (cch) {
					this.rqCh++;
					this.chRe.push(this.rOK);
				}
				else {
					var pid = res.json.pid,
					    o   = this.rq[2][req];
					if (!(pid in this.pix[hst])) {
						this.rs[ndx][1].push([pid,
						                      [[],
						                            [],
						                            [],
						                            []]]);
						this.pix[hst][pid] = this.rs[ndx][1].length - 1;
					}
					this.rs[ndx][1][this.pix[hst][pid]][1][o].push(this.rOK);
					this.nix[hst][1]++;
				}
				this.cnRe++;
			}
		};
		//// popResponses
		AppSimulator.prototype.pR = function() {
			if (this.cnRe > this.rqCt) {
				for (var z = 0; z < this.rqCn; z++) {
					this.rq[0].pop();
					this.rq[1].pop();
					this.rq[2].pop();
					this.cnRe--;
				}
			}
		};
		//// startStatistics
		AppSimulator.prototype.sSt = function() {
			this.clc = true;
			var self = this;
			setTimeout(function() {
				self.cH();
			}, 500);
		};
		//// stopHTTPduration
		AppSimulator.prototype.sHd = function() {
			if (this.inH) {
				clearInterval(this.inH);
			}
			this.rqEx = this.cnRe;
			this.sSt();
		};
		//// stopHTTPrequests
		AppSimulator.prototype.sHr = function() {
			this.rqEx = this.rqCt;
			this.sSt();
		};
		//// throwHTTPduration
		AppSimulator.prototype.tHd = function() {
            var self = this,
                q    = 0;
			self.cnRq = 0;
			self.cnRe = 0;
			var inF = function() {
				if (self.tmR && self.cnRq < self.rqCt) {
					self.cnRq += self.rqCn;
					var nextIdx = q + self.rqCn,
					    oRA     = Rx.Observable.forkJoin(self.rq[1].slice(q, nextIdx)).subscribe(
                        function(response) {
	                        self.dur = Date.now() - self.iniTime;
	                        if (self.cnRe < self.rqCt) {
	                            self.oR(response);
                            }
                            else {
	                            self.pR();
                            }
                        },
                        function(error) {
	                        self.dur = Date.now() - self.iniTime;
	                        if (self.cnRe < self.rqCt) {
		                        self.rER++;
		                        self.cnRe++;
                            }
                            else {
	                            self.pR();
                            }
                        },
                        function() {
	                        if (!self.tmR && !self.clc && self.cnRq === self.cnRe) {
	                            self.sHd();
                            }
	                        oRA.unsubscribe();
                        }
                    );
					q += self.rqCn;
                }
                else {
					if (!self.clc && self.cnRq === self.cnRe) {
	                    self.sHd();
                    }
					if (oRA) {
						oRA.unsubscribe();
	                }
                }
            };
			self.tmR = true;
	        self.iniTime = Date.now();
            setTimeout(function() {
	            self.tmR = false;
            }, (self.rqDu * 1000) + 100);
			inF();
			self.inH = setInterval(inF, self.rqIn);
        };
		//// throwHTTPrequests
		AppSimulator.prototype.tHr = function() {
			var self = this,
			    ev   = new ng.core.EventEmitter(true);
			self.tHrIdx = 0;
			ev.subscribe(function(f) {
				if (f) self.iniTime = Date.now();
				var idx  = self.tHrIdx,
				    nIdx = idx + self.rqCn,
				    oR   = Rx.Observable.forkJoin(self.rq[1].slice(idx, nIdx)).subscribe(
					    function(r) {
						    self.oR(r);
					    },
					    function(error) {
						    self.rER++;
					    },
					    function() {
						    self.dur = Date.now() - self.iniTime;
						    oR.unsubscribe();
						    self.tHrIdx += self.rqCn;
						    if (self.rOK + self.rER >= self.rqCt) {
							    ev.unsubscribe();
							    self.sHr();
						    }
						    else {
							    ev.emit(false);
						    }
					    }
				    );
			});
			ev.emit(true);
		};
		//// startSimulator
		AppSimulator.prototype.sSi = function() {
			////
			//// Initialize execution variables - once for each execution
			//// all first time initialization performed on constructor function
			////
			//
			// Save execution parameters
			//
			this.sEPC();
			//
			// Reset statistic variables
			//
			this.rSV();
			//
			// Reset view presentation variables - control
			//
			this.rVPCV();
			this.lE = true;
			//
			// Reset execution scope variables
			//
			this.rESV();
			//
			// Reset Live Events socket variables
			//
			this.rLEM();
			//
			// Reset view execution variables
			//
			this.rVEV();
			this.running = true;
			//
			// Switch among simulation methods (stress or duration)
			//
			if (this.iD) {
				this.rqCt = this.gDR();
	            this.pRS();
	            this.tHd();
            }
            else {
	            this.pRS();
	            this.tHr();
            }
		};
		return AppSimulator;
	})();
})(window.app || (window.app = {}));
