$(function () {

	Highcharts.setOptions({
     colors: ['#542788', '#998ec3', '#d8daeb', '#b35806', '#f1a340']
    });
    Highcharts.setOptions({
    lang: {
        thousandsSep: ','
    }
});
    $('#container').highcharts({
        chart: {
            type: 'bar'
        },
        title: {
            text: 'Population By Race - Distribution'
        },
        subtitle: {
            text: 'As of Year - 2014'
        },
        xAxis: {
            categories: ['Bethesda - Chevy Chase', 'Silver Spring', 'International Corridor', 'University of Maryland', 'Riverdale - New Carrollton']
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Total Population'
            }
        },
        legend: {
            reversed: true
        },
        plotOptions: {
            series: {
                stacking: 'normal'
            }
        },
        series: [{
            name: 'White',
            data: [17421, 19641, 17196,  14321, 12115]
        }, {
            name: 'Black',
            data: [1181, 10898, 13509, 3638, 15455]
        }, {
            name: 'Asian',
            data: [2483, 3204, 3001, 3275, 971]
        }, {
            name: 'Hispanic',
            data: [1429, 4419, 35832, 1902, 11525]
        }]
    });
});

$(function () {
    $('#container1').highcharts({
        chart: {
            type: 'bar'
        },
        title: {
            text: 'Population By Race - Percentage'
        },
        subtitle: {
            text: 'As of Year - 2014'
        },
        xAxis: {
            categories: ['Bethesda - Chevy Chase', 'Silver Spring', 'International Corridor', 'University of Maryland', 'Riverdale - New Carrollton']
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Population Occupancy Rate'
            }
        },

        legend: {
            reversed: true
            },
        tooltip: {
            pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}%</b><br/>',
            shared: true
        },
        plotOptions: {
            series: {
                stacking: 'percent'
            }
        },
        series: [{
            name: 'White',
            data: [84.26, 56.44, 29.06, 65.01, 39.51]
        }, {
            name: 'Black',
            data: [5.71, 31.32, 22.83, 16.51, 50.41]
        }, {
            name: 'Asian',
            data: [12.01, 9.20, 5.07, 14.87, 3.16]
        }, {
            name: 'Hispanic',
            data: [6.91, 12.70, 60.56, 8.63, 37.59]
        }]
    });
});

$(function () {
    /**
     * Create a constructor for sparklines that takes some sensible defaults and merges in the individual
     * chart options. This function is also available from the jQuery plugin as $(element).highcharts('SparkLine').
     */
    Highcharts.SparkLine = function (a, b, c) {
        var hasRenderToArg = typeof a === 'string' || a.nodeName,
            options = arguments[hasRenderToArg ? 1 : 0],
            defaultOptions = {
                chart: {
                    renderTo: (options.chart && options.chart.renderTo) || this,
                    backgroundColor: null,
                    borderWidth: 0,
                    type: 'area',
                    margin: [2, 0, 2, 0],
                    width: 120,
                    height: 20,
                    style: {
                        overflow: 'visible'
                    },
                    skipClone: true
                },
                title: {
                    text: ''
                },
                exporting: {
			         enabled: false
				},
                credits: {
                    enabled: false
                },
                xAxis: {
                    labels: {
                        enabled: false
                    },
                    title: {
                        text: null
                    },
                    startOnTick: false,
                    endOnTick: false,
                    tickPositions: []
                },
                yAxis: {
                    endOnTick: false,
                    startOnTick: false,
                    labels: {
                        enabled: false
                    },
                    title: {
                        text: null
                    },
                    tickPositions: [0]
                },
                legend: {
                    enabled: false
                },
                tooltip: {
                    backgroundColor: null,
                    borderWidth: 0,
                    shadow: false,
                    useHTML: true,
                    hideDelay: 0,
                    shared: true,
                    padding: 0,
                    positioner: function (w, h, point) {
                        return { x: point.plotX - w / 2, y: point.plotY - h };
                    }
                },
                plotOptions: {
                    series: {
                        animation: false,
                        lineWidth: 1,
                        shadow: false,
                        states: {
                            hover: {
                                lineWidth: 1
                            }
                        },
                        marker: {
                            radius: 1,
                            states: {
                                hover: {
                                    radius: 2
                                }
                            }
                        },
                        fillOpacity: 0.25
                    },
                    column: {
                        negativeColor: '#910000',
                        borderColor: 'silver'
                    }
                }
            };

        options = Highcharts.merge(defaultOptions, options);

        return hasRenderToArg ?
            new Highcharts.Chart(a, options, c) :
            new Highcharts.Chart(options, b);
    };

    var start = +new Date(),
        $tds = $('td[data-sparkline]'),
        fullLen = $tds.length,
        n = 0;

    // Creating 153 sparkline charts is quite fast in modern browsers, but IE8 and mobile
    // can take some seconds, so we split the input into chunks and apply them in timeouts
    // in order avoid locking up the browser process and allow interaction.
    function doChunk() {
        var time = +new Date(),
            i,
            len = $tds.length,
            $td,
            stringdata,
            arr,
            data,
            chart;

        for (i = 0; i < len; i += 1) {
            $td = $($tds[i]);
            stringdata = $td.data('sparkline');
            arr = stringdata.split('; ');
            data = $.map(arr[0].split(', '), parseFloat);
            chart = {};

            if (arr[1]) {
                chart.type = arr[1];
            }
            $td.highcharts('SparkLine', {
                series: [{
                    data: data,
                    pointStart: 1
                }],
                tooltip: {
                    headerFormat: '<span style="font-size: 10px">' + $td.parent().find('th').html() + ', D{point.x}:</span><br/>',
                    pointFormat: '<b>{point.y}</b>'
                },
                chart: chart
            });

            n += 1;

            // If the process takes too much time, run a timeout to allow interaction with the browser
            if (new Date() - time > 500) {
                $tds.splice(0, i + 1);
                setTimeout(doChunk, 0);
                break;
            }

            // Print a feedback on the performance
            if (n === fullLen) {
                $('#result').html('Generated ' + fullLen + ' sparklines in ' + (new Date() - start) + ' ms');
            }
        }
    }
    doChunk();

});

function showDiv(id){
	if(id == 1) {
        document.getElementById('container').style.display = "block"; 
        document.getElementById('container1').style.display = "none"; 
        document.getElementById('containerDesc').style.display = "block"; 
        document.getElementById('container1Desc').style.display = "none"; 
    }
    if(id == 2) {
        document.getElementById('container').style.display = "none"; 
        document.getElementById('container1').style.display = "block"; 
        document.getElementById('containerDesc').style.display = "none"; 
        document.getElementById('container1Desc').style.display = "block"; 
    }
}

function setViewFunction() {
	document.getElementById('container').style.display = "block"; 
    document.getElementById('container1').style.display = "none"; 
    document.getElementById('containerDesc').style.display = "block"; 
    document.getElementById('container1Desc').style.display = "none";
    document.getElementById('containerWhite').style.display = "block";
    document.getElementById('containerBlack').style.display = "none";
    document.getElementById('containerAsian').style.display = "none";
    document.getElementById('containerHispanic').style.display = "none";
    document.getElementById('titleWhite').style.display = "block";
    document.getElementById('titleBlack').style.display = "none";
    document.getElementById('titleAsian').style.display = "none";
    document.getElementById('titleHispanic').style.display = "none";

}

function showRace(id){
    if(id == 1) {
        document.getElementById('containerWhite').style.display = "block";
        document.getElementById('containerBlack').style.display = "none";
        document.getElementById('containerAsian').style.display = "none";
        document.getElementById('containerHispanic').style.display = "none";
        document.getElementById('titleWhite').style.display = "block";
        document.getElementById('titleBlack').style.display = "none";
        document.getElementById('titleAsian').style.display = "none";
        document.getElementById('titleHispanic').style.display = "none"; 
    }
    if(id == 2) {
        document.getElementById('containerWhite').style.display = "none";
        document.getElementById('containerBlack').style.display = "block";
        document.getElementById('containerAsian').style.display = "none";
        document.getElementById('containerHispanic').style.display = "none";
        document.getElementById('titleWhite').style.display = "none";
        document.getElementById('titleBlack').style.display = "block";
        document.getElementById('titleAsian').style.display = "none";
        document.getElementById('titleHispanic').style.display = "none";
    }
    if(id == 3) {
        document.getElementById('containerWhite').style.display = "none";
        document.getElementById('containerBlack').style.display = "none";
        document.getElementById('containerAsian').style.display = "block";
        document.getElementById('containerHispanic').style.display = "none";
        document.getElementById('titleWhite').style.display = "none";
        document.getElementById('titleBlack').style.display = "none";
        document.getElementById('titleAsian').style.display = "block";
        document.getElementById('titleHispanic').style.display = "none";
    }
    if(id == 4) {
        document.getElementById('containerWhite').style.display = "none";
        document.getElementById('containerBlack').style.display = "none";
        document.getElementById('containerAsian').style.display = "none";
        document.getElementById('containerHispanic').style.display = "block";
        document.getElementById('titleWhite').style.display = "none";
        document.getElementById('titleBlack').style.display = "none";
        document.getElementById('titleAsian').style.display = "none";
        document.getElementById('titleHispanic').style.display = "block"; 
    }
}

$(function () {
    // Create the chart
            $('#containerHispanic').highcharts({
                chart: {
                    type: 'column',
                },
                title: {
                    text: 'Hispanic Population (Year 2014)'
                },
                subtitle: {
                    text: 'Click the columns to view data over the years'
                },
                xAxis: {
                    type: 'category'
                },
                yAxis: {
                    title: {
                        text: 'Total Hispanic Population'
                    }

                },
                legend: {
                    enabled: false
                },
                plotOptions: {
                    series: {
                        borderWidth: 0,
                    }
                },

                tooltip: {
                    headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
                    pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y}</b><br/>'
                },

                series: [{
                    name: 'Subarea',
                    colorByPoint: true,
                    data: [{
                        name: 'Bethesda',
                        y: 1429,
                        drilldown: 'Bethesda'
                    }, {
                        name: 'Silver Spring',
                        y: 4419,
                        drilldown: 'Silver Spring'
                    },{
                        name: 'International Corridor',
                        y: 35832,
                        drilldown: 'International Corridor'
                    },{
                        name: 'University of Maryland',
                        y: 1902,
                        drilldown: 'University of Maryland'
                    },{
                        name: 'Riverdale - New Carrollton',
                        y: 11525,
                        drilldown: 'Riverdale - New Carrollton'
                    }]
                }],
                drilldown: {
                    series: [{
                        name: 'Bethesda',
                        id: 'Bethesda',
                        data: [
                            [
                                '2000',
                                915
                            ],
                            [
                                '2006-2010',
                                1030
                            ],
                            [
                                '2009-2013',
                                1351
                            ],
                            [
                                '2010-2014',
                                1429
                            ]
                        ]
                    }, {
                        name: 'Riverdale - New Carrolton',
                        id: 'Riverdale - New Carrollton',
                        data: [
                            [
                                '2000',
                                4981.5
                            ],
                            [
                                '2006-2010',
                                9498
                            ],
                            [
                                '2009-2013',
                                10612
                            ],
                            [
                                '2010-2014',
                                11525
                            ]
                        ]
                    }, {
                        name: 'International Corridor',
                        id: 'International Corridor',
                        data: [
                            [
                                '2000',
                                20755
                            ],
                            [
                                '2006-2010',
                                30488
                            ],
                            [
                                '2009-2013',
                                35793
                            ],
                            [
                                '2010-2014',
                                35832
                            ]
                        ]
                    }, {
                        name: 'University of Maryland',
                        id: 'University of Maryland',
                        data: [
                            [
                                '2000',
                                760
                            ],
                            [
                                '2006-2010',
                                1857
                            ],
                            [
                                '2009-2013',
                                1465
                            ],
                            [
                                '2010-2014',
                                1902
                            ]
                        ]
                    }, {
                        name: 'Silver Spring',
                        id: 'Silver Spring',
                        data: [
                            [
                                '2000',
                                4314
                            ],
                            [
                                '2006-2010',
                                4191
                            ],
                            [
                                '2009-2013',
                                4040
                            ],
                            [
                                '2010-2014',
                                4419
                            ]
                        ]
                    }]
                }
            });
        });

$(function () {
    // Create the chart
            $('#containerWhite').highcharts({
                chart: {
                    type: 'column',
                },
                title: {
                    text: 'White Population (Year 2014)'
                },
                subtitle: {
                    text: 'Click the columns to view data over the years.'
                },
                xAxis: {
                    type: 'category'
                },
                yAxis: {
                    title: {
                        text: 'Total White Population'
                    }

                },
                legend: {
                    enabled: false
                },
                plotOptions: {
                    series: {
                        borderWidth: 0,
                    }
                },

                tooltip: {
                    headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
                    pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y}</b><br/>'
                },

                series: [{
                    name: 'Subarea',
                    colorByPoint: true,
                    data: [{
                        name: 'Bethesda',
                        y: 17421,
                        drilldown: 'Bethesda'
                    }, {
                        name: 'Silver Spring',
                        y: 19641,
                        drilldown: 'Silver Spring'
                    },{
                        name: 'International Corridor',
                        y: 17196,
                        drilldown: 'International Corridor'
                    },{
                        name: 'University of Maryland',
                        y: 14321,
                        drilldown: 'University of Maryland'
                    },{
                        name: 'Riverdale - New Carrollton',
                        y: 12115,
                        drilldown: 'Riverdale - New Carrollton'
                    }]
                }],
                drilldown: {
                    series: [{
                        name: 'Bethesda',
                        id: 'Bethesda',
                        data: [
                            [
                                '2000',
                                12492
                            ],
                            [
                                '2006-2010',
                                16000
                            ],
                            [
                                '2009-2013',
                                17278
                            ],
                            [
                                '2010-2014',
                                17421
                            ]
                        ]
                    }, {
                        name: 'Riverdale - New Carrollton',
                        id: 'Riverdale - New Carrollton',
                        data: [
                            [
                                '2000',
                                7040
                            ],
                            [
                                '2006-2010',
                                8711
                            ],
                            [
                                '2009-2013',
                                11457
                            ],
                            [
                                '2010-2014',
                                12115
                            ]
                        ]
                    }, {
                        name: 'International Corridor',
                        id: 'International Corridor',
                        data: [
                            [
                                '2000',
                                16842
                            ],
                            [
                                '2006-2010',
                                16644
                            ],
                            [
                                '2009-2013',
                                16216
                            ],
                            [
                                '2010-2014',
                                17196
                            ]
                        ]
                    }, {
                        name: 'University of Maryland',
                        id: 'University of Maryland',
                        data: [
                            [
                                '2000',
                                5244
                            ],
                            [
                                '2006-2010',
                                15228
                            ],
                            [
                                '2009-2013',
                                14530
                            ],
                            [
                                '2010-2014',
                                14321
                            ]
                        ]
                    }, {
                        name: 'Silver Spring',
                        id: 'Silver Spring',
                        data: [
                            [
                                '2000',
                                14822
                            ],
                            [
                                '2006-2010',
                                16924
                            ],
                            [
                                '2009-2013',
                                19358
                            ],
                            [
                                '2010-2014',
                                19641
                            ]
                        ]
                    }]
                }
            });
        });

$(function () {
    // Create the chart
            $('#containerBlack').highcharts({
                chart: {
                    type: 'column',
                },
                title: {
                    text: 'Black Population (Year 2014)'
                },
                subtitle: {
                    text: 'Click the columns to view data over the years'
                },
                xAxis: {
                    type: 'category'
                },
                yAxis: {
                    title: {
                        text: 'Total Black Population'
                    }

                },
                legend: {
                    enabled: false
                },
                plotOptions: {
                    series: {
                        borderWidth: 0,
                    }
                },

                tooltip: {
                    headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
                    pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y}</b><br/>'
                },

                series: [{
                    name: 'Subarea',
                    colorByPoint: true,
                    data: [{
                        name: 'Bethesda - Chevy Chase',
                        y: 1181,
                        drilldown: 'Bethesda - Chevy Chase'
                    }, {
                        name: 'Silver Spring',
                        y: 10898,
                        drilldown: 'Silver Spring'
                    },{
                        name: 'International Corridor',
                        y: 13509,
                        drilldown: 'International Corridor'
                    },{
                        name: 'University of Maryland',
                        y: 3638,
                        drilldown: 'University of Maryland'
                    },{
                        name: 'Riverdale - New Carrollton',
                        y: 15455,
                        drilldown: 'Riverdale - New Carrollton'
                    }]
                }],
                drilldown: {
                    series: [{
                        name: 'Bethesda - Chevy Chase',
                        id: 'Bethesda - Chevy Chase',
                        data: [
                            [
                                '2000',
                                778
                            ],
                            [
                                '2006-2010',
                                1302
                            ],
                            [
                                '2009-2013',
                                1205
                            ],
                            [
                                '2010-2014',
                                1181
                            ]
                        ]
                    }, {
                        name: 'Riverdale - New Carrollton',
                        id: 'Riverdale - New Carrollton',
                        data: [
                            [
                                '2000',
                                17875.5
                            ],
                            [
                                '2006-2010',
                                16729
                            ],
                            [
                                '2009-2013',
                                15625
                            ],
                            [
                                '2010-2014',
                                15455
                            ]
                        ]
                    }, {
                        name: 'International Corridor',
                        id: 'International Corridor',
                        data: [
                            [
                                '2000',
                                16230
                            ],
                            [
                                '2006-2010',
                                15908
                            ],
                            [
                                '2009-2013',
                                13263
                            ],
                            [
                                '2010-2014',
                                13509
                            ]
                        ]
                    }, {
                        name: 'University of Maryland',
                        id: 'University of Maryland',
                        data: [
                            [
                                '2000',
                                1302
                            ],
                            [
                                '2006-2010',
                                2979
                            ],
                            [
                                '2009-2013',
                                3372
                            ],
                            [
                                '2010-2014',
                                3638
                            ]
                        ]
                    }, {
                        name: 'Silver Spring',
                        id: 'Silver Spring',
                        data: [
                            [
                                '2000',
                                11349
                            ],
                            [
                                '2006-2010',
                                10549
                            ],
                            [
                                '2009-2013',
                                10958
                            ],
                            [
                                '2010-2014',
                                10898
                            ]
                        ]
                    }]
                }
            });
        });

$(function () {
    // Create the chart
            $('#containerAsian').highcharts({
                chart: {
                    type: 'column',
                },
                title: {
                    text: 'Asian Population (Year 2014)'
                },
                subtitle: {
                    text: 'Click the columns to view data over the years'
                },
                xAxis: {
                    type: 'category'
                },
                yAxis: {
                    title: {
                        text: 'Total Asian Population'
                    }

                },
                legend: {
                    enabled: false
                },
                plotOptions: {
                    series: {
                        borderWidth: 0,
                    }
                },

                tooltip: {
                    headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
                    pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y}</b><br/>'
                },

                series: [{
                    name: 'Subarea',
                    colorByPoint: true,
                    data: [{
                        name: 'Bethesda - Chevy Chase',
                        y: 2483,
                        drilldown: 'Bethesda - Chevy Chase'
                    }, {
                        name: 'Silver Spring',
                        y: 3204,
                        drilldown: 'Silver Spring'
                    },{
                        name: 'International Corridor',
                        y: 3001,
                        drilldown: 'International Corridor'
                    },{
                        name: 'University of Maryland',
                        y: 3275,
                        drilldown: 'University of Maryland'
                    },{
                        name: 'Riverdale - New Carrollton',
                        y: 971,
                        drilldown: 'Riverdale - New Carrollton'
                    }]
                }],
                drilldown: {
                    series: [{
                        name: 'Bethesda - Chevy Chase',
                        id: 'Bethesda - Chevy Chase',
                        data: [
                            [
                                '2000',
                                803
                            ],
                            [
                                '2006-2010',
                                1709
                            ],
                            [
                                '2009-2013',
                                2340
                            ],
                            [
                                '2010-2014',
                                2483
                            ]
                        ]
                    }, {
                        name: 'Riverdale - New Carrollton',
                        id: 'Riverdale - New Carrollton',
                        data: [
                            [
                                '2000',
                                1118
                            ],
                            [
                                '2006-2010',
                                603
                            ],
                            [
                                '2009-2013',
                                864
                            ],
                            [
                                '2010-2014',
                                971
                            ]
                        ]
                    }, {
                        name: 'International Corridor',
                        id: 'International Corridor',
                        data: [
                            [
                                '2000',
                                3275
                            ],
                            [
                                '2006-2010',
                                2742
                            ],
                            [
                                '2009-2013',
                                2909
                            ],
                            [
                                '2010-2014',
                                3001
                            ]
                        ]
                    }, {
                        name: 'University of Maryland',
                        id: 'University of Maryland',
                        data: [
                            [
                                '2000',
                                764
                            ],
                            [
                                '2006-2010',
                                2724
                            ],
                            [
                                '2009-2013',
                                3191
                            ],
                            [
                                '2010-2014',
                                3275
                            ]
                        ]
                    }, {
                        name: 'Silver Spring',
                        id: 'Silver Spring',
                        data: [
                            [
                                '2000',
                                1879
                            ],
                            [
                                '2006-2010',
                                2180
                            ],
                            [
                                '2009-2013',
                                3512
                            ],
                            [
                                '2010-2014',
                                3204
                            ]
                        ]
                    }]
                }
            });
        });