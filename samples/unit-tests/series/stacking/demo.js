QUnit.test('Date objects as X values, stack (#5010)', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            type: 'area'
        },
        plotOptions: {
            series: {
                stacking: 'normal'
            }
        },
        xAxis: {
            type: 'datetime',
            minPadding: 0,
            maxPadding: 0
        },
        series: [
            {
                data: [
                    {
                        x: new Date(2000, 0, 1, 0, 0, 0, 0),
                        y: 100
                    },
                    {
                        x: new Date(2000, 0, 2, 0, 0, 0, 0),
                        y: 105
                    }
                ],
                name: 'Blue Count'
            },
            {
                data: [
                    {
                        x: new Date(2000, 0, 1, 0, 0, 0, 0),
                        y: 24
                    },
                    {
                        x: new Date(2000, 0, 2, 0, 0, 0, 0),
                        y: 21
                    }
                ],
                name: 'Black Count'
            }
        ]
    });

    assert.ok(
        chart.series[0].area.element.getAttribute('d').indexOf('L') > -1,
        'Area created'
    );
    assert.strictEqual(
        chart.xAxis[0].max,
        new Date(2000, 0, 2, 0, 0, 0, 0).getTime(),
        'Area created'
    );
});

QUnit.test('Date objects as X values, non-stacked', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            type: 'area'
        },
        xAxis: {
            type: 'datetime',
            minPadding: 0,
            maxPadding: 0
        },
        series: [
            {
                data: [
                    {
                        x: new Date(2000, 0, 1, 0, 0, 0, 0),
                        y: 100
                    },
                    {
                        x: new Date(2000, 0, 2, 0, 0, 0, 0),
                        y: 105
                    }
                ],
                name: 'Blue Count'
            },
            {
                data: [
                    {
                        x: new Date(2000, 0, 1, 0, 0, 0, 0),
                        y: 24
                    },
                    {
                        x: new Date(2000, 0, 2, 0, 0, 0, 0),
                        y: 21
                    }
                ],
                name: 'Black Count'
            }
        ]
    });

    assert.ok(
        chart.series[0].area.element.getAttribute('d').indexOf('L') > -1,
        'Area created'
    );
    assert.strictEqual(
        chart.xAxis[0].max,
        new Date(2000, 0, 2, 0, 0, 0, 0).getTime(),
        'Area created'
    );
});

QUnit.test('Date objects as X values, column', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            type: 'column'
        },
        xAxis: {
            type: 'datetime',
            minPadding: 0,
            maxPadding: 0
        },
        plotOptions: {
            series: {
                stacking: 'normal'
            }
        },
        series: [
            {
                data: [
                    {
                        x: new Date(2000, 0, 1, 0, 0, 0, 0),
                        y: 100
                    },
                    {
                        x: new Date(2000, 0, 2, 0, 0, 0, 0),
                        y: 105
                    }
                ],
                name: 'Blue Count'
            },
            {
                data: [
                    {
                        x: new Date(2000, 0, 1, 0, 0, 0, 0),
                        y: 24
                    },
                    {
                        x: new Date(2000, 0, 2, 0, 0, 0, 0),
                        y: 21
                    }
                ],
                name: 'Black Count'
            }
        ]
    });

    assert.ok(
        parseInt(
            chart.series[0].points[0].graphic.element.getAttribute('width'),
            10
        ) > 10,
        'Column created'
    );
});

(function () {
    function sizeof(obj) {
        var size = 0,
            key;
        for (key in obj) {
            if (Object.hasOwnProperty.call(obj, key)) {
                size++;
            }
        }
        return size;
    }

    QUnit.test(
        'Errors on stacked area with log axis and odd series length(#4594)',
        function (assert) {
            var chart = $('#container')
                .highcharts({
                    chart: {
                        type: 'area'
                    },

                    plotOptions: {
                        area: {
                            stacking: 'normal'
                        }
                    },

                    yAxis: {
                        type: 'logarithmic'
                    },

                    series: [
                        {
                            data: [1, 1, 1]
                        },
                        {
                            data: [1, 1]
                        }
                    ]
                })
                .highcharts();

            assert.strictEqual(
                chart.series[1].area.attr('d').indexOf('Infinity'),
                -1,
                'Valid path'
            );
        }
    );

    QUnit.test('Stack memory build-up(#4320)', function (assert) {
        var chart = $('#container')
            .highcharts({
                plotOptions: {
                    area: {
                        stacking: 'normal'
                    }
                },
                series: [
                    {
                        type: 'area',
                        data: [1, 1, 1, 1, 1]
                    },
                    {
                        type: 'area',
                        data: [2, 2, 2, 2, 2]
                    }
                ]
            })
            .highcharts();

        assert.strictEqual(
            sizeof(chart.yAxis[0].stacking.stacks[chart.series[0].stackKey]),
            5,
            'Stack is 5'
        );

        // Now add and shift a few times
        for (var i = 0; i < 100; i++) {
            chart.series[0].addPoint(i, false, true);
            chart.series[1].addPoint(i, false, true);
        }
        chart.redraw();

        // Check that stacks have been removed.
        // Note: the size of the stacks is now 10, while we would ideally have 5.
        // It seems like the initial 5 are not removed at all.
        assert.strictEqual(
            sizeof(chart.yAxis[0].stacking.stacks[chart.series[0].stackKey]) <
                11,
            true,
            'Stacks have been removed'
        );
    });

    // Highcharts 3.0.10, Issue #2813
    // stack's labels lives their own lives when you dynamically change type of stack normal <=> percent
    QUnit.test('stacklabels update #2813', function (assert) {
        var chart = Highcharts.chart('container', {
                chart: {
                    type: 'column',
                    marginTop: 70
                },
                credits: {
                    enabled: false
                },
                title: {
                    text: 'Chart1',
                    align: 'left'
                },
                xAxis: {
                    categories: ['Room1'],
                    title: {
                        text: 'Rooms'
                    }
                },
                yAxis: {
                    title: {
                        text: 'Numbers'
                    },
                    stackLabels: {
                        enabled: true,
                        crop: false,
                        style: {
                            fontWeight: 'bold',
                            color: '#6E6E6E'
                        },
                        formatter: function () {
                            return this.stack;
                        }
                    }
                },
                tooltip: {
                    enabled: false,
                    pointFormat:
                        '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b><br/>',
                    shared: false
                },
                plotOptions: {
                    series: {
                        stacking: 'normal',
                        dataLabels: {
                            enabled: true,
                            color: '#210B61',
                            align: 'center',
                            style: {
                                fontSize: '9px',
                                fontFamily: 'Verdana, sans-serif'
                            },
                            formatter: function () {
                                return this.y;
                            }
                        },
                        groupPadding: 0
                    }
                },
                series: [
                    {
                        name: 'Baseline Fail',
                        data: [31],
                        stack: 'Baseline Gary',
                        id: 'Baseline FailGary',
                        color: '#BDBDBD'
                    },
                    {
                        name: 'Baseline Fail',
                        data: [17],
                        stack: 'Baseline Marty',
                        color: '#BDBDBD',
                        linkedTo: 'Baseline FailGary'
                    },
                    {
                        name: 'Baseline Fail',
                        data: [28],
                        stack: 'Baseline TonyG',
                        color: '#BDBDBD',
                        linkedTo: 'Baseline FailGary'
                    },
                    {
                        name: 'Baseline Fail',
                        data: [58],
                        stack: 'Baseline piernot',
                        color: '#BDBDBD',
                        linkedTo: 'Baseline FailGary'
                    },
                    {
                        name: 'Baseline',
                        data: [49],
                        stack: 'Baseline Gary',
                        id: 'BaselineGary',
                        color: '#DF7401'
                    },
                    {
                        name: 'Baseline',
                        data: [63],
                        stack: 'Baseline Marty',
                        color: '#DF7401',
                        linkedTo: 'BaselineGary'
                    },
                    {
                        name: 'Baseline',
                        data: [52],
                        stack: 'Baseline TonyG',
                        color: '#DF7401',
                        linkedTo: 'BaselineGary'
                    },
                    {
                        name: 'Baseline',
                        data: [22],
                        stack: 'Baseline piernot',
                        color: '#DF7401',
                        linkedTo: 'BaselineGary'
                    }
                ]
            }),
            percent = false;

        assert.strictEqual(chart.series.length, 8, 'There should be 8 series.');

        function changeStackingType() {
            var oldTranslateX, oldTranslateY, newTranslateX, newTranslateY;

            Highcharts.each(chart.series, function (series) {
                oldTranslateX = series.data[0].dataLabel.translateX;
                oldTranslateY = series.data[0].dataLabel.translateY;

                series.update({
                    stacking: percent ? 'normal' : 'percent'
                });

                newTranslateX = series.data[0].dataLabel.translateX;
                newTranslateY = series.data[0].dataLabel.translateY;

                assert.strictEqual(
                    newTranslateX,
                    oldTranslateX,
                    'The x position should be equal.'
                );

                assert.ok(
                    percent ?
                        oldTranslateY < newTranslateY :
                        oldTranslateY > newTranslateY,
                    'The y position should be lower.'
                );
            });

            percent = !percent;
        }

        changeStackingType();
        changeStackingType();
        changeStackingType();
    });

    QUnit.test('#6546 - stacking with gapSize', function (assert) {
        var chart = Highcharts.stockChart('container', {
                chart: {
                    type: 'area'
                },
                rangeSelector: {
                    selected: 1
                },
                plotOptions: {
                    series: {
                        gapSize: 1,
                        stacking: 'normal'
                    }
                },
                series: [
                    {
                        name: 'USD to EUR',
                        data: [
                            [0, 1],
                            [1, 1],
                            [2, 1],
                            [3, 1],
                            [4, 1],
                            [7, 1],
                            [8, 1],
                            [9, 1],
                            [10, 1],
                            [11, 1]
                        ]
                    }
                ]
            }),
            path = chart.series[0].graphPath.flat();

        path.splice(0, 1);

        assert.strictEqual(path.indexOf('M') > -1, true, 'Line is broken');
    });

    QUnit.test('Updating to null value (#7493)', function (assert) {
        var chart = Highcharts.chart('container', {
            series: [
                {
                    type: 'area',
                    stacking: 'normal',
                    data: [1, 2, 3, 4, 5]
                }
            ]
        });

        assert.strictEqual(
            chart.series[0].graph.element.getAttribute('d').lastIndexOf('M'),
            0,
            'Graph should not be broken initially'
        );

        chart.series[0].setData([4, 3, null, 2, 1]);
        assert.notEqual(
            chart.series[0].graph.element.getAttribute('d').lastIndexOf('M'),
            0,
            'Graph should be broken after update with null'
        );

        chart.update(
            {
                chart: {
                    type: 'column'
                },
                xAxis: {
                    type: 'category'
                },
                plotOptions: {
                    series: {
                        stacking: 'normal'
                    }
                },
                series: [
                    {
                        data: [
                            {
                                name: 'name1',
                                y: 27.06
                            }
                        ]
                    },
                    {
                        data: [
                            {
                                name: 'name1',
                                y: 17.77
                            },
                            {
                                name: 'name2',
                                y: 20.66
                            },
                            null
                        ]
                    }
                ]
            },
            true,
            true,
            false
        );

        assert.ok(
            true,
            'Stacking the same column series with null values (#10160)'
        );

        chart.series[1].setData([
            [0, null],
            [0, 1],
            [0, 1]
        ]);

        assert.strictEqual(
            chart.series[1].points[1].shapeArgs.y,
            chart.series[1].points[2].shapeArgs.y +
                chart.series[1].points[2].shapeArgs.height,
            'Stacking the same points starting from null value' +
                'should not overlap other points (#10941)'
        );
    });

    QUnit.test(
        'StackLabels position with multiple yAxis (#7798)',
        function (assert) {
            var chart = Highcharts.chart('container', {
                chart: {
                    type: 'column'
                },
                plotOptions: {
                    series: {
                        stacking: 'normal'
                    }
                },
                yAxis: [
                    {
                        top: '0%',
                        height: '30%',
                        stackLabels: {
                            enabled: true,
                            allowOverlap: true
                        }
                    },
                    {
                        top: '30%',
                        height: '70%',
                        stackLabels: {
                            enabled: true,
                            allowOverlap: true
                        }
                    }
                ],
                series: [
                    {
                        data: [1, 2]
                    },
                    {
                        data: [2, 2]
                    },
                    {
                        data: [3, 1],
                        yAxis: 1
                    }
                ]
            });

            assert.strictEqual(
                chart.yAxis[0].stacking.stacks[chart.series[1].stackKey][0]
                    .label.alignAttr.y < chart.series[1].points[0].plotY,
                true,
                'Stack labels should be above the stack'
            );
        }
    );

    QUnit.test('Stack Labels position in bar chart (#8187)', function (assert) {
        var chart = Highcharts.chart('container', {
            chart: {
                type: 'bar',
                marginLeft: 200
            },
            plotOptions: {
                series: {
                    stacking: 'normal'
                }
            },
            yAxis: {
                stackLabels: {
                    enabled: true,
                    allowOverlap: true
                }
            },
            series: [
                {
                    data: [1, 1]
                },
                {
                    data: [1, 1]
                }
            ]
        });

        var labelPos =
            chart.yAxis[0].stacking.stacks[chart.series[0].stackKey][0].label;

        assert.close(
            chart.xAxis[0].toPixels(0, true),
            labelPos.alignAttr.y + labelPos.getBBox().height / 2,
            1,
            'Stack labels should be properly positioned'
        );
    });

    QUnit.test('Stack positions with multiple axes', function (assert) {
        var chart = Highcharts.chart('container', {
                chart: {
                    type: 'column'
                },
                plotOptions: {
                    series: {
                        stacking: 'normal',
                        grouping: false
                    }
                },
                xAxis: [
                    {
                        width: '50%'
                    },
                    {
                        width: '50%',
                        opposite: true
                    },
                    {
                        width: '50%',
                        left: '50%',
                        offset: 0
                    },
                    {
                        width: '50%',
                        left: '50%',
                        offset: 0,
                        opposite: true
                    }
                ],
                series: [
                    {
                        data: [1]
                    },
                    {
                        data: [1],
                        xAxis: 1
                    },
                    {
                        data: [1],
                        xAxis: 2
                    },
                    {
                        data: [1],
                        xAxis: 3
                    }
                ]
            }),
            yAxis = chart.yAxis[0],
            series = chart.series;

        // Use assert.close() because of criping logic
        assert.close(
            series[0].points[0].shapeArgs.y +
                series[0].points[0].shapeArgs.height,
            yAxis.toPixels(1, true),
            2,
            'Series 1 - point should start from value=1 (#4024)'
        );

        assert.close(
            series[2].points[0].shapeArgs.y +
                series[2].points[0].shapeArgs.height,
            yAxis.toPixels(1, true),
            2,
            'Series 3 - Point should start from value=1 (#4024)'
        );
    });

    QUnit.test(
        'The centerInCategory, reversedStacks order of stacks, #16169.',
        function (assert) {
            const chart = Highcharts.chart('container', {
                    chart: {
                        type: 'column'
                    },
                    plotOptions: {
                        column: {
                            stacking: 'normal',
                            centerInCategory: true
                        }
                    },
                    yAxis: {
                        reversedStacks: false,
                        stackLabels: {
                            enabled: true
                        }
                    },
                    series: [{
                        data: [5]
                    }, {
                        data: [2]
                    }, {
                        data: [4],
                        stack: '1'
                    }, {
                        data: [1],
                        stack: '1'
                    }]
                }),
                series = chart.series;

            assert.ok(
                series[0].points[0].barX < series[2].points[0].barX,
                `Enabling centerInCategory and setting reversedStacks to false
                should not affect the stack order.`
            );
        });
}());
