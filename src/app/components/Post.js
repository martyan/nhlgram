import React, { useEffect } from 'react'
import { useInView } from 'react-intersection-observer'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import { useDebounce } from 'use-debounce'
import moment from 'moment'
import { getDateText } from '../helpers/data'

const Video = ({ media }) => {
    const LQ = media.playbacks.find(pb => pb.name.indexOf('FLASH_450K') > -1)
    const HQ = media.playbacks.find(pb => pb.name.indexOf('FLASH_1800K') > -1)
    if(!LQ || !HQ) return null

    return <iframe key={LQ.url} src={LQ.url} frameBorder="0"></iframe>
}

const Thumb = ({ media, activeMedia, setActiveMedia }) => {
    const thumb = media.image.cuts['640x360']
    if(!thumb) return null

    return (
        <LazyLoadImage
            // alt={image.alt}
            width={'100vw'}
            // height={360}
            src={thumb.src} // use normal <img> attributes as props
            onClick={() => setActiveMedia(media.id)}
            className={activeMedia === media.id ? 'hidden' : ''}
        />
    )
}

const Post = ({ game, media, activeMedia, setActiveMedia }) => {

    const [ debouncedActiveMedia ] = useDebounce(activeMedia, 1000)
    const [ ref, inView, entry ] = useInView({
        threshold: 1,
        rootMargin: '-25% 0% -25%',
    })

    const gameDate = moment.utc(game.date)

    useEffect(() => {
        if(inView) setActiveMedia(media.id)
    }, [inView])

    return (
        <div className="post">
            <div className="media" ref={ref}>
                <span className={media.id === activeMedia ? 'play is-playing' : 'play'}>
                    <i className="fa fa-play"></i>
                </span>

                {media.id === debouncedActiveMedia && <Video media={media} />}

                <Thumb
                    media={media}
                    activeMedia={debouncedActiveMedia}
                    setActiveMedia={setActiveMedia}
                />
            </div>
            <div className="caption" dangerouslySetInnerHTML={{__html: media.description}}></div>
            <div className="foot">
                <div className={game.isHome ? 'teams' : 'teams away'}>
                    <img src={`https://www-league.nhlstatic.com/nhl.com/builds/site-core/a2d98717aeb7d8dfe2694701e13bd3922887b1f2_1542226749/images/logos/team/current/team-${game.team.id}-dark.svg`} alt={game.team.name} />
                    <img src={`https://www-league.nhlstatic.com/nhl.com/builds/site-core/a2d98717aeb7d8dfe2694701e13bd3922887b1f2_1542226749/images/logos/team/current/team-${game.opponent.id}-dark.svg`} alt={game.opponent.name} />
                </div>
                <div className="date">{getDateText(gameDate)}</div>
            </div>

            {/*<div className="stats">*/}
            {/*/!*<span>G{game.stat.goals} A{game.stat.assists}</span>*!/*/}
            {/*<span className="date">{moment(game.date).format('ddd MMM DD')}</span>*/}
            {/*</div>*/}
            {/*{(game.stat.goals > 0 || game.stat.assists > 0) && (*/}
        </div>
    )

}

export default Post