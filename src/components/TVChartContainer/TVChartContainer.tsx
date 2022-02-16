import * as React from 'react';
import api from '../api/index'
import play from '../api/play'
import {EntityId, IChartingLibraryWidget, widget} from '../../charting_library';
import {getKlines} from "../api/helpers";
import Candle from "../../models/Candle";

declare global {
    interface Window {
        GetInfoById: any,
        SetProp: any,
        GetPositionPoints: any,
        Acceleration: string,
    }
}

interface chartProps {
    chartIsPlaying: boolean;
    savedData: string;
}

export class TVChartContainer extends React.Component<{}, chartProps> {
    private tvWidget: IChartingLibraryWidget | null = null
    widgets: IChartingLibraryWidget | null = null
    bars: Candle[] = []
    widgetPlayOptions = {
        symbol: 'EURUSD',
        datafeed: play,
        theme: 'dark',
        interval: '1',
        container: 'tv_chart_container',
        library_path: './charting_library/',
        disabled_features: [],
        enabled_features: ['fix_left_edge'],
        fullscreen: true,
        autosize: true,
    }
    widgetOptions = {
        symbol: 'EURUSD',
        datafeed: api,
        theme: 'dark',
        interval: '1',
        container: 'tv_chart_container',
        library_path: './charting_library/',
        disabled_features: [],
        enabled_features: ['fix_left_edge'],
        fullscreen: true,
        autosize: true,
    }

    constructor(props: any) {
        super(props)
        this.state = {
            chartIsPlaying: false,
            savedData: "",
        }
    }

    public componentDidMount(): void {

        window.GetInfoById = this.getInfo
        window.SetProp = this.setProp
        window.GetPositionPoints = this.getPositionPoints
        window.Acceleration = '2000'

        this.tvWidget = new widget(this.widgetOptions)
        this.widgets = new widget(this.widgetOptions)

        getKlines({
            symbol: this.widgetOptions.symbol,
            interval: this.widgetOptions.interval,
            from: new Date(0),
            to: Date.now(),
            limit: 1000,
        }).then((res: any) => {
            this.bars = res
        })

        this.widgets.onChartReady(() => {
            this.widgets!.subscribe('drawing_event', (id, type) => {
                console.log(id, type)
            })
        })

    }

    getPositionPoints = (id: EntityId) => {
        const points = this.widgets?.activeChart().getShapeById(id).getPoints()
        const [profit, stop] = [this.widgets?.activeChart().getShapeById(id).getProperties().profitLevel, this.widgets?.activeChart().getShapeById(id).getProperties().stopLevel]
        if (points) {
            console.log('Points are: ')
            console.log('1) Time: ', points[0].time * 1000, 'Price: ', points[0].price)
            console.log('2) Time: ', points[1].time * 1000, 'Price: ', points[1].price)
            if (profit && stop) {
                console.log('Upper point price level: ', points[0].price + (0.00001) * profit)
                console.log('Down point price level: ', points[0].price - (0.00001) * stop)
            }
        }

    }

    createStopLoss = () => {
        let stopLoss = this.widgets!.activeChart().createOrderLine()
            .onCancel("onCancel called", () => {
                stopLoss.remove()
            })
            .onMove(() => {})
            .onModify(() => {})
            .setTooltip("STOP LOSS")
            .setPrice(+this.bars[798].close)
            .setModifyTooltip("Modify order")
            .setCancelTooltip("Cancel order")
            .setText("STOP LOSS")
            .setBodyBackgroundColor('#ffffff')
            .setBodyTextColor('#000000')
            .setBodyBorderColor('#FF0000')
            .setLineColor('#FF0000')
            .setQuantityBackgroundColor('#FF0000')
            .setQuantityBorderColor('#FF0000')
            .setCancelButtonBackgroundColor('#ff0000')
            .setCancelButtonBorderColor('#ff0000')
            .setCancelButtonIconColor('#ffffff')
    }

    createTakeProfit = () => {
        let takeProfit = this.widgets!.activeChart().createOrderLine()
            .onCancel("onCancel called", () => {
                takeProfit.remove()
            })
            .onMove(() => {})
            .onModify(() => {})
            .setTooltip("TAKE PROFIT")
            .setPrice(+this.bars[798].close + 0.00040)
            .setModifyTooltip("Modify order")
            .setCancelTooltip("Cancel order")
            .setText("TAKE PROFIT")
            .setBodyBackgroundColor('#ffffff')
            .setBodyTextColor('#000000')
            .setBodyBorderColor('#008000')
            .setLineColor('#008000')
            .setQuantityBackgroundColor('#008000')
            .setQuantityBorderColor('#008000')
            .setQuantityTextColor('#ffffff')
            .setCancelButtonBackgroundColor('#008000')
            .setCancelButtonBorderColor('#008000')
            .setCancelButtonIconColor('#ffffff')
    }

    longPos = () => {
        this.widgets!.activeChart().createMultipointShape(
            [{time: this.bars[798].time / 1000}, {time: this.bars[798].time / 1000 + 60 * 30}],
            {
                shape: 'long_position',
                overrides: {
                    profitLevel: 20,
                    stopLevel: 20,
                },
            })
    }

    shortPos = () => {
        this.widgets!.activeChart().createMultipointShape(
            [{time: this.bars[798].time / 1000}, {time: this.bars[798].time / 1000 + 60 * 30}],
            {
                shape: 'short_position',
                overrides: {
                    profitLevel: 20,
                    stopLevel: 20,
                },
            })
    }

    drawALine = () => {
        this.widgets!.activeChart().createShape(
            {time: this.bars[798].time / 1000},
            {shape: 'vertical_line'}
        )
    }

    arrowUpButtonClick = () => {
        this.widgets!.activeChart().createShape(
            {time: this.bars[798].time / 1000 - 100 * 60, price: +this.bars[798].close},
            {
                shape: 'arrow_up'
            }
        )
    }

    arrowDownButtonClick = () => {
        this.widgets!.activeChart().createShape(
            {time: this.bars[798].time / 1000, price: +this.bars[798].close},
            {
                shape: 'arrow_down'
            }
        )
    }

    textButtonClick = () => {
        this.widgets!.activeChart().createShape(
            {time: this.bars[798].time / 1000, price: +this.bars[798].close},
            {
                //@ts-ignore
                shape: 'text',
                overrides: {
                    showLabel: true,
                },
                text: 'Sample Text'
            }
        )
    }

    

    saveFirstChart = () => {
        this.widgets?.save(savedData => {
            const textareaSave = document.getElementById("savedData")
            textareaSave!.innerHTML = JSON.stringify(savedData) 
        })
        
    }

    loadFirstChart = () => {
        this.widgets?.load(JSON.parse(document.getElementById("savedData")!.innerHTML))
    }

    saveSecondChart = () => {
        this.widgets?.save(savedData => {
            localStorage.setItem('chart-2-save-data', JSON.stringify(savedData))
        })
    }

    loadSecondChart = () => {
        this.widgets?.load(JSON.parse(localStorage.getItem('chart-2-save-data') as string))
    }

    getInfo = (shapeId: any) => {
        return console.log(this.widgets?.activeChart().getShapeById(shapeId).getProperties())
    }

    setProp = (shapeId: any, prop: any, value: any) => {
        console.log('Function get prop', shapeId, prop, value)
        this.widgets?.activeChart().getShapeById(shapeId).setProperties({
            [prop]: value
        })
    }

    public componentWillUnmount(): void {
        if (this.tvWidget !== null) {
            this.tvWidget.remove();
            this.tvWidget = null;
        }
        if (this.widgets !== null) {
            this.widgets.remove();
            this.widgets = null;
        }
    }

    playButtonClickHandler = () => {
        if (this.state.chartIsPlaying) {
            this.playChartState(this.widgetOptions)
        } else {
            this.playChartState(this.widgetPlayOptions)
        }
        this.setState({
            chartIsPlaying: !this.state.chartIsPlaying
        })
    }

    playChartState = (widgetOptions: any) => {
        widgetOptions.symbol = this.widgets?.symbolInterval().symbol as string
        widgetOptions.interval = this.widgets?.symbolInterval().interval as string
        this.tvWidget = null
        this.widgets = null
        this.tvWidget = new widget(widgetOptions)
        this.widgets = new widget(widgetOptions)
    }

    x2PlayAcceleration = () => {
        window['Acceleration'] = '2000'
        this.restartChart()
    }
    x5PlayAcceleration = () => {
        window['Acceleration'] = '400'
        this.restartChart()
    }
    x10PlayAcceleration = () => {
        window['Acceleration'] = '200'
        this.restartChart()
    }

    restartChart = () => {
        console.log(this.widgets)
        this.widgetOptions.symbol = this.widgets!.symbolInterval().symbol
        this.widgetOptions.interval = this.widgets!.symbolInterval().interval
        this.widgets = new widget(this.widgetOptions)
    }

    public render(): JSX.Element {
        
        return (
            <div className='chartContainer'>
                <div
                    id='tv_chart_container'
                    className='TVChartContainer'
                />
                <div className='button_box'>
                    <button onClick={this.playButtonClickHandler}>{this.state.chartIsPlaying ? 'Stop' : 'Play'}</button>
                    <button onClick={this.x2PlayAcceleration} className="button">2x</button>
                    <button onClick={this.x5PlayAcceleration} className="button">5x</button>
                    <button onClick={this.x10PlayAcceleration} className="button">10x</button>
                    <button onClick={this.longPos} className="button">Long Pos</button>
                    <button onClick={this.shortPos} className="button">Short Pos</button>
                    <button onClick={this.arrowUpButtonClick} className="button">Icon Up</button>
                    <button onClick={this.arrowDownButtonClick} className="button">Icon Down</button>
                    <button onClick={this.textButtonClick} className="button">Text</button>
                    <button onClick={this.drawALine} className="button">Line</button>
                    <button onClick={this.saveFirstChart} className="button">Save 1</button>
                    <button onClick={this.loadFirstChart} className="button">Load 1</button>
                    <button onClick={this.saveSecondChart} className="button">Save 2</button>
                    <button onClick={this.loadSecondChart} className="button">Load 2</button>
                    <button onClick={this.createTakeProfit} className="button">Take profit</button>
                    <button onClick={this.createStopLoss} className="button">Stop loss</button>
                    <textarea id="savedData" className="button">
                    {this.state.savedData}
                    </textarea>
                </div>
            </div>
        )
    }
}
