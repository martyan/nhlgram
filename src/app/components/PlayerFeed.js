import React from 'react'
import { useEffect, useState } from 'react'
import axios from 'axios'
import GameFeed from './GameFeed'
import { Parallax, Background } from 'react-parallax'
import { arrow } from './icons'
import { Router } from '../../functions/routes'
// import { getStats } from './TeamFeed'
// import { getRankText, getStatName } from '../helpers/stats'
import PlayerStats from './PlayerStats'
import { goToPlayerTeamFeed } from '../helpers/navigation'

const PlayerFeed = ({ player, playerId }) => {

    const [ feed, setFeed ] = useState([])
    const [ activeMedia, setActiveMedia ] = useState(null)

    useEffect(() => {
        axios.get(`https://statsapi.web.nhl.com/api/v1/people/${playerId}/stats?stats=gameLog&season=20192020`)
            .then(response => setFeed(response.data.stats[0].splits))
            .catch(console.error)
    }, [])

    const notLoaded = !player || String(player.id) !== String(playerId)

    // const isGoalie = player.primaryPosition.code === 'G'

    // const seasonStats = getStats('statsSingleSeason', player.stats)
    // const rankingStats = getStats('regularSeasonStatRankings', player.stats)

    // const rankKeys = Object.keys(rankingStats)
    // const ranks = rankKeys.map(key => {
    //     const [ string, n, sup ] = /(\d+)([A-Za-z]+)/g.exec(rankingStats[key])
    //     return {
    //         key,
    //         n: parseInt(n),
    //         sup
    //     }
    // })

    // const filteredRanks = ranks
    //     .filter(rank => isGoalie ? rank.n <= 10 : rank.n <= 30)
    //     .filter(rank => !(isGoalie && rank.key === 'penaltyMinutes'))

    // const goodRanks = filteredRanks.sort((a, b) => {
    //     if(a.n > b.n) return 1
    //     if(a.n < b.n) return -1
    //     return 0
    // })

    return (
        <div className="player-feed">
            {!notLoaded && (
                <>
                    <div className="cover">
                        <Parallax
                            bgImage={`https://nhl.bamcontent.com/images/actionshots/${playerId}.jpg`}
                            bgImageAlt={player.fullName}
                            strength={40}
                        >
                            <div style={{ height: '120px' }} />
                        </Parallax>

                        {player.rookie && <div className="rookie">Rookie</div>}

                        <div className="caption">
                            <span className="no">{player.primaryNumber}</span>
                            <h1 className="name">{player.fullName}</h1>
                            {(player.captain || player.alternateCaptain) && (
                                <span className="cpt">{player.captain ? 'C' : 'A'}</span>
                            )}
                        </div>

                        <div className="team-logo" onClick={() => goToPlayerTeamFeed(player.currentTeam.id)}>
                            <img src={`https://www-league.nhlstatic.com/nhl.com/builds/site-core/a2d98717aeb7d8dfe2694701e13bd3922887b1f2_1542226749/images/logos/team/current/team-${player.currentTeam.id}-dark.svg`} />
                        </div>

                        <div className="photo">
                            <img src={`https://nhl.bamcontent.com/images/headshots/current/168x168/${playerId}.jpg`} />
                        </div>

                        <button className="arrow" onClick={() => Router.pushRoute('/')}>
                            {arrow}
                        </button>
                    </div>


                    <div className="info">
                        <div className="position">{player.primaryPosition.name}</div>
                        <div className="nationality">{player.nationality}</div>
                        <div className="age">{player.currentAge}y</div>
                        <div className="height">{player.height}</div>
                        <div className="weight">{player.weight} lb</div>
                    </div>

                    <PlayerStats player={player} />

                    {/*<div className="ranks">
                        {goodRanks.map(rank => {
                            const value = seasonStats[getStatName(rank.key)]
                            return (
                                <div key={rank.key} className="rank">
                                    <div className="position">
                                        <span className="n">{rank.n}</span>
                                        <span className="sup">{rank.sup}</span>
                                    </div>
                                    <div className="name">{getRankText(rank.key)}</div>
                                    {typeof value !== 'undefined' && <div className="value">{value}</div>}
                                </div>
                            )
                        })}
                    </div>*/}
                </>
            )}

            {feed.map(game => (
                <div key={game.date} className="game">
                    <GameFeed
                        game={game}
                        player={player}
                        activeMedia={activeMedia}
                        setActiveMedia={setActiveMedia}
                    />
                </div>
            ))}
        </div>
    )

}

export default PlayerFeed
