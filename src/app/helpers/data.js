import moment from 'moment'

export const getPlayersFromTeams = (teams) => {
    return teams.reduce((acc, currVal) => {
        const roster = currVal.roster.roster.map(roster => ({...roster, teamId: currVal.id}))
        return [...acc, ...roster]
    }, [])
}

export const isGoalie = (player) => player.primaryPosition.code === 'G'

export const getPlayersMedia = (player, media) => media.filter(m => m.description.indexOf(player.lastName) > -1)

export const getDateWZero = (d) => (d < 10 ? '0' : '') + d

export const getDateText = (d) => {
    const now = moment()
    const today = moment.utc(`${now.get('year')}-${getDateWZero(now.get('month') + 1)}-${getDateWZero(now.get('date'))}`)
    const diff = today.diff(d, 'days')

    if(diff === 0) return 'Today'
    if(diff === 1) return 'Yesterday'
    if(moment(d).isSame(today, 'week')) return `on ${d.format('dddd')}`
    else {
        if(diff < 4) return `${diff} days ago`
        if(now.get('year') > d.get('year')) return d.format('D MMM YYYY')
        return d.format('D MMM')
    }
}