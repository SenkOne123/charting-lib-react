import {checkInterval, debug, getKlines, subscribeKline} from './helpers'

const configurationData = {
    supports_marks: false,
    supports_timescale_marks: false,
    supports_time: true,
    supported_resolutions: ['1', '5', '15', '60']
}

let symbols = [
    {
        name: 'EURUSD',
        symbol: "EURUSD",
        full_name: "EURUSD", // e.g. BTCE:BTCUSD
        description: "EUR / USD",
        exchange: "simplefx",
        ticker: "EURUSD",
        pricescale: 100000,
        minmov: 1,
        session: '24x7',
        type: "forex",
        timezone: 'UTC',
        has_intraday: true,
        has_daily: true,
        has_weekly_and_monthly: true,
        currency_code: 'USD'
    },
    {
        name: 'USDJPY',
        symbol: "USDJPY",
        full_name: "USDJPY", // e.g. BTCE:BTCUSD
        description: "USD / JPY",
        exchange: "simplefx",
        ticker: "USDJPY",
        session: '24x7',
        pricescale: 1000,
        minmov: 1,
        type: "forex",
        timezone: 'UTC',
        has_intraday: true,
        has_daily: true,
        has_weekly_and_monthly: true,
        currency_code: 'JPY'
    },
    {
        name: 'GBPUSD',
        symbol: "GBPUSD",
        full_name: "GBPUSD", // e.g. BTCE:BTCUSD
        description: "USD / GBP",
        exchange: "simplefx",
        ticker: "GBPUSD",
        session: '24x7',
        pricescale: 100000,
        minmov: 1,
        type: "forex",
        timezone: 'UTC',
        has_intraday: true,
        has_daily: true,
        has_weekly_and_monthly: true,
        currency_code: 'GBP'
    }
];

let toDraw = true
let previousInterval = ''
let previousSymbol = ''
let realTimeCandles = []

export default {
    onReady: (callback) => {
        console.log('[onReady]: Method call');
        setTimeout(() => callback(configurationData)) // callback must be called asynchronously.
    },

    searchSymbols: (userInput, exchange, symbolType, onResultReadyCallback) => {
        onResultReadyCallback(symbols)
    },

    resolveSymbol: (symbolName, onSymbolResolvedCallback, onResolveErrorCallback) => {
        console.log('[resolveSymbol]: Method call', symbolName);

        const comps = symbolName.split(':')
        symbolName = (comps.length > 1 ? comps[1] : symbolName).toUpperCase()

        const symbol = symbols.find(i => i.symbol === symbolName)
        return symbol ? setTimeout(() => onSymbolResolvedCallback(symbol), 0) : onResolveErrorCallback('[resolveSymbol]: symbol not found')
    },


    // get historical data for the symbol
    getBars: async (symbolInfo, interval, periodParams, onHistoryCallback, onErrorCallback) => {
        console.log('[getBars] Method call', symbolInfo, interval)

        if (!checkInterval(interval)) {
            return onErrorCallback('[getBars] Invalid interval')
        }

        let klines = await getKlines({
            symbol: symbolInfo.name, interval, from: new Date(0), to: Date.now(), limit: 1000
        })

        realTimeCandles = klines.slice(800, klines.length)
        const historicCandles = klines.slice(0, 799)

        if (klines.length > 0) {
            onHistoryCallback(historicCandles)
        }

        onErrorCallback('Klines data error')

    },
    // subscription to real-time updates
    subscribeBars: (symbolInfo, interval, onRealtimeCallback, subscribeUID, onResetCacheNeededCallback) => {
        console.log('[subscribeBars]: Method call with subscribeUID:', subscribeUID);
        for (let i = 0; i < realTimeCandles.length; i++) {
            setTimeout(function timer() {
                onRealtimeCallback(realTimeCandles[i])
            }, i * 1000)
        }
        subscribeKline({symbol: symbolInfo.name, interval, uniqueID: subscribeUID,}, cb => {
        })
    },
    unsubscribeBars: (subscriberUID) => {
        console.log('[unsubscribeBars]: Method call with subscriberUID:', subscriberUID);
    },
    getServerTime: (callback) => {
        callback(Math.floor(new Date() / 1000))
    }
};
