import React, { Component } from 'react';
import '../../../App.css';
// import {Link} from 'react-router';
import * as actions from '../../actions/actions';
import {connect} from 'react-redux';
import SongSearch from './SongSearch';
import AddPlaylist from '../AddPlaylist/AddPlaylist';

class SongSearchPage extends Component {
  render() {
    return (
      <div className="musicPlayer">
        <div className="musicPlayer-container">
          <SongSearch />
          <AddPlaylist currentUser={this.props.currentUser} userSavedPlaylists={this.props.userSavedPlaylists}/>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    currentUser: state.currentUser,
    userSavedPlaylists: state.userSavedPlaylists
  }
}

export default connect(mapStateToProps)(SongSearchPage);