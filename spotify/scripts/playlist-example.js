require([
  '$api/models',
  '$api/facebook',
  '$api/library',
  '$views/list#List'
], function(models, facebook, library, List) {
  'use strict';

  var fetchTracksFromPlaylists = function(playlist, fn) {
    playlist.snapshot()
    .done(function(snapshot) {
      var tempuris = snapshot._uris;
      snapshot._uris = [];
      for (var i = 0; i < tempuris.length; i++) {
        if(tempuris[i]) { snapshot._uris.push(tempuris[i]) }
      };

      snapshot.loadAll('tracks').done(function(a) {
        var promises = a.map(function(entry) { return entry.tracks.snapshot(); });
        var snaps = [];
        models.Promise.join(promises)
          .each(function(k) {
            snaps = snaps.concat(k._uris);
          })
          .done(function(k) {
            fn(snaps);
          });
      });
    });
  }

  var fetchCurrentTracks = function(fn) {
    var currentUserPlaylist = library.Library.forCurrentUser().playlists;
    fetchTracksFromPlaylists( currentUserPlaylist, fn);
  };

  var fetchSpotifyFBFriends = function(fn) {
    var session = new facebook.FacebookSession();
    session.friends.snapshot().done(function( data ) {

      var promises = data._uris.map(function(uid) {
        return facebook.FacebookUser.fromId(uid).load('user','name');
      });
      var spotFriends = [];

      models.Promise.join(promises)
        .each(function(k) {
          if(k.user){ spotFriends.push(library.Library.forUser(k.user)); }
        })
        .always(function(k) {
          fn(spotFriends);
        });
    });
  };

  var fetchAllFriendsTracks = function(fn) {
    fetchSpotifyFBFriends(function(spotFriends) {

      spotFriends.forEach(function(a) {
        var pl = models.Playlist.fromURI(a.starred);
        pl.load('tracks').done(function(trackList) {
            trackList.tracks.snapshot().done(function(snapshot) {
              if(snapshot.length) { fn(snapshot._uris, a); }
            });
        });
      });
    });
  }

  var doPlaylistForAlbum = function() {

    fetchCurrentTracks(function(snaps) {
      var counts = [];
      fetchAllFriendsTracks(function(friendSongs, friend) {

        var count = 0;
        friendSongs.forEach(function(song) {
          if(snaps.indexOf(song) > -1) {
            count++;
          }
        });
        counts.push({ name: friend.owner.name, count: count });

        console.log(counts.sort(function(a,b) {
          return b.count-a.count;
        }));
      });
    });


    var album = models.Album.fromURI('spotify:album:5rCCCernTo6IwFwEZM4H53');
    var list = List.forAlbum(album);
    document.getElementById('playlistContainer').appendChild(list.node);
    list.init();
  };

  exports.doPlaylistForAlbum = doPlaylistForAlbum;
});
