import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import {connect} from 'react-redux';
import ReactPlayer from 'react-player';
import screenfull from 'screenfull';
import Duration from './Duration';
import * as actions from '../../actions/actions';
import shuffle from './shuffleQueue'
import FaPlay from 'react-icons/lib/fa/play';
import FaStepForward from 'react-icons/lib/fa/step-forward';
import FaStepBackward from 'react-icons/lib/fa/step-backward';
import FaStop from 'react-icons/lib/fa/stop';
import TiArrowShuffle from 'react-icons/lib/ti/arrow-shuffle';
import FaPause from 'react-icons/lib/fa/pause';


class MusicPlayer extends Component {
	
	state = {
		playing: false,
		shuffle: false,
		volume: 0.8,
		played: 0,
		loaded: 0,
		duration: 0,
		currentPlayingIndexInQueue: 0,
		continueAll: false
	}
	
	playPause = () => {
		this.setState({ playing: !this.state.playing })
	}
	next = () => {
		if(this.props.shuffledQueue) {
			if(this.props.shuffledQueue.length - 1 <= this.state.currentPlayingIndexInQueue) {
				this.setState({ currentPlayingIndexInQueue: -1 })
				return this.setState({ playing: true })
			}
			this.setState({ currentPlayingIndexInQueue: ++this.state.currentPlayingIndexInQueue})
			return this.props.dispatch(actions.currentListeningUrl(this.props.shuffledQueue[this.state.currentPlayingIndexInQueue].link));
		} else {
			if(this.props.queue.length - 1 <= this.state.currentPlayingIndexInQueue) {
				this.setState({ currentPlayingIndexInQueue: -1 })
				return this.setState({ playing: true })
			}
						this.props.dispatch(actions.currentListeningUrl(null));
			this.setState({ currentPlayingIndexInQueue: ++this.state.currentPlayingIndexInQueue })
			return this.props.dispatch(actions.currentListeningUrl(this.props.queue[this.state.currentPlayingIndexInQueue].link));
		}
	}
	prev = () => {
		if(this.props.shuffledQueue) {
			if(this.state.currentPlayingIndexInQueue <= 0) {
				this.setState({ currentPlayingIndexInQueue: this.props.shuffledQueue.length - 1 })
				return this.setState({ playing: true })
			}
			this.setState({ currentPlayingIndexInQueue: this.state.currentPlayingIndexInQueue - 1 })
			return this.props.dispatch(actions.currentListeningUrl(this.props.shuffledQueue[this.state.currentPlayingIndexInQueue].link));
		} else {
			if(this.state.currentPlayingIndexInQueue <= 0) {
				this.setState({ currentPlayingIndexInQueue: this.props.queue.length - 1 })
				return this.setState({ playing: true })
			}
			this.setState({ currentPlayingIndexInQueue: this.state.currentPlayingIndexInQueue - 1 })
			return this.props.dispatch(actions.currentListeningUrl(this.props.queue[this.state.currentPlayingIndexInQueue].link));
		}
	}
	shuffle = () => {
		if(this.state.shuffle) {
			this.setState({ shuffle: false })
			return this.props.dispatch(actions.shuffledQueue(null));
		}
		this.setState({ shuffle: true })
		let shuffledQueue = this.props.queue.map((track, index) => {
			return track;
		})
		return this.props.dispatch(actions.shuffledQueue(shuffle(shuffledQueue)))
	}
	continueButton = () => {
		if(this.state.continueAll) {
			return this.setState({ continueAll: false })
	}
	this.setState({ continueAll: true })
	return this.continuePlay()
	}
	continuePlay = () => {
		if(this.state.continueAll && this.props.queue.length - 1 <= this.state.currentPlayingIndexInQueue) {
			this.setState({ currentPlayingIndexInQueue: -1 })
			this.setState({ playing: true })
			return this.next()
		} else if (this.state.continueAll && this.props.shuffleQueue) {
			if (this.props.shuffledQueue.length - 1 <= this.state.currentPlayingIndexInQueue) {
				this.setState({ currentPlayingIndexInQueue: -1 })
				this.setState({ playing: true })
				return this.next()
			}
		}
		if(this.state.continueAll) {
			this.setState({ playing: true })
			return this.next()
		}
	}
	setVolume = e => {
		this.setState({ volume: parseFloat(e.target.value) })
	}
	onSeekMouseDown = e => {
		this.setState({ seeking: true })
	}
	onSeekChange = e => {
		this.setState({ played: parseFloat(e.target.value) })
	}
	onSeekMouseUp = e => {
		this.setState({ seeking: false })
		this.player.seekTo(parseFloat(e.target.value))
	}
	onProgress = state => {
		if (!this.state.seeking) {
		this.setState(state)
		}
	}
	onClickFullscreen = () => {
		screenfull.request(findDOMNode(this.player));
	}


	render() {
		const {
	      playing, volume,
	      played, duration,
	    } = this.state
	    
		return (
	    	<div>
	    		<div id="video-pic-viewer">
		    		<ReactPlayer 
		    			ref={player => { this.player = player }}
	            		className='react-player'
	            		width={screenfull.isFullscreen ? window.screen.availWidth : 179}
		            	height={screenfull.isFullscreen ? window.screen.availHeight : 114}
		    			url={this.props.url} 
		    			playing={playing}
	            		volume={volume}
	            		onPlay={() => this.setState({ playing: true })}
	            		onPause={() => this.setState({ playing: false })}
	            		onEnded={() => this.continuePlay()}
	            		onError={e => console.log('onError', e)}
	            		onProgress={this.onProgress}
	            		onDuration={duration => this.setState({ duration })}
		    		/>
		    	</div>
		    	<div id="video-controller-1">
	                <button onClick={this.onClickFullscreen}>Fullscreen</button>
	            </div>
	            <div id="video-controller-2">
	            	<button onClick={this.prev} className="player-buttons"><FaStepBackward size={22} /></button>
	            	<button onClick={this.playPause} className="player-buttons">{playing ? <FaPause size={22}/> : <FaPlay size={22}/>}</button>
		    		<button onClick={this.next} className="player-buttons"><FaStepForward size={22} /></button>
		    		<button onClick={this.shuffle} className="player-buttons">{this.state.shuffle ? 'Shuffle Off' : <TiArrowShuffle size={25}/>}</button>
		    		<button onClick={this.continueButton} className="player-buttons">{this.state.continueAll ? 'Continuous Play Off' : 'Continuous Play On'}</button>
	            </div>
	            <div id="video-seek">
	            <span id="seek">Seek</span>
	            	<input
	                  type="range" min={0} max={1} step='any'
	                  value={played}
	                  onMouseDown={this.onSeekMouseDown}
	                  onChange={this.onSeekChange}
	                  onMouseUp={this.onSeekMouseUp}
                	/>
                	<Duration seconds={duration * played} /> / <Duration seconds={duration} />
                </div>
                <div id="video-volume">
                <span id="volume">Volume</span>
                	<input type='range' min={0} max={1} step='any' value={volume} onChange={this.setVolume} />
            	</div>
            	</div>


	    );
	}
}

export default connect(
  ({ queue, shuffledQueue }) => 
  ({ queue, shuffledQueue })
)(MusicPlayer);