var rawData = {
    "symbol": null,
    "base_currency": null,
    "date": null,
    "month_str": null,
    "month_int": null,
    "week": null,
    "average": null,
    "is_end_of_week": null,
    "is_end_of_month": null,
    "interest_rate": null,
    "interest_rate_change_percentage": null
}

// weekly data

var weeklyData = {
    "symbol": symbol,
    "base_currency": "USD",
    "date": date.unix(),
    "day_of_week": date.day(),
    "day_of_month": parseInt(date.format('DD')),
    "week": date.week(),
    "month_str": date.format('MMM'),
    "month_int": parseInt(date.format('MM')),
    "year": parseInt(date.format('YYYY')),
    "is_end_of_month": moment().endOf('month').format('DD') === date.format('DD') ? true : false,
    "interest_rate": f.InterbankRate,
    "inverse_interest_rate": f.InverseInterbankRate,
    "interest_rate_change_percentage": average
}

//monthly data
var monthlyData = {
    "symbol": symbol,
    "base_currency": "USD",
    "date": date.unix(),
    "month_str": date.format('MMM'),
    "month_int": parseInt(date.format('MM')),
    "year": parseInt(date.format('YYYY')),
    "interest_rate": f.InterbankRate,
    "inverse_interest_rate": f.InverseInterbankRate,
    "interest_rate_change_percentage": average
}