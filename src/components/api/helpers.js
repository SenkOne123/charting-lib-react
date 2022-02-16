import axios from 'axios'


export function debug(val) {
    console.log(val);
}

const intervals = {
    '1': '1m',
    '3': '3m',
    '5': '5m',
    '15': '15m',
    '30': '30m',
    '60': '1h',
    '120': '2h',
    '240': '4h',
    '360': '6h',
    '480': '8h',
    '720': '12h',
    'D': '1d',
    '1D': '1d',
    '3D': '3d',
    'W': '1w',
    '1W': '1w',
    'M': '1M',
    '1M': '1M',
}
let klines = []

function getInterval(value) {
    return Object.keys(intervals).find(key => intervals[key] === value);
}

function CSVToJSON(csvString) {
    const csv = require('csvtojson')
    return csv({
        output: "json"
    })
        .fromString(csvString)
        .then((json) => {
            klines = json
            return klines
        })
}

function getRandomVolume(min, max) {
    return Math.random() * (max - min) + min;
}

export const getKlines = ({symbol, interval, from, to, limit}) => {
    interval = intervals[interval] // set interval

    from *= 1000
    to *= 1000

    console.log('[getKlines(candles)]: Method | ' + `http://mt1.xstm.work/${symbol}${getInterval(interval)}.csv`)

    return request(`http://mt1.xstm.work/${symbol}${getInterval(interval)}.csv`)
        .then(async res => {
            await CSVToJSON(res)
            //console.log('Received first candles: ', klines[0], klines[1], klines[2], 'Total: ', klines.length)
            return klines.map(i => ({
                time: i.t * 1000,
                open: i.o,
                high: i.h,
                low: i.l,
                close: i.c,
                volume: getRandomVolume(-5,5)
            }))
        })

}

export const subscribeKline = ({symbol, interval, uniqueID}, callback) => {
    interval = intervals[interval] // set interval
    // return api.stream.kline({ symbol, interval, uniqueID }, res => {
    // 	const candle = formatingKline(res.kline)
    // 	callback(candle)
    // })
}

// export const unsubscribeKline = (uniqueID) => {
// 	return api.stream.close.kline({ uniqueID })
// }

export const checkInterval = (interval) => !!intervals[interval]

// helpers ------------------------

function formatingKline({openTime, open, high, low, close, volume}) {
    return {
        time: openTime,
        open,
        high,
        low,
        close,
        volume,
    }
}

export function request(url, params = {}) {
    return axios({
        baseURL: url,
        method: 'get',
    })
        .then(res => res.data)
        .catch(res => console.log(res))
}

function candle(i) {
    return {
        o: parseFloat(i[1]),
        h: parseFloat(i[2]),
        l: parseFloat(i[3]),
        c: parseFloat(i[4]),
        v: parseFloat(i[5]),
        ts: i[0],
        price: parseFloat(i[4]),
        openTime: i[0],
        closeTime: i[6],
        trades: i[8]
    }
}