import React from 'react'
import { sortPlayersByPoints } from '../helpers/sort'
import { Router } from '../../functions/routes'
import { getStats } from '../helpers/data'
import { goToPlayerFeed } from '../helpers/navigation'
import './Roster.scss'

export const Player = ({ player }) => {

    const stats = getStats('statsSingleSeason', player.person.stats)

    return (
        <li className="player-list-item" onClick={() => goToPlayerFeed(player.person.id)}>
            <div className="avatar">
                <img className="photo" src={`https://nhl.bamcontent.com/images/headshots/current/168x168/${player.person.id}.jpg`} />
                {player.teamId && <img className="badge" src={`https://www-league.nhlstatic.com/nhl.com/builds/site-core/a2d98717aeb7d8dfe2694701e13bd3922887b1f2_1542226749/images/logos/team/current/team-${player.teamId}-dark.svg`} />}
                <span className="number">{player.jerseyNumber}</span>
                {(player.person.captain || player.person.alternateCaptain) && (
                    <span className="cpt">{player.person.captain ? 'C' : 'A'}</span>
                )}
            </div>
            <div className="info">
                <div className="top">
                    <span className="name">{player.person.fullName}</span>
                    {stats && (
                        <div className="stats">
                            {stats.hasOwnProperty('points') ? (
                                <>
                                    <div className="points">{stats.points} <span className="unit">pts</span></div>
                                    <div className="separate"><span className="unit">G</span>{stats.goals} <span className="unit">A</span>{stats.assists}</div>
                                </>
                            ) : (
                                <>
                                    <div className="pctg">{stats.savePercentage.toString().substring(1)}</div>
                                    <div className="gp">{stats.games}<span className="unit">GP</span></div>
                                </>
                            )}
                        </div>
                    )}
                </div>
                <div className="position">{player.position.name}</div>
            </div>
        </li>
    )

}

const Roster = ({ roster, onClick }) => {

    if(!roster) return null

    const sorted = sortPlayersByPoints(roster)
    console.log(sorted)

    return (
        <div className="roster">
            <ul>
                {sorted.map(player => <Player key={player.person.id} player={player} onClick={onClick}/>)}
            </ul>
        </div>
    )

}

export default Roster
