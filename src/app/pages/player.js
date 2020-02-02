import React, { useEffect, useState, useRef } from 'react'
import PropTypes from 'prop-types'
import Head from 'next/head'
import compose from 'recompose/compose'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import withAuthentication from '../lib/withAuthentication'
import PageWrapper from '../components/PageWrapper'
import PlayerFeed from '../components/PlayerFeed'
import { getPlayer, getPlayerSchedule, getTeams, setPlayerSkeletonVisible } from '../lib/app/actions'
import './index.scss'
import PlayerSkeleton from '../components/PlayerSkeleton'

const PlayerPage = ({
    playerId,
    player,
    teams,
    getPlayer,
    getTeams,
    getPlayerSchedule,
    playerSchedule,
    playerSkeletonVisible,
    setPlayerSkeletonVisible
}) => {

    useEffect(() => {
        getPlayerSchedule(playerId)
            .catch(console.error)

        if(teams.length === 0) {
            getTeams()
                .catch(console.error)
        }
    }, [])

    useEffect(() => {
        if(!player || player.id !== playerId) {
            getPlayer(playerId)
                .then(() => setPlayerSkeletonVisible(false))
                .catch(console.error)
        }
    }, [playerId])

    return (
        <PageWrapper>
            <Head>
                <meta name="description" content="Minimalistic serverless boilerplate based on NextJS and Firebase" />
                <meta name="keywords" content="nextjs, react, firebase, serverless, minimalistic, boilerplate, full-stack, authentication, todos" />
                <title>Todo list | Nextbase</title>
            </Head>

            <div className="nhl">

                <PlayerSkeleton playerSkeletonVisible={!player || playerSkeletonVisible} />

                <PlayerFeed
                    playerId={playerId}
                    player={player}
                    teams={teams}
                    playerSchedule={playerSchedule}
                />

            </div>
        </PageWrapper>
    )

}

PlayerPage.getInitialProps = async ({ store, query }) => {
    // await store.dispatch(getProduct(query.id))
    return {
        playerId: query.id
    }
}

PlayerPage.propTypes = {
}

const mapStateToProps = (state) => ({
    player: state.app.player,
    teams: state.app.teams,
    playerSkeletonVisible: state.app.playerSkeletonVisible,
    playerSchedule: state.app.playerSchedule
})

const mapDispatchToProps = (dispatch) => (
    bindActionCreators({
        getPlayer,
        getTeams,
        getPlayerSchedule,
        setPlayerSkeletonVisible
    }, dispatch)
)

export default compose(withAuthentication(false), connect(mapStateToProps, mapDispatchToProps))(PlayerPage)
