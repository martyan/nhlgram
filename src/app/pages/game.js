import React, { useEffect } from 'react'
import Head from 'next/head'
import compose from 'recompose/compose'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import withAuthentication from '../lib/withAuthentication'
import PageWrapper from '../components/PageWrapper'
// import PlayerFeed from '../components/PlayerFeed'
import { getGameContent, getGame, getTeams, setActiveMedia } from '../lib/app/actions'
import PlayerSkeleton from '../components/PlayerSkeleton'
import { getGameIdFromLink } from '../helpers/data'
import BackBtn from '../components/BackBtn'
import Game from '../components/Game'
import './index.scss'

const GamePage = ({ gameId, game, teams, gameContent, getGame, getGameContent, getTeams, activeMedia, setActiveMedia }) => {

    // useEffect(() => {
    //     if(!player || playerId !== player.id) {
    //         Promise
    //             .all([
    //                 getPlayer(playerId),
    //                 getPlayerSchedule(playerId)
    //             ])
    //             .then((player) => {
    //                 setPlayerSkeletonVisible(false)
    //                 getTeamSchedule(player[0].people[0].currentTeam.id)
    //             }).catch(console.error)
    //     }
    // }, [playerId])

    const content = gameContent.find(game => getGameIdFromLink(game.link) === gameId)

    useEffect(() => {
        getGame(gameId)
            .catch(console.error)

        if(teams.length === 0) {
            getTeams()
                .catch(console.error)
        }

        if(!content) {
            getGameContent(gameId)
                .catch(console.error)
        }
    }, [])

    if(!game) return null

    const getWords = (game) => game.team.name.split(' ')
    const getFirstLine = (words) => words.slice(0, words.length === 3 ? 2 : 1).join(' ')
    const getSecondLine = (words) => words.slice(words.length === 3 ? 2 : 1).join(' ')
    const isOT = game.currentPeriodOrdinal === 'OT' || game.currentPeriodOrdinal === 'SO'

    return (
        <PageWrapper>
            <Head>
                <meta name="description" content="Minimalistic serverless boilerplate based on NextJS and Firebase" />
                <meta name="keywords" content="nextjs, react, firebase, serverless, minimalistic, boilerplate, full-stack, authentication, todos" />
                <title>Todo list | Nextbase</title>
            </Head>

            <div className="nhl">

                <div className="game-feed">

                    <BackBtn />

                    <div className="match">
                        <div className="team">
                            <div className="logo">
                                <img src={`https://www-league.nhlstatic.com/nhl.com/builds/site-core/a2d98717aeb7d8dfe2694701e13bd3922887b1f2_1542226749/images/logos/team/current/team-${game.teams.home.team.id}-dark.svg`} />
                            </div>
                            <div className="name">
                                <div className="first">{getFirstLine(getWords(game.teams.home))}</div>
                                <div className="second">{getSecondLine(getWords(game.teams.home))}</div>
                            </div>
                        </div>
                        <div className="score">
                            <span>{game.teams.home.goals}</span>
                            <span className="colon">:</span>
                            <span>{game.teams.away.goals}</span>
                        </div>
                        {isOT && <div className="ot">{game.currentPeriodOrdinal}</div>}
                        <div className="team away">
                            <div className="logo">
                                <img src={`https://www-league.nhlstatic.com/nhl.com/builds/site-core/a2d98717aeb7d8dfe2694701e13bd3922887b1f2_1542226749/images/logos/team/current/team-${game.teams.away.team.id}-dark.svg`} />
                            </div>
                            <div className="name">
                                <div className="first">{getFirstLine(getWords(game.teams.away))}</div>
                                <div className="second">{getSecondLine(getWords(game.teams.away))}</div>
                            </div>
                        </div>
                    </div>

                    <Game
                        game={game}
                        gameContent={gameContent.find(content => getGameIdFromLink(content.link) === gameId)}
                        teams={teams}
                        activeMedia={activeMedia}
                        setActiveMedia={setActiveMedia}
                    />

                </div>

            </div>
        </PageWrapper>
    )

}

GamePage.getInitialProps = async ({ store, query }) => {
    // await store.dispatch(getProduct(query.id))
    return {
        gameId: query.id
    }
}

GamePage.propTypes = {
}

const mapStateToProps = (state) => ({
    game: state.app.game,
    gameContent: state.app.gameContent,
    teams: state.app.teams,
    activeMedia: state.app.activeMedia
})

const mapDispatchToProps = (dispatch) => (
    bindActionCreators({
        getGame,
        getGameContent,
        getTeams,
        setActiveMedia
    }, dispatch)
)

export default compose(withAuthentication(false), connect(mapStateToProps, mapDispatchToProps))(GamePage)
